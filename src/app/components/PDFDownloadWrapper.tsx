"use client";

import { PDFDownloadLink } from "@react-pdf/renderer";
import React from "react";

interface PDFDownloadWrapperProps {
  document: React.ReactElement<any>;
  fileName?: string;
  children?: (props: { loading: boolean }) => React.ReactNode;
}

// Universal pdf wrapper 
export default function PDFDownloadWrapper({
  document,
  fileName = "document.pdf",
  children,
}: PDFDownloadWrapperProps) {
  return (
    <PDFDownloadLink document={document} fileName={fileName}>
      {({ loading }) =>
        children ? children({ loading }) : loading ? "Preparing PDF..." : "Download PDF"
      }
    </PDFDownloadLink>
  );
}
