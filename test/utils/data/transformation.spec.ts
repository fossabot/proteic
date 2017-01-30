import {
    unwind
} from '../../../src/utils/data/transforming';

import { assert } from 'chai';
import { } from 'mocha';

describe('Data transforming functions', () => {

    it('unwind(data, parameters)', () => {
        let array = [
            { v1: 'valueP11', v2: 'valueP21', v3: 'valueP31', v4: 'valueP41', v5: 'valueP51', position: 0, key: 0 },
            { v1: 'valueP12', v2: 'valueP22', v3: 'valueP32', v4: 'valueP42', v5: 'valueP52', position: 1, key: 1 },
        ];
        let expected = [
            { v1: 'valueP11', position: 0, key: 0 },
            { v2: 'valueP21', position: 0, key: 0 },
            { v3: 'valueP31', position: 0, key: 0 },
            { v4: 'valueP41', position: 0, key: 0 },
            { v5: 'valueP51', position: 0, key: 0 },
            { v1: 'valueP12', position: 1, key: 1 },
            { v2: 'valueP22', position: 1, key: 1 },
            { v3: 'valueP32', position: 1, key: 1 },
            { v4: 'valueP42', position: 1, key: 1 },
            { v5: 'valueP52', position: 1, key: 1 }
        ];

        let unwinded: Array<any> = unwind(array, ['v1', 'v2', 'v3', 'v4', 'v5']);
        assert.deepEqual(unwinded, expected);
    });

    it('unwind(data, parameters): invalid parameters. empty array', () => {
        let array = [
            { v1: 'valueP11', v2: 'valueP21', v3: 'valueP31', v4: 'valueP41', v5: 'valueP51', position: 0, key: 0 },
            { v1: 'valueP12', v2: 'valueP22', v3: 'valueP32', v4: 'valueP42', v5: 'valueP52', position: 1, key: 1 },
        ];
        assert.deepEqual(unwind(array, []), array);
    });

    it('unwind(data, parameters): invalid parameters. null array', () => {
        let array = [
            { v1: 'valueP11', v2: 'valueP21', v3: 'valueP31', v4: 'valueP41', v5: 'valueP51', position: 0, key: 0 },
            { v1: 'valueP12', v2: 'valueP22', v3: 'valueP32', v4: 'valueP42', v5: 'valueP52', position: 1, key: 1 },
        ];
        assert.deepEqual(unwind(array, null), array);
    });

    it('unwind(data, parameters): invalid parameters. undefined array', () => {
        let array = [
            { v1: 'valueP11', v2: 'valueP21', v3: 'valueP31', v4: 'valueP41', v5: 'valueP51', position: 0, key: 0 },
            { v1: 'valueP12', v2: 'valueP22', v3: 'valueP32', v4: 'valueP42', v5: 'valueP52', position: 1, key: 1 },
        ];
        assert.deepEqual(unwind(array, undefined), array);
    });

    it('unwind(data, parameters): invalid value names', () => {
        let array = [
            { v1: 'valueP11', v2: 'valueP21', v3: 'valueP31', v4: 'valueP41', v5: 'valueP51', position: 0, key: 0 },
            { v1: 'valueP12', v2: 'valueP22', v3: 'valueP32', v4: 'valueP42', v5: 'valueP52', position: 1, key: 1 },
        ];
        assert.deepEqual(unwind(array, ['test']), array);
    });

});
