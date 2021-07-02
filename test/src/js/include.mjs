// Use function name to see if it is preserved
// Also use .mjs as ending to see if it is correctly included
export default function myIncludeFunction(nr) {
    // Test Nullish Coalescing
    const a = Math.random();
    const b = (a < 0.5) ?? 2;
    return nr * b;
}
