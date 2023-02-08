package main

import (
	"strconv"
	"encoding/json"
)

type NpcTemplate struct {
	Id                       string          `json:"id"`
	Name                     string          `json:"name"`
	HealthPoints             int32           `json:"healthPoints"`
	HealthPointsRegeneration int32           `json:"healthPointsRegeneration"`
	SpellPower               int32           `json:"spellPower"`
	SpellPowerRegeneration   int32           `json:"spellPowerRegeneration"`
	MovementSpeed            int32           `json:"movementSpeed"`
	Stock                    map[string]bool `json:"stock"`
	Quests                   map[string]bool `json:"quests"`
}

type Location struct {
	X int32 `json:"x"`
	Y int32 `json:"y"`
}

type Npc struct {
	Id            string   `json:"id"`
	Location      Location `json:"location"`
	NpcTemplateId string   `json:"npcTemplateId"`
	Time          int32    `json:"time"`
	WalkingType   string   `json:"walkingType"`
}

type NpcTemplateService struct {
	application       *Application
	npcTemplates      map[string]NpcTemplate
	npcs              map[string]Npc

	actionStream chan TypedAction
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
			service.application.writter.stream <- prepareUpdatePayload("npcTemplates", map[string]Npc{npc.Id: npc})
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
