package main

import "encoding/json"

type NpcTemplate struct {
	Id                       string `json:"id"`
	Name                     string `json:"name"`
	HealthPoints             int32  `json:"healthPoints"`
	HealthPointsRegeneration int32  `json:"healthPointsRegeneration"`
	SpellPower               int32  `json:"spellPower"`
	SpellPowerRegeneration   int32  `json:"spellPowerRegeneration"`
	MovementSpeed            int32  `json:"movementSpeed"`
}

type NpcTemplateService struct {
	application       *Application
	npcTemplates      map[string]NpcTemplate
	createNpcTemplate chan CreateNpcTemplateAction
}

func (s *NpcTemplateService) init() {
	api := NpcTemplateDbApi{application: s.application}

	s.npcTemplates = api.getNpcTemplates()
}

func (service *NpcTemplateService) handleNewConnection() {
	npcTemplatePackage := make(map[string]EnginePackageStringArray)
	serializedNpcTemplateMap := make(map[string]string)
	for key, npcTemplate := range service.npcTemplates {
		jsonSprite, _ := json.Marshal(npcTemplate)
		serializedNpcTemplateMap[key] = string(jsonSprite)
	}

	npcTemplatePackage["npcTemplates"] = EnginePackageStringArray{Data: serializedNpcTemplateMap}

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

			service.npcTemplates[id] = npcTemplate
			npcTemplatePackage["npcTemplates"] = EnginePackageStringArray{Data: serializedNpcTemplate}
			service.application.writter.stream <- npcTemplatePackage
		}
	}
}
