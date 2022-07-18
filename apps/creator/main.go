package main

import (
	"context"
	"fmt"
	"log"
	"time"

	"net/http"

	"github.com/gookit/config/v2"
	"github.com/gookit/config/v2/yaml"
	"github.com/gorilla/websocket"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		origin := r.Header.Get("Origin")
		fmt.Println(origin)
		return origin == "http://localhost:4200"
	},
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

	http.HandleFunc("/echo", func(w http.ResponseWriter, r *http.Request) {
		(w).Header().Set("Access-Control-Allow-Origin", "*")
		conn, _ := upgrader.Upgrade(w, r, nil) // error ignored for sake of simplicity

		for {
			// Read message from browser
			_, msg, err := conn.ReadMessage()
			if err != nil {
				return
			}

			// Print the message to the console
			fmt.Printf("%s sent: %s\n", conn.RemoteAddr(), string(msg))

			// Write message back to browser
			// if err = conn.WriteMessage(msgType, msg); err != nil {
			// 	return
			// }
		}
	})

	http.ListenAndServe(":8080", nil)
}
