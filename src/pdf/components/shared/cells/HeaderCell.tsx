import { Text, View } from "@react-pdf/renderer"
import { baseTableStyles } from "../../../baseTableStyles"
import { Style } from "@react-pdf/types";

interface HeaderItemProps {
    pdfPercent: number | undefined,
    label: string
    headerCellStyle?: Style
    textStyle?: Style
}

export const HeaderCell = ({ pdfPercent, label, headerCellStyle, textStyle }: HeaderItemProps) => {
    if (!pdfPercent) throw new Error("Не указан процент ширины столбца")

    return (
        <View
            style={{
                ...baseTableStyles.tableHeader,
                ...headerCellStyle,
                width: `${pdfPercent}%`,
                border: '1px solid black',
                height: '100%'
            }}
        >
            <Text style={textStyle}>{label}</Text>
        </View>
    )
}
