// S. Sheta 2025
// A draggable complex pole representation, with optional ghost rendering for conjugates

import React, { useRef, useEffect, useState } from 'react';

export default function PoleHandle({id, x, y, radius, isActive, onDragStart, onDrag, onDragEnd, onDelete, diameter = 30, enforceRealOutput, imagValue}) 
{
    const ref = useRef(null);
    const localRadius = diameter / 2;
 
    useEffect(() => {
        if (!isActive) return;

        const handleMouseMove = (e) => {
            const parentRect = ref.current?.parentElement?.getBoundingClientRect();
            if (!parentRect) return;

            const center = {
                x: parentRect.left + parentRect.width / 2,
                y: parentRect.top + parentRect.height / 2
            };

            const dx = e.clientX - center.x;
            const dy = e.clientY - center.y;
            const angle = Math.atan2(dy, dx);
            const clamped = Math.min(Math.hypot(dx, dy), radius); // stay inside unit circle

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
                className={`pole-handle${isActive ? ' active' : ''}`}
                style={{
                    transform: `translate(${x - localRadius}px, ${y - localRadius}px)`,
                    width: `${diameter}px`,
                    height: `${diameter}px`,
                    cursor: isActive ? 'grabbing' : 'grab',
                    zIndex: 1
                }}
            >
                {id}
            </div>
            {/* Render conjugate ghost only if imaginary part is significant */}
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
                        zIndex: 0
                    }}
                >
                    {id}
                </div>
            )}
        </>
    );
}
