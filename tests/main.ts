import { Flx, Result } from '../src/flx';

function main() {
    let result: Result | null  = Flx.Score("buffer-file-name", "bfn");
    console.log('Score: ' + result?.score);
}

main();
