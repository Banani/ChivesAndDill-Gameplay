import { QuotesEvents } from '@bananos/types';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton, TextField } from "@mui/material";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import _ from 'lodash';
import { FunctionComponent } from 'react';
import { Label } from "../../components";

import styles from "./NpcQuotes.module.scss";

const labelMapper: Record<keyof QuotesEvents, string> = {
    'standard': "Standard quotes used outside of combat",
    'onDying': 'When the character dies',
    "onKilling": "When the character kills something",
    'onPulling': 'When the character starts a fight'
}

interface NpcQuotesProps {
    quoteEvents: QuotesEvents;
    updateQuoteEvents: (newQuoteEvents: QuotesEvents) => void;
}

export const NpcQuotes: FunctionComponent<NpcQuotesProps> = ({ quoteEvents, updateQuoteEvents }) => {

    return < div className={styles['panel-wrapper']}>
        {_.map(quoteEvents, (quoteEvent, key) => (
            <>
                <div className={styles['element-header']}>
                    <Label>{labelMapper[key as keyof QuotesEvents]}:</Label>
                    <IconButton
                        onClick={() => {
                            updateQuoteEvents({
                                ...quoteEvents, [key]: {
                                    ...quoteEvents[key as keyof QuotesEvents],
                                    quotes: [...(quoteEvents[key as keyof QuotesEvents]?.quotes ?? []), ""]
                                }
                            })
                        }}
                    >
                        <AddIcon />
                    </IconButton >
                </div>

                <TextField
                    value={(quoteEvent?.chance ?? 0) * 100}
                    onChange={(e) => {
                        updateQuoteEvents({
                            ...quoteEvents, [key]: {
                                ...quoteEvents[key as keyof QuotesEvents],
                                chance: parseInt(e.target.value) / 100
                            }
                        })
                    }}
                    margin="dense"
                    label="Chance to show (0 - 100)"
                    fullWidth
                    variant="standard"
                    type="number"
                />

                <div className={styles['data-grid-wrapper']}>
                    <DataGrid
                        experimentalFeatures={{ newEditingApi: true }}
                        rows={
                            _.chain(quoteEvent?.quotes)
                                .map((text, key) => ({
                                    id: key,
                                    text
                                }))
                                .value()
                        }
                        columns={[{
                            field: 'text',
                            flex: 1,
                            headerName: 'Text',
                            editable: true,
                        }, {
                            field: 'actions',
                            headerName: 'Actions',
                            type: 'actions',
                            width: 80,
                            getActions: ({ id }) => {
                                return [
                                    <GridActionsCellItem
                                        label="Delete"
                                        icon={<DeleteIcon />}
                                        onClick={() => updateQuoteEvents({
                                            ...quoteEvents, [key]: {
                                                ...quoteEvents[key as keyof QuotesEvents],
                                                quotes: (quoteEvents[key as keyof QuotesEvents]?.quotes ?? []).filter((_, key) => key !== id)
                                            }
                                        })}
                                    />,
                                ];
                            },
                        }]}
                        processRowUpdate={(newRow) => {
                            updateQuoteEvents({
                                ...quoteEvents, [key]: {
                                    ...quoteEvents[key as keyof QuotesEvents],
                                    quotes: (quoteEvents[key as keyof QuotesEvents]?.quotes ?? []).map((item, key) => {
                                        if (key === newRow.id) {
                                            return newRow.text;
                                        }
                                        return item;
                                    })
                                }
                            })
                            return newRow
                        }}
                        density="compact"
                        autoPageSize
                    />
                </div>
            </>
        ))}
    </div>
}