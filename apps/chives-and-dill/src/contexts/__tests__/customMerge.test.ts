import { customMerge } from '../packageContext';

describe('custom merge', () => {
   it('should merge two objects', () => {
      const output = customMerge({}, { a: 123, b: { a: 123, b: 432 } });
      expect(output).toStrictEqual({ a: 123, b: { a: 123, b: 432 } });
   });

   it('should merge two objects, when there is already something inside', () => {
      const output = customMerge({ a: 43, b: { a: 123, b: 111 } }, { c: 2, b: { a: 45, c: 432 } });
      expect(output).toStrictEqual({ a: 43, c: 2, b: { a: 45, b: 111, c: 432 } });
   });

   it('should merge two objects, when there is already something inside and with different type', () => {
      const output = customMerge({ c: 1 }, { c: { a: 123 } });
      expect(output).toStrictEqual({ c: { a: 123 } });
   });

   it('should merge two arrays', () => {
      const output = customMerge({ c: ['1'] }, { c: ['2'] });
      expect(output).toStrictEqual({
         c: ['1', '2'],
      });
   });

   it('should merge two arrays even when the original one is not defined', () => {
      const output = customMerge({}, { c: ['2'] });
      expect(output).toStrictEqual({
         c: ['2'],
      });
   });
});
