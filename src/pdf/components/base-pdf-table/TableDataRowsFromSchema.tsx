import { JSX } from "react";
import { TableSchema } from "../../../types/TableSchema";
import { DeepKeyOf } from "../../../types/DeepKeyOf";
import { resolveNestedValue } from "../../../utils/resolveNestedValue";
import { setNestedValue } from "../../lib/setNestedValue";
import { Style } from "@react-pdf/types";
import { TableRowFromSchema } from "../shared";

type GroupOptions<T> =
    | undefined
    | {
        groupBy: DeepKeyOf<T>;
        getGroupSummaryTitle: (groupValue: unknown) => string;
        computeGroupSummary: (groupRows: T[]) => Partial<T>;
    };

type TableDataRowsFromSchemaProps<T extends {}> = {
    data: T[],
    schemas: TableSchema<T>[],
    groupOptions?: GroupOptions<T>,
    cellsStyle?: Style
    textStyle?: Style
};

export const TableDataRowsFromSchema = <T extends {},>({
    data,
    schemas,
    cellsStyle,
    groupOptions,
    textStyle
}: TableDataRowsFromSchemaProps<T>) => {
    if (!groupOptions) {
        return (
            <>
                {data.map((r, i) => (
                    <TableRowFromSchema
                        key={i}
                        row={r}
                        textStyles={textStyle}
                        schemas={schemas}
                        cellsStyles={cellsStyle}
                    />
                ))}
            </>
        );
    }

    const { groupBy, getGroupSummaryTitle, computeGroupSummary } = groupOptions;

    const groups = data.reduce((acc, row) => {
        const groupValue = resolveNestedValue(row, groupBy);
        const key = String(groupValue);
        if (!acc[key]) acc[key] = [];
        acc[key].push(row);
        return acc;
    }, {} as Record<string, T[]>);

    let rowIdx = 0;
    const out: JSX.Element[] = [];

    Object.entries(groups).forEach(([gKey, rows]) => {
        rows.forEach((r) =>
            out.push(
                <TableRowFromSchema
                    key={rowIdx}
                    row={r}
                    schemas={schemas}
                    textStyles={textStyle}
                    cellsStyles={cellsStyle}
                />,
            ),
        );

        const summary = computeGroupSummary(rows);
        const firstKey = schemas[0].key;

        let rowWithTitle = summary as T;

        if (firstKey) {
            rowWithTitle = setNestedValue(
                { ...(summary as T) },
                firstKey,
                getGroupSummaryTitle(gKey)
            );
        }

        out.push(
            <TableRowFromSchema
                key={rowIdx}
                row={rowWithTitle}
                schemas={schemas}
                withoutBorders
                textStyles={textStyle}
                cellsStyles={cellsStyle}
            />,
        );
    });

    return <>{out}</>;
};
