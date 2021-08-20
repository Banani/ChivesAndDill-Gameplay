import { EnginePackage } from '@bananos/types';
import type { FSAAuto } from 'flux-standard-action';

export enum EngineStateActionTypes {
   NEW_PACKAGE = '[Engine State] NEW_PACKAGE',
}

export type NewPackage = FSAAuto<EngineStateActionTypes.NEW_PACKAGE, EnginePackage>;

export const newPackage = (payload: EnginePackage): NewPackage => ({
   type: EngineStateActionTypes.NEW_PACKAGE,
   payload,
});

export type EngineStateAction = NewPackage;
