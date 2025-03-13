import { Worksheet } from "exceljs";

/**
 * Устанавливает рамки для всех ячеек на рабочем листе
 *
 * @param worksheet - Рабочий лист Excel
 */
export const setBorders = (worksheet: Worksheet): void => {
    worksheet.eachRow((row) => {
        row.eachCell((cell) => {
            cell.border = {
                top: { style: "thin" }, // Верхняя рамка
                bottom: { style: "thin" }, // Нижняя рамка
                left: { style: "thin" }, // Левая рамка
                right: { style: "thin" }, // Правая рамка
            };
        });
    });
};