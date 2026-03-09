import React, { useRef, useState, useEffect } from 'react';

const ImagePreview = ({ src, onCoordinateSelect }) => {
    const imgRef = useRef(null);
    const [clickPos, setClickPos] = useState(null);

    const handleClick = (e) => {
        if (!imgRef.current || !src) return;

        const rect = imgRef.current.getBoundingClientRect();
        const clickClientX = e.clientX - rect.left;
        const clickClientY = e.clientY - rect.top;

        const displayW = rect.width;
        const displayH = rect.height;
        const naturalW = imgRef.current.naturalWidth;
        const naturalH = imgRef.current.naturalHeight;

        const scaleX = naturalW / displayW;
        const scaleY = naturalH / displayH;

        const finalX = Math.round(clickClientX * scaleX);
        const finalY = Math.round(clickClientY * scaleY);

        setClickPos({ x: finalX, y: finalY });
        onCoordinateSelect({ x: finalX, y: finalY });
    };

    if (!src) return null;

    return (
        <div className="relative inline-block border-2 border-dashed border-gray-300 rounded-lg overflow-hidden cursor-crosshair" onClick={handleClick}>
            <img ref={imgRef} src={src} alt="Preview" className="max-w-full h-auto block" />
            {clickPos && (
                <div
                    className="absolute w-4 h-4 bg-red-500 rounded-full border-2 border-white transform -translate-x-1/2 -translate-y-1/2 pointer-events-none shadow-sm"
                    style={{
                        left: (clickPos.x / imgRef.current?.naturalWidth) * 100 + '%',
                        top: (clickPos.y / imgRef.current?.naturalHeight) * 100 + '%'
                    }}
                />
            )}
        </div>
    );
};

export default ImagePreview;
