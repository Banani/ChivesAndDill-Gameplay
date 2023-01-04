package main

import (
	"encoding/json"
	"strconv"
)

type Sprite struct {
	X           int    `json:"x"`
	Y           int    `json:"y"`
	SpriteId    string `json:"spriteId"`
	SpriteSheet string `json:"spriteSheet"`
}

type MapField struct {
	SpriteId string `json:"spriteId"`
	X        int    `json:"x"`
	Y        int    `json:"y"`
}

type MapFieldsService struct {
	application     *Application
	mapFields       map[string]MapField
	sprites         map[string]Sprite
	mapFieldUpdated chan UpdateMapFieldAction
	mapFieldDeleted chan DeleteMapFieldAction
}

func (s *MapFieldsService) init() {
	api := MapFieldDbApi{application: s.application}

	s.mapFields = api.getMapFields()
	s.sprites = api.getSprites()
}

func (service *MapFieldsService) handleNewConnection() {
	mapFieldPackage := make(map[string]EnginePackageStringArray)
	serializedMapField := make(map[string]string)
	for key, mapField := range service.mapFields {
		jsonSprite, _ := json.Marshal(mapField)
		serializedMapField[key] = string(jsonSprite)
	}
	mapFieldPackage["map"] = EnginePackageStringArray{Data: serializedMapField}

	service.application.writter.stream <- mapFieldPackage

	spritesPackage := make(map[string]EnginePackageStringArray)
	serializedSpriteMap := make(map[string]string)
	for key, sprite := range service.sprites {
		jsonSprite, _ := json.Marshal(sprite)
		serializedSpriteMap[key] = string(jsonSprite)
	}
	spritesPackage["sprites"] = EnginePackageStringArray{Data: serializedSpriteMap}

	service.application.writter.stream <- spritesPackage
}

func (service *MapFieldsService) serve() {
	for {
		select {
		case updateMapFieldAction := <-service.mapFieldUpdated:
			position := strconv.Itoa(updateMapFieldAction.X) + ":" + strconv.Itoa(updateMapFieldAction.Y)
			service.mapFields[position] = MapField{SpriteId: updateMapFieldAction.SpriteId, X: updateMapFieldAction.X, Y: updateMapFieldAction.Y}

			mapFieldPackage := make(map[string]EnginePackageStringArray)
			serializedMapField := make(map[string]string)
			jsonSprite, _ := json.Marshal(service.mapFields[position])
			serializedMapField[position] = string(jsonSprite)
			mapFieldPackage["map"] = EnginePackageStringArray{Data: serializedMapField}

			api := MapFieldDbApi{application: service.application}
			api.saveMapField(service.mapFields[position])
			service.application.writter.stream <- mapFieldPackage

		case deleteMapFieldAction := <-service.mapFieldDeleted:
			position := strconv.Itoa(deleteMapFieldAction.X) + ":" + strconv.Itoa(deleteMapFieldAction.Y)
			delete(service.mapFields, position)

			mapFieldPackage := make(map[string]EnginePackageStringArray)
			serializedMapField := make(map[string]interface{})
			serializedMapField[position] = nil
			mapFieldPackage["map"] = EnginePackageStringArray{ToDelete: serializedMapField}

			api := MapFieldDbApi{application: service.application}
			api.deleteMapField(position)
			service.application.writter.stream <- mapFieldPackage

		}
	}
}
