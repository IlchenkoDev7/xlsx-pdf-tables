import { cloneDeep } from 'lodash';
import { TableSchema } from "../../types/TableSchema";

export const calculateColumnWidths = <T extends {}>(
    schemas: TableSchema<T>[],
    parentWidth: number = 100
): TableSchema<T>[] => {
    const copiedSchema: TableSchema<T>[] = cloneDeep(schemas);

    copiedSchema.forEach(schema => {
        if (!schema.columnWidth?.pdfPercent) {
            schema.columnWidth = { ...schema.columnWidth, pdfPercent: parentWidth / copiedSchema.length };
        }

        if (schema.children && schema.children.length > 0) {
            const childrenWidthSum = schema.children.reduce((sum, child) => {
                return sum + (child.columnWidth?.pdfPercent || 0);
            }, 0);

            if (childrenWidthSum !== 100) {
                const remainingWidth = 100 - childrenWidthSum;
                const schemasWithoutWidth = schema.children.filter(child => !child.columnWidth?.pdfPercent);

                if (schemasWithoutWidth.length > 0) {
                    const equalWidth = remainingWidth / schemasWithoutWidth.length;
                    schemasWithoutWidth.forEach(child => {
                        child.columnWidth = { ...child.columnWidth, pdfPercent: equalWidth };
                    });
                } else {
                    const narrowestChild = schema.children.reduce((narrowest, child) => {
                        return (!narrowest || (child.columnWidth?.pdfPercent || 0) < (narrowest.columnWidth?.pdfPercent || 0)) ? child : narrowest;
                    }, null as TableSchema<T> | null);

                    if (narrowestChild) {
                        narrowestChild.columnWidth = {
                            ...narrowestChild.columnWidth,
                            pdfPercent: (narrowestChild.columnWidth?.pdfPercent || 0) + remainingWidth
                        };
                    }
                }
            }

            schema.children = calculateColumnWidths(schema.children, 100);
        }
    });

    return copiedSchema;
};