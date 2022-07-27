import { ImageList, ImageListItem, ImageListItemBar, IconButton } from '@mui/material';
import { map } from 'lodash';
import { useContext } from 'react';
import { PackageContext } from '../../contexts';

import EditIcon from '@mui/icons-material/Edit';

import styles from './spritePanel.module.scss';
import { MapEditorContext } from '../contexts/mapEditorContextProvider';

import classNames from 'classnames';

export const SpritePanel = () => {
   const packageContext = useContext(PackageContext);
   const mapEditorContext = useContext(MapEditorContext);

   return (
      <div className={styles['control-panel']}>
         <ImageList cols={2}>
            {map(packageContext?.backendStore?.sprites?.data, (sprite, id) => (
               <ImageListItem key={id}>
                  <div
                     className={classNames({
                        [styles['imageHolder']]: true,
                        [styles['active']]: id === mapEditorContext.activeSprite,
                     })}
                  >
                     <img
                        style={{ marginLeft: `${-sprite.x * 100}%`, marginTop: `${-sprite.y * 100}%` }}
                        className={styles['image']}
                        src={'./assets/' + sprite.spriteSheet}
                        loading="lazy"
                        onClick={() => mapEditorContext.setActiveSprite(id)}
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
