import { filter, forEach } from 'lodash';
import { EngineEvents } from '../../../EngineEvents';
import { Engine } from '../../../engines/Engine';
import { distanceBetweenTwoPoints, isSegementCrossingWithAnyWall } from '../../../math';
import { Character, PlayerCastSpellEvent, PlayerTriesToCastASpellEvent, Spell } from '../../../types';
import { Monster } from '../types';

interface ScheduledAttack {
   spell: Spell;
   targetId: string;
}

export class MonsterAttackEngine extends Engine {
   attacksHistory: Record<string, number> = {};
   scheduledAttacks: Record<string, ScheduledAttack[]> = {};

   isTargetInSight = (monster: Monster, target: Character) => {
      const shotSegment = [
         [monster.location.x, monster.location.y],
         [target.location.x, target.location.y],
      ];

      return !isSegementCrossingWithAnyWall(shotSegment);
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
         const character = this.services.characterService.getCharacterById(aggro.currentTarget.characterId);
         const monster = this.services.monsterService.getAllCharacters()[monsterId];

         if (!this.isTargetInSight(monster, character)) {
            return;
         }

         if (!this.isReadyToPerformAttack(monster)) {
            return;
         }

         if (this.services.channelService.getActiveChannelSpells()[monsterId]) {
            return;
         }

         if (this.scheduledAttacks[monsterId]) {
            const scheduledAttack = this.scheduledAttacks[monsterId].pop();
            this.eventCrator.createEvent<PlayerCastSpellEvent>({
               type: EngineEvents.PlayerCastSpell,
               casterId: monster.id,
               spell: scheduledAttack.spell,
               directionLocation: this.services.characterService.getCharacterById(scheduledAttack.targetId).location,
            });

            if (!this.scheduledAttacks[monsterId].length) {
               delete this.scheduledAttacks[monsterId];
            }

            this.attacksHistory[monster.id] = Date.now();
            return;
         }

         const readySpells = filter(monster.spells, (spell) => this.services.cooldownService.isSpellAvailable(monster.id, spell.name));
         const readySpellsWithRange = filter(readySpells, (spell) => distanceBetweenTwoPoints(monster.location, character.location) <= spell.range);

         if (readySpellsWithRange.length > 0) {
            this.attacksHistory[monster.id] = Date.now();
            this.eventCrator.createEvent<PlayerTriesToCastASpellEvent>({
               type: EngineEvents.PlayerTriesToCastASpell,
               spellData: {
                  spell: readySpellsWithRange[Math.floor(Math.random() * readySpellsWithRange.length)],
                  directionLocation: character.location,
                  characterId: monster.id,
               },
            });
         }
      });
   }
}
