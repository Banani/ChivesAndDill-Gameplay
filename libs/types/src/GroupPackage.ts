
export interface Party {
    id: string;
    leader: string;
    membersIds: Record<string, boolean>;
}

export enum GroupClientMessages {
    InviteToParty = 'InviteToParty',
    PromoteToLeader = "PromoteToLeader",
    UninviteFromParty = "UninviteFromParty",
    AcceptInvite = "AcceptInvite",
    DeclineInvite = "DeclineInvite",
    LeaveParty = "LeaveParty"
}

export interface InviteToParty {
    type: GroupClientMessages.InviteToParty;
    characterId: string;
}

export interface PromoteToLeader {
    type: GroupClientMessages.PromoteToLeader;
    characterId: string;
}

export interface UninviteFromParty {
    type: GroupClientMessages.UninviteFromParty;
    characterId: string;
}

export interface AcceptInvite {
    type: GroupClientMessages.AcceptInvite;
}

export interface DeclineInvite {
    type: GroupClientMessages.DeclineInvite;
}

export interface LeaveParty {
    type: GroupClientMessages.LeaveParty;
}

export type EngineGroupAction = InviteToParty | PromoteToLeader | UninviteFromParty | AcceptInvite | DeclineInvite | LeaveParty;
