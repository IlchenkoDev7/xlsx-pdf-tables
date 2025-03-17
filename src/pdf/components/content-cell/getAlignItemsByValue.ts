import { AlignItemsPdf } from "../../../types/AlignItems";
import { isDateOrTime } from "../../../utils/isDateOrTime";

export const getAlignItemsByValue = (value: any): AlignItemsPdf => {
    if (typeof value === "number") {
        return "flex-end"; // Числа выравниваем по правому краю
    }
    if (typeof value === "string") {
        // Проверяем, является ли строка датой (пример простой проверки)
        if (isDateOrTime(value)) {
            return "center"; // Даты выравниваем по центру
        }
        return "flex-start"; // Текст выравниваем по левому краю
    }
    return "flex-start"; // По умолчанию выравниваем по левому краю
};