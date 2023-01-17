package main

import (
	"fmt"
	"time"

	"github.com/gorilla/websocket"
)

type Writter struct {
	connections       map[*websocket.Conn]bool
	application       *Application
	stream            chan map[string]EnginePackageStringArray
	removeConnections chan *websocket.Conn
}

func (w *Writter) addConnection(conn *websocket.Conn) {
	w.connections[conn] = true
}

func (w *Writter) handleMessages() {
	for {
		select {
		case modulePackage := <-w.stream:
			for con := range w.connections {
				con.SetWriteDeadline(time.Now().Add(10 * time.Second))
				err := con.WriteJSON(modulePackage)
				fmt.Println(err)
			}
		case conn := <-w.removeConnections:
			delete(w.connections, conn)
		}
	}
}
