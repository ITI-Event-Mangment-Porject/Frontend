import React, { useState, useEffect } from 'react';
import { CheckCircle, Mail, Phone, Shield, ArrowRight, ArrowLeft, Building, Speaker } from 'lucide-react';
import { useParams } from 'react-router-dom';
import api from '../../api/axios';
import axios from 'axios';


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
  const [speakers, setSpeakers] = useState([]);
  const [forceStepUnlock, setForceStepUnlock] = useState(false);
  const [speakerForm, setSpeakerForm] = useState({
    speaker_name: '',
    position: '',
    mobile: '',
    photo: ''
  });
  const [isLoadingSpeaker, setIsLoadingSpeaker] = useState(false);
  const [speakerSuccessMsg, setSpeakerSuccessMsg] = useState('');
  const [speakerErrorMsg, setSpeakerErrorMsg] = useState('');
  
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

const getSteps = () => [
  { id: 1, title: 'Job Fair Participation', icon: Building, description: 'Complete company registration' },
  { id: 2, title: 'Interview Slot Setup', icon: Shield, description: 'Add interview slots' },
  ...(formData.needBranding ? [
    { id: 3, title: 'Branding Speaker Setup', icon: Speaker, description: 'Add your branding speaker' }
  ] : []),
  { id: 4, title: 'Job Fair Profiles', icon: Mail, description: 'Add required job profiles' }
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
      const companies = response.data.data?.result || {};

      if (!Array.isArray(companies)) {
        return false;
      }

      const currentCompany = companies.find(company => company.companyId == companyId);
      console.log("currentCompany in fetchParticipationStatus", currentCompany);
      
      if (currentCompany?.need_branding !== undefined) {
        setFormData(prev => ({
          ...prev,
          needBranding: currentCompany.need_branding
        }));
      }

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
    window.scrollTo({ top: 0, behavior: 'smooth' });

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

const addSpeaker = async () => {
  if (!speakerForm.speaker_name || !speakerForm.position || !speakerForm.mobile) {
    setSpeakerErrorMsg('Please fill in all required fields');
    setTimeout(() => setSpeakerErrorMsg(''), 3000);
    return;
  }

  setIsLoadingSpeaker(true);
  setSpeakerErrorMsg('');
  setSpeakerSuccessMsg('');

  try {
    await api.post(
      `/job-fairs/${jobFairId}/participations/${participationId}/speakers`,
      speakerForm
    );

    setSpeakers([...speakers, speakerForm]);
    setSpeakerForm({
      speaker_name: '',
      position: '',
      mobile: '',
      photo: ''
    });
    setSpeakerSuccessMsg('Speaker added successfully!');
    setTimeout(() => setSpeakerSuccessMsg(''), 3000);
  } catch (error) {
    const message = error.response?.data?.message || 'An error occurred while adding the speaker';
    setSpeakerErrorMsg(message);
    setTimeout(() => setSpeakerErrorMsg(''), 3000);
  } finally {
    setIsLoadingSpeaker(false);
  }
};

const removeSpeaker = (index) => {
  setSpeakers(speakers.filter((_, i) => i !== index));
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
      
      const response = await axios.get(`http://127.0.0.1:8000/api/companies/${companyId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("response", response.data);

      const result = response.data?.data?.result || {};

      setCompanyData({
        ...result,
        logo_path: result.logo_path 
          ? result.logo_path.startsWith('http')
            ? result.logo_path
            : `http://127.0.0.1:8000/storage/${result.logo_path}`
          : ''
      });

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
    if (currentStep === 3 && formData.needBranding === false) {
      localStorage.setItem('currentStep', 4); 
    }else{
    localStorage.setItem('currentStep', currentStep);

    } 
  }
}, [currentStep, initialStepLoaded, formData.needBranding]);


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
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }
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

const submitParticipation = async () => {
  setIsLoadingSpeaker(true);
  setErrorMsg('');
  setSuccessMsg('');

  if (!participationId) {
    setErrorMsg("Participation ID is missing. Please complete previous steps.");
    setIsLoadingSpeaker(false);
    return { success: false };
  }

  try {
    const response = await api.post(
      `/job-fairs/${jobFairId}/participations/${participationId}/speakers`,
      speakerForm
    );

    if (response.status === 200 || response.status === 201) {
      setSuccessMsg("Speaker added successfully!");
      setSpeakers([...speakers, speakerForm]);
      setCompletedSteps(prev => new Set([...prev, 3]));
      return { success: true };
    }
  } catch (error) {
    if (error.response?.status === 409) {
      setSuccessMsg("You already added a speaker. Proceeding to the next step.");
      setCompletedSteps(prev => new Set([...prev, 3]));
      return { success: true };
    }

    const message = error.response?.data?.message || 'An error occurred while adding the speaker.';
    setErrorMsg(message);
    return { success: false };
  } finally {
    setIsLoadingSpeaker(false);
  }
};

const handleJobProfileSubmit = async () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
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
      setCompletedSteps((prev) => new Set([...prev, 4]));
      window.scrollTo({ top: 0, behavior: 'smooth' });

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
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
  if (currentStep === 1) {
    if (!hasParticipated) {
      setIsLoading(true);
      setErrorMsg('');
      setSuccessMsg('');

      try {
        const participationPayload = {
          company_id: parseInt(companyId),
          special_requirements: formData.specialRequirements || null,
          need_branding: formData.needBranding,
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
          
          if (responseData?.need_branding !== undefined) {
            setFormData(prev => ({ ...prev, needBranding: responseData.need_branding }));
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
      setCompletedSteps(prev => new Set([...prev, 2]));
      if (formData.needBranding) {
  setCurrentStep(3);
} else {
  setCurrentStep(4); 
}
      setErrorMsg('');
      setSuccessMsg('');
    }
  } else if (currentStep === 3) {
    const result = await submitParticipation();

    if (result.success) {
      setErrorMsg('');
      setSuccessMsg('');
      setCurrentStep(4);
      setCompletedSteps(prev => new Set([...prev, 3]));

    }
  } else if (currentStep === 4) {
    setCandidateError('');
    setCandidateSuccess('');
    setCompletedSteps(prev => new Set([...prev, 2]));


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
        setCompletedSteps(prev => new Set([...prev, 4]));
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
      if (!formData.needBranding) return true;
      return (
        speakerForm?.speaker_name?.trim() &&
        speakerForm?.position?.trim() &&
        speakerForm?.mobile?.trim()
      );

    case 4:
      return (
        formData.title?.trim() &&
        formData.description?.trim() &&
        formData.positions_available &&
        formData.tracks?.length > 0
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
            <div className="space-y-8">
              {/* Header Section */}
<div className="rounded-3xl p-8 shadow-2xl -mx-8 -mt-8 mb-8 relative overflow-hidden h-48 bg-gradient-to-br from-slate-900 via-[#203947] to-[#901b20]">
  {/* Gradient overlays & pulses */}
  <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/20"></div>
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(255,255,255,0.1),transparent_50%)]"></div>
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(144,27,32,0.3),transparent_50%)]"></div>
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_40%,rgba(255,255,255,0.05),transparent)] animate-pulse"></div>
  
  {/* Floating elements */}
  <div className="absolute top-6 right-6 w-20 h-20 bg-white/5 rounded-full blur-md animate-pulse"></div>
  <div className="absolute bottom-6 left-8 w-28 h-28 bg-[#901b20]/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
                <div className="relative z-10">
                  <div className="relative z-10 h-full flex items-center justify-between">
                    <div className="flex items-center space-x-8">
                      {companyData.logo_path && (
                        <div className="relative w-36 h-36 rounded-3xl border-4 border-white/20 shadow-2xl bg-white/95 backdrop-blur-sm overflow-hidden transform hover:scale-105 transition-all duration-300 hover:shadow-3xl">
                          <img
                            src={logoURL}
                            alt={`${companyData.name} Logo`}
                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent"></div>
                        </div>
                      )}
                      <div className="space-y-3">
                        <h1 className="text-4xl font-bold text-white mb-2 tracking-tight animate-fade-in">{companyData.name}</h1>
                        <div className="flex items-center space-x-3">
                          <span className="bg-red-500/90 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg border border-red-400/30 hover:bg-red-500 transition-all duration-300 hover:shadow-xl">
                            {companyData.industry}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-red-600/90 backdrop-blur-sm hover:bg-red-700 text-white px-8 py-3 rounded-2xl font-medium transition-all duration-300 flex items-center space-x-3 shadow-lg hover:shadow-xl hover:scale-105 border border-red-500/30">
                      <Building className="w-5 h-5" />
                      <span>Job Fair Registration</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Company Information Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {/* Email Card */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105 hover:border-red-200 group">
                  <div className="flex items-center space-x-4">
                    <div className="bg-gradient-to-br from-red-100 to-red-50 rounded-xl p-3 group-hover:from-red-200 group-hover:to-red-100 transition-all duration-300">
                      <Mail className="w-6 h-6 text-red-600 group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <div>
                      <p className="text-gray-600 font-medium text-sm">Email Address</p>
                      <p className="text-gray-900 text-sm font-semibold">{companyData.contact_email}</p>
                    </div>
                  </div>
                </div>

                {/* Phone Card */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105 hover:border-red-200 group">
                  <div className="flex items-center space-x-4">
                    <div className="bg-gradient-to-br from-red-100 to-red-50 rounded-xl p-3 group-hover:from-red-200 group-hover:to-red-100 transition-all duration-300">
                      <Phone className="w-6 h-6 text-red-600 group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <div>
                      <p className="text-gray-600 font-medium text-sm">Phone Number</p>
                      <p className="text-gray-900 text-sm font-semibold">{companyData.contact_phone}</p>
                    </div>
                  </div>
                </div>

                {/* Website Card */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105 hover:border-red-200 group">
                  <div className="flex items-center space-x-4">
                    <div className="bg-gradient-to-br from-red-100 to-red-50 rounded-xl p-3 group-hover:from-red-200 group-hover:to-red-100 transition-all duration-300">
                      <svg className="w-6 h-6 text-red-600 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9m0 9c-5 0-9-4-9-9s4-9 9-9" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-600 font-medium text-sm">Website</p>
                      <a
                        href={companyData.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-red-600 hover:text-red-700 hover:underline text-sm truncate block font-semibold transition-colors duration-200"
                      >
                        {companyData.website}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Location Card */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105 hover:border-red-200 group">
                  <div className="flex items-center space-x-4">
                    <div className="bg-gradient-to-br from-red-100 to-red-50 rounded-xl p-3 group-hover:from-red-200 group-hover:to-red-100 transition-all duration-300">
                      <svg className="w-6 h-6 text-red-600 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-gray-600 font-medium text-sm">Office Location</p>
                      <p className="text-gray-900 text-sm font-semibold">{companyData.location}</p>
                    </div>
                  </div>
                </div>

                {/* Company Size Card */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105 hover:border-red-200 group">
                  <div className="flex items-center space-x-4">
                    <div className="bg-gradient-to-br from-red-100 to-red-50 rounded-xl p-3 group-hover:from-red-200 group-hover:to-red-100 transition-all duration-300">
                      <svg className="w-6 h-6 text-red-600 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-gray-600 font-medium text-sm">Company Size</p>
                      <span className="bg-gradient-to-r from-gray-200 to-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs font-semibold border border-gray-300">
                        {companyData.size}
                      </span>
                    </div>
                  </div>
                </div>

                {/* LinkedIn Card */}
                {companyData.linkedin_url && (
                  <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105 hover:border-red-200 group">
                    <div className="flex items-center space-x-4">
                      <div className="bg-gradient-to-br from-red-100 to-red-50 rounded-xl p-3 group-hover:from-red-200 group-hover:to-red-100 transition-all duration-300">
                        <svg className="w-6 h-6 text-red-600 group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                      </div>
                      <div>
                        <p className="text-gray-600 font-medium text-sm">LinkedIn</p>
                        <a href={companyData.linkedin_url} target="_blank" rel="noopener noreferrer"
                           className="text-red-600 hover:text-red-700 hover:underline text-sm font-semibold transition-colors duration-200">
                          Company Profile
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Company Description Card */}
              {companyData.description && (
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 mb-8 hover:shadow-xl transition-all duration-300 hover:border-red-200 group">
                  <div className="flex items-start space-x-6">
                    <div className="bg-gradient-to-br from-red-100 to-red-50 rounded-xl p-4 mt-1 group-hover:from-red-200 group-hover:to-red-100 transition-all duration-300">
                      <svg className="w-7 h-7 text-red-600 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">Company Description</h3>
                      <p className="text-gray-700 leading-relaxed text-base">{companyData.description}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Registration Form */}
              <div className="space-y-8">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Job Fair Registration Details</h3>
                  <p className="text-gray-600 text-lg">Complete your participation setup for the job fair</p>
                </div>
                
                {/* Special Requirements */}
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:border-red-200 group">
                  <div className="space-y-4">
                    <label className="block text-lg font-semibold text-gray-900">
                      Special Requirements
                      <span className="text-gray-500 font-normal ml-2 text-base">(Optional)</span>
                    </label>
                    <p className="text-gray-600 text-base">
                      Let us know if you have any specific booth requirements, equipment needs, or special arrangements.
                    </p>
                    <textarea
                      value={formData.specialRequirements}
                      onChange={(e) => handleInputChange('specialRequirements', e.target.value)}
                      className="w-full border-2 border-gray-200 rounded-xl p-4 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all duration-300 resize-none hover:border-gray-300 text-base"
                      rows="5"
                      placeholder="e.g., Power outlets, internet connection, additional tables, accessibility requirements..."
                    />
                  </div>
                </div>

                {/* Branding Checkbox */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 shadow-inner hover:shadow-lg transition-all duration-300 border border-gray-200">
                  <div className="flex items-start space-x-4">
                    <input
                      type="checkbox"
                      checked={formData.needBranding}
                      onChange={(e) => handleInputChange('needBranding', e.target.checked)}
                      className="mt-1 w-5 h-5 text-red-600 border-2 border-gray-300 rounded focus:ring-red-500 focus:ring-2 transition-all duration-200"
                      id="branding"
                    />
                    <div>
                      <label htmlFor="branding" className="text-base font-semibold text-gray-900 cursor-pointer">
                        Branding Support Required
                      </label>
                      <p className="text-gray-600 mt-2 text-base">
                        Check this if you need assistance with booth branding, banners, or promotional materials.
                      </p>
                    </div>
                  </div>
                </div>

             
                {successMsg && (
                  <div className="bg-gradient-to-r from-[#203947]-100 to-[#203947]/50 border-2 border-[#203947]/30 text-[#203947]/10 px-6 py-4 rounded-xl shadow-lg animate-fade-in">
                    <div className="flex items-center space-x-2">
                      <svg className="w-5 h-5 text-[#203947]/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="font-medium">{successMsg}</span>
                    </div>
                  </div>
                )}
                {errorMsg && (
                  <div className="bg-gradient-to-r from-red-100 to-red-50 border-2 border-red-300 text-red-800 px-6 py-4 rounded-xl shadow-lg animate-fade-in">
                    <div className="flex items-center space-x-2">
                      <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      <span className="font-medium">{errorMsg}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </form>
        );
        case 2:
  const dateRange = getJobFairDateRange();
  
  return (
    <div className="space-y-8">
<div className="relative h-80 mb-12 rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 via-[#203947] to-[#901b20] shadow-2xl">
  {/* Decorative gradients */}
  <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/20"></div>
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(255,255,255,0.1),transparent_50%)]"></div>
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(144,27,32,0.3),transparent_50%)]"></div>
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_40%,rgba(255,255,255,0.05),transparent)] animate-pulse"></div>
  
  {/* Floating shapes */}
  <div className="absolute top-6 right-6 w-16 h-16 bg-white/10 rounded-full blur-md animate-pulse"></div>
  <div className="absolute bottom-6 left-6 w-24 h-24 bg-[#901b20]/20 rounded-full blur-2xl animate-pulse delay-1000"></div>

  {/* Content */}
  <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
    <div className="bg-white/10 p-4 rounded-2xl mb-4 backdrop-blur-sm border border-white/20">
      <Shield className="w-14 h-14 text-white" />
    </div>
    <h2 className="text-white text-3xl font-bold mb-2">Interview Setup</h2>
    <p className="text-white/80 text-lg">Configure your interview time slots for the job fair</p>

    {jobFairData && (
      <div className="mt-4 px-6 py-4 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20 text-white/90 shadow-md">
        <p className="text-sm">
          <strong>Job Fair Schedule:</strong> {formatDateForInput(jobFairData.start_date)} to {formatDateForInput(jobFairData.end_date)}<br />
          <strong>Time:</strong> {formatTimeForInput(jobFairData.start_time)} - {formatTimeForInput(jobFairData.end_time)}
        </p>
      </div>
    )}
  </div>
</div>


      {/* Show existing interview slots */}
      {interviewSlots.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Added Interview Slots</h3>
          <div className="space-y-4">
            {interviewSlots.map((slot, index) => (
              <div key={index} className="p-6 bg-white rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:border-[#203947]/20 group">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-[#203947]/60 rounded-full"></div>
                    <div>
                      <span className="text-gray-600">Date:</span>
                      <div className="font-semibold text-gray-900">{slot.slot_date}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    <div>
                      <span className="text-gray-600">Time:</span>
                      <div className="font-semibold text-gray-900">{slot.start_time} - {slot.end_time}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-[#901b20]-600 rounded-full"></div>
                    <div>
                      <span className="text-gray-600">Duration:</span>
                      <div className="font-semibold text-gray-900">{slot.duration_minutes} min</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                    <div>
                      <span className="text-gray-600">Max Interviews:</span>
                      <div className="font-semibold text-gray-900">{slot.max_interviews_per_slot}</div>
                    </div>
                  </div>
                </div>
                {slot.is_break && (
                  <div className="mt-4 p-3 bg-orange-50 rounded-xl border border-orange-200">
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-orange-800 font-medium">Break:</span>
                      <span className="text-orange-700">{slot.break_reason}</span>
                    </div>
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
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 hover:border-[#203947]/20 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-base font-semibold text-gray-900 mb-3">
                Slot Date *
              </label>
              <input
                type="date"
                value={interviewSlot.slot_date}
                min={dateRange.minDate}
                max={dateRange.maxDate}
                onChange={(e) => setInterviewSlot({...interviewSlot, slot_date: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#203947]/50 focus:border-[#203947]/50 transition-all duration-300 hover:border-gray-300 text-base"
                required
              />
              {dateRange.minDate && dateRange.maxDate && (
                <p className="text-sm text-gray-500 mt-2">
                  Available: {dateRange.minDate} to {dateRange.maxDate}
                </p>
              )}
            </div>

            <div>
              <label className="block text-base font-semibold text-gray-900 mb-3">
                Interview Duration (minutes) *
              </label>
              <input
                type="number"
                min="1"
                value={interviewSlot.duration_minutes}
                onChange={(e) => setInterviewSlot({...interviewSlot, duration_minutes: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#203947]/50 focus:border-[#203947]/50 transition-all duration-300 hover:border-gray-300 text-base"
                required
              />
            </div>

            <div>
              <label className="block text-base font-semibold text-gray-900 mb-3">
                Start Time *
              </label>
              <input
                type="time"
                value={interviewSlot.start_time}
                min={interviewSlot.slot_date === dateRange.minDate ? dateRange.minTime : undefined}
                max={interviewSlot.slot_date === dateRange.maxDate ? dateRange.maxTime : undefined}
                onChange={(e) => setInterviewSlot({...interviewSlot, start_time: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#203947]/50 focus:border-[#203947]/50 transition-all duration-300 hover:border-gray-300 text-base"
                required
              />
              {!isTimeInRange(interviewSlot.start_time, interviewSlot.slot_date) && (
                <div className="mt-2 flex items-center space-x-2">
                  <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <p className="text-sm text-red-500">
                    Time must be within job fair hours
                  </p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-base font-semibold text-gray-900 mb-3">
                End Time *
              </label>
              <input
                type="time"
                value={interviewSlot.end_time}
                min={interviewSlot.start_time}
                max={interviewSlot.slot_date === dateRange.maxDate ? dateRange.maxTime : undefined}
                onChange={(e) => setInterviewSlot({...interviewSlot, end_time: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#203947]/50 focus:border-[#203947]/50 transition-all duration-300 hover:border-gray-300 text-base"
                required
              />
              {!isTimeInRange(interviewSlot.end_time, interviewSlot.slot_date) && (
                <div className="mt-2 flex items-center space-x-2">
                  <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <p className="text-sm text-red-500">
                    Time must be within job fair hours
                  </p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-base font-semibold text-gray-900 mb-3">
                Max Interviews Per Slot *
              </label>
              <input
                type="number"
                min="1"
                value={interviewSlot.max_interviews_per_slot}
                onChange={(e) => setInterviewSlot({...interviewSlot, max_interviews_per_slot: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#203947]/50 focus:border-[#203947]/50 transition-all duration-300 hover:border-gray-300 text-base"
                required
              />
            </div>

<div className="flex flex-col space-y-4">
  {/* Break Slot */}
  <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
    <label className="flex items-center space-x-3 cursor-pointer group">
      <input
        type="checkbox"
        checked={interviewSlot.is_break}
        onChange={(e) =>
          setInterviewSlot({
            ...interviewSlot,
            is_break: e.target.checked,
            break_reason: e.target.checked ? interviewSlot.break_reason : null,
            is_available: e.target.checked ? false : interviewSlot.is_available, // إذا اختار break نلغي available
          })
        }
        className="w-5 h-5 text-blue-600 border-2 border-gray-300 rounded focus:ring-[#203947]/50 focus:ring-2 transition-all duration-200"
      />
      <span className="text-base font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
        Break Slot
      </span>
    </label>
  </div>

  {/* Interview Slot */}
  <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
    <label className="flex items-center space-x-3 cursor-pointer group">
      <input
        type="checkbox"
        checked={interviewSlot.is_available}
        onChange={(e) =>
          setInterviewSlot({
            ...interviewSlot,
            is_available: e.target.checked,
            is_break: e.target.checked ? false : interviewSlot.is_break, // إذا اختار available نلغي break
            break_reason: e.target.checked ? null : interviewSlot.break_reason,
          })
        }
        className="w-5 h-5 text-blue-600 border-2 border-gray-300 rounded focus:ring-[#203947]/50 focus:ring-2 transition-all duration-200"
      />
      <span className="text-base font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
        Interview Slot
      </span>
    </label>
  </div>
</div>

            
          </div>

          {/* {interviewSlot.is_break && (
            <div className="mt-6 p-6 bg-orange-50 rounded-2xl border border-orange-200">
              <label className="block text-base font-semibold text-gray-900 mb-3">
                Break Reason *
              </label>
              <input
                type="text"
                value={interviewSlot.break_reason || ''}
                onChange={(e) => setInterviewSlot({...interviewSlot, break_reason: e.target.value})}
                placeholder="e.g., Lunch break, Meeting, etc."
                className="w-full px-4 py-3 border-2 border-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 hover:border-orange-300 text-base bg-white"
                required={interviewSlot.is_break}
              />
            </div>
          )} */}

          <div className="flex gap-4 mt-8">
            <button 
              type="submit" 
              disabled={
  isLoading ||
  !isCurrentStepValid() ||
  (!interviewSlot.is_break && !interviewSlot.is_available)
}

              className="px-8 py-3 bg-gradient-to-r from-[#203947]/60 to-[#203947]/70 text-white rounded-xl font-semibold hover:from-[#203947]/70 hover:to-[#203947]/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center space-x-2"
            >
              {isLoading ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a7.646 7.646 0 100 15.292 7.646 7.646 0 000-15.292zm0 0V1m0 3.354a7.646 7.646 0 100 15.292 7.646 7.646 0 000-15.292z" />
                  </svg>
                  <span>Adding Slot...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>Add Interview Slot</span>
                </>
              )}
            </button>
            
            {interviewSlots.length > 0 && (
              <button
                type="button"
                onClick={() => setCurrentStep(formData.needBranding ? 3 : 4)}
                className="px-8 py-3 bg-gradient-to-r from-[#901b20] to-[#901b20]/90 text-white rounded-xl font-semibold hover:from-[#901b20]/90 hover:to-[#901b20] transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
                <span>Continue</span>
              </button>
            )}

          </div>
        </div>
      </form>
      {successMsg && (
        <div className="bg-gradient-to-r from-[#203947]]/10 to-[#203947]/30 border-2 border-[#203947]/50 text-[#203947]/90 px-6 py-4 rounded-xl shadow-lg animate-fade-in">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-[#203947]/90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-medium">{successMsg}</span>
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="bg-gradient-to-r from-red-100 to-red-50 border-2 border-red-300 text-red-800 px-6 py-4 rounded-xl shadow-lg animate-fade-in">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <span className="font-medium">{errorMsg}</span>
          </div>
        </div>
      )}
    </div>
  );
  case 3:
  
  return (
    <div className="space-y-8">
{/* Branding Section - Rearranged for better structure and readability */}
{formData.needBranding && (
  <div className="mb-8">
    {/* Hero Header Section */}
<div className="relative h-50 mb-12 rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 via-[#203947] to-[#901b20] shadow-2xl">
  {/* Decorative gradients */}     
  <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/20"></div>
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_80%,rgba(255,255,255,0.1),transparent_50%)]"></div>
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(144,27,32,0.3),transparent_50%)]"></div>
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_40%,rgba(255,255,255,0.05),transparent)] animate-pulse"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-6 right-6 w-12 h-12 bg-white/10 rounded-full blur-md animate-pulse"></div>
      <div className="absolute bottom-6 left-6 w-20 h-20 bg-[#901b20]-600/20 rounded-full blur-2xl animate-pulse delay-1000"></div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
        <div className="bg-white/10 p-3 rounded-2xl mb-4 backdrop-blur-sm border border-white/20">
          <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <h3 className="text-white text-2xl font-bold mb-2">Branding Day Speaker</h3>
        <p className="text-white/80 text-base">Add your company representative for the branding day</p>
      </div>
    </div>

    {/* Add Speaker Form */}
    <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 hover:border-[#901b20]-200 mb-8">
      <h4 className="text-lg font-bold text-gray-900 mb-6">Add Speaker Information</h4>
      
      <form onSubmit={async (e) => {
        e.preventDefault();
        await addSpeaker();
      }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Speaker Name */}
          <div>
            <label className="block text-base font-semibold text-gray-900 mb-3">
              Speaker Name *
            </label>
            <input
              type="text"
              value={speakerForm.speaker_name}
              onChange={(e) => setSpeakerForm({...speakerForm, speaker_name: e.target.value})}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#901b20]-500 focus:border-[#901b20]-500 transition-all duration-300 hover:border-gray-300 text-base"
              placeholder="Enter speaker's full name"
              required
            />
          </div>

          {/* Position */}
          <div>
            <label className="block text-base font-semibold text-gray-900 mb-3">
              Position *
            </label>
            <input
              type="text"
              value={speakerForm.position}
              onChange={(e) => setSpeakerForm({...speakerForm, position: e.target.value})}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#901b20]-500 focus:border-[#901b20]-500 transition-all duration-300 hover:border-gray-300 text-base"
              placeholder="e.g., Marketing Director"
              required
            />
          </div>

          {/* Mobile Number */}
          <div>
            <label className="block text-base font-semibold text-gray-900 mb-3">
              Mobile Number *
            </label>
            <input
              type="tel"
              value={speakerForm.mobile}
              onChange={(e) => setSpeakerForm({...speakerForm, mobile: e.target.value})}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#901b20]-500 focus:border-[#901b20]-500 transition-all duration-300 hover:border-gray-300 text-base"
              placeholder="+1234567890"
              required
            />
          </div>

          {/* Photo URL */}
          <div>
            <label className="block text-base font-semibold text-gray-900 mb-3">
              Photo URL
            </label>
            <input
              type="url"
              value={speakerForm.photo}
              onChange={(e) => setSpeakerForm({...speakerForm, photo: e.target.value})}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#901b20]-500 focus:border-[#901b20]-500 transition-all duration-300 hover:border-gray-300 text-base"
              placeholder="https://example.com/photo.jpg"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex gap-4 mt-8">
          <button 
            type="submit" 
            disabled={isLoadingSpeaker}
            className="px-8 py-3 bg-gradient-to-r from-[#901b20] to-[#901b20]/90 text-white rounded-xl font-semibold hover:from-[#901b20]/90 hover:to-[#901b20] transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoadingSpeaker ? (
              <>
                <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a7.646 7.646 0 100 15.292 7.646 7.646 0 000-15.292zm0 0V1m0 3.354a7.646 7.646 0 100 15.292 7.646 7.646 0 000-15.292z" />
                </svg>
                <span>Adding Speaker...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Add Speaker</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  </div>
)}
    </div>
  );



case 4:
        return (
          <div className="space-y-8 max-w-3xl mx-auto p-6">
<div className="relative h-48 mb-12 rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 via-[#203947] to-[#901b20] shadow-2xl">
  {/* Decorative gradients */}
  <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/20"></div>
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_80%,rgba(255,255,255,0.1),transparent_50%)]"></div>
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(144,27,32,0.3),transparent_50%)]"></div>
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_40%,rgba(255,255,255,0.05),transparent)] animate-pulse"></div>
  
  {/* Floating shapes */}
  <div className="absolute top-6 right-6 w-16 h-16 bg-white/10 rounded-full blur-md animate-pulse"></div>
  <div className="absolute bottom-6 left-6 w-24 h-24 bg-[#901b20]/20 rounded-full blur-2xl animate-pulse delay-1000"></div>

  {/* Header content */}
  <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
    <h2 className="text-white text-3xl font-bold mb-2 animate-fade-in">Add Candidate Job Profile</h2>
    <div className="w-24 h-1 bg-gradient-to-r from-white/70 to-white/30 rounded-full"></div>
  </div>
</div>


            <div className="space-y-6">
              {/* Title */}
              <div className="group">
                <label className="block text-sm font-semibold text-[#203947] mb-2 transition-colors group-focus-within:text-[#901b20]">
                  Job Title
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.title || ''}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-[#ebebeb] rounded-xl focus:border-[#901b20] focus:ring-4 focus:ring-[#901b20]/20 transition-all duration-300 bg-white/50 backdrop-blur-sm hover:border-[#ad565a] placeholder-gray-400"
                    placeholder="e.g., Backend Developer"
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#901b20]/5 to-[#ad565a]/5 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              </div>

              {/* Description */}
              <div className="group">
                <label className="block text-sm font-semibold text-[#203947] mb-2 transition-colors group-focus-within:text-[#901b20]">
                  Job Summary
                </label>
                <div className="relative">
                  <textarea
                    value={formData.description || ''}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-[#ebebeb] rounded-xl focus:border-[#901b20] focus:ring-4 focus:ring-[#901b20]/20 transition-all duration-300 bg-white/50 backdrop-blur-sm hover:border-[#ad565a] placeholder-gray-400 resize-none"
                    rows={4}
                    placeholder="Job responsibilities..."
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#901b20]/5 to-[#ad565a]/5 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              </div>

              {/* Requirements */}
              {/* <div className="group">
                <label className="block text-sm font-semibold text-[#203947] mb-2 transition-colors group-focus-within:text-[#901b20]">
                  Requirements
                </label>
                <div className="relative">
                  <textarea
                    value={formData.requirements || ''}
                    onChange={(e) => handleInputChange('requirements', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-[#ebebeb] rounded-xl focus:border-[#901b20] focus:ring-4 focus:ring-[#901b20]/20 transition-all duration-300 bg-white/50 backdrop-blur-sm hover:border-[#ad565a] placeholder-gray-400 resize-none"
                    rows={3}
                    placeholder="Skills, tools, experience..."
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#901b20]/5 to-[#ad565a]/5 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              </div> */}

              {/* Employment Type & Location Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Employment Type */}
                <div className="group">
                  <label className="block text-sm font-semibold text-[#203947] mb-2 transition-colors group-focus-within:text-[#901b20]">
                    Employment Type
                  </label>
                  <div className="relative">
                    <select
                      value={formData.employment_type || ''}
                      onChange={(e) => handleInputChange('employment_type', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-[#ebebeb] rounded-xl focus:border-[#901b20] focus:ring-4 focus:ring-[#901b20]/20 transition-all duration-300 bg-white/50 backdrop-blur-sm hover:border-[#ad565a] appearance-none cursor-pointer"
                    >
                      <option value="">Select type</option>
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Internship">Internship</option>
                      <option value="Contract">Contract</option>
                    </select>
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <svg className="w-5 h-5 text-[#203947] group-focus-within:text-[#901b20] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#901b20]/5 to-[#ad565a]/5 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                </div>

                {/* Location */}
                <div className="group">
                  <label className="block text-sm font-semibold text-[#203947] mb-2 transition-colors group-focus-within:text-[#901b20]">
                    Location
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.location || ''}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-[#ebebeb] rounded-xl focus:border-[#901b20] focus:ring-4 focus:ring-[#901b20]/20 transition-all duration-300 bg-white/50 backdrop-blur-sm hover:border-[#ad565a] placeholder-gray-400"
                      placeholder="e.g., Cairo"
                    />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#901b20]/5 to-[#ad565a]/5 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                </div>
              </div>

              {/* Positions Available */}
              <div className="group">
                <label className="block text-sm font-semibold text-[#203947] mb-2 transition-colors group-focus-within:text-[#901b20]">
                  Positions Available
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    value={formData.positions_available || ''}
                    onChange={(e) => handleInputChange('positions_available', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-[#ebebeb] rounded-xl focus:border-[#901b20] focus:ring-4 focus:ring-[#901b20]/20 transition-all duration-300 bg-white/50 backdrop-blur-sm hover:border-[#ad565a] placeholder-gray-400"
                    placeholder="Number of positions"
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#901b20]/5 to-[#ad565a]/5 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              </div>

              {/* Tracks Selection */}
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-[#203947] mb-4">Available Tracks</label>
                <div className="bg-white/30 backdrop-blur-sm rounded-2xl p-6 border border-[#ebebeb]">
                  <div className="space-y-4">
                    {availableTracks.map(track => {
                      const trackIndex = formData.tracks.findIndex(t => t.track_id === track.id);
                      const trackPref = trackIndex !== -1 ? formData.tracks[trackIndex] : { preference_level: '' };
                      return (
                        <div key={track.id} className="group">
                          <div className="flex items-center space-x-4 p-4 rounded-xl border border-[#ebebeb] hover:border-[#ad565a] transition-all duration-300 hover:shadow-lg hover:shadow-[#901b20]/10 bg-white/50">
                            <div className="relative">
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
                                className="w-5 h-5 text-[#901b20] border-2 border-[#ebebeb] rounded-lg focus:ring-4 focus:ring-[#901b20]/20 transition-all duration-300"
                                id={`track-${track.id}`}
                              />
                              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#901b20]/10 to-[#ad565a]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                            </div>
                            <label htmlFor={`track-${track.id}`} className="flex-1 text-[#203947] font-medium cursor-pointer">
                              {track.name}
                            </label>

                            {trackIndex !== -1 && (
                              <div className="relative animate-slide-in">
                                <select
                                  value={trackPref.preference_level}
                                  onChange={(e) => {
                                    const newTracks = formData.tracks.map((t, idx) =>
                                      idx === trackIndex ? { ...t, preference_level: e.target.value } : t
                                    );
                                    handleInputChange('tracks', newTracks);
                                  }}
                                  className="border-2 border-[#ebebeb] rounded-lg px-3 py-2 focus:border-[#901b20] focus:ring-4 focus:ring-[#901b20]/20 transition-all duration-300 bg-white/80 backdrop-blur-sm text-[#203947] font-medium"
                                >
                                  <option value="required">Required</option>
                                  <option value="preferred">Preferred</option>
                                  <option value="acceptable">Acceptable</option>
                                </select>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {candidateSuccess && (
                <div className="text-[#203947] font-semibold text-sm bg-gradient-to-r from-[#203947] to-[#203947]/30 p-4 rounded-xl border-2 border-[#203947]/60 animate-slide-in">
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 bg-[#203947]/50 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span>{candidateSuccess}</span>
                  </div>
                </div>
              )}
              {candidateError && (
                <div className="text-[#901b20] font-semibold text-sm bg-gradient-to-r from-red-50 to-red-100 p-4 rounded-xl border-2 border-[#901b20]/40 animate-slide-in">
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 bg-[#901b20] rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                    <span>{candidateError}</span>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-center pt-8">
                <button
                  onClick={handleJobProfileSubmit}
                  disabled={isSubmitting || isLoading}
                  className="group relative px-8 py-4 bg-gradient-to-r from-[#901b20] to-[#ad565a] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:shadow-[#901b20]/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 active:scale-95 min-w-48"
                >
                  <span className="relative z-10 flex items-center justify-center space-x-2">
                    {(isSubmitting || isLoading) ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Adding...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Job Profile</span>
                        <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </>
                    )}
                  </span>
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#203947] to-[#901b20] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
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
    <div className="min-h-screen py-8 ">
      <div className="max-w-4xl mx-auto px-4">
        {/* Progress Steps */}
        <div className="mb-9">
          <div className="flex items-center justify-between">
{getSteps().map((step, index) => {
  const Icon = step.icon;
  const isComplete = step.id < currentStep;
  const isCurrent = step.id === currentStep;

  return (
    <div key={step.id} className="flex flex-col items-center text-center relative">
      <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 z-10
        ${isComplete
          ? 'bg-[#203947] border-[#203947] text-white'         
          : isCurrent
            ? 'bg-[#901b20] border-[#901b20] text-white'       
            : 'bg-white border-gray-300 text-gray-400'}       
      `}>
        {isComplete ? (
          <CheckCircle className="w-6 h-6" />
        ) : (
          <Icon className="w-6 h-6" />
        )}
      </div>

      <div className="mt-2">
        <p className={`text-sm font-medium ${isCurrent ? 'text-[#901b20]' : 'text-gray-500'}`}>
          {step.title}
        </p>
        <p className="text-xs text-gray-400">{step.description}</p>
      </div>

      {index < getSteps().length - 1 && (
        <div
          className="absolute top-1/4 left-full w-24 h-0.5 ml-2"
          style={{ backgroundColor: isComplete ? '#203947' : '#d1d5db' }}
        />
      )}
    </div>
  );
})}
          </div>
        </div>

        {/* Messages */}
        {successMsg && (
          <div className="mb-4 p-4 bg-[#203947]/20 border border-[#203947]/30 text-[#203947]-700 rounded">
            {successMsg}
          </div>
        )}
        
        {errorMsg && (
          <div className="mb-4 p-4 bg-[#901b20]/20 border border-[#901b20]/30 text-[#901b20]/70 rounded">
            {errorMsg}
          </div>
        )}

        {/* Step Content */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          {renderStepContent()}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-8 pt-6 ">
            {currentStep !== 2 && (
              <button
                onClick={handleNext}
                disabled={(!isCurrentStepValid() && !forceStepUnlock) || isSubmitting || isLoading}
                className="flex items-center px-6 py-2 bg-[#901b20]/60 text-white rounded-lg hover:bg-[#901b20]/70 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting || isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4  border-white mr-2"></div>
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