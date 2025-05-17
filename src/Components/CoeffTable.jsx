// S. Sheta 2025
// Compute and display the coefficients of the all-pass filter

import React, {useMemo, useState} from 'react';
import Complex from 'complex.js';
import { calculateFeedbackCoefficients, extractRealImaginary } from '../utils/dsp';
export default function PoleTable({ poles, enforceRealOutput }) {
    const [copied, setCopied] = useState(false);

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

    const formatForDisplay = c => enforceRealOutput ? c.re.toFixed(6) : `${c.re.toFixed(6)} + ${c.im.toFixed(6)}i`;
    const formatForDownload = c => enforceRealOutput ? `${c.re}` : `${c.re}${c.im !== 0 ? (c.im < 0 ? ' - ' : ' + ') + Math.abs(c.im) + 'i' : ''}`;

    function triggerDownload() {
        const feedforwardText = 'feedforward coefficients: ' + feedforwardCoefficients.map(formatForDownload).join(', ');
        const feedbackText = 'feedback coefficients: ' + feedbackCoefficients.map(formatForDownload).join(', ');
        const text = `${feedforwardText}\n${feedbackText}`;
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'coefficients.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        URL.revokeObjectURL(url);
    }

    function triggerCopy() {
        const feedforwardText = 'feedforward coefficients: ' + feedforwardCoefficients.map(formatForDownload).join(', ');
        const feedbackText = 'feedback coefficients: ' + feedbackCoefficients.map(formatForDownload).join(', ');
        const text = `${feedforwardText}\n${feedbackText}`;
        navigator.clipboard.writeText(text).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 500); // reset after 0.5 sec
        }).catch((err) => {
            console.error('Copy failed:', err);
        });
    }

    return (
        <div className="filter-design-element">
            <div className="download-buttons">
                <button title="Download coefficients as a txt file." className='text-button' onClick={triggerDownload}>Download</button>
                <button title="Copy coefficients to clipboard." className='text-button' onClick={triggerCopy}>{copied ? 'Copied!' : 'Copy'}</button>
            </div>
            <div id="coeffs-table" className="scrollable-table">
            <div className='table-row table-headers'>
                <span className='table-cell'>Delay (t)</span>
                <span className='table-cell'>Feedforward</span>
                <span className='table-cell'>Feedback</span>
            </div>
            {feedbackCoefficients.map((fb, i) => (
                <div className='table-row' key={i}>
                    <span className='table-cell'>{i}</span>
                    <span className='table-cell'>{formatForDisplay(feedforwardCoefficients[i])}</span>
                    <span className='table-cell'>{formatForDisplay(fb)}</span>
                </div>
            ))}
            </div>
        </div>
    );
}
     