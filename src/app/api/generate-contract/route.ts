import { NextRequest, NextResponse } from "next/server"

const CONTRACT_PROMPTS: Record<string, string> = {
  "sponsored-post": `You are a legal contract expert. Generate a professional Influencer Sponsored Post Agreement.`,
  "brand-ambassador": `You are a legal contract expert. Generate a professional Brand Ambassador Agreement.`,
  "ugc-license": `You are a legal contract expert. Generate a professional UGC Content License Agreement.`,
  "affiliate-deal": `You are a legal contract expert. Generate a professional Affiliate Partnership Agreement.`,
  "product-review": `You are a legal contract expert. Generate a professional Product Review Agreement.`,
  "event-appearance": `You are a legal contract expert. Generate a professional Event Appearance Agreement.`,
  "whitelisting": `You are a legal contract expert. Generate a professional Ad Whitelisting Agreement.`,
  "nda": `You are a legal contract expert. Generate a professional Non-Disclosure Agreement (NDA).`,
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      templateId,
      creatorName,
      creatorEmail,
      brandName,
      brandEmail,
      platform,
      deliverables,
      compensation,
      paymentTerms,
      startDate,
      endDate,
      contentDeadline,
      exclusivity,
      usageRights,
      usageDuration,
      revisions,
      // New legal fields
      governingLaw,
      killFeePercent,
      latePaymentPenalty,
      includeMoralityClause,
      includeForceMajeure,
    } = body

    // Check for API key
    const apiKey = process.env.OPENAI_API_KEY || process.env.ANTHROPIC_API_KEY

    let contractContent: string

    if (apiKey && process.env.OPENAI_API_KEY) {
      // Use OpenAI
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: CONTRACT_PROMPTS[templateId] || CONTRACT_PROMPTS["sponsored-post"],
            },
            {
              role: "user",
              content: `Generate a complete, legally-sound influencer contract with the following details:

PARTIES:
- Creator: ${creatorName} (${creatorEmail})
- Brand: ${brandName} (${brandEmail})

DEAL TERMS:
- Platform: ${platform}
- Deliverables: ${deliverables}
- Compensation: ${compensation}
- Payment Terms: ${paymentTerms}
- Revisions Allowed: ${revisions}

TIMELINE:
- Start Date: ${startDate}
- Content Deadline: ${contentDeadline}
- End Date: ${endDate}

RIGHTS:
- Exclusivity: ${exclusivity}
- Usage Rights: ${usageRights}
- Usage Duration: ${usageDuration}

REQUIREMENTS:
1. Include clear FTC disclosure requirements (#ad, #sponsored)
2. Include content approval process
3. Include payment schedule
4. Include termination clauses
5. Include intellectual property rights
6. Include confidentiality clause
7. Include signature blocks for both parties
8. Use professional legal language
9. Format with clear section headers

Generate the complete contract text:`,
            },
          ],
          temperature: 0.7,
          max_tokens: 3000,
        }),
      })

      const data = await response.json()
      contractContent = data.choices?.[0]?.message?.content || generateFallbackContract(body)
    } else if (apiKey && process.env.ANTHROPIC_API_KEY) {
      // Use Anthropic Claude
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 3000,
          messages: [
            {
              role: "user",
              content: `${CONTRACT_PROMPTS[templateId] || CONTRACT_PROMPTS["sponsored-post"]}

Generate a complete, legally-sound influencer contract with the following details:

PARTIES:
- Creator: ${creatorName} (${creatorEmail})
- Brand: ${brandName} (${brandEmail})

DEAL TERMS:
- Platform: ${platform}
- Deliverables: ${deliverables}
- Compensation: ${compensation}
- Payment Terms: ${paymentTerms}
- Revisions Allowed: ${revisions}

TIMELINE:
- Start Date: ${startDate}
- Content Deadline: ${contentDeadline}
- End Date: ${endDate}

RIGHTS:
- Exclusivity: ${exclusivity}
- Usage Rights: ${usageRights}
- Usage Duration: ${usageDuration}

Include FTC disclosure requirements, content approval process, payment schedule, termination clauses, IP rights, confidentiality, and signature blocks. Use professional legal language with clear section headers.`,
            },
          ],
        }),
      })

      const data = await response.json()
      contractContent = data.content?.[0]?.text || generateFallbackContract(body)
    } else {
      // Fallback: Generate template-based contract
      contractContent = generateFallbackContract(body)
    }

    return NextResponse.json({
      success: true,
      contract: contractContent,
      generatedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Contract generation error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to generate contract" },
      { status: 500 }
    )
  }
}

// Governing Law Labels
const GOVERNING_LAW_LABELS: Record<string, string> = {
  'russia': 'the laws of the Russian Federation',
  'us-california': 'the laws of the State of California, United States',
  'us-new-york': 'the laws of the State of New York, United States',
  'us-delaware': 'the laws of the State of Delaware, United States',
  'uk': 'the laws of England and Wales, United Kingdom',
  'eu-germany': 'the laws of the Federal Republic of Germany',
}

const ARBITRATION_BODIES: Record<string, string> = {
  'russia': 'the International Commercial Arbitration Court at the Chamber of Commerce and Industry of the Russian Federation in Moscow',
  'us-california': 'JAMS in Los Angeles, California',
  'us-new-york': 'the American Arbitration Association (AAA) in New York, New York',
  'us-delaware': 'the American Arbitration Association (AAA) in Wilmington, Delaware',
  'uk': 'the London Court of International Arbitration (LCIA) in London',
  'eu-germany': 'the German Institution of Arbitration (DIS) in Frankfurt',
}

function generateFallbackContract(data: Record<string, string>): string {
  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const governingLawId = data.governingLaw || 'us-california'
  const governingLawLabel = GOVERNING_LAW_LABELS[governingLawId] || GOVERNING_LAW_LABELS['us-california']
  const arbitrationBody = ARBITRATION_BODIES[governingLawId] || ARBITRATION_BODIES['us-california']
  const killFeePercent = data.killFeePercent || '25'
  const latePaymentPenalty = data.latePaymentPenalty || '1.5'
  const includeMoralityClause = data.includeMoralityClause !== 'false'
  const includeForceMajeure = data.includeForceMajeure !== 'false'

  return `INFLUENCER AGREEMENT

This Influencer Agreement ("Agreement") is entered into as of ${today} ("Effective Date") by and between:

BRAND: ${data.brandName || "[Brand Name]"} ("Brand")
Address: [Brand Address]
Contact: ${data.brandEmail || "[Brand Email]"}

INFLUENCER: ${data.creatorName || "[Creator Name]"} ("Influencer")
Address: [Influencer Address]
Contact: ${data.creatorEmail || "[Creator Email]"}

RECITALS

WHEREAS, Brand desires to engage Influencer to create and publish sponsored content promoting Brand's products/services; and

WHEREAS, Influencer desires to provide such services subject to the terms and conditions set forth herein.

NOW, THEREFORE, in consideration of the mutual covenants and agreements contained herein, the parties agree as follows:

1. SERVICES AND DELIVERABLES

1.1 Platform: ${data.platform?.charAt(0).toUpperCase() + data.platform?.slice(1) || "Instagram"}

1.2 Deliverables: Influencer agrees to create and publish the following content:
${data.deliverables || "- 1 sponsored post\n- 3 Instagram Stories"}

1.3 Content Requirements:
    (a) All content must be original and created specifically for this campaign
    (b) Content must feature Brand's products/services prominently
    (c) Content must align with Brand's messaging guidelines
    (d) Influencer must obtain Brand approval before publication

2. COMPENSATION

2.1 Payment Amount: ${data.compensation || "$[Amount]"} USD

2.2 Payment Terms: ${data.paymentTerms?.replace("_", " ").toUpperCase() || "NET 30"}

2.3 Payment Method: Wire transfer or PayPal to Influencer's designated account

3. TIMELINE

3.1 Campaign Start Date: ${data.startDate || "[Start Date]"}
3.2 Content Deadline: ${data.contentDeadline || "[Deadline]"}
3.3 Campaign End Date: ${data.endDate || "[End Date]"}

4. CONTENT APPROVAL

4.1 Influencer shall submit all content to Brand for approval at least 48 hours before scheduled publication.

4.2 Brand shall respond to approval requests within 24 hours.

4.3 Revisions: Influencer agrees to make up to ${data.revisions || "2"} rounds of revisions at no additional cost.

5. FTC DISCLOSURE AND COMPLIANCE

5.1 REQUIRED DISCLOSURE: Influencer MUST clearly disclose the sponsored nature of all content in accordance with Federal Trade Commission (FTC) guidelines.

5.2 Disclosure Requirements:
    (a) Use #ad or #sponsored at the BEGINNING of captions
    (b) Disclosure must be clear, conspicuous, and unavoidable
    (c) Use platform-native disclosure tools where available
    (d) Verbal disclosure required in video content

5.3 Influencer acknowledges that failure to properly disclose may result in penalties up to $43,792 per violation.

6. EXCLUSIVITY

6.1 Exclusivity Period: ${data.exclusivity === "full" ? "Full exclusivity" : data.exclusivity === "category" ? "Category exclusivity" : "No exclusivity"}

6.2 ${data.exclusivity === "none" ? "Influencer may work with competing brands during this campaign." : "Influencer agrees not to promote competing products/services for the duration of this Agreement plus 30 days."}

7. INTELLECTUAL PROPERTY AND USAGE RIGHTS

7.1 Content Ownership: Influencer retains ownership of all original content created.

7.2 License Grant: Influencer grants Brand a ${data.usageDuration === "perpetual" ? "perpetual" : data.usageDuration?.replace("_", " ") || "1 year"}, non-exclusive license to use, reproduce, and distribute the content for ${data.usageRights === "all" ? "all media including print, digital, and broadcast" : data.usageRights === "digital" ? "digital media only" : "social media only"}.

7.3 Brand may not alter content without Influencer's written consent.

8. CONFIDENTIALITY

8.1 Both parties agree to keep confidential all non-public information shared during this engagement.

8.2 This includes but is not limited to: compensation terms, unreleased products, marketing strategies, and proprietary data.

9. REPRESENTATIONS AND WARRANTIES

9.1 Influencer represents and warrants that:
    (a) They have full authority to enter into this Agreement
    (b) Content will be original and not infringe any third-party rights
    (c) They will comply with all applicable laws and platform policies
    (d) Engagement metrics shared are accurate and authentic

9.2 Brand represents and warrants that:
    (a) Products/services are legally sold and marketed
    (b) They have authority to grant the licenses contemplated herein

10. TERMINATION

10.1 Either party may terminate this Agreement with 14 days written notice.

10.2 Upon termination:
    (a) Brand shall pay for all completed deliverables
    (b) License grants shall survive according to Section 7
    (c) Confidentiality obligations shall survive for 2 years

10.3 Kill Fee: If Brand cancels this Agreement after Influencer has commenced work but before completion, Brand shall pay Influencer a kill fee equal to ${killFeePercent}% of the total Compensation for work completed but not yet delivered.

11. LIMITATION OF LIABILITY

11.1 Neither party shall be liable for indirect, incidental, or consequential damages.

11.2 Total liability shall not exceed the total compensation paid under this Agreement.

12. LATE PAYMENT

12.1 Payments not received within thirty (30) days of the due date shall accrue interest at a rate of ${latePaymentPenalty}% per month or the maximum rate permitted by law, whichever is less.

12.2 Brand shall reimburse Influencer for any reasonable collection costs incurred due to late payment, including attorneys' fees.

${includeForceMajeure ? `13. FORCE MAJEURE

13.1 Neither party shall be liable for any failure or delay in performance due to circumstances beyond their reasonable control, including but not limited to: natural disasters, war, terrorism, riots, embargoes, acts of civil or military authorities, fire, floods, accidents, pandemic, strikes, or shortages of transportation, facilities, fuel, energy, labor, or materials.

13.2 The affected party shall provide prompt written notice of the force majeure event and use reasonable efforts to mitigate its effects.

13.3 If the force majeure event continues for more than sixty (60) days, either party may terminate this Agreement without penalty.

` : ''}${includeMoralityClause ? `14. MORALITY CLAUSE

14.1 Brand may terminate this Agreement immediately if Influencer engages in conduct that brings Influencer into public disrepute, contempt, scandal, or ridicule, or that shocks, insults, or offends the community or any group, or that reflects unfavorably upon Brand's reputation or products.

14.2 Such conduct includes, but is not limited to: criminal activity, substance abuse, hate speech, discrimination, harassment, or any behavior that materially damages Brand's goodwill or public image.

14.3 In the event of termination under this clause, Brand's sole obligation shall be to pay for deliverables completed and approved prior to termination.

` : ''}15. DISPUTE RESOLUTION

15.1 Any dispute arising out of this Agreement shall first be attempted to be resolved through good-faith negotiation between the parties for a period of thirty (30) days.

15.2 If unresolved through negotiation, the dispute shall be submitted to binding arbitration in accordance with the rules of ${arbitrationBody}.

15.3 The arbitrator's decision shall be final and binding upon both parties. Judgment upon the award rendered may be entered in any court having jurisdiction thereof.

15.4 Each party shall bear its own costs and attorneys' fees, unless the arbitrator determines that a party acted in bad faith, in which case the arbitrator may award reasonable costs and fees to the prevailing party.

16. GOVERNING LAW

16.1 This Agreement shall be governed by and construed in accordance with ${governingLawLabel}, without regard to its conflict of laws principles.

17. ENTIRE AGREEMENT

17.1 This Agreement constitutes the entire agreement between the parties and supersedes all prior negotiations, representations, and agreements relating to the subject matter hereof.

17.2 Amendments must be in writing and signed by both parties.

17.3 If any provision of this Agreement is held invalid or unenforceable, the remaining provisions shall continue in full force and effect.

IN WITNESS WHEREOF, the parties have executed this Agreement as of the Effective Date.


BRAND: ${data.brandName || "[Brand Name]"}

Signature: _________________________

Name: _________________________

Title: _________________________

Date: _________________________


INFLUENCER: ${data.creatorName || "[Creator Name]"}

Signature: _________________________

Name: _________________________

Date: _________________________
`
}
