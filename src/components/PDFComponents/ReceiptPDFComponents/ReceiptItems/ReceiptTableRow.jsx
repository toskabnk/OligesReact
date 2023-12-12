import React, {Fragment} from 'react';
import {Text, View, StyleSheet } from '@react-pdf/renderer';

const borderColor = '#a7bb9a'
const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        borderBottomColor: '#a7bb9a',
        borderBottomWidth: 1,
        alignItems: 'center',
        height: 24,
        fontStyle: 'bold',
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


const ReceiptTableRow = ({weights}) => {
    const rows = weights.map( weight => 
        <View style={styles.row} key={weight.id}>
            <Text style={styles.type}>{weight.type}</Text>
            <Text style={styles.kilos}>{weight.kilos}</Text>
            <Text style={styles.sampling}>{weight.sampling}</Text>
            <Text style={styles.purple}>{weight.purple_percentage}</Text>
            <Text style={styles.rehu}>{weight.rehu_percentage}</Text>
            <Text style={styles.leaves}>{weight.leaves_percentage}</Text>
        </View>
    )
    return (<Fragment>{rows}</Fragment> )
};
  
export default ReceiptTableRow