export interface Party {
    id: string;
    leader: string;
    membersIds: Record<string, boolean>;
}

export enum GroupClientActions {
    InviteToParty = 'Player_InviteToParty',
    PromoteToLeader = "Player_PromoteToLeader",
    UninviteFromParty = "Player_UninviteFromParty",
    AcceptInvite = "Player_AcceptInvite",
    DeclineInvite = "Player_DeclineInvite",
    LeaveParty = "Player_LeaveParty"
}

export interface InviteToParty {
    type: GroupClientActions.InviteToParty;
    characterId: string;
}

export interface PromoteToLeader {
    type: GroupClientActions.PromoteToLeader;
    characterId: string;
}

export interface UninviteFromParty {
    type: GroupClientActions.UninviteFromParty;
    characterId: string;
}

export interface AcceptInvite {
    type: GroupClientActions.AcceptInvite;
}

export interface DeclineInvite {
    type: GroupClientActions.DeclineInvite;
}

export interface LeaveParty {
    type: GroupClientActions.LeaveParty;
}

export type EngineGroupAction = InviteToParty | PromoteToLeader | UninviteFromParty | AcceptInvite | DeclineInvite | LeaveParty;
