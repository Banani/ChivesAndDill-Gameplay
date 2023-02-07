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

			if action.ActionType == createNpcTemplate {
				var createNpcTemplateAction CreateNpcTemplateAction
				json.Unmarshal(message, &createNpcTemplateAction)
				w.application.services.npcTemplateService.createNpcTemplate <- createNpcTemplateAction
			}

			if action.ActionType == addNpc {
				var addNpcAction AddNpcAction
				json.Unmarshal(message, &addNpcAction)
				w.application.services.npcTemplateService.addNpc <- addNpcAction
			}

			if action.ActionType == deleteNpc {
				var deleteNpcAction DeleteNpcAction
				json.Unmarshal(message, &deleteNpcAction)
				w.application.services.npcTemplateService.deleteNpc <- deleteNpcAction
			}

			if action.ActionType == deleteNpc {
				var deleteNpcAction DeleteNpcAction
				json.Unmarshal(message, &deleteNpcAction)
				w.application.services.npcTemplateService.deleteNpc <- deleteNpcAction
			}

			if action.ActionType == createItemTemplate {
				var createItemTemplateAction CreateItemTemplateAction
				json.Unmarshal(message, &createItemTemplateAction)
				w.application.services.itemsService.createItemTemplate <- createItemTemplateAction
			}

			if action.ActionType == deleteItemTemplate {
				var deleteItemTemplateAction DeleteItemTemplateAction
				json.Unmarshal(message, &deleteItemTemplateAction)
				w.application.services.itemsService.deleteItemTemplate <- deleteItemTemplateAction
			}

			if action.ActionType == updateItemTemplate {
				var updateItemTemplateAction UpdateItemTemplateAction
				json.Unmarshal(message, &updateItemTemplateAction)
				w.application.services.itemsService.updateItemTemplate <- updateItemTemplateAction
			}

			if action.ActionType == createQuest {
				var createQuestAction CreateQuestAction
				json.Unmarshal(message, &createQuestAction)
				w.application.services.questsService.createQuest <- createQuestAction
			}

			if action.ActionType == deleteQuest {
				var deleteQuestAction DeleteQuestAction
				json.Unmarshal(message, &deleteQuestAction)
				w.application.services.questsService.deleteQuest <- deleteQuestAction
			}
		}
	})()
}
