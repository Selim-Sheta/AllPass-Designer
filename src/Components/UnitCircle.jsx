// S. Sheta 2025
// Handles visual pole input and updates
import React, { useRef, useEffect, useState } from 'react';

export default function UnitCircle({children,onAddPole,onStartImmediateDrag,onResize}) 
{
    const ref = useRef(null);
    const [radius, setRadius] = useState(0);
    const [center, setCenter] = useState({ x: 0, y: 0 });
    const [mouseDownPos, setMouseDownPos] = useState(null);

    // Add a pole at the clicked position
    const addPole = (e) => {
        const relX = e.clientX - center.x;
        const relY = e.clientY - center.y;
        const dist = Math.sqrt(relX * relX + relY * relY);
        if (dist <= radius) {
            onAddPole({ x: relX, y: relY });
        }
    }

    // Set the radius and center of the unit circle
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
            if (typeof onResize === 'function') onResize(newRadius);
        };

        // Initial call
        updateDimensions();

        // Observe size changes
        const observer = new ResizeObserver(updateDimensions);
        observer.observe(ref.current);

        return () => observer.disconnect();
    }, []);


    useEffect(() => {
        const observer = new ResizeObserver(([entry]) => {
            const width = entry.contentRect.width;
            setRadius(width / 2);  // local use
            if (typeof onResize === 'function') onResize(width / 2); // report up
        });

        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);


    const handleMouseDown = (e) => {
        // Only respond to left-click
        if (e.button !== 0) return;

        // Ensure the click wasn't on a child pole
        if (e.target.closest('.pole-handle')) return;

        const dx = e.clientX - center.x;
        const dy = e.clientY - center.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist <= radius) {
            const newPos = { x: dx, y: dy };
            const newId = onAddPole(newPos); // get new pole ID
            onStartImmediateDrag(newId);
        }
    };

    
    return (
        <div
            ref={ref}
            className="unit-circle"
            onMouseDown={handleMouseDown}
        >
            {children}
            <div className="origin-marker" />
        </div>
    );
}

export { UnitCircle };
