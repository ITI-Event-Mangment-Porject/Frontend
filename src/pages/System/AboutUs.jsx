import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import HomeNavbar from "../../components/homePage/HomeNavbar"
import HomeFooter from "../../components/homePage/HomeFooter"
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
} from "lucide-react"

const AboutUs = () => {
  const teamMembers = [
    {
      id: 1,
      name: "Ahmed Hassan",
      role: "Full-Stack Developer",
      type: "fullstack",
      bio: "Lead developer specializing in React and Node.js with expertise in system architecture and database design.",
      image: "/placeholder.svg?height=200&width=200",
      skills: ["React", "Node.js", "MongoDB", "System Design"],
      github: "https://github.com/ahmed-hassan",
      linkedin: "https://linkedin.com/in/ahmed-hassan",
    },
    {
      id: 2,
      name: "Fatima Al-Zahra",
      role: "Full-Stack Developer",
      type: "fullstack",
      bio: "Full-stack engineer with strong background in authentication systems and API development.",
      image: "/placeholder.svg?height=200&width=200",
      skills: ["Vue.js", "Express.js", "PostgreSQL", "JWT Auth"],
      github: "https://github.com/fatima-alzahra",
      linkedin: "https://linkedin.com/in/fatima-alzahra",
    },
    {
      id: 3,
      name: "Omar Mahmoud",
      role: "Full-Stack Developer",
      type: "fullstack",
      bio: "Experienced in building scalable web applications with focus on performance optimization.",
      image: "/placeholder.svg?height=200&width=200",
      skills: ["Angular", "Spring Boot", "MySQL", "Docker"],
      github: "https://github.com/omar-mahmoud",
      linkedin: "https://linkedin.com/in/omar-mahmoud",
    },
    {
      id: 4,
      name: "Nour Abdel-Rahman",
      role: "Frontend Developer",
      type: "frontend",
      bio: "UI/UX focused developer creating beautiful and intuitive user interfaces with modern frameworks.",
      image: "/placeholder.svg?height=200&width=200",
      skills: ["React", "Tailwind CSS", "Figma", "TypeScript"],
      github: "https://github.com/nour-abdel-rahman",
      linkedin: "https://linkedin.com/in/nour-abdel-rahman",
    },
    {
      id: 5,
      name: "Khaled Ibrahim",
      role: "Frontend Developer",
      type: "frontend",
      bio: "Frontend specialist with expertise in responsive design and modern JavaScript frameworks.",
      image: "/placeholder.svg?height=200&width=200",
      skills: ["Vue.js", "SCSS", "Webpack", "Jest"],
      github: "https://github.com/khaled-ibrahim",
      linkedin: "https://linkedin.com/in/khaled-ibrahim",
    },
    {
      id: 6,
      name: "Yasmin Farouk",
      role: "Backend Developer",
      type: "backend",
      bio: "Backend engineer specializing in API development, database optimization, and cloud services.",
      image: "/placeholder.svg?height=200&width=200",
      skills: ["Python", "Django", "Redis", "AWS"],
      github: "https://github.com/yasmin-farouk",
      linkedin: "https://linkedin.com/in/yasmin-farouk",
    },
    {
      id: 7,
      name: "Mohamed Ali",
      role: "Backend Developer",
      type: "backend",
      bio: "Server-side developer with strong focus on microservices architecture and data processing.",
      image: "/placeholder.svg?height=200&width=200",
      skills: ["Java", "Spring", "Kafka", "Elasticsearch"],
      github: "https://github.com/mohamed-ali",
      linkedin: "https://linkedin.com/in/mohamed-ali",
    },
    {
      id: 8,
      name: "Layla Mostafa",
      role: "Backend Developer",
      type: "backend",
      bio: "Database architect and backend developer with expertise in real-time systems and analytics.",
      image: "/placeholder.svg?height=200&width=200",
      skills: ["Node.js", "GraphQL", "MongoDB", "Socket.io"],
      github: "https://github.com/layla-mostafa",
      linkedin: "https://linkedin.com/in/layla-mostafa",
    },
  ]

  const features = [
    {
      icon: Shield,
      title: "SSO Authentication",
      description: "Seamless integration with ITI Portal for secure single sign-on access",
      gradient: "from-blue-500/10 to-blue-600/10",
      iconColor: "text-blue-600",
    },
    {
      icon: Calendar,
      title: "Event Management",
      description: "Comprehensive tools for managing job fairs, workshops, and educational events",
      gradient: "from-green-500/10 to-green-600/10",
      iconColor: "text-green-600",
    },
    {
      icon: Users,
      title: "Smart Queue System",
      description: "Intelligent interview queue management ensuring smooth job fair operations",
      gradient: "from-purple-500/10 to-purple-600/10",
      iconColor: "text-purple-600",
    },
    {
      icon: Building2,
      title: "Company Integration",
      description: "Complete company participation workflow with job profile management",
      gradient: "from-orange-500/10 to-orange-600/10",
      iconColor: "text-orange-600",
    },
    {
      icon: Brain,
      title: "AI-Powered Analytics",
      description: "Advanced feedback analysis and insights generation using artificial intelligence",
      gradient: "from-pink-500/10 to-pink-600/10",
      iconColor: "text-pink-600",
    },
    {
      icon: MessageSquare,
      title: "Communication Hub",
      description: "Streamlined notifications and bulk messaging system for all stakeholders",
      gradient: "from-indigo-500/10 to-indigo-600/10",
      iconColor: "text-indigo-600",
    },
  ]

  const getRoleIcon = (type) => {
    switch (type) {
      case "fullstack":
        return Code
      case "frontend":
        return Palette
      case "backend":
        return Database
      default:
        return Code
    }
  }

  const getRoleBadgeColor = (type) => {
    switch (type) {
      case "fullstack":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "frontend":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "backend":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <HomeNavbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#901b20] via-[#ad565a] to-[#203947] text-white pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl animate-float-reverse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-white/5 to-transparent rounded-full blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium mb-6 animate-fade-in">
            <Sparkles className="h-4 w-4 mr-2" />
            Meet the team behind CommunITI
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
            About CommunITI
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed animate-slide-in-up">
            Revolutionizing educational and career event management through innovative technology
          </p>
        </div>
      </section>

      {/* Project Overview */}
      <section className="py-20 bg-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-full opacity-5">
          <div className="absolute top-20 left-20 w-40 h-40 bg-[#901b20] rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-60 h-60 bg-[#203947] rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-[#901b20]/10 rounded-full text-[#901b20] text-sm font-medium mb-4">
              <Target className="h-4 w-4 mr-2" />
              Our Mission
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Our Platform</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              CommunITI is a centralized web platform designed for managing educational and career-related events such
              as job fairs, workshops, and fun days with cutting-edge technology and user-centric design.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {features.map((feature, index) => {
              const IconComponent = feature.icon
              return (
                <Card
                  key={index}
                  className="group hover:shadow-2xl transition-all duration-500 border-gray-200 hover:border-[#901b20]/20 transform hover:-translate-y-2 bg-gradient-to-br from-white to-gray-50/50"
                >
                  <CardContent className="p-8">
                    <div className="flex items-center mb-6">
                      <div
                        className={`p-4 bg-gradient-to-r ${feature.gradient} rounded-2xl group-hover:scale-110 transition-transform duration-300`}
                      >
                        <IconComponent className={`h-7 w-7 ${feature.iconColor}`} />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Technical Architecture */}
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 md:p-12 border border-gray-200 shadow-lg">
            <div className="text-center mb-12">
              <div className="inline-flex items-center px-4 py-2 bg-[#203947]/10 rounded-full text-[#203947] text-sm font-medium mb-4">
                <Award className="h-4 w-4 mr-2" />
                Technical Excellence
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Built for Scale</h3>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Our platform is built with modern technologies and follows industry best practices
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h4 className="text-2xl font-bold text-[#901b20] mb-6 flex items-center">
                  <Zap className="h-6 w-6 mr-3" />
                  Key Features
                </h4>
                <ul className="space-y-4 text-gray-700">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-[#901b20] rounded-full mt-3 mr-4 flex-shrink-0"></div>
                    <span className="text-lg">Single Sign-On (SSO) authentication via ITI Portal</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-[#901b20] rounded-full mt-3 mr-4 flex-shrink-0"></div>
                    <span className="text-lg">Detailed event and session planning tools</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-[#901b20] rounded-full mt-3 mr-4 flex-shrink-0"></div>
                    <span className="text-lg">Smart interview queue system with real-time updates</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-[#901b20] rounded-full mt-3 mr-4 flex-shrink-0"></div>
                    <span className="text-lg">AI-powered feedback analysis and insights</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-2xl font-bold text-[#203947] mb-6 flex items-center">
                  <BarChart3 className="h-6 w-6 mr-3" />
                  Architecture
                </h4>
                <ul className="space-y-4 text-gray-700">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-[#203947] rounded-full mt-3 mr-4 flex-shrink-0"></div>
                    <span className="text-lg">Modular and scalable system design</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-[#203947] rounded-full mt-3 mr-4 flex-shrink-0"></div>
                    <span className="text-lg">Clean RESTful API principles</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-[#203947] rounded-full mt-3 mr-4 flex-shrink-0"></div>
                    <span className="text-lg">Role-based access control and dashboards</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-[#203947] rounded-full mt-3 mr-4 flex-shrink-0"></div>
                    <span className="text-lg">Real-time communication and notifications</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-full opacity-5">
          <div className="absolute top-40 right-20 w-32 h-32 bg-[#ad565a] rounded-full blur-3xl"></div>
          <div className="absolute bottom-40 left-20 w-40 h-40 bg-[#cc9598] rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-[#ad565a]/10 rounded-full text-[#ad565a] text-sm font-medium mb-4">
              <Users className="h-4 w-4 mr-2" />
              Our talented team
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Meet Our Team</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              A dedicated team of 8 talented developers bringing CommunITI to life with passion and expertise
            </p>
          </div>

          {/* Team Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="text-center p-8 bg-white rounded-2xl shadow-lg border border-gray-200 transform hover:-translate-y-1 transition-all duration-300">
              <div className="text-4xl font-bold text-[#901b20] mb-3">3</div>
              <div className="text-gray-600 text-lg font-medium">Full-Stack Developers</div>
            </div>
            <div className="text-center p-8 bg-white rounded-2xl shadow-lg border border-gray-200 transform hover:-translate-y-1 transition-all duration-300">
              <div className="text-4xl font-bold text-[#203947] mb-3">2</div>
              <div className="text-gray-600 text-lg font-medium">Frontend Developers</div>
            </div>
            <div className="text-center p-8 bg-white rounded-2xl shadow-lg border border-gray-200 transform hover:-translate-y-1 transition-all duration-300">
              <div className="text-4xl font-bold text-[#ad565a] mb-3">3</div>
              <div className="text-gray-600 text-lg font-medium">Backend Developers</div>
            </div>
          </div>

          {/* Team Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member) => {
              const RoleIcon = getRoleIcon(member.type)
              return (
                <Card
                  key={member.id}
                  className="group hover:shadow-2xl transition-all duration-500 border-gray-200 hover:border-[#901b20]/20 overflow-hidden transform hover:-translate-y-2 bg-gradient-to-br from-white to-gray-50/50"
                >
                  <CardContent className="p-0">
                    <div className="relative">
                      <img
                        src={member.image || "/placeholder.svg"}
                        alt={member.name}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-4 right-4">
                        <Badge className={`${getRoleBadgeColor(member.type)} border shadow-sm`}>
                          <RoleIcon className="h-3 w-3 mr-1" />
                          {member.type === "fullstack"
                            ? "Full-Stack"
                            : member.type === "frontend"
                              ? "Frontend"
                              : "Backend"}
                        </Badge>
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                      <p className="text-[#901b20] font-semibold mb-3">{member.role}</p>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">{member.bio}</p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {member.skills.slice(0, 3).map((skill, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                          >
                            {skill}
                          </Badge>
                        ))}
                        {member.skills.length > 3 && (
                          <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                            +{member.skills.length - 3}
                          </Badge>
                        )}
                      </div>

                      <div className="flex space-x-3">
                        <a
                          href={member.github}
                          className="text-gray-400 hover:text-[#901b20] transition-colors transform hover:scale-110"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Github className="h-5 w-5" />
                        </a>
                        <a
                          href={member.linkedin}
                          className="text-gray-400 hover:text-[#203947] transition-colors transform hover:scale-110"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Linkedin className="h-5 w-5" />
                        </a>
                        <a
                          href={`mailto:${member.name.toLowerCase().replace(" ", ".")}@communiti.com`}
                          className="text-gray-400 hover:text-[#ad565a] transition-colors transform hover:scale-110"
                        >
                          <Mail className="h-5 w-5" />
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      <HomeFooter />
    </div>
  )
}

export default AboutUs
