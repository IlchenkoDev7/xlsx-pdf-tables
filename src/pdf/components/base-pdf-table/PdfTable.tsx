import { View } from "@react-pdf/renderer";
import { Style } from "@react-pdf/types";

import { TableSchema } from "../../../types/TableSchema";
import { DeepKeyOf } from "../../../types/DeepKeyOf";

import { baseTableStyles } from "../../baseTableStyles";
import { joinStyles } from "../../../utils/joinStyles";
import { TableHeader } from "../shared";
import {
    TableDataRowsFromSchema,
    GroupOptions,
    GroupLevel
} from "./TableDataRowsFromSchema";

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
    groupOptions?: GroupOptions<T>;
    groupBy?: DeepKeyOf<T>;
    getGroupSummaryTitle?: (v: unknown) => string;
    computeGroupSummary?: (rows: T[]) => Partial<T>;
    headerHeight?: number;
    styles?: PdfTableStyles;
}

export const PdfTable = <T extends object>(
    props: PdfTableProps<T>
) => {
    const {
        tableSchema,
        tableData,
        headerHeight,
        styles,

        groupOptions,

        groupBy,
        getGroupSummaryTitle,
        computeGroupSummary
    } = props;

    const legacyHasGrouping =
        groupBy !== undefined &&
        getGroupSummaryTitle !== undefined &&
        computeGroupSummary !== undefined;

    const resolvedGroupOptions: GroupOptions<T> =
        groupOptions ??
        (legacyHasGrouping
            ? ({
                groupBy: groupBy!,
                getGroupSummaryTitle: getGroupSummaryTitle!,
                computeGroupSummary: computeGroupSummary!
            } as GroupLevel<T>)
            : undefined);

    return (
        <View style={joinStyles(baseTableStyles.table, styles?.tableViewStyle)}>
            <TableHeader
                schemas={tableSchema}
                height={headerHeight}
                {...(styles?.headerCellStyle && { headerCellStyle: styles.headerCellStyle })}
                {...(styles?.headerTextStyle && { textStyle: styles.headerTextStyle })}
            />

            <TableDataRowsFromSchema
                data={tableData}
                schemas={tableSchema}
                groupOptions={resolvedGroupOptions}
                cellsStyle={styles?.contentCellStyle}
                textStyle={styles?.contentTextStyle}
            />
        </View>
    );
};
