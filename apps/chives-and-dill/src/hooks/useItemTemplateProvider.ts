import _ from 'lodash';
import { useContext, useEffect, useMemo, useState } from 'react';
import { ItemsApiContext } from '../contexts/ItemsApi';
import { useEnginePackageProvider } from './useEnginePackageProvider';

interface ItemTemplateProviderProps {
   itemTemplateIds: string[];
}

export const useItemTemplateProvider = ({ itemTemplateIds }: ItemTemplateProviderProps) => {
   const { itemTemplates } = useEnginePackageProvider();
   console.log(itemTemplates);

   const context = useContext(ItemsApiContext);
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
