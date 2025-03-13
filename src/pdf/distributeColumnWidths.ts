import { TableSchema } from "../types/TableSchema";

export const distributeColumnWidths = <T,>(schemas: TableSchema<T>[], totalWidth: number = 100): void => {
    const lastLevelColumns: TableSchema<T>[] = [];

    // Рекурсивная функция для сбора всех конечных столбцов (без children)
    const collectLastLevelColumns = (schemas: TableSchema<T>[]) => {
        schemas.forEach(schema => {
            if (schema.children && schema.children.length > 0) {
                collectLastLevelColumns(schema.children);
            } else {
                lastLevelColumns.push(schema);
            }
        });
    };

    collectLastLevelColumns(schemas);

    // 1. Определяем столбцы, у которых уже задана ширина
    const columnsWithWidth = lastLevelColumns.filter(col => col.columnWidth?.pdfPercent !== undefined);
    const columnsWithoutWidth = lastLevelColumns.filter(col => col.columnWidth?.pdfPercent === undefined);

    // 2. Вычисляем оставшееся место для столбцов без ширины
    const usedWidth = columnsWithWidth.reduce((sum, col) => sum + (col.columnWidth?.pdfPercent || 0), 0);
    const remainingWidth = totalWidth - usedWidth;

    // 3. Если есть столбцы без ширины, равномерно распределяем оставшееся место
    if (columnsWithoutWidth.length > 0) {
        const widthPerColumn = remainingWidth / columnsWithoutWidth.length;
        columnsWithoutWidth.forEach(col => {
            col.columnWidth = { pdfPercent: widthPerColumn };
        });
    }

    // 4. Если у всех столбцов нет ширины, равномерно делим весь `totalWidth`
    if (columnsWithWidth.length === 0) {
        const widthPerColumn = totalWidth / lastLevelColumns.length;
        lastLevelColumns.forEach(col => {
            col.columnWidth = { pdfPercent: widthPerColumn };
        });
    }

    // 5. Распространяем ширину вверх по уровням вложенности
    const updateParentWidths = (schemas: TableSchema<T>[]) => {
        schemas.forEach(schema => {
            if (schema.children && schema.children.length > 0) {
                updateParentWidths(schema.children);

                // Суммируем ширины дочерних элементов
                schema.columnWidth = {
                    pdfPercent: schema.children.reduce((sum, child) => sum + (child.columnWidth?.pdfPercent || 0), 0),
                };
            }
        });
    };

    updateParentWidths(schemas);
};