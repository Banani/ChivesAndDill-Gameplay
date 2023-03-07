package main

import (
	"context"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type SpriteGroupsDbApi struct {
	application *Application
}

func (m *SpriteGroupsDbApi) saveSpriteGroup(spriteGroup SpriteGroup) string {
	dbClient := m.application.dbClient
	collection := dbClient.db.Collection("spriteGroups")

	record, _ := collection.InsertOne(context.TODO(), spriteGroup)

	return record.InsertedID.(primitive.ObjectID).Hex()
}

func (m *SpriteGroupsDbApi) getSpriteGroups() map[string]SpriteGroup {
	return getAllItemsFromDb[SpriteGroup](m.application.dbClient, "spriteGroups")
}

func (m *SpriteGroupsDbApi) updateSpriteGroup(spriteGroup SpriteGroup) {
	dbClient := m.application.dbClient
	collection := dbClient.db.Collection("spriteGroups")

	toSave := bson.D{{"$set", spriteGroup}}

	objectId, _ := primitive.ObjectIDFromHex(spriteGroup.Id)
	collection.UpdateOne(context.TODO(), bson.M{"_id": objectId}, toSave)
}

func (m *SpriteGroupsDbApi) deleteSpriteGroup(spriteGroupId string) {
	dbClient := m.application.dbClient
	collection := dbClient.db.Collection("spriteGroups")

	objectId, _ := primitive.ObjectIDFromHex(spriteGroupId)
	collection.DeleteMany(context.TODO(), bson.M{"_id": bson.M{"$in": []primitive.ObjectID{objectId}}})
}
