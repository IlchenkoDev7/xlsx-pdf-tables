import { DocumentProps, pdf } from "@react-pdf/renderer";

export const openPdfInNewTab = async (
    document: React.ReactElement<DocumentProps, string | React.JSXElementConstructor<any>>
) => {
    const newTab = window.open("about:blank", "_blank"); // Открываем пустую вкладку синхронно

    if (!newTab) {
        alert("Браузер заблокировал всплывающее окно. Разрешите открытие новых вкладок.");
        return;
    }

    const blob = await pdf(document).toBlob(); // Генерируем PDF
    const url = URL.createObjectURL(blob); // Создаем URL для Blob

    newTab.location.href = url; // Перенаправляем новую вкладку на PDF-файл

    // Очистка памяти через 10 секунд
    setTimeout(() => URL.revokeObjectURL(url), 10000);
};