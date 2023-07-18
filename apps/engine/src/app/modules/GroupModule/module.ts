import { EngineModule } from '../../types/EngineModule';
import { PartyInvitationNotifier, PartyNotifier } from './notifiers';
import { PartyInvitationService, PartyService } from './services';

export interface GroupModuleServices {
    partyService: PartyService;
    partyInvitationService: PartyInvitationService;
}

export const getGroupModule: () => EngineModule<GroupModuleServices> = () => {
    return {
        notifiers: [new PartyNotifier(), new PartyInvitationNotifier()],
        services: {
            partyService: new PartyService(),
            partyInvitationService: new PartyInvitationService()
        },
    };
};
