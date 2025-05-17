// S. Sheta 2025
import React, { useMemo } from 'react';
import Plot from 'react-plotly.js';
import Complex from 'complex.js';
import { calculateAllPassFrequencyResponse, calculatePhaseDelay, getPhase, unwrapPhase } from '../utils/dsp';

export default function PhasePlot({ poles, logScale = false, enforceRealOutput }) {
    // Frequencies from 0 to π (normalized angular frequency)
    const w = useMemo(() => {
        const N = 512;
        return Array.from({ length: N }, (_, i) => (Math.PI * i) / (N - 1));
    }, []);

    const phase = useMemo(() => {
        const complexPoles = poles.map(p => new Complex(p.pos.real, p.pos.imag));
        // For every non-real pole, add its conjugate to the list
        if (enforceRealOutput) {
            const conjugates = complexPoles
                .filter(p => p.im !== 0)
                .map(p => new Complex(p.re, -p.im));
            complexPoles.push(...conjugates);
        }
        const H = calculateAllPassFrequencyResponse(w, complexPoles);
        const phase = getPhase(H);
        const unwrappedPhase = unwrapPhase(phase);
        const phaseDelay = calculatePhaseDelay(unwrappedPhase, w);
        return phaseDelay;
    }, [w, poles, enforceRealOutput]);

    const layout = useMemo(() => ({
        margin: { t: 20, r: 10, b: 40, l: 50 },

        xaxis: {
            title: 'Normalized Frequency (rads)',
            type: logScale ? 'log' : 'linear',
            range: logScale ? [0.01, Math.PI] : [0, Math.PI],
        },
        yaxis: {
            title: 'Phase (radians)',
            range: [-Math.PI, Math.PI],
            autorange: true
        },
    }), [logScale]);

    const config = {
        responsive: false,
        displaylogo: false,
    }

    return (
        <div className="filter-design-element plot">
            <Plot
                data={[
                    {
                        x: w,
                        y: phase,
                        type: 'scatter',
                        mode: 'lines',
                        line: { color: '#1bce9e' }
                    }
                ]}
                layout={layout}
                config={config}
            />
        </div>
    );
}
