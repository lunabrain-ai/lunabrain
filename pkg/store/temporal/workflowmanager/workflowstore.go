package workflowmanager

import (
	"database/sql"
	"encoding/json"
	"io/ioutil"
	"log"
	"os"

	_ "github.com/lib/pq"
	_ "github.com/mattn/go-sqlite3"
	"github.com/refinery-labs/refinery/golang/pkg/dsl"
)

type WorkflowStore interface {
	SaveDeploymentWorkflows(deploymentID string, workflows map[string]dsl.Workflow) (err error)
	SaveWorkflowRun(workflowID, runID string)
	GetDSLForDeploymentWorkflow(deploymentID, workflowID string) (dsl string, err error)
	GetWorkflowRunsForDeployment(deploymentID string) (workflowRuns []WorkflowRunModel, err error)
	DeleteDeploymentWorkflows(deploymentID string) (err error)
}

type DatabaseWorkflowStore struct {
	db *sql.DB
}

type WorkflowRunModel struct {
	WorkflowID string
	RunID      string
}

func NewSqliteWorkflowStore(filename string) WorkflowStore {
	shouldSetupDB := false
	if _, err := os.Stat(filename); os.IsNotExist(err) {
		shouldSetupDB = true
	}

	db, err := sql.Open("sqlite3", filename)
	if err != nil {
		log.Fatal(err)
	}

	/*
		CREATE DATABASE workflow_store;

		CREATE TABLE workflows(
			id TEXT NOT NULL UNIQUE,
			deployment_id TEXT NOT NULL,
			dsl TEXT NOT NULL,
			PRIMARY KEY (id, deployment_id)
		);

		CREATE TABLE workflow_runs(
			id TEXT NOT NULL,
			workflow_id TEXT NOT NULL,
			PRIMARY KEY (id, workflow_id),
			FOREIGN KEY (workflow_id) REFERENCES workflows(id)
		);
	*/

	if shouldSetupDB {
		data, err := ioutil.ReadFile("fixtures/sql/schema-v0.sql")
		if err != nil {
			log.Fatal("File reading error", err)
		}

		_, err = db.Exec(string(data))
		if err != nil {
			log.Fatal("SQL setup ", err)
		}
	}

	return &DatabaseWorkflowStore{
		db: db,
	}
}
func NewPostgresqlWorkflowStore(databaseURI string) WorkflowStore {
	db, err := sql.Open("postgres", databaseURI)
	if err != nil {
		log.Fatal("Connecting to postgresql database", err)
	}

	return &DatabaseWorkflowStore{
		db: db,
	}
}

func (s DatabaseWorkflowStore) executePreparedQuery(query string, args ...interface{}) (result sql.Result, err error) {
	stmt, err := s.db.Prepare(query)
	if err != nil {
		return
	}
	defer stmt.Close()

	result, err = stmt.Exec(args...)
	return
}

func (s DatabaseWorkflowStore) SaveDeploymentWorkflows(deploymentID string, workflows map[string]dsl.Workflow) (err error) {
	tx, err := s.db.Begin()
	if err != nil {
		return
	}

	var stmt *sql.Stmt
	if stmt, err = tx.Prepare("INSERT INTO workflows(id, deployment_id, dsl) VALUES ($1, $2, $3) ON DUPLICATE UPDATE workflows SET dsl=? WHERE id=? AND deployment_id=?"); err != nil {
		return
	}
	defer stmt.Close()

	for workflowID, workflowDSL := range workflows {
		var serializedDSL []byte
		serializedDSL, err = json.Marshal(workflowDSL)
		if err != nil {
			return
		}

		dsl := string(serializedDSL)

		if _, err = stmt.Exec(workflowID, deploymentID, dsl, dsl, workflowID, deploymentID); err != nil {
			return
		}
	}
	tx.Commit()

	return
}

func (s DatabaseWorkflowStore) SaveWorkflowRun(workflowID, runID string) {
	s.executePreparedQuery("INSERT INTO workflow_runs(id, workflow_id) VALUES(?, ?)", workflowID, runID)
}

func (s DatabaseWorkflowStore) runQuery(query string, args ...interface{}) (rows *sql.Rows, err error) {
	var stmt *sql.Stmt
	if stmt, err = s.db.Prepare(query); err != nil {
		return
	}
	defer stmt.Close()

	rows, err = stmt.Query(args...)
	return
}

func (s DatabaseWorkflowStore) GetDSLForDeploymentWorkflow(deploymentID, workflowID string) (dsl string, err error) {
	var rows *sql.Rows
	if rows, err = s.runQuery("SELECT dsl FROM workflows WHERE deployment_id = $1 AND id = $2", deploymentID, workflowID); err != nil {
		return
	}
	defer rows.Close()

	if !rows.Next() {
		return
	}

	err = rows.Scan(&dsl)
	if err != nil {
		return
	}
	return
}

func (s DatabaseWorkflowStore) GetWorkflowRunsForDeployment(deploymentID string) (workflowRuns []WorkflowRunModel, err error) {
	query := `
	SELECT workflows.id, workflow_runs.id
	FROM workflow_runs
	JOIN workflows
		ON workflows.id = workflow_runs.workflow_id
	WHERE workflows.deployment_id = $1
	`

	var rows *sql.Rows
	if rows, err = s.runQuery(query, deploymentID); err != nil {
		return
	}
	defer rows.Close()

	for rows.Next() {
		var workflowRun WorkflowRunModel
		err = rows.Scan(&workflowRun.WorkflowID, &workflowRun.RunID)
		if err != nil {
			return
		}
		workflowRuns = append(workflowRuns, workflowRun)
	}
	return
}

func (s DatabaseWorkflowStore) executePreparedScopedQuery(tx *sql.Tx, query string, args ...interface{}) (err error) {
	var (
		stmt *sql.Stmt
	)

	if stmt, err = tx.Prepare(query); err != nil {
		return
	}
	defer stmt.Close()

	_, err = stmt.Exec(args...)
	return
}

func (s DatabaseWorkflowStore) DeleteDeploymentWorkflows(deploymentID string) (err error) {
	deleteWorkflowRunsQuery := `
	DELETE FROM workflow_runs
	WHERE id IN (
		SELECT workflow_runs.id FROM workflow_runs
		JOIN workflows
		ON workflows.id = workflow_runs.workflow_id
		WHERE workflows.deployment_id = $1
	)
	`

	deleteWorkflowsQuery := `
	DELETE FROM workflows
	WHERE deployment_id = $1
	`

	tx, err := s.db.Begin()
	if err != nil {
		return
	}

	if err = s.executePreparedScopedQuery(tx, deleteWorkflowRunsQuery, deploymentID); err != nil {
		return
	}

	if err = s.executePreparedScopedQuery(tx, deleteWorkflowsQuery, deploymentID); err != nil {
		return
	}

	tx.Commit()
	return
}
