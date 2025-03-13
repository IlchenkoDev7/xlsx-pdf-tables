import { BorderStyle, Worksheet } from "exceljs";

/**
 * Выделяет рамкой контур группы строк (вложенного объекта)
 *
 * @param worksheet - Рабочий лист Excel
 * @param startRow - Номер начальной строки группы
 * @param endRow - Номер конечной строки группы
 * @param startCol - Номер начального столбца группы
 * @param endCol - Номер конечного столбца группы
 */
export const drawBorderForGroup = (
    worksheet: Worksheet,
    startRow: number,
    endRow: number,
    startCol: number,
    endCol: number,
    borderStyle: BorderStyle
): void => {
    // Верхняя рамка
    for (let col = startCol; col <= endCol; col++) {
        worksheet.getCell(startRow, col).border = {
            ...worksheet.getCell(startRow, col).border,
            top: { style: borderStyle },
        };
    }

    // Нижняя рамка
    for (let col = startCol; col <= endCol; col++) {
        worksheet.getCell(endRow, col).border = {
            ...worksheet.getCell(endRow, col).border,
            bottom: { style: borderStyle },
        };
    }

    // Левая рамка
    for (let row = startRow; row <= endRow; row++) {
        worksheet.getCell(row, startCol).border = {
            ...worksheet.getCell(row, startCol).border,
            left: { style: borderStyle },
        };
    }

    // Правая рамка
    for (let row = startRow; row <= endRow; row++) {
        worksheet.getCell(row, endCol).border = {
            ...worksheet.getCell(row, endCol).border,
            right: { style: borderStyle },
        };
    }
};