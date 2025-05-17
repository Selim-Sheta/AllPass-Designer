// S. Sheta 2025

// This component is responsible for global settings.
import React from 'react';
import { Switch, FormControlLabel, FormGroup, Tooltip} from '@mui/material';
import { LuClipboardCopy, LuClipboardCheck, LuDownload, LuFolderOpen, LuSave, LuShare2 } from "react-icons/lu";
import { RiDeleteBin6Line } from "react-icons/ri";

function ThemedSwitch({ label, tooltip, checked, onChange }) {
    return (
        <Tooltip title={tooltip}>
            <FormControlLabel
                control={
                    <Switch
                        checked={checked}
                        onChange={onChange}
                    />
                }
                label={label}
            />
        </Tooltip>
    );
}

export default function OptionsPanel({ options, updateOption, onSave, onLoad, onCopyLink, onClearAll }) {
    return (
        <div className="options-panel">
            <div className="state-toolbar">
                <button title="save" className="icon-button" onClick={onSave}><LuSave/></button>
                <button title="open" className="icon-button" onClick={onLoad}><LuFolderOpen/></button>
                <button title="share" className="icon-button" onClick={onCopyLink}><LuShare2/></button>
            </div>
            <FormGroup row>
                <ThemedSwitch
                    label="Enforce Real Output"
                    tooltip="Automatically pair complex poles with a conjugate twin"
                    checked={options.enforceRealOutput}
                    onChange={(e) => updateOption('enforceRealOutput', e.target.checked)}
                />
                <ThemedSwitch
                    label="Polar Coordinate System"
                    tooltip="Use magnitude & angle instead of real & imaginary parts"
                    checked={options.coordSystem === 'polar'}
                    onChange={(e) => updateOption('coordSystem', e.target.checked ? 'polar' : 'rect')}
                />
                <ThemedSwitch
                    label="Dark Theme"
                    tooltip="Turn on dark mode"
                    checked={options.displayTheme === 'dark'}
                    onChange={(e) => updateOption('displayTheme', e.target.checked ? 'dark' : 'light')}
                />
            </FormGroup>
            <button title="Clear all" className="icon-button" onClick={onClearAll}><RiDeleteBin6Line/></button>
        </div>
    );
}
