package main

import (
	"context"
	"fmt"
	"log"
	"time"

	"github.com/gookit/config/v2"
	"github.com/gookit/config/v2/yaml"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

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
}
