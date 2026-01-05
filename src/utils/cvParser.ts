import * as pdfjsLib from 'pdfjs-dist';
import { ResumeData, PersonalInfo, WorkExperience, Education, Skill, Project } from '../types/resume';

// Initialize PDF.js worker
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

export const parsePDF = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let fullText = '';

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    
    // Better line break detection - check y position to detect new lines
    let lastY = null;
    let pageText = '';
    
    for (const item of textContent.items as any[]) {
      const currentY = item.transform[5]; // Y position
      
      // If Y position changed significantly, it's likely a new line
      if (lastY !== null && Math.abs(currentY - lastY) > 5) {
        pageText += '\n';
      }
      
      pageText += item.str;
      
      // Add space if items are on same line but have gap
      if (item.hasEOL) {
        pageText += '\n';
      } else {
        pageText += ' ';
      }
      
      lastY = currentY;
    }
    
    fullText += pageText + '\n\n';
  }

  return fullText;
};

export const parseTextFile = async (file: File): Promise<string> => {
  return await file.text();
};

// Fallback parsers - define before parseCV
const parseSummaryFallback = (lines: string[]): string => {
  const summaryLines: string[] = [];
  for (let i = 5; i < Math.min(25, lines.length); i++) {
    const line = lines[i];
    if (line.length > 15 && line.length < 200 && 
        !/\d{4}\s*[-–—]\s*\d{4}/.test(line) &&
        !line.match(/^(experience|education|skills|projects)/i)) {
      summaryLines.push(line);
      if (summaryLines.length >= 3) break;
    }
  }
  return summaryLines.join(' ').trim();
};

const parseWorkExperienceFallback = (lines: string[]): WorkExperience[] => {
  const experiences: WorkExperience[] = [];
  const dateRegex = /(\d{4}|\w+\s+\d{4})\s*[-–—]\s*(\d{4}|present|current)/i;
  for (let i = 10; i < lines.length; i++) {
    const line = lines[i];
    const dateMatch = line.match(dateRegex);
    if (dateMatch) {
      const exp: WorkExperience = {
        id: generateId(),
        position: '',
        company: '',
        location: '',
        startDate: dateMatch[1],
        endDate: dateMatch[2],
        current: /present|current/i.test(dateMatch[2]),
        description: [],
      };
      for (let j = Math.max(0, i - 3); j < i; j++) {
        const prevLine = lines[j];
        if (prevLine.length > 5 && prevLine.length < 100 && !dateRegex.test(prevLine)) {
          if (!exp.position) exp.position = prevLine;
          else if (!exp.company) exp.company = prevLine;
        }
      }
      let descIndex = i + 1;
      const descriptionLines: string[] = [];
      while (descIndex < lines.length && descIndex < i + 10 && !dateRegex.test(lines[descIndex])) {
        if (lines[descIndex].match(/^[•\-\*]\s*/) || (lines[descIndex].length > 15 && lines[descIndex].length < 200)) {
          descriptionLines.push(lines[descIndex].replace(/^[•\-\*]\s*/, ''));
        }
        descIndex++;
        if (descriptionLines.length >= 5) break;
      }
      exp.description = descriptionLines.length > 0 ? descriptionLines : [''];
      experiences.push(exp);
      if (experiences.length >= 10) break;
    }
  }
  return experiences;
};

const parseEducationFallback = (lines: string[]): Education[] => {
  const educations: Education[] = [];
  const dateRegex = /(\d{4}|\w+\s+\d{4})\s*[-–—]\s*(\d{4}|present|current)/i;
  const degreeRegex = /(bachelor|master|phd|doctorate|associate|diploma|degree|bs|ba|ms|ma|ph\.?d|b\.?s|m\.?s)/i;
  for (let i = 10; i < lines.length; i++) {
    const line = lines[i];
    const degreeMatch = line.match(degreeRegex);
    const dateMatch = line.match(dateRegex);
    if (degreeMatch || dateMatch) {
      const edu: Education = {
        id: generateId(),
        degree: degreeMatch ? line.split(/[|•,]/)[0].trim() : '',
        field: '',
        institution: '',
        location: '',
        startDate: dateMatch ? dateMatch[1] : '',
        endDate: dateMatch ? dateMatch[2] : '',
      };
      for (let j = Math.max(0, i - 2); j < Math.min(lines.length, i + 5); j++) {
        if (j !== i && lines[j].length > 5 && lines[j].length < 100) {
          if (!edu.institution && !dateRegex.test(lines[j])) edu.institution = lines[j];
          else if (!edu.location && !dateRegex.test(lines[j])) edu.location = lines[j];
        }
      }
      educations.push(edu);
      if (educations.length >= 5) break;
    }
  }
  return educations;
};

const parseSkillsFallback = (lines: string[]): Skill[] => {
  const skills: Skill[] = [];
  const skillKeywords = ['python', 'java', 'javascript', 'react', 'sql', 'html', 'css', 'typescript', 'node', 'api', 'database'];
  for (let i = 10; i < lines.length; i++) {
    const line = lines[i].toLowerCase();
    const hasSkillKeyword = skillKeywords.some(kw => line.includes(kw));
    if (hasSkillKeyword && line.length < 200) {
      const skillList = lines[i].split(/[,|•]/).map(s => s.trim()).filter(s => s.length > 2 && s.length < 50);
      skillList.forEach(skill => {
        let category = 'Technical';
        if (/data|analytics|analysis|pandas|sql/i.test(skill)) category = 'Data Analytics';
        else if (/frontend|react|vue|angular|html|css|javascript|typescript/i.test(skill)) category = 'Frontend';
        else if (/backend|api|server|node|fastapi|rest/i.test(skill)) category = 'Backend & APIs';
        else if (/visualization|dashboard|bi|tableau|powerbi/i.test(skill)) category = 'Visualization';
        skills.push({ id: generateId(), name: skill, category: category });
      });
      if (skills.length >= 30) break;
    }
  }
  return skills;
};

export const parseCV = (text: string): Partial<ResumeData> => {
  // Normalize text - handle different line breaks and spacing
  // Also try to split on common separators if text is all on one line
  let normalizedText = text
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n');
  
  // If text appears to be all on one line, try to split on common patterns
  if (normalizedText.split('\n').length <= 3 && normalizedText.length > 100) {
    // Try splitting on common patterns
    normalizedText = normalizedText
      .replace(/\s{3,}/g, '\n') // Multiple spaces to newline
      .replace(/([.!?])\s+/g, '$1\n') // Sentences to newlines
      .replace(/(\d{4}\s*[-–—]\s*\d{4})/g, '\n$1\n') // Dates on their own line
      .replace(/([A-Z][a-z]+\s+[A-Z][a-z]+)/g, '\n$1\n'); // Names/headers
  }
  
  normalizedText = normalizedText.replace(/\n{3,}/g, '\n\n'); // Multiple newlines to double
  
  const lines = normalizedText
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);
  
  console.log('Total lines:', lines.length);
  console.log('First 20 lines:', lines.slice(0, 20));
  
  // Find all section boundaries first
  const sections = findSections(lines);
  console.log('Detected sections:', sections);
  
  const resumeData: Partial<ResumeData> = {
    personalInfo: parsePersonalInfo(lines, sections),
  };

  // Always try to parse sections, even if not explicitly found
  // Many CVs don't have clear section headers
  
  // Try summary
  if (sections.summary) {
    resumeData.summary = parseSummary(lines, sections);
  } else {
    // Try to find summary in first part of document
    resumeData.summary = parseSummaryFallback(lines);
  }

  // Try experience - be more aggressive
  if (sections.experience) {
    resumeData.workExperience = parseWorkExperience(lines, sections);
  } else {
    // Try to find experience without explicit section header
    resumeData.workExperience = parseWorkExperienceFallback(lines);
  }

  // Try education
  if (sections.education) {
    resumeData.education = parseEducation(lines, sections);
  } else {
    resumeData.education = parseEducationFallback(lines);
  }

  // Try skills
  if (sections.skills) {
    resumeData.skills = parseSkills(lines, sections);
  } else {
    resumeData.skills = parseSkillsFallback(lines);
  }

  if (sections.projects) {
    resumeData.projects = parseProjects(lines, sections);
  }

  if (sections.certifications) {
    resumeData.certifications = parseCertifications(lines, sections);
  }

  if (sections.languages) {
    resumeData.languages = parseLanguages(lines, sections);
  }

  console.log('Final parsed data:', resumeData);
  return resumeData;
};

interface SectionBoundaries {
  header: number; // End of header (usually first 5-10 lines)
  summary?: number;
  experience?: number;
  education?: number;
  skills?: number;
  projects?: number;
  certifications?: number;
  languages?: number;
}

const findSections = (lines: string[]): SectionBoundaries => {
  const sections: SectionBoundaries = {
    header: Math.min(10, Math.floor(lines.length * 0.15)), // First 10 lines or 15% of document
  };

  const sectionPatterns = [
    { 
      keywords: ['summary', 'professional summary', 'profile', 'objective', 'about me', 'executive summary', 'overview'],
      key: 'summary' as keyof SectionBoundaries
    },
    { 
      keywords: ['experience', 'work experience', 'employment', 'work history', 'professional experience', 'career', 'employment history', 'work', 'positions'],
      key: 'experience' as keyof SectionBoundaries
    },
    { 
      keywords: ['education', 'academic', 'qualifications', 'academic background', 'academics'],
      key: 'education' as keyof SectionBoundaries
    },
    { 
      keywords: ['skills', 'technical skills', 'competencies', 'expertise', 'core competencies', 'technical', 'technologies'],
      key: 'skills' as keyof SectionBoundaries
    },
    { 
      keywords: ['projects', 'personal projects', 'side projects', 'project'],
      key: 'projects' as keyof SectionBoundaries
    },
    { 
      keywords: ['certifications', 'certificates', 'licenses', 'certification'],
      key: 'certifications' as keyof SectionBoundaries
    },
    { 
      keywords: ['languages', 'language', 'linguistic'],
      key: 'languages' as keyof SectionBoundaries
    },
  ];

  // Look for section headers - be more flexible
  for (let i = sections.header; i < lines.length; i++) {
    const line = lines[i].trim();
    const lowerLine = line.toLowerCase();
    
    // Check if this line is a section header
    // Criteria: matches keyword AND (is short OR all caps OR has special formatting)
    const isShortLine = line.length < 60;
    const isAllCaps = line === line.toUpperCase() && line.length > 2 && line.length < 40;
    const hasOnlyLetters = /^[A-Za-z\s]+$/.test(line);
    const looksLikeHeader = (isShortLine && hasOnlyLetters) || isAllCaps;
    
    for (const { keywords, key } of sectionPatterns) {
      if (!sections[key]) {
        const matchesKeyword = keywords.some(kw => lowerLine === kw || lowerLine.startsWith(kw + ' ') || lowerLine.includes(' ' + kw));
        if (matchesKeyword && looksLikeHeader) {
          sections[key] = i;
          console.log(`Found ${key} section at line ${i}: "${line}"`);
          break;
        }
      }
    }
  }

  return sections;
};

const parsePersonalInfo = (lines: string[], sections: SectionBoundaries): PersonalInfo => {
  const personalInfo: PersonalInfo = {
    fullName: '',
    email: '',
    phone: '',
    location: '',
  };

  // Only parse from header section
  const headerLines = lines.slice(0, sections.header);

  // Name is usually the first line (and should be a reasonable length)
  if (headerLines.length > 0) {
    const firstLine = headerLines[0];
    // Name should be 2-50 characters, not contain email/phone patterns
    // But be more lenient - if it's the first line and looks like a name, use it
    if (firstLine.length >= 2 && firstLine.length <= 80 && 
        !firstLine.includes('@') && 
        !/\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/.test(firstLine) &&
        !firstLine.toLowerCase().includes('experience') &&
        !firstLine.toLowerCase().includes('education') &&
        !firstLine.toLowerCase().includes('skills')) {
      personalInfo.fullName = firstLine;
    } else if (headerLines.length > 1) {
      // Try second line if first doesn't work
      const secondLine = headerLines[1];
      if (secondLine.length >= 2 && secondLine.length <= 80 && 
          !secondLine.includes('@') && 
          !/\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/.test(secondLine)) {
        personalInfo.fullName = secondLine;
      }
    }
  }

  // Extract email (only from header)
  const emailRegex = /[\w.-]+@[\w.-]+\.\w+/;
  for (const line of headerLines) {
    const emailMatch = line.match(emailRegex);
    if (emailMatch) {
      personalInfo.email = emailMatch[0];
      break;
    }
  }

  // Extract phone (only from header)
  const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
  for (const line of headerLines) {
    const phoneMatch = line.match(phoneRegex);
    if (phoneMatch) {
      personalInfo.phone = phoneMatch[0];
      break;
    }
  }

  // Extract LinkedIn (only from header)
  const linkedinRegex = /(?:linkedin\.com\/in\/|linkedin\.com\/profile\/)([\w-]+)/i;
  for (const line of headerLines) {
    const linkedinMatch = line.match(linkedinRegex);
    if (linkedinMatch) {
      personalInfo.linkedin = linkedinMatch[0];
      break;
    }
  }

  // Extract website (only from header, exclude LinkedIn)
  const websiteRegex = /(?:https?:\/\/)?(?:www\.)?([\w.-]+\.(?:com|org|net|io|dev|co|edu))/i;
  for (const line of headerLines) {
    const websiteMatch = line.match(websiteRegex);
    if (websiteMatch && !websiteMatch[0].includes('linkedin')) {
      personalInfo.website = websiteMatch[0];
      break;
    }
  }

  // Extract location (only from header, usually contains city, state)
  const locationPatterns = [/\b[A-Z][a-z]+,\s*[A-Z]{2}\b/, /\b[A-Z][a-z]+\s*,\s*[A-Z][a-z]+\b/];
  for (const line of headerLines) {
    for (const pattern of locationPatterns) {
      const locationMatch = line.match(pattern);
      if (locationMatch && !personalInfo.location) {
        personalInfo.location = locationMatch[0];
        break;
      }
    }
  }

  return personalInfo;
};

const parseSummary = (lines: string[], sections: SectionBoundaries): string => {
  if (!sections.summary) return '';

  // Start after the section header line
  let summaryStart = sections.summary + 1;
  const summaryEnd = sections.experience || sections.education || sections.skills || lines.length;
  
  const summaryKeywords = ['summary', 'professional summary', 'profile', 'objective'];
  const summaryLines: string[] = [];
  
  // Skip the section header line itself if it's still there
  if (summaryStart < lines.length) {
    const firstLine = lines[summaryStart];
    const firstLower = firstLine.toLowerCase();
    const isHeader = firstLine === firstLine.toUpperCase() && 
                    summaryKeywords.some((kw: string) => firstLower.includes(kw)) &&
                    firstLine.length < 50;
    if (isHeader) {
      summaryStart++;
    }
  }
  
  for (let i = summaryStart; i < summaryEnd && i < lines.length; i++) {
    // Stop if we hit another section
    if (i === sections.experience || i === sections.education || i === sections.skills) {
      break;
    }
    
    const line = lines[i];
    const lowerLine = line.toLowerCase();
    
    // Skip any section header lines
    const isSectionHeader = line === line.toUpperCase() && 
                           (summaryKeywords.some((kw: string) => lowerLine.includes(kw)) ||
                            lowerLine.includes('experience') ||
                            lowerLine.includes('education') ||
                            lowerLine.includes('skills')) &&
                           line.length < 50;
    if (isSectionHeader) {
      continue;
    }
    
    // Skip very short lines or lines that look like section headers
    if (line.length > 10 && line.length < 200 && line !== line.toUpperCase()) {
      summaryLines.push(line);
    }
    if (summaryLines.length >= 5) break; // Limit to 5 lines
  }

  return summaryLines.join(' ').trim();
};

const parseWorkExperience = (lines: string[], sections: SectionBoundaries): WorkExperience[] => {
  const experiences: WorkExperience[] = [];
  
  if (!sections.experience) return [];

  let expStart = sections.experience + 1;
  const expEnd = sections.education || sections.skills || sections.projects || lines.length;

  const dateRegex = /(\d{4}|\w+\s+\d{4})\s*[-–—]\s*(\d{4}|present|current)/i;
  const currentRegex = /present|current/i;
  const experienceKeywords = ['experience', 'work experience', 'employment', 'professional experience'];
  
  // Skip the section header line itself
  if (expStart < lines.length) {
    const firstLine = lines[expStart];
    const firstLower = firstLine.toLowerCase();
    const isHeader = firstLine === firstLine.toUpperCase() && 
                    experienceKeywords.some((kw: string) => firstLower.includes(kw)) &&
                    firstLine.length < 50;
    if (isHeader) {
      expStart++;
    }
  }

  let i = expStart;
  
  while (i < expEnd && i < lines.length) {
    const line = lines[i];
    const lowerLine = line.toLowerCase();
    
    // Skip any section header lines
    const isSectionHeader = line === line.toUpperCase() && 
                           experienceKeywords.some(kw => lowerLine.includes(kw)) &&
                           line.length < 50;
    if (isSectionHeader) {
      i++;
      continue;
    }
    
    const dateMatch = line.match(dateRegex);

    if (dateMatch) {
      const exp: WorkExperience = {
        id: generateId(),
        position: '',
        company: '',
        location: '',
        startDate: dateMatch[1],
        endDate: dateMatch[2],
        current: currentRegex.test(dateMatch[2]),
        description: [],
      };

      // Look backwards for position/company
      if (i > 0) {
        const prevLine = lines[i - 1];
        if (prevLine.length > 5) {
          // Try to split position and company
          const parts = prevLine.split(/[|•]/);
          if (parts.length >= 2) {
            exp.position = parts[0].trim();
            exp.company = parts[1].trim();
          } else {
            exp.position = prevLine;
          }
        }
      }

      // Look forward for description bullets
      i++;
      const descriptionLines: string[] = [];
      while (i < expEnd && i < lines.length && !dateRegex.test(lines[i])) {
        // Stop if we hit another section
        if (i === sections.education || i === sections.skills || i === sections.projects) {
          break;
        }
        
        if (lines[i].match(/^[•\-\*]\s*/) || (lines[i].length > 20 && lines[i].length < 200)) {
          descriptionLines.push(lines[i].replace(/^[•\-\*]\s*/, ''));
        }
        i++;
        if (descriptionLines.length >= 8) break; // Limit to 8 bullets
      }

      exp.description = descriptionLines.length > 0 ? descriptionLines : [''];
      experiences.push(exp);
    } else {
      i++;
    }
  }

  return experiences;
};

const parseEducation = (lines: string[], sections: SectionBoundaries): Education[] => {
  const educations: Education[] = [];
  
  if (!sections.education) return [];

  let eduStart = sections.education + 1;
  const eduEnd = sections.skills || sections.projects || sections.certifications || lines.length;

  const dateRegex = /(\d{4}|\w+\s+\d{4})\s*[-–—]\s*(\d{4}|present|current)/i;
  const degreeRegex = /(bachelor|master|phd|doctorate|associate|diploma|degree|bs|ba|ms|ma|ph\.?d)/i;
  const educationKeywords = ['education', 'academic', 'qualifications'];
  
  // Skip the section header line itself
  if (eduStart < lines.length) {
    const firstLine = lines[eduStart];
    const firstLower = firstLine.toLowerCase();
    const isHeader = firstLine === firstLine.toUpperCase() && 
                    educationKeywords.some((kw: string) => firstLower.includes(kw)) &&
                    firstLine.length < 50;
    if (isHeader) {
      eduStart++;
    }
  }

  let i = eduStart;
  
  while (i < eduEnd && i < lines.length) {
    const line = lines[i];
    const lowerLine = line.toLowerCase();
    
    // Skip any section header lines
    const isSectionHeader = line === line.toUpperCase() && 
                           educationKeywords.some((kw: string) => lowerLine.includes(kw)) &&
                           line.length < 50;
    if (isSectionHeader) {
      i++;
      continue;
    }
    
    const degreeMatch = line.match(degreeRegex);
    const dateMatch = line.match(dateRegex);

    if (degreeMatch || dateMatch) {
      const edu: Education = {
        id: generateId(),
        degree: '',
        field: '',
        institution: '',
        location: '',
        startDate: dateMatch ? dateMatch[1] : '',
        endDate: dateMatch ? dateMatch[2] : '',
      };

      if (degreeMatch) {
        const parts = line.split(/[|•,]/);
        edu.degree = parts[0].trim();
        if (parts.length > 1) {
          edu.field = parts[1].trim();
        }
        if (parts.length > 2) {
          edu.institution = parts[2].trim();
        }
      }

      // Look for institution in next lines
      i++;
      while (i < eduEnd && i < lines.length && i < eduStart + 15) {
        // Stop if we hit another section
        if (i === sections.skills || i === sections.projects) {
          break;
        }
        
        if (lines[i].length > 5 && !dateRegex.test(lines[i]) && lines[i].length < 100) {
          if (!edu.institution) {
            edu.institution = lines[i];
          } else if (!edu.location) {
            edu.location = lines[i];
          }
        }
        i++;
        if (edu.institution && edu.location) break;
      }

      educations.push(edu);
    } else {
      i++;
    }
  }

  return educations;
};

const parseSkills = (lines: string[], sections: SectionBoundaries): Skill[] => {
  const skills: Skill[] = [];
  
  if (!sections.skills) return [];

  const skillsStart = sections.skills + 1;
  const skillsEnd = sections.projects || sections.certifications || sections.languages || lines.length;

  const skillsKeywords = ['skills', 'technical skills', 'competencies'];
  const categoryPatterns = [
    { pattern: /(data|analytics|analysis)/i, category: 'Data Analytics' },
    { pattern: /(frontend|front-end|react|vue|angular)/i, category: 'Frontend' },
    { pattern: /(backend|back-end|api|server)/i, category: 'Backend & APIs' },
    { pattern: /(visualization|visual|dashboard|bi)/i, category: 'Visualization' },
  ];

  let currentCategory = 'Technical';
  let i = skillsStart;

  while (i < skillsEnd && i < lines.length && i < skillsStart + 30) {
    const line = lines[i];
    const lowerLine = line.toLowerCase();
    
    // Skip section header line
    const isSectionHeader = line === line.toUpperCase() && 
                           skillsKeywords.some((kw: string) => lowerLine.includes(kw)) &&
                           line.length < 50;
    if (isSectionHeader) {
      i++;
      continue;
    }

    // Check if this line is a category header
    for (const { pattern, category } of categoryPatterns) {
      if (pattern.test(line) && line.length < 30) {
        currentCategory = category;
        i++;
        continue;
      }
    }

    // Extract skills (usually comma or colon separated)
    const skillText = lines[i];
    if (skillText.includes(':') || skillText.includes(',')) {
      const parts = skillText.split(/[:,]/);
      const categoryName = parts[0].trim();
      
      // Check if first part is a category
      const isCategory = categoryPatterns.some(({ pattern }) => pattern.test(categoryName));
      if (isCategory && parts.length > 1) {
        currentCategory = categoryName;
        const skillList = parts.slice(1).join(',').split(',').map(s => s.trim()).filter(s => s.length > 0);
        skillList.forEach(skill => {
          skills.push({
            id: generateId(),
            name: skill,
            category: currentCategory,
          });
        });
      } else {
        // Regular skill list
        const skillList = skillText.split(',').map(s => s.trim()).filter(s => s.length > 0);
        skillList.forEach(skill => {
          skills.push({
            id: generateId(),
            name: skill,
            category: currentCategory,
          });
        });
      }
    } else if (skillText.length > 2 && skillText.length < 30) {
      // Single skill
      skills.push({
        id: generateId(),
        name: skillText,
        category: currentCategory,
      });
    }

    i++;
  }

  return skills;
};


const parseProjects = (lines: string[], sections: SectionBoundaries): Project[] => {
  const projects: Project[] = [];
  
  if (!sections.projects) return [];

  let projStart = sections.projects + 1;
  const projEnd = sections.certifications || sections.languages || lines.length;
  
  const projectKeywords = ['projects', 'personal projects', 'side projects'];
  
  // Skip the section header line itself
  if (projStart < lines.length) {
    const firstLine = lines[projStart];
    const firstLower = firstLine.toLowerCase();
    const isHeader = firstLine === firstLine.toUpperCase() && 
                    projectKeywords.some((kw: string) => firstLower.includes(kw)) &&
                    firstLine.length < 50;
    if (isHeader) {
      projStart++;
    }
  }
  
  let i = projStart;
  let currentProject: Project | null = null;
  
  while (i < projEnd && i < lines.length) {
    const line = lines[i];
    const lowerLine = line.toLowerCase();
    
    // Skip any section header lines
    const isSectionHeader = line === line.toUpperCase() && 
                           (projectKeywords.some((kw: string) => lowerLine.includes(kw)) ||
                            lowerLine.includes('certifications') ||
                            lowerLine.includes('languages')) &&
                           line.length < 50;
    if (isSectionHeader) {
      i++;
      continue;
    }
    
    // Check if this looks like a new project name (has colon, or is short and followed by description)
    const hasColon = line.includes(':');
    const isShortLine = line.length > 5 && line.length < 80;
    const nextLineExists = i + 1 < lines.length;
    const nextLineIsDescription = nextLineExists && 
                                 (lines[i + 1].length > 20 || 
                                  lines[i + 1].match(/^[•\-\*]/) ||
                                  lines[i + 1].length > line.length);
    
    // New project if: has colon, or short line followed by longer description
    const isNewProject = hasColon || (isShortLine && nextLineIsDescription && !line.match(/^[•\-\*]/));
    
    if (isNewProject) {
      // Save previous project if exists
      if (currentProject && currentProject.name) {
        projects.push(currentProject);
      }
      
      // Start new project
      currentProject = {
        id: generateId(),
        name: hasColon ? line.split(':')[0].trim() : line.trim(),
        description: '',
      };
      
      // Extract link if present
      const linkMatch = line.match(/(https?:\/\/[^\s]+)/);
      if (linkMatch) {
        currentProject.link = linkMatch[1];
        currentProject.name = currentProject.name.replace(linkMatch[1], '').trim();
      }
      
      // Get description after colon if present
      if (hasColon) {
        const descAfterColon = line.split(':').slice(1).join(':').trim();
        if (descAfterColon) {
          currentProject.description = descAfterColon;
        }
      }
    } else if (currentProject) {
      // Continue current project description
      if (line.length > 5 && line.length < 500) {
        const cleanLine = line.replace(/^[•\-\*]\s*/, '').trim();
        if (cleanLine) {
          if (currentProject.description) {
            currentProject.description += ' ' + cleanLine;
          } else {
            currentProject.description = cleanLine;
          }
        }
      }
    }
    
    i++;
  }
  
  // Save last project
  if (currentProject && currentProject.name) {
    projects.push(currentProject);
  }
  
  return projects;
};

const parseCertifications = (_lines: string[], _sections: SectionBoundaries): any[] => {
  // Placeholder - can be implemented later
  return [];
};

const parseLanguages = (_lines: string[], _sections: SectionBoundaries): any[] => {
  // Placeholder - can be implemented later
  return [];
};

