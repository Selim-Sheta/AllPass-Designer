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

export default function PhasePlot({ poles, enforceRealOutput, sampleRate, plotOptions }) {
    const w = useMemo(() => (
        Array.from({ length: RESOLUTION }, (_, i) => (Math.PI * i) / (RESOLUTION - 1))
    ), []);

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

        const xRange = [plotOptions.logScale ? 0.01 : 1.0, plotOptions.xUnits === 'hz' ? sampleRate / 2 : Math.PI]

        return {
            margin: { t: 20, r: 10, b: 40, l: 50 },
            height: 350,
            xaxis: {
                title: xTitle,
                type: plotOptions.logScale ? 'log' : 'linear',
                range: xRange
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
            {/* UI controls to be added here */}
            <div className="btn-row" />
            <Plot
                data={plotData}
                layout={layout}
                config={config}
            />
        </div>
    );
}
