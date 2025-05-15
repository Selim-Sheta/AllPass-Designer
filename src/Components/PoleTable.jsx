// S. Sheta 2025
// Editable table component for pole data

import React from 'react';

export default function PoleTable({ poles, onEdit, onDelete, coordSystem }) {

    function onUserInput(poleId, input1, input2) {
        if (isNaN(input1) || isNaN(input2)) return;
        let real, imag;

        if (coordSystem === 'rect') {
            real = input1;
            imag = input2;
        } else {
            const angleRad = (input2 * Math.PI) / 180;
            real = input1 * Math.cos(angleRad);
            imag = input1 * Math.sin(angleRad);
        }

        const mag = Math.sqrt(real * real + imag * imag);
        if (mag >= 1) {
            const scale = 0.9999 / mag;
            real *= scale;
            imag *= scale;
        }

        onEdit(poleId, {real, imag });
    }

    return (
        <div className="scrollable-table">
            {poles.map((p) => {
                const { id, pos } = p;
                if (coordSystem === 'rect') {
                    return (
                        <div key={id} className="table-row">
                            <span>ID: {id}</span>
                            <span>
                                Real:
                                <input
                                    type="number"
                                    step="0.01"
                                    value={parseFloat(pos.real.toFixed(4))}
                                    min="-1"
                                    max="1"
                                    onChange={(e) => onUserInput(id, parseFloat(e.target.value), pos.imag)}
                                    onBlur={(e) => onUserInput(id, parseFloat(e.target.value), pos.imag)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            onUserInput(id, parseFloat(e.target.value), pos.imag);
                                        }
                                    }}
                                />
                            </span>
                            <span>
                                Imag:
                                <input
                                    type="number"
                                    step="0.01"
                                    value={parseFloat(pos.imag.toFixed(4))}
                                    min="-1"
                                    max="1"
                                    onChange={(e) => onUserInput(id, pos.real, parseFloat(e.target.value))}
                                    onBlur={(e) => onUserInput(id, pos.real, parseFloat(e.target.value))}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            onUserInput(id, pos.real, parseFloat(e.target.value));
                                        }
                                    }}
                                />
                            </span>
                            <button onClick={() => onDelete(id)}>X</button>
                        </div>
                    );
                }

                // Polar view
                const mag = Math.sqrt(pos.real ** 2 + pos.imag ** 2);
                const angle = Math.atan2(pos.imag, pos.real) * (180 / Math.PI);

                return (
                    <div key={id} className="table-row">
                        <span>ID: {id}</span>
                        <span>
                            Mag:
                            <input
                                type="number"
                                step="0.01"
                                value={mag.toFixed(4)}
                                min="0"
                                max="1"
                                onChange={(e) => onUserInput(id, parseFloat(e.target.value), angle)}
                                onBlur={(e) => onUserInput(id, parseFloat(e.target.value), angle)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        onUserInput(id, parseFloat(e.target.value), angle);
                                    }
                                }}
                            />
                        </span>
                        <span>
                            Angle:
                            <input
                                type="number"
                                step="0.1"
                                value={angle.toFixed(2)}
                                min="-180"
                                max="180"
                                onChange={(e) => onUserInput(id, mag, parseFloat(e.target.value))}
                                onBlur={(e) => onUserInput(id, mag, parseFloat(e.target.value))}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        onUserInput(id, mag, parseFloat(e.target.value));
                                    }
                                }}
                            />
                        </span>
                        <button onClick={() => onDelete(id)}>X</button>
                    </div>
                );
            })}

        </div>
    );
}
