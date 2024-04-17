interface BlinkSpellDefinition {
    type: string;
    color: number;
    alpha: number;
}

// Zrobic enum ze spellami
export const BlinkSpellDefinitions: Record<string, BlinkSpellDefinition> = {
    AngleBlast: {
        type: 'AngleBlast',
        color: 0x000000,
        alpha: 0.25,
    },
    Area: {
        type: 'Area',
        color: 0xff0000,
        alpha: 0.25,
    },
    HolyCone2: {
        type: 'AngleBlast',
        color: 0x900603,
        alpha: 0.5,
    },
    DestroyerBreatheAttack_AngleBlast: {
        type: 'AngleBlast',
        color: 0x41424c,
        alpha: 0.5,
    },
    DestroyerRoarAttack_AngleBlast: {
        type: 'AngleBlast',
        color: 0x900603,
        alpha: 0.5,
    },
};
