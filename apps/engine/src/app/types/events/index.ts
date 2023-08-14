import { CharacterDirection, Location } from '@bananos/types';
import { EngineEvents } from '../../EngineEvents';
import { CharacterEngineEvents } from '../../modules/CharacterModule/Events';
import { ChatEngineEvents } from '../../modules/ChatModule/Events';
import { GroupEngineEvents } from '../../modules/GroupModule/Events';
import { ItemEngineEvents } from '../../modules/ItemModule/Events';
import { MapEvents } from '../../modules/MapModule/Events';
import { MonsterEngineEvents } from '../../modules/MonsterModule/Events';
import { NpcEngineEvents } from '../../modules/NpcModule/Events';
import { PlayerEngineEvents } from '../../modules/PlayerModule/Events';
import { QuestEngineEvents } from '../../modules/QuestModule/Events';
import { SpellEngineEvents } from '../../modules/SpellModule/Events';
import { CharacterUnion } from '../CharacterUnion';
import { Services } from '../Services';

export interface EngineEvent {
    type:
    | EngineEvents
    | QuestEngineEvents
    | MonsterEngineEvents
    | SpellEngineEvents
    | CharacterEngineEvents
    | PlayerEngineEvents
    | NpcEngineEvents
    | ItemEngineEvents
    | ChatEngineEvents
    | MapEvents
    | GroupEngineEvents;

    requestingCharacterId?: string;
}

export interface CharacterDiedEvent extends EngineEvent {
    characterId: string;
    character: CharacterUnion;
    killerId: string;
}

export interface PlayerStartedMovementEvent extends EngineEvent {
    characterId: string;
}

export interface PlayerTriesToStartedMovementEvent extends EngineEvent {
    characterId: string;
    movement: PlayerMovement;
}

export interface PlayerMovement {
    y?: number;
    x?: number;
    source: string;
}

export interface PlayerStopedAllMovementVectorsEvent extends EngineEvent {
    characterId: string;
}

export interface PlayerMovedEvent extends EngineEvent {
    characterId: string;
    newCharacterDirection: CharacterDirection;
    newLocation: Location;
}

export interface PlayerStopedMovementVectorEvent extends EngineEvent {
    characterId: string;
    movement: {
        source: string;
    };
}

export interface CreatePathEvent extends EngineEvent {
    type: EngineEvents.CreatePath;
    pathSeekerId: string;
    targetId: string;
}

export interface UpdatePathEvent extends EngineEvent {
    type: EngineEvents.UpdatePath;
    pathSeekerId: string;
    points: Location[];
}

export interface DeletePathEvent extends EngineEvent {
    type: EngineEvents.DeletePath;
    pathSeekerId: string;
}

export interface ScheduleActionEvent extends EngineEvent {
    type: EngineEvents.ScheduleAction;
    id: string;
    frequency?: number;
    perdiod?: number;
}

export interface ScheduleActionTriggeredEvent extends EngineEvent {
    type: EngineEvents.ScheduleActionTriggered;
    id: string;
}
export interface ScheduleActionFinishedEvent extends EngineEvent {
    type: EngineEvents.ScheduleActionFinished;
    id: string;
}

export interface CancelScheduledActionEvent extends EngineEvent {
    type: EngineEvents.CancelScheduledAction;
    id: string;
}

export type EngineEventHandler<T> = ({ event, services }: { event: T; services: Services }) => void;

export interface EngineEventsMap {
    [EngineEvents.CharacterDied]: EngineEventHandler<CharacterDiedEvent>;
    [EngineEvents.PlayerStartedMovement]: EngineEventHandler<PlayerStartedMovementEvent>;
    [EngineEvents.PlayerTriesToStartedMovement]: EngineEventHandler<PlayerTriesToStartedMovementEvent>;
    [EngineEvents.PlayerStopedAllMovementVectors]: EngineEventHandler<PlayerStopedAllMovementVectorsEvent>;
    [EngineEvents.PlayerStopedMovementVector]: EngineEventHandler<PlayerStopedMovementVectorEvent>;
    [EngineEvents.CharacterMoved]: EngineEventHandler<PlayerMovedEvent>;

    [EngineEvents.CreatePath]: EngineEventHandler<CreatePathEvent>;
    [EngineEvents.UpdatePath]: EngineEventHandler<UpdatePathEvent>;
    [EngineEvents.DeletePath]: EngineEventHandler<DeletePathEvent>;
    [EngineEvents.ScheduleAction]: EngineEventHandler<ScheduleActionEvent>;
    [EngineEvents.ScheduleActionTriggered]: EngineEventHandler<ScheduleActionTriggeredEvent>;
    [EngineEvents.ScheduleActionFinished]: EngineEventHandler<ScheduleActionFinishedEvent>;
    [EngineEvents.CancelScheduledAction]: EngineEventHandler<CancelScheduledActionEvent>;
}
