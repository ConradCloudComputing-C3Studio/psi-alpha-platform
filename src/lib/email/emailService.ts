import nodemailer from 'nodemailer'

export interface EmailConfig {
  host: string
  port: number
  secure: boolean
  auth: {
    user: string
    pass: string
  }
}

export interface EmailTemplate {
  subject: string
  html: string
  text?: string
}

export interface EmailRecipient {
  email: string
  name?: string
  variables?: Record<string, string>
}

export interface BulkEmailOptions {
  template: EmailTemplate
  recipients: EmailRecipient[]
  from: {
    email: string
    name: string
  }
  batchSize?: number
  delayBetweenBatches?: number
}

class EmailService {
  private transporter: nodemailer.Transporter | null = null
  private config: EmailConfig | null = null

  constructor() {
    this.initializeFromEnv()
  }

  private initializeFromEnv() {
    const host = process.env.SMTP_HOST
    const port = process.env.SMTP_PORT
    const user = process.env.SMTP_USER
    const pass = process.env.SMTP_PASS

    if (host && port && user && pass) {
      this.configure({
        host,
        port: parseInt(port),
        secure: port === '465',
        auth: { user, pass }
      })
    }
  }

  configure(config: EmailConfig) {
    this.config = config
    this.transporter = nodemailer.createTransporter({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: config.auth
    })
  }

  private replaceVariables(template: string, variables: Record<string, string>): string {
    let result = template
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g')
      result = result.replace(regex, value)
    })
    return result
  }

  async sendEmail(
    to: string | string[],
    subject: string,
    html: string,
    text?: string,
    from?: { email: string; name: string }
  ): Promise<boolean> {
    if (!this.transporter) {
      throw new Error('Email service not configured')
    }

    try {
      const fromAddress = from 
        ? `"${from.name}" <${from.email}>`
        : `"Psi Alpha" <${process.env.SMTP_FROM || 'noreply@psialpha.org'}>`

      await this.transporter.sendMail({
        from: fromAddress,
        to: Array.isArray(to) ? to.join(', ') : to,
        subject,
        html,
        text: text || this.htmlToText(html)
      })

      return true
    } catch (error) {
      console.error('Failed to send email:', error)
      return false
    }
  }

  async sendBulkEmail(options: BulkEmailOptions): Promise<{
    sent: number
    failed: number
    errors: string[]
  }> {
    const { template, recipients, from, batchSize = 50, delayBetweenBatches = 1000 } = options
    const results = { sent: 0, failed: 0, errors: [] as string[] }

    // Process recipients in batches
    for (let i = 0; i < recipients.length; i += batchSize) {
      const batch = recipients.slice(i, i + batchSize)
      
      const batchPromises = batch.map(async (recipient) => {
        try {
          const personalizedSubject = this.replaceVariables(
            template.subject, 
            recipient.variables || {}
          )
          const personalizedHtml = this.replaceVariables(
            template.html, 
            { name: recipient.name || 'Member', ...recipient.variables || {} }
          )
          const personalizedText = template.text 
            ? this.replaceVariables(template.text, recipient.variables || {})
            : undefined

          const success = await this.sendEmail(
            recipient.email,
            personalizedSubject,
            personalizedHtml,
            personalizedText,
            from
          )

          if (success) {
            results.sent++
          } else {
            results.failed++
            results.errors.push(`Failed to send to ${recipient.email}`)
          }
        } catch (error) {
          results.failed++
          results.errors.push(`Error sending to ${recipient.email}: ${error}`)
        }
      })

      await Promise.all(batchPromises)

      // Delay between batches to avoid overwhelming the SMTP server
      if (i + batchSize < recipients.length) {
        await new Promise(resolve => setTimeout(resolve, delayBetweenBatches))
      }
    }

    return results
  }

  private htmlToText(html: string): string {
    return html
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .trim()
  }

  async testConnection(): Promise<boolean> {
    if (!this.transporter) {
      return false
    }

    try {
      await this.transporter.verify()
      return true
    } catch (error) {
      console.error('Email connection test failed:', error)
      return false
    }
  }
}

// Singleton instance
export const emailService = new EmailService()

// Email templates
export const emailTemplates = {
  welcome: {
    subject: 'Welcome to Psi Alpha - {{name}}!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #3b82f6, #1e40af); padding: 40px 20px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to Psi Alpha!</h1>
          <p style="color: #e0e7ff; margin: 10px 0 0 0; font-size: 16px;">The International Psychology Honor Society</p>
        </div>
        
        <div style="padding: 40px 20px; background: white;">
          <h2 style="color: #1f2937; margin-bottom: 20px;">Hello {{name}},</h2>
          
          <p style="color: #4b5563; line-height: 1.6; margin-bottom: 20px;">
            Congratulations on joining Psi Alpha! We're thrilled to welcome you to our community of 
            psychology students and professionals dedicated to academic excellence and professional development.
          </p>
          
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1f2937; margin-top: 0;">Your Membership Benefits Include:</h3>
            <ul style="color: #4b5563; line-height: 1.6;">
              <li>Access to exclusive scholarships and grants</li>
              <li>Professional networking opportunities</li>
              <li>Career development resources</li>
              <li>Research collaboration opportunities</li>
              <li>Conference discounts and priority registration</li>
            </ul>
          </div>
          
          <p style="color: #4b5563; line-height: 1.6; margin-bottom: 30px;">
            To get started, please log in to your member portal to complete your profile and 
            explore all the resources available to you.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="{{portalUrl}}" style="background: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 500;">
              Access Member Portal
            </a>
          </div>
        </div>
        
        <div style="background: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 14px;">
          <p>© 2024 Psi Alpha International Psychology Honor Society. All rights reserved.</p>
          <p>If you have any questions, please contact us at <a href="mailto:support@psialpha.org" style="color: #3b82f6;">support@psialpha.org</a></p>
        </div>
      </div>
    `
  },

  inductionReminder: {
    subject: 'Induction Ceremony Reminder - {{inductionTitle}}',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #3b82f6, #1e40af); padding: 30px 20px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">Induction Ceremony Reminder</h1>
        </div>
        
        <div style="padding: 30px 20px; background: white;">
          <h2 style="color: #1f2937; margin-bottom: 20px;">Hello {{name}},</h2>
          
          <p style="color: #4b5563; line-height: 1.6; margin-bottom: 20px;">
            This is a friendly reminder about your upcoming Psi Alpha induction ceremony:
          </p>
          
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1f2937; margin-top: 0;">{{inductionTitle}}</h3>
            <p style="color: #4b5563; margin: 5px 0;"><strong>Date:</strong> {{date}}</p>
            <p style="color: #4b5563; margin: 5px 0;"><strong>Time:</strong> {{time}}</p>
            <p style="color: #4b5563; margin: 5px 0;"><strong>Location:</strong> {{location}}</p>
          </div>
          
          <p style="color: #4b5563; line-height: 1.6;">
            Please arrive 15 minutes early and bring a valid photo ID. We look forward to 
            officially welcoming you to the Psi Alpha community!
          </p>
        </div>
        
        <div style="background: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 14px;">
          <p>© 2024 Psi Alpha International Psychology Honor Society. All rights reserved.</p>
        </div>
      </div>
    `
  },

  paymentConfirmation: {
    subject: 'Payment Confirmation - Psi Alpha Membership',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 30px 20px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">Payment Confirmed</h1>
        </div>
        
        <div style="padding: 30px 20px; background: white;">
          <h2 style="color: #1f2937; margin-bottom: 20px;">Hello {{name}},</h2>
          
          <p style="color: #4b5563; line-height: 1.6; margin-bottom: 20px;">
            Thank you for your payment! Your Psi Alpha membership has been successfully processed.
          </p>
          
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1f2937; margin-top: 0;">Payment Details</h3>
            <p style="color: #4b5563; margin: 5px 0;"><strong>Amount:</strong> {{amount}}</p>
            <p style="color: #4b5563; margin: 5px 0;"><strong>Transaction ID:</strong> {{transactionId}}</p>
            <p style="color: #4b5563; margin: 5px 0;"><strong>Date:</strong> {{date}}</p>
            <p style="color: #4b5563; margin: 5px 0;"><strong>Membership Type:</strong> {{membershipType}}</p>
          </div>
          
          <p style="color: #4b5563; line-height: 1.6;">
            Your membership is now active and you have full access to all Psi Alpha benefits and resources.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="{{receiptUrl}}" style="background: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 500;">
              Download Receipt
            </a>
          </div>
        </div>
        
        <div style="background: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 14px;">
          <p>© 2024 Psi Alpha International Psychology Honor Society. All rights reserved.</p>
        </div>
      </div>
    `
  },

  newsletter: {
    subject: 'Psi Alpha Newsletter - {{month}} {{year}}',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #3b82f6, #1e40af); padding: 30px 20px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">Psi Alpha Newsletter</h1>
          <p style="color: #e0e7ff; margin: 10px 0 0 0;">{{month}} {{year}}</p>
        </div>
        
        <div style="padding: 30px 20px; background: white;">
          <h2 style="color: #1f2937; margin-bottom: 20px;">Hello {{name}},</h2>
          
          <p style="color: #4b5563; line-height: 1.6; margin-bottom: 30px;">
            Welcome to this month's Psi Alpha newsletter! Here are the latest updates from our community.
          </p>
          
          <div style="margin-bottom: 30px;">
            <h3 style="color: #1f2937; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">Featured News</h3>
            <p style="color: #4b5563; line-height: 1.6;">{{featuredNews}}</p>
          </div>
          
          <div style="margin-bottom: 30px;">
            <h3 style="color: #1f2937; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">Upcoming Events</h3>
            <p style="color: #4b5563; line-height: 1.6;">{{upcomingEvents}}</p>
          </div>
          
          <div style="margin-bottom: 30px;">
            <h3 style="color: #1f2937; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">Member Spotlight</h3>
            <p style="color: #4b5563; line-height: 1.6;">{{memberSpotlight}}</p>
          </div>
        </div>
        
        <div style="background: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 14px;">
          <p>© 2024 Psi Alpha International Psychology Honor Society. All rights reserved.</p>
          <p><a href="{{unsubscribeUrl}}" style="color: #6b7280;">Unsubscribe</a> | <a href="{{preferencesUrl}}" style="color: #6b7280;">Email Preferences</a></p>
        </div>
      </div>
    `
  }
}

// Convenience functions for common email types
export const sendWelcomeEmail = async (
  recipient: { email: string; name: string },
  portalUrl: string = 'https://portal.psialpha.org'
) => {
  return emailService.sendEmail(
    recipient.email,
    emailTemplates.welcome.subject.replace('{{name}}', recipient.name),
    emailTemplates.welcome.html
      .replace(/{{name}}/g, recipient.name)
      .replace('{{portalUrl}}', portalUrl)
  )
}

export const sendInductionReminder = async (
  recipient: { email: string; name: string },
  inductionDetails: {
    title: string
    date: string
    time: string
    location: string
  }
) => {
  return emailService.sendEmail(
    recipient.email,
    emailTemplates.inductionReminder.subject.replace('{{inductionTitle}}', inductionDetails.title),
    emailTemplates.inductionReminder.html
      .replace(/{{name}}/g, recipient.name)
      .replace('{{inductionTitle}}', inductionDetails.title)
      .replace('{{date}}', inductionDetails.date)
      .replace('{{time}}', inductionDetails.time)
      .replace('{{location}}', inductionDetails.location)
  )
}

export const sendPaymentConfirmation = async (
  recipient: { email: string; name: string },
  paymentDetails: {
    amount: string
    transactionId: string
    date: string
    membershipType: string
    receiptUrl?: string
  }
) => {
  return emailService.sendEmail(
    recipient.email,
    emailTemplates.paymentConfirmation.subject,
    emailTemplates.paymentConfirmation.html
      .replace(/{{name}}/g, recipient.name)
      .replace('{{amount}}', paymentDetails.amount)
      .replace('{{transactionId}}', paymentDetails.transactionId)
      .replace('{{date}}', paymentDetails.date)
      .replace('{{membershipType}}', paymentDetails.membershipType)
      .replace('{{receiptUrl}}', paymentDetails.receiptUrl || '#')
  )
}

export const sendBulkNewsletter = async (
  recipients: EmailRecipient[],
  newsletterContent: {
    month: string
    year: string
    featuredNews: string
    upcomingEvents: string
    memberSpotlight: string
  }
) => {
  const template = {
    ...emailTemplates.newsletter,
    html: emailTemplates.newsletter.html
      .replace('{{month}}', newsletterContent.month)
      .replace('{{year}}', newsletterContent.year)
      .replace('{{featuredNews}}', newsletterContent.featuredNews)
      .replace('{{upcomingEvents}}', newsletterContent.upcomingEvents)
      .replace('{{memberSpotlight}}', newsletterContent.memberSpotlight),
    subject: emailTemplates.newsletter.subject
      .replace('{{month}}', newsletterContent.month)
      .replace('{{year}}', newsletterContent.year)
  }

  return emailService.sendBulkEmail({
    template,
    recipients,
    from: { email: 'newsletter@psialpha.org', name: 'Psi Alpha Newsletter' },
    batchSize: 25,
    delayBetweenBatches: 2000
  })
}

