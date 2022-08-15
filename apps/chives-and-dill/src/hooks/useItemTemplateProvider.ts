import _ from 'lodash';
import { useContext, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { ItemsApiContext } from '../contexts/ItemsApi';
import { getItemTemplate } from '../stores';

interface ItemTemplateProviderProps {
   itemTemplateIds: string[];
}

export const useItemTemplateProvider = ({ itemTemplateIds }: ItemTemplateProviderProps) => {
   const itemTemplates = useSelector(getItemTemplate);
   const context = useContext(ItemsApiContext);
   const [wasRequested, setWasRequested] = useState(false);
   const { requestItemTemplates } = context;

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
