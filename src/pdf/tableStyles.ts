import { StyleSheet } from "@react-pdf/renderer";

export const tableStyles = StyleSheet.create({
    table: {
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: 'black',
        width: '100%',
    },

    tableCol: {
        borderStyle: 'solid',
        borderColor: 'black'
    },

    tableRow: {
        flexDirection: 'row',
    },

    tableCell: {
        fontSize: 10,
        paddingVertical: 2,
        paddingHorizontal: 1,
        minHeight: 13
    },

    tableHeader: {
        fontSize: 10,
        fontWeight: 400,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 'auto',
        marginBottom: 'auto',
        textAlign: 'center',
        paddingVertical: 2,
    },
});