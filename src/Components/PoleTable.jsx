// S. Sheta 2025
// Editable table component for pole data

import React from 'react';

export default function PoleTable({ poles, onEdit, onDelete }) {

    function onUserInput(poleId, real, imag) {
        if (isNaN(real) || isNaN(imag)) {
            real = 0;
            imag = 0;
        }

        const mag = Math.sqrt(real * real + imag * imag);
        if (mag >= 1) {
            const scale = 0.9999 / mag; // just below 1
            real *= scale;
            imag *= scale;
        }

        onEdit(poleId, {
            real: parseFloat(real.toFixed(2)),
            imag: parseFloat(imag.toFixed(2))
        });
    }

    return (
        <div className="scrollable-table">
            {poles.map((p) => (
                <div key={p.id} className="table-row">
                    <span>ID: {p.id}</span>
                    <span>
                        Real:
                        <input
                            type="number"
                            step="0.01"
                            value={parseFloat(p.pos.real.toFixed(4))}
                            min="-1"
                            max="1"
                            onChange={(e) =>
                                onUserInput(p.id, parseFloat(e.target.value), p.pos.imag)
                            }
                            onBlur={(e) =>
                                onUserInput(p.id, parseFloat(e.target.value), p.pos.imag)
                            }
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    onUserInput(p.id, parseFloat(e.target.value), p.pos.imag);
                                }
                            }}
                        />
                    </span>
                    <span>
                        Imag:
                        <input
                            type="number"
                            step="0.01"
                            value={parseFloat(p.pos.imag.toFixed(4))}
                            min="-1"
                            max="1"
                            onChange={(e) =>
                                onUserInput(p.id, p.pos.real, parseFloat(e.target.value))
                            }
                            onBlur={(e) =>
                                onUserInput(p.id, p.pos.real, parseFloat(e.target.value))
                            }
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    onUserInput(p.id, p.pos.real, parseFloat(e.target.value));
                                }
                            }}
                        />
                    </span>

                    <button onClick={() => onDelete(p.id)}>X</button>
                </div>
            ))}
        </div>
    );
}
