// components/CertificatePDF.tsx
"use client";

import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";

interface CertificatePDFProps {
  name: string;
  title: string;
  description: string;
  leaderName: string;
  advisorName: string;
  leaderTitle: string;
  advisorTitle: string;
  medal: string;
  corner: string;
  bottomimage: string;
}

// 🎨 Styles mimic your Tailwind/HTML structure
const styles = StyleSheet.create({
  page: {
    backgroundColor: "#ffffff",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    padding: 30,
  },
  border: {
    borderWidth: 8,
    borderColor: "#0E1F47",
    borderRadius: 12,
    width: "100%",
    height: "100%",
    position: "relative",
    overflow: "hidden",
    padding: 30,
  },
  title: {
    fontSize: 28,
    color: "#0E1F47",
    textTransform: "uppercase",
    fontWeight: "bold",
    marginTop: 90,
  },
  presented: {
    fontSize: 16,
    color: "#555",
    marginTop: 10,
  },
  name: {
    fontSize: 26,
    color: "#0E1F47",
    fontWeight: "extrabold",
    marginTop: 8,
  },
  description: {
    fontSize: 14,
    color: "#333",
    width: "80%",
    marginHorizontal: "auto",
    marginTop: 16,
    lineHeight: 1.5,
  },
  medalContainer: {
    position: "absolute",
    top: 25,
    left: "50%",
    transform: "translateX(-50%)",
  },
  medal: {
    width: 60,
    height: 60,
  },
  cornerTL: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 80,
    height: 80,
  },
  cornerTR: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 80,
    height: 80,
    transform: "rotate(90deg)",
  },
  bottomImage: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: "100%"
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 70,
    width: "100%",
    paddingHorizontal: 50,
  },
  signatureBlock: {
    textAlign: "center",
  },
  signatureLine: {
    borderBottomWidth: 1,
    borderBottomColor: "#555",
    width: 120,
    marginBottom: 4,
    marginHorizontal: "auto",
  },
  signatureName: {
    fontSize: 10,
    fontWeight: "bold",
  },
  signatureTitle: {
    fontSize: 8,
    color: "#777",
  },
});

export const CertificatePDF = ({
  name,
  title,
  description,
  leaderName,
  advisorName,
  leaderTitle,
  advisorTitle,
  medal,
  corner,
  bottomimage,
}: CertificatePDFProps) => (
  <Document>
    <Page size="A4" orientation="landscape" style={styles.page}>
      <View style={styles.border}>
        {/* Corners & Decorations */}
        <Image src={corner}  style={styles.cornerTL} />
        <Image src={corner} style={styles.cornerTR} />
        <Image src={bottomimage} style={styles.bottomImage} />

        {/* Medal */}
        <View style={styles.medalContainer}>
          <Image src={medal} style={styles.medal} />
        </View>

        {/* Text */}
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.presented}>Presented to</Text>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.description}>{description}</Text>

        {/* Signatures */}
        <View style={styles.footer}>
          <View style={styles.signatureBlock}>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureName}>{leaderName}</Text>
            <Text style={styles.signatureTitle}>{leaderTitle}</Text>
          </View>
          <View style={styles.signatureBlock}>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureName}>{advisorName}</Text>
            <Text style={styles.signatureTitle}>{advisorTitle}</Text>
          </View>
        </View>
      </View>
    </Page>
  </Document>
);
