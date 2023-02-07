package main

import "go.mongodb.org/mongo-driver/bson/primitive"

type Application struct {
	services Services
	dbClient *DBClient
	writter  *Writter
}

type Services struct {
	mapFieldService    *MapFieldsService
	npcTemplateService *NpcTemplateService
	itemsService       *ItemsService
	questsService      *QuestsService
}

type EnginePackage struct {
	Data map[string]primitive.M `json:"data"`
}

type EnginePackageStringArray struct {
	Data     map[string]string      `json:"data"`
	ToDelete map[string]interface{} `json:"toDelete"`
}
