import { ChannelType } from '@bananos/types';
import { now } from 'lodash';
import { EngineEvents } from '../../../EngineEvents';
import { EngineEventCrator } from '../../../EngineEventsCreator';
import { EventParser } from '../../../EventParser';
import { CharacterDiedEvent, CharacterType, EngineEventHandler } from '../../../types';
import { ChatEngineEvents, SendChatMessageEvent } from '../../ChatModule/Events';
import { MonsterEngineEvents, MonsterPulledEvent } from '../../MonsterModule/Events';
import { Monster } from '../../MonsterModule/types';
import { CharacterEngineEvents, SendQuoteMessageEvent } from '../Events';
import { RandomQuoteEngine } from '../engines/RandomQuoteEngine';

export class QuotesService extends EventParser {
    // characterId => last call
    quotesTimeStamps: Record<string, number> = {};
    QUOTE_COOLDOWN = 5000;
    randomQuoteEngine: RandomQuoteEngine;

    constructor(randomQuoteEngine: RandomQuoteEngine) {
        super();
        this.randomQuoteEngine = randomQuoteEngine;
        this.eventsToHandlersMap = {
            [EngineEvents.CharacterDied]: this.handleCharacterDied,
            [MonsterEngineEvents.MonsterPulled]: this.handleMonsterPulled,
            [CharacterEngineEvents.SendQuoteMessage]: this.handleSendQuoteMessage,
        };
    }

    init(engineEventCrator: EngineEventCrator, services) {
        super.init(engineEventCrator);
        this.randomQuoteEngine.init(this.engineEventCrator, services);
    }

    handleSendQuoteMessage: EngineEventHandler<SendQuoteMessageEvent> = ({ event, services }) => {
        this.quotesTimeStamps[event.characterId] = now();
        const character = services.characterService.getAllCharacters()[event.characterId];

        this.engineEventCrator.asyncCeateEvent<SendChatMessageEvent>({
            type: ChatEngineEvents.SendChatMessage,
            message: event.message,
            details: {
                channelType: ChannelType.Quotes,
                location: {
                    x: character.location.x,
                    y: character.location.y
                },
                authorId: event.characterId
            },
        });
    };

    handleMonsterPulled: EngineEventHandler<MonsterPulledEvent> = ({ event, services }) => {
        const respawn = services.monsterRespawnTemplateService.getData()[event.monster.respawnId];
        const monsterTemplate = services.monsterTemplateService.getData()[respawn.characterTemplateId];
        const onPulling = monsterTemplate.quotesEvents?.onPulling;

        if (this.quotesTimeStamps[event.monster.id] > now() - this.QUOTE_COOLDOWN) {
            return;
        }

        if (!onPulling) {
            return;
        }

        if (onPulling.quotes.length === 0) {
            return;
        }

        if (services.randomGeneratorService.generateNumber() > onPulling.chance) {
            return;
        }

        this.quotesTimeStamps[event.monster.id] = now();

        this.engineEventCrator.asyncCeateEvent<SendChatMessageEvent>({
            type: ChatEngineEvents.SendChatMessage,
            message: onPulling.quotes[Math.round(services.randomGeneratorService.generateNumber() * onPulling.quotes.length)],
            details: {
                channelType: ChannelType.Quotes,
                location: {
                    x: event.monster.location.x,
                    y: event.monster.location.y
                },
                authorId: event.monster.id
            }
        });
    };

    handleCharacterDied: EngineEventHandler<CharacterDiedEvent> = ({ event, services }) => {
        let quotesType;
        let characterId;
        let monster = event.character;

        if (event.character.type === CharacterType.Monster) {
            characterId = event.character.id;
            quotesType = 'onDying';
        } else if (event.character.type === CharacterType.Player) {
            characterId = event.killerId;
            quotesType = 'onKilling';
            monster = services.characterService.getCharacterById(characterId) as Monster;
        } else {
            return;
        }

        if (monster.type !== CharacterType.Monster) {
            return;
        }

        const respawn = services.monsterRespawnTemplateService.getData()[monster.respawnId];
        const monsterTemplate = services.monsterTemplateService.getData()[respawn.characterTemplateId];
        const quotes = monsterTemplate.quotesEvents?.[quotesType];

        if (this.quotesTimeStamps[characterId] > now() - this.QUOTE_COOLDOWN) {
            return;
        }

        if (!quotes) {
            return;
        }

        if (quotes.quotes.length === 0) {
            return;
        }

        if (services.randomGeneratorService.generateNumber() > quotes.chance) {
            return;
        }

        this.quotesTimeStamps[characterId] = now();
        this.engineEventCrator.asyncCeateEvent<SendChatMessageEvent>({
            type: ChatEngineEvents.SendChatMessage,
            message: quotes.quotes[Math.round(services.randomGeneratorService.generateNumber() * (quotes.quotes.length - 1))],
            details: {
                channelType: ChannelType.Quotes,
                location: {
                    x: monster.location.x,
                    y: monster.location.y
                },
                authorId: characterId,
            }

        });
    };

    canNpcSayQuote = (characterId: string) => (this.quotesTimeStamps[characterId] ?? 0) + this.QUOTE_COOLDOWN < now();
}
