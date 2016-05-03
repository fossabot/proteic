describe('Utils', () => {

  describe('functions', () => {

    it('utils.isArray()', () => {
      assert.isOk(utils.isArray([]));
      assert.isOk(utils.isArray([1, 2, 3, 4]));
      assert.isOk(utils.isArray([{ 'a': 'b' }]));
      assert.isNotOk(utils.isArray(null));
      assert.isNotOk(utils.isArray(false));
      assert.isNotOk(utils.isArray(''));
      assert.isNotOk(utils.isArray(1000));
      assert.isNotOk(utils.isArray(0x0));
      assert.isNotOk(utils.isArray(new Object()));
      assert.isNotOk(utils.isArray({}));
    });

    it('utils.isObject()', () => {
      assert.isOk(utils.isObject({}));
      assert.isOk(utils.isObject({ 'a': 'b' }));
      assert.isNotOk(utils.isObject([]));
      assert.isNotOk(utils.isObject([{}]));
      assert.isNotOk(utils.isObject([{}, {}]));
    });
    
    it('utils.isFunction()', () => {
      assert.isOk(utils.isFunction(function(){}));
      assert.isOk(utils.isFunction((d) => d));
      assert.isNotOk(utils.isFunction(""));
      assert.isNotOk(utils.isFunction({}));
      assert.isNotOk(utils.isFunction([]));
    });

    it('utils.getArrayDifferentKeys() - simple array', () => {
      assert.strictEqual(utils.getNumberOfDifferentArrayKeys([1]), 1);
      assert.strictEqual(utils.getNumberOfDifferentArrayKeys([1, 2, 3]), 3);
      assert.strictEqual(utils.getNumberOfDifferentArrayKeys([1, 2, 2, 2, 3, 3, 3, 4]), 4);
      assert.strictEqual(utils.getNumberOfDifferentArrayKeys([]), 0);
      assert.strictEqual(utils.getNumberOfDifferentArrayKeys(null), 0);
    });

    it('utils.getArrayDifferentKeys() - object array', () => {
      assert.strictEqual(utils.getNumberOfDifferentArrayKeys([{}, {}], 'keyname'), 0);
      assert.strictEqual(utils.getNumberOfDifferentArrayKeys([{ 'key': 1 }, { 'key': 2 }], 'key'), 2);
      assert.strictEqual(utils.getNumberOfDifferentArrayKeys([{ 'key': 1 }, { 'key': 2 }, {}, { 'anotherkey': 1 }], 'key'), 2);
      assert.strictEqual(utils.getNumberOfDifferentArrayKeys([{ 'key': 1 }, { 'key': 1 }], 'key'), 1);
    });

    it('utils.sortBy()  - sort array', () => {
      var array, expectedResult, result;
      array = [{ x: 1 }, { x: 2 }];
      expectedResult = [{ x: 1 }, { x: 2 }];
      result = utils.sortBy(array, { prop: 'x', desc: false });
      assert.deepEqual(expectedResult, result);

      array = [{ x: 1 }, { x: 2 }];
      expectedResult = [{ x: 2 }, { x: 1 }];
      result = utils.sortBy(array, { prop: 'x', desc: true });
      assert.deepEqual(expectedResult, result);

      array = [];
      expectedResult = [];
      result = utils.sortBy(array, { prop: 'x', desc: true });
      assert.deepEqual(expectedResult, result);
    });

  });
});