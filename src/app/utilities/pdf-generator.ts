import { Candidate } from '../models/candidate';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

pdfMake.vfs = pdfFonts.vfs;

export class PdfGenerator {
  static generatePDF() {
    let docDefinition = {
      header: 'C#Corner PDF Header',
      content:
        'Sample PDF generated with Angular and PDFMake for C#Corner Blog',
    };
    pdfMake.createPdf(docDefinition, pdfFonts).open();
  }
}

export function generateCandidateInvoicePdf(candidate: Candidate) {
  const docDefinition: any = generateInvoicePDF(candidate);
  pdfMake.createPdf(docDefinition).open();
}

function generateInvoicePDF(data: any) {
  const logoBase64 =
    'data:image/png;base64,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';
  const { firstName, address, phone, email, payments, courseInfo } = data;

  // Helper to match courseInfo by courseId
  const getCourseDetails = (courseId: any) =>
    courseInfo.find((c: { id: any }) => c.id === courseId) || {};

  const courseLinkedPayments = payments.filter((p: any) =>
    courseInfo.some((c: any) => c.id === p.courseId)
  );
  // Build payment rows
  const paymentRows = payments.map(
    (p: { courseId: any; term: any; amount: any; date: string }) => {
      const courseDetails = getCourseDetails(p.courseId);
      const description = p.term
        ? courseDetails.course || p.courseId
        : p.courseId;
      const term = p.term || p.courseId;
      const proficiency = p.term ? courseDetails.proficiency || '' : '';
      const paymentDate = new Date(p.date).toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
      });
      return [description, proficiency, term, `₹ ${p.amount}`, paymentDate];
    }
  );

  // Calculate total paid and balance
  const totalPaid = courseLinkedPayments.reduce(
    (sum: number, p: any) => sum + p.amount,
    0
  );

  // Get total course fee for matched courseInfo
  const totalCourseFee = courseLinkedPayments.reduce((sum: number, p: any) => {
    const course = getCourseDetails(p.courseId);
    return sum + (course.courseFee || 0);
  }, 0);

  const remainingBalance = totalCourseFee - totalPaid;

  return {
    content: [
      {
        image: logoBase64, // Add the logo here
        width: 60, // Adjust the width
        alignment: 'center', // Center the logo
        margin: [0, 0, 0, 20], // Add some margin below the logo
      },
      {
        text: 'KimAham The School of Indian Classical Dance',
        style: 'header',
        alignment: 'center',
      },
      {
        text: 'Kuchipudi & Bharatanatyam',
        style: 'subheader',
        alignment: 'center',
        margin: [0, 0, 0, 20],
      },
      {
        text: 'Fees Acknowledgment',
        style: 'title',
        alignment: 'center',
        margin: [0, 0, 0, 20],
      },

      {
        columns: [
          { text: 'Issued to:', bold: true },
          {
            text: `Invoice Date: ${new Date().toLocaleDateString()}`,
            alignment: 'right',
          },
        ],
      },
      { text: `Name: ${firstName}`, margin: [0, 10, 0, 5] },
      { text: `Contact Details: ${email}, ${phone}`, margin: [0, 0, 0, 5] },
      { text: `Address: ${address}`, margin: [0, 0, 0, 20] },

      { text: 'Receipt Details', style: 'subheader', margin: [0, 0, 0, 10] },

      {
        table: {
          widths: ['20%', '20%', '20%', '15%', '25%'],
          body: [
            [
              { text: 'Description', style: 'tableHeader' },
              { text: 'Proficiency', style: 'tableHeader' },
              { text: 'Terms/Annual day/Arangetram', style: 'tableHeader' },
              { text: 'Amount Paid', style: 'tableHeader' },
              { text: 'Payment Date', style: 'tableHeader' },
            ],
            ...paymentRows,
          ],
        },
        layout: 'grid',
        margin: [0, 0, 0, 10],
      },

      {
        table: {
          widths: ['*', '*'],
          body: [
            [
              {
                text: `Total Paid: ₹ ${totalPaid}`,
                alignment: 'left',
                bold: true,
              },
              {
                text: `Remaining Balance: ₹ ${remainingBalance}`,
                alignment: 'right',
                bold: true,
              },
            ],
          ],
        },
        layout: 'noBorders',
        margin: [0, 10, 0, 20],
      },

      {
        text: `KimAham School of Dance\n#173, First floor, Thubarahalli, Bengaluru, Karnataka 560066, India`,
        style: 'footer',
        alignment: 'center',
        margin: [0, 10],
      },

      {
        text: `Thank you for your payment. For any questions or additional assistance, please contact us at email: kimaham2014@gmail.com Phone: +91 97420 93674`,
        alignment: 'center',
        fontSize: 10,
        margin: [0, 10],
      },
    ],

    styles: {
      header: { fontSize: 16, bold: true, color: '#7c1316' },
      subheader: {
        fontSize: 10,
        bold: false,
        alignment: 'center',
        color: 'lightgrey',
      },
      title: { fontSize: 14, bold: true, decoration: 'underline' },
      tableHeader: { bold: true, fillColor: '#eeeeee' },
      footer: { fontSize: 10, italics: true },
    },
  };
}
