import { dataExporter, exportMembers, exportPayments } from '@/lib/export/dataExport'

// Mock dependencies
jest.mock('xlsx', () => ({
  utils: {
    json_to_sheet: jest.fn(() => ({})),
    book_new: jest.fn(() => ({})),
    book_append_sheet: jest.fn(),
  },
  write: jest.fn(() => new ArrayBuffer(8)),
}))

jest.mock('papaparse', () => ({
  unparse: jest.fn(() => 'csv,data\ntest,value'),
}))

jest.mock('jspdf', () => {
  return jest.fn().mockImplementation(() => ({
    addImage: jest.fn(),
    addPage: jest.fn(),
    save: jest.fn(),
  }))
})

jest.mock('html2canvas', () => jest.fn(() => Promise.resolve({
  toDataURL: () => 'data:image/png;base64,test',
  height: 100,
  width: 100,
})))

// Mock URL and Blob
global.URL.createObjectURL = jest.fn(() => 'mock-url')
global.URL.revokeObjectURL = jest.fn()
global.Blob = jest.fn().mockImplementation(() => ({}))

// Mock DOM methods
document.createElement = jest.fn().mockImplementation((tagName) => {
  const element = {
    href: '',
    download: '',
    click: jest.fn(),
    style: {},
  }
  return element
})

document.body.appendChild = jest.fn()
document.body.removeChild = jest.fn()
document.getElementById = jest.fn()

describe('DataExporter', () => {
  const mockData = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
  ]

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('exportToCSV', () => {
    it('should export data to CSV format', async () => {
      const Papa = require('papaparse')
      
      await dataExporter.exportToCSV(mockData, {
        filename: 'test-export',
        format: 'csv',
        includeHeaders: true,
      })

      expect(Papa.unparse).toHaveBeenCalledWith(mockData, {
        header: true,
        skipEmptyLines: true,
      })
    })

    it('should handle filename sanitization', async () => {
      await dataExporter.exportToCSV(mockData, {
        filename: 'Test Export With Spaces!',
        format: 'csv',
      })

      // Check that createElement was called (indicating download was triggered)
      expect(document.createElement).toHaveBeenCalledWith('a')
    })
  })

  describe('exportToJSON', () => {
    it('should export data to JSON format', async () => {
      await dataExporter.exportToJSON(mockData, {
        filename: 'test-export',
        format: 'json',
      })

      expect(document.createElement).toHaveBeenCalledWith('a')
    })
  })

  describe('exportToExcel', () => {
    it('should export data to Excel format', async () => {
      const XLSX = require('xlsx')
      
      await dataExporter.exportToExcel(mockData, {
        filename: 'test-export',
        format: 'xlsx',
      })

      expect(XLSX.utils.json_to_sheet).toHaveBeenCalledWith(mockData)
      expect(XLSX.utils.book_new).toHaveBeenCalled()
      expect(XLSX.utils.book_append_sheet).toHaveBeenCalled()
    })
  })

  describe('exportToPDF', () => {
    it('should export element to PDF', async () => {
      const mockElement = {
        id: 'test-element',
        offsetHeight: 100,
        offsetWidth: 100,
      }
      
      document.getElementById = jest.fn().mockReturnValue(mockElement)
      
      await dataExporter.exportToPDF('test-element', {
        filename: 'test-export',
        format: 'pdf',
      })

      expect(document.getElementById).toHaveBeenCalledWith('test-element')
    })

    it('should throw error if element not found', async () => {
      document.getElementById = jest.fn().mockReturnValue(null)
      
      await expect(
        dataExporter.exportToPDF('non-existent', {
          filename: 'test',
          format: 'pdf',
        })
      ).rejects.toThrow("Element with ID 'non-existent' not found")
    })
  })
})

describe('Specialized Export Functions', () => {
  const mockMembers = [
    {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      status: 'ACTIVE',
      membershipType: 'ANNUAL',
      chapter: { name: 'Alpha Chapter' },
      school: { name: 'University A' },
      createdAt: '2024-01-01T00:00:00Z',
      gpa: 3.8,
      graduationYear: 2025,
    },
  ]

  const mockPayments = [
    {
      id: '1',
      member: { firstName: 'John', lastName: 'Doe', email: 'john@example.com' },
      amount: 50.00,
      currency: 'USD',
      status: 'COMPLETED',
      paymentMethod: 'card',
      transactionId: 'txn_123',
      createdAt: '2024-01-01T00:00:00Z',
      description: 'Annual membership',
    },
  ]

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should export members data with proper formatting', async () => {
    await exportMembers(mockMembers, 'csv')
    
    const Papa = require('papaparse')
    expect(Papa.unparse).toHaveBeenCalled()
    
    const callArgs = Papa.unparse.mock.calls[0][0]
    expect(callArgs[0]).toHaveProperty('Member ID', '1')
    expect(callArgs[0]).toHaveProperty('First Name', 'John')
    expect(callArgs[0]).toHaveProperty('Last Name', 'Doe')
    expect(callArgs[0]).toHaveProperty('Email', 'john@example.com')
  })

  it('should export payments data with proper formatting', async () => {
    await exportPayments(mockPayments, 'csv')
    
    const Papa = require('papaparse')
    expect(Papa.unparse).toHaveBeenCalled()
    
    const callArgs = Papa.unparse.mock.calls[0][0]
    expect(callArgs[0]).toHaveProperty('Payment ID', '1')
    expect(callArgs[0]).toHaveProperty('Member Name', 'John Doe')
    expect(callArgs[0]).toHaveProperty('Amount', 50.00)
    expect(callArgs[0]).toHaveProperty('Status', 'COMPLETED')
  })

  it('should handle missing data gracefully', async () => {
    const incompleteMembers = [
      {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        status: 'ACTIVE',
        membershipType: 'ANNUAL',
        // Missing chapter, school, etc.
      },
    ]

    await exportMembers(incompleteMembers, 'csv')
    
    const Papa = require('papaparse')
    const callArgs = Papa.unparse.mock.calls[0][0]
    expect(callArgs[0]).toHaveProperty('Chapter', 'N/A')
    expect(callArgs[0]).toHaveProperty('School', 'N/A')
  })
})

