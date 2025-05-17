// S. Sheta 2025

import React from 'react';

export default function GridBackground({ width, height, coordSystem, radius }) {
    const center = { x: width / 2, y: height / 2 };
    const numCircles = 4;
    const numSpokes = 12;

    const cartesianGrid = (
        <>
            {/* X axis */}
            <line
                x1="0"
                y1={center.y}
                x2={width}
                y2={center.y}
                stroke="#ccc"
                strokeWidth="1"
            />
            {/* Y axis */}
            <line
                x1={center.x}
                y1="0"
                x2={center.x}
                y2={height}
                stroke="#ccc"
                strokeWidth="1"
            />
        </>
    );

    const polarGrid = (
        <>
            {/* Concentric circles */}
            {Array.from({ length: numCircles }).map((_, i) => {
                const r = radius * ((i + 1) / numCircles);
                return (
                    <circle
                        key={`circle-${i}`}
                        cx={center.x}
                        cy={center.y}
                        r={r}
                        stroke="#ccc"
                        strokeWidth="1"
                        fill="none"
                    />
                );
            })}
            {/* Spokes */}
            {Array.from({ length: numSpokes }).map((_, i) => {
                const angle = (i / numSpokes) * 2 * Math.PI;
                const x = center.x + radius * Math.cos(angle);
                const y = center.y + radius * Math.sin(angle);
                return (
                    <line
                        key={`spoke-${i}`}
                        x1={center.x}
                        y1={center.y}
                        x2={x}
                        y2={y}
                        stroke="#ccc"
                        strokeWidth="1"
                    />
                );
            })}
        </>
    );

    return (
        <svg
            className="unit-circle-grid"
            width={width}
            height={height}
            style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
        >
            {coordSystem === 'rect' ? cartesianGrid : polarGrid}
        </svg>
    );
}
