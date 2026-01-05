import { create } from 'zustand';
import { ResumeData, PersonalInfo, WorkExperience, Education, Skill, Project, Certification, Language } from '../types/resume';

interface ResumeStore {
  resumeData: ResumeData;
  updatePersonalInfo: (info: Partial<PersonalInfo>) => void;
  updateSummary: (summary: string) => void;
  setResumeData: (data: ResumeData) => void;
  addWorkExperience: () => void;
  updateWorkExperience: (id: string, experience: Partial<WorkExperience>) => void;
  removeWorkExperience: (id: string) => void;
  addEducation: () => void;
  updateEducation: (id: string, education: Partial<Education>) => void;
  removeEducation: (id: string) => void;
  addSkill: () => void;
  updateSkill: (id: string, skill: Partial<Skill>) => void;
  removeSkill: (id: string) => void;
  addProject: () => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  removeProject: (id: string) => void;
  addCertification: () => void;
  updateCertification: (id: string, certification: Partial<Certification>) => void;
  removeCertification: (id: string) => void;
  addLanguage: () => void;
  updateLanguage: (id: string, language: Partial<Language>) => void;
  removeLanguage: (id: string) => void;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

const initialResumeData: ResumeData = {
  personalInfo: {
    fullName: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    website: '',
  },
  summary: '',
  workExperience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
  languages: [],
};

export const useResumeStore = create<ResumeStore>((set) => ({
  resumeData: initialResumeData,
  
  updatePersonalInfo: (info) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        personalInfo: { ...state.resumeData.personalInfo, ...info },
      },
    })),
  
  updateSummary: (summary) =>
    set((state) => ({
      resumeData: { ...state.resumeData, summary },
    })),
  
  setResumeData: (data) =>
    set({ resumeData: data }),
  
  addWorkExperience: () =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        workExperience: [
          ...state.resumeData.workExperience,
          {
            id: generateId(),
            company: '',
            position: '',
            location: '',
            startDate: '',
            endDate: '',
            current: false,
            description: [''],
          },
        ],
      },
    })),
  
  updateWorkExperience: (id, experience) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        workExperience: state.resumeData.workExperience.map((exp) =>
          exp.id === id ? { ...exp, ...experience } : exp
        ),
      },
    })),
  
  removeWorkExperience: (id) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        workExperience: state.resumeData.workExperience.filter((exp) => exp.id !== id),
      },
    })),
  
  addEducation: () =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        education: [
          ...state.resumeData.education,
          {
            id: generateId(),
            institution: '',
            degree: '',
            field: '',
            location: '',
            startDate: '',
            endDate: '',
            gpa: '',
            honors: '',
            description: '',
          },
        ],
      },
    })),
  
  updateEducation: (id, education) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        education: state.resumeData.education.map((edu) =>
          edu.id === id ? { ...edu, ...education } : edu
        ),
      },
    })),
  
  removeEducation: (id) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        education: state.resumeData.education.filter((edu) => edu.id !== id),
      },
    })),
  
  addSkill: () =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        skills: [
          ...state.resumeData.skills,
          {
            id: generateId(),
            name: '',
            category: 'Data Analytics',
          },
        ],
      },
    })),
  
  updateSkill: (id, skill) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        skills: state.resumeData.skills.map((s) =>
          s.id === id ? { ...s, ...skill } : s
        ),
      },
    })),
  
  removeSkill: (id) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        skills: state.resumeData.skills.filter((s) => s.id !== id),
      },
    })),
  
  addProject: () =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        projects: [
          ...(state.resumeData.projects || []),
          {
            id: generateId(),
            name: '',
            description: '',
            technologies: '',
            link: '',
          },
        ],
      },
    })),
  
  updateProject: (id, project) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        projects: (state.resumeData.projects || []).map((p) =>
          p.id === id ? { ...p, ...project } : p
        ),
      },
    })),
  
  removeProject: (id) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        projects: (state.resumeData.projects || []).filter((p) => p.id !== id),
      },
    })),
  
  addCertification: () =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        certifications: [
          ...(state.resumeData.certifications || []),
          {
            id: generateId(),
            name: '',
            issuer: '',
            date: '',
            expiryDate: '',
          },
        ],
      },
    })),
  
  updateCertification: (id, certification) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        certifications: (state.resumeData.certifications || []).map((c) =>
          c.id === id ? { ...c, ...certification } : c
        ),
      },
    })),
  
  removeCertification: (id) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        certifications: (state.resumeData.certifications || []).filter((c) => c.id !== id),
      },
    })),
  
  addLanguage: () =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        languages: [
          ...(state.resumeData.languages || []),
          {
            id: generateId(),
            name: '',
            proficiency: 'Native',
          },
        ],
      },
    })),
  
  updateLanguage: (id, language) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        languages: (state.resumeData.languages || []).map((l) =>
          l.id === id ? { ...l, ...language } : l
        ),
      },
    })),
  
  removeLanguage: (id) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        languages: (state.resumeData.languages || []).filter((l) => l.id !== id),
      },
    })),
}));

