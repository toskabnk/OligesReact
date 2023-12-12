import React from 'react';
import {Text, View, StyleSheet } from '@react-pdf/renderer';
import { useTheme } from '@mui/material/styles';

const ReceiptTitle = ({title}) => {
    const theme = useTheme();

    const styles = StyleSheet.create({
   
        titleContainer:{
            flexDirection: 'row',
            marginTop: 24,
            justifyContent: 'center',
        },
        reportTitle:{
            color: theme.palette.success.main,
            letterSpacing: 4,
            fontSize: 25,
            textAlign: 'center',
            textTransform: 'uppercase',
        }
    });

    return (
        <View style={styles.titleContainer}>
            <Text style={styles.reportTitle}>{title}</Text>
        </View>
    )
};
  
export default ReceiptTitle