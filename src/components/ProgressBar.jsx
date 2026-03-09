import React from 'react';

const ProgressBar = ({ progress }) => {
    return (
        <div className="w-full bg-gray-200 dark:bg-white/10 rounded-full h-4 overflow-hidden">
            <div
                className="bg-primary h-4 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
        </div>
    );
};

export default ProgressBar;
