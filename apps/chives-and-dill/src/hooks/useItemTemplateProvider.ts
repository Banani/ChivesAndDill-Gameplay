import { GlobalStoreModule } from '@bananos/types';
import _ from 'lodash';
import { useContext, useEffect, useMemo, useState } from 'react';
import { EngineApiContext } from '../contexts/EngineApi';
import { useEngineModuleReader } from './useEngineModuleReader';

interface ItemTemplateProviderProps {
   itemTemplateIds: string[];
}

export const useItemTemplateProvider = ({ itemTemplateIds }: ItemTemplateProviderProps) => {
   const { data: itemTemplates } = useEngineModuleReader(GlobalStoreModule.CHAT_MESSAGES);

   const context = useContext(EngineApiContext);
   const { requestItemTemplates } = context;
   const [wasRequested, setWasRequested] = useState(false);

   useEffect(() => {
      if (wasRequested) {
         return;
      }

      const requiredItemTemplates = itemTemplateIds.filter((id) => !itemTemplates[id]);
      if (requiredItemTemplates.length > 0) {
         requestItemTemplates(requiredItemTemplates);
         setWasRequested(true);
      }
   }, [itemTemplateIds, wasRequested]);

   useEffect(() => {
      if (wasRequested) {
         setWasRequested(false);
      }
   }, [Object.keys(itemTemplates).length]);

   const calculatedItemTemplates = useMemo(
      () =>
         _.chain(itemTemplateIds)
            .keyBy()
            .mapValues((templateId) => itemTemplates[templateId])
            .value(),
      [itemTemplates]
   );

   return { itemTemplates: calculatedItemTemplates };
};
