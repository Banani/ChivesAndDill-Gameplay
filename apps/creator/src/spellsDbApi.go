package main

import (
	"context"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type SpellsDbApi struct {
	application *Application
}

func updateEffectIds(effects map[string]SpellEffectsOnTarget) {
	for key, effect := range effects {
		if effect.Id == "" {
			effect.Id = primitive.NewObjectID().Hex()
			effects[key] = effect
		}

		updateEffectIds(effect.SpellEffects)
	}
}

func (m *SpellsDbApi) saveSpell(spell Spell) string {
	dbClient := m.application.dbClient
	collection := dbClient.db.Collection("spells")

	updateEffectIds(spell.SpellEffectsOnTarget)

	record, _ := collection.InsertOne(context.TODO(), spell)

	return record.InsertedID.(primitive.ObjectID).Hex()
}

func (m *SpellsDbApi) updateSpell(spell Spell) {
	dbClient := m.application.dbClient
	collection := dbClient.db.Collection("spells")

	updateEffectIds(spell.SpellEffectsOnTarget)

	toSave := bson.D{{"$set", spell}}

	objectId, _ := primitive.ObjectIDFromHex(spell.Id)
	collection.UpdateOne(context.TODO(), bson.M{"_id": objectId}, toSave)
}

func (m *SpellsDbApi) getSpells() map[string]Spell {
	return getAllItemsFromDb[Spell](m.application.dbClient, "spells")
}

func (m *SpellsDbApi) deleteSpell(spellId string) {
	dbClient := m.application.dbClient
	collection := dbClient.db.Collection("spells")

	objectId, _ := primitive.ObjectIDFromHex(spellId)
	collection.DeleteMany(context.TODO(), bson.M{"_id": bson.M{"$in": []primitive.ObjectID{objectId}}})
}
