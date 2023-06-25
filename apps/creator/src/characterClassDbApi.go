package main

import (
	"context"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type CharacterClassesDbApi struct {
	application *Application
}

func (m *CharacterClassesDbApi) saveCharacterClass(CharacterClass CharacterClass) string {
	dbClient := m.application.dbClient
	collection := dbClient.db.Collection("characterClasses")

	record, _ := collection.InsertOne(context.TODO(), CharacterClass)

	return record.InsertedID.(primitive.ObjectID).Hex()
}

func (m *CharacterClassesDbApi) updateCharacterClass(CharacterClass CharacterClass) {
	dbClient := m.application.dbClient
	collection := dbClient.db.Collection("characterClasses")

	toSave := bson.D{{"$set", CharacterClass}}

	objectId, _ := primitive.ObjectIDFromHex(CharacterClass.Id)
	collection.UpdateOne(context.TODO(), bson.M{"_id": objectId}, toSave)
}

func (m *CharacterClassesDbApi) getCharacterClasses() map[string]CharacterClass {
	return getAllItemsFromDb[CharacterClass](m.application.dbClient, "characterClasses")
}

func (m *CharacterClassesDbApi) deleteCharacterClass(CharacterClassId string) {
	dbClient := m.application.dbClient
	collection := dbClient.db.Collection("characterClasses")

	objectId, _ := primitive.ObjectIDFromHex(CharacterClassId)
	collection.DeleteMany(context.TODO(), bson.M{"_id": bson.M{"$in": []primitive.ObjectID{objectId}}})
}
