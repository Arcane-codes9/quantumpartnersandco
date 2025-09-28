import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  BarChart3, 
  Bot, 
  Wallet, 
  Shield, 
  Zap, 
  Users, 
  Clock,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import securityImage from '@/assets/security-feature.jpg';

const Features = () => {
  const { t } = useTranslation();

  const mainFeatures = [
    {
      icon: TrendingUp,
      title: t('features.real_time.title'),
      description: t('features.real_time.description'),
      details: [
        'Lightning-fast order execution',
        'Real-time market data feeds',
        'Advanced order types',
        'Multi-exchange connectivity'
      ],
      image: securityImage,
    },
    {
      icon: BarChart3,
      title: t('features.analytics.title'),
      description: t('features.analytics.description'),
      details: [
        'Professional charting tools',
        'Technical indicators',
        'Market sentiment analysis',
        'Custom watchlists'
      ],
      image: securityImage,
    },
    {
      icon: Bot,
      title: t('features.ai_bots.title'),
      description: t('features.ai_bots.description'),
      details: [
        'Machine learning algorithms',
        'Automated trading strategies',
        'Risk management tools',
        'Performance analytics'
      ],
      image: securityImage,
    },
    {
      icon: Wallet,
      title: t('features.cold_storage.title'),
      description: t('features.cold_storage.description'),
      details: [
        'Multi-signature wallets',
        'Hardware security modules',
        'Insurance coverage',
        'Regular security audits'
      ],
      image: securityImage,
    },
  ];

  const additionalFeatures = [
    {
      icon: Shield,
      title: 'Advanced Security',
      description: 'Bank-grade security with multi-layer protection',
    },
    {
      icon: Zap,
      title: 'High Performance',
      description: 'Ultra-low latency trading infrastructure',
    },
    {
      icon: Users,
      title: '24/7 Support',
      description: 'Round-the-clock customer support',
    },
    {
      icon: Clock,
      title: 'Real-time Data',
      description: 'Live market data and instant notifications',
    },
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
              {t('features.title')}
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Powerful Trading
              <br />
              <span className="text-secondary">Features & Tools</span>
            </h1>
            <p className="text-xl text-primary-foreground/80 max-w-3xl mx-auto leading-relaxed">
              Discover the comprehensive suite of features designed to enhance your cryptocurrency trading experience
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Features */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-20">
            {mainFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
                }`}
              >
                <div className={index % 2 === 1 ? 'lg:col-start-2' : ''}>
                  <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mb-6">
                    <feature.icon className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                    {feature.title}
                  </h2>
                  <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                    {feature.description}
                  </p>
                  <ul className="space-y-4 mb-8">
                    {feature.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-accent flex-shrink-0" />
                        <span className="text-muted-foreground">{detail}</span>
                      </li>
                    ))}
                  </ul>
                  <Button variant="hero" className="group">
                    Learn More
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
                <div className={index % 2 === 1 ? 'lg:col-start-1' : ''}>
                  <div className="relative">
                    <img
                      src={feature.image}
                      alt={feature.title}
                      className="rounded-2xl shadow-elegant w-full h-auto"
                    />
                    <div className="absolute inset-0 bg-gradient-primary/10 rounded-2xl"></div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Features Grid */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything You Need
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Additional features that make QuantumPartnersandCo the complete trading solution
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {additionalFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-elegant transition-all duration-300 hover:-translate-y-2 bg-gradient-card">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                      <feature.icon className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
              Experience These Features Today
            </h2>
            <p className="text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
              Join thousands of traders who are already benefiting from our advanced platform
            </p>
            <Button variant="premium" size="xl" className="group">
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Features;