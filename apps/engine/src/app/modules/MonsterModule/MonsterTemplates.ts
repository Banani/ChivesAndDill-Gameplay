import type { QuotesEvents } from '@bananos/types';
import { ALL_SPELLS } from '../SpellModule/spells';
import type { Spell } from '../SpellModule/types/SpellTypes';

export interface CoinDropSchema {
   dropChance: number;
   maxAmount: number;
   minAmount: number;
}

export interface ItemDropSchema {
   itemTemplateId: string;
   dropChance: number;
   maxAmount: number;
   minAmount: number;
}

export interface MonsterTemplate {
   id: string;
   name: string;
   sprites: string;
   avatar: string;
   size: number;
   healthPoints: number;
   spellPower: number;
   division?: string;
   sightRange: number;
   desiredRange: number;
   speed: number;
   escapeRange: number;
   spells: Record<string, Spell>;
   attackFrequency: number;
   healthPointsRegen: number;
   spellPowerRegen: number;
   dropSchema?: {
      coins: CoinDropSchema;
      items?: ItemDropSchema[];
   };
   quotesEvents?: QuotesEvents;
}

export const MonsterTemplates: Record<string, MonsterTemplate> = {
   Orc: {
      id: 'Orc',
      name: 'Orc',
      sprites: 'orc',
      avatar: '../../../../assets/spritesheets/avatars/orcAvatar.png',
      size: 96,
      healthPoints: 60,
      spellPower: 100,
      speed: 2,
      division: 'Orc',
      sightRange: 1,
      desiredRange: 50,
      escapeRange: 2000,
      attackFrequency: 1500,
      healthPointsRegen: 5,
      spellPowerRegen: 5,
      spells: {
         MonsterProjectile: ALL_SPELLS['MonsterProjectile'],
         MonsterInstant1: ALL_SPELLS['MonsterInstant1'],
         MonsterInstant2: ALL_SPELLS['MonsterInstant2'],
      },
      dropSchema: {
         coins: {
            dropChance: 0.9,
            maxAmount: 30,
            minAmount: 0,
         },
         items: [
            {
               itemTemplateId: '1',
               dropChance: 1,
               maxAmount: 1,
               minAmount: 1,
            },
            {
               itemTemplateId: '2',
               dropChance: 1,
               maxAmount: 1,
               minAmount: 1,
            },
            {
               itemTemplateId: '3',
               dropChance: 1,
               maxAmount: 1,
               minAmount: 1,
            },
            {
               itemTemplateId: '4',
               dropChance: 1,
               maxAmount: 1,
               minAmount: 1,
            },
            {
               itemTemplateId: '5',
               dropChance: 1,
               maxAmount: 1,
               minAmount: 1,
            },
            {
               itemTemplateId: '6',
               dropChance: 1,
               maxAmount: 1,
               minAmount: 1,
            },
            {
               itemTemplateId: '7',
               dropChance: 0.7,
               maxAmount: 1,
               minAmount: 1,
            },
            {
               itemTemplateId: '8',
               dropChance: 0.7,
               maxAmount: 1,
               minAmount: 1,
            },
         ],
      },
      quotesEvents: {
         onDying: {
            chance: 0.5,
            quotes: ['Tylko nie to...', 'Umarłem :(', 'Agrrrr...'],
         },
         onPulling: {
            chance: 0.5,
            quotes: ['Zgniotę Cie jak truskaweczke', 'Zabicie Cie, to bedzie bułeczka z masełkiem'],
         },
         onKilling: {
            chance: 0.5,
            quotes: ['Pfff... ledwie go uderzyłem', 'Ale jestem potezny, o moj boze, a jakie mam miesnie? Po prostu kox'],
         },
         standard: {
            chance: 0.05,
            quotes: [
               'Zjadłbym zupe pomidorową Kamila, była super',
               'Mikolajowi dzisiaj smierdziały stopki, też to czuliście?',
               'gul, gul',
               'Pscółka dzisiaj jakas zła chodzi',
               'Czasem czuje jakby moje miejsce bylo gdzies indziej',
               'Ciekawe co robi Jasiu',
               'Bał cziki, bał, bał',
               'Tak miły mówi mi',
               'Gdzie jest Mikołaj, telewizor mi nie działa',
               'Trzeba zamykać drzwi na klucz, bo złodziej przyjdzie',
               'A co ten ksiądz wymyślił? Daj spokoj...',
            ],
         },
      },
   },
   OrcSpearman: {
      id: 'OrcSpearman',
      name: 'OrcSpearman',
      sprites: 'orcSpearman',
      avatar: '../../../../assets/spritesheets/avatars/orcSpearmanAvatar.png',
      size: 96,
      healthPoints: 200,
      spellPower: 100,
      division: 'OrcSpearman',
      speed: 3,
      sightRange: 200,
      desiredRange: 200,
      escapeRange: 2000,
      attackFrequency: 50,
      healthPointsRegen: 5,
      spellPowerRegen: 5,
      spells: {
         MonsterProjectile: ALL_SPELLS['MonsterProjectile'],
         MonsterInstant1: ALL_SPELLS['MonsterInstant1'],
      },
      dropSchema: {
         coins: {
            dropChance: 0.75,
            maxAmount: 30,
            minAmount: 0,
         },
      },
   },
   WorldDestroyer: {
      id: 'WorldDestroyer',
      name: 'WorldDestroyer',
      sprites: 'demon',
      avatar: '../../../../assets/spritesheets/avatars/demonAvatar.png',
      size: 96,
      healthPoints: 20000,
      spellPower: 10000,
      speed: 6,
      sightRange: 200,
      desiredRange: 50,
      escapeRange: 2000,
      attackFrequency: 900,
      healthPointsRegen: 5,
      spellPowerRegen: 5,
      spells: {
         DestroyerBasic: ALL_SPELLS['DestroyerBasic'],
      },
   },
};
