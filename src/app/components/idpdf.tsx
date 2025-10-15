"use client"
import React from "react";
import {
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  Document,
} from "@react-pdf/renderer";

// 🎨 PDF Styles (equivalent to your Tailwind design)
const styles = StyleSheet.create({
  page: {
    backgroundColor: "#ffffff",
    padding: 20,
    alignItems: "center",
  },
  card: {
    width: 350,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#d1d5db",
    overflow: "hidden",
  },
  topBar: {
    height: 25,
    backgroundColor: "#F4B740",
  },
  blueBar: {
    height: 25,
    backgroundColor: "#0E1F47",
  },
  content: {
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  left: {
    width: "60%",
  },
  right: {
    width: "40%",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: 700,
    color: "#0E1F47",
    marginBottom: 8,
  },
  label: {
    fontSize: 10,
    fontWeight: 600,
    color: "#0E1F47",
    marginBottom: 2,
  },
  value: {
    fontSize: 10,
    color: "#111827",
    marginBottom: 6,
  },
  photoBox: {
    width: 100,
    height: 130,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#5A8DBE",
    marginBottom: 10,
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  role: {
    fontSize: 14,
    fontWeight: 700,
    color: "#0E1F47",
    marginTop: 5,
  },
  bottomId: {
    textAlign: "center",
    fontSize: 12,
    fontWeight: 600,
    color: "#0E1F47",
    marginVertical: 8,
  },
});

// 📄 The main PDF component
export const IDCardPDF = ({
  name = "Full Name",
  phone = "9999999999",
  email = "youremail@gmail.com",
  DOB = "01/01/2000",
  address = "123 Anywhere St., Any City",
  role = "Manager",
  idNumber = "IDXXXX000XXX",
  imageUrl = "https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&w=400&q=80",
}) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.card}>
        <View style={styles.topBar} />
        <View style={styles.content}>
          {/* Left Section */}
          <View style={styles.left}>
            <Text style={styles.title}>Employee ID</Text>
            <View>
              <Text style={styles.label}>NAME</Text>
              <Text style={styles.value}>{name}</Text>

              <Text style={styles.label}>PHONE NO.</Text>
              <Text style={styles.value}>{phone}</Text>

              <Text style={styles.label}>E-MAIL</Text>
              <Text style={styles.value}>{email}</Text>

              <Text style={styles.label}>D.O.B</Text>
              <Text style={styles.value}>{DOB}</Text>

              <Text style={styles.label}>ADDRESS</Text>
              <Text style={styles.value}>{address}</Text>
            </View>

            <Text style={styles.role}>{role}</Text>
          </View>

          {/* Right Section */}
          <View style={styles.right}>
            <View style={styles.photoBox}>
              <Image src={imageUrl} style={styles.image} />
            </View>
          </View>
        </View>

        <Text style={styles.bottomId}>{idNumber}</Text>
        <View style={styles.blueBar} />
      </View>
    </Page>
  </Document>
);
