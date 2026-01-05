import { create } from 'zustand';
import { ResumeSettings, FontFamily, TemplateStyle, ThemeColor, defaultSettings } from '../types/settings';

interface SettingsStore {
  settings: ResumeSettings;
  updateFontFamily: (font: FontFamily) => void;
  updateTemplate: (template: TemplateStyle) => void;
  updateThemeColor: (color: ThemeColor) => void;
  updateFontSize: (type: 'name' | 'heading' | 'body', size: number) => void;
  updateLineSpacing: (spacing: number) => void;
  updateSectionOrder: (order: string[]) => void;
  resetSettings: () => void;
}

export const useSettingsStore = create<SettingsStore>((set) => ({
  settings: defaultSettings,
  
  updateFontFamily: (font) =>
    set((state) => ({
      settings: { ...state.settings, fontFamily: font },
    })),
  
  updateTemplate: (template) =>
    set((state) => ({
      settings: { ...state.settings, template },
    })),
  
  updateThemeColor: (color) =>
    set((state) => ({
      settings: { ...state.settings, themeColor: color },
    })),
  
  updateFontSize: (type, size) =>
    set((state) => ({
      settings: {
        ...state.settings,
        fontSize: { ...state.settings.fontSize, [type]: size },
      },
    })),
  
  updateLineSpacing: (spacing) =>
    set((state) => ({
      settings: { ...state.settings, lineSpacing: spacing },
    })),
  
  updateSectionOrder: (order) =>
    set((state) => ({
      settings: { ...state.settings, sectionOrder: order },
    })),
  
  resetSettings: () =>
    set({ settings: defaultSettings }),
}));

