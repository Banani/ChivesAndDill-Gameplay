import { Button, Input } from '@mui/material';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useContext, useEffect } from 'react';
import { usePagination } from './usePagination';

import { KeyBoardContext } from '../../../contexts';
import styles from './pagination.module.scss';

export const Pagination = ({ itemsAmount, setRange }: { itemsAmount: number; setRange: (range: { start: number; end: number }) => void }) => {
   const keyBoardContext = useContext(KeyBoardContext);

   const { start, end, prevPage, nextPage, page, allPagesCount, setCurrentPage } = usePagination({
      pageSize: 20,
      itemsAmount,
   });

   useEffect(() => {
      setRange({ start, end });
   }, [start, end]);

   useEffect(() => {
      keyBoardContext.addKeyHandler({
         id: 'paginationLeft',
         matchRegex: 'ArrowLeft',
         keydown: prevPage,
      });

      keyBoardContext.addKeyHandler({
         id: 'paginationRight',
         matchRegex: 'ArrowRight',
         keydown: nextPage,
      });

      return () => {
         keyBoardContext.removeKeyHandler('paginationLeft');
         keyBoardContext.removeKeyHandler('paginationRight');
      };
   }, [prevPage, nextPage]);

   return (
      <div className={styles['pagination']}>
         <Button onClick={prevPage} variant="outlined">
            <ArrowBackIcon />
         </Button>
         <Input
            className={styles['paginationButton']}
            type="number"
            value={page}
            onChange={(e) => {
               setCurrentPage(e.target.value === '' ? 1 : parseInt(e.target.value));
            }}
         />
         <div className={styles['paginationTextHolder']}>of {allPagesCount}</div>
         <Button onClick={nextPage} variant="outlined">
            <ArrowForwardIcon />
         </Button>
      </div>
   );
};
