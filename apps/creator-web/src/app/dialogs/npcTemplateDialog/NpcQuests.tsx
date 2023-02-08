import { QuestSchema } from '@bananos/types';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import _ from 'lodash';
import { useContext } from 'react';
import { AssignmentPanel } from '../../components/assignmentPanel';
import { PackageContext } from '../../contexts';
import { NpcContext, NpcTemplate } from '../../views';

import styles from "./NpcQuests.module.scss";

export const NpcQuests = () => {
    const packageContext = useContext(PackageContext);
    const questSchemas = packageContext?.backendStore?.questSchemas?.data ?? {};
    const itemTemplates = packageContext?.backendStore?.itemTemplates?.data ?? {};
    const npcTemplates = packageContext?.backendStore?.npcTemplates?.data ?? {};
    const { setActiveNpcTemplate } = useContext(NpcContext);

    const columns: GridColDef[] = [
        { field: 'name', headerName: 'Name', flex: 1 },
        {
            field: 'questReward.experience',
            headerName: 'Experience',
            flex: 1,
            renderCell: (params: GridRenderCellParams<QuestSchema>) => {
                return params.row.questReward.experience;
            }
        },
        {
            field: 'questReward.currency',
            headerName: 'Money reward (in coppers)',
            flex: 1,
            renderCell: (params: GridRenderCellParams<QuestSchema>) => {
                return params.row.questReward.currency;
            },
        },

        {
            field: 'npcs_amount',
            headerName: 'Assigned to NPCs',
            flex: 1,
            renderCell: (params: GridRenderCellParams<QuestSchema>) => {
                return <>
                    {_.filter(npcTemplates, npcTemplate => npcTemplate.quests[params.row.id]).length}
                </>
            },
        },
        {
            field: 'questReward.items',
            headerName: 'Items reward',
            flex: 1,
            renderCell: (params: GridRenderCellParams<QuestSchema>) => {
                return <>
                    {_.map(params.row.questReward.items, item =>
                        <img src={itemTemplates[item.itemTemplateId].image} className={styles['item-image-preview']} />
                    )}
                </>
            },
        }
    ];

    return (
        <AssignmentPanel
            allItems={questSchemas}
            allItemsColumnDefinition={columns}
            selectedItemsColumnDefinition={columns}
            selectionChanged={(selectionModel) => {
                setActiveNpcTemplate((prev: NpcTemplate) => ({
                    ...prev,
                    quests: _.chain(selectionModel)
                        .keyBy()
                        .mapValues(() => true)
                        .value(),
                }));
            }} />
    );
};
