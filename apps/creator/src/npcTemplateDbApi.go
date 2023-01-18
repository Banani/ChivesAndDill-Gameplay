package main

import (
	"context"
	"log"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type NpcTemplateDbApi struct {
	application *Application
}

func (m *NpcTemplateDbApi) saveNpcTemplate(npcTemplate NpcTemplate) string {
	dbClient := m.application.dbClient
	collection := dbClient.db.Collection("npcTemplates")

	toSave := bson.D{
		{"name", npcTemplate.Name},
		{"healthPoints", npcTemplate.HealthPoints},
		{"healthPointsRegeneration", npcTemplate.HealthPointsRegeneration},
		{"spellPower", npcTemplate.SpellPower},
		{"spellPowerRegeneration", npcTemplate.SpellPowerRegeneration},
		{"movementSpeed", npcTemplate.MovementSpeed},
	}

	record, _ := collection.InsertOne(context.TODO(), toSave)

	return record.InsertedID.(primitive.ObjectID).String()
}

func (m *NpcTemplateDbApi) getNpcTemplates() map[string]NpcTemplate {

	dbClient := m.application.dbClient
	npcTemplatesCollection := dbClient.db.Collection("npcTemplates")

	cursor, err := npcTemplatesCollection.Find(dbClient.ctx, bson.M{})
	if err != nil {
		log.Fatal(err)
	}

	var npcTemplates []bson.M
	if err = cursor.All(dbClient.ctx, &npcTemplates); err != nil {
		log.Fatal(err)
	}

	npcTemplatesMap := make(map[string]NpcTemplate)
	for _, npcTemplate := range npcTemplates {
		name, _ := npcTemplate["name"].(string)
		healthPoints, _ := npcTemplate["healthPoints"].(int32)
		healthPointsRegeneration, _ := npcTemplate["healthPointsRegeneration"].(int32)
		spellPower, _ := npcTemplate["spellPower"].(int32)
		spellPowerRegeneration, _ := npcTemplate["spellPowerRegeneration"].(int32)
		movementSpeed, _ := npcTemplate["movementSpeed"].(int32)
		id := npcTemplate["_id"].(primitive.ObjectID).String()

		npcTemplatesMap[id] = NpcTemplate{
			Id:                       id,
			Name:                     name,
			HealthPoints:             healthPoints,
			HealthPointsRegeneration: healthPointsRegeneration,
			SpellPower:               spellPower,
			SpellPowerRegeneration:   spellPowerRegeneration,
			MovementSpeed:            movementSpeed,
		}
	}

	return npcTemplatesMap
}
