import React, { useRef, useEffect, useState } from 'react';

export default function Pole({ x, y, onDrag, onDragStart, onDragEnd, radius, isActive }) {
    const ref = useRef(null);
    const [localRadius, setLocalRadius] = useState(0);

    useEffect(() => {
        if (ref.current) {
            const rect = ref.current.getBoundingClientRect();
            setLocalRadius(rect.width / 2);
        }
    }, []);

    const handleMouseDown = (e) => {
        e.stopPropagation();
        onDragStart();
    };

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!isActive) return;

            const rect = ref.current.parentElement.getBoundingClientRect();
            const center = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
            const dx = e.clientX - center.x;
            const dy = e.clientY - center.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const angle = Math.atan2(dy, dx);
            const clamped = Math.min(distance, radius);
            onDrag({
                x: clamped * Math.cos(angle),
                y: clamped * Math.sin(angle)
            });
        };

        const handleMouseUp = () => {
            if (isActive) onDragEnd();
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isActive, radius, onDrag, onDragEnd]);

    return (
        <div
            ref={ref}
            onMouseDown={handleMouseDown}
            className="inner-circle"
            style={{
                transform: `translate(${x - localRadius}px, ${y - localRadius}px)`,
                cursor: isActive ? 'grabbing' : 'grab'
            }}
        />
    );
}
