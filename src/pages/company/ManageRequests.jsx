import React, { useState } from 'react';
import { User, Phone, Mail, MapPin, GraduationCap, Calendar, FileText, CheckCircle, XCircle, Clock, Users, Award, BookOpen, Menu, X } from 'lucide-react';

const StudentRequestDashboard = () => {
  const [selectedStudent, setSelectedStudent] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const students = [
    {
      id: 1,
      name: "Alice Johnson",
      avatar: "👩‍💼",
      status: "pending",
      date: "Requested on 2024-07-15",
      program: "Software Engineering Internship - Summer 2025",
      university: "State University",
      phone: "(555) 123-4567",
      email: "alice@example.com",
      gpa: "3.5",
      major: "Computer Science",
      portfolio: "alicejohnson.com",
      skills: ["React", "Node.js", "Python", "Database Management", "Cloud Computing"],
      position: "Software Engineering Internship - Summer 2025",
      interviewType: "Technical Interview",
      preferredDate: "Aug 5 - Aug 15",
      documents: [
        "Resume_AliceJohnson.pdf",
        "CoverLetter_Alice.pdf",
        "Transcript_AliceJohnson.pdf"
      ],
      notes: "Seeking experience in large-scale system design and eager to contribute to innovative projects."
    },
    {
      id: 2,
      name: "Bob Williams",
      avatar: "👨‍💻",
      status: "pending",
      date: "Requested on 2024-07-08",
      program: "Robotics Software Position",
      university: "Tech Institute",
      phone: "(555) 987-6543",
      email: "bob@example.com",
      gpa: "3.8",
      major: "Robotics Engineering",
      portfolio: "bobwilliams.dev",
      skills: ["C++", "Python", "ROS", "Machine Learning", "Computer Vision"],
      position: "Robotics Software Engineer",
      interviewType: "Technical + Behavioral",
      preferredDate: "Aug 10 - Aug 20",
      documents: [
        "Resume_BobWilliams.pdf",
        "Portfolio_Bob.pdf"
      ],
      notes: "Strong background in autonomous systems and AI applications."
    },
    {
      id: 3,
      name: "Charlie Brown",
      avatar: "👨‍🎓",
      status: "approved",
      date: "Requested on 2024-07-12",
      program: "Data Analyst Internship",
      university: "Analytics College",
      phone: "(555) 456-7890",
      email: "charlie@example.com",
      gpa: "3.7",
      major: "Data Science",
      portfolio: "charliebrown.io",
      skills: ["Python", "R", "SQL", "Tableau", "Statistics"],
      position: "Data Analyst Intern",
      interviewType: "Case Study",
      preferredDate: "Aug 1 - Aug 15",
      documents: [
        "Resume_CharlieBrown.pdf",
        "DataProject_Charlie.pdf"
      ],
      notes: "Passionate about data visualization and predictive analytics."
    },
    {
      id: 4,
      name: "Diana Prince",
      avatar: "👩‍🔬",
      status: "rejected",
      date: "Requested on 2024-07-07",
      program: "UX/UI Designer Role",
      university: "Design Academy",
      phone: "(555) 321-9876",
      email: "diana@example.com",
      gpa: "3.6",
      major: "Interaction Design",
      portfolio: "dianaprince.design",
      skills: ["Figma", "Adobe XD", "User Research", "Prototyping", "HTML/CSS"],
      position: "UX/UI Designer",
      interviewType: "Portfolio Review",
      preferredDate: "Jul 25 - Aug 5",
      documents: [
        "Resume_DianaPrince.pdf",
        "Portfolio_Diana.pdf"
      ],
      notes: "Strong portfolio showcasing user-centered design solutions."
    },
    {
      id: 5,
      name: "Eve Adams",
      avatar: "👩‍🔬",
      status: "pending",
      date: "Requested on 2024-07-14",
      program: "Biomedical Research Assistant",
      university: "Medical University",
      phone: "(555) 654-3210",
      email: "eve@example.com",
      gpa: "3.9",
      major: "Biomedical Engineering",
      portfolio: "eveadams.research.com",
      skills: ["MATLAB", "Python", "Lab Protocols", "Data Analysis", "Research Methods"],
      position: "Research Assistant",
      interviewType: "Research Presentation",
      preferredDate: "Aug 15 - Aug 30",
      documents: [
        "Resume_EveAdams.pdf",
        "ResearchPaper_Eve.pdf"
      ],
      notes: "Published researcher with focus on medical device development."
    }
  ];

  const recentActivity = [
    { type: "request", text: "New request from Alice Johnson for Software Engineering Internship", time: "2 hours ago", icon: <FileText className="w-4 h-4" /> },
    { type: "review", text: "Ben Williams's request moved to pending review", time: "4 hours ago", icon: <Clock className="w-4 h-4" /> },
    { type: "approved", text: "Charlie Brown's Data Analyst internship application approved", time: "1 day ago", icon: <CheckCircle className="w-4 h-4 text-green-500" /> },
    { type: "interview", text: "Scheduled interview for Charlie Brown on Aug 10", time: "1 day ago", icon: <Calendar className="w-4 h-4" /> },
    { type: "rejected", text: "Rejected Dana Prince's UI/UX Designer application", time: "2 days ago", icon: <XCircle className="w-4 h-4 text-red-500" /> },
    { type: "review", text: "Reviewed Eve Adams's Biomedical Research Assistant application", time: "3 days ago", icon: <Award className="w-4 h-4" /> }
  ];

  const stats = [
    { label: "Pending Reviews", value: "3", color: "text-orange-700", bg: "bg-gradient-to-br from-orange-50 to-orange-100", border: "border-orange-200" },
    { label: "Approved", value: "1", color: "text-green-700", bg: "bg-gradient-to-br from-green-50 to-green-100", border: "border-green-200" },
    { label: "Interviews", value: "5", color: "text-blue-700", bg: "bg-gradient-to-br from-blue-50 to-blue-100", border: "border-blue-200" },
    { label: "Total Applicants", value: "5", color: "text-purple-700", bg: "bg-gradient-to-br from-purple-50 to-purple-100", border: "border-purple-200" }
  ];

  const currentStudent = students[selectedStudent];

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800 border border-orange-300';
      case 'approved': return 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300';
      case 'rejected': return 'bg-gradient-to-r from-red-100 to-red-200 text-red-800 border border-red-300';
      default: return 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border border-gray-300';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white shadow-sm border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">Student Requests</h1>
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={closeSidebar}
          />
        )}

        {/* Sidebar */}
        <div className={`
          fixed lg:relative inset-y-0 left-0 z-50 lg:z-0
          w-80 bg-white shadow-lg lg:shadow-sm border-r border-gray-200
          transform transition-transform duration-300 ease-in-out lg:transform-none
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-[#901b20] to-[#ad565a]">
            <h1 className="text-xl font-bold text-white">Student Requests</h1>
          </div>
          
          <div className="overflow-y-auto h-full pb-20 lg:pb-0">
            {students.map((student, index) => (
              <div
                key={student.id}
                onClick={() => {
                  setSelectedStudent(index);
                  closeSidebar();
                }}
                className={`p-4 border-b border-gray-100 cursor-pointer transition-all duration-200 transform hover:scale-[1.02] ${
                  selectedStudent === index 
                    ? 'bg-gradient-to-r from-[#901b20]/10 to-[#ad565a]/10 border-l-4 border-l-[#901b20] shadow-md' 
                    : 'hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:shadow-sm'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="text-2xl transform hover:scale-110 transition-transform duration-200">{student.avatar}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900 truncate hover:text-[#901b20] transition-colors">{student.name}</h3>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium shadow-sm ${getStatusColor(student.status)}`}>
                        {getStatusIcon(student.status)}
                        <span className="ml-1 capitalize">{student.status}</span>
                      </span>
                    </div>
                    <p className="text-sm text-[#203947] mt-1">{student.date}</p>
                    <p className="text-sm text-gray-800 font-medium mt-1 truncate">{student.program}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col xl:flex-row">
          {/* Student Details */}
          <div className="flex-1 bg-white shadow-sm">
            {/* <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-[#203947] to-[#203947]/90">
              <h2 className="text-xl font-bold text-white">Request Details</h2>
            </div> */}

            <div className="p-4 md:p-6">
              {/* Student Profile */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-8 p-6 bg-gradient-to-br from-[#ebebeb] to-white rounded-xl shadow-sm border border-gray-200">
                <div className="text-6xl transform hover:scale-110 transition-transform duration-300">{currentStudent.avatar}</div>
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-[#203947] mb-2">{currentStudent.name}</h1>
                  <p className="text-[#ad565a] font-medium">{currentStudent.major} • {currentStudent.university}</p>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mt-3 shadow-sm ${getStatusColor(currentStudent.status)}`}>
                    {getStatusIcon(currentStudent.status)}
                    <span className="ml-1 capitalize">{currentStudent.status}</span>
                  </span>
                </div>
              </div>

              {/* About Student */}
              <div className="mb-8">
                <h3 className="text-lg font-bold text-[#203947] mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2 text-[#901b20]" />
                  About Student
                </h3>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  {currentStudent.name} is a highly motivated student with a strong 
                  passion for their field. They have demonstrated excellent academic performance 
                  and are eager to apply their skills in a professional environment.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200 hover:border-[#ad565a]/30">
                    <Mail className="w-5 h-5 text-[#901b20]" />
                    <a href={`mailto:${currentStudent.email}`} className="text-[#203947] hover:text-[#901b20] font-medium transition-colors">
                      {currentStudent.email}
                    </a>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200">
                    <Phone className="w-5 h-5 text-[#901b20]" />
                    <span className="text-[#203947] font-medium">{currentStudent.phone}</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200">
                    <GraduationCap className="w-5 h-5 text-[#901b20]" />
                    <span className="text-[#203947] font-medium">GPA: {currentStudent.gpa}</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200">
                    <MapPin className="w-5 h-5 text-[#901b20]" />
                    <span className="text-[#203947] font-medium">{currentStudent.university}</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200">
                    <User className="w-5 h-5 text-[#901b20]" />
                    <span className="text-[#203947] font-medium">Major: {currentStudent.major}</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200">
                    <BookOpen className="w-5 h-5 text-[#901b20]" />
                    <a href={`https://${currentStudent.portfolio}`} className="text-[#203947] hover:text-[#901b20] font-medium transition-colors">
                      {currentStudent.portfolio}
                    </a>
                  </div>
                </div>

                {/* Skills */}
                <div className="mb-6">
                  <h4 className="font-bold text-[#203947] mb-3">Skills:</h4>
                  <div className="flex flex-wrap gap-2">
                    {currentStudent.skills.map((skill, index) => (
                      <span key={index} className="px-4 py-2 bg-[#901b20] text-white rounded-full text-sm font-medium shadow-sm hover:shadow-md transform hover:scale-105 transition-all duration-200">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Request Details */}
              <div className="mb-8 p-6 bg-gradient-to-br from-[#ebebeb] to-white rounded-xl border border-gray-200">
                <h3 className="text-lg font-bold text-[#203947] mb-4 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-[#901b20]" />
                  Request Details
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200">
                    <h4 className="font-bold text-[#203947] mb-2">Position:</h4>
                    <p className="text-gray-700">{currentStudent.position}</p>
                  </div>
                  <div className="p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200">
                    <h4 className="font-bold text-[#203947] mb-2">Interview Type:</h4>
                    <p className="text-gray-700">{currentStudent.interviewType}</p>
                  </div>
                  <div className="p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200 lg:col-span-2">
                    <h4 className="font-bold text-[#203947] mb-2">Preferred Dates:</h4>
                    <p className="text-gray-700">{currentStudent.preferredDate}</p>
                  </div>
                </div>
              </div>

              {/* Required Documents */}
              <div className="mb-8">
                <h3 className="text-lg font-bold text-[#203947] mb-4 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-[#901b20]" />
                  Required Documents
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {currentStudent.documents.map((doc, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-gradient-to-r from-orange-50 to-white rounded-lg border border-orange-200 hover:shadow-md hover:border-orange-300 transition-all duration-200 cursor-pointer group">
                      <FileText className="w-5 h-5 text-orange-600 group-hover:scale-110 transition-transform duration-200" />
                      <a href="#" className="text-[#203947] hover:text-[#901b20] font-medium transition-colors group-hover:underline">{doc}</a>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div className="mb-8">
                <h3 className="text-lg font-bold text-[#203947] mb-4">Notes:</h3>
                <div className="p-4 bg-gradient-to-br from-[#cc9598]/10 to-[#ebebeb]/50 border border-[#cc9598]/20 rounded-xl">
                  <p className="text-gray-700 leading-relaxed">{currentStudent.notes}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                <button className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:from-green-700 hover:to-green-800 transform hover:scale-105 transition-all duration-200 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Approve Request
                </button>
                <button className="px-8 py-3 bg-gradient-to-r from-[#901b20] to-red-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:from-red-700 hover:to-red-800 transform hover:scale-105 transition-all duration-200 flex items-center justify-center">
                  <XCircle className="w-5 h-5 mr-2" />
                  Reject Request
                </button>
              </div>
            </div>
          </div>

          {/* Recent Activity Sidebar */}
          <div className="w-full xl:w-80 bg-gradient-to-b from-gray-50 to-white border-l border-gray-200">
            {/* <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-[#203947] to-[#203947]/90">
              <h3 className="text-lg font-bold text-white flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Dashboard Overview
              </h3>
            </div> */}
            
            {/* Stats */}
            <div className="p-4 bg-white border-b border-gray-200">
              <div className="grid grid-cols-2 gap-3">
                {stats.map((stat, index) => (
                  <div key={index} className={`p-4 rounded-xl ${stat.bg} ${stat.border} border hover:shadow-lg transform hover:scale-105 transition-all duration-200 cursor-pointer`}>
                    <div className={`text-2xl font-bold ${stat.color} mb-1`}>{stat.value}</div>
                    <div className="text-xs text-gray-600 font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4">
              <h4 className="font-bold text-[#203947] mb-4">Recent Activity</h4>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3 p-4 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:border-[#ad565a]/30 transition-all duration-200 cursor-pointer group">
                    <div className="flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-200">
                      {activity.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 font-medium leading-relaxed">{activity.text}</p>
                      <p className="text-xs text-[#ad565a] mt-1 font-medium">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentRequestDashboard;