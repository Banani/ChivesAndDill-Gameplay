package main

import (
	"fmt"
	"time"

	"github.com/gorilla/websocket"
)

type Writter struct {
	connections []websocket.Conn
	application *Application
	stream      chan map[string]EnginePackageStringArray
}

func (w *Writter) addConnection(conn websocket.Conn) {
	w.connections = append(w.connections, conn)
}

func (w *Writter) handleMessages() {
	for {
		select {
		case modulePackage := <-w.stream:
			for _, con := range w.connections {
				con.SetWriteDeadline(time.Now().Add(10 * time.Second))
				err := con.WriteJSON(modulePackage)
				fmt.Println(err)
			}
		}
	}
}
