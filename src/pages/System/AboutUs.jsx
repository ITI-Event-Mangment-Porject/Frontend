import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
} from 'lucide-react';

const AboutUs = () => {
  const teamMembers = [
    {
      id: 1,
      name: 'Ahmed Hassan',
      role: 'Full-Stack Developer',
      type: 'fullstack',
      bio: 'Lead developer specializing in React and Node.js with expertise in system architecture and database design.',
      image: '/placeholder.svg?height=200&width=200',
      skills: ['React', 'Node.js', 'MongoDB', 'System Design'],
      github: 'https://github.com/ahmed-hassan',
      linkedin: 'https://linkedin.com/in/ahmed-hassan',
    },
    {
      id: 2,
      name: 'Fatima Al-Zahra',
      role: 'Full-Stack Developer',
      type: 'fullstack',
      bio: 'Full-stack engineer with strong background in authentication systems and API development.',
      image: '/placeholder.svg?height=200&width=200',
      skills: ['Vue.js', 'Express.js', 'PostgreSQL', 'JWT Auth'],
      github: 'https://github.com/fatima-alzahra',
      linkedin: 'https://linkedin.com/in/fatima-alzahra',
    },
    {
      id: 3,
      name: 'Omar Mahmoud',
      role: 'Full-Stack Developer',
      type: 'fullstack',
      bio: 'Experienced in building scalable web applications with focus on performance optimization.',
      image: '/placeholder.svg?height=200&width=200',
      skills: ['Angular', 'Spring Boot', 'MySQL', 'Docker'],
      github: 'https://github.com/omar-mahmoud',
      linkedin: 'https://linkedin.com/in/omar-mahmoud',
    },
    {
      id: 4,
      name: 'Nour Abdel-Rahman',
      role: 'Frontend Developer',
      type: 'frontend',
      bio: 'UI/UX focused developer creating beautiful and intuitive user interfaces with modern frameworks.',
      image: '/placeholder.svg?height=200&width=200',
      skills: ['React', 'Tailwind CSS', 'Figma', 'TypeScript'],
      github: 'https://github.com/nour-abdel-rahman',
      linkedin: 'https://linkedin.com/in/nour-abdel-rahman',
    },
    {
      id: 5,
      name: 'Khaled Ibrahim',
      role: 'Frontend Developer',
      type: 'frontend',
      bio: 'Frontend specialist with expertise in responsive design and modern JavaScript frameworks.',
      image: '/placeholder.svg?height=200&width=200',
      skills: ['Vue.js', 'SCSS', 'Webpack', 'Jest'],
      github: 'https://github.com/khaled-ibrahim',
      linkedin: 'https://linkedin.com/in/khaled-ibrahim',
    },
    {
      id: 6,
      name: 'Yasmin Farouk',
      role: 'Backend Developer',
      type: 'backend',
      bio: 'Backend engineer specializing in API development, database optimization, and cloud services.',
      image: '/placeholder.svg?height=200&width=200',
      skills: ['Python', 'Django', 'Redis', 'AWS'],
      github: 'https://github.com/yasmin-farouk',
      linkedin: 'https://linkedin.com/in/yasmin-farouk',
    },
    {
      id: 7,
      name: 'Mohamed Ali',
      role: 'Backend Developer',
      type: 'backend',
      bio: 'Server-side developer with strong focus on microservices architecture and data processing.',
      image: '/placeholder.svg?height=200&width=200',
      skills: ['Java', 'Spring', 'Kafka', 'Elasticsearch'],
      github: 'https://github.com/mohamed-ali',
      linkedin: 'https://linkedin.com/in/mohamed-ali',
    },
    {
      id: 8,
      name: 'Layla Mostafa',
      role: 'Backend Developer',
      type: 'backend',
      bio: 'Database architect and backend developer with expertise in real-time systems and analytics.',
      image: '/placeholder.svg?height=200&width=200',
      skills: ['Node.js', 'GraphQL', 'MongoDB', 'Socket.io'],
      github: 'https://github.com/layla-mostafa',
      linkedin: 'https://linkedin.com/in/layla-mostafa',
    },
  ];

  const features = [
    {
      icon: Shield,
      title: 'SSO Authentication',
      description:
        'Seamless integration with ITI Portal for secure single sign-on access',
    },
    {
      icon: Calendar,
      title: 'Event Management',
      description:
        'Comprehensive tools for managing job fairs, workshops, and educational events',
    },
    {
      icon: Users,
      title: 'Smart Queue System',
      description:
        'Intelligent interview queue management ensuring smooth job fair operations',
    },
    {
      icon: Building2,
      title: 'Company Integration',
      description:
        'Complete company participation workflow with job profile management',
    },
    {
      icon: Brain,
      title: 'AI-Powered Analytics',
      description:
        'Advanced feedback analysis and insights generation using artificial intelligence',
    },
    {
      icon: MessageSquare,
      title: 'Communication Hub',
      description:
        'Streamlined notifications and bulk messaging system for all stakeholders',
    },
  ];

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
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#901b20] via-[#ad565a] to-[#203947] text-white py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
            About CommunITI
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            Revolutionizing educational and career event management through
            innovative technology
          </p>
        </div>
      </section>

      {/* Project Overview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our Platform
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              CommunITI is a centralized web platform designed for managing
              educational and career-related events such as job fairs,
              workshops, and fun days with cutting-edge technology and
              user-centric design.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card
                  key={index}
                  className="group hover:shadow-lg transition-all duration-300 border-gray-200 hover:border-[#901b20]/20"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="p-3 bg-[#901b20]/10 rounded-lg group-hover:bg-[#901b20]/20 transition-colors">
                        <IconComponent className="h-6 w-6 text-[#901b20]" />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Technical Architecture */}
          <div className="bg-gray-50 rounded-2xl p-8 md:p-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Technical Excellence
            </h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-xl font-semibold text-[#901b20] mb-4 flex items-center">
                  <Zap className="h-5 w-5 mr-2" />
                  Key Features
                </h4>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-[#901b20] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    Single Sign-On (SSO) authentication via ITI Portal
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-[#901b20] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    Detailed event and session planning tools
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-[#901b20] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    Smart interview queue system with real-time updates
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-[#901b20] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    AI-powered feedback analysis and insights
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-xl font-semibold text-[#203947] mb-4 flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Architecture
                </h4>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-[#203947] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    Modular and scalable system design
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-[#203947] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    Clean RESTful API principles
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-[#203947] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    Role-based access control and dashboards
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-[#203947] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    Real-time communication and notifications
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              A dedicated team of 8 talented developers bringing CommunITI to
              life with passion and expertise
            </p>
          </div>

          {/* Team Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="text-3xl font-bold text-[#901b20] mb-2">3</div>
              <div className="text-gray-600">Full-Stack Developers</div>
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="text-3xl font-bold text-[#203947] mb-2">2</div>
              <div className="text-gray-600">Frontend Developers</div>
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="text-3xl font-bold text-[#ad565a] mb-2">3</div>
              <div className="text-gray-600">Backend Developers</div>
            </div>
          </div>

          {/* Team Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map(member => {
              const RoleIcon = getRoleIcon(member.type);
              return (
                <Card
                  key={member.id}
                  className="group hover:shadow-xl transition-all duration-300 border-gray-200 hover:border-[#901b20]/20 overflow-hidden"
                >
                  <CardContent className="p-0">
                    <div className="relative">
                      <img
                        src={member.image || '/placeholder.svg'}
                        alt={member.name}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-4 right-4">
                        <Badge
                          className={`${getRoleBadgeColor(member.type)} border`}
                        >
                          <RoleIcon className="h-3 w-3 mr-1" />
                          {member.type === 'fullstack'
                            ? 'Full-Stack'
                            : member.type === 'frontend'
                              ? 'Frontend'
                              : 'Backend'}
                        </Badge>
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-1">
                        {member.name}
                      </h3>
                      <p className="text-[#901b20] font-medium mb-3">
                        {member.role}
                      </p>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {member.bio}
                      </p>

                      <div className="flex flex-wrap gap-1 mb-4">
                        {member.skills.slice(0, 3).map((skill, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs bg-gray-100 text-gray-700"
                          >
                            {skill}
                          </Badge>
                        ))}
                        {member.skills.length > 3 && (
                          <Badge
                            variant="secondary"
                            className="text-xs bg-gray-100 text-gray-700"
                          >
                            +{member.skills.length - 3}
                          </Badge>
                        )}
                      </div>

                      <div className="flex space-x-3">
                        <a
                          href={member.github}
                          className="text-gray-400 hover:text-[#901b20] transition-colors"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Github className="h-5 w-5" />
                        </a>
                        <a
                          href={member.linkedin}
                          className="text-gray-400 hover:text-[#203947] transition-colors"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Linkedin className="h-5 w-5" />
                        </a>
                        <a
                          href={`mailto:${member.name.toLowerCase().replace(' ', '.')}@communiti.com`}
                          className="text-gray-400 hover:text-[#ad565a] transition-colors"
                        >
                          <Mail className="h-5 w-5" />
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-[#901b20] to-[#203947] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Transform Your Events?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join the future of event management with CommunITI's innovative
            platform designed for the modern educational landscape.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="button bg-white text-[#901b20] hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors">
              Get Started
            </button>
            <button className="button bg-transparent border-2 border-white text-white hover:bg-white hover:text-[#901b20] px-8 py-3 rounded-lg font-semibold transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
