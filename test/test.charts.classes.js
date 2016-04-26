describe('Charts', () => {

  describe('Chart(), Flow(), Basic()', () => {

    it('throws a "Missing constructor parameters" if the data parameter is missing', () => {
      assert.throws(() => {
        var chart = new Chart();
      }, Error);

      assert.throws(() => {
        var basic = new Basic();
      }, Error);

      assert.throws(() => {
        var flow = new Flow();
      }, Error);

    });

  });
});