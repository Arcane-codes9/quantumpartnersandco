import { motion } from 'framer-motion';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useEnhancedTranslation } from '@/hooks/use-translation';

const Contact = () => {
  const { getTranslation } = useEnhancedTranslation();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: getTranslation('contact.success.title', 'Message Sent'),
      description: getTranslation('contact.success.description', 'Thank you for your message. We\'ll get back to you soon!'),
    });
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: getTranslation('contact.info.address_label', 'Address'),
      content: getTranslation('contact.info.address', '123 Financial District, New York, NY 10004'),
    },
    {
      icon: Phone,
      title: getTranslation('contact.info.phone_label', 'Phone'),
      content: getTranslation('contact.info.phone', '+1 (555) 123-4567'),
    },
    {
      icon: Mail,
      title: getTranslation('contact.info.email_label', 'Email'),
      content: getTranslation('contact.info.email', 'support@em24investment.com'),
    },
    {
      icon: Clock,
      title: getTranslation('contact.info.hours_label', 'Support Hours'),
      content: getTranslation('contact.info.hours', '24/7 Support Available'),
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
              {getTranslation('contact.title', 'Contact Us')}
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {getTranslation('contact.hero.title', 'Get in')} <span className="text-secondary">{getTranslation('contact.hero.title_highlight', 'Touch')}</span>
            </h1>
            <p className="text-xl text-primary-foreground/80 max-w-3xl mx-auto leading-relaxed">
              {getTranslation('contact.hero.description', 'Have questions about our platform? Our team is here to help you 24/7')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card className="shadow-elegant">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-foreground">
                    {getTranslation('contact.form.title', 'Send us a Message')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">
                          {getTranslation('contact.form.name', 'Full Name')}
                        </label>
                        <Input
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          required
                          className="transition-all duration-300 focus:shadow-card"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">
                          {getTranslation('contact.form.email', 'Email Address')}
                        </label>
                        <Input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          required
                          className="transition-all duration-300 focus:shadow-card"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        {getTranslation('contact.form.subject', 'Subject')}
                      </label>
                      <Input
                        value={formData.subject}
                        onChange={(e) => setFormData({...formData, subject: e.target.value})}
                        required
                        className="transition-all duration-300 focus:shadow-card"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        {getTranslation('contact.form.message', 'Message')}
                      </label>
                      <Textarea
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        required
                        rows={6}
                        className="transition-all duration-300 focus:shadow-card"
                      />
                    </div>
                    <Button type="submit" variant="hero" size="lg" className="w-full group">
                      <Send className="mr-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      {getTranslation('contact.form.submit', 'Send Message')}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  {getTranslation('contact.info.title', 'Contact Information')}
                </h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  {getTranslation('contact.info.description', 'Reach out to us through any of these channels. We\'re here to help!')}
                </p>
              </div>

              {contactInfo.map((info, index) => (
                <motion.div
                  key={info.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="hover:shadow-card transition-all duration-300 hover:-translate-y-1">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
                          <info.icon className="h-6 w-6 text-primary-foreground" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-foreground mb-1">
                            {info.title}
                          </h3>
                          <p className="text-muted-foreground">
                            {info.content}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}

              {/* Map Placeholder */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <Card className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="w-full h-64 bg-gradient-primary flex items-center justify-center">
                      <div className="text-center text-primary-foreground">
                        <MapPin className="h-12 w-12 mx-auto mb-2" />
                        <p className="text-lg font-medium">{getTranslation('contact.map.title', 'Interactive Map')}</p>
                        <p className="text-sm opacity-80">{getTranslation('contact.map.subtitle', 'View our location')}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;