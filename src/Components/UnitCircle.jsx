// Handles visual pole input and updates

// S. Sheta 2025
import React, { useRef, useEffect, useState } from 'react';

export default function UnitCircle({
    children,
    onAddPole
}) {
    const ref = useRef(null);
    const [radius, setRadius] = useState(0);
    const [center, setCenter] = useState({ x: 0, y: 0 });

    useEffect(() => {
        if (ref.current) {
            const rect = ref.current.getBoundingClientRect();
            setRadius(rect.width / 2);
            setCenter({
                x: rect.left + rect.width / 2,
                y: rect.top + rect.height / 2
            });
        }
    }, []);

    const handleClick = (e) => {
        const dx = e.clientX - center.x;
        const dy = e.clientY - center.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist <= radius) {
            onAddPole({ x: dx, y: dy });
        }
    };

    return (
        <div
            ref={ref}
            className="outer-circle"
            onClick={handleClick}
        >
            {children}
            <div className="origin-marker" />
        </div>
    );
}

export { UnitCircle };
