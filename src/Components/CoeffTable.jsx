// S. Sheta 2025
// Compute and display the coefficients of the all-pass filter

import React, { useMemo, useState } from 'react';
import Complex from 'complex.js';
import { calculateFeedbackCoefficients } from '../utils/dsp';

export default function CoeffTable({ poles, enforceRealOutput }) {
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

        const feedback = calculateFeedbackCoefficients(complexPoles);
        const feedforward = feedback.map(c => c.conjugate()).reverse();
        return { feedbackCoefficients: feedback, feedforwardCoefficients: feedforward };
    }, [poles, enforceRealOutput]);

    const formatForDisplay = c => enforceRealOutput ? c.re.toFixed(6) : `${c.re.toFixed(3)} + ${c.im.toFixed(3)}i`;
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
        navigator.clipboard?.writeText(text).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 500); // reset after 0.5 sec
        }).catch((err) => {
            console.error('Copy failed:', err);
        });
    }

    return (
        <div className="section-container">
            <div className="action-row">
                <button title="Download coefficients as a txt file." className='text-button' onClick={triggerDownload}>Download</button>
                <button title="Copy coefficients to clipboard." className='text-button' onClick={triggerCopy}>{copied ? 'Copied!' : 'Copy'}</button>
            </div>
            <div className="scrollable-table">
                <table>
                    <colgroup>
                        <col />
                        <col style={{ width: '40%' }} />
                        <col style={{ width: '40%' }} />
                    </colgroup>
                    <thead>
                        <tr>
                            <th className='table-cell first-col'>Delay</th>
                            <th className='table-cell'>Feedforward</th>
                            <th className='table-cell'>Feedback</th>
                        </tr>
                    </thead>
                    <tbody>
                        {feedbackCoefficients.map((fb, i) => (
                            <tr key={i}>
                                <td className='table-cell first-col'>{i}</td>
                                <td className='table-cell'>{formatForDisplay(feedforwardCoefficients[i])}</td>
                                <td className='table-cell'>{formatForDisplay(fb)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
