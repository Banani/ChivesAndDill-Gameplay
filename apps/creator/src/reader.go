package main

import (
	"encoding/json"
	"log"

	"github.com/gorilla/websocket"
)

type Reader struct {
	connections []websocket.Conn
	application *Application
}

const (
	updateMapField = "UPDATE_MAP_FIELD"
)

type Action struct {
	ActionType string `json:"actionType"`
}

type UpdateMapFieldAction struct {
	ActionType string `json:"actionType"`
	X          int    `json:"x"`
	Y          int    `json:"y"`
	SpriteId   string `json:"spriteId"`
}

func (w *Reader) addConnection(conn websocket.Conn) {
	w.connections = append(w.connections, conn)

	go (func() {
		for {
			_, message, err := conn.ReadMessage()
			if err != nil {
				log.Printf("Error: %v", err)
			}
			var action Action
			json.Unmarshal(message, &action)

			if action.ActionType == updateMapField {
				var updateMapFieldAction UpdateMapFieldAction
				json.Unmarshal(message, &updateMapFieldAction)
				w.application.services.mapFieldService.mapFieldUpdated <- updateMapFieldAction
			}
		}
	})()
}
