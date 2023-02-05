import { Button, IconButton, ImageList, ImageListItem, ImageListItemBar } from '@mui/material';
import { map } from 'lodash';
import { useContext, useState } from 'react';

import EditIcon from '@mui/icons-material/Edit';

import AddIcon from '@mui/icons-material/Add';
import TextField from '@mui/material/TextField';
import classNames from 'classnames';
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
   const npcTemplates = packageContext?.backendStore?.npcTemplates?.data ? packageContext?.backendStore?.npcTemplates?.data : {};

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
            <ImageList cols={2}>
               {map(
                  Object.values<NpcTemplate>(npcTemplates)
                     .filter((npcTemplate: NpcTemplate) => npcTemplate.name.toLowerCase().indexOf(searchFilter.toLowerCase()) !== -1)
                     .slice(paginationRange.start, paginationRange.end),
                  (npcTemplate: NpcTemplate) => (
                     <ImageListItem key={npcTemplate.id}>
                        <div
                           className={classNames({
                              [styles['imageHolder']]: true,
                              [styles['active']]: activeNpcTemplate.id === npcTemplate.id,
                           })}
                           onClick={() => setActiveNpcTemplate(npcTemplate)}
                        >
                           <img className={styles['image']} src={'assets/citizen.png'} />
                        </div>
                        <ImageListItemBar
                           title={npcTemplate.name}
                           actionIcon={
                              <IconButton sx={{ color: 'rgba(255, 255, 255, 0.54)' }}>
                                 <EditIcon />
                              </IconButton>
                           }
                        />
                     </ImageListItem>
                  )
               )}
            </ImageList>
         </div>
         <Pagination itemsAmount={Object.values(npcTemplates).length} setRange={setPaginationRange} reset={paginationReset} />
      </div>
   );
};
