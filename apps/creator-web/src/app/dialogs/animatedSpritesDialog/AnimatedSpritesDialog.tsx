import AddIcon from '@mui/icons-material/Add';

import { Button } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { FunctionComponent, useContext } from 'react';
import { DialogContext, Dialogs } from '../../contexts/dialogContext';

import styles from "./AnimatedSpritesDialog.module.scss";

export const AnimatedSpritesDialog: FunctionComponent = ({ }) => {
    const { activeDialog, setActiveDialog } = useContext(DialogContext);

    return (
        <Dialog open={activeDialog === Dialogs.AnimatedSpritesDialog} onClose={() => setActiveDialog(null)} maxWidth="xl">
            <DialogTitle>Animated Sprites</DialogTitle>
            <DialogContent className={styles['dialog']}>
                <Button className={styles['add-button']} variant="outlined" onClick={() => setActiveDialog(Dialogs.EditAnimatedSpritesDialog)}>
                    <AddIcon />
                </Button>
            </DialogContent>
        </Dialog>
    );
};
