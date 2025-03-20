import { Text, View } from "@react-pdf/renderer";
import { tableStyles } from "../../tableStyles";
import { resolveNestedValue } from "../../../utils/resolveNestedValue";
import { AlignItemsPdf } from "../../../types/AlignItems";
import { getAlignItemsByValue } from "./getAlignItemsByValue";

interface ContentCellProps<T extends {}> {
    row: T;
    pdfPercent: number | undefined;
    dataKey: string;
    alignItems?: AlignItemsPdf;
    withoutBorders?: boolean
}

const ContentCell = <T extends {}>({ row, dataKey, pdfPercent, alignItems, withoutBorders }: ContentCellProps<T>) => {
    if (!pdfPercent) throw new Error("Не указан процент ширины столбца");

    const cellValue = resolveNestedValue(row, dataKey);

    const resolvedAlignItems = alignItems || getAlignItemsByValue(cellValue);

    return (
        <View
            style={{
                ...tableStyles.tableCell,
                border: !withoutBorders ? "1 solid black" : undefined,
                width: `${pdfPercent}%`,
                alignItems: resolvedAlignItems,
            }}
        >
            <Text>{cellValue}</Text>
        </View>
    );
};

export default ContentCell;