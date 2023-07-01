import { forEach } from 'lodash';
import { Engine } from '../../../Engine';
import { CharacterType } from '../../../types';
import { CharacterEngineEvents, SendQuoteMessageEvent } from '../Events';

export class RandomQuoteEngine extends Engine {
    doAction() {
        const characters = this.services.characterService.getAllCharacters();

        forEach(characters, (character) => {
            if (!character) {
                return;
            }

            if (character.type === CharacterType.Player) {
                return;
            }

            if (!this.services.quotesService.canNpcSayQuote(character.id)) {
                return;
            }

            const monsterFight = this.services.aggroService.getMonsterAggro()[character.id];
            if (monsterFight) {
                return;
            }

            let quotesObject;

            if (character.type === CharacterType.Monster) {
                const respawn = this.services.monsterRespawnTemplateService.getData()[character.respawnId];
                const npcTemplate = this.services.monsterTemplateService.getData()[respawn.characterTemplateId];
                quotesObject = npcTemplate.quotesEvents?.standard;
            }

            if (character.type === CharacterType.Npc) {
                const respawn = this.services.npcRespawnTemplateService.getData()[character.respawnId];
                const npcTemplate = this.services.npcTemplateService.getData()[respawn.characterTemplateId];
                quotesObject = npcTemplate.quotesEvents?.standard;
            }

            const rand = this.services.randomGeneratorService.generateNumber();
            if (!quotesObject || quotesObject.quotes.length === 0 || rand > quotesObject.chance) {
                return;
            }

            this.eventCrator.createEvent<SendQuoteMessageEvent>({
                type: CharacterEngineEvents.SendQuoteMessage,
                characterId: character.id,
                message: quotesObject.quotes[Math.floor(this.services.randomGeneratorService.generateNumber() * quotesObject.quotes.length)],
            });
        });
    }
}
