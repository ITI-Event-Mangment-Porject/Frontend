import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import HomeNavbar from '../../components/homePage/HomeNavbar';
import HomeFooter from '../../components/homePage/HomeFooter';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import {
  Users,
  Calendar,
  Building2,
  Brain,
  Shield,
  BarChart3,
  MessageSquare,
  Zap,
  Github,
  Linkedin,
  Mail,
  Code,
  Database,
  Palette,
  Sparkles,
  Target,
  Award,
} from 'lucide-react';

const AboutUs = () => {
  const teamMembers = [
    {
      id: 1,
      name: 'Ali El-Gendy',
      role: 'Full-Stack Developer',
      type: 'fullstack',
      image: '/public/team/ali.png',
      github: 'https://github.com/ahmed-hassan',
      linkedin: 'https://www.linkedin.com/in/ali--elgendy/',
    },
    {
      id: 2,
      name: 'Nour Mamoun',
      role: 'Full-Stack Developer',
      type: 'fullstack',
      image: '/public/team/nour.jpg',
      github: 'https://github.com/fatima-alzahra',
      linkedin: 'https://www.linkedin.com/in/nour-mamoun-96a57421a/',
    },
    {
      id: 3,
      name: 'Ghada Emad',
      role: 'Full-Stack Developer',
      type: 'fullstack',
      image: '/public/team/ghada.jpg',
      github: 'https://github.com/omar-mahmoud',
      linkedin: 'https://www.linkedin.com/in/ghada-emad1/',
    },
    {
      id: 4,
      name: 'Monia Yakoub',
      role: 'Frontend Developer',
      type: 'frontend',
      image: '/public/team/monica.jpg',
      github: 'https://github.com/nour-abdel-rahman',
      linkedin: 'https://www.linkedin.com/in/monica-amgad-8830a028b/',
    },
    {
      id: 5,
      name: 'Merna Tera',
      role: 'Frontend Developer',
      type: 'frontend',
      image: '',
      github: 'https://github.com/khaled-ibrahim',
      linkedin: '/',
    },
    {
      id: 6,
      name: 'Nada Ehab',
      role: 'Backend Developer',
      type: 'backend',
      image: '/public/team/nada.jpg',
      github: 'https://github.com/yasmin-farouk',
      linkedin: 'https://www.linkedin.com/in/nada-ehab-0606a6252/',
    },
    {
      id: 7,
      name: 'Ahmed El-Gendy',
      role: 'Backend Developer',
      type: 'backend',
      image: '',
      github: 'https://github.com/mohamed-ali',
      linkedin: 'https://www.linkedin.com/in/ahmed-elgendy-982836218/',
    },
    {
      id: 8,
      name: 'Ahmed El-Emam',
      role: 'Backend Developer',
      type: 'backend',
      image: '/public/team/ahmed.png',
      github: 'https://github.com/layla-mostafa',
      linkedin: 'https://www.linkedin.com/in/ahmed-elimam97/',
    },
  ];

  const features = [
    {
      icon: Shield,
      title: 'SSO Authentication',
      description:
        'Seamless integration with ITI Portal for secure single sign-on access',
      gradient: 'from-blue-500/10 to-blue-600/10',
      iconColor: 'text-blue-600',
    },
    {
      icon: Calendar,
      title: 'Event Management',
      description:
        'Comprehensive tools for managing job fairs, workshops, and educational events',
      gradient: 'from-green-500/10 to-green-600/10',
      iconColor: 'text-green-600',
    },
    {
      icon: Users,
      title: 'Smart Queue System',
      description:
        'Intelligent interview queue management ensuring smooth job fair operations',
      gradient: 'from-purple-500/10 to-purple-600/10',
      iconColor: 'text-purple-600',
    },
    {
      icon: Building2,
      title: 'Company Integration',
      description:
        'Complete company participation workflow with job profile management',
      gradient: 'from-orange-500/10 to-orange-600/10',
      iconColor: 'text-orange-600',
    },
    {
      icon: Brain,
      title: 'AI-Powered Analytics',
      description:
        'Advanced feedback analysis and insights generation using artificial intelligence',
      gradient: 'from-pink-500/10 to-pink-600/10',
      iconColor: 'text-pink-600',
    },
    {
      icon: MessageSquare,
      title: 'Communication Hub',
      description:
        'Streamlined notifications and bulk messaging system for all stakeholders',
      gradient: 'from-indigo-500/10 to-indigo-600/10',
      iconColor: 'text-indigo-600',
    },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  const cardVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
    hover: {
      y: -8,
      transition: {
        duration: 0.3,
        ease: 'easeInOut',
      },
    },
  };

  const teamCardVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
    hover: {
      scale: 1.05,
      y: -10,
      transition: {
        duration: 0.3,
        ease: 'easeInOut',
      },
    },
  };

  const getRoleIcon = type => {
    switch (type) {
      case 'fullstack':
        return Code;
      case 'frontend':
        return Palette;
      case 'backend':
        return Database;
      default:
        return Code;
    }
  };

  const getRoleBadgeColor = type => {
    switch (type) {
      case 'fullstack':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'frontend':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'backend':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <HomeNavbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#901b20] via-[#ad565a] to-[#203947] text-white pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        {/* Animated decorative elements */}
        <motion.div
          className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"
          animate={{
            y: [0, -20, 0],
            x: [0, 10, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl"
          animate={{
            y: [0, 20, 0],
            x: [0, -15, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-white/5 to-transparent rounded-full blur-3xl"
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            >
              <Sparkles className="h-4 w-4 mr-2" />
            </motion.div>
            Meet the team behind CommunITI
          </motion.div>

          <motion.h1
            className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            About CommunITI
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Revolutionizing educational and career event management through
            innovative technology
          </motion.p>
        </div>
      </section>

      {/* Project Overview */}
      <section className="py-20 bg-white relative overflow-hidden">
        {/* Animated background decoration */}
        <motion.div
          className="absolute top-20 left-20 w-40 h-40 bg-[#901b20] rounded-full blur-3xl opacity-5"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.05, 0.1, 0.05],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-60 h-60 bg-[#203947] rounded-full blur-3xl opacity-5"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.1, 0.05, 0.1],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="inline-flex items-center px-4 py-2 bg-[#901b20]/10 rounded-full text-[#901b20] text-sm font-medium mb-4"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Target className="h-4 w-4 mr-2" />
              Our Mission
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Our Platform
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              CommunITI is a centralized web platform designed for managing
              educational and career-related events such as job fairs,
              workshops, and fun days with cutting-edge technology and
              user-centric design.
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <motion.div
                  key={index}
                  variants={cardVariants}
                  whileHover="hover"
                  custom={index}
                >
                  <Card className="h-full p-6 border-2 border-gray-300 rounded-lg hover:shadow-lg shadow-md bg-white hover:border-[var(--primary-500)] hover:border-2 group">
                    <CardContent className="h-full p-8 flex flex-col">
                      <div className="flex items-center mb-6">
                        <motion.div
                          className={`p-4 bg-gradient-to-r ${feature.gradient} rounded-2xl`}
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ duration: 0.3 }}
                        >
                          <IconComponent
                            className={`h-7 w-7 ${feature.iconColor}`}
                          />
                        </motion.div>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed flex-grow">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Technical Architecture */}
          <motion.div
            className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 md:p-12 border border-gray-200 shadow-lg"
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <motion.div
                className="inline-flex items-center px-4 py-2 bg-[#203947]/10 rounded-full text-[#203947] text-sm font-medium mb-4"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Award className="h-4 w-4 mr-2" />
                Technical Excellence
              </motion.div>
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Built for Scale
              </h3>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Our platform is built with modern technologies and follows
                industry best practices
              </p>
            </motion.div>

            <motion.div
              className="grid md:grid-cols-2 gap-12"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <motion.div variants={itemVariants}>
                <h4 className="text-2xl font-bold text-[#901b20] mb-6 flex items-center">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                  >
                    <Zap className="h-6 w-6 mr-3" />
                  </motion.div>
                  Key Features
                </h4>
                <ul className="space-y-4 text-gray-700">
                  {[
                    'Single Sign-On (SSO) authentication via ITI Portal',
                    'Detailed event and session planning tools',
                    'Smart interview queue system with real-time updates',
                    'AI-powered feedback analysis and insights',
                  ].map((item, index) => (
                    <motion.li
                      key={index}
                      className="flex items-start"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <motion.div
                        className="w-2 h-2 bg-[#901b20] rounded-full mt-3 mr-4 flex-shrink-0"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: index * 0.2,
                        }}
                      />
                      <span className="text-lg">{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              <motion.div variants={itemVariants}>
                <h4 className="text-2xl font-bold text-[#203947] mb-6 flex items-center">
                  <BarChart3 className="h-6 w-6 mr-3" />
                  Architecture
                </h4>
                <ul className="space-y-4 text-gray-700">
                  {[
                    'Modular and scalable system design',
                    'Clean RESTful API principles',
                    'Role-based access control and dashboards',
                    'Real-time communication and notifications',
                  ].map((item, index) => (
                    <motion.li
                      key={index}
                      className="flex items-start"
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <motion.div
                        className="w-2 h-2 bg-[#203947] rounded-full mt-3 mr-4 flex-shrink-0"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: index * 0.2,
                        }}
                      />
                      <span className="text-lg">{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
        {/* Animated background decoration */}
        <motion.div
          className="absolute top-40 right-20 w-32 h-32 bg-[#ad565a] rounded-full blur-3xl opacity-5"
          animate={{
            y: [0, -30, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        />
        <motion.div
          className="absolute bottom-40 left-20 w-40 h-40 bg-[#cc9598] rounded-full blur-3xl opacity-5"
          animate={{
            y: [0, 30, 0],
            scale: [1.3, 1, 1.3],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="inline-flex items-center px-4 py-2 bg-[#ad565a]/10 rounded-full text-[#ad565a] text-sm font-medium mb-4"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Users className="h-4 w-4 mr-2" />
              Our talented team
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              A dedicated team of 8 talented developers bringing CommunITI to
              life with passion and expertise
            </p>
          </motion.div>

          {/* Team Stats */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              {
                count: 3,
                label: 'Full-Stack Developers',
                color: 'text-[#901b20]',
              },
              {
                count: 2,
                label: 'Frontend Developers',
                color: 'text-[#203947]',
              },
              {
                count: 3,
                label: 'Backend Developers',
                color: 'text-[#ad565a]',
              },
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="text-center p-8 bg-white rounded-2xl shadow-lg border border-gray-200"
                variants={cardVariants}
                whileHover="hover"
              >
                <motion.div
                  className={`text-4xl font-bold ${stat.color} mb-3`}
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                >
                  {stat.count}
                </motion.div>
                <div className="text-gray-600 text-lg font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Team Grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {teamMembers.map((member, index) => {
              const RoleIcon = getRoleIcon(member.type);
              return (
                <motion.div
                  key={member.id}
                  variants={teamCardVariants}
                  whileHover="hover"
                  custom={index}
                  className="group"
                >
                  <Card className="h-full overflow-hidden bg-white border border-gray-200 transition-all duration-300 shadow-sm hover:shadow-md">
                    <CardContent className="p-0 h-full flex flex-col">
                      {/* Image Section */}
                      <div className="relative overflow-hidden h-72 bg-gradient-to-br from-gray-100 to-gray-200">
                        {member.image ? (
                          <motion.img
                            src={member.image}
                            alt={member.name}
                            className="w-full h-full object-cover brightness-110 contrast-105 filter"
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.3, ease: 'easeOut' }}
                          />
                        ) : (
                          <motion.div
                            className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#901b20]/10 to-[#203947]/10"
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.3, ease: 'easeOut' }}
                          >
                            {/* Professional SVG Avatar Placeholder */}
                            <motion.div
                              className="relative"
                              initial={{ scale: 0 }}
                              whileInView={{ scale: 1 }}
                              viewport={{ once: true }}
                              transition={{
                                duration: 0.5,
                                delay: index * 0.1,
                                type: 'spring',
                                bounce: 0.3,
                              }}
                            >
                              <svg
                                width="140"
                                height="140"
                                viewBox="0 0 140 140"
                                className="text-[#901b20] drop-shadow-lg"
                              >
                                {/* Background circle */}
                                <circle
                                  cx="70"
                                  cy="70"
                                  r="60"
                                  fill="currentColor"
                                  opacity="0.08"
                                  stroke="currentColor"
                                  strokeWidth="1"
                                  strokeOpacity="0.2"
                                />

                                {/* Person silhouette */}
                                <g transform="translate(70, 70)">
                                  {/* Head */}
                                  <circle
                                    cx="0"
                                    cy="-25"
                                    r="15"
                                    fill="currentColor"
                                    opacity="0.3"
                                  />

                                  {/* Suit jacket body */}
                                  <path
                                    d="M -20 -5 L -20 35 L 20 35 L 20 -5 L 15 -10 L 5 -10 L 5 -5 L -5 -5 L -5 -10 L -15 -10 Z"
                                    fill="currentColor"
                                    opacity="0.4"
                                  />

                                  {/* Suit lapels */}
                                  <path
                                    d="M -15 -10 L -10 -5 L -5 -5 L -5 10 L -10 10 L -15 5 Z"
                                    fill="currentColor"
                                    opacity="0.5"
                                  />
                                  <path
                                    d="M 15 -10 L 10 -5 L 5 -5 L 5 10 L 10 10 L 15 5 Z"
                                    fill="currentColor"
                                    opacity="0.5"
                                  />

                                  {/* Shirt/tie area */}
                                  <path
                                    d="M -5 -5 L -5 25 L 5 25 L 5 -5 Z"
                                    fill="currentColor"
                                    opacity="0.2"
                                  />

                                  {/* Tie */}
                                  <path
                                    d="M -2 -5 L -2 20 L 0 22 L 2 20 L 2 -5 Z"
                                    fill="currentColor"
                                    opacity="0.6"
                                  />

                                  {/* Collar */}
                                  <path
                                    d="M -5 -5 L -3 -8 L 0 -10 L 3 -8 L 5 -5"
                                    stroke="currentColor"
                                    strokeWidth="1"
                                    fill="none"
                                    opacity="0.4"
                                  />

                                  {/* Suit buttons */}
                                  <circle
                                    cx="0"
                                    cy="0"
                                    r="1.5"
                                    fill="currentColor"
                                    opacity="0.6"
                                  />
                                  <circle
                                    cx="0"
                                    cy="8"
                                    r="1.5"
                                    fill="currentColor"
                                    opacity="0.6"
                                  />
                                  <circle
                                    cx="0"
                                    cy="16"
                                    r="1.5"
                                    fill="currentColor"
                                    opacity="0.6"
                                  />
                                </g>
                              </svg>

                              {/* Subtle professional accent */}
                              <motion.div
                                className="absolute -top-1 -right-1 text-[#203947]"
                                animate={{
                                  opacity: [0.3, 0.6, 0.3],
                                  scale: [1, 1.1, 1],
                                }}
                                transition={{
                                  duration: 2,
                                  repeat: Infinity,
                                  repeatType: 'reverse',
                                }}
                              >
                                <div className="w-3 h-3 bg-current rounded-full"></div>
                              </motion.div>
                            </motion.div>

                            {/* Cute text below avatar */}
                            <motion.div
                              className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-[#901b20] shadow-sm"
                              initial={{ opacity: 0, y: 10 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true }}
                              transition={{
                                duration: 0.3,
                                delay: index * 0.1 + 0.3,
                              }}
                            >
                              Coming Soon! 📸
                            </motion.div>
                          </motion.div>
                        )}

                        {/* Role badge */}
                        <motion.div
                          className="absolute top-4 right-4"
                          initial={{ opacity: 0, scale: 0 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{
                            duration: 0.3,
                            delay: index * 0.1,
                          }}
                        >
                          <Badge
                            className={`${getRoleBadgeColor(member.type)} border shadow-sm backdrop-blur-sm`}
                          >
                            <RoleIcon className="h-3 w-3 mr-1" />
                            {member.type === 'fullstack'
                              ? 'Full-Stack'
                              : member.type === 'frontend'
                                ? 'Frontend'
                                : 'Backend'}
                          </Badge>
                        </motion.div>
                      </div>

                      {/* Content Section */}
                      <div className="px-6 pb-6 py-0 flex-1 flex flex-col">
                        {/* Name */}
                        <motion.h3
                          className="text-xl font-bold text-gray-900 mb-2"
                          initial={{ opacity: 0, y: 10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                        >
                          {member.name}
                        </motion.h3>

                        {/* Role */}
                        <motion.p
                          className="text-[var(--primary-500)] font-semibold mb-4 text-sm tracking-wide uppercase"
                          initial={{ opacity: 0, y: 10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{
                            duration: 0.3,
                            delay: index * 0.05 + 0.1,
                          }}
                        >
                          {member.role}
                        </motion.p>

                        {/* Social Links */}
                        <motion.div
                          className="flex space-x-4 mt-auto"
                          initial={{ opacity: 0, y: 10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{
                            duration: 0.3,
                            delay: index * 0.05 + 0.2,
                          }}
                        >
                          <motion.a
                            href={member.github}
                            className="p-2 rounded-full bg-gray-100 hover:bg-[var(--primary-500)] text-gray-600 hover:text-white transition-all duration-300"
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Github className="h-4 w-4" />
                          </motion.a>

                          <motion.a
                            href={member.linkedin}
                            className="p-2 rounded-full bg-gray-100 hover:bg-[var(--primary-500)] text-gray-600 hover:text-white transition-all duration-300"
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Linkedin className="h-4 w-4" />
                          </motion.a>

                          <motion.a
                            href={`mailto:${member.name.toLowerCase().replace(' ', '.')}@communiti.com`}
                            className="p-2 rounded-full bg-gray-100 hover:bg-[var(--primary-500)] text-gray-600 hover:text-white transition-all duration-300"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Mail className="h-4 w-4" />
                          </motion.a>
                        </motion.div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      <HomeFooter />
    </div>
  );
};

export default AboutUs;
