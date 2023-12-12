import React, { Fragment } from 'react';
import {Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    invoiceContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    invoiceDataContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    invoiceDate: {
        fontSize: 12,
        fontStyle: 'bold',
    },
    label: {
        width: 80,
        fontSize: 12,
        fontStyle: 'bold',
    },
    labelW: {
        fontSize: 12,
        fontStyle: 'bold',
    }
  });


  const ReceiptNo = ({receipt}) => {
    const farmer = receipt.farmer;
    const farmAddr = receipt.farm.address;

    const dateWithoutTime = receipt.date.split(' ')[0];

    return (
        <Fragment>
            <View style={styles.invoiceContainer}>
                <Text style={styles.labelW}>Albaran Nº:</Text>
                <Text style={styles.invoiceDate}>{receipt.albaran_number}</Text>
            </View>
            <View style={styles.invoiceContainer}>
                <Text style={styles.labelW}>Date:</Text>
                <Text style={styles.invoiceDate}>{dateWithoutTime}</Text>
            </View>
            <View style={styles.invoiceDataContainer}>
                <View style={styles.invoiceContainer}>
                    <Text style={styles.label}>Farmer: </Text>
                    <Text >{receipt.farmer.name + ' ' + receipt.farmer.surname}</Text>
                </View>
                <View style={styles.invoiceContainer}>
                    <Text >{receipt.cooperative.name}</Text>
                </View>
            </View >
            <View style={styles.invoiceDataContainer}>
                <View style={styles.invoiceContainer}>
                    <Text style={styles.label}>DNI: </Text>
                    <Text >{receipt.farmer.dni}</Text>
                </View>
                <View style={styles.invoiceContainer}>
                    <Text style={styles.labelW}>NIF: </Text>
                    <Text >{receipt.cooperative.nif}</Text>
                </View>
            </View >
            <View style={styles.invoiceDataContainer}>
                <View style={styles.invoiceContainer}>
                    <Text style={styles.label}>Address: </Text>
                    <Text >{farmer?.address.road_type} {farmer?.address.road_name} {farmer?.address.road_number} 
                        {farmer?.address.road_letter} {farmer?.address.road_km} {farmer?.address.block} 
                        {farmer?.address.portal} {farmer?.address.stair} {farmer?.address.floor} 
                        {farmer?.address.door} {farmer?.address.town_entity} {farmer?.address.town_name} {' '}
                        {farmer?.address.province} {farmer?.address.country} {farmer?.address.postal_code}</Text>
                </View>
            </View >
            <View style={styles.invoiceDataContainer}>
                <View style={styles.invoiceContainer}>
                    <Text style={styles.label}>Farm: </Text>
                    <Text >{receipt.farm.name + ' Polygon: ' + receipt.farm.polygon + ' Plot: ' + receipt.farm.plot}</Text>
                </View>
                <View style={styles.invoiceContainer}>
                    <Text style={styles.labelW}>Campaign: </Text>
                    <Text >{receipt.campaign}</Text>
                </View>
            </View >
            <View style={styles.invoiceDataContainer}>
                <View style={styles.invoiceContainer}>
                    <Text style={styles.label}>Farm address: </Text>
                    <Text >{farmAddr?.road_type} {farmAddr?.road_name} {farmAddr?.road_number} 
                        {farmAddr?.road_letter} {farmAddr?.road_km} {farmAddr?.block} 
                        {farmAddr?.portal} {farmAddr?.stair} {farmAddr?.floor} 
                        {farmAddr?.door} {farmAddr?.town_entity} {farmAddr?.town_name} {' '}
                        {farmAddr?.province} {farmAddr?.country} {farmAddr?.postal_code}</Text>
                </View>
            </View >
        </Fragment>
    )
};
  
  export default ReceiptNo