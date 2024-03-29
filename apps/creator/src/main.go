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
	return origin == "http://localhost:3100"
}}

func main() {

	//files, err := ioutil.ReadDir("./test")
	//if err != nil {
	//	log.Fatal(err)
	//}

	dbClient := DBClient{}
	dbClient.startConnection()
	defer dbClient.closeConnection()

	//collection := dbClient.db.Collection("sprites")
	//toSave := make([]interface{}, 12*12*155)
	//counter := 0
	//
	//for _, file := range files {
	//	for x := 0; x < 12; x++ {
	//		for y := 0; y < 12; y++ {
	//			spriteSheet := "https://sprites-bucket.s3.amazonaws.com/" + strings.Replace(file.Name(), " ", "+", 1)
	//
	//			toSave[counter] = bson.D{{"spriteSheet", spriteSheet}, {"x", y}, {"y", x}}
	//			counter++
	//		}
	//	}
	//}
	//
	//_, err = collection.InsertMany(context.TODO(), toSave)
	//log.Print(err)

	writter := &Writter{
		stream:            make(chan map[string]EnginePackageStringArray),
		connections:       make(map[*websocket.Conn]bool),
		removeConnections: make(chan *websocket.Conn),
	}
	reader := &Reader{}

	application := &Application{dbClient: &dbClient, writter: writter}
	writter.application = application
	reader.application = application

	application.services = map[string]Service{
		"mapFieldService": &MapFieldsService{
			application:  application,
			actionStream: make(chan TypedAction),
		},
		"npcTemplateService": &NpcTemplateService{
			application:  application,
			actionStream: make(chan TypedAction),
		},
		"monsterTemplateService": &MonsterTemplateService{
			application:  application,
			actionStream: make(chan TypedAction),
		},
		"itemsService": &ItemsService{
			application:  application,
			actionStream: make(chan TypedAction),
		},
		"questsService": &QuestsService{
			application:  application,
			actionStream: make(chan TypedAction),
		},
		"spriteGroup": &SpriteGroupsService{
			application:  application,
			actionStream: make(chan TypedAction),
		},
		"spellsService": &SpellsService{
			application:  application,
			actionStream: make(chan TypedAction),
		},
		"characterClassesService": &CharacterClassesService{
			application:  application,
			actionStream: make(chan TypedAction),
		},
	}

	for _, service := range application.services {
		service.init()
		go service.serve()
	}
	go writter.handleMessages()

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		conn, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			log.Println(err)
			return
		}

		writter.addConnection(conn)
		reader.addConnection(conn)

		for _, service := range application.services {
			// Tutaj mozna wyslac to nowe polaczenie
			service.handleNewConnection()
		}
	})

	log.Fatal(http.ListenAndServe(":8080", nil))
}
