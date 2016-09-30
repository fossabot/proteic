import { assert } from 'chai';

describe('Charts', () => {

  describe('Chart(), Flow(), Basic()', () => {

    it('throws a "Missing constructor parameters" if the data parameter is missing', () => {
      assert.throws(() => {
        var chart = new proteic.Chart();
      }, Error);
    });

  });
});