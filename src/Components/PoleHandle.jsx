// S. Sheta 2025
// A draggable complex pole representation, with optional ghost rendering for conjugates

import React, { useRef, useEffect, useState } from 'react';

export default function PoleHandle({id, x, y, radius, isActive, onDragStart, onDrag, onDragEnd, onDelete, diameter = 30, enforceRealOutput, imagValue}) 
{
    const ref = useRef(null);
    const localRadius = diameter / 2;
 
    useEffect(() => {
        if (!isActive) return;

        const handlePointer = (clientX, clientY) => {
            const parentRect = ref.current?.parentElement?.getBoundingClientRect();
            if (!parentRect) return;

            const center = {
                x: parentRect.left + parentRect.width / 2,
                y: parentRect.top + parentRect.height / 2
            };

            const dx = clientX - center.x;
            const dy = clientY - center.y;
            const angle = Math.atan2(dy, dx);
            const clamped = Math.min(Math.hypot(dx, dy), radius);

            onDrag(id, {
                x: clamped * Math.cos(angle),
                y: clamped * Math.sin(angle)
            });
        };

        const handleMouseMove = (e) => handlePointer(e.clientX, e.clientY);
        const handleTouchMove = (e) => {
            if (e.touches.length > 0) {
                const t = e.touches[0];
                handlePointer(t.clientX, t.clientY);
            }
        };

        const handleEnd = () => onDragEnd(id);

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleEnd);
        window.addEventListener('touchmove', handleTouchMove);
        window.addEventListener('touchend', handleEnd);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleEnd);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', handleEnd);
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

    const handleTouchStart = (e) => {
        e.stopPropagation();
        onDragStart(id);
    };

    return (
        <>
            <div
                ref={ref}
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
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
                        opacity: Math.min(0.7, Math.max(0.3, Math.abs(imagValue))),
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
