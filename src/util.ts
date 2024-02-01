import { Score } from './flx';

export class Util {
    public static dictSet(result: Map<number, Array<Score>>, key: number | null, val: Array<Score>): void {
        if (key === null) return;
        result.set(key, val);
    }

    public static dictGet<T>(dict: Map<number, Array<T>>, key: number | null): T[] | null {
        if (key === null) return null;
        return dict.get(key) || null;
    }

    public static dictInsert(result: Map<number, Array<number>>, key: number, val: number): void {
        if (!result.has(key)) result.set(key, []);
        let lst = result.get(key);
        lst?.unshift(val);
    }

    public static toString<T>(lst: T[]): string {
        return lst.join(" ") + " ";
    }
}
