import { useContext } from 'react';
import { PackageContext } from '../contexts/PackageContext';

export const useEnginePackageProvider = () => {
   const packageContext = useContext(PackageContext);

   return {
      //   engineState: packageContext.backendStore,
      activeCharacterId: packageContext.backendStore.activeCharacter?.data.activeCharacterId,
      characterMovements: packageContext.backendStore.characterMovements?.data,
      spellEvents: packageContext.backendStore.spells?.events,
      spellChannels: packageContext.backendStore.spellChannels?.data,
      itemTemplates: packageContext.backendStore.items?.data ?? {},
      questDefinition: packageContext.backendStore.questDefinition?.data,
      questProgress: packageContext.backendStore.questProgress?.data,
      npcQuests: packageContext.backendStore.npcQuests?.data,
      activeLoot: packageContext.backendStore.activeLoot?.data,
      activeConversation: packageContext.backendStore.npcConversation?.data,
      currency: packageContext.backendStore.currency?.data,
      experience: packageContext.backendStore.experience?.data,
      experienceEvents: packageContext.backendStore.experience?.events,
      mapSchema: packageContext.backendStore.mapSchema?.data,
      characterPowerPointsEvents: packageContext.backendStore.characterPowerPoints?.events,
      characterPowerPoints: packageContext.backendStore.characterPowerPoints?.data,
      areas: packageContext.backendStore.areas?.data.area,
      characters: packageContext.backendStore.character?.data,
      absorbShields: packageContext.backendStore.absorbShields?.data,
      absorbShieldEvents: packageContext.backendStore.absorbShields?.events,
      areaTimeEffects: packageContext.backendStore.areaTimeEffects?.data,
      projectileMovements: packageContext.backendStore.projectileMovements?.data,
      errorMessagesEvents: packageContext.backendStore.errorMessages?.events,
      timeEffects: packageContext.backendStore.timeEffects?.data,
      powerStacks: packageContext.backendStore.powerStacks?.data,
      chatChannels: packageContext.backendStore.chatChannel?.data,
   };
};
