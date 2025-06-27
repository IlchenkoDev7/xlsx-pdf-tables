import { Text, View } from "@react-pdf/renderer";
import { JSX } from "react";
import { AlignItemsPdf } from "../../../../types/AlignItems";
import { isDateOrTime } from "../../../../utils/isDateOrTime";
import { baseTableStyles } from "../../../baseTableStyles";
import { resolveNestedValue } from "../../../../utils/resolveNestedValue";
import { Style } from "@react-pdf/types";
import { BorderSpec } from "../../../../types/BorderSpec";

export const getAlignItemsByValue = (value: any): AlignItemsPdf => {
    if (typeof value === "number") {
        return "flex-end";
    }
    if (typeof value === "string") {
        if (isDateOrTime(value)) {
            return "center";
        }
        return "flex-start";
    }
    return "flex-start";
};

export interface ContentCellProps<T> {
    row: T;
    pdfPercent: number;

    dataKey: string;
    alignItems?: AlignItemsPdf;

    pdfRender?: (value: any, row: T) => string | number | JSX.Element;

    cellStyle?: Style;
    textStyle?: Style;

    borders?: BorderSpec
}

const cssBorder = (spec: BorderSpec | undefined): Style => {
    if (!spec || spec === "all") return { border: "1 solid black" };
    if (spec === "none") return {};

    return {
        borderTop: spec.top ? "1 solid black" : undefined,
        borderRight: spec.right ? "1 solid black" : undefined,
        borderBottom: spec.bottom ? "1 solid black" : undefined,
        borderLeft: spec.left ? "1 solid black" : undefined,
    };
}

const ContentCell = <T extends {}>({ row, dataKey, pdfPercent, alignItems, pdfRender, cellStyle, textStyle, borders = "all", }: ContentCellProps<T>) => {
    if (!pdfPercent) throw new Error("Не указан процент ширины столбца");

    const cellValue = resolveNestedValue(row, dataKey);

    const resolvedAlignItems = alignItems || getAlignItemsByValue(cellValue);

    let content = pdfRender ? pdfRender(cellValue, row) : cellValue;

    if (typeof content !== "object" || content === null) {
        content = <Text style={textStyle}>{String(content ?? "")}</Text>;
    }

    return (
        <View
            style={{
                ...baseTableStyles.tableCell,
                ...cellStyle,
                ...cssBorder(borders),
                width: `${pdfPercent}%`,
                alignItems: resolvedAlignItems,
            }}
        >
            {content}
        </View>
    );
};

export default ContentCell;
