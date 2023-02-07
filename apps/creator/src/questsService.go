package main

type QuestRewardItem struct {
	ItemTemplateId string `json:"itemTemplateId"`
	Amount         int64  `json:"amount"`
}

type QuestReward struct {
	Experience int64             `json:"experience"`
	Currency   int64             `json:"currency"`
	Items      []QuestRewardItem `json:"items"`
}

type QuestSchema struct {
	Id          string      `json:"id"`
	Name        string      `json:"name"`
	Description string      `json:"description"`
	QuestReward QuestReward `json:"questReward"`
}

type QuestsService struct {
	application *Application
	quests      map[string]QuestSchema
	createQuest chan CreateQuestAction
	deleteQuest chan DeleteQuestAction
}

func (s *QuestsService) init() {
	api := QuestsDbApi{application: s.application}

	s.quests = api.getQuests()
}

func (service *QuestsService) handleNewConnection() {
	// // TO idzie do kazdego usera :o
	service.application.writter.stream <- prepareUpdatePayload("questSchemas", service.quests)
}

func (service *QuestsService) serve() {
	for {
		select {
		case createQuestAction := <-service.createQuest:
			questSchema := createQuestAction.QuestSchema

			api := QuestsDbApi{application: service.application}
			questSchema.Id = api.saveQuest(questSchema)

			service.quests[questSchema.Id] = questSchema
			service.application.writter.stream <- prepareUpdatePayload("questSchemas", map[string]QuestSchema{questSchema.Id: questSchema})

		case deleteQuestAction := <-service.deleteQuest:
			api := QuestsDbApi{application: service.application}
			api.deleteQuest(deleteQuestAction.QuestId)

			delete(service.quests, deleteQuestAction.QuestId)
			service.application.writter.stream <- prepareDeletePayload("questSchemas", []string{deleteQuestAction.QuestId})
		}
	}
}
