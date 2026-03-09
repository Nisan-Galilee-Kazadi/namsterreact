import React from 'react';

const Card = ({ children, className = '' }) => {
    return (
        <div className={`glass-card p-6 border border-white/40 shadow-xl ${className}`}>
            {children}
        </div>
    );
};

export default Card;
