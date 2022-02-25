import { EngineEvent, EngineEventHandler } from '../../types';

export enum ItemEngineEvents {
   CurrencyAmountUpdated = 'CurrencyAmountUpdated',
}

export interface CurrencyAmountUpdatedEvent extends EngineEvent {
   type: ItemEngineEvents.CurrencyAmountUpdated;
   characterId: string;
   newAmount: number;
}

export interface ItemEngineEventsMap {
   [ItemEngineEvents.CurrencyAmountUpdated]: EngineEventHandler<CurrencyAmountUpdatedEvent>;
}
