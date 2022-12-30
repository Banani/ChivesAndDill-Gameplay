package main

import "encoding/json"

type Sprite struct {
	X           int    `json:"x"`
	Y           int    `json:"y"`
	SpriteId    string `json:"spriteId"`
	SpriteSheet string `json:"spriteSheet"`
}

type MapField struct {
	Id string `json:"id"`
}

type MapFieldsService struct {
	application *Application
	mapFields   map[string]MapField
	sprites     map[string]Sprite
	update      chan Sprite
	updated     chan Sprite
}

func (s *MapFieldsService) init() {
	api := MapFieldDbApi{application: s.application}

	s.mapFields = api.getMapFields()
	s.sprites = api.getSprites()
}

func (m *MapFieldsService) handleNewConnection() {
	mapFieldPackage := make(map[string]EnginePackageStringArray)
	serializedMapField := make(map[string]string)
	for key, mapField := range m.mapFields {
		jsonSprite, _ := json.Marshal(mapField)
		serializedMapField[key] = string(jsonSprite)
	}
	mapFieldPackage["map"] = EnginePackageStringArray{Data: serializedMapField}

	m.application.writter.stream <- mapFieldPackage

	spritesPackage := make(map[string]EnginePackageStringArray)
	serializedSpriteMap := make(map[string]string)
	for key, sprite := range m.sprites {
		jsonSprite, _ := json.Marshal(sprite)
		serializedSpriteMap[key] = string(jsonSprite)
	}
	spritesPackage["sprites"] = EnginePackageStringArray{Data: serializedSpriteMap}

	m.application.writter.stream <- spritesPackage
}

func (service *MapFieldsService) serve() {
	// for {
	// 	select {
	// 	case updateMapField := <-service.update:
	// 		service.mapFields[strconv.Itoa(updateMapField.X)+":"+strconv.Itoa(updateMapField.Y)] = []string{updateMapField.SpriteId}
	// 		service.updated <- updateMapField
	// 	}
	// }
}
