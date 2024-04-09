import { Character, Spell } from '@bananos/types';
import * as _ from 'lodash';
import { filter, forEach } from 'lodash';
import { Engine } from '../../../Engine';
import { distanceBetweenTwoPoints, isSegementCrossingWithAnyWall } from '../../../math';
import { PlayerCastSpellEvent, SpellEngineEvents } from '../../SpellModule/Events';
import { Monster } from '../types';

interface ScheduledAttack {
    spell: Spell;
    targetId: string;
}

export class MonsterAttackEngine extends Engine {
    attacksHistory: Record<string, number> = {};
    scheduledAttacks: Record<string, ScheduledAttack[]> = {};

    isTargetInSight = (monster: Monster, target: Character, areas) => {
        const shotSegment = [
            [monster.location.x, monster.location.y],
            [target.location.x, target.location.y],
        ];

        return !isSegementCrossingWithAnyWall(shotSegment, areas);
    };

    isReadyToPerformAttack = (monster: Monster) => {
        const lastAttackTime = this.attacksHistory[monster.id];
        return !lastAttackTime || lastAttackTime + monster.attackFrequency < Date.now();
    };

    scheduleAttack = (monsterId: string, scheduledAttack: ScheduledAttack) => {
        if (!this.scheduledAttacks[monsterId]) {
            this.scheduledAttacks[monsterId] = [];
        }
        this.scheduledAttacks[monsterId].push(scheduledAttack);
    };

    doAction() {
        forEach(this.services.aggroService.getMonsterAggro(), (aggro, monsterId) => {
            // TODO: Cover by tests, aggroService is giving all the aggros, first monster is killing the player, so the second
            // aggro might be deleted. That is why it is undefined
            // same for target
            if (!aggro) {
                return;
            }

            const character = this.services.characterService.getCharacterById(aggro.currentTarget.characterId);
            const monster = this.services.monsterService.getAllCharacters()[monsterId];
            if (!character) {
                return;
            }

            if (!monster || !this.isTargetInSight(monster, character, this.services.collisionService.getAreas())) {
                return;
            }

            if (!this.isReadyToPerformAttack(monster)) {
                return;
            }

            if (this.services.channelService.getActiveChannelSpells()[monsterId]) {
                return;
            }

            const monsterRespawn = this.services.monsterRespawnTemplateService.getData()[monster.respawnId];
            const monsterTemplate = this.services.monsterTemplateService.getData()[monsterRespawn.templateId];

            if (this.scheduledAttacks[monsterId]) {
                const scheduledAttack = this.scheduledAttacks[monsterId].pop();
                this.eventCrator.createEvent<PlayerCastSpellEvent>({
                    type: SpellEngineEvents.PlayerCastSpell,
                    casterId: monster.id,
                    spell: scheduledAttack.spell,
                    directionLocation: this.services.characterService.getCharacterById(scheduledAttack.targetId).location,
                    targetId: scheduledAttack.targetId
                });

                if (!this.scheduledAttacks[monsterId].length) {
                    delete this.scheduledAttacks[monsterId];
                }

                this.attacksHistory[monster.id] = Date.now();
                return;
            }


            const spells = this.services.spellService.getData();
            const readySpells = _.chain(monsterTemplate.spells)
                .map((_, spellId) => spellId)
                .filter(spellId => this.services.cooldownService.isSpellAvailable(monster.id, spellId))
                .value();
            const readySpellsWithRange = filter(readySpells, (spellId) => distanceBetweenTwoPoints(monster.location, character.location) <= spells[spellId].range);

            // TODO: Wybrac taki, ktory ma mane

            if (readySpellsWithRange.length > 0) {
                this.attacksHistory[monster.id] = Date.now();
                this.eventCrator.createEvent<PlayerCastSpellEvent>({
                    type: SpellEngineEvents.PlayerCastSpell,
                    casterId: monster.id,
                    targetId: character.id,
                    directionLocation: character.location,
                    spell: spells[readySpellsWithRange[Math.floor(Math.random() * readySpellsWithRange.length)]]
                });
            }
        });
    }
}
