package main

import (
	"encoding/json"
)

type QuestRewardItem struct {
	ItemTemplateId string `json:"itemTemplateId"`
	Amount         int64  `json:"amount"`
}

type QuestReward struct {
	Experience int64                      `json:"experience"`
	Currency   int64                      `json:"currency"`
	Items      map[string]QuestRewardItem `json:"items"`
}

type QuestSchema struct {
	Id             string                `json:"id" bson:"-"`
	Name           string                `json:"name"`
	Description    string                `json:"description"`
	QuestReward    QuestReward           `json:"questReward"`
	Stages         map[string]QuestStage `json:"stages"`
	RequiredLevel  int64                 `json:"requiredLevel"`
	RequiredQuests map[string]string     `json:"requiredQuests"`
}

type QuestStage struct {
	Id          string                    `json:"id"`
	Description string                    `json:"description"`
	StageParts  map[string]QuestStagePart `json:"stageParts"`
}

type QuestStagePart struct {
	Type            string                       `json:"type"`
	LocationName    string                       `json:"locationName,omitempty" bson:"locationName,omitempty"`
	TargetLocation  *Location                    `json:"targetLocation,omitempty" bson:"targetLocation,omitempty"`
	AcceptableRange int64                        `json:"acceptableRange,omitempty" bson:"acceptableRange,omitempty"`
	MonsterName     string                       `json:"monsterName,omitempty" bson:"monsterName,omitempty"`
	Rule            *[]KillingQuestStagePartRule `json:"rule,omitempty" bson:"rule,omitempty"`
	Amount          int64                        `json:"amount,omitempty" bson:"amount,omitempty"`
}

type KillingQuestStagePartRule struct {
	FieldName  string `json:"fieldName"`
	Comparison string `json:"comparison"`
	Value      string `json:"value"`
}

type QuestsService struct {
	application  *Application
	quests       map[string]QuestSchema
	actionStream chan TypedAction
}

func (s *QuestsService) processAction(action TypedAction) {
	s.actionStream <- action
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
		action := <-service.actionStream

		if action.ActionType == createQuest {
			var createQuestAction CreateQuestAction
			json.Unmarshal(action.Body, &createQuestAction)

			questSchema := createQuestAction.QuestSchema

			api := QuestsDbApi{application: service.application}
			questSchema.Id = api.saveQuest(questSchema)

			service.quests[questSchema.Id] = questSchema
			service.application.writter.stream <- prepareUpdatePayload("questSchemas", map[string]QuestSchema{questSchema.Id: questSchema})
		}

		if action.ActionType == updateQuest {
			var updateQuestAction UpdateQuestAction
			json.Unmarshal(action.Body, &updateQuestAction)

			questSchema := updateQuestAction.QuestSchema

			api := QuestsDbApi{application: service.application}
			api.updateQuest(questSchema)

			service.quests[questSchema.Id] = questSchema
			service.application.writter.stream <- prepareDeletePayload2("questSchemas", map[string]QuestSchema{questSchema.Id: questSchema})
			service.application.writter.stream <- prepareUpdatePayload("questSchemas", map[string]QuestSchema{questSchema.Id: questSchema})
		}

		if action.ActionType == deleteQuest {
			var deleteQuestAction DeleteQuestAction
			json.Unmarshal(action.Body, &deleteQuestAction)

			api := QuestsDbApi{application: service.application}
			api.deleteQuest(deleteQuestAction.QuestId)

			delete(service.quests, deleteQuestAction.QuestId)
			service.application.writter.stream <- prepareDeletePayload("questSchemas", []string{deleteQuestAction.QuestId})
		}

		if action.ActionType == deleteItemTemplate {
			var deleteItemTemplate DeleteItemTemplateAction
			json.Unmarshal(action.Body, &deleteItemTemplate)

			api := QuestsDbApi{application: service.application}
			api.deleteItemsInQuestReward(deleteItemTemplate.ItemTemplateId)
			questSchemas := make(map[string]QuestSchema)

			for questId, quest := range service.quests {
				if _, ok := quest.QuestReward.Items[deleteItemTemplate.ItemTemplateId]; ok {
					delete(quest.QuestReward.Items, deleteItemTemplate.ItemTemplateId)
					questSchemas[questId] = quest
				}
			}

			// Polaczyc to w jeden payload
			service.application.writter.stream <- prepareDeletePayload2("questSchemas", questSchemas)
			service.application.writter.stream <- prepareUpdatePayload("questSchemas", questSchemas)
		}
	}
}
