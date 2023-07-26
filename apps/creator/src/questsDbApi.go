package main

import (
	"context"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type QuestsDbApi struct {
	application *Application
}

func updateInternalIds(questSchema QuestSchema) {
	for stageId, stage := range questSchema.Stages {
		for stagePartId, stagePart := range stage.StageParts {
			if stagePart.Id == "" {
				stagePart.Id = primitive.NewObjectID().Hex()
				stage.StageParts[stagePartId] = stagePart
			}
		}

		if stage.Id == "" {
			stage.Id = primitive.NewObjectID().Hex()
			questSchema.Stages[stageId] = stage
		}
	}
}

func (m *QuestsDbApi) saveQuest(questSchema QuestSchema) string {
	dbClient := m.application.dbClient
	collection := dbClient.db.Collection("questSchemas")

	updateInternalIds(questSchema)

	record, _ := collection.InsertOne(context.TODO(), questSchema)
	return record.InsertedID.(primitive.ObjectID).Hex()
}

func (m *QuestsDbApi) updateQuest(questSchema QuestSchema) {
	dbClient := m.application.dbClient
	collection := dbClient.db.Collection("questSchemas")

	updateInternalIds(questSchema)
	toSave := bson.D{{"$set", questSchema}}

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
