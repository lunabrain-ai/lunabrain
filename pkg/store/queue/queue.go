package queue

import (
	"database/sql"
	_ "github.com/mattn/go-sqlite3"
	"sync"
	"time"
)

const batchSize = 100

var (
	submitFunc SubmitFunc

	db         *sql.DB
	stmtAdd    *sql.Stmt
	stmtSelect *sql.Stmt
	stmtDelete *sql.Stmt

	queue    = make(chan *Entry, 100) // enqueued entries for the local database
	cond     = sync.Cond{L: &sync.Mutex{}}
	enqueued uint

	wg      sync.WaitGroup // for Close()
	stopped bool
)

// Function that submits local entries to the remote journal
// The local entries are deleted if the function returns true
type SubmitFunc func([]Entry) bool

type Entry struct {
	Id   int64
	Data []byte
}

func Start(dbpath string, f SubmitFunc) (err error) {
	if db != nil {
		panic("journal already started")
	}

	db, err = sql.Open("sqlite3", dbpath)
	if err != nil {
		panic("fehler")
		return err
	}

	submitFunc = f

	// Create table if not exists
	_, err = db.Exec(`
  CREATE TABLE IF NOT EXISTS entries(
    Id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    Data BLOB NOT NULL
  )`)
	if err != nil {
		db.Close()
		db = nil
		panic(err)
		return err
	}

	// CREATE statement
	stmtAdd = prepareStmt(`INSERT INTO entries (Data) VALUES(?)`)

	// SELECT statement
	stmtSelect = prepareStmt(`SELECT Id, Data FROM entries ORDER BY Id LIMIT ?`)

	// DELETE statement
	stmtDelete = prepareStmt(`DELETE FROM entries WHERE id <= ?`)

	// Start go routine that stores entries in the local journal
	wg.Add(1)
	go func() {
		for entry := range queue {
			entry.store()
		}
		wg.Done()
	}()

	// count stored entries
	row := db.QueryRow("SELECT COUNT(*) from entries")
	panicOnErr(row.Scan(&enqueued))

	// start worker
	go submitWorker()

	return nil
}

func Stop() {
	// stop submit worker
	stopped = true
	cond.Signal()

	// stop accepting new entries
	close(queue)
	wg.Wait()

	// Remove database objects
	stmtAdd.Close()
	stmtSelect.Close()
	stmtDelete.Close()
	db.Close()
}

// Enqueues an entry
func Add(data []byte) {
	queue <- &Entry{Data: data}
}

func submitWorker() {
	for {
		// Wait for entries or stop
		cond.L.Lock()
		if enqueued == 0 && !stopped {
			cond.Wait()
		}
		cond.L.Unlock()

		if stopped {
			break
		}

		submitEntries()
	}
}

func submitEntries() {
	rows, err := stmtSelect.Query(batchSize)
	panicOnErr(err)
	defer rows.Close()

	entries := make([]Entry, 0, batchSize)

	for rows.Next() {
		entry := Entry{}
		err := rows.Scan(&entry.Id, &entry.Data)
		if err != nil {
			panic(err)
		}
		entries = append(entries, entry)
	}

	if len(entries) == 0 {
		return
	}

	if !submitFunc(entries) {
		time.Sleep(time.Second * 5)
		return
	}

	// remove submitted items
	_, err = stmtDelete.Exec(entries[len(entries)-1].Id)
	panicOnErr(err)

	// update counter
	cond.L.Lock()
	enqueued -= uint(len(entries))
	cond.L.Unlock()
}

// Stores an entry in the local database
func (entry *Entry) store() {
	_, err := stmtAdd.Exec(entry.Data)
	panicOnErr(err)

	// notify worker
	cond.L.Lock()
	enqueued++
	cond.L.Unlock()
	cond.Signal()
}

func panicOnErr(err error) {
	if err != nil {
		panic(err)
	}
}

func prepareStmt(sql string) *sql.Stmt {
	stmt, err := db.Prepare(sql)
	panicOnErr(err)
	return stmt
}
