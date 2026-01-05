import React, { useState } from 'react';
import { useResumeStore } from '../store/resumeStore';
import { Plus, Trash2 } from 'lucide-react';
import RichTextEditor from './RichTextEditor';
import SectionReorder from './SectionReorder';

const ResumeEditor: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('personal');

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Section Tabs */}
      <div className="flex border-b overflow-x-auto">
        {[
          { id: 'personal', label: 'Personal Info' },
          { id: 'summary', label: 'Summary' },
          { id: 'experience', label: 'Experience' },
          { id: 'education', label: 'Education' },
          { id: 'skills', label: 'Skills' },
          { id: 'projects', label: 'Projects' },
          { id: 'certifications', label: 'Certifications' },
          { id: 'languages', label: 'Languages' },
          { id: 'reorder', label: 'Reorder Sections' },
        ].map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`px-4 py-2 whitespace-nowrap font-medium text-sm ${
              activeSection === section.id
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {section.label}
          </button>
        ))}
      </div>

      {/* Section Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeSection === 'personal' && <PersonalInfoEditor />}
        {activeSection === 'summary' && <SummaryEditor />}
        {activeSection === 'experience' && <ExperienceEditor />}
        {activeSection === 'education' && <EducationEditor />}
        {activeSection === 'skills' && <SkillsEditor />}
        {activeSection === 'projects' && <ProjectsEditor />}
        {activeSection === 'certifications' && <CertificationsEditor />}
        {activeSection === 'languages' && <LanguagesEditor />}
        {activeSection === 'reorder' && <SectionReorder />}
      </div>
    </div>
  );
};

const PersonalInfoEditor: React.FC = () => {
  const { resumeData, updatePersonalInfo } = useResumeStore();

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold mb-4">Personal Information</h2>
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Full Name *</label>
          <input
            type="text"
            value={resumeData.personalInfo.fullName}
            onChange={(e) => updatePersonalInfo({ fullName: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="John Doe"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Professional Title</label>
          <input
            type="text"
            value={resumeData.personalInfo.title || ''}
            onChange={(e) => updatePersonalInfo({ title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Software Engineer"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email *</label>
          <input
            type="email"
            value={resumeData.personalInfo.email}
            onChange={(e) => updatePersonalInfo({ email: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="john.doe@email.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Phone *</label>
          <input
            type="tel"
            value={resumeData.personalInfo.phone}
            onChange={(e) => updatePersonalInfo({ phone: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="+1 (555) 123-4567"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Location *</label>
          <input
            type="text"
            value={resumeData.personalInfo.location}
            onChange={(e) => updatePersonalInfo({ location: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="City, State"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">LinkedIn</label>
          <input
            type="text"
            value={resumeData.personalInfo.linkedin || ''}
            onChange={(e) => updatePersonalInfo({ linkedin: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="linkedin.com/in/yourprofile"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Website/Portfolio</label>
          <input
            type="text"
            value={resumeData.personalInfo.website || ''}
            onChange={(e) => updatePersonalInfo({ website: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="www.yourwebsite.com"
          />
        </div>
      </div>
    </div>
  );
};

const SummaryEditor: React.FC = () => {
  const { resumeData, updateSummary } = useResumeStore();

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold mb-4">Professional Summary</h2>
      <div>
        <label className="block text-sm font-medium mb-1">
          Summary (2-3 sentences highlighting your key qualifications)
        </label>
        <RichTextEditor
          value={resumeData.summary}
          onChange={updateSummary}
          placeholder="Experienced professional with X years in..."
          rows={5}
        />
      </div>
    </div>
  );
};

const ExperienceEditor: React.FC = () => {
  const { resumeData, addWorkExperience, updateWorkExperience, removeWorkExperience } = useResumeStore();

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Work Experience</h2>
        <button
          onClick={addWorkExperience}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus size={16} />
          Add Experience
        </button>
      </div>
      {resumeData.workExperience.map((exp) => (
        <div key={exp.id} className="border border-gray-200 rounded-lg p-4 space-y-3">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold">Experience Entry</h3>
            <button
              onClick={() => removeWorkExperience(exp.id)}
              className="text-red-600 hover:text-red-800"
            >
              <Trash2 size={18} />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Position *</label>
              <input
                type="text"
                value={exp.position}
                onChange={(e) => updateWorkExperience(exp.id, { position: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Company *</label>
              <input
                type="text"
                value={exp.company}
                onChange={(e) => updateWorkExperience(exp.id, { company: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Location</label>
              <input
                type="text"
                value={exp.location}
                onChange={(e) => updateWorkExperience(exp.id, { location: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Start Date *</label>
              <input
                type="text"
                value={exp.startDate}
                onChange={(e) => updateWorkExperience(exp.id, { startDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="MM/YYYY"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">End Date</label>
              <input
                type="text"
                value={exp.endDate}
                onChange={(e) => updateWorkExperience(exp.id, { endDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="MM/YYYY or Present"
                disabled={exp.current}
              />
            </div>
            <div className="flex items-center pt-6">
              <input
                type="checkbox"
                checked={exp.current}
                onChange={(e) => updateWorkExperience(exp.id, { current: e.target.checked, endDate: e.target.checked ? '' : exp.endDate })}
                className="mr-2"
              />
              <label className="text-sm">Current Position</label>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description (Bullet Points - Use formatting toolbar)</label>
            {exp.description.map((desc, idx) => (
              <div key={idx} className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-600">Bullet {idx + 1}</span>
                  {exp.description.length > 1 && (
                    <button
                      onClick={() => {
                        const newDesc = exp.description.filter((_, i) => i !== idx);
                        updateWorkExperience(exp.id, { description: newDesc });
                      }}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <RichTextEditor
                  value={desc}
                  onChange={(value) => {
                    const newDesc = [...exp.description];
                    newDesc[idx] = value;
                    updateWorkExperience(exp.id, { description: newDesc });
                  }}
                  placeholder="• Achievement or responsibility"
                  rows={2}
                />
              </div>
            ))}
            <button
              onClick={() => {
                updateWorkExperience(exp.id, { description: [...exp.description, ''] });
              }}
              className="mt-2 text-sm text-blue-600 hover:text-blue-800"
            >
              + Add Bullet Point
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

const EducationEditor: React.FC = () => {
  const { resumeData, addEducation, updateEducation, removeEducation } = useResumeStore();

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Education</h2>
        <button
          onClick={addEducation}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus size={16} />
          Add Education
        </button>
      </div>
      {resumeData.education.map((edu) => (
        <div key={edu.id} className="border border-gray-200 rounded-lg p-4 space-y-3">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold">Education Entry</h3>
            <button
              onClick={() => removeEducation(edu.id)}
              className="text-red-600 hover:text-red-800"
            >
              <Trash2 size={18} />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Degree *</label>
              <input
                type="text"
                value={edu.degree}
                onChange={(e) => updateEducation(edu.id, { degree: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Bachelor of Science"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Field of Study</label>
              <input
                type="text"
                value={edu.field}
                onChange={(e) => updateEducation(edu.id, { field: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Computer Science"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Institution *</label>
              <input
                type="text"
                value={edu.institution}
                onChange={(e) => updateEducation(edu.id, { institution: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Location</label>
              <input
                type="text"
                value={edu.location}
                onChange={(e) => updateEducation(edu.id, { location: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Start Date</label>
              <input
                type="text"
                value={edu.startDate}
                onChange={(e) => updateEducation(edu.id, { startDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="MM/YYYY"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">End Date *</label>
              <input
                type="text"
                value={edu.endDate}
                onChange={(e) => updateEducation(edu.id, { endDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="MM/YYYY"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">GPA</label>
              <input
                type="text"
                value={edu.gpa || ''}
                onChange={(e) => updateEducation(edu.id, { gpa: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="3.8/4.0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Honors</label>
              <input
                type="text"
                value={edu.honors || ''}
                onChange={(e) => updateEducation(edu.id, { honors: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Summa Cum Laude"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Additional Notes</label>
            <textarea
              value={edu.description || ''}
              onChange={(e) => updateEducation(edu.id, { description: e.target.value })}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      ))}
    </div>
  );
};

const SkillsEditor: React.FC = () => {
  const { resumeData, addSkill, updateSkill, removeSkill } = useResumeStore();

  // Get all unique categories from existing skills + common technical categories
  const existingCategories = Array.from(new Set(resumeData.skills.map(s => s.category).filter(Boolean)));
  const commonCategories = [
    'Data Analytics',
    'Frontend',
    'Backend & APIs',
    'Visualization',
    'Database',
    'Cloud & DevOps',
    'Tools',
    'Soft Skills',
    'Languages',
    'Other'
  ];
  
  // Combine and deduplicate, keeping custom categories first
  const allCategories = [...new Set([...existingCategories, ...commonCategories])];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-bold">Skills</h2>
          <p className="text-sm text-gray-600 mt-1">
            Organize skills by category (e.g., Data Analytics, Frontend, Backend & APIs). You can type a custom category.
          </p>
        </div>
        <button
          onClick={addSkill}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus size={16} />
          Add Skill
        </button>
      </div>
      {resumeData.skills.map((skill) => (
        <div key={skill.id} className="flex gap-3 items-start border border-gray-200 rounded-lg p-3">
          <div className="flex-1">
            <input
              type="text"
              value={skill.name}
              onChange={(e) => updateSkill(skill.id, { name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Python (pandas), SQL, React, Next.js"
            />
          </div>
          <div className="w-48">
            <input
              type="text"
              list={`categories-${skill.id}`}
              value={skill.category}
              onChange={(e) => updateSkill(skill.id, { category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Category (e.g., Data Analytics)"
            />
            <datalist id={`categories-${skill.id}`}>
              {allCategories.map((cat) => (
                <option key={cat} value={cat} />
              ))}
            </datalist>
          </div>
          <button
            onClick={() => removeSkill(skill.id)}
            className="text-red-600 hover:text-red-800 mt-2"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ))}
      {resumeData.skills.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No skills added yet. Click "Add Skill" to get started.</p>
          <p className="text-sm mt-2">Example: Add "Python (pandas)" under "Data Analytics" category</p>
        </div>
      )}
    </div>
  );
};

const ProjectsEditor: React.FC = () => {
  const { resumeData, addProject, updateProject, removeProject } = useResumeStore();

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Projects</h2>
        <button
          onClick={addProject}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus size={16} />
          Add Project
        </button>
      </div>
      {(resumeData.projects || []).map((project) => (
        <div key={project.id} className="border border-gray-200 rounded-lg p-4 space-y-3">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold">Project Entry</h3>
            <button
              onClick={() => removeProject(project.id)}
              className="text-red-600 hover:text-red-800"
            >
              <Trash2 size={18} />
            </button>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Project Name *</label>
            <input
              type="text"
              value={project.name}
              onChange={(e) => updateProject(project.id, { name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description *</label>
            <RichTextEditor
              value={project.description}
              onChange={(value) => updateProject(project.id, { description: value })}
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Technologies</label>
              <input
                type="text"
                value={project.technologies || ''}
                onChange={(e) => updateProject(project.id, { technologies: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="React, Node.js, MongoDB"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Link</label>
              <input
                type="text"
                value={project.link || ''}
                onChange={(e) => updateProject(project.id, { link: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="github.com/username/project"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const CertificationsEditor: React.FC = () => {
  const { resumeData, addCertification, updateCertification, removeCertification } = useResumeStore();

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Certifications</h2>
        <button
          onClick={addCertification}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus size={16} />
          Add Certification
        </button>
      </div>
      {(resumeData.certifications || []).map((cert) => (
        <div key={cert.id} className="border border-gray-200 rounded-lg p-4 space-y-3">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold">Certification Entry</h3>
            <button
              onClick={() => removeCertification(cert.id)}
              className="text-red-600 hover:text-red-800"
            >
              <Trash2 size={18} />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Certification Name *</label>
              <input
                type="text"
                value={cert.name}
                onChange={(e) => updateCertification(cert.id, { name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Issuing Organization *</label>
              <input
                type="text"
                value={cert.issuer}
                onChange={(e) => updateCertification(cert.id, { issuer: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Issue Date *</label>
              <input
                type="text"
                value={cert.date}
                onChange={(e) => updateCertification(cert.id, { date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="MM/YYYY"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Expiry Date</label>
              <input
                type="text"
                value={cert.expiryDate || ''}
                onChange={(e) => updateCertification(cert.id, { expiryDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="MM/YYYY"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const LanguagesEditor: React.FC = () => {
  const { resumeData, addLanguage, updateLanguage, removeLanguage } = useResumeStore();

  const proficiencies = ['Native', 'Fluent', 'Advanced', 'Intermediate', 'Basic'];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Languages</h2>
        <button
          onClick={addLanguage}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus size={16} />
          Add Language
        </button>
      </div>
      {(resumeData.languages || []).map((lang) => (
        <div key={lang.id} className="flex gap-3 items-center border border-gray-200 rounded-lg p-3">
          <div className="flex-1">
            <input
              type="text"
              value={lang.name}
              onChange={(e) => updateLanguage(lang.id, { name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Language name"
            />
          </div>
          <div className="w-40">
            <select
              value={lang.proficiency}
              onChange={(e) => updateLanguage(lang.id, { proficiency: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {proficiencies.map((prof) => (
                <option key={prof} value={prof}>{prof}</option>
              ))}
            </select>
          </div>
          <button
            onClick={() => removeLanguage(lang.id)}
            className="text-red-600 hover:text-red-800"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ResumeEditor;

