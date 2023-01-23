import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { useCallback, useContext, useEffect, useState } from 'react';
import { DialogContext, Dialogs } from '../contexts/dialogContext';
import { NpcContext } from '../views/npcPanel/NpcContextProvider';

export interface NpcTemplate {
   id: string;
   name: string;
   healthPoints: number;
   healthPointsRegeneration: number;
   spellPower: number;
   spellPowerRegeneration: number;
   movementSpeed: number;
}

const DefaultNpcTemplate = {
   id: '',
   name: '',
   healthPoints: 100,
   healthPointsRegeneration: 5,
   spellPower: 100,
   spellPowerRegeneration: 5,
   movementSpeed: 8,
};

export const NpcTemplateDialog = () => {
   const { activeDialog, setActiveDialog } = useContext(DialogContext);
   const { createNpcTemplate } = useContext(NpcContext);
   const [npcTempate, setNpcTemplate] = useState<NpcTemplate>(Object.assign({}, DefaultNpcTemplate));

   useEffect(() => {
      if (activeDialog === Dialogs.NpcTemplateDialogs) {
         setNpcTemplate(Object.assign({}, DefaultNpcTemplate));
      }
   }, [activeDialog === Dialogs.NpcTemplateDialogs]);

   const changeValue = useCallback(
      (prop: string, value: string | number) => {
         setNpcTemplate({ ...npcTempate, [prop]: value });
      },
      [npcTempate]
   );

   return (
      <Dialog open={activeDialog === Dialogs.NpcTemplateDialogs} onClose={() => setActiveDialog(null)}>
         <DialogTitle>Create Npc Template</DialogTitle>
         <DialogContent>
            <TextField value={npcTempate.name} onChange={(e) => changeValue('name', e.target.value)} margin="dense" label="Name" fullWidth variant="standard" />
            <TextField
               value={npcTempate.healthPoints}
               onChange={(e) => changeValue('healthPoints', e.target.value)}
               margin="dense"
               label="Health Points"
               fullWidth
               variant="standard"
               type="number"
            />
            <TextField
               value={npcTempate.healthPointsRegeneration}
               onChange={(e) => changeValue('healthPointsRegeneration', e.target.value)}
               margin="dense"
               label="Health Points Regeneration"
               fullWidth
               variant="standard"
               type="number"
            />
            <TextField
               value={npcTempate.spellPower}
               onChange={(e) => changeValue('spellPower', e.target.value)}
               margin="dense"
               label="Spell Power"
               fullWidth
               variant="standard"
               type="number"
            />
            <TextField
               value={npcTempate.spellPowerRegeneration}
               onChange={(e) => changeValue('spellPowerRegeneration', e.target.value)}
               margin="dense"
               label="Spell Power Regeneration"
               fullWidth
               variant="standard"
               type="number"
            />
            <TextField
               value={npcTempate.movementSpeed}
               onChange={(e) => changeValue('movementSpeed', e.target.value)}
               margin="dense"
               label="Movement Speed"
               fullWidth
               variant="standard"
               type="number"
            />
         </DialogContent>
         <DialogActions>
            <Button
               onClick={() => {
                  setActiveDialog(null);
                  createNpcTemplate(npcTempate);
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
