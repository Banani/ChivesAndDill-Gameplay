import { GainPowerStackEffect, LosePowerStackEffect, PowerStackLimit, PowerStackType, SpellEffectType } from '@bananos/types';
import { forEach } from 'lodash';
import { EventParser } from '../../../../EventParser';
import { EngineEventHandler } from '../../../../types';
import {
    ApplyTargetSpellEffectEvent,
    CharacterGainPowerStackEvent,
    CharacterLosePowerStackEvent,
    PlayerCastedSpellEvent,
    SpellEngineEvents,
} from '../../Events';

export class PowerStackEffectService extends EventParser {
    currentPowerStacks: Record<string, Partial<Record<PowerStackType, number>>> = {};

    constructor() {
        super();
        this.eventsToHandlersMap = {
            [SpellEngineEvents.ApplyTargetSpellEffect]: this.handleApplySpellEffect,
            [SpellEngineEvents.PlayerCastedSpell]: this.handlePlayerCastedSpell,
        };
    }

    handlePlayerCastedSpell: EngineEventHandler<PlayerCastedSpellEvent> = ({ event }) => {
        if (event.spell.requiredPowerStacks) {
            forEach(event.spell.requiredPowerStacks, (requiredPowerStack) => {
                this.losePowerStack(event.casterId, requiredPowerStack.type, requiredPowerStack.amount);
            });
        }
    };

    handleApplySpellEffect: EngineEventHandler<ApplyTargetSpellEffectEvent> = ({ event }) => {
        if (event.effect.type === SpellEffectType.GainPowerStack) {
            const effect = event.effect as GainPowerStackEffect;
            this.gainPowerStack(event.target.id, effect.powerStackType, effect.amount);
        }

        if (event.effect.type === SpellEffectType.LosePowerStack) {
            const effect = event.effect as LosePowerStackEffect;
            this.losePowerStack(event.target.id, effect.powerStackType, effect.amount);
        }
    };

    getAmountOfPowerStack = (characterId: string, powerStackType: PowerStackType) => this.currentPowerStacks[characterId]?.[powerStackType] ?? 0;

    gainPowerStack = (characterId: string, powerStackType: PowerStackType, amount: number) => {
        if (!this.currentPowerStacks[characterId]) {
            this.currentPowerStacks[characterId] = {};
        }

        const player = this.currentPowerStacks[characterId];
        if (!player[powerStackType]) {
            player[powerStackType] = 0;
        }

        if (PowerStackLimit[powerStackType] > player[powerStackType]) {
            player[powerStackType] = Math.min(PowerStackLimit[powerStackType], player[powerStackType] + amount);
            this.engineEventCrator.asyncCeateEvent<CharacterGainPowerStackEvent>({
                type: SpellEngineEvents.CharacterGainPowerStack,
                amount,
                characterId,
                powerStackType,
                currentAmount: player[powerStackType],
            });
        }
    };

    losePowerStack = (characterId: string, powerStackType: PowerStackType, amount: number) => {
        if (this.currentPowerStacks[characterId]?.[powerStackType] > 0) {
            this.currentPowerStacks[characterId][powerStackType] = Math.max(0, this.currentPowerStacks[characterId][powerStackType] - amount);
            this.engineEventCrator.asyncCeateEvent<CharacterLosePowerStackEvent>({
                type: SpellEngineEvents.CharacterLosePowerStack,
                amount,
                characterId,
                powerStackType,
                currentAmount: this.currentPowerStacks[characterId][powerStackType],
            });
        }

        if (this.currentPowerStacks[characterId]?.[powerStackType] === 0) {
            delete this.currentPowerStacks[characterId][powerStackType];
        }

        if (Object.keys(this.currentPowerStacks[characterId]).length === 0) {
            delete this.currentPowerStacks[characterId];
        }
    };
}
