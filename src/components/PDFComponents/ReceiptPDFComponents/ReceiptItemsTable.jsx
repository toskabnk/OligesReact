import React from 'react';
import {View, StyleSheet } from '@react-pdf/renderer';
import ReceiptTableHeader from './ReceiptItems/ReceiptTableHeader';
import ReceiptTableRow from './ReceiptItems/ReceiptTableRow';
import ReceiptTableBlankSpace from './ReceiptItems/ReceiptTableBlankSpace';

const tableRowsCount = 10;

const styles = StyleSheet.create({
    tableContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 24,
        borderWidth: 1,
        borderColor: '#a7bb9a',
    },
});

  const ReceiptItemsTable = ({receipt}) => (
    <View style={styles.tableContainer}>
        <ReceiptTableHeader />
        <ReceiptTableRow weights={receipt.weights} />
        <ReceiptTableBlankSpace rowsCount={ tableRowsCount - receipt.weights.length} />
    </View>
  );
  
  export default ReceiptItemsTable