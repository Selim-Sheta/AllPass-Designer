// S. Sheta 2025
// Compute and display the coefficients of the all-pass filter

import React, {useMemo} from 'react';
import Complex from 'complex.js';
import { calculateFeedbackCoefficients, extractRealImaginary } from '../utils/dsp';
//import { LuClipboardCopy, LuDownload, LuFolderOpen, LuSave, LuShare2 } from "react-icons/lu";
export default function PoleTable({ poles, enforceRealOutput }) {

    const { feedbackCoefficients, feedforwardCoefficients } = useMemo(() => {
        const complexPoles = poles.map(p => new Complex(p.pos.real, p.pos.imag));
        // For every non-real pole, add its conjugate to the list
        if (enforceRealOutput) {
            const conjugates = complexPoles
                .filter(p => p.im !== 0)
                .map(p => new Complex(p.re, -p.im));
            complexPoles.push(...conjugates);
        }
        const feedbackCoefficients = calculateFeedbackCoefficients(complexPoles);
        const feedforwardCoefficients = feedbackCoefficients
            .map(c => c.conjugate())
            .reverse();

        return { feedbackCoefficients, feedforwardCoefficients };
    }, [poles, enforceRealOutput]);

    const format = c => enforceRealOutput ? c.re.toFixed(6) : `${c.re.toFixed(6)} + ${c.im.toFixed(6)}i`;

    return (
        <div className="table-container">
            <div className="download-buttons">
                <button title="Download coefficients as a txt file." className='text-button'>Download</button>
                <button title="Copy coefficients to clipboard." className='text-button'>Copy</button>
            </div>
            <div className="scrollable-table">
            <div className='table-row table-headers'>
                <span className='table-cell'>Delay (t)</span>
                <span className='table-cell'>Feedforward</span>
                <span className='table-cell'>Feedback</span>
            </div>
            {feedbackCoefficients.map((fb, i) => (
                <div className='table-row' key={i}>
                    <span className='table-cell'>{i}</span>
                    <span className='table-cell'>{format(feedforwardCoefficients[i])}</span>
                    <span className='table-cell'>{format(fb)}</span>
                </div>
            ))}
            </div>
        </div>
    );
}
     