package main

import (
	"encoding/json"
)

type ItemTemplate struct {
	Type           string `json:"type"`
	Id             string `json:"id" bson:"-"`
	Name           string `json:"name"`
	Description    string `json:"description"`
	Image          string `json:"image"`
	Stack          int32  `json:"stack"`
	Value          int32  `json:"value"`
	Slot           string `json:"slot,omitempty" bson:"slot,omitempty"`
	Armor          int32  `json:"armor,omitempty" bson:"armor,omitempty"`
	Stamina        int32  `json:"stamina,omitempty" bson:"stamina,omitempty"`
	Agility        int32  `json:"agility,omitempty" bson:"agility,omitempty"`
	Intelect       int32  `json:"intelect,omitempty" bson:"intelect,omitempty"`
	Strength       int32  `json:"strength,omitempty" bson:"strength,omitempty"`
	Spirit         int32  `json:"spirit,omitempty" bson:"spirit,omitempty"`
	Haste          int32  `json:"haste,omitempty" bson:"haste,omitempty"`
	CriticalStrike int32  `json:"criticalStrike,omitempty" bson:"criticalStrike,omitempty"`
	Dodge          int32  `json:"dodge,omitempty" bson:"dodge,omitempty"`
	Block          int32  `json:"block,omitempty" bson:"block,omitempty"`
}

type ItemsService struct {
	application   *Application
	itemTemplates map[string]ItemTemplate

	actionStream chan TypedAction
}

func (s *ItemsService) processAction(action TypedAction) {
	s.actionStream <- action
}

func (s *ItemsService) init() {
	api := ItemsDbApi{application: s.application}

	s.itemTemplates = api.getItemTemplates()
}

func (service *ItemsService) handleNewConnection() {
	// // TO idzie do kazdego usera :o
	service.application.writter.stream <- prepareUpdatePayload("itemTemplates", service.itemTemplates)
}

func (service *ItemsService) serve() {
	for {
		action := <-service.actionStream

		if action.ActionType == createItemTemplate {
			var createItemTemplateAction CreateItemTemplateAction
			json.Unmarshal(action.Body, &createItemTemplateAction)

			itemTemplate := createItemTemplateAction.ItemTemplate

			api := ItemsDbApi{application: service.application}
			itemTemplate.Id = api.saveItemTemplate(itemTemplate)

			service.itemTemplates[itemTemplate.Id] = itemTemplate
			service.application.writter.stream <- prepareUpdatePayload("itemTemplates", map[string]ItemTemplate{itemTemplate.Id: itemTemplate})
		}

		if action.ActionType == deleteItemTemplate {
			var deleteItemTemplateAction DeleteItemTemplateAction
			json.Unmarshal(action.Body, &deleteItemTemplateAction)

			api := ItemsDbApi{application: service.application}
			api.deleteItemTemplate(deleteItemTemplateAction.ItemTemplateId)

			delete(service.itemTemplates, deleteItemTemplateAction.ItemTemplateId)
			service.application.writter.stream <- prepareDeletePayload("itemTemplates", []string{deleteItemTemplateAction.ItemTemplateId})

		}

		if action.ActionType == updateItemTemplate {
			var updateItemTemplateAction UpdateItemTemplateAction
			json.Unmarshal(action.Body, &updateItemTemplateAction)

			itemTemplate := updateItemTemplateAction.ItemTemplate

			api := ItemsDbApi{application: service.application}
			api.updateItemTemplate(itemTemplate)

			service.itemTemplates[itemTemplate.Id] = itemTemplate
			service.application.writter.stream <- prepareUpdatePayload("itemTemplates", map[string]ItemTemplate{itemTemplate.Id: itemTemplate})
		}
	}
}
