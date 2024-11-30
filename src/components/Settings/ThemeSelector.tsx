import React, { useEffect } from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { useStore } from '../../store/useStore';

export default function ThemeSelector() {
  const { settings, updateSettings } = useStore();

  const themes = [
    { id: 'system', name: 'System', icon: Monitor },
    { id: 'light', name: 'Light', icon: Sun },
    { id: 'dark', name: 'Dark', icon: Moon }
  ] as const;

  useEffect(() => {
    const root = window.document.documentElement;
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const theme = settings.theme === 'system' ? systemTheme : settings.theme;
    
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [settings.theme]);

  return (
    <div className="grid grid-cols-3 gap-4">
      {themes.map(({ id, name, icon: Icon }) => (
        <button
          key={id}
          onClick={() => updateSettings({ theme: id })}
          className={`flex flex-col items-center p-4 rounded-lg transition-colors ${
            settings.theme === id
              ? 'bg-blue-600 text-white'
              : 'bg-gray-700 hover:bg-gray-600'
          }`}
        >
          <Icon className="w-6 h-6 mb-2" />
          <span>{name}</span>
        </button>
      ))}
    </div>
  );
}