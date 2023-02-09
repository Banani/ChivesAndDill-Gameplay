package main

import (
	"encoding/json"
	"log"

	"github.com/gorilla/websocket"
)

type Reader struct {
	application *Application
}

func (w *Reader) addConnection(conn *websocket.Conn) {
	go (func() {
		defer func() {
			conn.Close()
		}()

		for {
			_, message, err := conn.ReadMessage()
			if err != nil {
				if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
					log.Printf("error: %v", err)
				}
				w.application.writter.removeConnections <- conn
				break
			}
			var action Action
			json.Unmarshal(message, &action)

			typedAction := TypedAction{
				ActionType: action.ActionType,
				Body:       message,
			}

			for _, service := range w.application.services {
				service.processAction(typedAction)
			}
		}
	})()
}
