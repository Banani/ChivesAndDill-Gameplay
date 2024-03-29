import React, { useState } from 'react';

export const DialogContext = React.createContext<any>(null);

export enum Dialogs {
    NpcTemplateDialogs = 'NpcTemplateDialogs',
    MonsterTemplateDialog = "MonsterTemplateDialog",
    ItemDialog = 'ItemDialog',
    QuestDialog = 'QuestDialog',
    SpriteGroupsDialog = 'SpriteGroupsDialog',
    EditSpriteGroupsDialog = 'EditSpriteGroupsDialog',
    AnimatedSpritesDialog = 'AnimatedSpritesDialog',
    EditAnimatedSpritesDialog = 'EditAnimatedSpritesDialog',
    SpellDialog = 'SpellDialog',
    CharacterClassDialog = 'CharacterClassDialog',
}

export const DialogProvider = ({ children }: any) => {
    const [activeDialog, setActiveDialog] = useState<Dialogs | null>(null);

    return <DialogContext.Provider value={{ activeDialog, setActiveDialog }}>{children}</DialogContext.Provider>;
};
