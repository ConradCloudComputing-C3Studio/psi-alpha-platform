# Psi Alpha Platform Deployment Guide

## Overview

This guide provides step-by-step instructions for deploying the Psi Alpha platform to AWS Amplify and configuring all necessary services.

## Prerequisites

- AWS Account with appropriate permissions
- AWS CLI installed and configured
- Node.js 18+ and npm
- Git repository access

## Environment Variables

Before deployment, ensure the following environment variables are configured:

### Required Environment Variables

```bash
# AWS Amplify Configuration
AMPLIFY_APP_ID=your-amplify-app-id
AMPLIFY_BRANCH=main

# Authentication
NEXTAUTH_URL=https://your-domain.amplifyapp.com
NEXTAUTH_SECRET=your-nextauth-secret

# Database
DATABASE_URL=your-database-connection-string

# Stripe Payment Integration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your-stripe-publishable-key
STRIPE_SECRET_KEY=sk_live_your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret

# Email Configuration
SMTP_HOST=your-smtp-host
SMTP_PORT=587
SMTP_USER=your-smtp-username
SMTP_PASS=your-smtp-password
SMTP_FROM=noreply@psialpha.org

# AWS Services
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key

# Application Settings
NEXT_PUBLIC_APP_URL=https://your-domain.amplifyapp.com
NEXT_PUBLIC_API_URL=https://your-api-domain.com
```

## Deployment Steps

### 1. Prepare the Repository

```bash
# Clone the repository
git clone https://github.com/your-org/psi-alpha-platform.git
cd psi-alpha-platform

# Install dependencies
npm install

# Run tests to ensure everything works
npm run test:ci

# Build the application
npm run build:production
```

### 2. AWS Amplify Setup

#### Option A: Deploy via AWS Console

1. **Login to AWS Console**
   - Navigate to AWS Amplify service
   - Click "New app" → "Host web app"

2. **Connect Repository**
   - Select your Git provider (GitHub, GitLab, etc.)
   - Choose the psi-alpha-platform repository
   - Select the main branch

3. **Configure Build Settings**
   - Use the provided `amplify.yml` configuration
   - Set environment variables in the Amplify console

4. **Deploy**
   - Review settings and click "Save and deploy"
   - Monitor the build process

#### Option B: Deploy via Amplify CLI

```bash
# Install Amplify CLI
npm install -g @aws-amplify/cli

# Configure Amplify
amplify configure

# Initialize Amplify project
amplify init

# Add hosting
amplify add hosting

# Deploy
amplify publish
```

### 3. Configure AWS Services

#### DynamoDB Tables

Create the following DynamoDB tables:

```bash
# Members table
aws dynamodb create-table \
  --table-name psi-alpha-members \
  --attribute-definitions \
    AttributeName=id,AttributeType=S \
  --key-schema \
    AttributeName=id,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST

# Payments table
aws dynamodb create-table \
  --table-name psi-alpha-payments \
  --attribute-definitions \
    AttributeName=id,AttributeType=S \
  --key-schema \
    AttributeName=id,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST

# Additional tables for chapters, schools, inductions, etc.
```

#### S3 Buckets

```bash
# Create S3 bucket for file storage
aws s3 mb s3://psi-alpha-platform-files

# Configure CORS
aws s3api put-bucket-cors \
  --bucket psi-alpha-platform-files \
  --cors-configuration file://cors-config.json
```

#### Lambda Functions

Deploy serverless functions for:
- Payment processing
- Email notifications
- Data export
- Backup operations

### 4. Configure External Services

#### Stripe Setup

1. **Create Stripe Account**
   - Set up products for membership types
   - Configure webhooks for payment events
   - Add webhook endpoint: `https://your-domain.amplifyapp.com/api/webhooks/stripe`

2. **Configure Webhook Events**
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`

#### Email Service Setup

Configure SMTP settings for:
- Welcome emails
- Payment confirmations
- Induction reminders
- Newsletter distribution

### 5. Domain Configuration

#### Custom Domain Setup

1. **Purchase Domain** (if needed)
   - Recommended: psialpha.org or similar

2. **Configure DNS**
   ```bash
   # Add CNAME record
   CNAME www your-amplify-domain.amplifyapp.com
   
   # Add A record for root domain
   A @ your-amplify-ip-address
   ```

3. **SSL Certificate**
   - Amplify automatically provisions SSL certificates
   - Verify certificate status in Amplify console

### 6. Post-Deployment Configuration

#### Database Seeding

```bash
# Run database migrations
npm run db:migrate

# Seed initial data
npm run db:seed
```

#### Admin User Setup

```bash
# Create initial admin user
npm run create-admin -- --email admin@psialpha.org --password secure-password
```

#### Testing

```bash
# Run end-to-end tests
npm run test:e2e

# Test payment integration
npm run test:payments

# Verify email functionality
npm run test:email
```

## Monitoring and Maintenance

### CloudWatch Monitoring

Set up monitoring for:
- Application performance
- Error rates
- Database performance
- Payment processing

### Backup Strategy

1. **Automated Backups**
   - Daily database backups
   - Weekly full system backups
   - Monthly archive backups

2. **Backup Verification**
   - Regular restore testing
   - Data integrity checks

### Security Considerations

1. **Environment Variables**
   - Never commit secrets to version control
   - Use AWS Secrets Manager for sensitive data
   - Rotate keys regularly

2. **Access Control**
   - Implement least privilege access
   - Regular security audits
   - Monitor access logs

3. **Data Protection**
   - Encrypt data at rest and in transit
   - Implement proper GDPR compliance
   - Regular security updates

## Troubleshooting

### Common Issues

1. **Build Failures**
   ```bash
   # Check build logs
   amplify console
   
   # Clear cache and rebuild
   npm run clean
   npm install
   npm run build
   ```

2. **Environment Variable Issues**
   ```bash
   # Verify environment variables
   amplify env list
   amplify env checkout production
   ```

3. **Database Connection Issues**
   ```bash
   # Test database connection
   npm run db:test
   
   # Check VPC configuration
   aws ec2 describe-vpcs
   ```

### Support Contacts

- **Technical Support**: tech-support@psialpha.org
- **AWS Support**: Use AWS Support Center
- **Emergency Contact**: emergency@psialpha.org

## Rollback Procedures

### Application Rollback

```bash
# Rollback to previous version
amplify env checkout production
amplify publish --restore

# Or use specific commit
git checkout previous-stable-commit
amplify publish
```

### Database Rollback

```bash
# Restore from backup
aws dynamodb restore-table-from-backup \
  --target-table-name psi-alpha-members \
  --backup-arn arn:aws:dynamodb:region:account:table/psi-alpha-members/backup/backup-id
```

## Performance Optimization

### CDN Configuration

- Enable CloudFront distribution
- Configure caching policies
- Optimize image delivery

### Database Optimization

- Monitor query performance
- Implement proper indexing
- Use DynamoDB best practices

### Application Optimization

- Enable Next.js optimizations
- Implement code splitting
- Optimize bundle size

## Compliance and Legal

### Data Privacy

- GDPR compliance implementation
- Data retention policies
- User consent management

### Security Standards

- SOC 2 compliance
- Regular penetration testing
- Security incident response plan

---

For additional support or questions, please contact the development team or refer to the technical documentation.

