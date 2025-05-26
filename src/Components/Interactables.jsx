// S. Sheta 2025

import React from 'react';

export function Toggle({ label, tooltip, checked, onChange }) {
    return (
        <div className="toggle" title={tooltip}>
            <label>
                <span>{label}</span>
                <div
                    className={`toggle-track ${checked ? 'on' : 'off'}`}
                    onClick={() => onChange(!checked)}
                    role="toggle"
                    aria-checked={checked}
                    aria-label={label}
                    tabIndex={0}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            onChange(!checked);
                        }
                    }}
                >
                    <div className="toggle-head" />
                </div>
            </label>
        </div>
    );
}

export function Selector({ label, tooltip, value, options, onChange }) {
    return (
        <div className="selector" title={tooltip}>
            <label>
                <span>{label}</span>
                <select
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    aria-label={label}
                >
                    {options.map(([val, text]) => (
                        <option key={val} value={val}>
                            {text}
                        </option>
                    ))}
                </select>
            </label>
        </div>
    );
}

export function TextInput({ label, tooltip, value, onChange, placeholder = '', type = 'text' }) {
    return (
        <div className="text-input" title={tooltip}>
            <label>
                <span>{label}</span>
                <input
                    type={type}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    aria-label={label}
                />
            </label>
        </div>
    );
}