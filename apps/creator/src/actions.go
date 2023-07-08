package main

const (
	updateMapField       = "UPDATE_MAP_FIELD"
	deleteMapField       = "DELETE_MAP_FIELD"
	changeSpritePosition = "CHANGE_SPRITE_POSITION"

	createSpriteGroup = "CREATE_SPRITE_GROUP"
	updateSpriteGroup = "UPDATE_SPRITE_GROUP"
	deleteSpriteGroup = "DELETE_SPRITE_GROUP"

	createNpcTemplate = "CREATE_NPC_TEMPLATE"
	updateNpcTemplate = "UPDATE_NPC_TEMPLATE"
	deleteNpcTemplate = "DELETE_NPC_TEMPLATE"
	addNpc            = "ADD_NPC"
	updateNpc         = "UPDATE_NPC"
	deleteNpc         = "DELETE_NPC"

	createMonsterTemplate = "CREATE_MONSTER_TEMPLATE"
	updateMonsterTemplate = "UPDATE_MONSTER_TEMPLATE"
	deleteMonsterTemplate = "DELETE_MONSTER_TEMPLATE"
	addMonster            = "ADD_MONSTER"
	updateMonster         = "UPDATE_MONSTER"
	deleteMonster         = "DELETE_MONSTER"

	createItemTemplate = "CREATE_ITEM_TEMPLATE"
	deleteItemTemplate = "DELETE_ITEM_TEMPLATE"
	updateItemTemplate = "UPDATE_ITEM_TEMPLATE"

	createQuest = "CREATE_QUEST"
	updateQuest = "UPDATE_QUEST"
	deleteQuest = "DELETE_QUEST"

	createSpell = "CREATE_SPELL"
	updateSpell = "UPDATE_SPELL"
	deleteSpell = "DELETE_SPELL"

	createCharacterClass = "CREATE_CHARACTER_CLASS"
	updateCharacterClass = "UPDATE_CHARACTER_CLASS"
	deleteCharacterClass = "DELETE_CHARACTER_CLASS"
)

type Action struct {
	ActionType string `json:"actionType"`
}

type UpdateMapFieldAction struct {
	ActionType string `json:"actionType"`
	BrushSize  int    `json:"brushSize"`
	X          int    `json:"x"`
	Y          int    `json:"y"`
	SpriteId   string `json:"spriteId"`
}

type ChangeSpritePositionAction struct {
	ActionType string `json:"actionType"`
	SpriteId   string `json:"spriteId"`
	Position   string `json:"position"`
}

type DeleteMapFieldAction struct {
	ActionType string `json:"actionType"`
	BrushSize  int    `json:"brushSize"`
	X          int    `json:"x"`
	Y          int    `json:"y"`
}

type CreateSpriteGroupAction struct {
	ActionType  string      `json:"actionType"`
	SpriteGroup SpriteGroup `json:"spriteGroup"`
}

type UpdateSpriteGroupAction struct {
	ActionType  string      `json:"actionType"`
	SpriteGroup SpriteGroup `json:"spriteGroup"`
}

type DeleteSpriteGroupAction struct {
	ActionType string `json:"actionType"`
	Id         string `json:"id"`
}

type CreateNpcTemplateAction struct {
	ActionType  string      `json:"actionType"`
	NpcTemplate NpcTemplate `json:"characterTemplate"`
}

type UpdateNpcTemplateAction struct {
	ActionType  string      `json:"actionType"`
	NpcTemplate NpcTemplate `json:"characterTemplate"`
}

type DeleteNpcTemplateAction struct {
	ActionType    string `json:"actionType"`
	NpcTemplateId string `json:"characterTemplateId"`
}

type AddNpcAction struct {
	X             int    `json:"x"`
	Y             int    `json:"y"`
	NpcTemplateId string `json:"characterTemplateId"`
}

type UpdateNpcAction struct {
	ActionType string `json:"actionType"`
	Npc        Npc    `json:"character"`
}

type DeleteNpcAction struct {
	ActionType string `json:"actionType"`
	NpcId      string `json:"characterId"`
}

type CreateMonsterTemplateAction struct {
	ActionType        string          `json:"actionType"`
	CharacterTemplate MonsterTemplate `json:"characterTemplate"`
}

type UpdateMonsterTemplateAction struct {
	ActionType      string          `json:"actionType"`
	MonsterTemplate MonsterTemplate `json:"characterTemplate"`
}

type DeleteMonsterTemplateAction struct {
	ActionType        string `json:"actionType"`
	MonsterTemplateId string `json:"characterTemplateId"`
}

type AddMonsterAction struct {
	X                 int    `json:"x"`
	Y                 int    `json:"y"`
	MonsterTemplateId string `json:"characterTemplateId"`
}

type UpdateMonsterAction struct {
	ActionType string  `json:"actionType"`
	Monster    Monster `json:"character"`
}

type DeleteMonsterAction struct {
	ActionType string `json:"actionType"`
	MonsterId  string `json:"characterId"`
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

type UpdateQuestAction struct {
	ActionType  string      `json:"actionType"`
	QuestSchema QuestSchema `json:"questSchema"`
}

type DeleteQuestAction struct {
	ActionType string `json:"actionType"`
	QuestId    string `json:"questId"`
}

type CreateSpellAction struct {
	ActionType string `json:"actionType"`
	Spell      Spell  `json:"spell"`
}

type UpdateSpellAction struct {
	ActionType string `json:"actionType"`
	Spell      Spell  `json:"spell"`
}

type DeleteSpellAction struct {
	ActionType string `json:"actionType"`
	SpellId    string `json:"spellId"`
}

type CreateCharacterClassAction struct {
	ActionType     string         `json:"actionType"`
	CharacterClass CharacterClass `json:"characterClass"`
}

type UpdateCharacterClassAction struct {
	ActionType     string         `json:"actionType"`
	CharacterClass CharacterClass `json:"characterClass"`
}

type DeleteCharacterClassAction struct {
	ActionType       string `json:"actionType"`
	CharacterClassId string `json:"characterClassId"`
}

type TypedAction struct {
	ActionType string
	Body       []byte
}
