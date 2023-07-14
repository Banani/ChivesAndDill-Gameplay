package main

import (
	"context"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type QuestsDbApi struct {
	application *Application
}

func (m *QuestsDbApi) saveQuest(questSchema QuestSchema) string {
	dbClient := m.application.dbClient
	collection := dbClient.db.Collection("questSchemas")

	toSave := bson.D{
		{"name", questSchema.Name},
		{"description", questSchema.Description},
		{"questReward", questSchema.QuestReward},
		{"stages", questSchema.Stages},
		{"requiredQuests", questSchema.RequiredQuests},
		{"requiredLevel", questSchema.RequiredLevel},
	}

	record, _ := collection.InsertOne(context.TODO(), toSave)

	return record.InsertedID.(primitive.ObjectID).Hex()
}

func (m *QuestsDbApi) updateQuest(questSchema QuestSchema) {
	dbClient := m.application.dbClient
	collection := dbClient.db.Collection("questSchemas")

	toSave := bson.D{{"$set", bson.D{
		{"name", questSchema.Name},
		{"description", questSchema.Description},
		{"questReward", questSchema.QuestReward},
		{"stages", questSchema.Stages},
		{"requiredQuests", questSchema.RequiredQuests},
		{"requiredLevel", questSchema.RequiredLevel},
	}}}

	objectId, _ := primitive.ObjectIDFromHex(questSchema.Id)
	collection.UpdateOne(context.TODO(), bson.M{"_id": objectId}, toSave)
}

func (m *QuestsDbApi) getQuests() map[string]QuestSchema {
	return getAllItemsFromDb[QuestSchema](m.application.dbClient, "questSchemas")
}

func (m *QuestsDbApi) deleteQuest(questId string) {
	dbClient := m.application.dbClient
	collection := dbClient.db.Collection("questSchemas")

	objectId, _ := primitive.ObjectIDFromHex(questId)
	collection.DeleteMany(context.TODO(), bson.M{"_id": bson.M{"$in": []primitive.ObjectID{objectId}}})
}

func (m *QuestsDbApi) deleteItemsInQuestReward(itemId string) {
	dbClient := m.application.dbClient
	collection := dbClient.db.Collection("questSchemas")

	collection.UpdateMany(context.TODO(), bson.M{}, bson.M{"$unset": bson.M{"questReward.items." + itemId: ""}})
}
