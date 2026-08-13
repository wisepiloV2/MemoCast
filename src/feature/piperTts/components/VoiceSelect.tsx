import React from 'react';
import styles from './VoiceSelect.module.css';

interface VoiceOption {
  value: string;
  label: string;
}

interface VoiceSelectProps {
  options: VoiceOption[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function VoiceSelect({ options, value, onChange, disabled } : VoiceSelectProps) {
  return (
    <div className={styles.selectContainer}>
      <label htmlFor="voice-select" className={styles.label}>
        Voice:
      </label>
      <select 
        id="voice-select"
        className={styles.select} 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled || options.length === 0}
      >
        {options.length === 0 ? (
          <option value="">No voices installed</option>
        ) : (
          options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))
        )}
      </select>
    </div>
  );
};
