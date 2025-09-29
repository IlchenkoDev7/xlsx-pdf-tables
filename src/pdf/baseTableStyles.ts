import { StyleSheet } from "@react-pdf/renderer";

export const baseTableStyles = StyleSheet.create({
    table: {
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: 'black',
        width: '100%',
    },

    tableCell: {
        fontSize: 10,
        paddingVertical: 2,
        paddingHorizontal: 2,
        minHeight: 13
    },

    tableHeader: {
        fontSize: 10,
        fontWeight: 500,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        paddingVertical: 2,
    },
});
