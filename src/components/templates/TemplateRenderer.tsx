import React from 'react';
import { ResumeData, WorkExperience, Education, Skill, Project, Certification, Language } from '../../types/resume';
import { ResumeSettings } from '../../types/settings';

interface TemplateRendererProps {
  data: ResumeData;
  settings: ResumeSettings;
  contentWidth: number;
}

const TemplateRenderer: React.FC<TemplateRendererProps> = ({ data, settings, contentWidth }) => {
  const themeColor = getThemeColor(settings.themeColor);
  const fontFamily = settings.fontFamily;

  const renderSection = (sectionId: string) => {
    switch (sectionId) {
      case 'summary':
        return data.summary ? (
          <Section
            key="summary"
            title="Professional Summary"
            settings={settings}
            themeColor={themeColor}
          >
            <p
              style={{
                fontSize: `${settings.fontSize.body}pt`,
                textAlign: 'left',
                width: '100%',
                maxWidth: '100%',
                color: '#000000',
                margin: 0,
                padding: 0,
              }}
              dangerouslySetInnerHTML={{ __html: data.summary }}
            />
          </Section>
        ) : null;
      case 'workExperience':
        return data.workExperience.length > 0 ? (
          <Section
            key="workExperience"
            title="Professional Experience"
            settings={settings}
            themeColor={themeColor}
          >
            {data.workExperience.map((exp: WorkExperience, idx: number) => (
              <ExperienceItem key={exp.id} exp={exp} settings={settings} isLast={idx === data.workExperience.length - 1} />
            ))}
          </Section>
        ) : null;
      case 'education':
        return data.education.length > 0 ? (
          <Section
            key="education"
            title="Education"
            settings={settings}
            themeColor={themeColor}
          >
            {data.education.map((edu: Education, idx: number) => (
              <EducationItem key={edu.id} edu={edu} settings={settings} isLast={idx === data.education.length - 1} />
            ))}
          </Section>
        ) : null;
      case 'skills':
        return data.skills.length > 0 ? (
          <Section
            key="skills"
            title="Skills"
            settings={settings}
            themeColor={themeColor}
          >
            <SkillsContent skills={data.skills} settings={settings} />
          </Section>
        ) : null;
      case 'projects':
        return data.projects && data.projects.length > 0 ? (
          <Section
            key="projects"
            title="Projects"
            settings={settings}
            themeColor={themeColor}
          >
            {data.projects.map((project: Project, idx: number) => (
              <ProjectItem key={project.id} project={project} settings={settings} isLast={idx === data.projects!.length - 1} />
            ))}
          </Section>
        ) : null;
      case 'certifications':
        return data.certifications && data.certifications.length > 0 ? (
          <Section
            key="certifications"
            title="Certifications"
            settings={settings}
            themeColor={themeColor}
          >
            {data.certifications.map((cert: Certification, idx: number) => (
              <div key={cert.id} style={{ marginBottom: idx < data.certifications!.length - 1 ? '4px' : '0', color: '#000000', width: '100%' }}>
                <span style={{ fontWeight: 'bold', fontSize: `${settings.fontSize.body}pt`, color: '#000000' }}>{cert.name}</span>
                {cert.issuer && <span style={{ fontSize: `${settings.fontSize.body}pt`, color: '#000000' }}> | {cert.issuer}</span>}
                {cert.date && <span style={{ fontSize: `${settings.fontSize.body}pt`, color: '#000000' }}> | {cert.date}</span>}
                {cert.expiryDate && <span style={{ fontSize: `${settings.fontSize.body}pt`, color: '#000000' }}> (Expires: {cert.expiryDate})</span>}
              </div>
            ))}
          </Section>
        ) : null;
      case 'languages':
        return data.languages && data.languages.length > 0 ? (
          <Section
            key="languages"
            title="Languages"
            settings={settings}
            themeColor={themeColor}
          >
            <div style={{ fontSize: `${settings.fontSize.body}pt` }}>
              {data.languages.map((lang: Language, idx: number) => (
                <span key={lang.id}>
                  {lang.name} ({lang.proficiency})
                  {idx < data.languages!.length - 1 ? ' | ' : ''}
                </span>
              ))}
            </div>
          </Section>
        ) : null;
      default:
        return null;
    }
  };

  const getHeaderStyle = () => {
    const baseStyle: React.CSSProperties = {
      fontSize: `${settings.fontSize.name}pt`,
      fontWeight: 'bold',
      marginBottom: '4px',
      fontFamily: fontFamily,
    };

    switch (settings.template) {
      case 'classic':
        return { ...baseStyle, textTransform: 'uppercase', letterSpacing: '0.5px' };
      case 'modern':
        return { ...baseStyle, textTransform: 'none', letterSpacing: '0px' };
      case 'minimal':
        return { ...baseStyle, textTransform: 'none', letterSpacing: '0px', fontWeight: '600' };
      case 'executive':
        return { ...baseStyle, textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '700' };
      default:
        return baseStyle;
    }
  };

  const getBorderStyle = () => {
    const borderWidth = settings.template === 'executive' ? '3px' : settings.template === 'minimal' ? '1px' : '2px';
    return {
      borderBottom: `${borderWidth} solid ${themeColor}`,
      paddingBottom: '8px',
    };
  };

  return (
    <div style={{ width: `${contentWidth}px`, maxWidth: `${contentWidth}px`, fontFamily: fontFamily, boxSizing: 'border-box' }}>
      {/* Header */}
      <header className="mb-4" style={getBorderStyle()}>
        <h1 style={getHeaderStyle()}>
          {data.personalInfo.fullName || 'Your Name'}
        </h1>
        {data.personalInfo.title && (
          <div style={{ fontSize: `${settings.fontSize.body}pt`, lineHeight: settings.lineSpacing, color: '#000000', marginTop: '2px', marginBottom: '4px' }}>
            {data.personalInfo.title}
          </div>
        )}
        <div style={{ fontSize: `${settings.fontSize.body}pt`, lineHeight: settings.lineSpacing, color: '#000000', width: '100%' }}>
          {data.personalInfo.email && <span style={{ color: '#000000' }}>{data.personalInfo.email}</span>}
          {data.personalInfo.phone && <span style={{ color: '#000000' }}>{data.personalInfo.email ? ' | ' : ''}{data.personalInfo.phone}</span>}
          {data.personalInfo.location && <span style={{ color: '#000000' }}>{(data.personalInfo.email || data.personalInfo.phone) ? ' | ' : ''}{data.personalInfo.location}</span>}
          {data.personalInfo.linkedin && (
            <span> | LinkedIn: <a href={`https://${data.personalInfo.linkedin.replace(/^https?:\/\//, '')}`} style={{ color: '#2563eb', textDecoration: 'none' }}>{data.personalInfo.linkedin}</a></span>
          )}
          {data.personalInfo.website && (
            <span> | <a href={`${data.personalInfo.website.startsWith('http') ? '' : 'https://'}${data.personalInfo.website}`} style={{ color: '#2563eb', textDecoration: 'none' }}>{data.personalInfo.website}</a></span>
          )}
        </div>
      </header>

      {/* Sections in order */}
      {settings.sectionOrder.map((sectionId) => renderSection(sectionId))}
    </div>
  );
};

interface SectionProps {
  title: string;
  settings: ResumeSettings;
  themeColor: string;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ title, settings, themeColor, children }) => {
  const getHeadingStyle = () => {
    const baseStyle: React.CSSProperties = {
      fontSize: `${settings.fontSize.heading}pt`,
      fontWeight: 'bold',
      marginBottom: '6px',
      paddingBottom: '2px',
      fontFamily: settings.fontFamily,
    };

    switch (settings.template) {
      case 'classic':
        return { ...baseStyle, textTransform: 'uppercase', borderBottom: `1px solid ${themeColor}` };
      case 'modern':
        return { ...baseStyle, textTransform: 'none', borderBottom: `2px solid ${themeColor}` };
      case 'minimal':
        return { ...baseStyle, textTransform: 'none', borderBottom: `1px solid ${themeColor}`, fontWeight: '600' };
      case 'executive':
        return { ...baseStyle, textTransform: 'uppercase', borderBottom: `2px solid ${themeColor}`, letterSpacing: '0.5px' };
      default:
        return { ...baseStyle, textTransform: 'uppercase', borderBottom: `1px solid ${themeColor}` };
    }
  };

  return (
    <section className="mb-4" style={{ width: '100%', maxWidth: '100%' }}>
      <h2 style={getHeadingStyle()}>{title}</h2>
      <div style={{ width: '100%', maxWidth: '100%' }}>
        {children}
      </div>
    </section>
  );
};

interface ExperienceItemProps {
  exp: WorkExperience;
  settings: ResumeSettings;
  isLast: boolean;
}

const ExperienceItem: React.FC<ExperienceItemProps> = ({ exp, settings, isLast }) => {
  return (
    <div className={isLast ? '' : 'mb-3'}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
        <div>
          <span style={{ fontWeight: 'bold', fontSize: `${settings.fontSize.body}pt`, color: '#000000' }}>{exp.position}</span>
          {exp.company && <span style={{ fontWeight: 'bold', fontSize: `${settings.fontSize.body}pt`, color: '#000000' }}> | {exp.company}</span>}
        </div>
        <div style={{ fontSize: `${settings.fontSize.body}pt`, color: '#000000' }}>
          {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
        </div>
      </div>
      {exp.location && (
        <div style={{ fontSize: `${settings.fontSize.body}pt`, fontStyle: 'italic', marginBottom: '4px', color: '#000000' }}>
          {exp.location}
        </div>
      )}
      {exp.description.length > 0 && (
        <ul style={{ marginLeft: '20px', marginTop: '4px', fontSize: `${settings.fontSize.body}pt`, listStyleType: 'disc', listStylePosition: 'outside', color: '#000000', width: 'calc(100% - 20px)' }}>
          {exp.description.filter((d: string) => d.trim()).map((desc: string, i: number) => {
            // Check if the description contains HTML list tags (from rich text editor)
            if (desc.includes('<ul>') || desc.includes('<ol>') || desc.includes('<li>')) {
              // If it's already formatted as a list, render it directly
              return (
                <li key={i} style={{ marginBottom: '2px', fontSize: `${settings.fontSize.body}pt`, color: '#000000' }} dangerouslySetInnerHTML={{ __html: desc }} />
              );
            } else {
              // If it's plain text or formatted text, render as list item
              return (
                <li key={i} style={{ marginBottom: '2px', fontSize: `${settings.fontSize.body}pt`, color: '#000000' }} dangerouslySetInnerHTML={{ __html: desc }} />
              );
            }
          })}
        </ul>
      )}
    </div>
  );
};

interface EducationItemProps {
  edu: Education;
  settings: ResumeSettings;
  isLast: boolean;
}

const EducationItem: React.FC<EducationItemProps> = ({ edu, settings, isLast }) => {
  return (
    <div className={isLast ? '' : 'mb-3'}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
        <div>
          <span style={{ fontWeight: 'bold', fontSize: `${settings.fontSize.body}pt` }}>
            {edu.degree} {edu.field && `in ${edu.field}`}
          </span>
          {edu.institution && <span style={{ fontSize: `${settings.fontSize.body}pt` }}> | {edu.institution}</span>}
        </div>
        <div style={{ fontSize: `${settings.fontSize.body}pt`, color: '#000000' }}>
          {edu.startDate} - {edu.endDate}
        </div>
      </div>
      {edu.location && (
        <div style={{ fontSize: `${settings.fontSize.body}pt`, fontStyle: 'italic', marginBottom: '2px', color: '#000000' }}>
          {edu.location}
        </div>
      )}
      {(edu.gpa || edu.honors) && (
        <div style={{ fontSize: `${settings.fontSize.body}pt`, marginTop: '2px', color: '#000000' }}>
          {edu.gpa && <span>GPA: {edu.gpa}</span>}
          {edu.honors && <span>{edu.gpa ? ' | ' : ''}{edu.honors}</span>}
        </div>
      )}
      {edu.description && (
        <div style={{ fontSize: `${settings.fontSize.body}pt`, marginTop: '2px', color: '#000000' }}>{edu.description}</div>
      )}
    </div>
  );
};

interface SkillsContentProps {
  skills: Skill[];
  settings: ResumeSettings;
}

const SkillsContent: React.FC<SkillsContentProps> = ({ skills, settings }) => {
  const grouped = skills.reduce((acc: Record<string, string[]>, skill: Skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    if (skill.name) acc[skill.category].push(skill.name);
    return acc;
  }, {} as Record<string, string[]>);

  return (
        <div style={{ fontSize: `${settings.fontSize.body}pt`, color: '#000000', width: '100%' }}>
          {Object.entries(grouped).map(([category, skillList]: [string, string[]], idx: number, arr: [string, string[]][]) => (
            <div key={category} style={{ marginBottom: idx < arr.length - 1 ? '4px' : '0', color: '#000000', width: '100%' }}>
              <span style={{ fontWeight: 'bold', color: '#000000' }}>{category}:</span> <span style={{ color: '#000000' }}>{skillList.join(', ')}</span>
            </div>
          ))}
        </div>
  );
};

interface ProjectItemProps {
  project: Project;
  settings: ResumeSettings;
  isLast: boolean;
}

const ProjectItem: React.FC<ProjectItemProps> = ({ project, settings, isLast }) => {
  return (
    <div className={isLast ? '' : 'mb-3'}>
      <div style={{ marginBottom: '2px' }}>
        <span style={{ fontWeight: 'bold', fontSize: `${settings.fontSize.body}pt`, color: '#000000' }}>{project.name}</span>
        {project.link && (
          <span style={{ fontSize: `${settings.fontSize.body}pt` }}>
            {' | '}
            <a href={`${project.link.startsWith('http') ? '' : 'https://'}${project.link}`} style={{ color: '#2563eb', textDecoration: 'none' }}>
              {project.link}
            </a>
          </span>
        )}
      </div>
      {project.description && (
        <div style={{ fontSize: `${settings.fontSize.body}pt`, marginBottom: '2px', color: '#000000', width: '100%' }} dangerouslySetInnerHTML={{ __html: project.description }} />
      )}
      {project.technologies && (
        <div style={{ fontSize: `${settings.fontSize.body}pt`, fontStyle: 'italic', color: '#000000' }}>
          Technologies: {project.technologies}
        </div>
      )}
    </div>
  );
};

function getThemeColor(color: string): string {
  const colors: Record<string, string> = {
    black: '#000000',
    blue: '#2563eb',
    green: '#16a34a',
    purple: '#9333ea',
    red: '#dc2626',
    gray: '#4b5563',
  };
  return colors[color] || '#000000';
}

export default TemplateRenderer;

