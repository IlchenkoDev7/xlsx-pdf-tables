import { Text, View } from "@react-pdf/renderer"
import { tableStyles } from "../tableStyles"

interface HeaderItemProps {
    pdfPercent: number | undefined,
    label: string
}

const HeaderItem = ({ pdfPercent, label }: HeaderItemProps) => {
    if (!pdfPercent) throw new Error("Не указан процент ширины столбца")

    return (
        <View
            style={{
                ...tableStyles.tableHeader,
                width: `${pdfPercent}%`,
                border: '1px solid black'
            }}
        >
            <Text>{label}</Text>
        </View>
    )
}

export default HeaderItem