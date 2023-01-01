package main

import (
	"fmt"
	"log"

	"net/http"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{CheckOrigin: func(r *http.Request) bool {
	origin := r.Header.Get("Origin")
	fmt.Println(origin)
	return origin == "http://localhost:4200"
}}

func main() {
	dbClient := DBClient{}
	dbClient.startConnection()
	defer dbClient.closeConnection()

	writter := &Writter{stream: make(chan map[string]EnginePackageStringArray)}
	reader := &Reader{}

	application := &Application{dbClient: &dbClient, writter: writter}
	writter.application = application
	reader.application = application

	mapFieldsService := MapFieldsService{application: application, mapFieldUpdated: make(chan UpdateMapFieldAction)}
	mapFieldsService.init()
	go mapFieldsService.serve()

	application.services = Services{mapFieldService: &mapFieldsService}

	go writter.handleMessages()

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		conn, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			log.Println(err)
			return
		}

		// Moze oni oboje nie powinni trzymac polaczenia, moze jakis osobny serwis na to?
		// I niech tez serwis zamknie tez stare polaczenia

		// defer func() {
		// 	u.conn.Close()
		// }()

		writter.addConnection(*conn)
		reader.addConnection(*conn)

		// loop po wszystkich serwisach?
		application.services.mapFieldService.handleNewConnection()
	})

	log.Fatal(http.ListenAndServe(":8080", nil))
}
