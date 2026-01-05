import React from 'react';
import { useResumeStore } from '../store/resumeStore';
import { useSettingsStore } from '../store/settingsStore';
import TemplateRenderer from './templates/TemplateRenderer';

// Standard US Letter size: 8.5" x 11" = 816px x 1056px at 96 DPI
// With 0.5" margins on all sides, content area: 720px x 960px
const PAGE_WIDTH = 816; // 8.5 inches
const PAGE_HEIGHT = 1056; // 11 inches
const MARGIN = 48; // 0.5 inches
const CONTENT_WIDTH = PAGE_WIDTH - (MARGIN * 2);

const ResumeTemplate: React.FC = () => {
  const { resumeData } = useResumeStore();
  const { settings } = useSettingsStore();

  return (
    <div 
      className="resume-page bg-white mx-auto shadow-lg"
      style={{
        width: `${PAGE_WIDTH}px`,
        minHeight: `${PAGE_HEIGHT}px`,
        padding: `${MARGIN}px`,
        fontFamily: settings.fontFamily,
        fontSize: `${settings.fontSize.body}pt`,
        lineHeight: settings.lineSpacing,
        color: '#000',
        boxSizing: 'border-box',
      }}
    >
      <TemplateRenderer data={resumeData} settings={settings} contentWidth={CONTENT_WIDTH} />
    </div>
  );
};

export default ResumeTemplate;

