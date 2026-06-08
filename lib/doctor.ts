export type EducationEntry = {
  degree: string;
  institution: string;
  year: string;
};

export type DoctorProfile = {
  name: string;
  title: string;
  photoUrl: string;
  primaryDegree: string;
  college: string;
  graduationYear: string;
  registrationNumber: string;
  specialisations: string[];
  yearsExperience: number;
  patientsTreated: string;
  proceduresDone: string;
  philosophy: string[];
  education: EducationEntry[];
  memberships: string[];
};

export const doctor: DoctorProfile = {
  name: "Dr. Megha Sharma",
  title: "Lead Dentist, Clove Dental Pimpri",
  photoUrl:
    "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&h=700&fit=crop",
  primaryDegree: "BDS",
  college: "Bharati Vidyapeeth Dental College, Pune",
  graduationYear: "2012",
  registrationNumber: "Maharashtra State Dental Council — A-12345",
  specialisations: [
    "General & Family Dentistry",
    "Dental Fillings & Restorations",
    "Teeth Cleaning & Preventive Care",
    "Kids Dentistry",
    "Cosmetic Smile Enhancement",
    "Root Canal Treatment",
  ],
  yearsExperience: 12,
  patientsTreated: "5,000+",
  proceduresDone: "3,000+ fillings & cleanings",
  philosophy: [
    "I've been treating patients in Pimpri and Chinchwad for over 12 years. What I care about most is helping you feel calm and informed — not rushed through a waiting room.",
    "Many people arrive nervous, especially if it's been years since their last visit. I take time to explain what I see, what your options are, and what I'd recommend for my own family.",
    "Good dentistry isn't just about fixing a tooth — it's about building trust so you keep coming back for preventive care. That's how we keep problems small and smiles healthy.",
  ],
  education: [
    {
      degree: "BDS (Bachelor of Dental Surgery)",
      institution: "Bharati Vidyapeeth Dental College, Pune",
      year: "2012",
    },
    {
      degree: "Certification in Advanced Restorative Dentistry",
      institution: "Indian Dental Association Continuing Education",
      year: "2016",
    },
  ],
  memberships: [
    "Indian Dental Association (IDA)",
    "Maharashtra State Dental Council",
    "Indian Society of Pedodontics and Preventive Dentistry",
  ],
};
