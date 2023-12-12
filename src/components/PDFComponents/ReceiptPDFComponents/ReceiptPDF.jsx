
import React from 'react';
import { Page, Document, Image, StyleSheet } from '@react-pdf/renderer';
import ReceiptTitle from './ReceiptTitle';
import ReceiptNo from './ReceiptNo';
import ReceiptItemsTable from './ReceiptItemsTable';
import Signs from './Signs';


const styles = StyleSheet.create({
    page: {
        fontFamily: 'Helvetica',
        fontSize: 11,
        paddingTop: 30,
        paddingLeft:60,
        paddingRight:60,
        lineHeight: 1.5,
        flexDirection: 'column',
    }, 
    logo: {
        width: 84,
        height: 66,
        marginLeft: 'auto',
        marginRight: 'auto'
    }
  });
  
  const ReceiptPDF = ({receipt}) => (
            <Document>
                <Page size="A4" style={styles.page}>
                    <Image style={styles.logo} src={'https://i.postimg.cc/WbCWK6gD/oliges-logo-only-1.png'} />
                    <ReceiptTitle title='Receipt'/>
                    <ReceiptNo receipt={receipt}/>
                    <ReceiptItemsTable receipt={receipt} />
                    <Signs receipt={receipt}/>
                </Page>
            </Document>
        );
  
  export default ReceiptPDF