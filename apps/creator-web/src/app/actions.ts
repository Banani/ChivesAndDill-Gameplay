export enum ACTIONS {
    UPDATE_MAP_FIELD = 'UPDATE_MAP_FIELD',
    DELETE_MAP_FIELD = 'DELETE_MAP_FIELD',
    CHANGE_SPRITE_POSITION = 'CHANGE_SPRITE_POSITION',
    CHANGE_SPRITE_COLLISION = 'CHANGE_SPRITE_COLLISION',

    CREATE_SPRITE_GROUP = 'CREATE_SPRITE_GROUP',
    DELETE_SPRITE_GROUP = 'DELETE_SPRITE_GROUP',
    UPDATE_SPRITE_GROUP = 'UPDATE_SPRITE_GROUP',

    CREATE_NPC_TEMPLATE = 'CREATE_NPC_TEMPLATE',
    UPDATE_NPC_TEMPLATE = 'UPDATE_NPC_TEMPLATE',
    DELETE_NPC_TEMPLATE = 'DELETE_NPC_TEMPLATE',
    ADD_NPC = 'ADD_NPC',
    DELETE_NPC = 'DELETE_NPC',
    UPDATE_NPC = 'UPDATE_NPC',

    CREATE_MONSTER_TEMPLATE = 'CREATE_MONSTER_TEMPLATE',
    UPDATE_MONSTER_TEMPLATE = 'UPDATE_MONSTER_TEMPLATE',
    DELETE_MONSTER_TEMPLATE = 'DELETE_MONSTER_TEMPLATE',
    ADD_MONSTER = 'ADD_MONSTER',
    DELETE_MONSTER = 'DELETE_MONSTER',
    UPDATE_MONSTER = 'UPDATE_MONSTER',

    CREATE_ITEM_TEMPLATE = 'CREATE_ITEM_TEMPLATE',
    DELETE_ITEM_TEMPLATE = 'DELETE_ITEM_TEMPLATE',
    UPDATE_ITEM_TEMPLATE = 'UPDATE_ITEM_TEMPLATE',

    CREATE_QUEST = 'CREATE_QUEST',
    UPDATE_QUEST = 'UPDATE_QUEST',
    DELETE_QUEST = 'DELETE_QUEST',

    CREATE_SPELL = 'CREATE_SPELL',
    UPDATE_SPELL = 'UPDATE_SPELL',
    DELETE_SPELL = 'DELETE_SPELL',

    CREATE_CHARACTER_CLASS = 'CREATE_CHARACTER_CLASS',
    UPDATE_CHARACTER_CLASS = 'UPDATE_CHARACTER_CLASS',
    DELETE_CHARACTER_CLASS = 'DELETE_CHARACTER_CLASS',
}

export interface CharacterTemplateActions {
    CREATE_CHARACTER_TEMPLATE: ACTIONS,
    UPDATE_CHARACTER_TEMPLATE: ACTIONS,
    DELETE_CHARACTER_TEMPLATE: ACTIONS,
    ADD_CHARACTER: ACTIONS,
    DELETE_CHARACTER: ACTIONS,
    UPDATE_CHARACTER: ACTIONS,
}

export const NpcActionsMap: CharacterTemplateActions = {
    CREATE_CHARACTER_TEMPLATE: ACTIONS.CREATE_NPC_TEMPLATE,
    UPDATE_CHARACTER_TEMPLATE: ACTIONS.UPDATE_NPC_TEMPLATE,
    DELETE_CHARACTER_TEMPLATE: ACTIONS.DELETE_NPC_TEMPLATE,
    ADD_CHARACTER: ACTIONS.ADD_NPC,
    DELETE_CHARACTER: ACTIONS.DELETE_NPC,
    UPDATE_CHARACTER: ACTIONS.UPDATE_NPC,
}

export const MonsterActionsMap: CharacterTemplateActions = {
    CREATE_CHARACTER_TEMPLATE: ACTIONS.CREATE_MONSTER_TEMPLATE,
    UPDATE_CHARACTER_TEMPLATE: ACTIONS.UPDATE_MONSTER_TEMPLATE,
    DELETE_CHARACTER_TEMPLATE: ACTIONS.DELETE_MONSTER_TEMPLATE,
    ADD_CHARACTER: ACTIONS.ADD_MONSTER,
    DELETE_CHARACTER: ACTIONS.DELETE_MONSTER,
    UPDATE_CHARACTER: ACTIONS.UPDATE_MONSTER,
}
