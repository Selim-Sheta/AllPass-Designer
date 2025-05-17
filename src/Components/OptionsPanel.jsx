// S. Sheta 2025
// This component is responsible for global settings.

import React from 'react';
import { Switch, FormControlLabel, FormGroup, Tooltip, IconButton } from '@mui/material';
import { LuClipboardCopy, LuClipboardCheck, LuDownload, LuFolderOpen, LuSave, LuShare2 } from "react-icons/lu";

export default function OptionsPanel({ options, updateOption, onSave, onLoad, onCopyLink }) {
    return (
        <div className="options-panel">
            <div className="state-toolbar">
                <button title="save" className="icon-button" onClick={onSave}><LuSave/></button>
                <button title="open" className="icon-button" onClick={onLoad}><LuFolderOpen/></button>
                <button title="share" className="icon-button" onClick={onCopyLink}><LuShare2/></button>
            </div>
            <FormGroup row>
                <Tooltip title="Automatically pair complex poles with a conjugate twin">
                    <FormControlLabel
                        control={
                            <Switch
                                checked={options.enforceRealOutput}
                                onChange={(e) => updateOption('enforceRealOutput', e.target.checked)}
                            />
                        }
                        label="Enforce Real Output"
                    />
                </Tooltip>
                <Tooltip title="Use magnitude & angle instead of real & imaginary parts">
                    <FormControlLabel
                        control={
                            <Switch
                                checked={options.coordSystem === 'polar'}
                                onChange={(e) => updateOption('coordSystem', e.target.checked ? 'polar' : 'rect')}
                            />
                        }
                        label="Polar Coordinate System"
                    />
                </Tooltip>
                <Tooltip title="Turn on dark mode">
                    <FormControlLabel
                        control={
                            <Switch
                                checked={options.displayTheme === 'dark'}
                                onChange={(e) => updateOption('displayTheme', e.target.checked ? 'dark' : 'light')}
                            />
                        }
                        label="Dark Theme"
                    />
                </Tooltip>
            </FormGroup>
        </div>
    );
}
