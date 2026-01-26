export interface ContactInfo {
  name: string;
  email: string;
  phone: string;
  location: string;
  links: { label: string; url: string }[];
}

export interface Education {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Experience {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  location: string;
  highlights: string[];
}

export interface CVData {
  personalInfo: ContactInfo;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: string[];
  projects: {
    name: string;
    description: string;
    highlights: string[];
    link?: string;
  }[];
  certifications: string[];
  languages: string[];
}

export const initialCVData: CVData = {
  personalInfo: {
    name: "",
    email: "",
    phone: "",
    location: "",
    links: [],
  },
  summary: "",
  experience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
  languages: [],
};
