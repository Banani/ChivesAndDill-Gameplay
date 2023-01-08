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

func (m *MapFieldDbApi) saveMapField(mapFields []MapField) {
	dbClient := m.application.dbClient
	collection := dbClient.db.Collection("mapFields")

	toDelete := make([]string, len(mapFields))
	toSave := make([]interface{}, len(mapFields))
	counter := 0

	for _, field := range mapFields {
		toSave[counter] = bson.D{{"spriteId", field.SpriteId}, {"x", field.X}, {"y", field.Y}, {"_id", strconv.Itoa(field.X) + ":" + strconv.Itoa(field.Y)}}
		toDelete[counter] = strconv.Itoa(field.X) + ":" + strconv.Itoa(field.Y)
		counter++
	}

	collection.DeleteMany(context.TODO(), bson.M{"_id": bson.M{"$in": toDelete}})
	_, err := collection.InsertMany(context.TODO(), toSave)

	log.Print(err)
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
