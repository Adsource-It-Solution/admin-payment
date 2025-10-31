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
import logo from "@/app/assets/logo-pdf.png";
import defaultSign from "@/app/assets/signature.jpg";

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
  headSign?: string;
  advisorSign?: string;
}

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
  logo: {
    width: 400,
    height: 80,
    alignSelf: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    color: "#0E1F47",
    textTransform: "uppercase",
    fontWeight: "bold",
    marginTop: 10,
  },
  medalContainer: {
    marginTop: 10,
  },
  medal: {
    width: 60,
    height: 60,
    alignSelf: "center",
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
    width: "100%",
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
    width: "40%",
  },
  signatureImage: {
    width: 100,
    height: 50,
    objectFit: "contain",
    alignSelf: "center",
    marginBottom: 4,
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
  headSign,
  advisorSign,
}: CertificatePDFProps) => (
  <Document>
    <Page size="A4" orientation="landscape" style={styles.page}>
      <View style={styles.border}>
        {/* Corners & Decorations */}
        <Image src={corner} style={styles.cornerTL} />
        <Image src={corner} style={styles.cornerTR} />
        <Image src={bottomimage} style={styles.bottomImage} />

        {/* Header */}
        <Image src={logo.src} style={styles.logo} />
        <Text style={styles.title}>{title}</Text>

        {/* Medal */}
        <View style={styles.medalContainer}>
          <Image src={medal} style={styles.medal} />
        </View>

        {/* Recipient */}
        <Text style={styles.presented}>Presented to</Text>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.description}>{description}</Text>

        {/* Signatures */}
        <View style={styles.footer}>
          {/* Leader */}
          <View style={styles.signatureBlock}>
            <Image
              src={headSign || defaultSign.src}
              style={styles.signatureImage}
            />
            <Text style={styles.signatureName}>{leaderName}</Text>
            <Text style={styles.signatureTitle}>{leaderTitle}</Text>
          </View>

          {/* Advisor */}
          <View style={styles.signatureBlock}>
            <Image
              src={advisorSign || defaultSign.src}
              style={styles.signatureImage}
            />
            <Text style={styles.signatureName}>{advisorName}</Text>
            <Text style={styles.signatureTitle}>{advisorTitle}</Text>
          </View>
        </View>
      </View>
    </Page>
  </Document>
);
