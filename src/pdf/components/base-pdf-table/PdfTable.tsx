import { View } from '@react-pdf/renderer';
import { TableSchema } from '../../../types/TableSchema';
import { DeepKeyOf } from '../../../types/DeepKeyOf';
import { TableHeader } from '../shared';
import { TableDataRowsFromSchema } from './TableDataRowsFromSchema';
import { Style } from '@react-pdf/types';
import { baseTableStyles } from '../../baseTableStyles';
import { joinStyles } from '../../../utils/joinStyles';

export interface PdfTableStyles {
    tableViewStyle?: Style;
    headerCellStyle?: Style;
    headerTextStyle?: Style;
    contentCellStyle?: Style;
    contentTextStyle?: Style;
}

export interface PdfTableProps<T extends object> {
    tableSchema: TableSchema<T>[];
    tableData: T[];

    groupBy?: DeepKeyOf<T>;
    getGroupSummaryTitle?: (v: unknown) => string;
    computeGroupSummary?: (rows: T[]) => Partial<T>;

    headerHeight?: number;
    styles?: PdfTableStyles;
}

export const PdfTable = <T extends object>(props: PdfTableProps<T>) => {
    const hasGrouping =
        props.groupBy !== undefined &&
        props.getGroupSummaryTitle !== undefined &&
        props.computeGroupSummary !== undefined;

    const groupOptions = hasGrouping
        ? {
            groupBy: props.groupBy!,
            getGroupSummaryTitle: props.getGroupSummaryTitle!,
            computeGroupSummary: props.computeGroupSummary!,
        }
        : undefined;

    return (
        <View style={joinStyles(baseTableStyles.table, props.styles?.tableViewStyle)}>
            <TableHeader
                schemas={props.tableSchema}
                height={props.headerHeight}
                {...(props.styles?.headerCellStyle && {
                    headerCellStyle: props.styles.headerCellStyle,
                })}
                {...(props.styles?.headerTextStyle && {
                    textStyle: props.styles.headerTextStyle,
                })}
            />

            <TableDataRowsFromSchema
                data={props.tableData}
                schemas={props.tableSchema}
                groupOptions={groupOptions}
                cellsStyle={props.styles?.contentCellStyle}
                textStyle={props.styles?.contentTextStyle}
            />
        </View>
    );
};
