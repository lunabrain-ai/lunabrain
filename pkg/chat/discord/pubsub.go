package discord

import (
	"github.com/bwmarrin/discordgo"
	"sync"
)

type Topic int

const (
	MessageTopic = iota
)

type PubSub struct {
	subscribers map[Topic][]chan *discordgo.MessageCreate
	lock        sync.RWMutex
}

func NewPubSub() *PubSub {
	return &PubSub{
		subscribers: make(map[Topic][]chan *discordgo.MessageCreate),
	}
}

func (ps *PubSub) Subscribe(topic Topic) <-chan *discordgo.MessageCreate {
	ps.lock.Lock()
	defer ps.lock.Unlock()
	ch := make(chan *discordgo.MessageCreate, 10)
	ps.subscribers[topic] = append(ps.subscribers[topic], ch)
	return ch
}

func (ps *PubSub) Publish(topic Topic, message *discordgo.MessageCreate) {
	ps.lock.RLock()
	defer ps.lock.RUnlock()
	for _, ch := range ps.subscribers[topic] {
		go func(ch chan *discordgo.MessageCreate) {
			ch <- message
		}(ch)
	}
}
