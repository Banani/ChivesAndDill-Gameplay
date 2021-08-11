import { EnginePackage, GlobalStoreModule } from '@bananos/types';
import type { FSAAuto } from 'flux-standard-action';

export enum EngineStateActionTypes {
   NEW_PACKAGE = '[Engine State] NEW_PACKAGE',
   CLEAR_EVENT = '[Engine State] CLEAR_EVENT',
}

export type NewPackage = FSAAuto<EngineStateActionTypes.NEW_PACKAGE, EnginePackage>;

interface ClearEventPayload {
   module: GlobalStoreModule;
   eventId: string;
}

export type ClearEvent = FSAAuto<EngineStateActionTypes.CLEAR_EVENT, ClearEventPayload>;

export const newPackage = (payload: EnginePackage): NewPackage => ({
   type: EngineStateActionTypes.NEW_PACKAGE,
   payload,
});

export const clearEvent = (payload: ClearEventPayload): ClearEvent => ({
   type: EngineStateActionTypes.CLEAR_EVENT,
   payload,
});

export type EngineStateAction = NewPackage | ClearEvent;
