package main

import (
	"context"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type ItemsDbApi struct {
	application *Application
}

func (m *ItemsDbApi) saveItemTemplate(itemTemplate ItemTemplate) string {
	dbClient := m.application.dbClient
	collection := dbClient.db.Collection("itemTemplates")

	record, _ := collection.InsertOne(context.TODO(), itemTemplate)

	return record.InsertedID.(primitive.ObjectID).Hex()
}

func (m *ItemsDbApi) updateItemTemplate(itemTemplate ItemTemplate) {
	dbClient := m.application.dbClient
	collection := dbClient.db.Collection("itemTemplates")

	toSave := bson.D{{"$set", itemTemplate}}

	objectId, _ := primitive.ObjectIDFromHex(itemTemplate.Id)
	collection.UpdateOne(context.TODO(), bson.M{"_id": objectId}, toSave)
}

func (m *ItemsDbApi) getItemTemplates() map[string]ItemTemplate {
	return getAllItemsFromDb[ItemTemplate](m.application.dbClient, "itemTemplates")
}

func (m *ItemsDbApi) deleteItemTemplate(itemTemplateId string) {
	dbClient := m.application.dbClient
	collection := dbClient.db.Collection("itemTemplates")

	objectId, _ := primitive.ObjectIDFromHex(itemTemplateId)
	collection.DeleteMany(context.TODO(), bson.M{"_id": bson.M{"$in": []primitive.ObjectID{objectId}}})
}
