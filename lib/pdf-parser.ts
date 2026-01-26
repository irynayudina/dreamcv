import { CVData, initialCVData } from "./cv-schema";

export function parseCVText(text: string): CVData {
  const data: CVData = JSON.parse(JSON.stringify(initialCVData));
  
  // Normalize text: remove multiple spaces, handle line breaks
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  const fullText = lines.join('\n');

  // 1. Extract Contact Info
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4,6}/g;
  
  data.personalInfo.email = (fullText.match(emailRegex) || [""])[0];
  data.personalInfo.phone = (fullText.match(phoneRegex) || [""])[0];
  
  // Name is often the first line or first few words
  if (lines.length > 0) {
    data.personalInfo.name = lines[0];
  }

  // 2. Identify Sections
  const sections: { [key: string]: string[] } = {
    experience: ["experience", "work history", "professional experience", "employment history"],
    education: ["education", "academic background", "qualifications"],
    skills: ["skills", "technical skills", "competencies", "expertise"],
    projects: ["projects", "personal projects", "portfolio"],
    languages: ["languages"],
    certifications: ["certifications", "awards", "licenses"]
  };

  let currentSection = "";
  const sectionContent: { [key: string]: string[] } = {};

  for (const line of lines) {
    const lowerLine = line.toLowerCase();
    let foundSection = false;

    for (const [key, headers] of Object.entries(sections)) {
      if (headers.some(header => lowerLine === header || lowerLine.startsWith(header + ":"))) {
        currentSection = key;
        foundSection = true;
        break;
      }
    }

    if (foundSection) continue;

    if (currentSection) {
      if (!sectionContent[currentSection]) sectionContent[currentSection] = [];
      sectionContent[currentSection].push(line);
    } else {
      // Potentially summary or header info
      if (!data.personalInfo.name && line.length < 50) data.personalInfo.name = line;
    }
  }

  // 3. Process Sections
  
  // Skills: Often comma-separated or list
  if (sectionContent.skills) {
    data.skills = sectionContent.skills
      .flatMap(line => line.split(/[,|•]|\s{2,}/))
      .map(s => s.trim())
      .filter(s => s.length > 1);
  }

  // Languages
  if (sectionContent.languages) {
    data.languages = sectionContent.languages
      .flatMap(line => line.split(/[,|•]/))
      .map(s => s.trim())
      .filter(s => s.length > 1);
  }

  // Experience: A bit more complex. Simplified approach: split by bullet points or common separators
  if (sectionContent.experience) {
    let currentExp: any = null;
    
    for (const line of sectionContent.experience) {
      // heuristic for new experience item: Company Name or Date Range
      const dateRangeRegex = /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|20\d{2})/i;
      
      if (dateRangeRegex.test(line) && line.length < 100) {
        if (currentExp) data.experience.push(currentExp);
        currentExp = {
          company: line.split(/[-–—|]/)[0]?.trim() || "",
          position: "",
          startDate: "",
          endDate: "",
          isCurrent: line.toLowerCase().includes("present"),
          location: "",
          highlights: []
        };
      } else if (currentExp) {
        if (line.startsWith("•") || line.startsWith("-") || line.startsWith("*")) {
          currentExp.highlights.push(line.replace(/^[•\-*]\s*/, ""));
        } else if (!currentExp.position) {
          currentExp.position = line;
        }
      }
    }
    if (currentExp) data.experience.push(currentExp);
  }

  // Education
  if (sectionContent.education) {
    let currentEdu: any = null;
    for (const line of sectionContent.education) {
      if (/(University|College|Institute|School|Degree|Bachelor|Master|PhD)/i.test(line)) {
        if (currentEdu) data.education.push(currentEdu);
        currentEdu = {
          institution: line,
          degree: "",
          fieldOfStudy: "",
          startDate: "",
          endDate: "",
          description: ""
        };
      } else if (currentEdu && !currentEdu.degree) {
        currentEdu.degree = line;
      }
    }
    if (currentEdu) data.education.push(currentEdu);
  }

  return data;
}
