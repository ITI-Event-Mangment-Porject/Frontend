"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import HomeNavbar from "../../components/homePage/HomeNavbar"
import HomeFooter from "../../components/homePage/HomeFooter"
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  MessageSquare,
  Users,
  Building2,
  Calendar,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Shield,
  Zap,
} from "lucide-react"

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    category: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)

  const contactInfo = [
    {
      icon: MapPin,
      title: "Address",
      details: ["Information Technology Institute (ITI)", "Mansoura, Egypt"],
      color: "text-[#901b20]",
      bgColor: "bg-[#901b20]/10",
      hoverBg: "group-hover:bg-[#901b20]/20",
    },
    {
      icon: Phone,
      title: "Phone",
      details: ["+20 1021094362", "+20 1014248145", "Available 9 AM - 4 PM"],
      color: "text-[#203947]",
      bgColor: "bg-[#203947]/10",
      hoverBg: "group-hover:bg-[#203947]/20",
    },
    {
      icon: Mail,
      title: "Email",
      details: ["support@communiti.iti.gov.eg", "admin@communiti.iti.gov.eg", "Response within 24 hours"],
      color: "text-[#ad565a]",
      bgColor: "bg-[#ad565a]/10",
      hoverBg: "group-hover:bg-[#ad565a]/20",
    },
    {
      icon: Clock,
      title: "Working Hours",
      details: ["Sunday - Thursday", "9:00 AM - 6:00 PM", "Saturday - Friday: Closed"],
      color: "text-[#cc9598]",
      bgColor: "bg-[#cc9598]/10",
      hoverBg: "group-hover:bg-[#cc9598]/20",
    },
  ]

  const inquiryTypes = [
    {
      icon: Users,
      title: "Student Support",
      description: "Registration issues, event queries, profile management",
      category: "student",
      gradient: "from-blue-500/10 to-blue-600/10",
      iconColor: "text-blue-600",
    },
    {
      icon: Building2,
      title: "Company Relations",
      description: "Partnership opportunities, job fair participation",
      category: "company",
      gradient: "from-green-500/10 to-green-600/10",
      iconColor: "text-green-600",
    },
    {
      icon: Calendar,
      title: "Event Management",
      description: "Event planning, technical support, scheduling",
      category: "event",
      gradient: "from-purple-500/10 to-purple-600/10",
      iconColor: "text-purple-600",
    },
    {
      icon: MessageSquare,
      title: "General Inquiry",
      description: "Platform information, feedback, suggestions",
      category: "general",
      gradient: "from-orange-500/10 to-orange-600/10",
      iconColor: "text-orange-600",
    },
  ]

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setSubmitStatus("success")
      setFormData({
        name: "",
        email: "",
        subject: "",
        category: "",
        message: "",
      })
    } catch (error) {
      setSubmitStatus("error")
    } finally {
      setIsSubmitting(false)
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
            Get in touch with our team
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
            Contact Us
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed animate-slide-in-up">
            We're here to help you make the most of CommunITI. Reach out for support, partnerships, or any questions.
          </p>
        </div>
      </section>

      {/* Contact Information Cards */}
      <section className="py-20 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-[#901b20]/10 rounded-full text-[#901b20] text-sm font-medium mb-4">
              <Shield className="h-4 w-4 mr-2" />
              Multiple ways to reach us
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Get In Touch</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose the most convenient way to connect with our team
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {contactInfo.map((info, index) => {
              const IconComponent = info.icon
              return (
                <Card
                  key={index}
                  className="group hover:shadow-2xl transition-all duration-500 border-gray-200 hover:border-[#901b20]/30 transform hover:-translate-y-2 bg-gradient-to-br from-white to-gray-50/50"
                >
                  <CardContent className="p-8 text-center">
                    <div className="flex justify-center mb-6">
                      <div
                        className={`p-4 ${info.bgColor} ${info.hoverBg} rounded-2xl transition-all duration-300 group-hover:scale-110`}
                      >
                        <IconComponent className={`h-8 w-8 ${info.color}`} />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">{info.title}</h3>
                    <div className="space-y-2">
                      {info.details.map((detail, idx) => (
                        <p key={idx} className="text-gray-600 text-sm leading-relaxed">
                          {detail}
                        </p>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Contact Form and Inquiry Types */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-full opacity-5">
          <div className="absolute top-20 left-20 w-40 h-40 bg-[#901b20] rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-60 h-60 bg-[#203947] rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div className="order-2 lg:order-1">
              <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-8">
                  <CardTitle className="text-3xl font-bold text-gray-900 flex items-center">
                    <div className="p-2 bg-[#901b20]/10 rounded-lg mr-4">
                      <Send className="h-6 w-6 text-[#901b20]" />
                    </div>
                    Send us a Message
                  </CardTitle>
                  <p className="text-gray-600 text-lg">
                    Fill out the form below and we'll get back to you within 24 hours.
                  </p>
                </CardHeader>
                <CardContent className="pt-0">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-3">
                          Full Name *
                        </label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          required
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full h-12 border-gray-300 focus:border-[#901b20] focus:ring-[#901b20] rounded-lg"
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-3">
                          Email Address *
                        </label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full h-12 border-gray-300 focus:border-[#901b20] focus:ring-[#901b20] rounded-lg"
                          placeholder="Enter your email"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-3">
                        Inquiry Type *
                      </label>
                      <select
                        id="category"
                        name="category"
                        required
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full h-12 px-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#901b20] focus:border-[#901b20] bg-white"
                      >
                        <option value="">Select inquiry type</option>
                        <option value="student">Student Support</option>
                        <option value="company">Company Relations</option>
                        <option value="event">Event Management</option>
                        <option value="general">General Inquiry</option>
                        <option value="technical">Technical Support</option>
                        <option value="partnership">Partnership</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-3">
                        Subject *
                      </label>
                      <Input
                        id="subject"
                        name="subject"
                        type="text"
                        required
                        value={formData.subject}
                        onChange={handleInputChange}
                        className="w-full h-12 border-gray-300 focus:border-[#901b20] focus:ring-[#901b20] rounded-lg"
                        placeholder="Brief description of your inquiry"
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-3">
                        Message *
                      </label>
                      <Textarea
                        id="message"
                        name="message"
                        required
                        value={formData.message}
                        onChange={handleInputChange}
                        rows={6}
                        className="w-full border-gray-300 focus:border-[#901b20] focus:ring-[#901b20] rounded-lg resize-none"
                        placeholder="Please provide detailed information about your inquiry..."
                      />
                    </div>

                    {submitStatus === "success" && (
                      <div className="flex items-center p-4 bg-green-50 border border-green-200 rounded-xl animate-fade-in">
                        <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                        <p className="text-green-800 font-medium">
                          Message sent successfully! We'll get back to you soon.
                        </p>
                      </div>
                    )}

                    {submitStatus === "error" && (
                      <div className="flex items-center p-4 bg-red-50 border border-red-200 rounded-xl animate-fade-in">
                        <AlertCircle className="h-5 w-5 text-red-600 mr-3" />
                        <p className="text-red-800 font-medium">Failed to send message. Please try again.</p>
                      </div>
                    )}

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-[#901b20] to-[#ad565a] hover:from-[#7a171c] hover:to-[#901b20] text-white py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 disabled:opacity-50 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                          Sending Message...
                        </>
                      ) : (
                        <>
                          <Send className="h-5 w-5 mr-3" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Inquiry Types */}
            <div className="order-1 lg:order-2">
              <div className="sticky top-8">
                <div className="mb-8">
                  <div className="inline-flex items-center px-4 py-2 bg-[#203947]/10 rounded-full text-[#203947] text-sm font-medium mb-4">
                    <Zap className="h-4 w-4 mr-2" />
                    Choose your inquiry type
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">How Can We Help?</h3>
                  <p className="text-gray-600 text-lg">Select the category that best matches your needs</p>
                </div>

                <div className="space-y-4">
                  {inquiryTypes.map((type, index) => {
                    const IconComponent = type.icon
                    return (
                      <div
                        key={index}
                        className={`group p-6 bg-gradient-to-r ${type.gradient} border border-gray-200 rounded-2xl hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1 hover:border-gray-300`}
                        onClick={() => setFormData((prev) => ({ ...prev, category: type.category }))}
                      >
                        <div className="flex items-start">
                          <div className="p-3 bg-white rounded-xl shadow-sm group-hover:shadow-md transition-shadow mr-4">
                            <IconComponent className={`h-6 w-6 ${type.iconColor}`} />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-900 mb-2 text-lg">{type.title}</h4>
                            <p className="text-gray-600 leading-relaxed">{type.description}</p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Additional Info */}
                <div className="mt-8 p-6 bg-gradient-to-r from-[#901b20]/5 to-[#203947]/5 rounded-2xl border border-gray-200">
                  <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                    <Clock className="h-5 w-5 text-[#901b20] mr-2" />
                    Response Times
                  </h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>General Inquiries:</span>
                      <span className="font-medium">Within 24 hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Technical Support:</span>
                      <span className="font-medium">Within 4 hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Emergency Issues:</span>
                      <span className="font-medium">Immediate</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <HomeFooter />
    </div>
  )
}

export default ContactUs
