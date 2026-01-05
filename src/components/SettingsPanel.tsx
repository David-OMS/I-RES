import React from 'react';
import { useSettingsStore } from '../store/settingsStore';
import { FontFamily, TemplateStyle, ThemeColor } from '../types/settings';
import { X, Settings } from 'lucide-react';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ isOpen, onClose }) => {
  const { settings, updateFontFamily, updateTemplate, updateThemeColor, updateFontSize, updateLineSpacing } = useSettingsStore();

  if (!isOpen) return null;

  const fonts: FontFamily[] = ['Arial', 'Times New Roman', 'Calibri', 'Georgia', 'Verdana', 'Helvetica'];
  const templates: TemplateStyle[] = ['classic', 'modern', 'minimal', 'executive'];
  const themeColors: ThemeColor[] = ['black', 'blue', 'green', 'purple', 'red', 'gray'];

  const getThemeColorValue = (color: ThemeColor): string => {
    const colors: Record<ThemeColor, string> = {
      black: '#000000',
      blue: '#2563eb',
      green: '#16a34a',
      purple: '#9333ea',
      red: '#dc2626',
      gray: '#4b5563',
    };
    return colors[color];
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Settings size={20} />
            <h2 className="text-xl font-bold">Resume Settings</h2>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Font Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">Font Family</label>
            <select
              value={settings.fontFamily}
              onChange={(e) => updateFontFamily(e.target.value as FontFamily)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {fonts.map((font) => (
                <option key={font} value={font} style={{ fontFamily: font }}>
                  {font}
                </option>
              ))}
            </select>
          </div>

          {/* Font Sizes */}
          <div>
            <label className="block text-sm font-medium mb-2">Font Sizes</label>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Name</label>
                <input
                  type="number"
                  min="14"
                  max="28"
                  value={settings.fontSize.name}
                  onChange={(e) => updateFontSize('name', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Heading</label>
                <input
                  type="number"
                  min="10"
                  max="16"
                  value={settings.fontSize.heading}
                  onChange={(e) => updateFontSize('heading', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Body</label>
                <input
                  type="number"
                  min="8"
                  max="14"
                  value={settings.fontSize.body}
                  onChange={(e) => updateFontSize('body', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Line Spacing */}
          <div>
            <label className="block text-sm font-medium mb-2">Line Spacing</label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="1.0"
                max="2.0"
                step="0.1"
                value={settings.lineSpacing}
                onChange={(e) => updateLineSpacing(parseFloat(e.target.value))}
                className="flex-1"
              />
              <div className="w-16 text-right">
                <input
                  type="number"
                  min="1.0"
                  max="2.0"
                  step="0.1"
                  value={settings.lineSpacing}
                  onChange={(e) => updateLineSpacing(parseFloat(e.target.value))}
                  className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">Adjust the spacing between lines (1.0 = single, 1.5 = 1.5x, 2.0 = double)</p>
          </div>

          {/* Template Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">Template Style</label>
            <div className="grid grid-cols-2 gap-3">
              {templates.map((template) => (
                <button
                  key={template}
                  onClick={() => updateTemplate(template)}
                  className={`px-4 py-3 border-2 rounded-md text-left transition-colors ${
                    settings.template === template
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="font-medium capitalize">{template}</div>
                  <div className="text-xs text-gray-600 mt-1">
                    {template === 'classic' && 'Traditional, ATS-friendly'}
                    {template === 'modern' && 'Clean, contemporary design'}
                    {template === 'minimal' && 'Simple, elegant layout'}
                    {template === 'executive' && 'Professional, sophisticated'}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Theme Color */}
          <div>
            <label className="block text-sm font-medium mb-2">Theme Color</label>
            <div className="flex gap-3 flex-wrap">
              {themeColors.map((color) => (
                <button
                  key={color}
                  onClick={() => updateThemeColor(color)}
                  className={`w-12 h-12 rounded-md border-2 transition-all ${
                    settings.themeColor === color
                      ? 'border-gray-900 scale-110'
                      : 'border-gray-300 hover:scale-105'
                  }`}
                  style={{ backgroundColor: getThemeColorValue(color) }}
                  title={color.charAt(0).toUpperCase() + color.slice(1)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;

