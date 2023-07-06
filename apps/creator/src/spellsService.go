package main

import "encoding/json"

type Spell struct {
	Id                   string                          `json:"id" bson:"-"`
	Name                 string                          `json:"name"`
	Type                 string                          `json:"type"`
	Image                string                          `json:"image"`
	Description          string                          `json:"description" bson:"description"`
	Range                int32                           `json:"range" bson:"range"`
	SpellPowerCost       int32                           `json:"spellPowerCost" bson:"spellPowerCost"`
	Cooldown             int32                           `json:"cooldown" bson:"cooldown"`
	Speed                int32                           `json:"speed,omitempty" bson:"speed,omitempty"`
	Angle                int32                           `json:"angle,omitempty" bson:"angle,omitempty"`
	SpellEffectsOnTarget map[string]SpellEffectsOnTarget `json:"spellEffectsOnTarget,omitempty" bson:"spellEffectsOnTarget,omitempty"`
}

type SpellEffectsOnTarget struct {
	Type                string                          `json:"type"`
	Amount              int32                           `json:"amount,omitempty" bson:"amount,omitempty"`
	Name                string                          `json:"name,omitempty" bson:"name,omitempty"`
	Description         string                          `json:"description,omitempty" bson:"description,omitempty"`
	ShieldValue         int32                           `json:"shieldValue,omitempty" bson:"shieldValue,omitempty"`
	Period              int32                           `json:"period,omitempty" bson:"period,omitempty"`
	ActivationFrequency int32                           `json:"activationFrequency,omitempty" bson:"activationFrequency,omitempty"`
	Stack               int32                           `json:"stack,omitempty" bson:"stack,omitempty"`
	TimeEffectType      string                          `json:"timeEffectType,omitempty" bson:"timeEffectType,omitempty"`
	IconImage           string                          `json:"iconImage,omitempty" bson:"iconImage,omitempty"`
	Radius              int32                           `json:"radius,omitempty" bson:"radius,omitempty"`
	AreaType            string                          `json:"areaType,omitempty" bson:"areaType,omitempty"`
	SpellEffects        map[string]SpellEffectsOnTarget `json:"spellEffects,omitempty" bson:"spellEffects,omitempty"`
}

type SpellsService struct {
	application *Application
	spells      map[string]Spell

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
