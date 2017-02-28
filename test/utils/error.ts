import {
    throwError
} from '../../src/utils/error';

import { assert } from 'chai';
import { } from 'mocha';

describe('throwError', () => {

    it('should throw exception', () => {
        assert.throw(throwError);
    });
});
