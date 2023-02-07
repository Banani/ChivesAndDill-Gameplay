import { ItemTemplate, QuestRewardItem } from '@bananos/types';
import AddIcon from '@mui/icons-material/Add';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { Button, Paper } from '@mui/material';
import TextField from '@mui/material/TextField';
import _ from 'lodash';
import { useContext, useState } from 'react';
import { Circle, CircleType } from '../../components';
import { PackageContext } from '../../contexts';
import { DialogContext, Dialogs } from '../../contexts/dialogContext';
import { DeleteConfirmationDialog } from '../../dialogs';
import { Pagination } from '../components';

import styles from './Items.module.scss';
import { ItemsContext } from './ItemsContextProvider';

export const Items = () => {
    const { setActiveDialog } = useContext(DialogContext);
    const packageContext = useContext(PackageContext);
    const { deleteItemTemplate, setActiveItemTemplate } = useContext(ItemsContext);
    const [paginationRange, setPaginationRange] = useState({ start: 0, end: 0 });
    const [paginationReset, setPaginationReset] = useState(0);
    const [searchFilter, setSearchFilter] = useState('');

    const [itemsToDelete, setItemsToDelete] = useState<ItemTemplate[]>([]);

    const npcTemplates = packageContext?.backendStore?.npcTemplates?.data ? packageContext?.backendStore?.npcTemplates?.data : {};
    const itemTemplates = packageContext?.backendStore?.itemTemplates?.data ? packageContext?.backendStore?.itemTemplates?.data : {};
    const questSchemas = packageContext?.backendStore?.questSchemas?.data ?? {};

    return (
        <>
            <DeleteConfirmationDialog
                itemsToDelete={itemsToDelete.map((item) => item.name)}
                cancelAction={() => setItemsToDelete([])}
                confirmAction={() => {
                    if (itemsToDelete.length > 0) {
                        deleteItemTemplate(itemsToDelete[0]?.id);
                        setItemsToDelete([]);
                    }
                }}
            />
            <Paper className={styles['map-editor']}>
                <div className={styles['manage-panel']}>
                    <TextField
                        value={searchFilter}
                        onChange={(e) => {
                            setSearchFilter(e.target.value);
                            setPaginationReset((prev) => prev + 1);
                        }}
                        margin="dense"
                        label="Search by name"
                        fullWidth
                        variant="standard"
                        type="text"
                    />

                    <Button
                        className={styles['add-item-template-button']}
                        variant="outlined"
                        onClick={() => {
                            setActiveItemTemplate(null);
                            setActiveDialog(Dialogs.ItemDialog);
                        }}
                    >
                        <AddIcon />
                    </Button>
                </div>

                <div className={styles['list-holder']}>
                    <div className={styles['list']}>
                        {_.map(
                            Object.values<ItemTemplate>(itemTemplates)
                                .filter((itemTemplate: ItemTemplate) => itemTemplate.name.toLowerCase().indexOf(searchFilter.toLowerCase()) !== -1)
                                .slice(paginationRange.start, paginationRange.end),
                            (itemTemplate) => {
                                const npcsSellingThatItem = _.filter(npcTemplates, (npc) => npc.stock?.[itemTemplate.id]).length;
                                const rewardsInQuests = _.filter(questSchemas, (quest) =>
                                    quest.questReward.items.find((reward: QuestRewardItem) => reward.itemTemplateId == itemTemplate.id)).length;

                                return (
                                    <div
                                        key={itemTemplate.id}
                                        className={styles['list-item']}
                                        onClick={() => {
                                            setActiveDialog(Dialogs.ItemDialog);
                                            setActiveItemTemplate(itemTemplate);
                                        }}
                                    >
                                        <div className={styles['preview-box']}>
                                            {npcsSellingThatItem > 0 ? <Circle type={CircleType.npc} number={npcsSellingThatItem} /> : null}
                                            {rewardsInQuests > 0 ? <Circle type={CircleType.quest} number={rewardsInQuests} /> : null}
                                        </div>
                                        <img className={styles['image-preview']} src={itemTemplate.image} />
                                        <div className={styles['bar']}>{itemTemplate.name}</div>
                                        <div
                                            className={styles['delete-icon']}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setItemsToDelete([itemTemplate]);
                                            }}
                                        >
                                            <DeleteForeverIcon />
                                        </div>
                                    </div>
                                );
                            }
                        )}
                    </div>
                </div>
                <div className={styles['pagination-holder']}>
                    <Pagination itemsAmount={Object.values(itemTemplates).length} setRange={setPaginationRange} reset={paginationReset} />
                </div>
            </Paper>
        </>
    );
};
