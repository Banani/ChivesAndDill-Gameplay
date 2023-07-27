package main

import (
	"encoding/json"
	"strconv"
)

type MonsterTemplate struct {
	Id                       string          `json:"id" bson:"-"`
	Name                     string          `json:"name" bson:"name"`
	HealthPoints             int32           `json:"healthPoints" bson:"healthPoints"`
	HealthPointsRegeneration int32           `json:"healthPointsRegeneration" bson:"healthPointsRegeneration"`
	SpellPower               int32           `json:"spellPower" bson:"spellPower"`
	SpellPowerRegeneration   int32           `json:"spellPowerRegeneration" bson:"spellPowerRegeneration"`
	MovementSpeed            int32           `json:"movementSpeed" bson:"movementSpeed"`
	SightRange               int32           `json:"sightRange" bson:"sightRange"`
	DesiredRange             int32           `json:"desiredRange" bson:"desiredRange"`
	EscapeRange              int32           `json:"escapeRange" bson:"escapeRange"`
	AttackFrequency          int32           `json:"attackFrequency" bson:"attackFrequency"`
	Spells                   map[string]bool `json:"spells" bson:"spells"`
	// TO CHANGE
	DropSchema   DropSchema        `json:"dropSchema" bson:"dropSchema"`
	QuotesEvents MonsterQuoteEvent `json:"quotesEvents" bson:"quotesEvents"`
}

type MonsterQuoteEvent struct {
	Standard  QuoteHandler `json:"standard" bson:"standard"`
	OnDying   QuoteHandler `json:"onDying" bson:"onDying"`
	OnKilling QuoteHandler `json:"onKilling" bson:"onKilling"`
	OnPulling QuoteHandler `json:"onPulling" bson:"onPulling"`
}

type DropSchema struct {
	Items map[string]ItemDropDetails `json:"items" bson:"items"`
	Coins ItemDropDetails            `json:"coins" bson:"coins"`
}

type ItemDropDetails struct {
	DropChance     int32  `json:"dropChance" bson:"dropChance"`
	MaxAmount      int32  `json:"maxAmount" bson:"maxAmount"`
	MinAmount      int32  `json:"minAmount" bson:"minAmount"`
	ItemTemplateId string `json:"itemTemplateId" bson:"itemTemplateId"`
}

type MonsterHolder struct {
	Id              string    `json:"id" bson:"id"`
	MonsterRespawns []Monster `json:"monsterRespawns" bson:"monsterRespawns"`
}

type Monster struct {
	Id                string     `json:"id" bson:"id"`
	Location          Location   `json:"location" bson:"location"`
	MonsterTemplateId string     `json:"monsterTemplateId" bson:"-"`
	Time              int32      `json:"time" bson:"time"`
	WalkingType       string     `json:"walkingType" bson:"walkingType"`
	PatrolPath        []Location `json:"patrolPath" bson:"patrolPath"`
}

type MonsterTemplateService struct {
	application      *Application
	monsterTemplates map[string]MonsterTemplate
	monsters         map[string]Monster

	actionStream chan TypedAction
}

func (s *MonsterTemplateService) processAction(action TypedAction) {
	s.actionStream <- action
}

func (s *MonsterTemplateService) init() {
	api := MonsterTemplateDbApi{application: s.application}

	s.monsterTemplates, s.monsters = api.getMonsterTemplates()
}

func (service *MonsterTemplateService) handleNewConnection() {
	// TO idzie do kazdego usera :o
	service.application.writter.stream <- prepareUpdatePayload("monsterTemplates", service.monsterTemplates)
	service.application.writter.stream <- prepareUpdatePayload("monsters", service.monsters)
}

func (service *MonsterTemplateService) serve() {
	for {
		action := <-service.actionStream

		if action.ActionType == createMonsterTemplate {
			var createMonsterTemplateAction CreateMonsterTemplateAction
			json.Unmarshal(action.Body, &createMonsterTemplateAction)

			monsterTemplate := createMonsterTemplateAction.CharacterTemplate

			api := MonsterTemplateDbApi{application: service.application}
			monsterTemplate.Id = api.saveMonsterTemplate(monsterTemplate)

			service.monsterTemplates[monsterTemplate.Id] = monsterTemplate
			service.application.writter.stream <- prepareUpdatePayload("monsterTemplates", map[string]MonsterTemplate{monsterTemplate.Id: monsterTemplate})
		}

		if action.ActionType == updateMonsterTemplate {
			var updateMonsterTemplateAction UpdateMonsterTemplateAction
			json.Unmarshal(action.Body, &updateMonsterTemplateAction)

			monsterTemplate := updateMonsterTemplateAction.MonsterTemplate

			api := MonsterTemplateDbApi{application: service.application}
			api.updateMonsterTemplate(updateMonsterTemplateAction.MonsterTemplate)

			service.monsterTemplates[monsterTemplate.Id] = monsterTemplate
			service.application.writter.stream <- prepareDeletePayload2("monsterTemplates", map[string]MonsterTemplate{monsterTemplate.Id: monsterTemplate})
			service.application.writter.stream <- prepareUpdatePayload("monsterTemplates", map[string]MonsterTemplate{monsterTemplate.Id: monsterTemplate})
		}

		if action.ActionType == deleteMonsterTemplate {
			var deleteMonsterTemplateAction DeleteMonsterTemplateAction
			json.Unmarshal(action.Body, &deleteMonsterTemplateAction)

			api := MonsterTemplateDbApi{application: service.application}
			api.deleteMonsterTemplate(deleteMonsterTemplateAction.MonsterTemplateId)

			delete(service.monsterTemplates, deleteMonsterTemplateAction.MonsterTemplateId)
			monsterTemplatesToDelete := []string{}

			for monsterId, monster := range service.monsters {
				if monster.MonsterTemplateId == deleteMonsterTemplateAction.MonsterTemplateId {
					delete(service.monsters, monsterId)
					monsterTemplatesToDelete = append(monsterTemplatesToDelete, monsterId)
				}
			}

			service.application.writter.stream <- prepareDeletePayload("monsterTemplates", []string{deleteMonsterTemplateAction.MonsterTemplateId})
			service.application.writter.stream <- prepareDeletePayload("monsters", monsterTemplatesToDelete)
		}

		if action.ActionType == deleteItemTemplate {
			//var deleteItemTemplateAction DeleteItemTemplateAction
			//json.Unmarshal(action.Body, &deleteItemTemplateAction)
			//
			//api := MonsterTemplateDbApi{application: service.application}
			//api.removeItemFromMonster(deleteItemTemplateAction.ItemTemplateId)
			//
			//monsterTemplates := make(map[string]MonsterTemplate)
			//
			//for monsterTemplateId, monsterTemplate := range service.monsterTemplates {
			//	if _, ok := monsterTemplate.Stock[deleteItemTemplateAction.ItemTemplateId]; ok {
			//		delete(monsterTemplate.Stock, deleteItemTemplateAction.ItemTemplateId)
			//		monsterTemplates[monsterTemplateId] = monsterTemplate
			//	}
			//}
			//
			//service.application.writter.stream <- prepareDeletePayload2("monsterTemplates", monsterTemplates)
			//service.application.writter.stream <- prepareUpdatePayload("monsterTemplates", monsterTemplates)
		}

		if action.ActionType == addMonster {
			var addMonsterAction AddMonsterAction
			json.Unmarshal(action.Body, &addMonsterAction)

			monster := Monster{
				Id:                strconv.Itoa(addMonsterAction.X) + ":" + strconv.Itoa(addMonsterAction.Y),
				MonsterTemplateId: addMonsterAction.MonsterTemplateId,
				Location: Location{
					X: int32(addMonsterAction.X),
					Y: int32(addMonsterAction.Y),
				},
				Time:        20000,
				WalkingType: "None",
			}

			api := MonsterTemplateDbApi{application: service.application}
			api.addMonster(monster)

			service.monsters[monster.Id] = monster
			service.application.writter.stream <- prepareUpdatePayload("monsters", map[string]Monster{monster.Id: monster})
		}

		if action.ActionType == updateMonster {
			var updateMonsterAction UpdateMonsterAction
			json.Unmarshal(action.Body, &updateMonsterAction)

			monster := updateMonsterAction.Monster
			service.monsters[monster.Id] = monster

			api := MonsterTemplateDbApi{application: service.application}
			api.updateMonster(monster)

			service.application.writter.stream <- prepareUpdatePayload("monsters", map[string]Monster{monster.Id: monster})
		}

		if action.ActionType == deleteMonster {
			var deleteMonsterAction DeleteMonsterAction
			json.Unmarshal(action.Body, &deleteMonsterAction)

			api := MonsterTemplateDbApi{application: service.application}
			api.deleteMonster(deleteMonsterAction.MonsterId)

			delete(service.monsters, deleteMonsterAction.MonsterId)
			service.application.writter.stream <- prepareDeletePayload("monsters", []string{deleteMonsterAction.MonsterId})
		}
	}
}
