import { ImageList, ImageListItem, ImageListItemBar, IconButton } from '@mui/material';
import { map } from 'lodash';
import { useContext } from 'react';
import { PackageContext } from '../../PackageContext';

import EditIcon from '@mui/icons-material/Edit';

import styles from './spritePanel.module.scss';

export const SpritePanel = () => {
   const packageContext = useContext(PackageContext);

   return (
      <div className={styles['control-panel']}>
         <ImageList cols={2}>
            {map(packageContext?.backendStore?.sprites?.data, (sprite, id) => (
               <ImageListItem key={id}>
                  <div className={styles['imageHolder']}>
                     <img
                        style={{ marginLeft: `${-sprite.x * 100}%`, marginTop: `${-sprite.y * 100}%` }}
                        className={styles['image']}
                        src={'./assets/' + sprite.spriteSheet}
                        loading="lazy"
                        onClick={() => console.log(122)}
                     />
                  </div>
                  <ImageListItemBar
                     title={'-'}
                     actionIcon={
                        <IconButton sx={{ color: 'rgba(255, 255, 255, 0.54)' }}>
                           <EditIcon />
                        </IconButton>
                     }
                  />
               </ImageListItem>
            ))}
         </ImageList>
      </div>
   );
};
