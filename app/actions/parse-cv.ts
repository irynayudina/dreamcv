"use server";

import { parseCVText } from "@/lib/pdf-parser";
import { CVData } from "@/lib/cv-schema";

export async function parseCVAction(formData: FormData): Promise<{ success: boolean; data?: CVData; error?: string }> {
  try {
    const file = formData.get("file") as File;
    if (!file) {
      return { success: false, error: "No file uploaded" };
    }

    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    // Dynamically import pdfjs-dist legacy build
    // @ts-ignore
    const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
    
    // In Node.js environment, we can skip the worker for simple text extraction
    // by not setting workerSrc/workerPort, or using a fake worker.
    // However, the legacy build usually works better with a direct import.

    // Load the PDF document
    const loadingTask = pdfjs.getDocument({
      data: uint8Array,
      useSystemFonts: true,
      disableFontFace: true,
    });
    
    const pdfDocument = await loadingTask.promise;
    let fullText = "";

    // Iterate through each page and extract text
    for (let i = 1; i <= pdfDocument.numPages; i++) {
      const page = await pdfDocument.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(" ");
      fullText += pageText + "\n";
    }
    
    const parsedData = parseCVText(fullText);

    return { success: true, data: parsedData };
  } catch (error: any) {
    console.error("PDF Parsing Error:", error);
    return { success: false, error: error.message || "Failed to parse PDF" };
  }
}
