import { Flx, Score } from './flx';

function main() {
    let score: Score | null  = Flx.Score("switch-to-", "stb");
    console.log('Score: ' + score?.score);
}

main();
