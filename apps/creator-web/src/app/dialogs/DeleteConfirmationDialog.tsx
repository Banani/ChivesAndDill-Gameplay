import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { FunctionComponent, useContext, useEffect } from 'react';
import { KeyBoardContext } from '../contexts';

interface DeleteConfirmationDialogProps {
   itemsToDelete: string[];
   confirmAction: () => void;
   cancelAction: () => void;
}

export const DeleteConfirmationDialog: FunctionComponent<DeleteConfirmationDialogProps> = ({ itemsToDelete, confirmAction, cancelAction }) => {
   const keyBoardContext = useContext(KeyBoardContext);

   useEffect(() => {
      keyBoardContext.addKeyHandler({
         id: 'deleteConfirm',
         matchRegex: 'Enter',
         keydown: confirmAction,
      });

      return () => {
         keyBoardContext.removeKeyHandler('deleteConfirm');
      };
   }, [confirmAction]);

   return (
      <Dialog open={itemsToDelete.length > 0} onClose={cancelAction}>
         <DialogTitle>Are you sure, you want to delete these items?</DialogTitle>
         <DialogContent>
            <ul>
               {itemsToDelete.map((item) => (
                  <li key={item}>{item}</li>
               ))}
            </ul>
         </DialogContent>
         <DialogActions>
            <Button onClick={confirmAction} variant="contained">
               Delete
            </Button>
            <Button onClick={cancelAction} variant="outlined">
               Cancel
            </Button>
         </DialogActions>
      </Dialog>
   );
};
