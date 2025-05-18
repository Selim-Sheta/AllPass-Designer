// S. Sheta 2025
// Interactive canvas for placing and dragging poles inside the unit circle

import React, { useRef, useEffect, useState } from 'react';
import GridBackground from './GridBackground';

export default function UnitCircle({ children, onAddPole, onStartImmediateDrag, onResize, coordSystem }) {
    const ref = useRef(null);
    const [radius, setRadius] = useState(0);
    const [center, setCenter] = useState({ x: 0, y: 0 });

    // Handle initial and dynamic resize
    useEffect(() => {
        if (!ref.current) return;

        const updateDimensions = () => {
            const rect = ref.current.getBoundingClientRect();
            const newRadius = rect.width / 2;
            setRadius(newRadius);
            setCenter({
                x: rect.left + newRadius,
                y: rect.top + newRadius
            });
            onResize(newRadius);
        };

        updateDimensions(); // Initial call
        const observer = new ResizeObserver(updateDimensions);
        observer.observe(ref.current);
        return () => observer.disconnect();
    }, [onResize]);

    const handleMouseDown = (e) => {
        // Only respond to left-click, and not on a child pole
        if (e.button !== 0 || e.target.closest('.pole-handle')) return;

        const dx = e.clientX - center.x;
        const dy = e.clientY - center.y;
        const distance = Math.hypot(dx, dy);

        if (distance <= radius) {
            const newPos = { x: dx, y: dy };
            const newId = onAddPole(newPos);
            if (newId !== null && newId !== undefined) {
                onStartImmediateDrag(newId);
            }
        }
    };

    return (
        <div className='filter-design-element'>
            <div
                ref={ref}
                className="unit-circle"
                onMouseDown={handleMouseDown}
            >
                <GridBackground
                    width={radius * 2}
                    height={radius * 2}
                    coordSystem={coordSystem}
                    radius={radius}
                />
                {children}
                <div className="origin-marker" />
            </div>
        </div>
    );
}

export { UnitCircle };
