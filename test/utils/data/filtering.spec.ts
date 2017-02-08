

import { assert } from 'chai';
import { } from 'mocha';
import {
    discardProperties
} from '../../../src/utils/data/filtering';

describe('Data filtering functions', () => {
    it('discardProperties(array, props)', () => {
        let array = [
            { x: 'test', p1: 'n', p2: '3', pe: { a: 1 } },
            { q: 'test', p1: 'n', p2: '3', pe: { a: 1 } },
            { e: 'test', p2: 'n', t: '3', p1: { a: 1 } },
        ];

        let expected = [
            { x: 'test', pe: { a: 1 } },
            { q: 'test', pe: { a: 1 } },
            { e: 'test', t: '3' },
        ];
        discardProperties(array, ['p1', 'p2']);
        assert.deepEqual(array, expected);
    });

    it('discardProperties(array, props):invalid value names', () => {
        let array = [
            { x: 'test', p1: 'n', p2: '3', pe: { a: 1 } },
            { q: 'test', p1: 'n', p2: '3', pe: { a: 1 } },
            { e: 'test', p2: 'n', t: '3', p1: { a: 1 } },
        ];
        let expected = [
            { x: 'test', p1: 'n', p2: '3', pe: { a: 1 } },
            { q: 'test', p1: 'n', p2: '3', pe: { a: 1 } },
            { e: 'test', p2: 'n', t: '3', p1: { a: 1 } },
        ];
        
        discardProperties(array, ['q324', 'qq']);
        assert.deepEqual(array, expected);
    });
});
