import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Eye, Lock, FileText, Users, Globe } from 'lucide-react';

const Privacy = () => {
  const { t } = useTranslation();

  const sections = [
    {
      id: 'information-collection',
      title: 'Information We Collect',
      icon: FileText,
      content: [
        {
          subtitle: 'Personal Information',
          text: 'We collect personal information you provide directly to us, such as when you create an account, make a transaction, or contact us for support. This includes your name, email address, phone number, and government-issued identification documents required for KYC compliance.'
        },
        {
          subtitle: 'Transaction Data',
          text: 'We collect information about your trading activities, including transaction history, wallet addresses, amounts, timestamps, and related blockchain data necessary for providing our services.'
        },
        {
          subtitle: 'Device and Usage Information',
          text: 'We automatically collect certain information about your device and how you interact with our platform, including IP address, browser type, operating system, and usage patterns for security and optimization purposes.'
        }
      ]
    },
    {
      id: 'data-usage',
      title: 'How We Use Your Data',
      icon: Users,
      content: [
        {
          subtitle: 'Service Provision',
          text: 'We use your information to provide, maintain, and improve our cryptocurrency trading services, process transactions, and ensure platform security and compliance with applicable regulations.'
        },
        {
          subtitle: 'Communication',
          text: 'We may use your contact information to send you important updates about your account, transactions, security alerts, and other service-related communications.'
        },
        {
          subtitle: 'Compliance and Security',
          text: 'We use your information to comply with legal obligations, prevent fraud, ensure platform security, and conduct necessary identity verification processes.'
        }
      ]
    },
    {
      id: 'data-sharing',
      title: 'Information Sharing',
      icon: Globe,
      content: [
        {
          subtitle: 'Service Providers',
          text: 'We may share your information with trusted third-party service providers who assist us in operating our platform, conducting business, or servicing you, provided they agree to keep this information confidential.'
        },
        {
          subtitle: 'Legal Compliance',
          text: 'We may disclose your information when required by law, court order, or government request, or when we believe disclosure is necessary to protect our rights, property, or safety, or that of others.'
        },
        {
          subtitle: 'Business Transfers',
          text: 'In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of the transaction, subject to appropriate confidentiality protections.'
        }
      ]
    },
    {
      id: 'data-security',
      title: 'Data Security',
      icon: Shield,
      content: [
        {
          subtitle: 'Encryption and Protection',
          text: 'We implement industry-standard security measures to protect your personal information, including encryption, secure servers, and multi-factor authentication systems.'
        },
        {
          subtitle: 'Access Controls',
          text: 'Access to your personal information is restricted to authorized personnel who need it to perform their job functions, and all access is logged and monitored.'
        },
        {
          subtitle: 'Regular Security Audits',
          text: 'We conduct regular security assessments and penetration testing to identify and address potential vulnerabilities in our systems and processes.'
        }
      ]
    },
    {
      id: 'your-rights',
      title: 'Your Privacy Rights',
      icon: Eye,
      content: [
        {
          subtitle: 'Access and Correction',
          text: 'You have the right to access, update, or correct your personal information. You can do this through your account settings or by contacting our support team.'
        },
        {
          subtitle: 'Data Portability',
          text: 'You have the right to request a copy of your personal data in a structured, commonly used format, subject to security and legal limitations.'
        },
        {
          subtitle: 'Deletion Rights',
          text: 'You may request deletion of your personal information, though we may need to retain certain data for legal compliance, security, or legitimate business purposes.'
        }
      ]
    },
    {
      id: 'cookies',
      title: 'Cookies and Tracking',
      icon: Lock,
      content: [
        {
          subtitle: 'Cookie Usage',
          text: 'We use cookies and similar technologies to enhance your experience, remember your preferences, and analyze platform usage. You can control cookie settings through your browser.'
        },
        {
          subtitle: 'Analytics',
          text: 'We use analytics tools to understand how users interact with our platform, which helps us improve our services and user experience.'
        },
        {
          subtitle: 'Marketing Cookies',
          text: 'With your consent, we may use marketing cookies to provide you with relevant advertisements and promotional content based on your interests and usage patterns.'
        }
      ]
    }
  ];

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-hero">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center text-primary-foreground"
          >
            <Badge variant="secondary" className="mb-6 px-6 py-2">
              {t('nav.privacy')}
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Privacy <span className="text-secondary">Policy</span>
            </h1>
            <p className="text-xl text-primary-foreground/80 max-w-3xl mx-auto leading-relaxed">
              Your privacy is important to us. Learn how we collect, use, and protect your personal information.
            </p>
            <div className="mt-8 text-sm text-primary-foreground/60">
              Last updated: January 1, 2024
            </div>
          </motion.div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-12 bg-muted/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <Card className="shadow-elegant">
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
                    <Shield className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">Introduction</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  Em24Investment ("we," "our," or "us") is committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our cryptocurrency trading platform and related services. By using our services, you agree to the collection and use of information in accordance with this policy.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Privacy Policy Sections */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto space-y-12">
            {sections.map((section, sectionIndex) => (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: sectionIndex * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="shadow-elegant">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
                        <section.icon className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <h2 className="text-2xl font-bold text-foreground">{section.title}</h2>
                    </div>

                    <div className="space-y-6">
                      {section.content.map((item, index) => (
                        <div key={index}>
                          <h3 className="text-lg font-semibold text-foreground mb-3">
                            {item.subtitle}
                          </h3>
                          <p className="text-muted-foreground leading-relaxed">
                            {item.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* GDPR Compliance */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <Card className="shadow-elegant">
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
                    <Globe className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">GDPR Compliance</h2>
                </div>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    If you are located in the European Economic Area (EEA), we comply with the General Data Protection Regulation (GDPR). Under GDPR, you have additional rights regarding your personal data, including:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>The right to be informed about how your data is processed</li>
                    <li>The right to access your personal data</li>
                    <li>The right to rectification of inaccurate data</li>
                    <li>The right to erasure in certain circumstances</li>
                    <li>The right to restrict processing</li>
                    <li>The right to data portability</li>
                    <li>The right to object to processing</li>
                    <li>Rights related to automated decision-making</li>
                  </ul>
                  <p>
                    To exercise any of these rights, please contact our Data Protection Officer at privacy@em24investment.com.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <Card className="shadow-elegant">
              <CardContent className="p-8">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-foreground mb-6">
                    Questions About This Policy?
                  </h2>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    If you have any questions about this Privacy Policy or our data practices, please contact us:
                  </p>
                  <div className="space-y-2 text-muted-foreground">
                    <p><strong>Email:</strong> privacy@em24investment.com</p>
                    <p><strong>Address:</strong> 123 Financial District, New York, NY 10004</p>
                    <p><strong>Phone:</strong> +1 (555) 123-4567</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Privacy;