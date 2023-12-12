import React, {Fragment} from 'react';
import {Text, View, StyleSheet } from '@react-pdf/renderer';

const borderColor = '#90e5fc'
const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        borderBottomColor: '#bff0fd',
        borderBottomWidth: 1,
        alignItems: 'center',
        height: 24,
        fontStyle: 'bold',
        color: 'white'
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

const ReceiptTableBlankSpace = ({rowsCount}) => {
    const blankRows = Array(rowsCount).fill(0)
    const rows = blankRows.map( (x, i) => 
        <View style={styles.row} key={`BR${i}`}>
            <Text style={styles.type}></Text>
            <Text style={styles.kilos}></Text>
            <Text style={styles.sampling}></Text>
            <Text style={styles.purple}></Text>
            <Text style={styles.rehu}></Text>
            <Text style={styles.leaves}></Text>
        </View>
    )
    return (<Fragment>{rows}</Fragment> )
};
  
export default ReceiptTableBlankSpace