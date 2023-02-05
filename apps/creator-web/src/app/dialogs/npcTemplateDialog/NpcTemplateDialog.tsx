import { Box, Tab, Tabs } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { useCallback, useContext, useEffect, useState } from 'react';
import { DialogContext, Dialogs } from '../../contexts/dialogContext';
import { NpcContext } from '../../views/npcPanel/NpcContextProvider';
import { ItemStock } from './ItemStock';

import styles from './NpcTemplateDialog.module.scss';

enum NpcTemplateDialogTabs {
   Default = 'Default',
   Stock = 'Stock',
   Quests = 'Quests',
}

const DefaultNpcTemplate = {
   id: '',
   name: '',
   healthPoints: 100,
   healthPointsRegeneration: 5,
   spellPower: 100,
   spellPowerRegeneration: 5,
   movementSpeed: 8,
   stock: {},
};

export const NpcTemplateDialog = () => {
   const { activeDialog, setActiveDialog } = useContext(DialogContext);
   const { createNpcTemplate, setActiveNpcTemplate, activeNpcTemplate } = useContext(NpcContext);

   const [activeTab, setActiveTab] = useState<NpcTemplateDialogTabs>(NpcTemplateDialogTabs.Default);

   const changeActiveTab = (event: React.SyntheticEvent, newValue: NpcTemplateDialogTabs) => {
      setActiveTab(newValue);
   };

   useEffect(() => {
      if (activeDialog === Dialogs.NpcTemplateDialogs) {
         setActiveNpcTemplate(Object.assign({}, DefaultNpcTemplate));
      }
   }, [activeDialog === Dialogs.NpcTemplateDialogs]);

   const changeValue = useCallback(
      (prop: string, value: string | number) => {
         setActiveNpcTemplate({ ...activeNpcTemplate, [prop]: value });
      },
      [activeNpcTemplate]
   );

   return (
      <Dialog open={activeDialog === Dialogs.NpcTemplateDialogs} onClose={() => setActiveDialog(null)} maxWidth="xl">
         <DialogTitle>Create Npc Template</DialogTitle>
         <DialogContent className={styles['dialog']}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
               <Tabs value={activeTab} onChange={changeActiveTab} aria-label="basic tabs example">
                  <Tab label="Details" aria-controls={NpcTemplateDialogTabs.Default} value={NpcTemplateDialogTabs.Default} />
                  <Tab label="Stock" aria-controls={NpcTemplateDialogTabs.Stock} value={NpcTemplateDialogTabs.Stock} />
                  <Tab label="Quests" aria-controls={NpcTemplateDialogTabs.Quests} value={NpcTemplateDialogTabs.Quests} />
               </Tabs>
            </Box>

            <div role="tabpanel" hidden={activeTab !== NpcTemplateDialogTabs.Default} aria-labelledby={NpcTemplateDialogTabs.Default}>
               <TextField
                  value={activeNpcTemplate.name}
                  onChange={(e) => changeValue('name', e.target.value)}
                  margin="dense"
                  label="Name"
                  fullWidth
                  variant="standard"
               />
               <TextField
                  value={activeNpcTemplate.healthPoints}
                  onChange={(e) => changeValue('healthPoints', e.target.value)}
                  margin="dense"
                  label="Health Points"
                  fullWidth
                  variant="standard"
                  type="number"
               />
               <TextField
                  value={activeNpcTemplate.healthPointsRegeneration}
                  onChange={(e) => changeValue('healthPointsRegeneration', e.target.value)}
                  margin="dense"
                  label="Health Points Regeneration"
                  fullWidth
                  variant="standard"
                  type="number"
               />
               <TextField
                  value={activeNpcTemplate.spellPower}
                  onChange={(e) => changeValue('spellPower', e.target.value)}
                  margin="dense"
                  label="Spell Power"
                  fullWidth
                  variant="standard"
                  type="number"
               />
               <TextField
                  value={activeNpcTemplate.spellPowerRegeneration}
                  onChange={(e) => changeValue('spellPowerRegeneration', e.target.value)}
                  margin="dense"
                  label="Spell Power Regeneration"
                  fullWidth
                  variant="standard"
                  type="number"
               />
               <TextField
                  value={activeNpcTemplate.movementSpeed}
                  onChange={(e) => changeValue('movementSpeed', e.target.value)}
                  margin="dense"
                  label="Movement Speed"
                  fullWidth
                  variant="standard"
                  type="number"
               />
            </div>
            <div role="tabpanel" hidden={activeTab !== NpcTemplateDialogTabs.Stock} aria-labelledby={NpcTemplateDialogTabs.Stock}>
               <ItemStock />
            </div>
            <div role="tabpanel" hidden={activeTab !== NpcTemplateDialogTabs.Quests} aria-labelledby={NpcTemplateDialogTabs.Quests}>
               3
            </div>
         </DialogContent>
         <DialogActions>
            <Button
               onClick={() => {
                  setActiveDialog(null);
                  createNpcTemplate(activeNpcTemplate);
               }}
               variant="contained"
            >
               Create
            </Button>
            <Button onClick={() => setActiveDialog(null)} variant="outlined">
               Cancel
            </Button>
         </DialogActions>
      </Dialog>
   );
};
