import { Button } from '@mui/material';
import { useContext, useState } from 'react';


import { QuoteHandler } from '@bananos/types';
import AddIcon from '@mui/icons-material/Add';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import TextField from '@mui/material/TextField';
import _ from 'lodash';
import { Circle, CircleType, ImageList } from '../../../components';
import { PackageContext } from '../../../contexts';
import { DialogContext, Dialogs } from '../../../contexts/dialogContext';
import { DeleteConfirmationDialog } from '../../../dialogs';
import { Pagination } from '../../components';
import { NpcContext, NpcTemplate } from '../NpcContextProvider';
import styles from './npcTemplatesPanel.module.scss';

export const NpcTemplatesPanel = () => {
    const [paginationRange, setPaginationRange] = useState({ start: 0, end: 0 });
    const [paginationReset, setPaginationReset] = useState(0);
    const [npcTemplatesToDelete, setNpcTemplatesToDelete] = useState<NpcTemplate[]>([]);

    const [searchFilter, setSearchFilter] = useState('');

    const packageContext = useContext(PackageContext);

    const npcTemplates = packageContext?.backendStore?.npcTemplates?.data ?? {};
    const npcs = packageContext?.backendStore?.npcs?.data ?? {}

    const { setActiveDialog } = useContext(DialogContext);
    const { activeNpcTemplate, setActiveNpcTemplate, deleteNpcTemplate } = useContext(NpcContext);

    return (
        <div className={styles['control-panel']}>
            {<DeleteConfirmationDialog
                itemsToDelete={npcTemplatesToDelete.map((npcTemplate) => npcTemplate.name)}
                cancelAction={() => setNpcTemplatesToDelete([])}
                confirmAction={() => {
                    if (npcTemplatesToDelete.length > 0) {
                        deleteNpcTemplate(npcTemplatesToDelete[0]?.id);
                        setNpcTemplatesToDelete([]);
                    }
                }}
            />}
            <Button variant="outlined" onClick={() => {
                setActiveNpcTemplate(null);
                setActiveDialog(Dialogs.NpcTemplateDialogs)
            }}>
                <AddIcon />
            </Button>

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

            <div className={styles['list-wrapper']}>
                <ImageList activeId={activeNpcTemplate?.id ?? ""} items={
                    Object.values<NpcTemplate>(npcTemplates)
                        .filter((npcTemplate: NpcTemplate) => npcTemplate.name?.toLowerCase().indexOf(searchFilter.toLowerCase()) !== -1)
                        .slice(paginationRange.start, paginationRange.end).map(npcTemplate => {
                            const stockSize = Object.keys(npcTemplate.stock).length;
                            const questsAmount = Object.keys(npcTemplate.quests).length;
                            const respawnsAmount = _.filter(npcs, npc => npc.npcTemplateId === npcTemplate.id).length;
                            const quotesAmount = _.chain(npcTemplate.quotesEvents ?? {}).map((event: QuoteHandler) => (event.quotes ?? []).length).sum().value();

                            return {
                                id: npcTemplate.id,
                                name: npcTemplate.name,
                                path: 'assets/citizen.png',
                                circles: <>
                                    {respawnsAmount > 0 ? <Circle type={CircleType.npc} number={respawnsAmount} /> : null}
                                    {questsAmount > 0 ? <Circle type={CircleType.quest} number={questsAmount} /> : null}
                                    {stockSize > 0 ? <Circle type={CircleType.item} number={stockSize} /> : null}
                                    {quotesAmount > 0 ? <Circle type={CircleType.quote} number={quotesAmount} /> : null}
                                </>,
                                onClick: () => setActiveNpcTemplate(npcTemplate),
                                actions: [{
                                    onClick: (npcTemplate) => setNpcTemplatesToDelete([npcTemplate]),
                                    icon: <DeleteForeverIcon />
                                }, {
                                    onClick: () => {
                                        setActiveNpcTemplate(npcTemplate)
                                        setActiveDialog(Dialogs.NpcTemplateDialogs)
                                    },
                                    icon: <ModeEditIcon />
                                },]
                            }
                        })
                }
                />
            </div>
            <Pagination pageSize={14} itemsAmount={Object.values(npcTemplates).length} setRange={setPaginationRange} reset={paginationReset} />
        </div>
    );
};
