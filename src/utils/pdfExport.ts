
// @ts-ignore
import jsPDF from 'jspdf';

export const exportToPDF = (content: string, title: string = 'AI Generated Content') => {
  const doc = new jsPDF();
  
  // Set up the document
  doc.setFontSize(16);
  doc.text(title, 20, 20);
  
  // Add timestamp
  const timestamp = new Date().toLocaleString();
  doc.setFontSize(10);
  doc.text(`Generated on: ${timestamp}`, 20, 30);
  
  // Add content
  doc.setFontSize(12);
  
  // Split content into lines that fit the page width
  const lines = doc.splitTextToSize(content, 170);
  let yPosition = 45;
  
  lines.forEach((line: string) => {
    if (yPosition > 280) { // If near bottom of page, add new page
      doc.addPage();
      yPosition = 20;
    }
    doc.text(line, 20, yPosition);
    yPosition += 7;
  });
  
  // Save the PDF
  const filename = `${title.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.pdf`;
  doc.save(filename);
};
