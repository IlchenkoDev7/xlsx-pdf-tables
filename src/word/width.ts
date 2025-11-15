import { TableSchema } from "../types/TableSchema";
import { extractParamsFromSchema } from "../utils/extractParamsFromSchema";
import { WordOptions } from "./types";

const A4_PORTRAIT_WIDTH_DXA = 9000;
const A4_LANDSCAPE_WIDTH_DXA = 14000;

export function getTableWidthDxa(opts?: WordOptions): number {
    if (opts?.pageWidthDxaOverride && opts.pageWidthDxaOverride > 0) {
        return Math.floor(opts.pageWidthDxaOverride);
    }

    const orientation = opts?.pageOrientation ?? "portrait";
    return orientation === "landscape"
        ? A4_LANDSCAPE_WIDTH_DXA
        : A4_PORTRAIT_WIDTH_DXA;
}

export function computeColumnWidthsDxa(
    columnPercents: number[],
    totalWidthDxa: number
): number[] {
    const cols = columnPercents.length;
    if (cols === 0 || totalWidthDxa <= 0) return [];

    const widths = columnPercents.map((p) =>
        Math.max(1, Math.floor((p * totalWidthDxa) / 100))
    );

    let sum = widths.reduce((s, w) => s + w, 0);
    let diff = totalWidthDxa - sum;

    let i = 0;
    const maxIterations = cols * 10;

    while (diff !== 0 && i < maxIterations) {
        const idx = i % cols;

        if (diff > 0) {
            widths[idx]++;
            diff--;
        } else if (widths[idx] > 1) {
            widths[idx]--;
            diff++;
        }

        i++;
    }

    return widths;
}

export function computeWordColumnPercents<T extends {}>(schema: TableSchema<T>[], columnCount: number): number[] {
    const cfgs = extractParamsFromSchema(
        schema, "columnWidth") as (TableSchema<T>["columnWidth"] | undefined)[];

    if (columnCount <= 0) return [];

    const weights = new Array<number>(columnCount).fill(1);

    for (let i = 0; i < columnCount; i++) {
        const p = cfgs[i]?.wordPercent;
        if (typeof p === "number" && isFinite(p) && p > 0) {
            weights[i] = p;
        }
    }

    let totalWeight = weights.reduce((sum, w) => sum + w, 0);

    if (!isFinite(totalWeight) || totalWeight <= 0) {
        const base = Math.floor(100 / columnCount);
        let rem = 100 - base * columnCount;
        return weights.map((_, idx) => base + (rem-- > 0 ? 1 : 0));
    }

    const out = new Array<number>(columnCount).fill(0);

    let acc = 0;

    for (let i = 0; i < columnCount; i++) {
        const v = Math.floor((weights[i] * 100) / totalWeight); out[i] = v; acc += v;
    }

    let remainder = 100 - acc;
    let idx = 0;
    while (remainder !== 0 && columnCount > 0) {
        const i = idx % columnCount;

        if (remainder > 0) {
            out[i]++; remainder--;
        } else if (out[i] > 1) {
            out[i]--; remainder++;
        }

        idx++;
    }

    for (let i = 0; i < columnCount; i++) {
        if (out[i] <= 0) out[i] = 1;
    }

    let total = out.reduce((s, v) => s + v, 0);

    idx = 0;

    while (total > 100 && idx < columnCount * 2) {
        const i = idx % columnCount;

        if (out[i] > 1) {
            out[i]--; total--;
        }

        idx++;
    }
    idx = 0;

    while (total < 100 && idx < columnCount) {
        out[idx]++;
        total++;
        idx++;
    }

    return out;
}
