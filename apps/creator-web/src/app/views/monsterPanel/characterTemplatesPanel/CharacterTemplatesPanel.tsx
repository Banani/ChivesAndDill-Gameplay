import { Button } from '@mui/material';
import { FunctionComponent, useContext, useState } from 'react';


import AddIcon from '@mui/icons-material/Add';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import TextField from '@mui/material/TextField';
import { ImageList } from '../../../components';
import { DialogContext, Dialogs } from '../../../contexts/dialogContext';
import { DeleteConfirmationDialog } from '../../../dialogs';
import { Pagination } from '../../components';
import { CharacterContext } from '../CharacterContextProvider';
import styles from './CharacterTemplatesPanel.module.scss';

interface PreviewCharacter {
    id: string;
    name: string;
    path: string;
    circles: any;
}

interface CharacterTemplatesPanelProps {
    characters: PreviewCharacter[];
    createDialog: Dialogs;
}


export const CharacterTemplatesPanel: FunctionComponent<CharacterTemplatesPanelProps> = ({ characters, createDialog }) => {
    const [paginationRange, setPaginationRange] = useState({ start: 0, end: 0 });
    const [paginationReset, setPaginationReset] = useState(0);
    const [npcTemplatesToDelete, setNpcTemplatesToDelete] = useState<PreviewCharacter[]>([]);

    const [searchFilter, setSearchFilter] = useState('');

    const { setActiveDialog } = useContext(DialogContext);
    const { activeCharacterTemplate, setActiveCharacterTemplate, deleteCharacterTemplate, setActiveCharacterTemplateById } = useContext(CharacterContext);

    return (
        <div className={styles['control-panel']}>
            {<DeleteConfirmationDialog
                itemsToDelete={npcTemplatesToDelete.map((npcTemplate) => npcTemplate.name)}
                cancelAction={() => setNpcTemplatesToDelete([])}
                confirmAction={() => {
                    if (npcTemplatesToDelete.length > 0) {
                        deleteCharacterTemplate(npcTemplatesToDelete[0]?.id);
                        setNpcTemplatesToDelete([]);
                    }
                }}
            />}
            <Button variant="outlined" onClick={() => {
                setActiveCharacterTemplate(null);
                setActiveDialog(createDialog)
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
                <ImageList activeId={activeCharacterTemplate?.id ?? ""} items={
                    Object.values(characters)
                        .filter((characterTemplate: PreviewCharacter) => characterTemplate.name?.toLowerCase().indexOf(searchFilter.toLowerCase()) !== -1)
                        .slice(paginationRange.start, paginationRange.end).map(previewCharacter => {
                            // const stockSize = Object.keys(characterTemplate.stock).length;
                            // const questsAmount = Object.keys(characterTemplate.quests).length;
                            // const respawnsAmount = _.filter(npcs, npc => npc.npcTemplateId === characterTemplate.id).length;
                            // const quotesAmount = _.chain(characterTemplate.quotesEvents ?? {}).map((event: QuoteHandler) => (event.quotes ?? []).length).sum().value();

                            return {
                                id: previewCharacter.id,
                                name: previewCharacter.name,
                                path: previewCharacter.path,
                                circles: previewCharacter.circles,
                                /* {respawnsAmount > 0 ? <Circle type={CircleType.npc} number={respawnsAmount} /> : null}
                                {questsAmount > 0 ? <Circle type={CircleType.quest} number={questsAmount} /> : null}
                                {stockSize > 0 ? <Circle type={CircleType.item} number={stockSize} /> : null}
                                {quotesAmount > 0 ? <Circle type={CircleType.quote} number={quotesAmount} /> : null} */
                                // </>,
                                onClick: () => setActiveCharacterTemplateById(previewCharacter.id),
                                actions: [{
                                    onClick: (npcTemplate) => setNpcTemplatesToDelete([npcTemplate]),
                                    icon: <DeleteForeverIcon />
                                }, {
                                    onClick: () => {
                                        setActiveCharacterTemplateById(previewCharacter.id);
                                        setActiveDialog(createDialog);
                                    },
                                    icon: <ModeEditIcon />
                                },]
                            }
                        })
                }
                />
            </div>
            <Pagination pageSize={14} itemsAmount={Object.values(characters).length} setRange={setPaginationRange} reset={paginationReset} />
        </div>
    );
};
