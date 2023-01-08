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
			mapFieldPackage := make(map[string]EnginePackageStringArray)
			serializedMapField := make(map[string]string)

			offset := (updateMapFieldAction.BrushSize - 1) / 2
			toSave := make([]MapField, updateMapFieldAction.BrushSize*updateMapFieldAction.BrushSize)
			counter := 0

			for x := -offset; x < offset+1; x++ {
				for y := -offset; y < offset+1; y++ {
					position := strconv.Itoa(updateMapFieldAction.X+x) + ":" + strconv.Itoa(updateMapFieldAction.Y+y)
					service.mapFields[position] = MapField{SpriteId: updateMapFieldAction.SpriteId, X: updateMapFieldAction.X + x, Y: updateMapFieldAction.Y + y}

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

		case deleteMapFieldAction := <-service.mapFieldDeleted:
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
