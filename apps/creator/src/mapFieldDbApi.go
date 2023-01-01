package main

import (
	"context"
	"log"
	"strconv"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type MapFieldDbApi struct {
	application *Application
}

func (m *MapFieldDbApi) saveMapField(mapField MapField) {
	dbClient := m.application.dbClient
	collection := dbClient.db.Collection("mapFields")

	document := bson.D{{"x", mapField.X}, {"y", mapField.Y}, {"_id", strconv.Itoa(mapField.X) + ":" + strconv.Itoa(mapField.Y)}, {"spriteId", mapField.SpriteId}}

	collection.InsertOne(context.TODO(), document)
}

func (m *MapFieldDbApi) getSprites() map[string]Sprite {
	dbClient := m.application.dbClient
	spritesCollection := dbClient.db.Collection("sprites")

	cursor, err := spritesCollection.Find(dbClient.ctx, bson.M{})
	if err != nil {
		log.Fatal(err)
	}

	var sprites []bson.M
	if err = cursor.All(dbClient.ctx, &sprites); err != nil {
		log.Fatal(err)
	}

	spriteMap := make(map[string]Sprite)
	for _, sprite := range sprites {
		x, _ := strconv.Atoi(sprite["x"].(string))
		y, _ := strconv.Atoi(sprite["y"].(string))

		spriteMap[sprite["_id"].(primitive.ObjectID).String()] = Sprite{
			X:           x,
			Y:           y,
			SpriteSheet: sprite["spriteSheet"].(string),
			SpriteId:    sprite["_id"].(primitive.ObjectID).String(),
		}
	}

	return spriteMap
}

func (m *MapFieldDbApi) getMapFields() map[string]MapField {

	dbClient := m.application.dbClient
	mapFieldsCollection := dbClient.db.Collection("mapFields")

	cursor, err := mapFieldsCollection.Find(dbClient.ctx, bson.M{})
	if err != nil {
		log.Fatal(err)
	}

	var mapFields []bson.M
	if err = cursor.All(dbClient.ctx, &mapFields); err != nil {
		log.Fatal(err)
	}

	mapFieldsMap := make(map[string]MapField)
	for _, mapField := range mapFields {
		x, _ := mapField["x"].(int)
		y, _ := mapField["y"].(int)

		mapFieldsMap[mapField["_id"].(string)] = MapField{
			X:        x,
			Y:        y,
			SpriteId: mapField["spriteId"].(string),
		}
	}

	return mapFieldsMap
}
