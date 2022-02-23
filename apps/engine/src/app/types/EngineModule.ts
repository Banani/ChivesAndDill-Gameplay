import { Engine } from '../Engine';
import { Notifier } from '../Notifier';

export interface EngineModule<T = undefined> {
   notifiers?: Notifier<any>[];
   services?: T;
   fastEngines?: Engine[];
   slowEngines?: Engine[];
}
