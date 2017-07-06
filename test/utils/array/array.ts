import { assert } from 'chai';
import { } from 'mocha';
import {
    fitArrayByOldAndNewValue,
    isArray
} from '../../../src/utils/array/array';

describe('Array transformation functions', () => {

    it('fitArrayByOldAndNewValueArray: should take all the values from both arrays', () => {
        let newData = [7, 8, 9];
        let oldData = [4, 5, 6];
        assert.deepEqual(fitArrayByOldAndNewValue(newData, oldData, 6), [4, 5, 6, 7, 8, 9]);
    });

    it('fitArrayByOldAndNewValue: should take all the values from newData and only one from newData', () => {
        let newData = [7, 8, 9];
        let oldData = [4, 5, 6];
        assert.deepEqual(fitArrayByOldAndNewValue(newData, oldData, 4), [6, 7, 8, 9]);
    });

    it('fitArrayByOldAndNewValue: should take all the values from newData and only one from newData', () => {
        let newData = [7, 8, 9];
        let oldData = [4, 5, 6];
        assert.deepEqual(fitArrayByOldAndNewValue(newData, oldData, 1), [9]);
    });

    it('fitArrayByOldAndNewValue: should return an empty array', () => {
        let newData = [7, 8, 9];
        let oldData = [4, 5, 6];
        assert.deepEqual(fitArrayByOldAndNewValue(newData, oldData, 0), []);
    });

    it('utils.isArray()', () => {
        assert.isOk(isArray([]));
        assert.isOk(isArray([1, 2, 3, 4]));
        assert.isOk(isArray([{ 'a': 'b' }]));
        assert.isNotOk(isArray(null));
        assert.isNotOk(isArray(false));
        assert.isNotOk(isArray(''));
        assert.isNotOk(isArray(1000));
        assert.isNotOk(isArray(0x0));
        assert.isNotOk(isArray(new Object()));
        assert.isNotOk(isArray({}));
    });

});
