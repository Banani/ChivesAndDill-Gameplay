package main

import (
	"fmt"
	"log"
	"time"

	"net/http"

	"github.com/gorilla/websocket"
)

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

}

func (u *User) reader() {
	// defer func() {
	// 	u.conn.Close()
	// }()

	// for {
	// 	_, message, err := u.conn.ReadMessage()
	// 	if err != nil {
	// 		log.Printf("Error: %v", err)
	// 	}

	// 	var updateMapField UpdateMapField
	// 	json.Unmarshal(message, &updateMapField)
	// 	u.services.mapFieldService.update <- UpdateMapField{X: updateMapField.X, Y: updateMapField.Y, SpriteId: updateMapField.SpriteId}
	// }
}

type Writter struct {
	connections []websocket.Conn
	application *Application
	stream      chan map[string]EnginePackageStringArray
}

func (w *Writter) addConnection(conn websocket.Conn) {
	w.connections = append(w.connections, conn)
	w.application.services.mapFieldService.handleNewConnection()
}

func (w *Writter) handleMessages() {
	// defer func() {
	// 	u.conn.Close()
	// }()

	for {
		select {
		case modulePackage := <-w.stream:
			for _, con := range w.connections {
				con.SetWriteDeadline(time.Now().Add(10 * time.Second))
				err := con.WriteJSON(modulePackage)
				fmt.Println(err)
			}

			// case updateMapField := <-w.application.services.mapFieldService.update:
			// 	for _, con := range w.connections {
			// 		con.SetWriteDeadline(time.Now().Add(10 * time.Second))
			// 		mapFields := make(map[string][]string)
			// 		mapFields[strconv.Itoa(updateMapField.X)+":"+strconv.Itoa(updateMapField.Y)] = []string{updateMapField.SpriteId}

			// 		mapFieldPackage := make(map[string]EnginePackageStringArray)
			// 		mapFieldPackage["map"] = EnginePackageStringArray{Data: mapFields}

			// 		err := con.WriteJSON(mapFieldPackage)
			// 		fmt.Println(err)
			// 	}
			// }
		}
	}
}

func main() {
	dbClient := DBClient{}
	dbClient.startConnection()
	defer dbClient.closeConnection()

	writter := &Writter{stream: make(chan map[string]EnginePackageStringArray)}

	application := &Application{dbClient: &dbClient, writter: writter}
	writter.application = application

	mapFieldsService := MapFieldsService{application: application, update: make(chan Sprite)}
	mapFieldsService.init()
	go mapFieldsService.serve()

	application.services = Services{mapFieldService: &mapFieldsService}

	go writter.handleMessages()

	// nowe ziomeczki jak sie lacza
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		conn, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			log.Println(err)
			return
		}

		user := User{conn: conn, services: &application.services}

		writter.addConnection(*conn)
		go user.reader()
		// go user.writer()

		// conn.WriteJSON(spriteMapPackage)
		// conn.WriteJSON(mapFieldPackage)
	})

	log.Fatal(http.ListenAndServe(":8080", nil))
}
