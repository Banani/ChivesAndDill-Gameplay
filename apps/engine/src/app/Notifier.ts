import { EnginePackageEvent } from '@bananos/types';

export interface ModulePackage {
   data: any;
   events?: EnginePackageEvent[];
   toDelete: string[];
}

export interface MulticastPackage {
   key: string;
   messages: Record<string, ModulePackage>;
}

export interface Notifier {
   getBroadcast?: () => ModulePackage & { key: string };
   getMulticast?: () => { key: string; messages: Record<string, ModulePackage> };
}
