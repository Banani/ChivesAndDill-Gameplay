import { EnginePackage } from '@bananos/types';
import type { FSAAuto } from 'flux-standard-action';

export enum EngineStateActionTypes {
   NEW_PACKAGE = '[Engine State] NEW_PACKAGE',
}

export type NewPackage = FSAAuto<EngineStateActionTypes.NEW_PACKAGE, Record<string, any>>;

export const newPackage = (payload: Record<string, any>): NewPackage => ({
   type: EngineStateActionTypes.NEW_PACKAGE,
   payload,
});

export type EngineStateAction = NewPackage;
