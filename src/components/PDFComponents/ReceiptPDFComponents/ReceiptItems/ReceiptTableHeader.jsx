import React from 'react';
import {Text, View, StyleSheet } from '@react-pdf/renderer';

const borderColor = '#a7bb9a'
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        borderBottomColor: '##a7bb9a',
        backgroundColor: '#e6ebe0',
        borderBottomWidth: 1,
        alignItems: 'center',
        height: 24,
        textAlign: 'center',
        fontStyle: 'bold',
        flexGrow: 1,
    },
    type: {
        width: '20%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
    },
    kilos: {
        width: '20%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
    },
    sampling: {
        width: '15%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
    },
    purple: {
        width: '15%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
    },
    rehu: {
        width: '15%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
    },
    leaves: {
        width: '15%'
    },
  });

  const ReceiptTableHeader = () => (
    <View style={styles.container}>
        <Text style={styles.type}>Type</Text>
        <Text style={styles.kilos}>Kilos</Text>
        <Text style={styles.sampling}>Sampling</Text>
        <Text style={styles.purple}>Purple %</Text>
        <Text style={styles.rehu}>Rehu %</Text>
        <Text style={styles.leaves}>Leaves %</Text>
    </View>
  );
  
  export default ReceiptTableHeader