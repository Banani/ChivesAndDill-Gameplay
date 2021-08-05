import type { FSAAuto } from 'flux-standard-action';

export enum EngineStateActionTypes {
   NEW_PACKAGE = '[Engine State] NEW_PACKAGE',
}

export type NewPackage = FSAAuto<EngineStateActionTypes.NEW_PACKAGE, any>;

export const newPackage = (payload: any): NewPackage => ({
   type: EngineStateActionTypes.NEW_PACKAGE,
   payload,
});

export type EngineStateAction = NewPackage;
