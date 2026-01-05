// Use browser's native print API for text-selectable PDFs
// This is the most reliable way to get text-selectable PDFs from HTML
export const exportToPDF = async (elementId: string, filename: string = 'resume.pdf') => {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('Resume element not found');
  }

  // Get the resume page element
  const resumePage = element.querySelector('.resume-page') as HTMLElement;
  
  if (!resumePage) {
    throw new Error('Resume page not found');
  }

  // Create a hidden iframe for printing
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  document.body.appendChild(iframe);

  // Clone the resume page with all styles
  const clonedContent = resumePage.cloneNode(true) as HTMLElement;
  
  // Get computed styles
  const computedStyles = getComputedStyle(resumePage);
  
  // Create the print document
  const printDoc = iframe.contentDocument || iframe.contentWindow?.document;
  if (!printDoc) {
    document.body.removeChild(iframe);
    throw new Error('Failed to create print document');
  }

  printDoc.open();
  printDoc.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>${filename}</title>
        <style>
          @page {
            size: letter;
            margin: 0;
          }
          
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            margin: 0;
            padding: 0;
            background: white;
            font-family: ${computedStyles.fontFamily};
            font-size: ${computedStyles.fontSize};
            color: #000;
            line-height: 1.4;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          
          .resume-page {
            width: 8.5in;
            min-height: 11in;
            padding: 0.5in;
            margin: 0;
            background: white;
            page-break-after: auto;
          }
          
          .resume-page ul,
          .resume-page ol {
            list-style-position: outside;
            padding-left: 20px;
          }
          
          .resume-page ul {
            list-style-type: disc;
          }
          
          .resume-page ol {
            list-style-type: decimal;
          }
          
          .resume-page a {
            color: #2563eb;
            text-decoration: underline;
          }
          
          @media print {
            body {
              margin: 0;
              padding: 0;
            }
            
            .resume-page {
              margin: 0;
              box-shadow: none;
            }
          }
        </style>
      </head>
      <body>
        ${clonedContent.outerHTML}
      </body>
    </html>
  `);
  printDoc.close();

  // Wait for content to load, then trigger print
  iframe.onload = () => {
    setTimeout(() => {
      iframe.contentWindow?.print();
      // Clean up after print dialog is shown
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 1000);
    }, 250);
  };

  // Trigger load if already loaded
  if (iframe.contentDocument?.readyState === 'complete') {
    iframe.onload = null;
    setTimeout(() => {
      iframe.contentWindow?.print();
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 1000);
    }, 250);
  }
};
