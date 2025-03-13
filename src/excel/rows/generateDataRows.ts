import { Worksheet } from "exceljs";
import { FlattenedRow } from "../data/flattenData";
import { drawBorderForGroup } from "./drawBorderForGroup";
import { setColor } from "./setColor";

export const generateDataRows = (data: FlattenedRow[], worksheet: Worksheet): void => {
    const groupStartRows: Map<string, number> = new Map();
    const topLevelRanges: Map<string, { startRow: number; endRow: number }> = new Map();

    data.forEach((rowData, rowIndex) => {
        const { data: rowValues, mergeKeys, colors } = rowData;

        const excelRow = worksheet.addRow(rowValues);

        setColor(colors, excelRow)

        mergeKeys.forEach((_: any, colIndex: number) => {
            const groupKey = mergeKeys.slice(0, colIndex + 1).join("-");

            if (!groupStartRows.has(groupKey)) {
                groupStartRows.set(groupKey, excelRow.number);
            }

            const isLastRow = rowIndex === data.length - 1;
            const nextMergeKey = isLastRow ? null : data[rowIndex + 1]?.mergeKeys[colIndex];

            if (isLastRow || mergeKeys[colIndex] !== nextMergeKey) {
                const startRow = groupStartRows.get(groupKey)!;
                const endRow = excelRow.number;

                // Сохраняем диапазоны для верхнего уровня
                if (colIndex === 0) {
                    topLevelRanges.set(groupKey, { startRow, endRow });
                }

                if (startRow !== endRow) {
                    worksheet.mergeCells(startRow, colIndex + 1, endRow, colIndex + 1);
                }

                // Добавление рамки для текущей группы
                drawBorderForGroup(worksheet, startRow, endRow, colIndex + 1, rowValues.length, 'thin');

                groupStartRows.delete(groupKey);
            }
        });
    });

    topLevelRanges.forEach(({ startRow, endRow }) => {
        drawBorderForGroup(worksheet, startRow, endRow, 1, data[0].data.length, "medium");
    });
};