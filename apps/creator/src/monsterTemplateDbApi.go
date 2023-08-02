package main

import (
	"context"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type MonsterTemplateDbApi struct {
	application *Application
}

func (m *MonsterTemplateDbApi) saveMonsterTemplate(monsterTemplate MonsterTemplate) string {
	dbClient := m.application.dbClient
	collection := dbClient.db.Collection("monsterTemplates")

	record, _ := collection.InsertOne(context.TODO(), monsterTemplate)

	return record.InsertedID.(primitive.ObjectID).Hex()
}

func (m *MonsterTemplateDbApi) getMonsterTemplates() (map[string]MonsterTemplate, map[string]Monster) {
	monsterTemplates := getAllItemsFromDb[MonsterTemplate](m.application.dbClient, "monsterTemplates")
	monsterHolders := getAllItemsFromDb[MonsterHolder](m.application.dbClient, "monsterTemplates")

	monsters := make(map[string]Monster)

	for _, monsterTemplate := range monsterHolders {
		if monsterTemplate.MonsterRespawns == nil {
			continue
		}

		for _, monster := range monsterTemplate.MonsterRespawns {
			monster.MonsterTemplateId = monsterTemplate.Id
			monsters[monster.Id] = monster
		}
	}

	return monsterTemplates, monsters
}

func (m *MonsterTemplateDbApi) updateMonsterTemplate(monsterTemplate MonsterTemplate) {
	dbClient := m.application.dbClient
	collection := dbClient.db.Collection("monsterTemplates")

	toSave := bson.D{{"$set", monsterTemplate}}

	objectId, _ := primitive.ObjectIDFromHex(monsterTemplate.Id)
	collection.UpdateOne(context.TODO(), bson.M{"_id": objectId}, toSave)
}

func (m *MonsterTemplateDbApi) deleteMonsterTemplate(monsterTemplateId string) {
	dbClient := m.application.dbClient
	collection := dbClient.db.Collection("monsterTemplates")

	objectId, _ := primitive.ObjectIDFromHex(monsterTemplateId)
	collection.DeleteMany(context.TODO(), bson.M{"_id": bson.M{"$in": []primitive.ObjectID{objectId}}})
}

func (m *MonsterTemplateDbApi) addMonster(monster Monster) {
	dbClient := m.application.dbClient
	collection := dbClient.db.Collection("monsterTemplates")

	objectId, _ := primitive.ObjectIDFromHex(monster.MonsterTemplateId)

	filter := bson.M{"_id": objectId}
	toSave := bson.M{"$push": bson.M{"monsterRespawns": monster}}

	collection.UpdateMany(context.TODO(), bson.M{}, bson.M{"$pull": bson.M{"npcRespawns": bson.M{"_id": monster.Id}}})
	collection.UpdateOne(context.TODO(), filter, toSave)
}

//	func (m *MonsterTemplateDbApi) removeItemFromNpc(itemId string) {
//		dbClient := m.application.dbClient
//		collection := dbClient.db.Collection("npcTemplates")
//
//		collection.UpdateMany(context.TODO(), bson.M{}, bson.M{"$unset": bson.M{"stock." + itemId: ""}})
//	}
func (m *MonsterTemplateDbApi) updateMonster(monster Monster) {
	dbClient := m.application.dbClient
	collection := dbClient.db.Collection("monsterTemplates")

	objectId, _ := primitive.ObjectIDFromHex(monster.MonsterTemplateId)
	collection.UpdateOne(context.TODO(),
		bson.M{
			"_id":                objectId,
			"monsterRespawns.id": monster.Id,
		},
		bson.M{
			"$set": bson.M{
				"monsterRespawns.$.time":        monster.Time,
				"monsterRespawns.$.walkingType": monster.WalkingType,
				"monsterRespawns.$.patrolPath":  monster.PatrolPath,
			},
		})
}

func (m *MonsterTemplateDbApi) deleteMonster(monsterId string) {
	dbClient := m.application.dbClient
	collection := dbClient.db.Collection("monsterTemplates")

	collection.UpdateMany(context.TODO(), bson.M{}, bson.M{"$pull": bson.M{"monsterRespawns": bson.M{"id": monsterId}}})
}
