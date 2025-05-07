import { cloneDeep } from 'lodash';
import { TableSchema } from "../types/TableSchema";

export const calculateColumnWidths = <T extends {}>(
    schemas: TableSchema<T>[],
    parentWidth: number = 100
): TableSchema<T>[] => {
    // Создаем глубокую копию схемы
    const copiedSchema: TableSchema<T>[] = cloneDeep(schemas);

    copiedSchema.forEach(schema => {
        // Если ширина не указана, распределяем её равномерно
        if (!schema.columnWidth?.pdfPercent) {
            schema.columnWidth = { ...schema.columnWidth, pdfPercent: parentWidth / copiedSchema.length };
        }

        // Если есть дети, рекурсивно рассчитываем их ширину
        if (schema.children && schema.children.length > 0) {
            // Ширина детей рассчитывается относительно 100% ширины родителя
            const childrenWidthSum = schema.children.reduce((sum, child) => {
                return sum + (child.columnWidth?.pdfPercent || 0);
            }, 0);

            // Если суммарная ширина детей не равна 100%, корректируем
            if (childrenWidthSum !== 100) {
                const remainingWidth = 100 - childrenWidthSum;
                const schemasWithoutWidth = schema.children.filter(child => !child.columnWidth?.pdfPercent);

                if (schemasWithoutWidth.length > 0) {
                    // Распределяем оставшуюся ширину между детьми без ширины
                    const equalWidth = remainingWidth / schemasWithoutWidth.length;
                    schemasWithoutWidth.forEach(child => {
                        child.columnWidth = { ...child.columnWidth, pdfPercent: equalWidth };
                    });
                } else {
                    // Если все дети имеют ширину, добавляем профицит самой узкой колонке
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

            // Рекурсивно рассчитываем ширину для детей (относительно 100% ширины родителя)
            schema.children = calculateColumnWidths(schema.children, 100);
        }
    });

    // Возвращаем новую схему с рассчитанными ширинами
    return copiedSchema;
};