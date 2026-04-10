"use client";

import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 30, backgroundColor: '#FAFAFA' },
  header: { marginBottom: 20, borderBottom: '1px solid #C9A84C', paddingBottom: 10 },
  title: { fontSize: 24, paddingBottom: 5, color: '#1A1612' },
  subtitle: { fontSize: 12, color: '#666' },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  text: { fontSize: 12 },
  boldText: { fontSize: 12, fontWeight: 'bold' },
  itemsHeader: { flexDirection: 'row', borderBottom: '1px solid #CCC', paddingBottom: 5, marginTop: 20, marginBottom: 10 },
  itemRow: { flexDirection: 'row', marginBottom: 8 },
  colTitle: { flex: 2, fontSize: 11 },
  colQty: { flex: 1, fontSize: 11, textAlign: 'center' },
  colPrice: { flex: 1, fontSize: 11, textAlign: 'right' },
  totalRow: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 20, paddingTop: 10, borderTop: '2px solid #C9A84C' },
  totalText: { fontSize: 14, fontWeight: 'bold' }
});

const InvoiceDocument = ({ order, profile }: { order: any, profile: any }) => (
  <Document>
    <Page style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>HUNARMAND</Text>
        <Text style={styles.subtitle}>Authentic Kashmiri Heritage</Text>
      </View>
      
      <View style={styles.row}>
        <Text style={styles.boldText}>Invoice to:</Text>
        <Text style={styles.text}>Order ID: {order.id}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.text}>{profile?.name}</Text>
        <Text style={styles.text}>Date: {new Date(order.createdAt).toLocaleDateString()}</Text>
      </View>

      <View style={styles.itemsHeader}>
        <Text style={styles.colTitle}>Masterpiece</Text>
        <Text style={styles.colQty}>Quantity</Text>
        <Text style={styles.colPrice}>Amount</Text>
      </View>

      {order.items?.map((item: any) => (
        <View style={styles.itemRow} key={item.id}>
          <Text style={styles.colTitle}>{item.product?.title || 'Unknown Product'}</Text>
          <Text style={styles.colQty}>{item.quantity}</Text>
          <Text style={styles.colPrice}>₹{item.price}</Text>
        </View>
      ))}

      <View style={styles.totalRow}>
        <Text style={styles.totalText}>Total: ₹{order.totalAmount}</Text>
      </View>
    </Page>
  </Document>
);

export default function DownloadInvoiceButton({ order, profile }: { order: any, profile: any }) {
  return (
    <PDFDownloadLink 
      document={<InvoiceDocument order={order} profile={profile} />} 
      fileName={`Hunarmand_Invoice_${order.id.slice(-6)}.pdf`}
      className="bg-transparent border border-accent text-accent font-accent tracking-widest text-[0.65rem] uppercase px-4 py-2 hover:bg-accent hover:text-deep-black transition-all flex items-center justify-center whitespace-nowrap"
    >
      {/* @ts-ignore - PDFDownloadLink children type quirk */}
      {({ loading }) => (loading ? 'Generating...' : 'Download Invoice')}
    </PDFDownloadLink>
  );
}
