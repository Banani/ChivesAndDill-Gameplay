import { Module } from '@bananos/socket-store';
import { GlobalStore, RecursivePartial } from '@bananos/types';
import { forEach, pickBy } from 'lodash';
import React, { FunctionComponent, useState } from 'react';

interface PackageContextReturns {
   updatePackage: (enginePackage: RecursivePartial<GlobalStore>) => void;
   backendStore: GlobalStore;
}

export const PackageContext = React.createContext<PackageContextReturns>(null);

const deleteRequestedFields = (data: any, pathToDelete: any) => {
   forEach(pathToDelete, (toDelete, key) => {
      if (toDelete === null) {
         delete data[key];
      } else {
         deleteRequestedFields(data[key], toDelete);
      }
   });
};

export const customMerge = (data: any, pathToUpdate: any) => {
   forEach(pathToUpdate, (toUpdate, key) => {
      if (typeof toUpdate === 'object' && toUpdate !== null) {
         // to jest po to jesli obiekt zmieni typ, najpierw bedzie liczba, potem nagle obiektem
         if (typeof data[key] !== 'object' || data[key] === null) {
            data[key] = {};
         }

         if (Array.isArray(pathToUpdate[key])) {
            if (!Array.isArray(data[key])) {
               data[key] = [];
            }
            data[key] = (data[key] as []).concat(toUpdate);
         } else {
            customMerge(data[key], pathToUpdate[key]);
         }
      } else {
         data[key] = toUpdate;
      }
   });
   return data;
};

export const PackageContextProvider: FunctionComponent = ({ children }) => {
   const [backendStore, setBackendStore] = useState({});

   const updatePackage = (payload: any) => {
      setBackendStore((prev) => {
         let newState: Record<string, Module> = {};
         // TODO: split modules into multiple states
         customMerge(newState, prev);

         forEach(newState, (module: Module) => {
            module.events = [];
         });

         forEach(payload, (module: Module, moduleName: string) => {
            if (!newState[moduleName]) {
               newState[moduleName] = {
                  data: {},
                  events: [],
               };
            }

            if (module.events) {
               newState[moduleName].events = module.events;
            }
         });

         forEach(
            pickBy(payload, (module) => module.data),
            (module, moduleName) => customMerge(newState[moduleName].data, module.data)
         );

         //  newState = merge(
         //     {},
         //     newState,
         //     mapValues(
         //        pickBy(payload, (module) => module.data),
         //        (module) => ({ data: module.data })
         //     )
         //  );

         forEach(
            pickBy(payload, (module) => module.toDelete),
            (module, moduleName) => deleteRequestedFields(newState[moduleName].data, module.toDelete)
         );

         return newState;
      });
   };

   return (
      <PackageContext.Provider
         value={
            {
               updatePackage,
               backendStore,
            } as PackageContextReturns
         }
      >
         {children}
      </PackageContext.Provider>
   );
};
