export interface Party {
    id: string;
    leader: string;
    membersIds: Record<string, boolean>;
}

export enum GroupClientActions {
    InviteToParty = 'InviteToParty',
    PromoteToLeader = "PromoteToLeader",
    UninviteFromParty = "UninviteFromParty",
    AcceptInvite = "AcceptInvite",
    DeclineInvite = "DeclineInvite",
    LeaveParty = "LeaveParty"
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
