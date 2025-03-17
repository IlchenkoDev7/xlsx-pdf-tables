import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

// Подключаем необходимые плагины
dayjs.extend(customParseFormat);
/**
 * Проверяет, является ли строка датой, временем или timestamp.
 * @param value Строка или число для проверки.
 * @returns true, если значение является датой, временем или timestamp, иначе false.
 */
export const isDateOrTime = (value: string | number): boolean => {
    // Если значение — число, проверяем, является ли оно Unix timestamp
    if (typeof value === "number") {
        return dayjs.unix(value).isValid(); // Проверка Unix timestamp
    }

    // Форматы, которые мы поддерживаем
    const dateFormats = ["DD.MM.YYYY", "YYYY-MM-DD", "MM/DD/YYYY"]; // Добавьте другие форматы, если нужно
    const timeFormats = ["HH:mm", "HH:mm:ss"]; // Добавьте другие форматы, если нужно

    // Проверяем, является ли значение датой в одном из форматов
    const isDate = dateFormats.some((format) => dayjs(value, format, true).isValid());

    // Проверяем, является ли значение временем в одном из форматов
    const isTime = timeFormats.some((format) => dayjs(value, format, true).isValid());

    // Проверяем, является ли значение ISO строкой (например, "2023-12-12T14:30:00Z")
    const isISOString = dayjs(value).isValid() && dayjs(value).toISOString() === value;

    // Проверяем, является ли значение Unix timestamp (в виде строки, например, "1700000000")
    const isUnixTimestampString = !isNaN(Number(value)) && dayjs.unix(Number(value)).isValid();

    // Возвращаем true, если значение соответствует хотя бы одному формату
    return isDate || isTime || isISOString || isUnixTimestampString;
};