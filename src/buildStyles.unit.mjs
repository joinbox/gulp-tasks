import del from 'del';
import test from 'ava';
import { dirname, join } from 'path';
import { readdirSync, readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import buildStyles from './buildStyles.js';

const basePath = dirname(fileURLToPath(new URL(import.meta.url)));
const destination = join(basePath, '../test/dist/css');
const source = join(basePath, '../test/src/sass');
const clear = () => del(join(basePath, '../test/dist'));

test('builds sass file', async(t) => {
    await clear();
    await buildStyles({
        sourcePath: join(source, 'main.scss'),
        destinationPath: destination,
    });
    const files = readdirSync(destination);
    const content = readFileSync(join(destination, 'main.css'), 'utf8');

    t.deepEqual(files, ['main.css', 'main.css.map']);
    // converted sass variables
    t.is(content.includes('background-color: #333'), true);
    // created selectors
    t.is(content.includes('.component-inner'), true);
    // prefixer works
    t.is(content.includes('-webkit-appearance'), true);
    await clear();
});

test('works with multiple entry points', async(t) => {
    await clear();
    await buildStyles({
        sourcePath: [
            join(source, 'main.scss'),
            join(source, 'main2.scss'),
        ],
        destinationPath: destination,
    });
    const files = readdirSync(destination);
    t.deepEqual(files, ['main.css', 'main.css.map', 'main2.css', 'main2.css.map']);
    await clear();
});

test('works with minify', async(t) => {
    await clear();
    await buildStyles({
        sourcePath: join(source, 'main.scss'),
        destinationPath: destination,
        minify: true,
    });
    const content = readFileSync(join(destination, 'main.css'), 'utf8');
    t.is(content.split(/\n/g).length < 5, true);
    await clear();
});
