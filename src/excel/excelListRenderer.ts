import { Workbook } from "exceljs";
import { convertDataToArray } from "./data/convertDataToArray";
import { createNestedHeaders } from "./header/createNestedHeader";
import { generateDataRows } from "./rows/generateDataRows";
import { setColumnWidth } from "./columns/setColumnWidth";
import { TableTitle } from "./types/TableTitle";
import { setColumnAlignment } from "./columns/setColumnAlignment";
import { setTitles } from "./titles/setTitles";
import { TableSchema } from "../types/TableSchema";

// Создание листа для таблицы
export const excelListRenderer = <T extends {}>(
    workbook: Workbook,
    listName: string,
    tableTitles: TableTitle[],
    tableSchema: TableSchema<T>[],
    tableData: T[],
    borderedContent?: boolean,
): void => {
    // Создаём в книге новый лист, передавая ему название
    const worksheet = workbook.addWorksheet(listName);

    // Вставка title-ов таблицы
    setTitles(worksheet, tableTitles, tableSchema)

    // Выбираем строку, на которой будет заголовок
    const startRowForHeaders = tableTitles.length + 1;

    // Создаем шапку любого уровня вложенности
    createNestedHeaders<T>(worksheet, tableSchema, startRowForHeaders, 1);

    // Преобразуем внешние данные на основе данных и шапки
    const data = convertDataToArray<T>(tableData, tableSchema);

    // Генерируем строки на основе внешних данных
    generateDataRows(data, worksheet, { borderedContent: borderedContent ?? true });

    // Выравниваем ширину каждой колонки на основе длины всех данных колонки
    setColumnWidth(worksheet, tableSchema, startRowForHeaders);

    // Устанавливаем выравнивание ячеек по горизонтали и по вертикали
    setColumnAlignment(worksheet, tableSchema, startRowForHeaders)
};