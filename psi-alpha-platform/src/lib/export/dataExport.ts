import * as XLSX from 'xlsx'
import Papa from 'papaparse'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export type ExportFormat = 'csv' | 'json' | 'xlsx' | 'pdf'

export interface ExportOptions {
  filename?: string
  format: ExportFormat
  includeHeaders?: boolean
  dateFormat?: string
  timezone?: string
}

export interface ExportData {
  [key: string]: any
}

class DataExporter {
  private formatDate(date: Date | string, format?: string): string {
    const d = typeof date === 'string' ? new Date(date) : date
    if (format === 'iso') {
      return d.toISOString()
    }
    return d.toLocaleDateString()
  }

  private sanitizeFilename(filename: string): string {
    return filename.replace(/[^a-z0-9]/gi, '_').toLowerCase()
  }

  private downloadFile(content: string | Blob, filename: string, mimeType: string) {
    const blob = content instanceof Blob ? content : new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  async exportToCSV(data: ExportData[], options: ExportOptions): Promise<void> {
    const filename = options.filename || 'export'
    const csv = Papa.unparse(data, {
      header: options.includeHeaders !== false,
      skipEmptyLines: true
    })
    
    this.downloadFile(csv, `${this.sanitizeFilename(filename)}.csv`, 'text/csv')
  }

  async exportToJSON(data: ExportData[], options: ExportOptions): Promise<void> {
    const filename = options.filename || 'export'
    const json = JSON.stringify(data, null, 2)
    
    this.downloadFile(json, `${this.sanitizeFilename(filename)}.json`, 'application/json')
  }

  async exportToExcel(data: ExportData[], options: ExportOptions): Promise<void> {
    const filename = options.filename || 'export'
    const worksheet = XLSX.utils.json_to_sheet(data)
    const workbook = XLSX.utils.book_new()
    
    // Auto-size columns
    const colWidths = Object.keys(data[0] || {}).map(key => ({
      wch: Math.max(key.length, 15)
    }))
    worksheet['!cols'] = colWidths
    
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data')
    
    // Generate buffer and download
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    
    this.downloadFile(blob, `${this.sanitizeFilename(filename)}.xlsx`, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  }

  async exportToPDF(elementId: string, options: ExportOptions): Promise<void> {
    const filename = options.filename || 'export'
    const element = document.getElementById(elementId)
    
    if (!element) {
      throw new Error(`Element with ID '${elementId}' not found`)
    }

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true
      })
      
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF()
      const imgWidth = 210
      const pageHeight = 295
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      let heightLeft = imgHeight
      let position = 0

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }

      pdf.save(`${this.sanitizeFilename(filename)}.pdf`)
    } catch (error) {
      console.error('Error generating PDF:', error)
      throw new Error('Failed to generate PDF')
    }
  }

  async exportData(data: ExportData[], options: ExportOptions): Promise<void> {
    switch (options.format) {
      case 'csv':
        return this.exportToCSV(data, options)
      case 'json':
        return this.exportToJSON(data, options)
      case 'xlsx':
        return this.exportToExcel(data, options)
      case 'pdf':
        throw new Error('PDF export requires an element ID. Use exportToPDF method instead.')
      default:
        throw new Error(`Unsupported export format: ${options.format}`)
    }
  }
}

// Singleton instance
export const dataExporter = new DataExporter()

// Specific export functions for different data types
export const exportMembers = async (members: any[], format: ExportFormat) => {
  const exportData = members.map(member => ({
    'Member ID': member.id,
    'First Name': member.firstName,
    'Last Name': member.lastName,
    'Email': member.email,
    'Status': member.status,
    'Membership Type': member.membershipType,
    'Chapter': member.chapter?.name || 'N/A',
    'School': member.school?.name || 'N/A',
    'Join Date': member.createdAt ? new Date(member.createdAt).toLocaleDateString() : 'N/A',
    'GPA': member.gpa || 'N/A',
    'Graduation Year': member.graduationYear || 'N/A'
  }))

  await dataExporter.exportData(exportData, {
    filename: `psi_alpha_members_${new Date().toISOString().split('T')[0]}`,
    format,
    includeHeaders: true
  })
}

export const exportPayments = async (payments: any[], format: ExportFormat) => {
  const exportData = payments.map(payment => ({
    'Payment ID': payment.id,
    'Member Name': `${payment.member?.firstName || ''} ${payment.member?.lastName || ''}`.trim(),
    'Member Email': payment.member?.email || 'N/A',
    'Amount': payment.amount,
    'Currency': payment.currency,
    'Status': payment.status,
    'Payment Method': payment.paymentMethod,
    'Transaction ID': payment.transactionId || 'N/A',
    'Date': payment.createdAt ? new Date(payment.createdAt).toLocaleDateString() : 'N/A',
    'Description': payment.description || 'N/A'
  }))

  await dataExporter.exportData(exportData, {
    filename: `psi_alpha_payments_${new Date().toISOString().split('T')[0]}`,
    format,
    includeHeaders: true
  })
}

export const exportInductions = async (inductions: any[], format: ExportFormat) => {
  const exportData = inductions.map(induction => ({
    'Induction ID': induction.id,
    'Title': induction.title,
    'Chapter': induction.chapter?.name || 'N/A',
    'Date': induction.date ? new Date(induction.date).toLocaleDateString() : 'N/A',
    'Location': induction.location || 'N/A',
    'Status': induction.status,
    'Registration Code': induction.registrationCode,
    'Capacity': induction.capacity || 'Unlimited',
    'Registered Count': induction.applications?.length || 0,
    'Created Date': induction.createdAt ? new Date(induction.createdAt).toLocaleDateString() : 'N/A'
  }))

  await dataExporter.exportData(exportData, {
    filename: `psi_alpha_inductions_${new Date().toISOString().split('T')[0]}`,
    format,
    includeHeaders: true
  })
}

export const exportChapters = async (chapters: any[], format: ExportFormat) => {
  const exportData = chapters.map(chapter => ({
    'Chapter ID': chapter.id,
    'Name': chapter.name,
    'School': chapter.school?.name || 'N/A',
    'Status': chapter.status,
    'Charter Date': chapter.charterDate ? new Date(chapter.charterDate).toLocaleDateString() : 'N/A',
    'Active Members': chapter.members?.filter((m: any) => m.status === 'ACTIVE').length || 0,
    'Total Members': chapter.members?.length || 0,
    'Advisor': chapter.advisor ? `${chapter.advisor.firstName} ${chapter.advisor.lastName}` : 'N/A',
    'Contact Email': chapter.contactEmail || 'N/A',
    'Website': chapter.website || 'N/A'
  }))

  await dataExporter.exportData(exportData, {
    filename: `psi_alpha_chapters_${new Date().toISOString().split('T')[0]}`,
    format,
    includeHeaders: true
  })
}

// Backup utilities
export const createFullBackup = async () => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  
  try {
    // This would typically fetch all data from your API
    const backupData = {
      timestamp,
      version: '1.0',
      data: {
        // members: await fetchAllMembers(),
        // payments: await fetchAllPayments(),
        // inductions: await fetchAllInductions(),
        // chapters: await fetchAllChapters(),
        // schools: await fetchAllSchools(),
        // advisors: await fetchAllAdvisors(),
        // events: await fetchAllEvents()
      }
    }

    await dataExporter.exportData([backupData], {
      filename: `psi_alpha_backup_${timestamp}`,
      format: 'json',
      includeHeaders: false
    })

    return { success: true, filename: `psi_alpha_backup_${timestamp}.json` }
  } catch (error) {
    console.error('Backup failed:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

// Report generation utilities
export const generateMembershipReport = async (format: ExportFormat = 'xlsx') => {
  // This would fetch actual data from your API
  const reportData = [
    {
      'Report Type': 'Membership Summary',
      'Generated Date': new Date().toLocaleDateString(),
      'Total Members': 1250,
      'Active Members': 1100,
      'Inactive Members': 150,
      'New Members (This Month)': 45,
      'Renewals (This Month)': 89
    }
  ]

  await dataExporter.exportData(reportData, {
    filename: `membership_report_${new Date().toISOString().split('T')[0]}`,
    format,
    includeHeaders: true
  })
}

export const generateFinancialReport = async (format: ExportFormat = 'xlsx') => {
  // This would fetch actual data from your API
  const reportData = [
    {
      'Report Type': 'Financial Summary',
      'Generated Date': new Date().toLocaleDateString(),
      'Total Revenue': '$125,000',
      'Revenue This Month': '$8,500',
      'Outstanding Payments': '$2,300',
      'Refunds Issued': '$450',
      'Average Payment': '$75'
    }
  ]

  await dataExporter.exportData(reportData, {
    filename: `financial_report_${new Date().toISOString().split('T')[0]}`,
    format,
    includeHeaders: true
  })
}

