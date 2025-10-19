"use client";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

// 🧩 Register font (optional)
Font.register({
  family: "Poppins",
  fonts: [
    {
      src: "https://fonts.gstatic.com/s/poppins/v15/pxiEyp8kv8JHgFVrJJfecg.woff2",
    },
  ],
});

// 🎨 Styles
const styles = StyleSheet.create({
  page: {
    backgroundColor: "#faf1e6",
    padding: 20,
    fontFamily: "Poppins",
    fontSize: 11,
    color: "#333",
  },
  header: {
    backgroundColor: "#e53935",
    color: "#fff",
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    borderRadius: 4,
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
  },
  contactRight: {
    textAlign: "right",
    fontSize: 10,
  },
  section: {
    marginTop: 15,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#b71c1c",
    marginBottom: 6,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
  infoLabel: {
    width: 80,
    fontWeight: "bold",
  },
  table: {
    display: "flex",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#e57373",
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableColHeader: {
    width: "25%",
    borderStyle: "solid",
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderColor: "#e57373",
    backgroundColor: "#ffebee",
    padding: 4,
    textAlign: "center",
    fontWeight: "bold",
  },
  tableCol: {
    width: "25%",
    borderStyle: "solid",
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderColor: "#e57373",
    padding: 4,
  },
  paymentBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  totalBox: {
    textAlign: "right",
  },
  totalText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#e53935",
  },
  smallText: {
    fontSize: 10,
    marginTop: 4,
  },
});

// 🧾 Receipt PDF Component
export default function ReceiptPDFDocument({
  name = "",
  contact = "",
  address = "",
  itemDescription = "",
  quantity = "",
  unitPrice = "",
  totalAmount = "",
  paymentMethod = "",
  transactionID = "",
  date = "",
}: {
  name?: string;
  contact?: string;
  address?: string;
  itemDescription?: string;
  quantity?: string | number; 
  unitPrice?: string;
  totalAmount?: string;
  paymentMethod?: string;
  transactionID?: string;
  date?: string;
}) {
  const formatDate = (d: string) =>
    d
      ? new Date(d).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
      : "";

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* 🔺 Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Payment Receipt Invoice</Text>
          <View style={styles.contactRight}>
            <Text></Text>
            <Text></Text>
          </View>
        </View>

        {/* 👤 Customer Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Customer Info</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Name:</Text>
            <Text>{String(name ?? "")}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Contact:</Text>
            <Text>{String(contact ?? "")}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Address:</Text>
            <Text>{String(address ?? "")}</Text>
          </View>
        </View>

        {/* 🧾 Description Table */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={styles.tableColHeader}>Description</Text>
              <Text style={styles.tableColHeader}>Qty</Text>
              <Text style={styles.tableColHeader}>Unit Price</Text>
              <Text style={styles.tableColHeader}>Amount</Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={[styles.tableCol, { width: "40%" }]}>
                {String(itemDescription ?? "")}
              </Text>
              <Text
                style={[styles.tableCol, { width: "15%", textAlign: "center" }]}
              >
                {String(quantity ?? "")}
              </Text>
              <Text
                style={[styles.tableCol, { width: "20%", textAlign: "center" }]}
              >
                ₹ {String(unitPrice ?? "")}
              </Text>
              <Text
                style={[styles.tableCol, { width: "25%", textAlign: "center" }]}
              >
                ₹ {String(totalAmount ?? "")}
              </Text>
            </View>
          </View>
        </View>

        {/* 💳 Payment Info */}
        <View style={styles.paymentBox}>
          <View>
            <Text style={styles.sectionTitle}>Payment Details</Text>
            <Text>
              <Text style={{ fontWeight: "bold" }}>Method:</Text>{" "}
              {String(paymentMethod ?? "")}
            </Text>
            <Text>
              <Text style={{ fontWeight: "bold" }}>Transaction ID:</Text>{" "}
              {String(transactionID ?? "")}
            </Text>
          </View>

          <View style={styles.totalBox}>
            <Text style={styles.totalText}>Total Paid</Text>
            <Text
              style={{ fontSize: 16, fontWeight: "bold", color: "#e53935" }}
            >
              ₹ {String(totalAmount ?? "")}
            </Text>
          </View>
        </View>

        {/* 📅 Footer */}
        <View style={styles.section}>
          <Text style={styles.smallText}>
            Subscription valid until{" "}
            <Text style={{ fontWeight: "bold" }}>{formatDate(date)}</Text>.
          </Text>
          <Text style={styles.smallText}>
            For support: <Text style={{ fontWeight: "bold" }}></Text> |
          </Text>
        </View>
      </Page>
    </Document>
  );
}
