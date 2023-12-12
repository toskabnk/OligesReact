import React from 'react';
import {Text, View, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
   
    titleContainer:{
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 12
    },
    logo: {
        width: 84,
        height: 66,
        marginLeft: 'auto',
        marginRight: 'auto'
    },
    signsColumn: {
        flexDirection: 'column',
        marginLeft: 'auto',
        marginRight: 'auto',
    }
  });


  const Signs = ({receipt}) => {
    const cooperativeSign = receipt.cooperative.cooperative_sign;
    const existsCooperativeSign = cooperativeSign !== null && cooperativeSign !== undefined && cooperativeSign !== '';

    return (
        <View style={styles.titleContainer}>
            <View style={styles.signsColumn}>
                <Text>Farmer sign</Text>
                <Image style={styles.logo} src={receipt.sign} />
            </View>
            <View style={styles.signsColumn}>
                <Text>Cooperative sign</Text>
                {existsCooperativeSign && <Image style={styles.logo} src={cooperativeSign} />}
            </View>
        </View>
    )
};
  
  export default Signs