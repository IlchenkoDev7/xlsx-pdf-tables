import { Worksheet } from "exceljs";
import { FlattenedRow } from "../data/flattenData";
import { drawBorderForGroup } from "./drawBorderForGroup";
import { setColor } from "./setColor";

type GenerateRowsOptions = {
    borderedContent?: boolean;
};

export const generateDataRows = (
    data: FlattenedRow[],
    worksheet: Worksheet,
    opts: GenerateRowsOptions = {}
): void => {
    const borderedContent = opts.borderedContent ?? true;

    const groupStartRows: Map<string, number> = new Map();
    const topLevelRanges: Map<string, { startRow: number; endRow: number }> = new Map();

    data.forEach((rowData, rowIndex) => {
        const { data: rowValues, mergeKeys, colors, hMerge, hMergeEx, rowBold } = rowData;

        const excelRow = worksheet.addRow(rowValues);
        setColor(colors, excelRow);

        if (rowBold) {
            excelRow.eachCell((cell) => {
                cell.font = { ...(cell.font ?? {}), bold: true };
            });
        }

        if (Array.isArray(hMerge)) {
            for (const [fromCol, toCol] of hMerge) {
                if (typeof fromCol === "number" && typeof toCol === "number" && toCol > fromCol) {
                    worksheet.mergeCells(excelRow.number, fromCol, excelRow.number, toCol);
                }
            }
        }

        if (Array.isArray(hMergeEx)) {
            for (const m of hMergeEx) {
                const { from, to, align, bold } = m || {};
                if (
                    typeof from === 'number' &&
                    typeof to === 'number' &&
                    to > from
                ) {
                    worksheet.mergeCells(excelRow.number, from, excelRow.number, to);
                    const master = worksheet.getCell(excelRow.number, from);

                    if (align) {
                        const prev = master.alignment ?? {};
                        master.alignment = { ...prev, ...align };
                    }

                    if (bold) {
                        master.font = { ...(master.font ?? {}), bold: true };
                    }
                }
            }
        }

        mergeKeys.forEach((_, colIndex: number) => {
            const groupKey = mergeKeys.slice(0, colIndex + 1).join("-");
            if (!groupStartRows.has(groupKey)) {
                groupStartRows.set(groupKey, excelRow.number);
            }

            const isLastRow = rowIndex === data.length - 1;
            const nextMergeKey = isLastRow ? null : data[rowIndex + 1]?.mergeKeys[colIndex];

            if (isLastRow || mergeKeys[colIndex] !== nextMergeKey) {
                const startRow = groupStartRows.get(groupKey)!;
                const endRow = excelRow.number;

                if (colIndex === 0) {
                    topLevelRanges.set(groupKey, { startRow, endRow });
                }

                if (startRow !== endRow) {
                    worksheet.mergeCells(startRow, colIndex + 1, endRow, colIndex + 1);
                }

                drawBorderForGroup(worksheet, startRow, endRow, colIndex + 1, rowValues.length, 'thin');
                groupStartRows.delete(groupKey);
            }
        });
    });

    if (borderedContent && data.length > 0) {
        topLevelRanges.forEach(({ startRow, endRow }) => {
            drawBorderForGroup(worksheet, startRow, endRow, 1, data[0].data.length, "medium");
        });
    }
};
