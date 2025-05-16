// S. Sheta 2025
// Editable table component for pole data

import React from 'react';

export default function PoleTable({ poles, onAdd, onEdit, onDelete, coordSystem, enforceRealOutput }) {

    const addPole = () =>{
        onAdd({ x: 0, y: 0 });
    }

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

        onEdit(poleId, { real, imag });
    }

    function renderPoleRow(pole, isGhost = false) {
        const { id, pos } = pole;
        const displayId = isGhost ? `${id}*` : id;
        const readOnly = isGhost;

        if (coordSystem === 'rect') {
            return (
                <div key={`${id}-${isGhost ? 'ghost' : 'real'}`} className="table-row ghost-row">
                    <span  className='table-cell'>ID: {displayId}</span>
                    <span  className='table-cell'>
                        Real:
                        <input
                            type="number"
                            step="0.01"
                            value={parseFloat(pos.real.toFixed(4))}
                            min="-1"
                            max="1"
                            readOnly={readOnly}
                            onChange={(e) =>
                                !readOnly && onUserInput(id, parseFloat(e.target.value), pos.imag)
                            }
                            onBlur={(e) =>
                                !readOnly && onUserInput(id, parseFloat(e.target.value), pos.imag)
                            }
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !readOnly) {
                                    onUserInput(id, parseFloat(e.target.value), pos.imag);
                                }
                            }}
                        />
                    </span>
                    <span  className='table-cell'>
                        Imag:
                        <input
                            type="number"
                            step="0.01"
                            value={parseFloat(pos.imag.toFixed(4))}
                            min="-1"
                            max="1"
                            readOnly={readOnly}
                            onChange={(e) =>
                                !readOnly && onUserInput(id, pos.real, parseFloat(e.target.value))
                            }
                            onBlur={(e) =>
                                !readOnly && onUserInput(id, pos.real, parseFloat(e.target.value))
                            }
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !readOnly) {
                                    onUserInput(id, pos.real, parseFloat(e.target.value));
                                }
                            }}
                        />
                    </span>
                    {!readOnly && <button onClick={() => onDelete(id)}>X</button>}
                </div>
            );
        }

        const mag = Math.sqrt(pos.real ** 2 + pos.imag ** 2);
        const angle = Math.atan2(pos.imag, pos.real) * (180 / Math.PI);

        return (
            <div key={`${id}-${isGhost ? 'ghost' : 'real'}`} className="table-row ghost-row">
                <span  className='table-cell'>ID: {displayId}</span>
                <span  className='table-cell'>
                    Mag:
                    <input
                        type="number"
                        step="0.01"
                        value={mag.toFixed(4)}
                        min="0"
                        max="1"
                        readOnly={readOnly}
                        onChange={(e) =>
                            !readOnly && onUserInput(id, parseFloat(e.target.value), angle)
                        }
                        onBlur={(e) =>
                            !readOnly && onUserInput(id, parseFloat(e.target.value), angle)
                        }
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !readOnly) {
                                onUserInput(id, parseFloat(e.target.value), angle);
                            }
                        }}
                    />
                </span>
                <span  className='table-cell'>
                    Angle:
                    <input
                        type="number"
                        step="0.1"
                        value={angle.toFixed(2)}
                        min="-180"
                        max="180"
                        readOnly={readOnly}
                        onChange={(e) =>
                            !readOnly && onUserInput(id, mag, parseFloat(e.target.value))
                        }
                        onBlur={(e) =>
                            !readOnly && onUserInput(id, mag, parseFloat(e.target.value))
                        }
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !readOnly) {
                                onUserInput(id, mag, parseFloat(e.target.value));
                            }
                        }}
                    />
                </span>
                {!readOnly && <button onClick={() => onDelete(id)}>X</button>}
            </div>
        );
    }


    return (
        <div className = "table-container">
            <button onClick={addPole}>+</button>
            <div className="scrollable-table">
                {poles.flatMap((p) => {
                    const rows = [renderPoleRow(p, false)];
                    if (
                        enforceRealOutput &&
                        Math.abs(p.pos.imag) > 1e-6
                    ) {
                        const ghost = {
                            ...p,
                            pos: {
                                real: p.pos.real,
                                imag: -p.pos.imag
                            }
                        };
                        rows.push(renderPoleRow(ghost, true));
                    }
                    return rows;
                })}
            </div>
        </div>
    );
}
