// S. Sheta 2025

// App-wide settings panel: controls display mode, coordinate system, and conjugate pairing
import React, { useState } from 'react';
import  Toggle  from './Toggle';
import { LuSave, LuFolderOpen, LuShare2, LuSettings } from "react-icons/lu";
import { RiDeleteBin6Line } from "react-icons/ri";

export default function OptionsPanel({ options, updateOption, onSave, onLoad, onCopyLink, onClearAll }) {
    const [showSettings, setShowSettings] = useState(() =>
        window.matchMedia('(max-width: 768px)').matches ? false : true
    );
    const toggleSettings = () => setShowSettings(prev => !prev);

    return (
        <header>
            <div className="action-row">
                <button title="Save to file" className="icon-button" onClick={onSave}><LuSave /></button>
                <button title="Open from file" className="icon-button" onClick={onLoad}><LuFolderOpen /></button>
                <button title="Share via link" className="icon-button" onClick={onCopyLink}><LuShare2 /></button>
                <button title="Settings" className={`icon-button ${showSettings ? 'active' : ''}`} onClick={toggleSettings}><LuSettings /></button>
            </div>
            {showSettings && (
                <div className="action-row">
                    <Toggle
                        label="Enforce Real"
                        tooltip="Automatically pair complex poles with a conjugate twin"
                        checked={options.enforceRealOutput}
                        onChange={(e) => updateOption('enforceRealOutput', e)}
                    />
                    <Toggle
                        label="Polar Coordinate System"
                        tooltip="Use magnitude & angle instead of real & imaginary parts"
                        checked={options.coordSystem === 'polar'}
                        onChange={(e) => updateOption('coordSystem', e ? 'polar' : 'rect')}
                    />
                    <Toggle
                        label="Dark Theme"
                        tooltip="Turn on dark mode"
                        checked={options.displayTheme === 'dark'}
                        onChange={(e) => updateOption('displayTheme', e ? 'dark' : 'light')}
                    />
                </div>
            )}
            <div className="action-row">
                <button title="Clear current design" className="icon-button" onClick={onClearAll}><RiDeleteBin6Line /></button>
            </div>
        </header>
    );
}
