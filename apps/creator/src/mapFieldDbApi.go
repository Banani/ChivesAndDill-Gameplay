package main

import (
	"context"
	"strconv"

	"go.mongodb.org/mongo-driver/bson"
)

type MapFieldDbApi struct {
	application *Application
}

func (m *MapFieldDbApi) saveMapField(mapFields []MapField) {
	dbClient := m.application.dbClient
	collection := dbClient.db.Collection("mapFields")

	toDelete := make([]string, len(mapFields))
	toSave := make([]interface{}, len(mapFields))
	counter := 0

	for _, field := range mapFields {
		toSave[counter] = bson.D{{"spriteId", field.SpriteId}, {"x", field.X}, {"y", field.Y}, {"_id", strconv.Itoa(int(field.X)) + ":" + strconv.Itoa(int(field.Y))}}
		toDelete[counter] = strconv.Itoa(int(field.X)) + ":" + strconv.Itoa(int(field.Y))
		counter++
	}

	collection.DeleteMany(context.TODO(), bson.M{"_id": bson.M{"$in": toDelete}})
	collection.InsertMany(context.TODO(), toSave)
}

func (m *MapFieldDbApi) deleteMapField(idsMap map[string]interface{}) {
	dbClient := m.application.dbClient
	collection := dbClient.db.Collection("mapFields")
	ids := make([]string, len(idsMap))
	counter := 0

	for key := range idsMap {
		ids[counter] = key
		counter++
	}

	collection.DeleteMany(context.TODO(), bson.M{"_id": bson.M{"$in": ids}})
}

func (m *MapFieldDbApi) getSprites() map[string]Sprite {
	return getAllItemsFromDb[Sprite](m.application.dbClient, "sprites")
}

func (m *MapFieldDbApi) getMapFields() map[string]MapField {
	return getAllItemsFromDb[MapField](m.application.dbClient, "mapFields")
}
