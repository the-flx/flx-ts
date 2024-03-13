import { Flx, Result } from '../src/flx';

test('Test score 1', () => {
    let result: Result | null  = Flx.Score("buffer-file-name", "bfn");
    expect(result?.score).toBe(237);
});

test('Test score 2', () => {
    let result: Result | null  = Flx.Score("switch-to-", "stb");
    expect(result?.score).toBe(undefined);
});
