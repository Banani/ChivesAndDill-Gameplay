package main

import (
	"encoding/json"
)

type SpriteGroup struct {
	Id               string          `json:"id" bson:"-"`
	Name             string          `json:"name" bson:"name"`
	SpriteAssignment map[string]bool `json:"spriteAssignment" bson:"spriteAssignment"`
}

type SpriteGroupsService struct {
	application  *Application
	SpriteGroups map[string]SpriteGroup

	actionStream chan TypedAction
}

func (s *SpriteGroupsService) processAction(action TypedAction) {
	s.actionStream <- action
}

func (s *SpriteGroupsService) init() {
	api := SpriteGroupsDbApi{application: s.application}

	s.SpriteGroups = api.getSpriteGroups()
}

func (service *SpriteGroupsService) handleNewConnection() {
	// // TO idzie do kazdego usera :o
	service.application.writter.stream <- prepareUpdatePayload("spriteGroups", service.SpriteGroups)
}

func (service *SpriteGroupsService) serve() {
	for {
		action := <-service.actionStream

		if action.ActionType == createSpriteGroup {
			var createSpriteGroupAction CreateSpriteGroupAction
			json.Unmarshal(action.Body, &createSpriteGroupAction)

			spriteGroup := createSpriteGroupAction.SpriteGroup

			api := SpriteGroupsDbApi{application: service.application}
			spriteGroup.Id = api.saveSpriteGroup(spriteGroup)

			service.SpriteGroups[spriteGroup.Id] = spriteGroup
			service.application.writter.stream <- prepareUpdatePayload("spriteGroups", map[string]SpriteGroup{spriteGroup.Id: spriteGroup})
		}

		if action.ActionType == deleteSpriteGroup {
			var deleteSpriteGroupAction DeleteSpriteGroupAction
			json.Unmarshal(action.Body, &deleteSpriteGroupAction)

			api := SpriteGroupsDbApi{application: service.application}
			api.deleteSpriteGroup(deleteSpriteGroupAction.Id)

			delete(service.SpriteGroups, deleteSpriteGroupAction.Id)
			service.application.writter.stream <- prepareDeletePayload("spriteGroups", []string{deleteSpriteGroupAction.Id})

		}

		if action.ActionType == updateSpriteGroup {
			var updateSpriteGroupAction UpdateSpriteGroupAction
			json.Unmarshal(action.Body, &updateSpriteGroupAction)

			spriteGroup := updateSpriteGroupAction.SpriteGroup

			api := SpriteGroupsDbApi{application: service.application}
			api.updateSpriteGroup(spriteGroup)

			service.SpriteGroups[spriteGroup.Id] = spriteGroup
			service.application.writter.stream <- prepareDeletePayload2("spriteGroups", map[string]SpriteGroup{spriteGroup.Id: spriteGroup})
			service.application.writter.stream <- prepareUpdatePayload("spriteGroups", map[string]SpriteGroup{spriteGroup.Id: spriteGroup})
		}
	}
}
