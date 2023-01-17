package main

import (
	"context"
	"log"
	"time"

	"github.com/gookit/config/v2"
	"github.com/gookit/config/v2/yaml"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type DBClient struct {
	db     *mongo.Database
	ctx    context.Context
	client *mongo.Client
}

func (dbClient *DBClient) startConnection() {
	config.WithOptions(config.ParseEnv)
	config.AddDriver(yaml.Driver)
	err := config.LoadFiles("../database.yml")

	client, err := mongo.NewClient((options.Client().ApplyURI("mongodb+srv://" + config.String("userName") + ":" + config.String("password") + "@cluster0.bmgp9.mongodb.net/?retryWrites=true&w=majority")))
	if err != nil {
		log.Fatal(err)
	}
	dbClient.client = client

	ctx, _ := context.WithTimeout(context.Background(), 10*time.Second)
	dbClient.ctx = ctx

	err = client.Connect(ctx)
	if err != nil {
		log.Fatal(err)
	}
	dbClient.db = client.Database(config.String("database"))
}

func (dbClient *DBClient) closeConnection() {
	dbClient.client.Disconnect(dbClient.ctx)
}
