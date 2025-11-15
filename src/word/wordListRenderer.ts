import {
    AlignmentType,
    BorderStyle,
    Paragraph,
    Table,
    TableCell,
    TableRow,
    TextRun,
    WidthType,
    VerticalAlign,
    TableLayoutType,
    type ITableCellOptions,
} from "docx";
import { TableSchema } from "../types/TableSchema";
import { FlattenedRow } from "../utils/flattenData";
import { InternalRowSpanMatrix, WordChild, WordOptions } from "./types";
import { extractParamsFromSchema } from "../utils/extractParamsFromSchema";
import { TableTitle } from "../types/TableTitle";
import { convertDataToArray } from "../utils/convertDataToArray";
import { getColumnCount } from "../excel/columns/getColumnCount";
import { computeColumnWidthsDxa, computeWordColumnPercents, getTableWidthDxa } from "./width";

export function wordListRenderer<T extends {}>(
    children: WordChild[],
    tableTitles: TableTitle[],
    tableSchema: TableSchema<T>[],
    tableData: T[],
    opts?: WordOptions
) {
    const rows = convertDataToArray(tableData, tableSchema);
    const columnCount = getColumnCount(tableSchema);

    const titleParagraphs: Paragraph[] = [];
    if (tableTitles.length > 0) {
        tableTitles.forEach((t) =>
            titleParagraphs.push(
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                        new TextRun({
                            text: t.label,
                            bold: t.bold,
                            size: ((opts?.headerFontSize ?? 14) * 2) as number,
                        }),
                    ],
                })
            )
        );
    }

    if (columnCount === 0) {
        children.push(...titleParagraphs, new Paragraph({}));
        return;
    }

    const colPercents = computeWordColumnPercents(tableSchema, columnCount);

    const tableWidthDxa = getTableWidthDxa(opts);

    const columnWidthsDxa = computeColumnWidthsDxa(colPercents, tableWidthDxa);

    const headerRows = buildHeaderRows(tableSchema, columnWidthsDxa, opts);
    const bodyRows = buildBodyRows(tableSchema, rows, columnWidthsDxa, opts);

    const table = new Table({
        width: { size: tableWidthDxa, type: WidthType.DXA },
        layout: TableLayoutType.FIXED,
        columnWidths: columnWidthsDxa,
        rows: [...headerRows, ...bodyRows],
    });

    children.push(...titleParagraphs, table, new Paragraph({}));
}

function buildHeaderRows<T extends {}>(
    schema: TableSchema<T>[],
    columnWidthsDxa: number[],
    opts?: WordOptions
): TableRow[] {
    if (!schema.length) return [];

    const maxDepth = getHeaderDepth(schema);
    const leafCountCache = new Map<TableSchema<T>, number>();

    type HeaderCellMeta = {
        node: TableSchema<T>;
        label: string;
        rowSpan: number;
        colSpan: number;
        colIndex: number;
    };

    const headerRowsMeta: HeaderCellMeta[][] = Array.from(
        { length: maxDepth },
        () => []
    );

    const getLeafCount = (node: TableSchema<T>): number => {
        const cached = leafCountCache.get(node);
        if (cached != null) return cached;

        let count: number;
        if (node.children && node.children.length > 0) {
            count = node.children.reduce((sum, ch) => sum + getLeafCount(ch), 0);
        } else {
            count = 1;
        }
        leafCountCache.set(node, count);
        return count;
    };

    const placeNode = (
        node: TableSchema<T>,
        rowIndex: number,
        colIndex: number
    ): number => {
        const hasChildren = !!(node.children && node.children.length);

        const naturalColspan = getLeafCount(node);
        const colSpan =
            typeof node.colspan === "number" && node.colspan > 0
                ? node.colspan
                : naturalColspan;

        const naturalRowspan = hasChildren ? 1 : maxDepth - rowIndex;
        const rowSpan =
            typeof node.rowspan === "number" && node.rowspan > 0
                ? node.rowspan
                : naturalRowspan;

        headerRowsMeta[rowIndex].push({
            node,
            label: node.label,
            rowSpan,
            colSpan,
            colIndex,
        });

        if (hasChildren) {
            let childCol = colIndex;
            for (const child of node.children!) {
                childCol = placeNode(child, rowIndex + 1, childCol);
            }
        }

        return colIndex + colSpan;
    };

    let currentCol = 0;
    for (const h of schema) {
        currentCol = placeNode(h, 0, currentCol);
    }

    const headerFontSize = (opts?.headerFontSize ?? 11) * 2;

    return headerRowsMeta.map((rowCells) => {
        const sorted = rowCells.slice().sort((a, b) => a.colIndex - b.colIndex);

        const cells = sorted.map((meta) => {
            const cellWidthDxa = columnWidthsDxa
                .slice(meta.colIndex, meta.colIndex + meta.colSpan)
                .reduce((s, w) => s + w, 0);

            const cellOptions: ITableCellOptions = {
                columnSpan: meta.colSpan > 1 ? meta.colSpan : undefined,
                rowSpan: meta.rowSpan > 1 ? meta.rowSpan : undefined,
                width: {
                    size: cellWidthDxa,
                    type: WidthType.DXA,
                },
                borders: {
                    top: { style: BorderStyle.SINGLE, size: 6 },
                    bottom: { style: BorderStyle.SINGLE, size: 6 },
                    left: { style: BorderStyle.SINGLE, size: 6 },
                    right: { style: BorderStyle.SINGLE, size: 6 },
                },
                verticalAlign: VerticalAlign.CENTER,
                children: [
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                            new TextRun({
                                text: meta.label,
                                bold: true,
                                size: headerFontSize,
                            }),
                        ],
                    }),
                ],
            };

            return new TableCell(cellOptions);
        });

        return new TableRow({ children: cells });
    });
}

function getHeaderDepth<T extends {}>(schema: TableSchema<T>[]): number {
    let max = 1;

    const visit = (node: TableSchema<T>, depth: number) => {
        if (depth > max) max = depth;
        if (node.children && node.children.length > 0) {
            node.children.forEach((c) => visit(c, depth + 1));
        }
    };

    schema.forEach((n) => visit(n, 1));
    return max;
}

function computeRowSpanMatrix(data: FlattenedRow[]): InternalRowSpanMatrix {
    if (data.length === 0) return [];
    const rows = data.length;
    const cols = data[0].data.length;
    const matrix: number[][] = Array.from({ length: rows }, () => Array(cols).fill(1));

    const getKey = (rowIndex: number, colIndex: number): string =>
        data[rowIndex].mergeKeys.slice(0, colIndex + 1).join("-");

    for (let colIndex = 0; colIndex < cols; colIndex++) {
        let groupStart = 0;

        for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
            const key = getKey(rowIndex, colIndex);
            const prev = rowIndex > 0 ? getKey(rowIndex - 1, colIndex) : undefined;
            const next = rowIndex < rows - 1 ? getKey(rowIndex + 1, colIndex) : undefined;

            if (rowIndex === 0 || key !== prev) {
                groupStart = rowIndex;
            }

            const isGroupEnd = rowIndex === rows - 1 || key !== next;
            if (isGroupEnd) {
                const span = rowIndex - groupStart + 1;
                if (span > 1) {
                    matrix[groupStart][colIndex] = span;
                    for (let r = groupStart + 1; r <= rowIndex; r++) {
                        matrix[r][colIndex] = 0;
                    }
                }
            }
        }
    }

    return matrix;
}

function buildBodyRows<T extends {}>(
    schema: TableSchema<T>[],
    data: FlattenedRow[],
    columnWidthsDxa: number[],
    opts?: WordOptions
): TableRow[] {
    if (data.length === 0) return [];

    const rowSpanMatrix = computeRowSpanMatrix(data);
    const rowsCount = data.length;
    const colsCount = data[0].data.length;

    const columnsHorizontalAlign = extractParamsFromSchema(
        schema,
        "columnCellsHorizontalAlign"
    ) as TableSchema<T>["columnCellsHorizontalAlign"][];

    const columnsVerticalAlign = extractParamsFromSchema(
        schema,
        "columnCellsVerticalAlign"
    ) as TableSchema<T>["columnCellsVerticalAlign"][];

    const contentFontSize = (opts?.contentFontSize ?? 10) * 2;

    const result: TableRow[] = [];
    const activeRowSpans: number[] = Array(colsCount).fill(0);

    for (let rowIndex = 0; rowIndex < rowsCount; rowIndex++) {
        const row = data[rowIndex];

        const colSpan = new Array<number>(colsCount).fill(1);
        const skipCol = new Array<boolean>(colsCount).fill(false);

        if (Array.isArray(row.hMerge)) {
            for (const [from, to] of row.hMerge) {
                const start = from - 1;
                const end = to - 1;
                if (start >= 0 && end < colsCount && end > start) {
                    colSpan[start] = end - start + 1;
                    for (let c = start + 1; c <= end; c++) {
                        skipCol[c] = true;
                    }
                }
            }
        }
        if (Array.isArray(row.hMergeEx)) {
            for (const m of row.hMergeEx) {
                if (!m) continue;
                const start = m.from - 1;
                const end = m.to - 1;
                if (start >= 0 && end < colsCount && end > start) {
                    colSpan[start] = end - start + 1;
                    for (let c = start + 1; c <= end; c++) {
                        skipCol[c] = true;
                    }
                }
            }
        }

        const cells: TableCell[] = [];
        const isFirstBodyRow = rowIndex === 0;

        for (let colIndex = 0; colIndex < colsCount; colIndex++) {
            if (activeRowSpans[colIndex] > 0) {
                activeRowSpans[colIndex]--;
                continue;
            }

            if (skipCol[colIndex]) continue;

            const value = row.data[colIndex];
            const text = value == null ? "" : String(value);
            const rowSpan = rowSpanMatrix[rowIndex][colIndex];
            const cSpan = colSpan[colIndex] ?? 1;

            const alignCfg = columnsHorizontalAlign[colIndex];
            const alignment = alignCfg?.word ?? AlignmentType.CENTER;

            const vAlignCfg = columnsVerticalAlign[colIndex];
            const verticalAlign = (() => {
                switch (vAlignCfg) {
                    case "top":
                        return VerticalAlign.TOP;
                    case "bottom":
                        return VerticalAlign.BOTTOM;
                    default:
                        return VerticalAlign.CENTER;
                }
            })();

            const bold =
                row.rowBold ||
                !!row.hMergeEx?.some(
                    (m) =>
                        m &&
                        colIndex + 1 >= m.from &&
                        colIndex + 1 <= m.to &&
                        m.bold
                );

            const cellWidthDxa = columnWidthsDxa
                .slice(colIndex, colIndex + cSpan)
                .reduce((s, w) => s + w, 0);

            const cellOptions: ITableCellOptions = {
                columnSpan: cSpan > 1 ? cSpan : undefined,
                rowSpan: rowSpan > 1 ? rowSpan : undefined,
                width: {
                    size: cellWidthDxa,
                    type: WidthType.DXA,
                },
                borders: {
                    top: isFirstBodyRow
                        ? { style: BorderStyle.SINGLE, size: 8 }
                        : { style: BorderStyle.SINGLE, size: 4 },
                    bottom: { style: BorderStyle.SINGLE, size: 4 },
                    left: { style: BorderStyle.SINGLE, size: 4 },
                    right: { style: BorderStyle.SINGLE, size: 4 },
                },
                verticalAlign,
                children: [
                    new Paragraph({
                        alignment,
                        children: [
                            new TextRun({
                                text,
                                bold,
                                size: contentFontSize,
                            }),
                        ],
                    }),
                ],
            };

            if (rowSpan > 1) {
                activeRowSpans[colIndex] = rowSpan - 1;
            }

            cells.push(new TableCell(cellOptions));
        }

        result.push(new TableRow({ children: cells }));
    }

    return result;
}
