package main

import (
  "context"
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
  npcTemplates := getAllItemsFromDb[NpcTemplate](m.application.dbClient, "npcTemplates")
  npcHolders := getAllItemsFromDb[NpcHolder](m.application.dbClient, "npcTemplates")

  npcs := make(map[string]Npc)

  for _, npcTemplate := range npcHolders {
    if npcTemplate.NpcRespawns == nil {
      continue
    }

    for _, npc := range npcTemplate.NpcRespawns {
      npcs[npc.Id] = npc
    }
  }

  return npcTemplates, npcs
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

func (m *NpcTemplateDbApi) updateNpc(npc Npc) {
  dbClient := m.application.dbClient
  collection := dbClient.db.Collection("npcTemplates")

  objectId, _ := primitive.ObjectIDFromHex(npc.NpcTemplateId)
  collection.UpdateMany(context.TODO(),
    bson.M{
      "_id":             objectId,
      "npcRespawns._id": npc.Id,
    },
    bson.M{
      "$set": bson.M{
        "npcRespawns.$.time":        npc.Time,
        "npcRespawns.$.walkingType": npc.WalkingType,
      },
    })
}

func (m *NpcTemplateDbApi) deleteNpc(npcId string) {
  dbClient := m.application.dbClient
  collection := dbClient.db.Collection("npcTemplates")

  collection.UpdateMany(context.TODO(), bson.M{}, bson.M{"$pull": bson.M{"npcRespawns": bson.M{"_id": npcId}}})
}
