package main

import (
	"context"
	"encoding/json"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"log"
	"reflect"
)

type MongodbEntity struct {
	ID primitive.ObjectID `json:"id" bson:"_id"`
}

type PlainEntity struct {
	ID string `json:"id" bson:"_id"`
}

func prepareUpdatePayload[T any](moduleName string, items map[string]T) map[string]EnginePackageStringArray {
	updatePackage := make(map[string]EnginePackageStringArray)
	serializedModule := make(map[string]string)

	for key, item := range items {
		jsonItem, _ := json.Marshal(item)
		serializedModule[key] = string(jsonItem)
	}

	updatePackage[moduleName] = EnginePackageStringArray{Data: serializedModule}
	return updatePackage
}

func prepareDeletePayload(moduleName string, itemIds []string) map[string]EnginePackageStringArray {
	updatePackage := make(map[string]EnginePackageStringArray)
	serializedModule := make(map[string]interface{})

	for _, key := range itemIds {
		serializedModule[key] = nil
	}

	updatePackage[moduleName] = EnginePackageStringArray{ToDelete: serializedModule}
	return updatePackage
}

func prepareDeletePayload2[T any](moduleName string, items map[string]T) map[string]EnginePackageStringArray {
	updatePackage := make(map[string]EnginePackageStringArray)
	serializedModule := make(map[string]interface{})

	for key, _ := range items {
		serializedModule[key] = nil
	}

	updatePackage[moduleName] = EnginePackageStringArray{ToDelete: serializedModule}
	return updatePackage
}

func getAllItemsFromDb[T any](dbClient *DBClient, collectionName string) map[string]T {
	collection := dbClient.db.Collection(collectionName)

	cursor, err := collection.Find(dbClient.ctx, bson.M{})
	if err != nil {
		log.Fatal(err)
	}

	outputMap := make(map[string]T)

	for cursor.Next(context.TODO()) {
		entity := MongodbEntity{}
		cursor.Decode(&entity)
		id := entity.ID.Hex()

		if id == "000000000000000000000000" {
			entity := PlainEntity{}
			cursor.Decode(&entity)
			id = entity.ID
		}

		var decoded T
		cursor.Decode(&decoded)

		reflect.ValueOf(&decoded).Elem().FieldByName("Id").Set(reflect.ValueOf(id))

		outputMap[id] = decoded
	}

	return outputMap
}
