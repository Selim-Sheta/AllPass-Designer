// S. Sheta 2025
// A single pole handle component.

import React, { useRef, useEffect, useState } from 'react';

export default function PoleHandle({
    id,
    x,
    y,
    radius,
    isActive,
    onDragStart,
    onDrag,
    onDragEnd,
    diameter = 30,
    className = ''
}) {
    const ref = useRef(null);
    const [localRadius, setLocalRadius] = useState(diameter / 2);

    useEffect(() => {
        if (ref.current) {
            const rect = ref.current.getBoundingClientRect();
            setLocalRadius(rect.width / 2);
        }
    }, []);

    useEffect(() => {
        if (!isActive) return;

        const handleMouseMove = (e) => {
            if (!ref.current) return;

            const parentRect = ref.current.parentElement.getBoundingClientRect();
            const center = {
                x: parentRect.left + parentRect.width / 2,
                y: parentRect.top + parentRect.height / 2
            };

            const dx = e.clientX - center.x;
            const dy = e.clientY - center.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const angle = Math.atan2(dy, dx);
            const clamped = Math.min(distance, radius);

            onDrag(id, {
                x: clamped * Math.cos(angle),
                y: clamped * Math.sin(angle)
            });
        };

        const handleMouseUp = () => {
            onDragEnd(id);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isActive, radius, onDrag, onDragEnd, id]);

    const handleMouseDown = (e) => {
        e.stopPropagation();
        onDragStart(id);
    };

    return (
        <div
            ref={ref}
            onMouseDown={handleMouseDown}
            className={className}
            style={{
                transform: `translate(${x - localRadius}px, ${y - localRadius}px)`,
                width: `${diameter}px`,
                height: `${diameter}px`,
                borderRadius: '50%',
                backgroundColor: '#333',
                position: 'absolute',
                top: '50%',
                left: '50%',
                cursor: isActive ? 'grabbing' : 'grab'
            }}
        />
    );
}
