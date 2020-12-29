import test from 'ava';
import { buildJavaScript, buildStyles } from './main.mjs';

test('exports expected exports', (t) => {
    t.is(typeof buildJavaScript, 'function');
    t.is(typeof buildStyles, 'function');
});
