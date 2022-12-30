package main

import (
	"log"
	"strconv"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type MapFieldDbApi struct {
	application *Application
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
	mapFields := make(map[string]MapField)
	mapFields["2:0"] = MapField{Id: "ObjectID(\"62d2f43587803a92bd861ca3\")"}
	mapFields["2:5"] = MapField{Id: "ObjectID(\"62d2f43587803a92bd861ca3\")"}
	mapFields["7:3"] = MapField{Id: "ObjectID(\"62d2f43587803a92bd861ca3\")"}
	mapFields["8:2"] = MapField{Id: "ObjectID(\"62d2f43587803a92bd861ca3\")"}

	return mapFields
}
