package main

import (
	"context"
	"log"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type ItemsDbApi struct {
	application *Application
}

func (m *ItemsDbApi) saveItemTemplate(itemTemplate ItemTemplate) string {
	dbClient := m.application.dbClient
	collection := dbClient.db.Collection("itemTemplates")

	toSave := bson.D{
		{"name", itemTemplate.Name},
		{"type", itemTemplate.Type},
		{"value", itemTemplate.Value},
		{"stack", itemTemplate.Stack},
		{"image", itemTemplate.Image},
		{"slot", itemTemplate.Slot},
		{"armor", itemTemplate.Armor},
		{"strength", itemTemplate.Strength},
		{"stamina", itemTemplate.Stamina},
		{"agility", itemTemplate.Agility},
		{"intelect", itemTemplate.Intelect},
		{"spirit", itemTemplate.Spirit},
	}

	record, _ := collection.InsertOne(context.TODO(), toSave)

	return record.InsertedID.(primitive.ObjectID).Hex()
}

func (m *ItemsDbApi) getItemTemplates() map[string]ItemTemplate {
	dbClient := m.application.dbClient
	itemTemplatesCollection := dbClient.db.Collection("itemTemplates")

	cursor, err := itemTemplatesCollection.Find(dbClient.ctx, bson.M{})
	if err != nil {
		log.Fatal(err)
	}

	var itemTemplates []bson.M
	if err = cursor.All(dbClient.ctx, &itemTemplates); err != nil {
		log.Fatal(err)
	}

	itemTemplatesMap := make(map[string]ItemTemplate)
	for _, itemTemplate := range itemTemplates {
		id := itemTemplate["_id"].(primitive.ObjectID).Hex()
		itemTemplatesMap[id] = ItemTemplate{
			Id:       id,
			Type:     itemTemplate["type"].(string),
			Name:     itemTemplate["name"].(string),
			Image:    itemTemplate["image"].(string),
			Stack:    itemTemplate["stack"].(int32),
			Value:    itemTemplate["value"].(int32),
			Slot:     itemTemplate["slot"].(string),
			Armor:    itemTemplate["armor"].(int32),
			Stamina:  itemTemplate["stamina"].(int32),
			Agility:  itemTemplate["agility"].(int32),
			Intelect: itemTemplate["intelect"].(int32),
			Strength: itemTemplate["strength"].(int32),
			Spirit:   itemTemplate["spirit"].(int32),
		}
	}

	return itemTemplatesMap
}
