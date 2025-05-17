// S. Sheta 2025
// A single pole handle component.

import React, { useRef, useEffect, useState } from 'react';

export default function PoleHandle({id, x, y, radius, isActive, onDragStart, onDrag, onDragEnd, onDelete, diameter = 30, enforceRealOutput, imagValue}) 
{
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
        if (e.shiftKey) {
            onDelete(id); // delete on shift-click
        } else {
            onDragStart(id);
        }
    };

    return (
        <>
            <div
                ref={ref}
                onMouseDown={handleMouseDown}
                className='pole-handle'
                style={{
                    transform: `translate(${x - localRadius}px, ${y - localRadius}px)`,
                    width: `${diameter}px`,
                    height: `${diameter}px`,
                    cursor: isActive ? 'grabbing' : 'grab',
                    zIndex: 1
                }}
            >
            </div>
            {/* Ghost pole: appears if EnforceRealOutput is on and imag ≠ 0 */}
            {enforceRealOutput && Math.abs(imagValue) > 1e-6 && (
                <div
                    onMouseDown={(e) => e.stopPropagation()}
                    className="pole-handle ghost"
                    style={{
                        transform: `translate(${x - localRadius}px, ${-y - localRadius}px)`,
                        width: `${diameter}px`,
                        height: `${diameter}px`,
                        opacity: Math.min(0.5, Math.max(0.1, Math.abs(imagValue))),
                        cursor: 'not-allowed',
                        zIndex: 0 // explicitly behind
                    }}
                />
            )}
        </>
    );
}
