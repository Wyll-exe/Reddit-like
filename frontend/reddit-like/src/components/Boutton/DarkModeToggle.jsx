import '../../style.css';
import React, { useEffect, useState } from 'react';

function DarkModeToggle() {
    const [darkMode, setDarkMode] = useState(false);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [darkMode]);

    return (
        <div className='flex items-end justify-center h-[80%]'>
            <div className="flex items-center justify-center ">
                <button
                    onClick={toggleDarkMode}
                    className={`p-2 rounded ${darkMode ? 'bg-white text-black' : 'bg-gray-800 text-white'}`}
                >
                    {darkMode ? 'Light Mode' : 'Dark Mode'}
                </button>
            </div>
        </div>
    );
}

export default DarkModeToggle;