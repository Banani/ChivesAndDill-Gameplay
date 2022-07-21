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
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type EnginePackage struct {
	Data map[string]primitive.M `json:"data"`
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

	output := make(map[string]EnginePackage)
	output["sprites"] = EnginePackage{Data: spriteMap}

	hub := newHub()
	go hub.run()

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		conn, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			log.Println(err)
			return
		}

		converted, _ := json.Marshal(output)
		conn.WriteJSON(string(converted))
	})

	log.Fatal(http.ListenAndServe(":8080", nil))
}
