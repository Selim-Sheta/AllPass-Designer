// S. Sheta 2025

// App-wide settings panel: controls display mode, coordinate system, and conjugate pairing
import React from 'react';
import { Switch, FormControlLabel, FormGroup, Tooltip } from '@mui/material';
import { LuSave, LuFolderOpen, LuShare2 } from "react-icons/lu";
import { RiDeleteBin6Line } from "react-icons/ri";

// Individual switch with a tooltip wrapper
function ThemedSwitch({ label, tooltip, checked, onChange }) {
    return (
        <Tooltip title={tooltip}>
            <FormControlLabel
                control={
                    <Switch
                        checked={checked}
                        onChange={onChange}
                        slotProps={{
                            input: {
                                'aria-label': label
                            }
                        }}
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
            <div className="btn-row">
                <button title="Save to file" className="icon-button" onClick={onSave}><LuSave /></button>
                <button title="Open from file" className="icon-button" onClick={onLoad}><LuFolderOpen /></button>
                <button title="share via link" className="icon-button" onClick={onCopyLink}><LuShare2 /></button>
            </div>
            <FormGroup row>
                <ThemedSwitch
                    label="Enforce Real"
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
            <button title="Clear current design" className="icon-button" onClick={onClearAll}><RiDeleteBin6Line /></button>
        </div>
    );
}
