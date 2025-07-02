import React, { useState, useEffect } from 'react';
import { CheckCircle, Mail, Phone, Shield, ArrowRight, ArrowLeft, Building } from 'lucide-react';
import { useParams } from 'react-router-dom';
import api from '../../api/axios';


const MultiStepVerificationWithSetup = () => {


  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { companyId, jobFairId } = useParams();
  const [companyData, setCompanyData] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [availableTracks, setAvailableTracks] = useState([]);
  const [participationId, setParticipationId] = useState(null);
  const [existingJobProfiles, setExistingJobProfiles] = useState([]);
  const token = localStorage.getItem('token');
  const [hasParticipated, setHasParticipated] = useState(false);
  const [candidateSuccess, setCandidateSuccess] = useState('');
  const [candidateError, setCandidateError] = useState('');
  const [jobFairData, setJobFairData] = useState(null);
  const [stepLocked, setStepLocked] = useState(false);
  const [initialStepLoaded, setInitialStepLoaded] = useState(false);
  const [interviewSlots, setInterviewSlots] = useState([]);


  const [formData, setFormData] = useState({
  specialRequirements: '',
  needBranding: false,
  title: '',
  description: '',
  requirements: '',
  employment_type: '',
  location: '',
  positions_available: '',
  tracks: [],

  
});
const [interviewSlot, setInterviewSlot] = useState({
  slot_date: '',
  start_time: '',
  end_time: '',
  duration_minutes: 30,
  max_interviews_per_slot: 3,
  is_break: false,
  break_reason: null,
  is_available: true,
});


const steps = [
  { id: 1, title: 'Job Fair Participation', icon: Building, description: 'Complete company registration' },
  { id: 2, title: 'Interview Slot Setup', icon: Shield, description: 'Add interview slots' }, 
  { id: 3, title: 'Job Fair Profiles', icon: Mail, description: 'Add required job profiles' },
];



  const setCurrentStepProtected = (newStep, force = false) => {
  console.log(`Attempting to set step to: ${newStep}, current step: ${currentStep}, locked: ${stepLocked}, force: ${force}`);
  
  if (!force && stepLocked && newStep < currentStep) {
    console.log(`Blocked step change from ${currentStep} to ${newStep} - step is locked`);
    return;
  }
  
  if (!force && initialStepLoaded && newStep < currentStep) {
    console.log(`Blocked step regression from ${currentStep} to ${newStep}`);
    return;
  }
  
  console.log(`Setting step to: ${newStep}`);
  setCurrentStep(newStep);
};

const fetchParticipationStatus = async () => {
  const storedJobFairId = localStorage.getItem('jobFairId') || jobFairId;

  if (!storedJobFairId) {
    setErrorMsg('Job fair ID is missing');
    return false;
  }

  try {
    const response = await api.get(`/job-fairs/${storedJobFairId}/companies`);

    if (response.status === 200) {
      const companies = response.data?.data?.result;

      if (!Array.isArray(companies)) {
        return false;
      }

      const currentCompany = companies.find(company => company.companyId == companyId);

      if (!currentCompany) {
        return false;
      }

      if (currentCompany.participationId) {
        setParticipationId(currentCompany.participationId);
      } else {
        try {
          const participationResponse = await api.get(`/job-fairs/${storedJobFairId}/participations`);
          const participationData = participationResponse.data?.data?.result;
          if (Array.isArray(participationData)) {
            const companyParticipation = participationData.find(p => p.company_id == companyId);
            if (companyParticipation) {
              setParticipationId(companyParticipation.id);
            }
          }
        } catch (err) {
          console.error("Error fetching participation details:", err);
        }
      }

      return currentCompany.status === 'approved';
    }

    return false;
  } catch (error) {
    if (error.response?.status !== 404) {
      console.error("Error checking participation:", error);
      setErrorMsg("Failed to check participation status");
    }
    return false;
  }
};


const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toISOString().split('T')[0]; 
};

const formatTimeForInput = (timeString) => {
  if (!timeString) return '';
  return timeString.split(':').slice(0, 2).join(':');
};

const getJobFairDateRange = () => {
  if (!jobFairData) return { minDate: '', maxDate: '', minTime: '', maxTime: '' };
  
  return {
    minDate: formatDateForInput(jobFairData.start_date),
    maxDate: formatDateForInput(jobFairData.end_date),
    minTime: formatTimeForInput(jobFairData.start_time),
    maxTime: formatTimeForInput(jobFairData.end_time)
  };
};

const isTimeInRange = (selectedTime, selectedDate) => {
  if (!jobFairData || !selectedTime || !selectedDate) return true;
  
  const { minDate, maxDate, minTime, maxTime } = getJobFairDateRange();
  
  if (selectedDate === minDate && selectedTime < minTime) {
    return false;
  }
  
  if (selectedDate === maxDate && selectedTime > maxTime) {
    return false;
  }
  
  return true;
};

const addInterviewSlot = async () => {
  const success = await submitInterviewSlot();
  if (success) {
    setInterviewSlots(prevSlots => [...prevSlots, interviewSlot]);

    setInterviewSlot({
      slot_date: '',
      start_time: '',
      end_time: '',
      duration_minutes: 30,
      max_interviews_per_slot: 3,
      is_break: false,
      break_reason: null,
      is_available: true,
    });

    setSuccessMsg('Interview slot added successfully!');
  }
};


const fetchExistingInterviewSlots = async () => {
  if (!participationId) return;
  
  try {
    const response = await api.get(`/job-fairs/${jobFairId}/participations/${participationId}/interview-slots`);
    if (response.status === 200) {
      setInterviewSlots(response.data?.data?.interview_slots || []);
    }
  } catch (error) {
    console.error("Error fetching interview slots:", error);
  }
};

const fetchExistingJobProfiles = async (participationId) => {
  if (!participationId) {
    console.log('No participation ID available');
    return;
  }

  try {
    const response = await api.get(`/job-fairs/${jobFairId}/participations/${participationId}/job-profiles`);
    
    if (response.status === 200) {
      const jobProfiles = response.data?.data?.job_profiles || [];
      setExistingJobProfiles(jobProfiles);
      console.log('Existing job profiles:', jobProfiles);
    }
  } catch (error) {
    console.error("Error fetching job profiles:", error);
  }
};

  


useEffect(() => {
  const initializeComponent = async () => {
    try {
      const savedStep = localStorage.getItem('currentStep');
      const savedStepNumber = savedStep ? Number(savedStep) : 1;
      console.log('Loading saved step:', savedStepNumber);
      
      setCurrentStep(savedStepNumber);
      setInitialStepLoaded(true);
      
      const companyResponse = await api.get(`/companies/${companyId}`);
      setCompanyData(companyResponse.data.data);

      try {
        const tracksResponse = await api.get('/test/tracks?sort_order=desc');
        const tracksData = tracksResponse.data.data.tracks.map(track => ({
          id: track.id,
          name: track.name
        }));
        setAvailableTracks(tracksData);
      } catch (error) {
        console.error("Failed to load tracks", error);
      }

      const participated = await fetchParticipationStatus();
      setHasParticipated(participated);

if (participated) {
  setHasParticipated(true);
  setCompletedSteps(prev => new Set([...prev, 1]));

  if (savedStepNumber === 1) {
    console.log('Participated user on step 1, moving to step 2');
    setCurrentStepProtected(2, true); 
  } else {
    console.log(`Participated user, staying at saved step: ${savedStepNumber}`);
    setCurrentStepProtected(savedStepNumber, true);
  }
} else {
  console.log('Non-participated user, forcing back to step 1');
  setCurrentStepProtected(1, true);
}


      try {
        const jobFairResponse = await api.get(`/job-fairs/${jobFairId}`);
        if (jobFairResponse.status === 200) {
          setJobFairData(jobFairResponse.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch job fair data:', error);
        setErrorMsg('Failed to load job fair info.');
      }

      setTimeout(() => {
        setStepLocked(true);
        console.log('Step is now locked');
      }, 1000);

    } catch (error) {
      console.error("Error during initialization:", error);
      setErrorMsg("Failed to load component data");
    }
  };

  initializeComponent();
}, [companyId, jobFairId, token]);

useEffect(() => {
  if (initialStepLoaded) {
    console.log('Saving step to localStorage:', currentStep);
    localStorage.setItem('currentStep', currentStep);
  }
}, [currentStep, initialStepLoaded]);


useEffect(() => {
  if (initialStepLoaded) {
    console.log('Saving step to localStorage:', currentStep);
    localStorage.setItem('currentStep', currentStep);
  }
}, [currentStep, initialStepLoaded]);

useEffect(() => {
  if (participationId && initialStepLoaded) {
    fetchExistingJobProfiles(participationId);
  }
}, [participationId, initialStepLoaded, jobFairId]);


const handleSubmit = async (e) => {
  if (e) e.preventDefault();

  setCandidateError('');
  setCandidateSuccess('');

  if (
    !formData.title?.trim() ||
    !formData.description?.trim() ||
    !formData.positions_available ||
    Number(formData.positions_available) <= 0
  ) {
    setCandidateError('Please fill in valid Title, Description, and Positions Available.');
    return;
  }
  if (!formData.tracks || formData.tracks.length === 0) {
    setCandidateError('Please select at least one track.');
    return;
  }
  if (!participationId) {
    setCandidateError('Participation ID not found. Please complete participation first.');
    return;
  }

  setIsLoading(true); 

  try {
    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      requirements: formData.requirements,
      employment_type: formData.employment_type,
      location: formData.location,
      positions_available: Number(formData.positions_available),
      tracks: formData.tracks,
    };

    const response = await api.post(
      `/job-fairs/${jobFairId}/participations/${participationId}/job-profiles`,
      payload
    );

    if (response.status === 200 || response.status === 201) {
      setFormData({
        title: '',
        description: '',
        requirements: '',
        employment_type: '',
        location: '',
        positions_available: '',
        tracks: []
      });

      setCandidateSuccess('Job profile added successfully!');
      setCandidateError('');

      await fetchExistingJobProfiles(participationId);
    } else {
      setCandidateError('Failed to add job profile. Please try again.');
      setCandidateSuccess('');
    }
  } catch (error) {
    console.error("Error adding job profile:", error);
    if (error.response?.data?.message) {
      setCandidateError(error.response.data.message);
    } else {
      setCandidateError('An unexpected error occurred.');
    }
    setCandidateSuccess('');
  } finally {
    setIsLoading(false); 
  }
};



  if (!companyData) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-lg">Loading company information...</p>
        </div>
      </div>
    );
  }





  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const submitInterviewSlot = async () => {
  if (!participationId) {
    setErrorMsg('Participation ID not found. Please complete participation first.');
    return false;
  }

  setIsLoading(true);
  setErrorMsg('');
  setSuccessMsg('');

  try {
    const payload = {
      slot_date: interviewSlot.slot_date,
      start_time: interviewSlot.start_time,
      end_time: interviewSlot.end_time,
      duration_minutes: Number(interviewSlot.duration_minutes),
      max_interviews_per_slot: Number(interviewSlot.max_interviews_per_slot),
      is_break: interviewSlot.is_break,
      break_reason: interviewSlot.is_break ? interviewSlot.break_reason : null,
      is_available: interviewSlot.is_available,
    };

    const response = await api.post(
      `/job-fairs/${jobFairId}/participations/${participationId}/interview-slots`,
      payload
    );

    if (response.status === 200 || response.status === 201) {
      setSuccessMsg('Interview slot added successfully!');
      return true;
    } else {
      setErrorMsg('Failed to add interview slot.');
      return false;
    }
  } catch (error) {
    console.error('Interview slot submission error:', error);
    setErrorMsg(error.response?.data?.message || 'An unexpected error occurred.');
    return false;
  } finally {
    setIsLoading(false);
  }
};



const handleJobProfileSubmit = async () => {
  setIsSubmitting(true);
  setErrorMsg('');
  setSuccessMsg('');

  if (!participationId) {
    setErrorMsg("Participation ID not found. Please complete participation first.");
    setIsSubmitting(false);
    return false;
  }

  if (
    !formData.title?.trim() ||
    !formData.description?.trim() ||
    !formData.positions_available ||
    isNaN(Number(formData.positions_available)) ||
    Number(formData.positions_available) <= 0 ||
    !formData.tracks ||
    formData.tracks.length === 0
  ) {
    setErrorMsg("Please fill in all required fields correctly.");
    setIsSubmitting(false);
    return false;
  }

  try {
    const jobProfilePayload = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      requirements: formData.requirements,
      employment_type: formData.employment_type,
      location: formData.location,
      positions_available: Number(formData.positions_available),
      tracks: formData.tracks,
    };

    const response = await api.post(
  `/job-fairs/${jobFairId}/participations/${participationId}/job-profiles`, 
      jobProfilePayload
    );

    if (response.status === 200 || response.status === 201) {
      setSuccessMsg("Job profile submitted successfully!");
      setCompletedSteps((prev) => new Set([...prev, 2]));

      setFormData({
        title: '',
        description: '',
        requirements: '',
        employment_type: '',
        location: '',
        positions_available: '',
        tracks: [],
      });

      await fetchExistingJobProfiles(participationId);

      return true;
    } else {
      setErrorMsg("Failed to submit job profile. Please try again.");
      return false;
    }
  } catch (error) {
    console.error("Job profile submission error:", error);
    setErrorMsg("An unexpected error occurred while submitting the job profile.");
    return false;
  } finally {
    setIsSubmitting(false);
  }
};




const handleNext = async () => {
  const submitInterviewSlot = async () => {
    if (!participationId) {
      setErrorMsg('Participation ID not found. Please complete participation first.');
      return false;
    }

    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const payload = {
        slot_date: interviewSlot.slot_date,
        start_time: interviewSlot.start_time,
        end_time: interviewSlot.end_time,
        duration_minutes: Number(interviewSlot.duration_minutes),
        max_interviews_per_slot: Number(interviewSlot.max_interviews_per_slot),
        is_break: interviewSlot.is_break,
        break_reason: interviewSlot.is_break ? interviewSlot.break_reason : null,
        is_available: interviewSlot.is_available,
      };

      const response = await api.post(
        `/job-fairs/${jobFairId}/participations/${participationId}/interview-slots`,
        payload
      );

      if (response.status === 200 || response.status === 201) {
        setSuccessMsg('Interview slot added successfully!');
        return true;
      } else {
        setErrorMsg('Failed to add interview slot.');
        return false;
      }
    } catch (error) {
      console.error('Interview slot submission error:', error);
      setErrorMsg(error.response?.data?.message || 'An unexpected error occurred.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  if (currentStep === 1) {
    if (!hasParticipated) {
      setIsLoading(true);
      setErrorMsg('');
      setSuccessMsg('');

      try {
        const participationPayload = {
          company_id: parseInt(companyId),
          special_requirements: formData.specialRequirements || null,
          need_branding: formData.needBranding || false,
          company: {
            name: companyData.name,
            contact_email: companyData.contact_email || companyData.email
          }
        };

        console.log('Sending participation payload:', participationPayload);
        console.log('To endpoint:', `/job-fairs/${jobFairId}/participate`);

        const response = await api.post(
          `/job-fairs/${jobFairId}/participate`,
          participationPayload
        );

        if (response.status === 200 || response.status === 201) {
          setSuccessMsg("Participation request submitted successfully!");
          setHasParticipated(true);
          setCompletedSteps(prev => new Set([...prev, 1]));

          const responseData = response.data?.data;
          if (responseData?.id) {
            setParticipationId(responseData.id);
          }

          const isApproved = await fetchParticipationStatus();
          if (isApproved) {
            setCurrentStep(2);
          }
        }
      } catch (error) {
        console.error("Participation submission error:", error);
        console.error("Response data:", error.response?.data);

        if (error.response?.status === 422) {
          const errors = error.response.data?.errors;
          if (errors) {
            const errorMessages = Object.entries(errors)
              .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
              .join('\n');
            setErrorMsg(`Validation errors:\n${errorMessages}`);
          } else {
            setErrorMsg(error.response.data?.message || "Validation failed");
          }
        } else {
          setErrorMsg(error.response?.data?.message || "Failed to submit participation request");
        }
      } finally {
        setIsLoading(false);
      }
    } else {
      const isApproved = await fetchParticipationStatus();
      if (isApproved) {
        setCurrentStep(2);
      } else {
        setErrorMsg("Your participation request is pending approval. Please wait.");
      }
    }
  } else if (currentStep === 2) {
    const success = await submitInterviewSlot();
    if (success) {
      setCurrentStep(3); 
      setErrorMsg('');
      setSuccessMsg('');
    }
  } else if (currentStep === 3) {
    setCandidateError('');
    setCandidateSuccess('');

    if (!formData.title?.trim() || !formData.description?.trim() || 
        !formData.positions_available || Number(formData.positions_available) <= 0) {
      setCandidateError('Please fill in valid Title, Description, and Positions Available.');
      return;
    }

    if (!formData.tracks || formData.tracks.length === 0) {
      setCandidateError('Please select at least one track.');
      return;
    }

    if (!participationId) {
      setCandidateError('Participation ID not found. Please complete participation first.');
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        requirements: formData.requirements || null,
        employment_type: formData.employment_type || null,
        location: formData.location || null,
        positions_available: Number(formData.positions_available),
        tracks: formData.tracks 
      };

      console.log('Sending job profile payload:', payload);
      console.log('To endpoint:', `/job-fairs/${jobFairId}/participations/${participationId}/job-profiles`);

      const response = await api.post(
        `/job-fairs/${jobFairId}/participations/${participationId}/job-profiles`,
        payload
      );

      if (response.status === 200 || response.status === 201) {
        setFormData({
          ...formData,
          title: '',
          description: '',
          requirements: '',
          employment_type: '',
          location: '',
          positions_available: '',
          tracks: []
        });
        setCandidateSuccess('Job profile added successfully!');
        await fetchExistingJobProfiles(participationId);
      }
    } catch (error) {
      console.error("Error adding job profile:", error);
      console.error("Response data:", error.response?.data);

      if (error.response?.status === 422) {
        const errors = error.response.data?.errors;
        if (errors) {
          const errorMessages = Object.entries(errors)
            .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
            .join('\n');
          setCandidateError(`Validation errors:\n${errorMessages}`);
        } else {
          setCandidateError(error.response.data?.message || "Validation failed");
        }
      } else {
        setCandidateError('An unexpected error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  }
};





  const isStepComplete = (stepId) => completedSteps.has(stepId);
  
const isCurrentStepValid = () => {
  switch (currentStep) {
    case 1:
      return companyData && Object.keys(companyData).length > 0;
      
    case 2:
      return (
        interviewSlot?.slot_date && 
        interviewSlot?.start_time && 
        interviewSlot?.end_time && 
        interviewSlot?.duration_minutes > 0 && 
        interviewSlot?.max_interviews_per_slot > 0
        
      );
      
    case 3:
      return (
        formData.title.trim() &&
        formData.description.trim() &&
        formData.positions_available &&
        formData.tracks.length > 0
      );
      
    default:
      return false;
  }
};


  const logoURL = companyData.logo_path?.startsWith('http')
    ? companyData.logo_path
    : `http://127.0.0.1:8000/storage/${companyData.logo_path}`;

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Header Section */}
              <div className="bg-gradient-to-r from-slate-700 via-slate-800 to-red-900 rounded-2xl p-8 shadow-lg -mx-8 -mt-8 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    {companyData.logo_path && (
                      <div className="relative w-32 h-32 rounded-3xl border-4 border-white shadow-2xl bg-white overflow-hidden">
                        <img
                          src={logoURL}
                          alt={`${companyData.name} Logo`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                    <div>
                      <h1 className="text-3xl font-bold text-white mb-2">{companyData.name}</h1>
                      <div className="flex items-center space-x-3">
                        <span className="bg-red-600 bg-opacity-80 text-white px-3 py-1 rounded-full text-sm font-medium">
                          {companyData.industry}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2">
                    <Building className="w-4 h-4" />
                    <span>Job Fair Registration</span>
                  </div>
                </div>
              </div>

              {/* Company Information Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {/* Email Card */}
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="bg-red-100 rounded-lg p-2">
                      <Mail className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <p className="text-gray-600 font-medium text-sm">Email Address</p>
                      <p className="text-gray-900 text-sm">{companyData.contact_email}</p>
                    </div>
                  </div>
                </div>

                {/* Phone Card */}
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="bg-red-100 rounded-lg p-2">
                      <Phone className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <p className="text-gray-600 font-medium text-sm">Phone Number</p>
                      <p className="text-gray-900 text-sm">{companyData.contact_phone}</p>
                    </div>
                  </div>
                </div>

                {/* Website Card */}
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="bg-red-100 rounded-lg p-2">
                      <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9m0 9c-5 0-9-4-9-9s4-9 9-9" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-600 font-medium text-sm">Website</p>
                      <a
                        href={companyData.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-red-600 hover:text-red-700 hover:underline text-sm truncate block"
                      >
                        {companyData.website}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Location Card */}
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="bg-red-100 rounded-lg p-2">
                      <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-gray-600 font-medium text-sm">Office Location</p>
                      <p className="text-gray-900 text-sm">{companyData.location}</p>
                    </div>
                  </div>
                </div>

                {/* Company Size Card */}
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="bg-red-100 rounded-lg p-2">
                      <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-gray-600 font-medium text-sm">Company Size</p>
                      <span className="bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">
                        {companyData.size}
                      </span>
                    </div>
                  </div>
                </div>

                {/* LinkedIn Card */}
                {companyData.linkedin_url && (
                  <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                    <div className="flex items-center space-x-3">
                      <div className="bg-red-100 rounded-lg p-2">
                        <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                      </div>
                      <div>
                        <p className="text-gray-600 font-medium text-sm">LinkedIn</p>
                        <a href={companyData.linkedin_url} target="_blank" rel="noopener noreferrer"
                           className="text-red-600 hover:text-red-700 hover:underline text-sm">
                          Company Profile
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Company Description Card */}
              {companyData.description && (
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-red-100 rounded-lg p-3 mt-1">
                      <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Company Description</h3>
                      <p className="text-gray-700 leading-relaxed">{companyData.description}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Registration Form */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Job Fair Registration Details</h3>
                  <p className="text-gray-600">Complete your participation setup for the job fair</p>
                </div>
                
                {/* Special Requirements */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-900">
                    Special Requirements
                    <span className="text-gray-500 font-normal ml-2">(Optional)</span>
                  </label>
                  <p className="text-sm text-gray-600">
                    Let us know if you have any specific booth requirements, equipment needs, or special arrangements.
                  </p>
                  <textarea
                    value={formData.specialRequirements}
                    onChange={(e) => handleInputChange('specialRequirements', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors duration-200 resize-none"
                    rows="4"
                    placeholder="e.g., Power outlets, internet connection, additional tables, accessibility requirements..."
                  />
                </div>

                {/* Branding Checkbox */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      checked={formData.needBranding}
                      onChange={(e) => handleInputChange('needBranding', e.target.checked)}
                      className="mt-1 w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                      id="branding"
                    />
                    <div>
                      <label htmlFor="branding" className="text-sm font-medium text-gray-900 cursor-pointer">
                        Branding Support Required
                      </label>
                      <p className="text-sm text-gray-600 mt-1">
                        Check this if you need assistance with booth branding, banners, or promotional materials.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Success/Error Messages */}
                {successMsg && (
                  <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                    {successMsg}
                  </div>
                )}
                {errorMsg && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {errorMsg}
                  </div>
                )}
              </div>
            </div>
          </form>
        );
        case 2:
  const dateRange = getJobFairDateRange();
  
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Shield className="w-16 h-16 text-blue-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Interview Slot Setup</h2>
        <p className="text-gray-600">Configure your interview time slots for the job fair</p>
        {jobFairData && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Job Fair Schedule:</strong> {formatDateForInput(jobFairData.start_date)} to {formatDateForInput(jobFairData.end_date)}
              <br />
              <strong>Time:</strong> {formatTimeForInput(jobFairData.start_time)} - {formatTimeForInput(jobFairData.end_time)}
            </p>
          </div>
        )}
      </div>

      {/* Show existing interview slots */}
      {interviewSlots.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Added Interview Slots</h3>
          <div className="space-y-2">
            {interviewSlots.map((slot, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg border">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                  <div><strong>Date:</strong> {slot.slot_date}</div>
                  <div><strong>Time:</strong> {slot.start_time} - {slot.end_time}</div>
                  <div><strong>Duration:</strong> {slot.duration_minutes} min</div>
                  <div><strong>Max Interviews:</strong> {slot.max_interviews_per_slot}</div>
                </div>
                {slot.is_break && (
                  <div className="text-sm text-orange-600 mt-1">
                    <strong>Break:</strong> {slot.break_reason}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={async e => {
        e.preventDefault();
        await addInterviewSlot();
      }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Slot Date *
            </label>
            <input
              type="date"
              value={interviewSlot.slot_date}
              min={dateRange.minDate}
              max={dateRange.maxDate}
              onChange={(e) => setInterviewSlot({...interviewSlot, slot_date: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            {dateRange.minDate && dateRange.maxDate && (
              <p className="text-xs text-gray-500 mt-1">
                Available: {dateRange.minDate} to {dateRange.maxDate}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duration (minutes) *
            </label>
            <input
              type="number"
              min="1"
              value={interviewSlot.duration_minutes}
              onChange={(e) => setInterviewSlot({...interviewSlot, duration_minutes: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Time *
            </label>
            <input
              type="time"
              value={interviewSlot.start_time}
              min={interviewSlot.slot_date === dateRange.minDate ? dateRange.minTime : undefined}
              max={interviewSlot.slot_date === dateRange.maxDate ? dateRange.maxTime : undefined}
              onChange={(e) => setInterviewSlot({...interviewSlot, start_time: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            {!isTimeInRange(interviewSlot.start_time, interviewSlot.slot_date) && (
              <p className="text-xs text-red-500 mt-1">
                Time must be within job fair hours
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Time *
            </label>
            <input
              type="time"
              value={interviewSlot.end_time}
              min={interviewSlot.start_time}
              max={interviewSlot.slot_date === dateRange.maxDate ? dateRange.maxTime : undefined}
              onChange={(e) => setInterviewSlot({...interviewSlot, end_time: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            {!isTimeInRange(interviewSlot.end_time, interviewSlot.slot_date) && (
              <p className="text-xs text-red-500 mt-1">
                Time must be within job fair hours
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Max Interviews Per Slot *
            </label>
            <input
              type="number"
              min="1"
              value={interviewSlot.max_interviews_per_slot}
              onChange={(e) => setInterviewSlot({...interviewSlot, max_interviews_per_slot: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={interviewSlot.is_break}
                onChange={(e) => setInterviewSlot({...interviewSlot, is_break: e.target.checked, break_reason: e.target.checked ? interviewSlot.break_reason : null})}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Is Break Slot</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={interviewSlot.is_available}
                onChange={(e) => setInterviewSlot({...interviewSlot, is_available: e.target.checked})}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Is Available</span>
            </label>
          </div>
        </div>

        {interviewSlot.is_break && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Break Reason *
            </label>
            <input
              type="text"
              value={interviewSlot.break_reason || ''}
              onChange={(e) => setInterviewSlot({...interviewSlot, break_reason: e.target.value})}
              placeholder="e.g., Lunch break, Meeting, etc."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required={interviewSlot.is_break}
            />
          </div>
        )}

        <div className="flex gap-4 mt-6">
          <button 
            type="submit" 
            disabled={isLoading || !isCurrentStepValid()}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Adding Slot...' : 'Add Interview Slot'}
          </button>
          
          {interviewSlots.length > 0 && (
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Continue to Job Profiles
            </button>
          )}
        </div>
      </form>

      {successMsg && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-md">
          <p className="text-green-800">{successMsg}</p>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800">{errorMsg}</p>
        </div>
      )}
    </div>
  );


      case 3:
        return (
          <div className="space-y-6 max-w-xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-800 mb-4 text-center">Add Candidate Job Profile</h2>

            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                <input
                  type="text"
                  value={formData.title || ''}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                  placeholder="e.g., Backend Developer"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                  rows={3}
                  placeholder="Job responsibilities..."
                />
              </div>

              {/* Requirements */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Requirements</label>
                <textarea
                  value={formData.requirements || ''}
                  onChange={(e) => handleInputChange('requirements', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                  rows={2}
                  placeholder="Skills, tools, experience..."
                />
              </div>

              {/* Employment Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Employment Type</label>
                <select
                  value={formData.employment_type || ''}
                  onChange={(e) => handleInputChange('employment_type', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                >
                  <option value="">Select type</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Internship">Internship</option>
                  <option value="Contract">Contract</option>
                </select>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  value={formData.location || ''}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                  placeholder="e.g., Cairo"
                />
              </div>

              {/* Positions Available */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Positions Available</label>
                <input
                  type="number"
                  min="1"
                  value={formData.positions_available || ''}
                  onChange={(e) => handleInputChange('positions_available', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                  placeholder="Number of positions"
                />
              </div>

              {/* Tracks Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Available Tracks</label>
                {availableTracks.map(track => {
                  const trackIndex = formData.tracks.findIndex(t => t.track_id === track.id);
                  const trackPref = trackIndex !== -1 ? formData.tracks[trackIndex] : { preference_level: '' };
                  return (
                    <div key={track.id} className="flex items-center space-x-4 mb-2">
                      <input
                        type="checkbox"
                        checked={trackIndex !== -1}
                        onChange={(e) => {
                          let newTracks = [...formData.tracks];
                          if (e.target.checked) {
                            if (trackIndex === -1) {
                              newTracks.push({ track_id: track.id, preference_level: 'required' });
                            }
                          } else {
                            newTracks = newTracks.filter(t => t.track_id !== track.id);
                          }
                          handleInputChange('tracks', newTracks);
                        }}
                        className="w-4 h-4 text-red-600 border-gray-300 rounded"
                        id={`track-${track.id}`}
                      />
                      <label htmlFor={`track-${track.id}`} className="flex-1 text-gray-700 cursor-pointer">{track.name}</label>

                      {trackIndex !== -1 && (
                        <select
                          value={trackPref.preference_level}
                          onChange={(e) => {
                            const newTracks = formData.tracks.map((t, idx) =>
                              idx === trackIndex ? { ...t, preference_level: e.target.value } : t
                            );
                            handleInputChange('tracks', newTracks);
                          }}
                          className="border border-gray-300 rounded px-2 py-1"
                        >
                          <option value="required">Required</option>
                          <option value="preferred">Preferred</option>
                          <option value="acceptable">Acceptable</option>
                        </select>
                      )}
                    </div>
                  );
                })}
              </div>

              {candidateSuccess && (
                <div className="text-green-600 font-medium text-sm bg-green-100 p-2 rounded border border-green-300">
                  ✅ {candidateSuccess}
                </div>
              )}
              {candidateError && (
                <div className="text-red-600 font-medium text-sm bg-red-100 p-2 rounded border border-red-300">
                  ❌ {candidateError}
                </div>
              )}

              {/* Add Another Candidate Button */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
<button
  onClick={handleJobProfileSubmit}
  disabled={isSubmitting || isLoading}
  className="bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded"
>
  {(isSubmitting || isLoading) ? 'Adding...' : 'Submit Job Profile'}
</button>





              </div>
            </div>
          </div>
        );
        
      default:
        return <div className="text-center text-gray-500">Step not found.</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isComplete = isStepComplete(step.id);
              const isCurrent = step.id === currentStep;
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 ${
                    isComplete 
                      ? 'bg-green-500 border-green-500 text-white' 
                      : isCurrent 
                        ? 'bg-red-500 border-red-500 text-white' 
                        : 'bg-white border-gray-300 text-gray-400'
                  }`}>
                    {isComplete ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      <Icon className="w-6 h-6" />
                    )}
                  </div>
                  <div className="ml-4">
                    <p className={`text-sm font-medium ${isCurrent ? 'text-red-600' : 'text-gray-500'}`}>
                      {step.title}
                    </p>
                    <p className="text-xs text-gray-400">{step.description}</p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-24 h-0.5 mx-8 ${isComplete ? 'bg-green-500' : 'bg-gray-300'}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Messages */}
        {successMsg && (
          <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
            {successMsg}
          </div>
        )}
        
        {errorMsg && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {errorMsg}
          </div>
        )}

        {/* Step Content */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          {renderStepContent()}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t">
            {currentStep !== 2 && (
              <button
                onClick={handleNext}
                disabled={!isCurrentStepValid() || isSubmitting || isLoading}
                className="flex items-center px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting || isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultiStepVerificationWithSetup;