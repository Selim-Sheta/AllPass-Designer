// S. Sheta 2025
// Displays a frequency-domain plot of phase, phase delay, or group delay

import React, { useMemo } from 'react';
import Plot from 'react-plotly.js';
import Complex from 'complex.js';
import {
    calculateAllPassFrequencyResponse,
    calculatePhaseDelay,
    calculateGroupDelay,
    getPhase,
    unwrapPhase
} from '../utils/dsp';

const RESOLUTION = 512;
const LINE_STYLE = { color: '#1bce9e' };

export default function PhasePlot({ poles, enforceRealOutput, sampleRate, plotOptions, updatePlotOptions }) {
    const w = useMemo(() => {
        if (plotOptions.logScale) {
            // log spacing from min to max
            const logMin = -4;
            const logMax = Math.log10(Math.PI);
            return Array.from({ length: RESOLUTION }, (_, i) =>
                Math.pow(10,logMin + (logMax - logMin) * (i / (RESOLUTION - 1)))
            );
        } else {
            // linear spacing
            return Array.from({ length: RESOLUTION }, (_, i) =>
                (Math.PI * i) / (RESOLUTION - 1)
            );
        }
    }, [plotOptions.logScale]);

    const plotData = useMemo(() => {
        const complexPoles = poles.map(p => new Complex(p.pos.real, p.pos.imag));
        if (enforceRealOutput) {
            const conjugates = complexPoles
                .filter(p => p.im !== 0)
                .map(p => new Complex(p.re, -p.im));
            complexPoles.push(...conjugates);
        }

        const H = calculateAllPassFrequencyResponse(w, complexPoles);
        const rawPhase = getPhase(H);
        const unwrappedPhase = unwrapPhase(rawPhase);

        let y;
        switch (plotOptions.display) {
            case 'group-delay':
                y = calculateGroupDelay(unwrappedPhase, w);
                break;
            case 'phase-delay':
                y = calculatePhaseDelay(unwrappedPhase, w);
                break;
            case 'phase':
            default:
                y = unwrappedPhase;
        }

        // Apply y-axis unit conversion
        if (plotOptions.display === 'phase') {
            if (plotOptions.yUnits === 'degrees') {
                y = y.map(v => v * (180 / Math.PI));
            }
        } else if (plotOptions.yUnits === 'seconds') {
            y = y.map(v => v / sampleRate);
        }

        // Compute x-axis
        const x = plotOptions.xUnits === 'hz'
            ? w.map(w => (w * sampleRate) / (2 * Math.PI))
            : w;

        return [{
            x,
            y,
            type: 'scatter',
            mode: 'lines',
            line: LINE_STYLE
        }];
    }, [w, poles, enforceRealOutput, plotOptions, sampleRate]);

    const layout = useMemo(() => {
        const xTitle = plotOptions.xUnits === 'hz'
            ? 'Frequency (Hz)'
            : 'Frequency (rad/sample)';

        let yTitle = '';
        if (plotOptions.display === 'phase') {
            yTitle = `Phase (${plotOptions.yUnits === 'degrees' ? 'degrees' : 'radians'})`;
        } else if (plotOptions.display === 'group-delay') {
            yTitle = `Group Delay (${plotOptions.yUnits === 'seconds' ? 's' : 'samples'})`;
        } else {
            yTitle = `Phase Delay (${plotOptions.yUnits === 'seconds' ? 's' : 'samples'})`;
        }

        return {
            margin: { t: 20, r: 10, b: 40, l: 50 },
            height: 350,
            xaxis: {
                title: xTitle,
                type: plotOptions.logScale ? 'log' : 'linear',
                range: plotOptions.logScale ? 
                    [0.01, Math.log10(plotOptions.xUnits === 'hz' ? sampleRate / 2 : Math.PI)] : 
                    [0.0, plotOptions.xUnits === 'hz' ? sampleRate / 2 : Math.PI],
            },
            yaxis: {
                title: yTitle,
                autorange: true
            },
            modebar: { orientation: 'v' }
        };
    }, [plotOptions, sampleRate]);

    const config = {
        responsive: false,
        displaylogo: false
    };

    return (
        <div className="filter-design-element plot">
            <div className="btn-row">
                <label>
                    Display:
                    <select value={plotOptions.display} onChange={e => updatePlotOptions('display', e.target.value)}>
                        <option value="phase">Phase</option>
                        <option value="phase-delay">Phase Delay</option>
                        <option value="group-delay">Group Delay</option>
                    </select>
                </label>

                <label>
                    X Units:
                    <select value={plotOptions.xUnits} onChange={e => updatePlotOptions('xUnits', e.target.value)}>
                        <option value="rads-per-sample">Rad/sample</option>
                        <option value="hz">Hz</option>
                    </select>
                </label>

                <label>
                    Y Units:
                    <select value={plotOptions.yUnits} onChange={e => updatePlotOptions('yUnits', e.target.value)}>
                        {plotOptions.display === 'phase' ? (
                            <>
                                <option value="rads">Radians</option>
                                <option value="degrees">Degrees</option>
                            </>
                        ) : (
                            <>
                                <option value="samples">Samples</option>
                                <option value="seconds">Seconds</option>
                            </>
                        )}
                    </select>
                </label>

                <label>
                    Log Scale:
                    <input
                        type="checkbox"
                        checked={plotOptions.logScale}
                        onChange={e => updatePlotOptions('logScale', e.target.checked)}
                    />
                </label>
            </div>
            <Plot
                data={plotData}
                layout={layout}
                config={config}
            />
        </div>
    );
}
