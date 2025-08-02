import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { UserData } from '@/types/user';

export const generateAndDownloadPDF = async (data: UserData, aiEnhancements?: {
  enhancedDescription?: string;
  professionalSummary?: string;
  suggestedSkills?: string[];
}) => {
  try {
    // Create a temporary div with the PDF content
    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    tempDiv.style.width = '800px';
    tempDiv.style.backgroundColor = 'white';
    tempDiv.style.padding = '40px';
    tempDiv.style.fontFamily = 'Arial, sans-serif';
    
    tempDiv.innerHTML = `
      <div style="max-width: 800px; margin: 0 auto; padding: 40px 20px; line-height: 1.6; color: #333;">
        <div style="text-align: center; margin-bottom: 40px; border-bottom: 3px solid #2563eb; padding-bottom: 20px;">
          <h1 style="color: #2563eb; margin: 0; font-size: 2.5em; font-weight: bold;">${data.name}</h1>
          <p style="color: #64748b; margin: 10px 0 0 0; font-size: 1.2em;">${data.position || 'Professional'}</p>
          <p style="color: #64748b; margin: 5px 0 0 0; font-size: 1em;">Generated on ${new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</p>
        </div>
        
        <div style="background: #f8fafc; padding: 30px; border-radius: 12px; margin: 20px 0;">
          <div style="margin-bottom: 25px; padding: 15px; background: white; border-radius: 8px; border-left: 4px solid #2563eb;">
            <span style="font-weight: bold; color: #1e293b; font-size: 1.1em; margin-bottom: 8px; display: block;">Contact Information</span>
            <div style="color: #475569; font-size: 1em;">
              <p style="margin: 5px 0;"><strong>Email:</strong> ${data.email}</p>
              <p style="margin: 5px 0;"><strong>Phone:</strong> ${data.phone}</p>
            </div>
          </div>
          
          ${aiEnhancements?.professionalSummary ? `
          <div style="margin-bottom: 25px; padding: 15px; background: white; border-radius: 8px; border-left: 4px solid #10b981;">
            <span style="font-weight: bold; color: #1e293b; font-size: 1.1em; margin-bottom: 8px; display: block;">Professional Summary</span>
            <div style="color: #475569; font-size: 1em;">${aiEnhancements.professionalSummary}</div>
          </div>
          ` : ''}
          
          ${data.description || aiEnhancements?.enhancedDescription ? `
          <div style="margin-bottom: 25px; padding: 15px; background: white; border-radius: 8px; border-left: 4px solid #8b5cf6;">
            <span style="font-weight: bold; color: #1e293b; font-size: 1.1em; margin-bottom: 8px; display: block;">Description</span>
            <div style="color: #475569; font-size: 1em; white-space: pre-wrap;">${aiEnhancements?.enhancedDescription || data.description}</div>
          </div>
          ` : ''}
          
          ${aiEnhancements?.suggestedSkills && aiEnhancements.suggestedSkills.length > 0 ? `
          <div style="margin-bottom: 25px; padding: 15px; background: white; border-radius: 8px; border-left: 4px solid #f59e0b;">
            <span style="font-weight: bold; color: #1e293b; font-size: 1.1em; margin-bottom: 8px; display: block;">Suggested Skills</span>
            <div style="color: #475569; font-size: 1em;">
              ${aiEnhancements.suggestedSkills.map(skill => `<span style="display: inline-block; background: #f3f4f6; padding: 4px 8px; margin: 2px; border-radius: 4px; font-size: 0.9em;">${skill}</span>`).join('')}
            </div>
          </div>
          ` : ''}
        </div>
        
        <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 2px solid #e2e8f0; color: #64748b; font-size: 0.9em;">
          <p>This document was generated automatically by the AI-Enhanced PDF Generator App.</p>
        </div>
      </div>
    `;
    
    document.body.appendChild(tempDiv);
    
    // Generate canvas from the HTML
    const canvas = await html2canvas(tempDiv, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff'
    });
    
    // Remove the temporary div
    document.body.removeChild(tempDiv);
    
    // Create PDF
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    const imgWidth = 210;
    const pageHeight = 295;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
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
    
    // Download the PDF
    pdf.save(`${data.name.replace(/\s+/g, '_')}_Profile.pdf`);
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF');
  }
};