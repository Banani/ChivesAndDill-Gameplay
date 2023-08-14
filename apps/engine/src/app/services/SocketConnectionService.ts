import { PlayerClientActions } from '@bananos/types';
import * as _ from 'lodash';
import { filter, forEach, mergeWith } from 'lodash';
import type { EngineEventCrator } from '../EngineEventsCreator';
import { EventParser } from '../EventParser';
import { Notifier } from '../Notifier';
import { CreateNewPlayerEvent, NewPlayerCreatedEvent, PlayerDisconnectedEvent, PlayerEngineEvents } from '../modules/PlayerModule/Events';
import type { EngineEventHandler } from '../types';

function customizer(objValue, srcValue) {
    if (_.isArray(objValue)) {
        return objValue.concat(srcValue);
    }
}

export class SocketConnectionService extends EventParser {
    io;
    sockets: Record<string, any> = {};
    notifiers: Notifier<any>[] = [];

    constructor(io: any, notifiers: Notifier<any>[]) {
        super();
        this.io = io;
        this.notifiers = notifiers;

        this.eventsToHandlersMap = {
            [PlayerEngineEvents.NewPlayerCreated]: this.handleNewPlayerCreated,
        };
    }

    // Not sure about it
    getSocketById = (userId) => this.sockets[userId];

    sendMessages = () => {
        const commonPackage = {};
        const targetSpecificPackage = {};
        forEach(this.sockets, (_, playerId) => {
            targetSpecificPackage[playerId] = {};
        });

        forEach(filter(this.notifiers, (notifier) => notifier.getBroadcast) as Notifier[], (notifier) => {
            const notifierPackage = notifier.getBroadcast();
            if (Object.keys(notifierPackage).length > 1) {
                commonPackage[notifierPackage.key] = notifierPackage;
            }
        });

        forEach(filter(this.notifiers, (notifier) => notifier.getMulticast) as Notifier[], (notifier) => {
            const notifierPackage = notifier.getMulticast();
            forEach(notifierPackage.messages, (message, receiverId) => {
                targetSpecificPackage[receiverId][notifierPackage.key] = message;
            });
        });

        forEach(this.sockets, (socket, playerId) => {
            // TODO: Probably there is a bug here, because data should be order by date, when they were changed
            socket.emit(PlayerClientActions.Package, mergeWith({}, commonPackage, targetSpecificPackage[playerId], customizer));
        });
    };

    init(engineEventCrator: EngineEventCrator, services) {
        super.init(engineEventCrator, services);

        this.io.on('connection', (socket) => {
            this.engineEventCrator.asyncCeateEvent<CreateNewPlayerEvent>({
                type: PlayerEngineEvents.CreateNewPlayer,
                socket: socket,
            });
        });
    }

    handleNewPlayerCreated: EngineEventHandler<NewPlayerCreatedEvent> = ({ event, services }) => {
        this.sockets[event.playerId] = event.socket;

        event.socket.on('disconnect', () => {
            this.engineEventCrator.asyncCeateEvent<PlayerDisconnectedEvent>({
                type: PlayerEngineEvents.PlayerDisconnected,
                playerId: event.playerId,
            });
            delete this.sockets[event.playerId];
        });
    };
}
