package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"strconv"
	"time"

	"net/http"

	"github.com/gookit/config/v2"
	"github.com/gookit/config/v2/yaml"
	"github.com/gorilla/websocket"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type EnginePackage struct {
	Data map[string]primitive.M `json:"data"`
}

type EnginePackageStringArray struct {
	Data map[string][]string `json:"data"`
}

var upgrader = websocket.Upgrader{CheckOrigin: func(r *http.Request) bool {
	origin := r.Header.Get("Origin")
	fmt.Println(origin)
	return origin == "http://localhost:4200"
}}

type User struct {
	services *Services
	conn     *websocket.Conn
}

func (u *User) writer() {
	defer func() {
		u.conn.Close()
	}()

	for {
		select {
		case updateMapField := <-u.services.mapFieldService.update:
			u.conn.SetWriteDeadline(time.Now().Add(10 * time.Second))
			mapFields := make(map[string][]string)
			mapFields[strconv.Itoa(updateMapField.X)+":"+strconv.Itoa(updateMapField.Y)] = []string{updateMapField.SpriteId}

			mapFieldPackage := make(map[string]EnginePackageStringArray)
			mapFieldPackage["map"] = EnginePackageStringArray{Data: mapFields}

			err := u.conn.WriteJSON(mapFieldPackage)
			fmt.Println(err)
		}
	}
}

func (u *User) reader() {
	defer func() {
		u.conn.Close()
	}()

	for {
		_, message, err := u.conn.ReadMessage()
		if err != nil {
			log.Printf("Error: %v", err)
		}

		var updateMapField UpdateMapField
		json.Unmarshal(message, &updateMapField)
		u.services.mapFieldService.update <- UpdateMapField{X: updateMapField.X, Y: updateMapField.Y, SpriteId: "ObjectID(\"62d2f43587803a92bd861ca3\")"}
	}
}

type Services struct {
	mapFieldService *MapFieldsService
}

type UpdateMapField struct {
	X        int `json:"x"`
	Y        int `json:"y"`
	SpriteId string
}

type MapFieldsService struct {
	mapFields map[string][]string
	update    chan UpdateMapField
	updated   chan UpdateMapField
}

func (service *MapFieldsService) serve() {
	for {
		select {
		case updateMapField := <-service.update:
			service.mapFields[strconv.Itoa(updateMapField.X)+":"+strconv.Itoa(updateMapField.Y)] = []string{updateMapField.SpriteId}
			fmt.Println(service.mapFields)
			service.updated <- updateMapField
		}
	}
}

func main() {
	config.WithOptions(config.ParseEnv)
	config.AddDriver(yaml.Driver)
	err := config.LoadFiles("./database.yml")

	client, err := mongo.NewClient((options.Client().ApplyURI("mongodb+srv://" + config.String("userName") + ":" + config.String("password") + "@cluster0.bmgp9.mongodb.net/?retryWrites=true&w=majority")))
	if err != nil {
		log.Fatal(err)
	}

	ctx, _ := context.WithTimeout(context.Background(), 10*time.Second)
	err = client.Connect(ctx)
	if err != nil {
		log.Fatal(err)
	}

	defer client.Disconnect(ctx)

	db := client.Database(config.String("database"))
	spritesCollection := db.Collection("sprites")

	cursor, err := spritesCollection.Find(ctx, bson.M{})
	if err != nil {
		log.Fatal(err)
	}
	var sprites []bson.M
	if err = cursor.All(ctx, &sprites); err != nil {
		log.Fatal(err)
	}
	fmt.Println(sprites)

	spriteMap := make(map[string]primitive.M)
	for _, sprite := range sprites {
		spriteMap[sprite["_id"].(primitive.ObjectID).String()] = sprite
	}

	spriteMapPackage := make(map[string]EnginePackage)
	spriteMapPackage["sprites"] = EnginePackage{Data: spriteMap}

	mapFields := make(map[string][]string)
	mapFields["2:0"] = []string{"ObjectID(\"62d2f43587803a92bd861ca3\")"}
	mapFields["2:5"] = []string{"ObjectID(\"62d2f43587803a92bd861ca3\")"}
	mapFields["7:3"] = []string{"ObjectID(\"62d2f43587803a92bd861ca3\")"}
	mapFields["8:2"] = []string{"ObjectID(\"62d2f43587803a92bd861ca3\")"}

	mapFieldPackage := make(map[string]EnginePackageStringArray)
	mapFieldPackage["map"] = EnginePackageStringArray{Data: mapFields}

	mapFieldsService := MapFieldsService{mapFields: mapFields, update: make(chan UpdateMapField, 256)}
	go mapFieldsService.serve()
	services := Services{mapFieldService: &mapFieldsService}

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		conn, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			log.Println(err)
			return
		}

		user := User{conn: conn, services: &services}

		go user.reader()
		go user.writer()

		conn.WriteJSON(spriteMapPackage)
		conn.WriteJSON(mapFieldPackage)
	})

	log.Fatal(http.ListenAndServe(":8080", nil))
}
