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
		{"stock", npcTemplate.Stock},
		{"quests", npcTemplate.Quests},
		{"quotesEvents", npcTemplate.QuotesEvents},
	}

	record, _ := collection.InsertOne(context.TODO(), toSave)

	return record.InsertedID.(primitive.ObjectID).Hex()
}

func (m *NpcTemplateDbApi) updateNpcTemplate(npcTemplate NpcTemplate) {
	dbClient := m.application.dbClient
	collection := dbClient.db.Collection("npcTemplates")
	
	toSave := bson.D{{"$set", bson.D{
		{"name", npcTemplate.Name},
		{"healthPoints", npcTemplate.HealthPoints},
		{"healthPointsRegeneration", npcTemplate.HealthPointsRegeneration},
		{"spellPower", npcTemplate.SpellPower},
		{"spellPowerRegeneration", npcTemplate.SpellPowerRegeneration},
		{"movementSpeed", npcTemplate.MovementSpeed},
		{"stock", npcTemplate.Stock},
		{"quests", npcTemplate.Quests},
		{"quotesEvents", npcTemplate.QuotesEvents},
	}}}

	objectId, _ := primitive.ObjectIDFromHex(npcTemplate.Id)
	collection.UpdateOne(context.TODO(), bson.M{"_id": objectId}, toSave)
}

func (m *NpcTemplateDbApi) getNpcTemplates() (map[string]NpcTemplate, map[string]Npc) {

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
	npcsMap := make(map[string]Npc)
	for _, npcTemplate := range npcTemplates {
		name, _ := npcTemplate["name"].(string)
		healthPoints, _ := npcTemplate["healthPoints"].(int32)
		healthPointsRegeneration, _ := npcTemplate["healthPointsRegeneration"].(int32)
		spellPower, _ := npcTemplate["spellPower"].(int32)
		spellPowerRegeneration, _ := npcTemplate["spellPowerRegeneration"].(int32)
		movementSpeed, _ := npcTemplate["movementSpeed"].(int32)
		npcTemplateId := npcTemplate["_id"].(primitive.ObjectID).Hex()

		npcTemplatesMap[npcTemplateId] = NpcTemplate{
			Id:                       npcTemplateId,
			Name:                     name,
			HealthPoints:             healthPoints,
			HealthPointsRegeneration: healthPointsRegeneration,
			SpellPower:               spellPower,
			SpellPowerRegeneration:   spellPowerRegeneration,
			MovementSpeed:            movementSpeed,
			Stock:                    make(map[string]bool),
			Quests:                   make(map[string]bool),
		}

		if npcTemplate["stock"] != nil {
			for key, stockItem := range npcTemplate["stock"].(primitive.M) {
				npcTemplatesMap[npcTemplateId].Stock[key] = stockItem.(bool)
			}
		}

		if npcTemplate["quests"] != nil {
			for key, questItem := range npcTemplate["quests"].(primitive.M) {
				npcTemplatesMap[npcTemplateId].Quests[key] = questItem.(bool)
			}
		}

		if npcTemplate["npcRespawns"] != nil {
			for _, npc := range npcTemplate["npcRespawns"].(primitive.A) {
				convertedNpc := npc.(primitive.M)
				location := convertedNpc["location"].(primitive.M)

				npcsMap[convertedNpc["_id"].(string)] = Npc{
					Id: convertedNpc["_id"].(string),
					Location: Location{
						X: location["x"].(int32),
						Y: location["y"].(int32),
					},
					NpcTemplateId: npcTemplateId,
					Time:          convertedNpc["time"].(int32),
					WalkingType:   convertedNpc["walkingType"].(string),
				}
			}
		}

	}

	return npcTemplatesMap, npcsMap
}

func (m *NpcTemplateDbApi) deleteNpcTemplate(npcTemplateId string) {
	dbClient := m.application.dbClient
	collection := dbClient.db.Collection("npcTemplates")

	objectId, _ := primitive.ObjectIDFromHex(npcTemplateId)
	collection.DeleteMany(context.TODO(), bson.M{"_id": bson.M{"$in": []primitive.ObjectID{objectId}}})
}

func (m *NpcTemplateDbApi) removeQuestFromNpc(questId string) {
	dbClient := m.application.dbClient
	collection := dbClient.db.Collection("npcTemplates")

	collection.UpdateMany(context.TODO(), bson.M{}, bson.M{"$unset": bson.M{"quests." + questId: ""}})
}

func (m *NpcTemplateDbApi) removeItemFromNpc(itemId string) {
	dbClient := m.application.dbClient
	collection := dbClient.db.Collection("npcTemplates")

	collection.UpdateMany(context.TODO(), bson.M{}, bson.M{"$unset": bson.M{"stock." + itemId: ""}})
}

func (m *NpcTemplateDbApi) addNpc(npc Npc) string {
	dbClient := m.application.dbClient
	collection := dbClient.db.Collection("npcTemplates")

	objectId, _ := primitive.ObjectIDFromHex(npc.NpcTemplateId)

	filter := bson.M{"_id": objectId}
	toSave := bson.M{"$push": bson.M{"npcRespawns": bson.M{
		"_id":         npc.Id,
		"location":    bson.M{"x": npc.Location.X, "y": npc.Location.Y},
		"time":        npc.Time,
		"walkingType": npc.WalkingType,
	}}}

	// Remove npcs on that spot
	collection.UpdateMany(context.TODO(), bson.M{}, bson.M{"$pull": bson.M{"npcRespawns": bson.M{"_id": npc.Id}}})
	collection.UpdateOne(context.TODO(), filter, toSave)

	return "test" //record.InsertedID.(primitive.ObjectID).String()
}

func (m *NpcTemplateDbApi) deleteNpc(npcId string) {
	dbClient := m.application.dbClient
	collection := dbClient.db.Collection("npcTemplates")

	collection.UpdateMany(context.TODO(), bson.M{}, bson.M{"$pull": bson.M{"npcRespawns": bson.M{"_id": npcId}}})
}
