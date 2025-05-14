// S. Sheta 2025
import React, { useMemo } from 'react';
import Plot from 'react-plotly.js';
import Complex from 'complex.js';
import { calculateAllPassFrequencyResponse, getPhase, unwrapPhase } from '../utils/dsp';

export default function PhasePlot({ poles, logScale = false }) {
    // Frequencies from 0 to π (normalized angular frequency)
    const w = useMemo(() => {
        const N = 512;
        return Array.from({ length: N }, (_, i) => (Math.PI * i) / (N - 1));
    }, []);

    const phase = useMemo(() => {
        const complexPoles = poles.map(p => new Complex(p.pos.real, p.pos.imag));
        const H = calculateAllPassFrequencyResponse(w, complexPoles);
        const phase = getPhase(H);
        const unwrappedPhase = unwrapPhase(phase);
        return unwrappedPhase;
    }, [w, poles]);

    const layout = useMemo(() => ({
        margin: { t: 20, r: 10, b: 40, l: 50 },
        xaxis: {
            title: 'Normalized Frequency (rad/sample)',
            type: logScale ? 'log' : 'linear',
            range: logScale ? [0.01, Math.PI] : [0, Math.PI]
        },
        yaxis: {
            title: 'Phase (radians)',
            range: [-Math.PI, Math.PI]
        },
    }), [logScale]);

    return (
        <div className="phase-plot">
            <Plot
                data={[
                    {
                        x: w,
                        y: phase,
                        type: 'scatter',
                        mode: 'lines',
                        line: { color: 'blue' }
                    }
                ]}
                layout={layout}
                config={{ responsive: false}}
            />
        </div>
    );
}
