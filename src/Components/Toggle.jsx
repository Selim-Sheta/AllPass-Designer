import React from 'react';

export default function Toggle({ label, tooltip, checked, onChange }) {
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