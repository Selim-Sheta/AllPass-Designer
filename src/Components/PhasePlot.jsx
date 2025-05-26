// S. Sheta 2025
// Displays a frequency-domain plot of phase, phase delay, or group delay

import React, { useMemo, useRef, useState, useLayoutEffect } from 'react';
import Plot from 'react-plotly.js';
import Complex from 'complex.js';
import {
    calculateAllPassFrequencyResponse,
    calculatePhaseDelay,
    calculateGroupDelay,
    getPhase,
    unwrapPhase
} from '../utils/dsp';
import { Toggle, Selector } from './Interactables'

const RESOLUTION = 512;
const LINE_STYLE = { color: '#1bce9e' };

export default function PhasePlot({ poles, enforceRealOutput, sampleRate, plotOptions, updatePlotOptions }) {
    const plotWrapperRef = useRef(null);
    const [plotSize, setPlotSize] = useState({ width: 300, height: 300 });

    useLayoutEffect(() => {
        const el = plotWrapperRef.current;
        if (!el) return;

        const observer = new ResizeObserver(([entry]) => {
            const { width, height } = entry.contentRect;
            setPlotSize({ width, height });
        });

        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    const frequencyVector = useMemo(() => {
        const log = plotOptions.logScale;
        return Array.from({ length: RESOLUTION }, (_, i) => {
            const t = i / (RESOLUTION - 1);
            return log
                ? Math.pow(10, -4 + t * (Math.log10(Math.PI) + 4))
                : t * Math.PI;
        });
    }, [plotOptions.logScale]);

    const generatePhaseData = useMemo(() => {
        const complexPoles = poles.map(p => new Complex(p.pos.real, p.pos.imag));

        if (enforceRealOutput) {
            complexPoles.push(
                ...complexPoles
                    .filter(p => p.im !== 0)
                    .map(p => new Complex(p.re, -p.im))
            );
        }

        const H = calculateAllPassFrequencyResponse(frequencyVector, complexPoles);
        const phase = unwrapPhase(getPhase(H));

        let y;
        switch (plotOptions.display) {
            case 'group-delay':
                y = calculateGroupDelay(phase, frequencyVector);
                break;
            case 'phase-delay':
                y = calculatePhaseDelay(phase, frequencyVector);
                break;
            case 'phase':
            default:
                y = phase;
        }

        if (plotOptions.display === 'phase' && plotOptions.yUnits === 'degrees') {
            y = y.map(v => v * (180 / Math.PI));
        } else if (plotOptions.yUnits === 'seconds') {
            y = y.map(v => v / sampleRate);
        }

        const x = plotOptions.xUnits === 'hz'
            ? frequencyVector.map(w => (w * sampleRate) / (2 * Math.PI))
            : frequencyVector;

        return [{ x, y, type: 'scatter', mode: 'lines', line: LINE_STYLE }];
    }, [frequencyVector, poles, enforceRealOutput, plotOptions, sampleRate]);

    const layout = useMemo(() => {
        const getYTitle = () => {
            const unit = plotOptions.yUnits;
            if (plotOptions.display === 'phase') return `Phase (${unit === 'degrees' ? 'degrees' : 'radians'})`;
            if (plotOptions.display === 'group-delay') return `Group Delay (${unit === 'seconds' ? 's' : 'samples'})`;
            return `Phase Delay (${unit === 'seconds' ? 's' : 'samples'})`;
        };

        return {
            margin: { t: 20, r: 10, b: 40, l: 50 },
            width: plotSize.width,
            height: plotSize.height,
            xaxis: {
                title: plotOptions.xUnits === 'hz' ? 'Frequency (Hz)' : 'Frequency (rad/sample)',
                type: plotOptions.logScale ? 'log' : 'linear',
                range: plotOptions.logScale
                    ? [0.01, Math.log10(plotOptions.xUnits === 'hz' ? sampleRate / 2 : Math.PI)]
                    : [0.0, plotOptions.xUnits === 'hz' ? sampleRate / 2 : Math.PI]
            },
            yaxis: {
                title: getYTitle(),
                autorange: true
            },
            modebar: { orientation: 'v' }
        };
    }, [plotOptions, sampleRate, plotSize]);

    const config = useMemo(() => ({
        responsive: true,
        displaylogo: false
    }), []);

    return (
        <div className="section-container">
            <div className="action-row">
                <Selector
                    label="Display"
                    tooltip="What quantity to display on the y-axis"
                    value={plotOptions.display}
                    options={[
                        ['phase', 'Phase'],
                        ['phase-delay', 'Phase Delay'],
                        ['group-delay', 'Group Delay']
                    ]}
                    onChange={(val) => updatePlotOptions('display', val)}
                />
                <Selector
                    label="X Units"
                    tooltip="Units of the frequency axis"
                    value={plotOptions.xUnits}
                    options={[
                        ['rads-per-sample', 'Rad/sample'],
                        ['hz', 'Hz']
                    ]}
                    onChange={(val) => updatePlotOptions('xUnits', val)}
                />
                <Selector
                    label="Y Units"
                    tooltip="Units for the vertical axis"
                    value={plotOptions.yUnits}
                    options={
                        plotOptions.display === 'phase'
                            ? [['rads', 'Radians'], ['degrees', 'Degrees']]
                            : [['samples', 'Samples'], ['seconds', 'Seconds']]
                    }
                    onChange={(val) => updatePlotOptions('yUnits', val)}
                />
                <Toggle
                    label="Log Scale"
                    tooltip="Use logarithmic x-axis"
                    checked={plotOptions.logScale}
                    onChange={(e) => updatePlotOptions('logScale', e)}
                />
            </div>

            <div ref={plotWrapperRef} className='plot'>
                <Plot data={generatePhaseData} layout={layout} config={config} />
            </div>
        </div>
    );
}
