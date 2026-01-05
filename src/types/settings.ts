export type FontFamily = 'Arial' | 'Times New Roman' | 'Calibri' | 'Georgia' | 'Verdana' | 'Helvetica';
export type TemplateStyle = 'classic' | 'modern' | 'minimal' | 'executive';
export type ThemeColor = 'black' | 'blue' | 'green' | 'purple' | 'red' | 'gray';

export interface ResumeSettings {
  fontFamily: FontFamily;
  template: TemplateStyle;
  themeColor: ThemeColor;
  fontSize: {
    name: number;
    heading: number;
    body: number;
  };
  lineSpacing: number;
  sectionOrder: string[];
}

export const defaultSettings: ResumeSettings = {
  fontFamily: 'Arial',
  template: 'classic',
  themeColor: 'black',
  fontSize: {
    name: 20,
    heading: 12,
    body: 11,
  },
  lineSpacing: 1.4,
  sectionOrder: [
    'summary',
    'workExperience',
    'education',
    'skills',
    'projects',
    'certifications',
    'languages',
  ],
};

