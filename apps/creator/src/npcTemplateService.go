package main

import (
	"encoding/json"
	"strconv"
)

type NpcTemplate struct {
	Id                       string `json:"id"`
	Name                     string `json:"name"`
	HealthPoints             int32  `json:"healthPoints"`
	HealthPointsRegeneration int32  `json:"healthPointsRegeneration"`
	SpellPower               int32  `json:"spellPower"`
	SpellPowerRegeneration   int32  `json:"spellPowerRegeneration"`
	MovementSpeed            int32  `json:"movementSpeed"`
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
	createNpcTemplate chan CreateNpcTemplateAction
	addNpc            chan AddNpcAction
	deleteNpc         chan DeleteNpcAction
}

func (s *NpcTemplateService) init() {
	api := NpcTemplateDbApi{application: s.application}

	s.npcTemplates, s.npcs = api.getNpcTemplates()
}

func (service *NpcTemplateService) handleNewConnection() {
	npcTemplatePackage := make(map[string]EnginePackageStringArray)

	serializedNpcTemplateMap := make(map[string]string)
	for key, npcTemplate := range service.npcTemplates {
		jsonSprite, _ := json.Marshal(npcTemplate)
		serializedNpcTemplateMap[key] = string(jsonSprite)
	}
	npcTemplatePackage["npcTemplates"] = EnginePackageStringArray{Data: serializedNpcTemplateMap}

	serializedNpcsMap := make(map[string]string)
	for key, npc := range service.npcs {
		jsonSprite, _ := json.Marshal(npc)
		serializedNpcsMap[key] = string(jsonSprite)
	}
	npcTemplatePackage["npcs"] = EnginePackageStringArray{Data: serializedNpcsMap}

	// TO idzie do kazdego usera :o
	service.application.writter.stream <- npcTemplatePackage
}

func (service *NpcTemplateService) serve() {
	for {
		select {
		case npcTemplateCreateAction := <-service.createNpcTemplate:
			api := NpcTemplateDbApi{application: service.application}
			id := api.saveNpcTemplate(npcTemplateCreateAction.NpcTemplate)

			npcTemplatePackage := make(map[string]EnginePackageStringArray)
			serializedNpcTemplate := make(map[string]string)

			npcTemplate := npcTemplateCreateAction.NpcTemplate
			npcTemplate.Id = id

			jsonNpcTemplate, _ := json.Marshal(npcTemplate)
			serializedNpcTemplate[id] = string(jsonNpcTemplate)

			npcTemplatePackage["npcTemplates"] = EnginePackageStringArray{Data: serializedNpcTemplate}
			service.npcTemplates[id] = npcTemplate
			service.application.writter.stream <- npcTemplatePackage

		case addNpcAction := <-service.addNpc:
			api := NpcTemplateDbApi{application: service.application}
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

			npcsPackage := make(map[string]EnginePackageStringArray)
			serializedNpcs := make(map[string]string)

			jsonNpc, _ := json.Marshal(npc)
			serializedNpcs[npc.Id] = string(jsonNpc)

			npcsPackage["npcs"] = EnginePackageStringArray{Data: serializedNpcs}

			service.npcs[npc.Id] = npc
			api.addNpc(npc)
			service.application.writter.stream <- npcsPackage

		case deleteNpcAction := <-service.deleteNpc:
			api := NpcTemplateDbApi{application: service.application}

			npcsPackage := make(map[string]EnginePackageStringArray)
			serializedNpcs := make(map[string]interface{})

			serializedNpcs[deleteNpcAction.NpcId] = nil

			npcsPackage["npcs"] = EnginePackageStringArray{ToDelete: serializedNpcs}

			delete(service.npcs, deleteNpcAction.NpcId)
			api.deleteNpc(deleteNpcAction.NpcId)
			service.application.writter.stream <- npcsPackage
		}
	}
}
