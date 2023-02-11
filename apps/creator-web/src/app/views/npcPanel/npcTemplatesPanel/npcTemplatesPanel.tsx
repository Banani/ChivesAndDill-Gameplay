import { Button } from '@mui/material';
import { map } from 'lodash';
import { useContext, useState } from 'react';


import AddIcon from '@mui/icons-material/Add';
import TextField from '@mui/material/TextField';
import classNames from 'classnames';
import _ from 'lodash';
import { Circle, CircleBox, CircleType } from '../../../components';
import { PackageContext } from '../../../contexts';
import { DialogContext, Dialogs } from '../../../contexts/dialogContext';
import { Pagination } from '../../components';
import { NpcContext, NpcTemplate } from '../NpcContextProvider';
import styles from './npcTemplatesPanel.module.scss';

export const NpcTemplatesPanel = () => {
    const [paginationRange, setPaginationRange] = useState({ start: 0, end: 0 });
    const [paginationReset, setPaginationReset] = useState(0);

    const [searchFilter, setSearchFilter] = useState('');

    const packageContext = useContext(PackageContext);

    const npcTemplates = packageContext?.backendStore?.npcTemplates?.data ?? {};
    const npcs = packageContext?.backendStore?.npcs?.data ?? {}

    const { setActiveDialog } = useContext(DialogContext);
    const { activeNpcTemplate, setActiveNpcTemplate } = useContext(NpcContext);

    return (
        <div className={styles['control-panel']}>
            <Button variant="outlined" onClick={() => setActiveDialog(Dialogs.NpcTemplateDialogs)}>
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
                <div className={styles['list']}>
                    {map(
                        Object.values<NpcTemplate>(npcTemplates)
                            .filter((npcTemplate: NpcTemplate) => npcTemplate.name?.toLowerCase().indexOf(searchFilter.toLowerCase()) !== -1)
                            .slice(paginationRange.start, paginationRange.end),
                        (npcTemplate: NpcTemplate) => {
                            const stockSize = Object.keys(npcTemplate.stock).length;
                            const questsAmount = Object.keys(npcTemplate.quests).length;
                            const respawnsAmount = _.filter(npcs, npc => npc.npcTemplateId === npcTemplate.id).length;

                            return (
                                <div
                                    key={npcTemplate.id}
                                    className={classNames({
                                        [styles['imageHolder']]: true,
                                        [styles['active']]: activeNpcTemplate.id === npcTemplate.id,
                                    })}
                                    onClick={() => setActiveNpcTemplate(npcTemplate)}
                                >
                                    <img className={styles['image']} src={'assets/citizen.png'} />
                                    <div className={styles['bar']}>{npcTemplate.name}</div>
                                    <CircleBox>
                                        {respawnsAmount > 0 ? <Circle type={CircleType.npc} number={respawnsAmount} /> : null}
                                        {questsAmount > 0 ? <Circle type={CircleType.quest} number={questsAmount} /> : null}
                                        {stockSize > 0 ? <Circle type={CircleType.item} number={stockSize} /> : null}
                                    </CircleBox>
                                </div>
                            )
                        }
                    )}
                </div>
            </div>
            <Pagination pageSize={14} itemsAmount={Object.values(npcTemplates).length} setRange={setPaginationRange} reset={paginationReset} />
        </div>
    );
};
