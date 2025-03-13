import { Row } from "exceljs";

export const setColor = (colors: (string | null)[], excelRow: Row) => {
    colors.forEach((color, colIndex) => {
        if (color) {
            const cell = excelRow.getCell(colIndex + 1);
            cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: color },
            };
        }
    });
}