export const isDateOrTime = (
    value: string
): boolean => {
    // Проверка на соответствие формату даты DD.MM.YYYY
    const dateRegex = /^\d{2}\.\d{2}\.\d{4}$/;
    
    // Проверка на соответствие формату времени HH:MM
    const timeRegex = /^\d{2}:\d{2}$/;
    
    return dateRegex.test(value) || timeRegex.test(value);
}