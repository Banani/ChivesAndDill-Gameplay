package main

const (
	updateMapField     = "UPDATE_MAP_FIELD"
	deleteMapField     = "DELETE_MAP_FIELD"
	createNpcTemplate  = "CREATE_NPC_TEMPLATE"
	deleteNpcTemplate  = "DELETE_NPC_TEMPLATE"
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

type DeleteNpcTemplateAction struct {
	ActionType    string `json:"actionType"`
	NpcTemplateId string `json:"npcTemplateId"`
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
