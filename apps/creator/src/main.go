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

	writter := &Writter{
		stream:            make(chan map[string]EnginePackageStringArray),
		connections:       make(map[*websocket.Conn]bool),
		removeConnections: make(chan *websocket.Conn),
	}
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

		writter.addConnection(conn)
		reader.addConnection(conn)

		// loop po wszystkich serwisach?
		application.services.mapFieldService.handleNewConnection()
	})

	log.Fatal(http.ListenAndServe(":8080", nil))
}
