import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { title, brand, creator, content, value, deliverables, timeline } = await request.json()

    // Generate HTML for PDF
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <style>
    body {
      font-family: 'Helvetica Neue', Arial, sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 40px;
      line-height: 1.6;
      color: #333;
    }
    .header {
      text-align: center;
      margin-bottom: 40px;
      padding-bottom: 20px;
      border-bottom: 2px solid #8b5cf6;
    }
    .logo {
      font-size: 24px;
      font-weight: bold;
      color: #8b5cf6;
    }
    h1 {
      font-size: 28px;
      margin: 20px 0 10px;
    }
    .meta {
      color: #666;
      font-size: 14px;
    }
    .parties {
      display: flex;
      justify-content: space-between;
      margin: 30px 0;
      padding: 20px;
      background: #f9fafb;
      border-radius: 8px;
    }
    .party h3 {
      margin: 0 0 5px;
      color: #8b5cf6;
    }
    .key-terms {
      margin: 30px 0;
      padding: 20px;
      background: #f0fdf4;
      border-radius: 8px;
      border-left: 4px solid #22c55e;
    }
    .key-terms h3 {
      margin-top: 0;
      color: #16a34a;
    }
    .deliverables {
      margin: 20px 0;
    }
    .deliverables li {
      margin: 8px 0;
    }
    .contract-content {
      margin: 30px 0;
      white-space: pre-wrap;
    }
    .signature-area {
      margin-top: 60px;
      display: flex;
      justify-content: space-between;
    }
    .signature-box {
      width: 45%;
    }
    .signature-line {
      border-top: 1px solid #333;
      margin-top: 60px;
      padding-top: 10px;
    }
    .footer {
      margin-top: 60px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      text-align: center;
      color: #9ca3af;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">ContractGen</div>
    <h1>${title}</h1>
    <div class="meta">Generated on ${new Date().toLocaleDateString('en-US', { dateStyle: 'full' })}</div>
  </div>

  <div class="parties">
    <div class="party">
      <h3>Brand</h3>
      <div>${brand}</div>
    </div>
    <div class="party">
      <h3>Creator</h3>
      <div>${creator}</div>
    </div>
  </div>

  <div class="key-terms">
    <h3>Key Terms</h3>
    <p><strong>Compensation:</strong> ${value}</p>
    <p><strong>Timeline:</strong> ${timeline}</p>
    <div class="deliverables">
      <strong>Deliverables:</strong>
      <ul>
        ${deliverables?.map((d: string) => `<li>${d}</li>`).join('') || '<li>As specified in agreement</li>'}
      </ul>
    </div>
  </div>

  <div class="contract-content">
${content}
  </div>

  <div class="signature-area">
    <div class="signature-box">
      <div class="signature-line">
        <div><strong>Brand Representative</strong></div>
        <div>Date: _________________</div>
      </div>
    </div>
    <div class="signature-box">
      <div class="signature-line">
        <div><strong>Creator</strong></div>
        <div>Date: _________________</div>
      </div>
    </div>
  </div>

  <div class="footer">
    <p>This contract was generated using ContractGen</p>
    <p>www.contractgen.io</p>
  </div>
</body>
</html>
    `.trim()

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html',
        'Content-Disposition': `attachment; filename="${title.replace(/[^a-z0-9]/gi, '_')}.html"`,
      },
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to generate PDF" }, { status: 500 })
  }
}
