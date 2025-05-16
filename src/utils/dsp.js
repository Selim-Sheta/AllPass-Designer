// S. Sheta 2025
import Complex from 'complex.js';

/**
 * @param {number[]} w - list of normalized angular frequencies [0, 2π]
 * @param {Complex[]} poles - list of complex poles (assumed all-pass)
 * @returns {Complex[]} - complex frequency response at each w
 */
export function calculateAllPassFrequencyResponse(w, poles) {
    for (const p of poles) {
        if (!(p instanceof Complex)) {
            throw new Error('poles must be instances of Complex');
        }
    }
    return w.map(freq => {
        const zInv = Complex({ abs: 1, arg: -freq }); // z = e^(-jω)
        let H = new Complex(1, 0);
        for (const p of poles) {
            const num = zInv.sub(p.conjugate());
            const den = new Complex(1, 0).sub(p.mul(zInv));
            H = H.mul(num.div(den));
        }
        return H;
    });
}

/**
* @param {number[]} h - complex array
* @returns {number[]} - phase of the complex array
*/
export function getPhase(h) {
    for (const item of h) {
        if (!(item instanceof Complex)) {
            throw new Error('h must be instances of Complex');
        }
    }
    return h.map((h) => {
        if (h.re === 0 && h.im === 0) {
            return 0;
        }
        return Math.atan2(h.im, h.re);
    });
}
 
/**
 * @param {number[]} phase - Array of wrapped phase values in radians
 * @returns {number[]} - Unwrapped phase values
 */
export function unwrapPhase(phase) {
    const unwrapped = [phase[0]];
    let offset = 0;

    for (let i = 1; i < phase.length; i++) {
        let delta = phase[i] - phase[i - 1];

        if (delta > Math.PI) {
            offset -= 2 * Math.PI;
        } else if (delta < -Math.PI) {
            offset += 2 * Math.PI;
        }

        unwrapped.push(phase[i] + offset);
    }

    return unwrapped;
}

/**
 * @param {number[]} phase - Array of unwrapped phase values in radians
 * @param {number[]} w - Array of normalized angular frequencies
 * @returns {number[]} - phase delay (-φ/ω)
 */
export function calculatePhaseDelay(phase, w) {
    if (phase.length !== w.length) {
        throw new Error('Phase and frequency arrays must have the same length');
    }
    return phase.map((p, i) => -p / w[i]);
}

/**
 * @param {number[]} phase - Array of unwrapped phase values in radians
 * @param {number[]} w - Array of normalized angular frequencies
 * @returns {number[]} - group delay (-dφ/dω)
 */
export function calculateGroupDelay(phase, w) {
    if (phase.length !== w.length) {
        throw new Error('Phase and frequency arrays must have the same length');
    }
    const groupDelay = [];
    for (let i = 1; i < phase.length; i++) {
        const deltaPhase = phase[i] - phase[i - 1];
        const deltaW = w[i] - w[i - 1];
        groupDelay.push(-deltaPhase / deltaW);
    }
    groupDelay.unshift(groupDelay[0]); // Duplicate the first value
    return groupDelay;
}

/**
 * Calculate feedback coefficients from poles. The result corresponds to the 
 * coefficients of the polynomial expansion of (1 - p1*z^-1)(1 - p2*z^-1)...(1 - pn*z^-1),
 * where p1, p2, ..., pn are the poles.
 * @param {Complex[]} poles - list of complex poles
 * @returns {Complex[]} - feedback coefficients
 */
export function calculateFeedbackCoefficients(poles) {
    for (const p of poles) {
        if (!(p instanceof Complex)) {
            throw new Error('poles must be instances of Complex');
        }
    }

    let coeffs = [new Complex(1, 0)];

    for (const p of poles) {
        const next = Array(coeffs.length + 1).fill().map(() => new Complex(0, 0));
        for (let i = 0; i < coeffs.length; i++) {
            next[i] = next[i].add(coeffs[i]);                  // term without p
            next[i + 1] = next[i + 1].sub(coeffs[i].mul(p));   // term with -p*z^-1
        }
        coeffs = next;
    }

    return coeffs;
}

/** 
 * Extract real and imaginary parts of a complex array
 * @param {Complex[]} complexArray - array of complex numbers
 * @returns {real: number[], imag: number[]} - object with real and imaginary parts
 */
export function extractRealImaginary(complexArray) {
    const real = complexArray.map(c => c.re);
    const imag = complexArray.map(c => c.im);
    return { real, imag };
}