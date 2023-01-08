package main

import (
	"encoding/json"
	"log"

	"github.com/gorilla/websocket"
)

type Reader struct {
	application *Application
}

const (
	updateMapField = "UPDATE_MAP_FIELD"
	deleteMapField = "DELETE_MAP_FIELD"
)

type Action struct {
	ActionType string `json:"actionType"`
}

type UpdateMapFieldAction struct {
	ActionType string `json:"actionType"`
	BrushSize  int    `json:brushSize`
	X          int    `json:"x"`
	Y          int    `json:"y"`
	SpriteId   string `json:"spriteId"`
}

type DeleteMapFieldAction struct {
	ActionType string `json:"actionType"`
	BrushSize  int    `json:brushSize`
	X          int    `json:"x"`
	Y          int    `json:"y"`
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

			if action.ActionType == updateMapField {
				var updateMapFieldAction UpdateMapFieldAction
				json.Unmarshal(message, &updateMapFieldAction)
				w.application.services.mapFieldService.mapFieldUpdated <- updateMapFieldAction
			}

			if action.ActionType == deleteMapField {
				var deleteMapFieldAction DeleteMapFieldAction
				json.Unmarshal(message, &deleteMapFieldAction)
				w.application.services.mapFieldService.mapFieldDeleted <- deleteMapFieldAction
			}
		}
	})()
}
