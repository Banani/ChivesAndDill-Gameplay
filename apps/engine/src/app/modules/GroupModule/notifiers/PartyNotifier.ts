import { GlobalStoreModule, Party } from '@bananos/types';
import * as _ from 'lodash';
import { Notifier } from '../../../Notifier';
import { EngineEventHandler } from '../../../types';
import { GroupEngineEvents, PartyCreatedEvent, PartyLeaderChangedEvent, PartyRemovedEvent, PlayerJoinedThePartyEvent, PlayerLeftThePartyEvent } from '../Events';

export class PartyNotifier extends Notifier<Party> {
    constructor() {
        super({ key: GlobalStoreModule.PARTY });
        this.eventsToHandlersMap = {
            [GroupEngineEvents.PartyCreated]: this.handlePartyCreated,
            [GroupEngineEvents.PartyRemoved]: this.handlePartyRemoved,
            [GroupEngineEvents.PlayerJoinedTheParty]: this.handlePlayerJoinedTheParty,
            [GroupEngineEvents.PartyLeaderChanged]: this.handlePartyLeaderChanged,
            [GroupEngineEvents.PlayerLeftTheParty]: this.handlePlayerLeftTheParty
        };
    }

    handlePartyCreated: EngineEventHandler<PartyCreatedEvent> = ({ event, services }) => {
        const toUpdate = [];

        _.forEach(event.party.membersIds, (_, memberId) => {
            const receiverId = this.getReceiverId(memberId, services);
            if (!receiverId) {
                return;
            }

            toUpdate.push({
                receiverId,
                objects: {
                    [event.party.id]: {
                        leader: event.party.leader
                    }
                }
            })
        });

        if (toUpdate.length > 0) {
            this.multicastMultipleObjectsUpdate(toUpdate);
        }
    };

    handlePartyRemoved: EngineEventHandler<PartyRemovedEvent> = ({ event, services }) => {
        const toUpdate = [];

        _.forEach(event.party.membersIds, (_, memberId) => {
            const receiverId = this.getReceiverId(memberId, services);
            if (!receiverId) {
                return;
            }

            toUpdate.push({
                receiverId,
                objects: {
                    [event.party.id]: null
                }
            })
        });

        if (toUpdate.length > 0) {
            this.multicastObjectsDeletion(toUpdate);
        }
    };

    handlePlayerJoinedTheParty: EngineEventHandler<PlayerJoinedThePartyEvent> = ({ event, services }) => {
        const receiverId = this.getReceiverId(event.characterId, services);
        if (!receiverId) {
            return;
        }

        const party = services.partyService.getAllParties()[event.partyId];
        if (!party) {
            return;
        }

        const toUpdate = [];
        _.forEach(party.membersIds, (_, memberId) => {
            const receiverId = this.getReceiverId(memberId, services);
            if (!receiverId) {
                return;
            }

            if (event.characterId === memberId) {
                toUpdate.push({
                    receiverId,
                    objects: {
                        [party.id]: {
                            leader: party.leader,
                            membersIds: party.membersIds
                        }
                    }
                })
            } else {
                toUpdate.push({
                    receiverId,
                    objects: {
                        [party.id]: {
                            membersIds: {
                                [event.characterId]: true
                            }
                        }
                    }
                })
            }
        });

        this.multicastMultipleObjectsUpdate(toUpdate);
    };

    handlePartyLeaderChanged: EngineEventHandler<PartyLeaderChangedEvent> = ({ event, services }) => {
        const toUpdate = [];

        const party = services.partyService.getAllParties()[event.partyId];
        if (!party) {
            return;
        }

        _.forEach(party.membersIds, (_, memberId) => {
            const receiverId = this.getReceiverId(memberId, services);
            if (!receiverId) {
                return;
            }

            toUpdate.push({
                receiverId,
                objects: {
                    [party.id]: {
                        leader: event.newCharacterLeaderId
                    }
                }
            })
        });

        if (toUpdate.length > 0) {
            this.multicastMultipleObjectsUpdate(toUpdate);
        }
    };

    handlePlayerLeftTheParty: EngineEventHandler<PlayerLeftThePartyEvent> = ({ event, services }) => {
        const toUpdate = [];

        const party = services.partyService.getAllParties()[event.partyId];
        if (!party) {
            return;
        }

        _.forEach(party.membersIds, (_, memberId) => {
            const receiverId = this.getReceiverId(memberId, services);
            if (!receiverId) {
                return;
            }

            toUpdate.push({
                receiverId,
                objects: {
                    [party.id]: {
                        membersIds: {
                            [event.characterId]: null
                        }
                    }
                }
            })
        });

        const receiverId = this.getReceiverId(event.characterId, services);
        if (!receiverId) {
            return;
        }

        toUpdate.push({
            receiverId,
            objects: {
                [party.id]: null
            }
        })

        if (toUpdate.length > 0) {
            this.multicastObjectsDeletion(toUpdate);
        }
    };
}
