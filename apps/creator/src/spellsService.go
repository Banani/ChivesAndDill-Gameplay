package main

import "encoding/json"

type Spell struct {
	Id          string `json:"id" bson:"-"`
	Name        string `json:"name"`
	Image       string `json:"image"`
}

type SpellsService struct {
	application   *Application
	spells map[string]Spell

	actionStream chan TypedAction
}

func (s *SpellsService) processAction(action TypedAction) {
	s.actionStream <- action
}

func (s *SpellsService) init() {
	api := SpellsDbApi{application: s.application}

	s.spells = api.getSpells()
}

func (service *SpellsService) handleNewConnection() {
	// // TO idzie do kazdego usera :o
	service.application.writter.stream <- prepareUpdatePayload("spells", service.spells)
}

func (service *SpellsService) serve() {
	for {
		action := <-service.actionStream

		if action.ActionType == createSpell {
			var createSpellAction CreateSpellAction
			json.Unmarshal(action.Body, &createSpellAction)

			spell := createSpellAction.Spell

			api := SpellsDbApi{application: service.application}
			spell.Id = api.saveSpell(spell)

			service.spells[spell.Id] = spell
			service.application.writter.stream <- prepareUpdatePayload("spells", map[string]Spell{spell.Id: spell})
		}

		if action.ActionType == deleteSpell {
			var deleteSpellAction DeleteSpellAction
			json.Unmarshal(action.Body, &deleteSpellAction)

			api := SpellsDbApi{application: service.application}
			api.deleteSpell(deleteSpellAction.SpellId)

			delete(service.spells, deleteSpellAction.SpellId)
			service.application.writter.stream <- prepareDeletePayload("spells", []string{deleteSpellAction.SpellId})

		}

		if action.ActionType == updateSpell {
			var updateSpellAction UpdateSpellAction
			json.Unmarshal(action.Body, &updateSpellAction)

			spell := updateSpellAction.Spell

			api := SpellsDbApi{application: service.application}
			api.updateSpell(spell)

			service.spells[spell.Id] = spell
			service.application.writter.stream <- prepareUpdatePayload("spells", map[string]Spell{spell.Id: spell})
		}
	}
}
