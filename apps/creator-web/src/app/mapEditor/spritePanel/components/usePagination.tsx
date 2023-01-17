import { useCallback, useMemo, useState } from 'react';

export const usePagination = ({ pageSize, itemsAmount }: { pageSize: number; itemsAmount: number }) => {
   const [start, setStart] = useState(0);

   const nextPage = useCallback(() => {
      setStart((prev) => Math.min(itemsAmount, prev + pageSize));
   }, [pageSize, itemsAmount]);

   const prevPage = useCallback(() => {
      setStart((prev) => Math.max(0, prev - pageSize));
   }, [pageSize]);

   const allPagesCount = useMemo(() => Math.ceil(itemsAmount / pageSize), [itemsAmount, pageSize]);

   const setCurrentPage = useCallback(
      (page: number) => {
         if (page < 1) {
            setStart(0);
         } else if (page > allPagesCount) {
            setStart((allPagesCount - 1) * pageSize);
         } else {
            setStart((page - 1) * pageSize);
         }
      },
      [allPagesCount, pageSize]
   );

   return {
      start,
      end: start + pageSize,
      nextPage,
      prevPage,
      page: (start + pageSize) / pageSize,
      allPagesCount,
      setCurrentPage,
   };
};
