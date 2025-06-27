import { View } from "@react-pdf/renderer";
import { TableSchema } from "../../../../types/TableSchema";
import { Style } from "@react-pdf/types";
import { TableCellFromSchema } from "../cells/TableCellFromSchema";

type TableRowFromSchemaProps<T extends {}> = {
    row: T;
    schemas: TableSchema<T>[];
    withoutBorders?: boolean;
    cellsStyles?: Style
    textStyles?: Style
};

export const TableRowFromSchema = <T extends {},>({
    row,
    schemas,
    withoutBorders,
    cellsStyles,
    textStyles
}: TableRowFromSchemaProps<T>) => (
    <View style={{ flexDirection: 'row', width: '100%' }}>
        {schemas.map((s, i) => (
            <TableCellFromSchema
                key={i}
                row={row}
                schema={s}
                borders={withoutBorders ? 'none' : 'all'}
                cellStyle={cellsStyles}
                textStyle={textStyles}
            />
        ))}
    </View>
);
