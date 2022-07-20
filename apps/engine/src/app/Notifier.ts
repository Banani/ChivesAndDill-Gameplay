import { EnginePackageEvent, GlobalStoreModule } from '@bananos/types';
import { merge } from 'lodash';
import { EventParser } from './EventParser';
import { RecursivePartial } from './types';

export interface ModulePackage<T> {
   data: Record<string, T>;
   events?: EnginePackageEvent[];
   toDelete: Record<string, T>;
   key: GlobalStoreModule;
}

export interface MulticastPackage<T> {
   key: string;
   messages: Record<string, Partial<ModulePackage<T>>>;
}

interface NotifierProps {
   key: GlobalStoreModule;
}

export abstract class Notifier<T = never> extends EventParser {
   private notifierKey: GlobalStoreModule;
   private dataToSend: Record<string, Partial<T> | T> = {};
   private objectsToDelete: Record<string, Partial<T> | T> = {};
   private events: EnginePackageEvent[] = [];
   private multicast: MulticastPackage<T>;

   constructor(notifierProps: NotifierProps) {
      super();
      this.notifierKey = notifierProps.key;
      this.multicast = this.getEmptyPackage();
   }

   getNotifierKey = () => this.notifierKey;

   getEmptyPackage = () => {
      return { key: this.notifierKey, messages: {} };
   };

   getBroadcast = () => {
      const dataToSend = this.dataToSend;
      const toDelete = this.objectsToDelete;
      const events = this.events;

      this.dataToSend = {};
      this.objectsToDelete = {};
      this.events = [];

      const packageToSend: Partial<ModulePackage<any>> = { key: this.notifierKey };

      if (Object.keys(dataToSend).length) {
         packageToSend.data = dataToSend;
      }

      if (Object.keys(toDelete).length) {
         packageToSend.toDelete = toDelete;
      }

      if (events.length) {
         packageToSend.events = events;
      }

      return packageToSend;
   };

   getMulticast = () => {
      const tempMulticast = this.multicast;
      this.multicast = this.getEmptyPackage();
      return tempMulticast;
   };

   protected broadcastEvents = ({ events }: { events: EnginePackageEvent[] }) => {
      this.events = this.events.concat(events);
   };

   protected broadcastObjectsUpdate = ({ objects }: { objects: Record<string, Partial<T> | T> }) => {
      this.dataToSend = merge({}, this.dataToSend, objects);
   };

   protected broadcastObjectsDeletion = ({ objects }: { objects: Record<string, Partial<T> | T> }) => {
      //TODO: do the same for multicast
      //   ids.forEach((id) => {
      //      delete this.dataToSend[id];
      //   });
      this.objectsToDelete = merge({}, this.objectsToDelete, objects);
   };

   protected multicastMultipleObjectsUpdate = (dataUpdatePackages: { receiverId: string; objects: Record<string, RecursivePartial<T> | T> }[]) => {
      dataUpdatePackages.forEach((dataUpdatePackage) => {
         if (!this.multicast.messages[dataUpdatePackage.receiverId]) {
            this.multicast.messages[dataUpdatePackage.receiverId] = { key: this.notifierKey };
         }

         this.multicast.messages[dataUpdatePackage.receiverId].data = merge(
            {},
            this.multicast.messages[dataUpdatePackage.receiverId].data ?? {},
            dataUpdatePackage.objects
         );
      });
   };

   protected multicastObjectsDeletion = (dataUpdatePackages: { receiverId: string; objects: Record<string, Partial<T> | T> }[]) => {
      dataUpdatePackages.forEach((dataUpdatePackage) => {
         if (!this.multicast.messages[dataUpdatePackage.receiverId]) {
            this.multicast.messages[dataUpdatePackage.receiverId] = { key: this.notifierKey };
         }

         this.multicast.messages[dataUpdatePackage.receiverId].toDelete = merge(
            {},
            this.multicast.messages[dataUpdatePackage.receiverId].toDelete ?? {},
            dataUpdatePackage.objects
         );
      });
   };

   protected multicastEvents = (dataUpdatePackages: { receiverId: string; events: EnginePackageEvent[] }[]) => {
      dataUpdatePackages.forEach((dataUpdatePackage) => {
         if (!this.multicast.messages[dataUpdatePackage.receiverId]) {
            this.multicast.messages[dataUpdatePackage.receiverId] = { key: this.notifierKey };
         }
         this.multicast.messages[dataUpdatePackage.receiverId].events = (this.multicast.messages[dataUpdatePackage.receiverId].events ?? []).concat(
            dataUpdatePackage.events
         );
      });
   };
}
