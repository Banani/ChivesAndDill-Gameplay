import { BackpackItemsContainment, BackpackTrack } from '@bananos/types';
import { EngineEvent, EngineEventHandler } from '../../types';

export enum ItemEngineEvents {
   CurrencyAmountUpdated = 'CurrencyAmountUpdated',

   BackpackTrackCreated = 'BackpackTrackCreated',

   BackpackItemsContainmentUpdated = 'BackpackItemsContainmentUpdated',
}

export interface CurrencyAmountUpdatedEvent extends EngineEvent {
   type: ItemEngineEvents.CurrencyAmountUpdated;
   characterId: string;
   newAmount: number;
}

export interface BackpackTrackCreatedEvent extends EngineEvent {
   type: ItemEngineEvents.BackpackTrackCreated;
   characterId: string;
   backpackTrack: BackpackTrack;
}

export interface BackpackItemsContainmentUpdatedEvent extends EngineEvent {
   type: ItemEngineEvents.BackpackItemsContainmentUpdated;
   characterId: string;
   backpackItemsContainment: BackpackItemsContainment;
}

export interface ItemEngineEventsMap {
   [ItemEngineEvents.CurrencyAmountUpdated]: EngineEventHandler<CurrencyAmountUpdatedEvent>;
   [ItemEngineEvents.BackpackTrackCreated]: EngineEventHandler<BackpackTrackCreatedEvent>;
   [ItemEngineEvents.BackpackItemsContainmentUpdated]: EngineEventHandler<BackpackItemsContainmentUpdatedEvent>;
}
