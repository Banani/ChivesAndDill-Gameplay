import { EquipmentSlot, GenericItemTemplate, ItemTemplate, ItemTemplateType } from '@bananos/types';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { useCallback, useContext, useEffect, useState } from 'react';
import { DialogContext, Dialogs } from '../contexts/dialogContext';
import { ItemsContext } from '../views/items/ItemsContextProvider';

const DefaultItem = {
   type: ItemTemplateType.Generic,
   id: '',
   name: '',
   image: 'https://www.tibiaitens.com.br/image/cache/catalog/espadas/fire-swordtibia-604-500x500.png',
   stack: 1,
   value: 100,
   slot: EquipmentSlot.Back,
   armor: 0,
   stamina: 0,
   agility: 0,
   intelect: 0,
   strength: 0,
   spirit: 0,
};

export const ItemTemplateDialog = () => {
   const { activeDialog, setActiveDialog } = useContext(DialogContext);
   const { createItemTemplate, updateItemTemplate, activeItemTemplate } = useContext(ItemsContext);
   const [itemTemplate, setItemTemplate] = useState<ItemTemplate>(Object.assign({}, DefaultItem) as GenericItemTemplate);

   useEffect(() => {
      if (activeDialog === Dialogs.ItemDialog && activeItemTemplate === null) {
         setItemTemplate(Object.assign({}, DefaultItem) as GenericItemTemplate);
      }

      if (activeDialog === Dialogs.ItemDialog && activeItemTemplate !== null) {
         setItemTemplate(activeItemTemplate);
      }
   }, [activeDialog === Dialogs.ItemDialog, activeItemTemplate]);

   const changeValue = useCallback(
      (prop: string, value: string | number) => {
         setItemTemplate({ ...itemTemplate, [prop]: value });
      },
      [itemTemplate]
   );

   const confirmAction = useCallback(() => {
      if (activeItemTemplate === null) {
         createItemTemplate(itemTemplate);
      } else {
         updateItemTemplate(itemTemplate);
      }
      setActiveDialog(null);
   }, [itemTemplate, activeItemTemplate]);

   return (
      <Dialog open={activeDialog === Dialogs.ItemDialog} onClose={() => setActiveDialog(null)}>
         <DialogTitle>Create Item</DialogTitle>
         <DialogContent>
            <FormControl fullWidth margin="dense">
               <InputLabel id="item-type">Item type</InputLabel>
               <Select labelId="item-type" value={itemTemplate.type} label="Item type" onChange={(e) => changeValue('type', e.target.value)}>
                  <MenuItem value={ItemTemplateType.Generic}>Generic</MenuItem>
                  <MenuItem value={ItemTemplateType.Equipment}>Equipment</MenuItem>
               </Select>
            </FormControl>
            <TextField
               value={itemTemplate.name}
               onChange={(e) => changeValue('name', e.target.value)}
               margin="dense"
               label="Name"
               fullWidth
               variant="standard"
            />
            <TextField
               value={itemTemplate.stack}
               onChange={(e) => changeValue('stack', parseInt(e.target.value))}
               margin="dense"
               label="Stack size"
               fullWidth
               variant="standard"
               type="number"
            />
            <TextField
               value={itemTemplate.value}
               onChange={(e) => changeValue('stack', parseInt(e.target.value))}
               margin="dense"
               label="Value in coppers"
               fullWidth
               variant="standard"
               type="number"
            />

            {itemTemplate.type === ItemTemplateType.Equipment ? (
               <>
                  <FormControl fullWidth margin="dense">
                     <InputLabel id="item-slot">Slot</InputLabel>
                     <Select labelId="item-slot" value={itemTemplate.slot} label="Slot" onChange={(e) => changeValue('slot', e.target.value)}>
                        {Object.values(EquipmentSlot).map((key) => (
                           <MenuItem key={key} value={key}>
                              {key}
                           </MenuItem>
                        ))}
                     </Select>
                  </FormControl>
                  <TextField
                     value={itemTemplate.armor}
                     onChange={(e) => changeValue('armor', parseInt(e.target.value))}
                     margin="dense"
                     label="Armor"
                     fullWidth
                     variant="standard"
                     type="number"
                  />
                  <TextField
                     value={itemTemplate.stamina}
                     onChange={(e) => changeValue('stamina', parseInt(e.target.value))}
                     margin="dense"
                     label="Stamina"
                     fullWidth
                     variant="standard"
                     type="number"
                  />
                  <TextField
                     value={itemTemplate.agility}
                     onChange={(e) => changeValue('agility', parseInt(e.target.value))}
                     margin="dense"
                     label="Agility"
                     fullWidth
                     variant="standard"
                     type="number"
                  />
                  <TextField
                     value={itemTemplate.intelect}
                     onChange={(e) => changeValue('intelect', parseInt(e.target.value))}
                     margin="dense"
                     label="Intelect"
                     fullWidth
                     variant="standard"
                     type="number"
                  />
                  <TextField
                     value={itemTemplate.strength}
                     onChange={(e) => changeValue('strength', parseInt(e.target.value))}
                     margin="dense"
                     label="Strength"
                     fullWidth
                     variant="standard"
                     type="number"
                  />
                  <TextField
                     value={itemTemplate.spirit}
                     onChange={(e) => changeValue('spirit', parseInt(e.target.value))}
                     margin="dense"
                     label="Spirit"
                     fullWidth
                     variant="standard"
                     type="number"
                  />
               </>
            ) : null}
         </DialogContent>
         <DialogActions>
            <Button onClick={confirmAction} variant="contained">
               {activeItemTemplate ? 'Update' : 'Create'}
            </Button>
            <Button onClick={() => setActiveDialog(null)} variant="outlined">
               Cancel
            </Button>
         </DialogActions>
      </Dialog>
   );
};
