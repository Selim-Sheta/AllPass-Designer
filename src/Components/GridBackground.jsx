// S. Sheta 2025

import React from 'react';

const NUM_CIRCLES = 4;
const NUM_SPOKES = 12;
const GRID_COLOR = '#ccc';

export default function GridBackground({ width, height, coordSystem, radius }) {
    const centerX = width / 2;
    const centerY = height / 2;

    const cartesianGrid = (
        <>
            {/* X axis */}
            <line
                x1="0"
                y1={centerY}
                x2={width}
                y2={centerY}
                stroke={GRID_COLOR}
                strokeWidth="1"
            />
            {/* Y axis */}
            <line
                x1={centerX}
                y1="0"
                x2={centerX}
                y2={height}
                stroke={GRID_COLOR}
                strokeWidth="1"
            />
        </>
    );

    const polarGrid = (
        <>
            {/* Concentric circles */}
            {Array.from({ length: NUM_CIRCLES }, (_, i) => {
                const r = radius * ((i + 1) / NUM_CIRCLES);
                return (
                    <circle
                        key={`circle-${i}`}
                        cx={centerX}
                        cy={centerY}
                        r={r}
                        stroke={GRID_COLOR}
                        strokeWidth="1"
                        fill="none"
                    />
                );
            })}
            {/* Spokes */}
            {Array.from({ length: NUM_SPOKES }, (_, i) => {
                const angle = (i / NUM_SPOKES) * 2 * Math.PI;
                const x = centerX + radius * Math.cos(angle);
                const y = centerY + radius * Math.sin(angle);
                return (
                    <line
                        key={`spoke-${i}`}
                        x1={centerX}
                        y1={centerY}
                        x2={x}
                        y2={y}
                        stroke={GRID_COLOR}
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
            style={{ position: 'absolute', top: -3, left: -3, pointerEvents: 'none' }}
        >
            {coordSystem === 'rect' ? cartesianGrid : polarGrid}
        </svg>
    );
}