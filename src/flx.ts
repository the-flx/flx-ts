import { Util } from './util';

export interface Score {
    indices: Array<number>;
    score: number;
    tail: number;
}

export class Flx {
    private static WORD_SEPARATORS: string[] = [
        ' ', '-', '_', ':', '.', '/', '\\',
    ];
    private static DEFAULT_SCORE: number = -35;

    /**
     * Check if CHAR is a word character.
     */
    public static Word(ch: string | null): boolean {
        if (ch === null) return false;
        return !Flx.WORD_SEPARATORS.includes(ch);
    }

    /**
     * Check if CHAR is an uppercase character.
     */
    public static Capital(ch: string | null): boolean {
        return Flx.Word(ch) && ch === ch?.toUpperCase();
    }

    /**
     * Check if LAST-CHAR is the end of a word and CHAR the start of the next.
     * 
     * This function is camel-case aware.
     */
    public static Boundary(lastCh: string | null, ch: string): boolean {
        if (lastCh === null)
            return true;

        if (!Flx.Capital(lastCh) && Flx.Capital(ch))
            return true;

        if (!Flx.Word(lastCh) && Flx.Word(ch))
            return true;

        return false;
    }

    /**
     * Increment each element in VEC between BEG and END by INC.
     */
    public static IncVec(vec: Array<number>, inc: number | null, beg: number | null, end: number | null): void {
        let _inc = inc ?? 1;
        let _beg = beg ?? 0;
        let _end = end ?? vec.length;

        while (_beg < _end) {
            vec[_beg] += _inc;
            ++_beg;
        }
    }

    /**
     * Return hash-table for string where keys are characters.
     * Value is a sorted list of indexes for character occurrences.
     */
    public static GetHashForString(result: Map<number, Array<number>>, str: string): void {
        result.clear();

        const strLen = str.length;
        let index = strLen - 1;
        let ch: string;
        let downCh: string;

        while (0 <= index) {
            ch = str[index];

            if (Flx.Capital(ch)) {
                Util.dictInsert(result, ch.charCodeAt(0), index);

                downCh = ch.toLowerCase();
            } else {
                downCh = ch;
            }

            Util.dictInsert(result, downCh.charCodeAt(0), index);

            --index;
        }
    }

    /**
     * Generate the heatmap vector of string.
     * 
     * See documentation for logic.
     */
    public static GetHeatmapStr(scores: Array<number>, str: string, groupSeparator: string | null): Array<number> {
        const strLen = str.length;
        const strLastIndex = strLen - 1;
        scores = [];

        for (let i = 0; i < strLen; ++i)
            scores.push(Flx.DEFAULT_SCORE);

        const penaltyLead = '.'.charCodeAt(0);

        const inner = [-1, 0];
        const groupAlist = [inner];

        // final char bonus
        scores[strLastIndex] += 1;

        // Establish baseline mapping
        let lastCh: string | null = null;
        let groupWordCount = 0;
        let index1 = 0;

        for (const ch of str) {
            // before we find any words, all separaters are
            // considered words of length 1.  This is so "foo/__ab"
            // gets penalized compared to "foo/ab".
            const effectiveLastChar = (groupWordCount === 0) ? null : lastCh;

            if (Flx.Boundary(effectiveLastChar, ch)) {
                groupAlist[0].splice(2, 0, index1);
            }

            if (!Flx.Word(lastCh) && Flx.Word(ch)) {
                ++groupWordCount;
            }

            // ++++ -45 penalize extension
            if (lastCh !== null && lastCh.charCodeAt(0) === penaltyLead) {
                scores[index1] += -45;
            }

            if (groupSeparator !== null && groupSeparator === ch) {
                groupAlist[0][1] = groupWordCount;
                groupWordCount = 0;
                groupAlist.unshift([index1, groupWordCount]);
            }

            if (index1 === strLastIndex) {
                groupAlist[0][1] = groupWordCount;
            } else {
                lastCh = ch;
            }

            ++index1;
        }

        const groupCount = groupAlist.length;
        const separatorCount = groupCount - 1;

        // ++++ slash group-count penalty
        if (separatorCount !== 0) {
            Flx.IncVec(scores, groupCount * -2, null, null);
        }

        let index2 = separatorCount;
        let lastGroupLimit: number | null = null;
        let basepathFound = false;

        // score each group further
        for (const group of groupAlist) {
            const groupStart = group[0];
            const wordCount = group[1];
            // this is the number of effective word groups
            const wordsLength = group.length - 2;
            let basepathP = false;

            if (wordsLength !== 0 && !basepathFound) {
                basepathFound = true;
                basepathP = true;
            }

            let num: number;
            if (basepathP) {
                // ++++ basepath separator-count boosts
                let boosts = 0;
                if (separatorCount > 1) {
                    boosts = separatorCount - 1;
                }
                // ++++ basepath word count penalty
                const penalty = -wordCount;
                num = 35 + boosts + penalty;
            }
            // ++++ non-basepath penalties
            else {
                if (index2 === 0) {
                    num = -3;
                } else {
                    num = -5 + (index2 - 1);
                }
            }

            Flx.IncVec(scores, num, groupStart + 1, lastGroupLimit);

            const cddrGroup = [...group];  // clone it
            cddrGroup.shift();
            cddrGroup.shift();

            let wordIndex = wordsLength - 1;
            let lastWord = (lastGroupLimit !== null) ? lastGroupLimit : strLen;

            for (const word of cddrGroup) {
                // ++++  beg word bonus AND
                scores[word] += 85;

                let index3 = word;
                let charI = 0;

                while (index3 < lastWord) {
                    scores[index3] += (-3 * wordIndex) -  // ++++ word order penalty
                        charI;  // ++++ char order penalty

                    ++charI;

                    ++index3;
                }

                lastWord = word;
                --wordIndex;
            }

            lastGroupLimit = groupStart + 1;
            --index2;
        }

        return scores;
    }

    /**
     * Return sublist bigger than VAL from sorted SORTED-LIST.
     * 
     * If VAL is nil, return entire list.
     */
    public static BiggerSublist(result: Array<number>, sortedList: Array<number> | undefined, val: number | null): void {
        if (sortedList === undefined || sortedList === null) {
            return;
        }
        if (val !== null) {
            for (const sub of sortedList) {
                if (sub > val) {
                    result.push(sub);
                }
            }
        } else {
            for (const sub of sortedList) {
                result.push(sub);
            }
        }
    }

    /**
     * Recursively compute the best match for a string, passed as STR-INFO and
     * HEATMAP, according to QUERY.
     */
    public static FindBestMatch(
        imatch: Array<Score>,
        strInfo: Map<number, Array<number>>,
        heatmap: Array<number>,
        greaterThan: number | null,
        query: string, queryLength: number,
        qIndex: number,
        matchCache: Map<number, Array<Score>>): Array<Score> {

        let greaterNum = (greaterThan !== null) ? greaterThan : 0;
        let hashKey: number = qIndex + (greaterNum * queryLength);
        let hashValue = matchCache.get(hashKey);

        // Process matchCache here
        if (hashValue !== undefined) {
            console.log("clean");
            imatch = [];
            hashValue.forEach((val) => imatch.push(val));
        } else {
            let uchar: number = query.charCodeAt(qIndex);
            const sortedList: Array<number> | undefined = (strInfo.size === undefined) ? undefined : strInfo.get(uchar);
            let indexes: Array<number> = new Array();
            Flx.BiggerSublist(indexes, sortedList, greaterThan);
            let tempScore;
            let bestScore = Number.MIN_SAFE_INTEGER;

            if (qIndex >= queryLength - 1) {
                // At the tail end of the recursion, simply generate all possible
                // matches with their scores and return the list to parent.
                for (const index of indexes) {
                    let indices: Array<number> = new Array();
                    indices.push(index);
                    imatch.push({ indices, score: heatmap[index], tail: 0 });
                }
            } else {
                for (const index of indexes) {
                    let elemGroup = Array<Score>();
                    elemGroup = Flx.FindBestMatch(elemGroup,
                        strInfo,
                        [...heatmap],
                        index, query, queryLength, qIndex + 1, matchCache);

                    for (const elem of elemGroup) {
                        const caar = elem.indices[0];
                        const cadr = elem.score;
                        const cddr = elem.tail;

                        if ((caar - 1) === index) {
                            tempScore = cadr + heatmap[index] +
                                (Math.min(cddr, 3) * 15) +   // boost contiguous matches
                                60;
                        } else {
                            tempScore = cadr + heatmap[index];
                        }

                        // We only care about the optimal match, so only forward the match
                        // with the best score to parent
                        if (tempScore > bestScore) {
                            bestScore = tempScore;

                            imatch = [];
                            const indices = [index, ...elem.indices];
                            let tail = 0;
                            if ((caar - 1) === index) {
                                tail = cddr + 1;
                            }
                            imatch.push({ indices, score: tempScore, tail });
                        }
                    }
                }
            }

            // Calls are cached to avoid exponential time complexity
            Util.dictSet(matchCache, hashKey, [...imatch]);
        }

        return imatch;
    }

    public static Score(str: string, query: string): Score | null {
        if (str === '' || query === '') {
            return null;
        }

        let strInfo: Map<number, Array<number>> = new Map();
        Flx.GetHashForString(strInfo, str);

        let heatmap: Array<number> = new Array();
        heatmap = Flx.GetHeatmapStr(heatmap, str, null);

        let queryLength = query.length;
        let fullMatchBoost = (1 < queryLength) && (queryLength < 5);
        let matchCache: Map<number, Array<Score>> = new Map();
        let optimalMatch: Array<Score> = new Array();
        optimalMatch = Flx.FindBestMatch(optimalMatch, strInfo, heatmap, null, query, queryLength, 0, matchCache);

        if (optimalMatch.length === 0) {
            return null;
        }

        let result1 = optimalMatch[0];
        const caar = result1.indices.length;

        if (fullMatchBoost && caar === str.length) {
            result1.score += 10000;
        }

        return result1;
    }
}
