import React, { useState } from 'react';
import { User, Phone, Mail, MapPin, GraduationCap, Calendar, FileText, CheckCircle, XCircle, Clock, Users, Award, BookOpen } from 'lucide-react';

const StudentRequestDashboard = () => {
  const [selectedStudent, setSelectedStudent] = useState(0);

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
      status: "pending",
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
    { label: "Pending Reviews", value: "3", color: "text-yellow-600", bg: "bg-yellow-50" },
    { label: "Approved", value: "1", color: "text-green-600", bg: "bg-green-50" },
    { label: "Interviews Scheduled", value: "5", color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Total Applicants", value: "1", color: "text-purple-600", bg: "bg-purple-50" }
  ];

  const currentStudent = students[selectedStudent];

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col lg:flex-row">
        {/* Sidebar */}
        <div className="w-full lg:w-80 bg-white shadow-sm border-r border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-xl font-semibold text-gray-900">Student Requests</h1>
          </div>
          
          <div className="overflow-y-auto max-h-screen">
            {students.map((student, index) => (
              <div
                key={student.id}
                onClick={() => setSelectedStudent(index)}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedStudent === index ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="text-2xl">{student.avatar}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-900 truncate">{student.name}</h3>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(student.status)}`}>
                        {getStatusIcon(student.status)}
                        <span className="ml-1 capitalize">{student.status}</span>
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{student.date}</p>
                    <p className="text-sm text-gray-800 font-medium mt-1 truncate">{student.program}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col lg:flex-row">
          {/* Student Details */}
          <div className="flex-1 bg-white">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Request Details</h2>
              </div>
            </div>

            <div className="p-6">
              {/* Student Profile */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-8">
                <div className="text-6xl">{currentStudent.avatar}</div>
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-gray-900">{currentStudent.name}</h1>
                  <p className="text-gray-600">{currentStudent.major} • {currentStudent.university}</p>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mt-2 ${getStatusColor(currentStudent.status)}`}>
                    {getStatusIcon(currentStudent.status)}
                    <span className="ml-1 capitalize">{currentStudent.status}</span>
                  </span>
                </div>
              </div>

              {/* About Student */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">About Student</h3>
                <p className="text-gray-700 mb-4">
                  Alice is a highly motivated final-year computer science student with a strong 
                  passion for full-stack development and cloud architecture. She has contributed 
                  to several open-source projects and participated in multiple hackathons.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <a href={`mailto:${currentStudent.email}`} className="text-blue-600 hover:underline">
                      {currentStudent.email}
                    </a>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">{currentStudent.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <GraduationCap className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">GPA: {currentStudent.gpa}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">{currentStudent.university}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">Major: {currentStudent.major}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <BookOpen className="w-4 h-4 text-gray-500" />
                    <a href={`https://${currentStudent.portfolio}`} className="text-blue-600 hover:underline">
                      {currentStudent.portfolio}
                    </a>
                  </div>
                </div>

                {/* Skills */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-2">Skills:</h4>
                  <div className="flex flex-wrap gap-2">
                    {currentStudent.skills.map((skill, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Request Details */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Request Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Position:</h4>
                    <p className="text-gray-700">{currentStudent.position}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Interview Type:</h4>
                    <p className="text-gray-700">{currentStudent.interviewType}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Preferred Dates:</h4>
                    <p className="text-gray-700">{currentStudent.preferredDate}</p>
                  </div>
                </div>
              </div>

              {/* Required Documents */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Required Documents:</h3>
                <div className="space-y-2">
                  {currentStudent.documents.map((doc, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-orange-500" />
                      <a href="#" className="text-blue-600 hover:underline">{doc}</a>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Notes:</h3>
                <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{currentStudent.notes}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  Approve Request
                </button>
                <button className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                  Reject Request
                </button>
              </div>
            </div>
          </div>

          {/* Recent Activity Sidebar */}
          <div className="w-full lg:w-80 bg-gray-50 border-l border-gray-200">
            <div className="p-6 border-b border-gray-200 bg-white">
              <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            </div>
            
            {/* Stats */}
            <div className="p-4 bg-white border-b border-gray-200">
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, index) => (
                  <div key={index} className={`p-3 rounded-lg ${stat.bg}`}>
                    <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                    <div className="text-xs text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-white rounded-lg shadow-sm">
                  <div className="flex-shrink-0 mt-0.5">
                    {activity.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">{activity.text}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentRequestDashboard;