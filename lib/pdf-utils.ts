import { UserData } from '@/types/user';

export const generatePDFContent = (data: UserData) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>User Details PDF</title>
        <style>
          body {
            font-family: 'Arial', sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 40px 20px;
            line-height: 1.6;
            color: #333;
          }
          .header {
            text-align: center;
            margin-bottom: 40px;
            border-bottom: 3px solid #2563eb;
            padding-bottom: 20px;
          }
          .header h1 {
            color: #2563eb;
            margin: 0;
            font-size: 2.5em;
            font-weight: bold;
          }
          .header p {
            color: #64748b;
            margin: 10px 0 0 0;
            font-size: 1.1em;
          }
          .content {
            background: #f8fafc;
            padding: 30px;
            border-radius: 12px;
            margin: 20px 0;
          }
          .field {
            margin-bottom: 25px;
            padding: 15px;
            background: white;
            border-radius: 8px;
            border-left: 4px solid #2563eb;
          }
          .field-label {
            font-weight: bold;
            color: #1e293b;
            font-size: 1.1em;
            margin-bottom: 8px;
            display: block;
          }
          .field-value {
            color: #475569;
            font-size: 1em;
            white-space: pre-wrap;
            word-wrap: break-word;
          }
          .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #e2e8f0;
            color: #64748b;
            font-size: 0.9em;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>User Profile</h1>
          <p>Generated on ${new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</p>
        </div>
        
        <div class="content">
          <div class="field">
            <span class="field-label">Full Name</span>
            <div class="field-value">${data.name}</div>
          </div>
          
          <div class="field">
            <span class="field-label">Email Address</span>
            <div class="field-value">${data.email}</div>
          </div>
          
          <div class="field">
            <span class="field-label">Phone Number</span>
            <div class="field-value">${data.phone}</div>
          </div>
          
          ${data.position ? `
          <div class="field">
            <span class="field-label">Position</span>
            <div class="field-value">${data.position}</div>
          </div>
          ` : ''}
          
          ${data.description ? `
          <div class="field">
            <span class="field-label">Description</span>
            <div class="field-value">${data.description}</div>
          </div>
          ` : ''}
        </div>
        
      </body>
    </html>
  `;
};

export const downloadPDF = (data: UserData) => {
  const htmlContent = generatePDFContent(data);
  const printWindow = window.open('', '_blank');
  
  if (printWindow) {
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    printWindow.onload = () => {
      printWindow.print();
      setTimeout(() => {
        printWindow.close();
      }, 1000);
    };
  }
};