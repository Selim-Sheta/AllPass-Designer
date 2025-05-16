// S. Sheta 2025
// This component is responsible for global settings.

import React from 'react';
import { Switch, FormControlLabel, FormGroup, Tooltip } from '@mui/material';

export default function OptionsPanel({ options, updateOption }) {
    return (
        <div className="options-panel">
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
