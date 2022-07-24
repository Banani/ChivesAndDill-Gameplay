import { Module } from '@bananos/socket-store';
import { forEach, clone, merge, mapValues, pickBy } from 'lodash';
import React, { FunctionComponent, useEffect, useState } from 'react';

export const PackageContext = React.createContext<any>(null);

const deleteRequestedFields = (data: any, pathToDelete: any) => {
   forEach(pathToDelete, (toDelete, key) => {
      if (toDelete === null) {
         delete data[key];
      } else {
         deleteRequestedFields(data[key], toDelete);
      }
   });
};

const emptyModule: Module = {
   data: {},
   events: [],
};

export const PackageContextProvider: FunctionComponent = ({ children }) => {
   const [backendStore, setBackendStore] = useState({});

   const updatePackage = (payload: any) => {
      setBackendStore((prev) => {
         let newState: Record<string, Module> = clone(prev);

         forEach(newState, (module: Module) => {
            module.events = [];
         });

         forEach(payload, (module: Module, moduleName: string) => {
            if (!newState[moduleName]) {
               newState[moduleName] = emptyModule;
            }

            if (module.events) {
               newState[moduleName].events = module.events;
            }
         });

         newState = merge(
            {},
            newState,
            mapValues(
               pickBy(payload, (module) => module.data),
               (module) => ({ data: module.data })
            )
         );

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
            } as any
         }
      >
         {children}
      </PackageContext.Provider>
   );
};
