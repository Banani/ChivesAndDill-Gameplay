package main

import "go.mongodb.org/mongo-driver/bson/primitive"

type Application struct {
	services map[string]Service
	dbClient *DBClient
	writter  *Writter
}

type Service interface {
	init()
	handleNewConnection()
	serve()
	processAction(action TypedAction)
}

type EnginePackage struct {
	Data map[string]primitive.M `json:"data"`
}

type EnginePackageStringArray struct {
	Data     map[string]string      `json:"data"`
	ToDelete map[string]interface{} `json:"toDelete"`
}
