import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// Format date for display
export const formatDate = (date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
  const day = date.getDate().toString().padStart(2, '0');
  return `${day}-${month}-${year}`;
};

// Format invoice date
export const formatInvoiceDate = (timestamp) => {
  const date = new Date(timestamp);
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
};

// Capture content for PDF generation
export const captureContent = async () => {
  const content = document.querySelector('.flex-column-container'); // Target the flex container
  if (!content) {
    console.error('Could not find flex-column-container');
    return null;
  }
  const canvas = await html2canvas(content, { useCORS: true, scrollY: 0 });
  const image = canvas.toDataURL('image/png');
  return image;
};

// Convert captured content to PDF
export const convertToPDF = async (activeTab) => {
  // Add a class to the element for PDF styling
  document.getElementById('invoice').classList.add('generating-pdf');
  
  const image = await captureContent();
  const pdf = new jsPDF('p', 'mm', [210, 267]); // Width and height in millimeters (mm)
  pdf.addImage(image, 'PNG', 10, 10, 190, 0);
  pdf.save(`invoice_${activeTab}_${new Date().toISOString().slice(0,10)}.pdf`);
  
  // Remove the class after generating
  document.getElementById('invoice').classList.remove('generating-pdf');
};

// Generate PDF for a specific invoice
export const generateInvoicePDF = (invoice, formatInvoiceDate) => {
  const element = document.querySelector('.invoice-content > div');
  if (!element) return;

  // Add a class for PDF styling
  element.classList.add('generating-pdf');

  // Create filename based on invoice details
  const invoiceType = invoice.invoiceType === 'purchase' ? 'purchase' : 'return';
  const invoiceNumber = invoice.invoiceNumber || invoice._id;
  const dateStr = formatInvoiceDate(invoice.timestamp).replace(/\//g, '-');
  const filename = `${invoiceType}-invoice-${invoiceNumber}-${dateStr}.pdf`;

  html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false
  }).then(canvas => {
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 295; // A4 height in mm
    const imgHeight = canvas.height * imgWidth / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(filename);
    
    // Remove the class after PDF generation
    element.classList.remove('generating-pdf');
  });
};