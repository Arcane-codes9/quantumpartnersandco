import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent } from '@/components/ui/card';
import { User, TrendingUp, Shield, CreditCard, HelpCircle } from 'lucide-react';

const FAQ = () => {
  const { t } = useTranslation();

  const faqCategories = [
    {
      id: 'accounts',
      title: t('faq.categories.accounts'),
      icon: User,
      color: 'text-blue-600',
      questions: [
        {
          question: 'How do I create an account on QuantumPartnersandCo?',
          answer: 'Creating an account is simple. Click "Sign Up" on our homepage, provide your email, create a strong password, and verify your email address. You\'ll then need to complete our KYC verification process to start trading.'
        },
        {
          question: 'What documents do I need for account verification?',
          answer: 'You\'ll need a government-issued photo ID (passport, driver\'s license, or national ID card) and a proof of address document (utility bill, bank statement, or rental agreement) that\'s less than 3 months old.'
        },
        {
          question: 'How long does account verification take?',
          answer: 'Account verification typically takes 1-3 business days. During peak periods, it may take up to 5 business days. You\'ll receive email updates on your verification status.'
        },
        {
          question: 'Can I change my account information after registration?',
          answer: 'Yes, you can update most account information in your profile settings. However, changes to sensitive information like your name or address may require additional verification.'
        }
      ]
    },
    {
      id: 'trading',
      title: t('faq.categories.trading'),
      icon: TrendingUp,
      color: 'text-green-600',
      questions: [
        {
          question: 'What cryptocurrencies can I trade on QuantumPartnersandCo?',
          answer: 'We support trading of major cryptocurrencies including Bitcoin (BTC), Ethereum (ETH), Cardano (ADA), Polkadot (DOT), Solana (SOL), and many more. Our full list is available on the trading platform.'
        },
        {
          question: 'What are your trading fees?',
          answer: 'Our trading fees start at 0.1% for makers and 0.2% for takers. Fees decrease based on your 30-day trading volume. VIP users can enjoy fees as low as 0.02%.'
        },
        {
          question: 'Do you offer AI trading bots?',
          answer: 'Yes! Our AI trading bots use advanced machine learning algorithms to execute trades based on market conditions. You can customize risk parameters and strategies to match your trading style.'
        },
        {
          question: 'What order types do you support?',
          answer: 'We support market orders, limit orders, stop-loss orders, take-profit orders, and advanced order types like OCO (One-Cancels-Other) and trailing stops.'
        }
      ]
    },
    {
      id: 'security',
      title: t('faq.categories.security'),
      icon: Shield,
      color: 'text-red-600',
      questions: [
        {
          question: 'How do you protect my funds?',
          answer: 'We use industry-leading security measures including cold storage for 95% of funds, multi-signature wallets, hardware security modules, and comprehensive insurance coverage.'
        },
        {
          question: 'Do you support two-factor authentication?',
          answer: 'Yes, we strongly recommend enabling 2FA using Google Authenticator or Authy. We also support SMS 2FA, though app-based 2FA is more secure.'
        },
        {
          question: 'What happens if I forget my password?',
          answer: 'You can reset your password using the "Forgot Password" link on the login page. You\'ll receive a secure reset link via email. For additional security, you may need to verify your identity.'
        },
        {
          question: 'Is my personal information safe?',
          answer: 'Absolutely. We comply with GDPR and other privacy regulations. Your personal data is encrypted and stored securely, and we never share it with third parties without your consent.'
        }
      ]
    },
    {
      id: 'withdrawals',
      title: t('faq.categories.withdrawals'),
      icon: CreditCard,
      color: 'text-purple-600',
      questions: [
        {
          question: 'How do I withdraw my funds?',
          answer: 'Go to your account dashboard, select "Withdraw," choose your currency and withdrawal method, enter the amount, and confirm. Crypto withdrawals are processed within 1 hour, while fiat withdrawals take 1-3 business days.'
        },
        {
          question: 'What are the withdrawal limits?',
          answer: 'Daily withdrawal limits depend on your verification level. Basic accounts can withdraw up to $10,000 daily, while fully verified accounts have limits up to $100,000 daily.'
        },
        {
          question: 'Are there withdrawal fees?',
          answer: 'Cryptocurrency withdrawal fees vary by coin and network congestion. Fiat withdrawals have a flat fee structure. All fees are clearly displayed before you confirm your withdrawal.'
        },
        {
          question: 'Why is my withdrawal pending?',
          answer: 'Withdrawals may be pending due to security checks, network congestion, or if additional verification is required. Most withdrawals are processed automatically within the stated timeframes.'
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
              {t('faq.title')}
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              How Can We <span className="text-secondary">Help You?</span>
            </h1>
            <p className="text-xl text-primary-foreground/80 max-w-3xl mx-auto leading-relaxed">
              Find answers to the most commonly asked questions about QuantumPartnersandCo
            </p>
          </motion.div>
        </div>
      </section>

      {/* FAQ Categories */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Browse by Category
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Select a category below to find answers to your questions
            </p>
          </motion.div>

          <div className="space-y-12">
            {faqCategories.map((category, categoryIndex) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="shadow-elegant">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
                        <category.icon className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-foreground">
                          {category.title}
                        </h3>
                        <p className="text-muted-foreground">
                          {category.questions.length} questions
                        </p>
                      </div>
                    </div>

                    <Accordion type="single" collapsible className="space-y-4">
                      {category.questions.map((faq, index) => (
                        <AccordionItem
                          key={index}
                          value={`${category.id}-${index}`}
                          className="border border-border rounded-lg px-6"
                        >
                          <AccordionTrigger className="text-left hover:no-underline py-6">
                            <div className="flex items-center gap-3">
                              <HelpCircle className="h-5 w-5 text-primary flex-shrink-0" />
                              <span className="font-medium text-foreground">
                                {faq.question}
                              </span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="pb-6 pt-2">
                            <p className="text-muted-foreground leading-relaxed ml-8">
                              {faq.answer}
                            </p>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Support Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Still Have Questions?
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
              Can't find what you're looking for? Our support team is available 24/7 to help you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Card className="p-6 hover:shadow-elegant transition-all duration-300 cursor-pointer">
                  <CardContent className="p-0 text-center">
                    <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                      <HelpCircle className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Live Chat
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      Get instant help from our support team
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Card className="p-6 hover:shadow-elegant transition-all duration-300 cursor-pointer">
                  <CardContent className="p-0 text-center">
                    <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                      <User className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Contact Form
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      Send us a detailed message
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default FAQ;