import { GlobalStoreModule, Party } from '@bananos/types';
import * as _ from 'lodash';
import { Notifier } from '../../../Notifier';
import { EngineEventHandler } from '../../../types';
import { GroupEngineEvents, PartyCreatedEvent, PlayerJoinedThePartyEvent } from '../Events';

export class PartyNotifier extends Notifier<Party> {
    constructor() {
        super({ key: GlobalStoreModule.PARTY });
        this.eventsToHandlersMap = {
            [GroupEngineEvents.PartyCreated]: this.handlePartyCreated,
            [GroupEngineEvents.PlayerJoinedTheParty]: this.handlePlayerJoinedTheParty
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
        });

        this.multicastMultipleObjectsUpdate(toUpdate);
    };
}
