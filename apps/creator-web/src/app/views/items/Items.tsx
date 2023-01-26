import AddIcon from '@mui/icons-material/Add';
import { Button, Paper } from '@mui/material';
import _ from 'lodash';
import { useContext } from 'react';
import { PackageContext } from '../../contexts';
import { DialogContext, Dialogs } from '../../contexts/dialogContext';

import styles from './Items.module.scss';

export const Items = () => {
   const { setActiveDialog } = useContext(DialogContext);
   const packageContext = useContext(PackageContext);

   const itemTemplates = packageContext?.backendStore?.itemTemplates?.data ? packageContext?.backendStore?.itemTemplates?.data : {};

   return (
      <Paper className={styles['map-editor']}>
         <Button variant="outlined" onClick={() => setActiveDialog(Dialogs.ItemDialog)}>
            <AddIcon />
         </Button>

         <div className={styles['list']}>
            {_.map(itemTemplates, (itemTemplate) => (
               <div key={itemTemplate.id} className={styles['list-item']}>
                  <img className={styles['image-preview']} src={itemTemplate.image} />
                  <div className={styles['bar']}>{itemTemplate.name}</div>
               </div>
            ))}
         </div>
      </Paper>
   );
};
