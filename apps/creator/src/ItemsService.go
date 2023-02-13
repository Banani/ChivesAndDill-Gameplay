package main

import "encoding/json"

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
