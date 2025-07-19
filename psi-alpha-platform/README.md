# Psi Alpha Platform

A comprehensive web platform for the International Psychology Honor Society, built with Next.js, TypeScript, and AWS Amplify.

## 🌟 Features

### Core Functionality
- **Member Management**: Complete CRUD operations for members, chapters, and schools
- **Induction System**: Registration workflow with approval process
- **Payment Integration**: Stripe-powered membership payments with multiple tiers
- **Admin Dashboard**: Comprehensive management interface for administrators
- **Member Portal**: Self-service portal for members to manage their accounts

### Advanced Features
- **Multi-language Support**: English and Spanish localization with next-intl
- **Accessibility**: WCAG 2.1 AA compliant with accessibility toolbar
- **Data Export**: CSV, JSON, Excel, and PDF export capabilities
- **Email Integration**: Automated notifications and bulk email campaigns
- **Backup System**: Automated data backup and recovery tools

### Technical Features
- **Authentication**: AWS Cognito with role-based access control
- **Database**: GraphQL API with AWS Amplify DataStore
- **File Storage**: AWS S3 integration for document management
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Testing**: Comprehensive test suite with Jest and Testing Library

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- AWS Account (for deployment)
- Stripe Account (for payments)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/psi-alpha-platform.git
cd psi-alpha-platform

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Run development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

### Environment Variables

Create a `.env.local` file with the following variables:

```bash
# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key
STRIPE_SECRET_KEY=sk_test_your_key

# Email
SMTP_HOST=your-smtp-host
SMTP_PORT=587
SMTP_USER=your-smtp-user
SMTP_PASS=your-smtp-password

# AWS (for deployment)
AWS_REGION=us-east-1
```

## 📁 Project Structure

```
psi-alpha-platform/
├── src/
│   ├── app/                    # Next.js app router pages
│   │   ├── admin/             # Admin dashboard pages
│   │   ├── auth/              # Authentication pages
│   │   ├── payment/           # Payment pages
│   │   ├── portal/            # Member portal
│   │   └── register/          # Registration pages
│   ├── components/            # Reusable React components
│   │   ├── accessibility/     # Accessibility components
│   │   ├── auth/              # Authentication components
│   │   ├── i18n/              # Internationalization
│   │   ├── layout/            # Layout components
│   │   └── payment/           # Payment components
│   ├── lib/                   # Utility libraries
│   │   ├── backup/            # Backup utilities
│   │   ├── email/             # Email services
│   │   └── export/            # Data export utilities
│   ├── i18n/                  # Internationalization config
│   └── types/                 # TypeScript type definitions
├── public/                    # Static assets
├── __tests__/                 # Test files
├── amplify.yml               # AWS Amplify build config
├── schema.graphql            # GraphQL schema
└── DEPLOYMENT.md             # Deployment guide
```

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run start           # Start production server

# Testing
npm run test            # Run tests
npm run test:watch      # Run tests in watch mode
npm run test:coverage   # Run tests with coverage
npm run test:ci         # Run tests for CI/CD

# Quality
npm run lint            # Run ESLint
npm run type-check      # Run TypeScript checks
npm run build:production # Full production build with checks
```

### Code Quality

The project includes:
- **ESLint**: Code linting with Next.js recommended rules
- **TypeScript**: Full type safety throughout the application
- **Prettier**: Code formatting (configure in your editor)
- **Jest**: Unit and integration testing
- **Husky**: Git hooks for quality checks (optional)

## 🎨 Design System

### Colors
- **Primary**: Blue (#3B82F6)
- **Secondary**: Gray (#6B7280)
- **Success**: Green (#10B981)
- **Warning**: Yellow (#F59E0B)
- **Error**: Red (#EF4444)

### Typography
- **Headings**: Inter font family
- **Body**: System font stack
- **Monospace**: Fira Code

### Components
All components follow:
- Consistent spacing using Tailwind CSS
- Accessible design patterns
- Mobile-first responsive design
- Dark mode support (where applicable)

## 🔐 Authentication & Authorization

### User Roles
- **Admin**: Full system access
- **Advisor**: Chapter management and member oversight
- **Member**: Access to member portal and resources
- **Alumni**: Limited access to alumni features
- **Prospect**: Registration and application access

### Protected Routes
- `/admin/*`: Admin only
- `/portal/*`: Authenticated members
- `/advisor/*`: Advisors and admins

## 💳 Payment Integration

### Membership Tiers
- **Student**: $25.00/semester
- **Annual**: $50.00/year
- **Lifetime**: $150.00 (one-time)

### Payment Features
- Secure Stripe integration
- Payment history tracking
- Automatic receipt generation
- Subscription management
- Refund processing

## 📧 Email System

### Automated Emails
- Welcome emails for new members
- Payment confirmations
- Induction reminders
- Newsletter distribution

### Email Templates
Professional HTML templates with:
- Responsive design
- Consistent branding
- Personalization variables
- Unsubscribe links

## 🌍 Internationalization

### Supported Languages
- English (default)
- Spanish

### Adding New Languages
1. Create language file in `src/i18n/locales/[locale]/common.json`
2. Add locale to `src/i18n/config.ts`
3. Update language selector component

## ♿ Accessibility

### Features
- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader compatibility
- High contrast mode
- Font size adjustment
- Reduced motion support

### Testing
- Automated accessibility testing
- Manual keyboard testing
- Screen reader testing

## 📊 Data Management

### Export Formats
- CSV for spreadsheet applications
- JSON for data processing
- Excel for advanced analysis
- PDF for reports and documentation

### Backup System
- Automated daily backups
- Manual backup creation
- Data validation and integrity checks
- Restore capabilities

## 🚀 Deployment

### AWS Amplify Deployment

1. **Connect Repository**
   ```bash
   # Using Amplify CLI
   amplify init
   amplify add hosting
   amplify publish
   ```

2. **Environment Configuration**
   - Set environment variables in Amplify console
   - Configure custom domain
   - Set up SSL certificate

3. **Database Setup**
   - Deploy GraphQL schema
   - Configure DynamoDB tables
   - Set up authentication

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

### Manual Deployment

```bash
# Build the application
npm run build:production

# Deploy to your hosting provider
# (specific steps depend on your provider)
```

## 🧪 Testing

### Test Coverage
- Unit tests for utilities and components
- Integration tests for user flows
- End-to-end tests for critical paths

### Running Tests
```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test file
npm test HomePage.test.tsx
```

## 📈 Performance

### Optimization Features
- Next.js automatic optimizations
- Image optimization with next/image
- Code splitting and lazy loading
- Bundle analysis tools
- CDN integration via Amplify

### Monitoring
- Performance metrics tracking
- Error monitoring
- User analytics
- Payment processing monitoring

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run the test suite
6. Submit a pull request

### Code Standards
- Follow TypeScript best practices
- Write comprehensive tests
- Use semantic commit messages
- Update documentation as needed

## 📄 License

This project is proprietary software owned by Psi Alpha International Psychology Honor Society. All rights reserved.

## 🆘 Support

### Getting Help
- **Documentation**: Check this README and DEPLOYMENT.md
- **Issues**: Create a GitHub issue for bugs or feature requests
- **Email**: Contact tech-support@psialpha.org

### Emergency Support
For critical production issues:
- **Emergency Email**: emergency@psialpha.org
- **Phone**: (555) 123-4567 (24/7 support line)

## 🗺️ Roadmap

### Upcoming Features
- [ ] Mobile application (React Native)
- [ ] Advanced analytics dashboard
- [ ] Integration with academic systems
- [ ] Enhanced social features
- [ ] AI-powered member matching

### Version History
- **v1.0.0**: Initial release with core functionality
- **v1.1.0**: Added internationalization and accessibility
- **v1.2.0**: Enhanced payment system and email integration

---

Built with ❤️ by the Psi Alpha Development Team
#

