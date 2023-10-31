import React, { useState, useEffect } from 'react';

import './styles/Header.css'

// credit for typing animation
// https://blog.logrocket.com/3-ways-implement-typing-animation-react/
const Typewriter = ({ text, delay }) => {
    const [currentText, setCurrentText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);

    // Typing logic goes here
    useEffect(() => {
        if (currentIndex < text.length) {
            const timeout = setTimeout(() => {
                setCurrentText(prevText => prevText + text[currentIndex]);
                setCurrentIndex(prevIndex => prevIndex + 1);
            }, delay);

            return () => clearTimeout(timeout);
        }
    }, [currentIndex, delay, text]);

    return <span>{currentText}</span>;
};

const Header = () => {
    return (
        <div className="header">
            <label><b>
                <Typewriter text="MASTER TURTLE CONSOLE" delay={100} />
            </b><span id='rect'>&#9611;</span></label>
        </div>
    );
}

export default Header;