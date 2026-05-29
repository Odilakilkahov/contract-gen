import { jsPDF } from 'jspdf'

interface ContractData {
  title: string
  brand: string
  creator: string
  content: string
  value?: string
  deliverables?: string[]
  timeline?: string
  status?: string
  type?: string
  created_at?: string
}

// Branding settings for white-label contracts
export interface PDFBrandingSettings {
  companyName?: string
  logo?: string | null
  primaryColor?: string
  accentColor?: string
  contractFooter?: string
  hideContractGenBranding?: boolean
  contractWatermark?: string | null
}

// Helper to convert hex to RGB tuple
function hexToRgbTuple(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (result) {
    return [
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16),
    ]
  }
  return [124, 58, 237] // Default purple
}

export function generateContractPDF(
  contract: ContractData,
  branding?: PDFBrandingSettings
): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  })

  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 20
  const contentWidth = pageWidth - margin * 2
  let yPos = margin

  // Colors - use branding colors if provided
  const primaryColor: [number, number, number] = branding?.primaryColor
    ? hexToRgbTuple(branding.primaryColor)
    : [124, 58, 237] // Default Purple #7c3aed
  const textColor: [number, number, number] = [26, 26, 26]
  const grayColor: [number, number, number] = [102, 102, 102]
  const lightGray: [number, number, number] = [229, 224, 216]

  // Company name for branding
  const companyName = branding?.companyName || 'ContractGen'
  const hideContractGenBranding = branding?.hideContractGenBranding || false

  // Helper function to add new page if needed
  const checkPageBreak = (requiredSpace: number) => {
    if (yPos + requiredSpace > pageHeight - margin) {
      doc.addPage()
      yPos = margin
      return true
    }
    return false
  }

  // Header with purple accent line
  doc.setDrawColor(...primaryColor)
  doc.setLineWidth(0.8)
  doc.line(margin, yPos, pageWidth - margin, yPos)
  yPos += 8

  // Logo/Brand
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.setTextColor(...primaryColor)

  // Add logo if provided, otherwise show company name
  if (branding?.logo) {
    try {
      // Add logo image (assumes base64 data URL)
      doc.addImage(branding.logo, 'PNG', margin, yPos - 6, 30, 10)
    } catch (e) {
      // Fallback to text if logo fails to load
      doc.text(companyName, margin, yPos)
    }
  } else {
    doc.text(companyName, margin, yPos)
  }

  // Date on the right
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(...grayColor)
  const dateStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
  doc.text(dateStr, pageWidth - margin, yPos, { align: 'right' })
  yPos += 12

  // Title
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(22)
  doc.setTextColor(...textColor)
  const titleLines = doc.splitTextToSize(contract.title, contentWidth)
  doc.text(titleLines, margin, yPos)
  yPos += titleLines.length * 8 + 4

  // Subtitle
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(11)
  doc.setTextColor(...grayColor)
  doc.text('Influencer Marketing Agreement', margin, yPos)
  yPos += 15

  // Parties Section
  doc.setDrawColor(...lightGray)
  doc.setFillColor(249, 250, 251)
  doc.roundedRect(margin, yPos, contentWidth, 32, 2, 2, 'FD')
  yPos += 8

  // Brand
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.setTextColor(...primaryColor)
  doc.text('BRAND', margin + 8, yPos)
  doc.setTextColor(...textColor)
  doc.setFont('helvetica', 'normal')
  doc.text(contract.brand || 'Not specified', margin + 8, yPos + 6)

  // Creator
  doc.text('CREATOR', pageWidth / 2 + 8, yPos - 0)
  doc.setTextColor(...textColor)
  doc.text(contract.creator || 'Not specified', pageWidth / 2 + 8, yPos + 6)
  yPos += 32

  // Key Terms Section
  if (contract.value || contract.timeline || (contract.deliverables && contract.deliverables.length > 0)) {
    yPos += 5
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(12)
    doc.setTextColor(...primaryColor)
    doc.text('Key Terms', margin, yPos)
    yPos += 8

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    doc.setTextColor(...textColor)

    // Value
    if (contract.value) {
      doc.setFont('helvetica', 'bold')
      doc.text('Compensation:', margin, yPos)
      doc.setFont('helvetica', 'normal')
      doc.text(contract.value, margin + 35, yPos)
      yPos += 6
    }

    // Timeline
    if (contract.timeline) {
      doc.setFont('helvetica', 'bold')
      doc.text('Timeline:', margin, yPos)
      doc.setFont('helvetica', 'normal')
      doc.text(contract.timeline, margin + 35, yPos)
      yPos += 6
    }

    // Deliverables
    if (contract.deliverables && contract.deliverables.length > 0) {
      doc.setFont('helvetica', 'bold')
      doc.text('Deliverables:', margin, yPos)
      yPos += 6
      doc.setFont('helvetica', 'normal')
      contract.deliverables.forEach((d) => {
        checkPageBreak(6)
        doc.text(`• ${d}`, margin + 5, yPos)
        yPos += 5
      })
    }
    yPos += 8
  }

  // Contract Content Section
  checkPageBreak(20)
  doc.setDrawColor(...primaryColor)
  doc.setLineWidth(0.3)
  doc.line(margin, yPos, pageWidth - margin, yPos)
  yPos += 8

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.setTextColor(...primaryColor)
  doc.text('Agreement', margin, yPos)
  yPos += 8

  // Content text
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.setTextColor(...textColor)

  const contentLines = doc.splitTextToSize(contract.content || '', contentWidth)
  const lineHeight = 5

  for (let i = 0; i < contentLines.length; i++) {
    checkPageBreak(lineHeight + 2)
    doc.text(contentLines[i], margin, yPos)
    yPos += lineHeight
  }

  // Signature Section
  yPos += 15
  checkPageBreak(50)

  doc.setDrawColor(...lightGray)
  doc.setLineWidth(0.5)

  // Brand signature
  const sigWidth = (contentWidth - 20) / 2
  doc.line(margin, yPos + 25, margin + sigWidth, yPos + 25)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.setTextColor(...grayColor)
  doc.text('Brand Representative', margin, yPos + 30)
  doc.setFont('helvetica', 'normal')
  doc.text(contract.brand || '', margin, yPos + 35)
  doc.text('Date: _________________', margin, yPos + 40)

  // Creator signature
  const rightSigX = pageWidth - margin - sigWidth
  doc.line(rightSigX, yPos + 25, pageWidth - margin, yPos + 25)
  doc.setFont('helvetica', 'bold')
  doc.text('Creator', rightSigX, yPos + 30)
  doc.setFont('helvetica', 'normal')
  doc.text(contract.creator || '', rightSigX, yPos + 35)
  doc.text('Date: _________________', rightSigX, yPos + 40)

  // Add watermark if specified
  if (branding?.contractWatermark) {
    const totalPagesForWatermark = doc.getNumberOfPages()
    for (let i = 1; i <= totalPagesForWatermark; i++) {
      doc.setPage(i)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(60)
      doc.setTextColor(200, 200, 200) // Light gray
      doc.text(
        branding.contractWatermark,
        pageWidth / 2,
        pageHeight / 2,
        {
          align: 'center',
          angle: 45,
        }
      )
    }
  }

  // Footer on each page
  const totalPages = doc.getNumberOfPages()
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.setTextColor(...grayColor)

    // Build footer text based on branding settings
    let footerText = ''

    if (branding?.contractFooter) {
      // Use custom footer
      footerText = branding.contractFooter
    } else if (hideContractGenBranding && companyName !== 'ContractGen') {
      // Use company name without ContractGen branding
      footerText = `${companyName} • Page ${i} of ${totalPages}`
    } else {
      // Default footer
      footerText = `Generated by ContractGen • contract-gen.com • Page ${i} of ${totalPages}`
    }

    // Handle multi-line custom footers
    const footerLines = footerText.split('\n')
    let footerY = pageHeight - 10

    if (footerLines.length > 1) {
      footerY = pageHeight - 8 - (footerLines.length - 1) * 4
    }

    footerLines.forEach((line, index) => {
      doc.text(line.trim(), pageWidth / 2, footerY + index * 4, { align: 'center' })
    })

    // Add page number if custom footer doesn't include it
    if (branding?.contractFooter && !branding.contractFooter.includes('Page')) {
      doc.setFontSize(7)
      doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, pageHeight - 5, { align: 'right' })
    }
  }

  return doc
}

export function downloadContractPDF(
  contract: ContractData,
  branding?: PDFBrandingSettings
): void {
  const doc = generateContractPDF(contract, branding)
  const filename = `${contract.title.replace(/[^a-z0-9]/gi, '_')}.pdf`
  doc.save(filename)
}

export function getContractPDFBlob(
  contract: ContractData,
  branding?: PDFBrandingSettings
): Blob {
  const doc = generateContractPDF(contract, branding)
  return doc.output('blob')
}

export function getContractPDFBase64(
  contract: ContractData,
  branding?: PDFBrandingSettings
): string {
  const doc = generateContractPDF(contract, branding)
  return doc.output('datauristring')
}
