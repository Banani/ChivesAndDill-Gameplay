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
	updateMapField     = "UPDATE_MAP_FIELD"
	deleteMapField     = "DELETE_MAP_FIELD"
	createNpcTemplate  = "CREATE_NPC_TEMPLATE"
	addNpc             = "ADD_NPC"
	deleteNpc          = "DELETE_NPC"
	createItemTemplate = "CREATE_ITEM_TEMPLATE"
	deleteItemTemplate = "DELETE_ITEM_TEMPLATE"
	updateItemTemplate = "UPDATE_ITEM_TEMPLATE"
	createQuest        = "CREATE_QUEST"
	deleteQuest        = "DELETE_QUEST"
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

type CreateNpcTemplateAction struct {
	ActionType  string      `json:"actionType"`
	NpcTemplate NpcTemplate `json:"npcTemplate"`
}

type AddNpcAction struct {
	X             int    `json:"x"`
	Y             int    `json:"y"`
	NpcTemplateId string `json:"npcTemplateId"`
}

type DeleteNpcAction struct {
	ActionType string `json:"actionType"`
	NpcId      string `json:"npcId"`
}

type CreateItemTemplateAction struct {
	ActionType   string       `json:"actionType"`
	ItemTemplate ItemTemplate `json:"itemTemplate"`
}

type DeleteItemTemplateAction struct {
	ActionType     string `json:"actionType"`
	ItemTemplateId string `json:"itemTemplateId"`
}

type UpdateItemTemplateAction struct {
	ActionType   string       `json:"actionType"`
	ItemTemplate ItemTemplate `json:"itemTemplate"`
}

type CreateQuestAction struct {
	ActionType  string      `json:"actionType"`
	QuestSchema QuestSchema `json:"questSchema"`
}

type DeleteQuestAction struct {
	ActionType string `json:"actionType"`
	QuestId    string `json:"questId"`
}

type TypedAction struct {
	ActionType string
	Body       []byte
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

			w.application.services.questsService.actionStream <- typedAction
			w.application.services.npcTemplateService.actionStream <- typedAction
			w.application.services.itemsService.actionStream <- typedAction
			w.application.services.mapFieldService.actionStream <- typedAction
		}
	})()
}
