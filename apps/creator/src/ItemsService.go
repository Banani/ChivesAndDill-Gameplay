package main

import (
	"encoding/json"
	"log"
)

type ItemTemplate struct {
	Type     string `json:"type"`
	Id       string `json:"id"`
	Name     string `json:"name"`
	Image    string `json:"image"`
	Stack    int32  `json:"stack"`
	Value    int32  `json:"value"`
	Slot     string `json:"slot"`
	Armor    int32  `json:"armor"`
	Stamina  int32  `json:"stamina"`
	Agility  int32  `json:"agility"`
	Intelect int32  `json:"intelect"`
	Strength int32  `json:"strength"`
	Spirit   int32  `json:"spirit"`
}

type ItemsService struct {
	application        *Application
	itemTemplates      map[string]ItemTemplate
	createItemTemplate chan CreateItemTemplateAction
}

func (s *ItemsService) init() {
	api := ItemsDbApi{application: s.application}

	s.itemTemplates = api.getItemTemplates()
}

func (service *ItemsService) handleNewConnection() {
	itemsTemplatePackage := make(map[string]EnginePackageStringArray)
	serializedItemsTemplate := make(map[string]string)

	for key, itemTemplate := range service.itemTemplates {
		jsonSprite, _ := json.Marshal(itemTemplate)
		serializedItemsTemplate[key] = string(jsonSprite)
	}
	itemsTemplatePackage["itemTemplates"] = EnginePackageStringArray{Data: serializedItemsTemplate}

	// // TO idzie do kazdego usera :o
	service.application.writter.stream <- itemsTemplatePackage
}

func (service *ItemsService) serve() {
	for {
		select {
		case itemTemplateCreateAction := <-service.createItemTemplate:
			log.Print(itemTemplateCreateAction.ItemTemplate)
			itemTemplate := itemTemplateCreateAction.ItemTemplate
			api := ItemsDbApi{application: service.application}
			itemTemplate.Id = api.saveItemTemplate(itemTemplateCreateAction.ItemTemplate)

			itemsTemplatePackage := make(map[string]EnginePackageStringArray)
			serializedItemsTemplate := make(map[string]string)

			jsonItemTemplate, _ := json.Marshal(itemTemplate)
			serializedItemsTemplate[itemTemplate.Id] = string(jsonItemTemplate)

			itemsTemplatePackage["itemTemplates"] = EnginePackageStringArray{Data: serializedItemsTemplate}
			service.itemTemplates[itemTemplate.Id] = itemTemplate
			service.application.writter.stream <- itemsTemplatePackage
		}
	}
}
