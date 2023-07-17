import { Party } from '@bananos/types';
import { EventParser } from '../../../EventParser';
import { EngineEventHandler } from '../../../types';
import {
    GroupEngineEvents,
    PartyCreatedEvent,
    PlayerAcceptedInviteEvent,
    PlayerJoinedThePartyEvent
} from '../Events';

export class PartyService extends EventParser {
    private parties: Record<string, Party> = {};
    private increment = 0;

    constructor() {
        super();
        this.eventsToHandlersMap = {
            [GroupEngineEvents.PlayerAcceptedInvite]: this.handlePlayerAcceptedInvite
        };
    }

    handlePlayerAcceptedInvite: EngineEventHandler<PlayerAcceptedInviteEvent> = ({ event, services }) => {
        //   if (!event.chatChannel.name) {
        //      this.sendErrorMessage(event.requestingCharacterId, 'Chat channel name cannot be empty.');
        //      return;
        //   }

        //   if (find(this.channels, (channel) => channel.name === event.chatChannel.name)) {
        //      this.sendErrorMessage(event.requestingCharacterId, 'Chat channel with that name already exist.');
        //      return;
        //   }

        this.increment++;
        const partyId = this.increment.toString();
        this.parties[partyId] = {
            id: partyId,
            leader: event.inviterId,
            membersIds: {
                [event.inviterId]: true,
                [event.characterId]: true
            }
        };

        this.engineEventCrator.asyncCeateEvent<PartyCreatedEvent>({
            type: GroupEngineEvents.PartyCreated,
            party: this.parties[partyId]
        });

        this.engineEventCrator.asyncCeateEvent<PlayerJoinedThePartyEvent>({
            type: GroupEngineEvents.PlayerJoinedTheParty,
            characterId: event.inviterId,
            partyId
        });

        this.engineEventCrator.asyncCeateEvent<PlayerJoinedThePartyEvent>({
            type: GroupEngineEvents.PlayerJoinedTheParty,
            characterId: event.characterId,
            partyId
        });

        //   const character = services.characterService.getCharacterById(event.requestingCharacterId);

        //   this.engineEventCrator.asyncCeateEvent<AddPlayerCharacterToChatEvent>({
        //      type: ChatEngineEvents.AddPlayerCharacterToChat,
        //      characterName: character.name,
        //      chatChannelId: this.increment.toString(),
        //   });
    };

    getAllParties = () => this.parties;
}
