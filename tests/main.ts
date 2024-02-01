import { Flx, Score } from '../src/flx';

function main() {
    let score: Score | null  = Flx.Score("buffer-file-name", "bfn");
    console.log('Score: ' + score?.score);
}

main();
