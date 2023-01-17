import { IconButton, ImageList, ImageListItem, ImageListItemBar } from '@mui/material';
import { map } from 'lodash';
import { useContext, useState } from 'react';
import { PackageContext } from '../../contexts';

import EditIcon from '@mui/icons-material/Edit';

import { MapEditorContext } from '../contexts/mapEditorContextProvider';
import styles from './spritePanel.module.scss';

import classNames from 'classnames';
import { Pagination } from './components';

export const SpritePanel = () => {
   const packageContext = useContext(PackageContext);
   const mapEditorContext = useContext(MapEditorContext);
   const [paginationRange, setPaginationRange] = useState({ start: 0, end: 0 });

   const sprites = packageContext?.backendStore?.sprites?.data ? packageContext?.backendStore?.sprites?.data : {};

   return (
      <div className={styles['control-panel']}>
         <ImageList cols={2}>
            {map(Object.values(sprites).slice(paginationRange.start, paginationRange.end), (sprite: any, id) => (
               <ImageListItem key={sprite.spriteId}>
                  <div
                     className={classNames({
                        [styles['imageHolder']]: true,
                        [styles['active']]: sprite.spriteId === mapEditorContext.activeSprite,
                     })}
                  >
                     <img
                        style={{ marginLeft: `${-sprite.x * 100}%`, marginTop: `${-sprite.y * 100}%` }}
                        className={styles['image']}
                        src={sprite.spriteSheet.indexOf('https') === -1 ? './assets/' + sprite.spriteSheet : sprite.spriteSheet}
                        loading="lazy"
                        onClick={() => mapEditorContext.setActiveSprite(sprite.spriteId)}
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
         <Pagination itemsAmount={Object.keys(packageContext?.backendStore?.sprites?.data ?? {}).length} setRange={setPaginationRange} />
      </div>
   );
};
