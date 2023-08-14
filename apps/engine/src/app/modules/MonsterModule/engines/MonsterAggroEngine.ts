import { forEach } from 'lodash';
import { Engine } from '../../../Engine';
import { distanceBetweenTwoPoints } from '../../../math';
import { PlayerCharacter } from '../../../types/PlayerCharacter';
import { MonsterEngineEvents, MonsterLostPlayerCharacterEvent, MonsterNoticedPlayerCharacterEvent } from '../Events';
import { MonsterTemplate } from '../MonsterTemplates';
import { Aggro } from '../services';
import { Monster } from '../types';

const ESCAPE_RANGE_MULTIPLAYER = 3;

export class MonsterAggroEngine extends Engine {
    doAction() {
        forEach(this.services.monsterService.getAllCharacters(), (monster, id) => {
            forEach(this.services.playerCharacterService.getAllCharacters(), (playerCharacter) => {
                if (playerCharacter.isDead) {
                    return;
                }

                const monsterAggro = this.services.aggroService.getMonsterAggro()[monster.id];
                const monsterTemplate = this.services.monsterTemplateService.getData()[monster.templateId];
                // Przerwac jak cos juz pullnie potwora
                if (this.shouldAttackPlayerCharacter({ monster, monsterTemplate, playerCharacter, monsterAggro })) {
                    this.eventCrator.createEvent<MonsterNoticedPlayerCharacterEvent>({
                        type: MonsterEngineEvents.MonsterNoticedPlayerCharacter,
                        monsterCharacterId: monster.id,
                        playerCharacterId: playerCharacter.id,
                    });
                } else if (this.shouldStopChasingPlayer({ monsterTemplate, monster, playerCharacter, monsterAggro })) {
                    this.eventCrator.createEvent<MonsterLostPlayerCharacterEvent>({
                        type: MonsterEngineEvents.MonsterLostPlayerCharacter,
                        monsterCharacterId: monster.id,
                        playerCharacterId: playerCharacter.id,
                    });
                }
            });
        });
    }

    shouldAttackPlayerCharacter = ({ monster, playerCharacter, monsterAggro, monsterTemplate }: { monster: Monster; monsterTemplate: MonsterTemplate, playerCharacter: PlayerCharacter; monsterAggro: Aggro }) =>
        distanceBetweenTwoPoints(monster.location, playerCharacter.location) <= monsterTemplate.sightRange && !monsterAggro;

    shouldStopChasingPlayer = ({ monster, playerCharacter, monsterAggro, monsterTemplate }: { monster: Monster; monsterTemplate: MonsterTemplate, playerCharacter: PlayerCharacter; monsterAggro: Aggro }) =>
        distanceBetweenTwoPoints(monster.location, playerCharacter.location) > monsterTemplate.sightRange * ESCAPE_RANGE_MULTIPLAYER &&
        monsterAggro &&
        monsterAggro.currentTarget.characterId === playerCharacter.id;
}
