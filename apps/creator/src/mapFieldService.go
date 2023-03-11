package main

import (
	"encoding/json"
	"strconv"
)

type Sprite struct {
	X           int    `json:"x"`
	Y           int    `json:"y"`
	Id          string `json:"id"`
	SpriteSheet string `json:"spriteSheet"`
}

type MapField struct {
	Id       string `json:"id" bson:"-"`
	SpriteId string `json:"spriteId"`
	X        int32  `json:"x"`
	Y        int32  `json:"y"`
}

type MapFieldsService struct {
	application     *Application
	mapFields       map[string]MapField
	sprites         map[string]Sprite
	mapFieldUpdated chan UpdateMapFieldAction
	mapFieldDeleted chan DeleteMapFieldAction
	actionStream    chan TypedAction
}

func (s *MapFieldsService) processAction(action TypedAction) {
	s.actionStream <- action
}

func (s *MapFieldsService) init() {
	api := MapFieldDbApi{application: s.application}

	s.mapFields = api.getMapFields()
	s.sprites = api.getSprites()
}

func (service *MapFieldsService) handleNewConnection() {
	// TO idzie do kazdego usera :o
	service.application.writter.stream <- prepareUpdatePayload("map", service.mapFields)
	service.application.writter.stream <- prepareUpdatePayload("sprites", service.sprites)
}

func (service *MapFieldsService) serve() {
	for {
		action := <-service.actionStream

		if action.ActionType == updateMapField {
			var updateMapFieldAction UpdateMapFieldAction
			json.Unmarshal(action.Body, &updateMapFieldAction)

			mapFieldPackage := make(map[string]EnginePackageStringArray)
			serializedMapField := make(map[string]string)

			offset := (updateMapFieldAction.BrushSize - 1) / 2
			toSave := make([]MapField, updateMapFieldAction.BrushSize*updateMapFieldAction.BrushSize)
			counter := 0

			for x := -offset; x < offset+1; x++ {
				for y := -offset; y < offset+1; y++ {
					position := strconv.Itoa(updateMapFieldAction.X+x) + ":" + strconv.Itoa(updateMapFieldAction.Y+y)
					service.mapFields[position] = MapField{SpriteId: updateMapFieldAction.SpriteId, X: int32(updateMapFieldAction.X + x), Y: int32(updateMapFieldAction.Y + y)}

					toSave[counter] = service.mapFields[position]
					counter++
					jsonSprite, _ := json.Marshal(service.mapFields[position])
					serializedMapField[position] = string(jsonSprite)
				}
			}

			mapFieldPackage["map"] = EnginePackageStringArray{Data: serializedMapField}

			api := MapFieldDbApi{application: service.application}
			api.saveMapField(toSave)
			service.application.writter.stream <- mapFieldPackage
		}

		if action.ActionType == deleteMapField {
			var deleteMapFieldAction DeleteMapFieldAction
			json.Unmarshal(action.Body, &deleteMapFieldAction)

			mapFieldPackage := make(map[string]EnginePackageStringArray)
			serializedMapField := make(map[string]interface{})

			offset := (deleteMapFieldAction.BrushSize - 1) / 2

			for x := -offset; x < offset+1; x++ {
				for y := -offset; y < offset+1; y++ {
					position := strconv.Itoa(x+deleteMapFieldAction.X) + ":" + strconv.Itoa(y+deleteMapFieldAction.Y)
					delete(service.mapFields, position)
					serializedMapField[position] = nil
				}
			}

			mapFieldPackage["map"] = EnginePackageStringArray{ToDelete: serializedMapField}

			api := MapFieldDbApi{application: service.application}
			api.deleteMapField(serializedMapField)
			service.application.writter.stream <- mapFieldPackage
		}
	}
}
