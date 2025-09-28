import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Eye, Lightbulb, Users, TrendingUp, Globe, Award } from 'lucide-react';
import teamPhoto from '@/assets/team-photo.jpg';

const About = () => {
  const { t } = useTranslation();

  const values = [
    {
      icon: Shield,
      title: t('about.values.security'),
      description: 'We prioritize the security of your digital assets above all else.',
    },
    {
      icon: Eye,
      title: t('about.values.transparency'),
      description: 'Complete transparency in all our operations and fee structures.',
    },
    {
      icon: Lightbulb,
      title: t('about.values.innovation'),
      description: 'Continuously improving our platform with cutting-edge technology.',
    },
  ];

  const team = [
    {
      name: 'David Thompson',
      role: 'Chief Executive Officer',
      experience: '15+ years in FinTech',
      image: teamPhoto,
    },
    {
      name: 'Sarah Chen',
      role: 'Chief Technology Officer',
      experience: '12+ years in Blockchain',
      image: teamPhoto,
    },
    {
      name: 'Michael Rodriguez',
      role: 'Head of Security',
      experience: '10+ years in Cybersecurity',
      image: teamPhoto,
    },
    {
      name: 'Emily Johnson',
      role: 'Head of Trading',
      experience: '8+ years in Crypto Trading',
      image: teamPhoto,
    },
  ];

  const stats = [
    { label: t('about.stats.clients'), value: '50,000+', icon: Users },
    { label: t('about.stats.volume'), value: '$2.5B+', icon: TrendingUp },
    { label: t('about.stats.countries'), value: '120+', icon: Globe },
    { label: t('about.stats.uptime'), value: '99.9%', icon: Award },
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
              {t('about.title')}
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Building the Future of
              <br />
              <span className="text-secondary">Cryptocurrency Trading</span>
            </h1>
            <p className="text-xl text-primary-foreground/80 max-w-3xl mx-auto leading-relaxed">
              {t('about.mission')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Our Mission
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                {t('about.mission')}
              </p>
              <h3 className="text-2xl font-bold text-foreground mb-4">
                Our Vision
              </h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                {t('about.vision')}
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative"
            >
              <img
                src={teamPhoto}
                alt="QuantumPartnersandCo Team"
                className="rounded-2xl shadow-elegant w-full h-auto"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
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
              Our Core Values
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              The principles that guide everything we do at QuantumPartnersandCo
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-elegant transition-all duration-300 hover:-translate-y-2 bg-gradient-card">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <value.icon className="h-8 w-8 text-primary-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-4">
                      {value.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-primary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              Trusted Worldwide
            </h2>
            <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
              Our platform serves traders and investors across the globe
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="h-8 w-8 text-secondary-foreground" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-primary-foreground mb-2">
                  {stat.value}
                </div>
                <div className="text-primary-foreground/80 text-sm">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
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
              Leadership Team
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Meet the experienced professionals leading QuantumPartnersandCo forward
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="hover:shadow-card transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-6 text-center">
                    <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-4 bg-gradient-primary">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {member.name}
                    </h3>
                    <p className="text-primary text-sm font-medium mb-2">
                      {member.role}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      {member.experience}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;