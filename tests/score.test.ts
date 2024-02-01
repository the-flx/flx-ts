import { Flx, Score } from '../src/flx';

test('Test score 1', () => {
    let score: Score | null  = Flx.Score("buffer-file-name", "bfn");
    expect(score?.score).toBe(237);
});

test('Test score 2', () => {
    let score: Score | null  = Flx.Score("switch-to-", "stb");
    expect(score?.score).toBe(undefined);
});
