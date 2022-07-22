package main

import (
	"context"
	"fmt"
	"log"
	"time"

	"encoding/json"
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
	mapFields["2:0"] = []string{"1"}
	mapFields["2:5"] = []string{"2"}
	mapFields["7:3"] = []string{"1"}
	mapFields["8:2"] = []string{"2"}

	mapFieldPackage := make(map[string]EnginePackageStringArray)
	mapFieldPackage["map"] = EnginePackageStringArray{Data: mapFields}

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		conn, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			log.Println(err)
			return
		}

		converted, _ := json.Marshal(spriteMapPackage)
		conn.WriteJSON(string(converted))

		convertedMapField, _ := json.Marshal(mapFieldPackage)
		conn.WriteJSON(string(convertedMapField))
	})

	log.Fatal(http.ListenAndServe(":8080", nil))
}
