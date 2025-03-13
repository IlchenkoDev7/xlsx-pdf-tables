import { TableSchema } from "../types/TableSchema";

export const distributeColumnWidths = <T,>(schemas: TableSchema<T>[], totalWidth: number = 100): void => {
    const lastLevelColumns = schemas.filter(schema => !schema.children || schema.children.length === 0);

    lastLevelColumns.forEach(schema => {
        if (schema.columnWidth !== undefined) {
            if (typeof schema.columnWidth === "number") {
                schema.columnWidth = { pdfPercent: schema.columnWidth };
            }
            schema.columnWidth.pdfPercent = (schema.columnWidth.pdfPercent / 100) * totalWidth;
        }
    });

    schemas.forEach(schema => {
        if (schema.children && schema.children.length > 0) {
            distributeColumnWidths(schema.children, totalWidth);

            if (!schema.columnWidth) {
                schema.columnWidth = { pdfPercent: 0 };
            }

            schema.columnWidth.pdfPercent = schema.children.reduce(
                (sum, child) => sum + ((child.columnWidth?.pdfPercent) || 0),
                0
            );
        }
    });
};