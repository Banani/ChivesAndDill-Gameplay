package main

import (
	"encoding/json"
	"strconv"
)

type NpcTemplate struct {
	Id                       string          `json:"id" bson:"id"`
	Name                     string          `json:"name" bson:"name"`
	HealthPoints             int32           `json:"healthPoints" bson:"healthPoints"`
	HealthPointsRegeneration int32           `json:"healthPointsRegeneration" bson:"healthPointsRegeneration"`
	SpellPower               int32           `json:"spellPower" bson:"spellPower"`
	SpellPowerRegeneration   int32           `json:"spellPowerRegeneration" bson:"spellPowerRegeneration"`
	MovementSpeed            int32           `json:"movementSpeed" bson:"movementSpeed"`
	Stock                    map[string]bool `json:"stock" bson:"stock"`
	Quests                   map[string]bool `json:"quests" bson:"quests"`
	QuotesEvents             NpcQuoteEvent   `json:"quotesEvents" bson:"quotesEvents"`
}

type NpcQuoteEvent struct {
	Standard QuoteHandler `json:"standard" bson:"standard"`
	OnDying  QuoteHandler `json:"onDying" bson:"onDying"`
}

type QuoteHandler struct {
	Chance int32    `json:"chance" bson:"change"`
	Quotes []string `json:"quotes" bson:"quotes"`
}

type Location struct {
	X int32 `json:"x" bson:"x"`
	Y int32 `json:"y" bson:"y"`
}

type NpcHolder struct {
	Id          string `json:"id" bson:"id"`
	NpcRespawns []Npc  `json:"npcRespawns" bson:"npcRespawns"`
}

type Npc struct {
	Id            string   `json:"id"  bson:"id"`
	Location      Location `json:"location"  bson:"location"`
	NpcTemplateId string   `json:"npcTemplateId"  bson:"npcTemplateId"`
	Time          int32    `json:"time"  bson:"time"`
	WalkingType   string   `json:"walkingType"  bson:"walkingType"`
}

type NpcTemplateService struct {
	application  *Application
	npcTemplates map[string]NpcTemplate
	npcs         map[string]Npc

	actionStream chan TypedAction
}

func (s *NpcTemplateService) processAction(action TypedAction) {
	s.actionStream <- action
}

func (s *NpcTemplateService) init() {
	api := NpcTemplateDbApi{application: s.application}

	s.npcTemplates, s.npcs = api.getNpcTemplates()
}

func (service *NpcTemplateService) handleNewConnection() {
	// TO idzie do kazdego usera :o
	service.application.writter.stream <- prepareUpdatePayload("npcTemplates", service.npcTemplates)
	service.application.writter.stream <- prepareUpdatePayload("npcs", service.npcs)
}

func (service *NpcTemplateService) serve() {
	for {
		action := <-service.actionStream

		if action.ActionType == createNpcTemplate {
			var createNpcTemplateAction CreateNpcTemplateAction
			json.Unmarshal(action.Body, &createNpcTemplateAction)

			npcTemplate := createNpcTemplateAction.NpcTemplate

			api := NpcTemplateDbApi{application: service.application}
			npcTemplate.Id = api.saveNpcTemplate(createNpcTemplateAction.NpcTemplate)

			service.npcTemplates[npcTemplate.Id] = npcTemplate
			service.application.writter.stream <- prepareUpdatePayload("npcTemplates", map[string]NpcTemplate{npcTemplate.Id: npcTemplate})
		}

		if action.ActionType == updateNpcTemplate {
			var updateNpcTemplateAction UpdateNpcTemplateAction
			json.Unmarshal(action.Body, &updateNpcTemplateAction)

			npcTemplate := updateNpcTemplateAction.NpcTemplate

			api := NpcTemplateDbApi{application: service.application}
			api.updateNpcTemplate(updateNpcTemplateAction.NpcTemplate)

			service.npcTemplates[npcTemplate.Id] = npcTemplate
			service.application.writter.stream <- prepareDeletePayload2("npcTemplates", map[string]NpcTemplate{npcTemplate.Id: npcTemplate})
			service.application.writter.stream <- prepareUpdatePayload("npcTemplates", map[string]NpcTemplate{npcTemplate.Id: npcTemplate})
		}

		if action.ActionType == deleteNpcTemplate {
			var deleteNpcTemplateAction DeleteNpcTemplateAction
			json.Unmarshal(action.Body, &deleteNpcTemplateAction)

			api := NpcTemplateDbApi{application: service.application}
			api.deleteNpcTemplate(deleteNpcTemplateAction.NpcTemplateId)

			delete(service.npcTemplates, deleteNpcTemplateAction.NpcTemplateId)
			npcTemplatesToDelete := []string{}

			for npcId, npc := range service.npcs {
				if npc.NpcTemplateId == deleteNpcTemplateAction.NpcTemplateId {
					delete(service.npcs, npcId)
					npcTemplatesToDelete = append(npcTemplatesToDelete, npcId)
				}
			}

			service.application.writter.stream <- prepareDeletePayload("npcTemplates", []string{deleteNpcTemplateAction.NpcTemplateId})
			service.application.writter.stream <- prepareDeletePayload("npcs", npcTemplatesToDelete)
		}

		if action.ActionType == deleteQuest {
			var deleteQuestAction DeleteQuestAction
			json.Unmarshal(action.Body, &deleteQuestAction)

			api := NpcTemplateDbApi{application: service.application}
			api.removeQuestFromNpc(deleteQuestAction.QuestId)

			npcTemplates := make(map[string]NpcTemplate)

			for npcTemplateId, npcTemplate := range service.npcTemplates {
				if _, ok := npcTemplate.Quests[deleteQuestAction.QuestId]; ok {
					delete(npcTemplate.Quests, deleteQuestAction.QuestId)
					npcTemplates[npcTemplateId] = npcTemplate
				}
			}

			// Polaczyc to w jeden payload
			service.application.writter.stream <- prepareDeletePayload2("npcTemplates", npcTemplates)
			service.application.writter.stream <- prepareUpdatePayload("npcTemplates", npcTemplates)
		}

		if action.ActionType == deleteItemTemplate {
			var deleteItemTemplateAction DeleteItemTemplateAction
			json.Unmarshal(action.Body, &deleteItemTemplateAction)

			api := NpcTemplateDbApi{application: service.application}
			api.removeItemFromNpc(deleteItemTemplateAction.ItemTemplateId)

			npcTemplates := make(map[string]NpcTemplate)

			for npcTemplateId, npcTemplate := range service.npcTemplates {
				if _, ok := npcTemplate.Stock[deleteItemTemplateAction.ItemTemplateId]; ok {
					delete(npcTemplate.Stock, deleteItemTemplateAction.ItemTemplateId)
					npcTemplates[npcTemplateId] = npcTemplate
				}
			}

			service.application.writter.stream <- prepareDeletePayload2("npcTemplates", npcTemplates)
			service.application.writter.stream <- prepareUpdatePayload("npcTemplates", npcTemplates)
		}

		if action.ActionType == addNpc {
			var addNpcAction AddNpcAction
			json.Unmarshal(action.Body, &addNpcAction)

			npc := Npc{
				Id:            strconv.Itoa(addNpcAction.X) + ":" + strconv.Itoa(addNpcAction.Y),
				NpcTemplateId: addNpcAction.NpcTemplateId,
				Location: Location{
					X: int32(addNpcAction.X),
					Y: int32(addNpcAction.Y),
				},
				Time:        20000,
				WalkingType: "None",
			}

			api := NpcTemplateDbApi{application: service.application}
			api.addNpc(npc)

			service.npcs[npc.Id] = npc
			service.application.writter.stream <- prepareUpdatePayload("npcs", map[string]Npc{npc.Id: npc})
		}

		if action.ActionType == updateNpc {
			var updateNpcAction UpdateNpcAction
			json.Unmarshal(action.Body, &updateNpcAction)

			npc := updateNpcAction.Npc
			service.npcs[npc.Id] = npc

			api := NpcTemplateDbApi{application: service.application}
			api.updateNpc(npc)

			service.application.writter.stream <- prepareUpdatePayload("npcs", map[string]Npc{npc.Id: npc})
		}

		if action.ActionType == deleteNpc {
			var deleteNpcAction DeleteNpcAction
			json.Unmarshal(action.Body, &deleteNpcAction)

			api := NpcTemplateDbApi{application: service.application}
			api.deleteNpc(deleteNpcAction.NpcId)

			delete(service.npcs, deleteNpcAction.NpcId)
			service.application.writter.stream <- prepareDeletePayload("npcs", []string{deleteNpcAction.NpcId})
		}
	}
}
