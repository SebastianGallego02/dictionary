import Link from 'next/link';
import React from 'react'
import { RiBook2Line } from 'react-icons/ri';

type FontOption = {
    name: string;
    className: string;
};

type HeaderProps = {
    selectedFont: FontOption;
    fontDropdownOpen: boolean;
    isDarkMode: boolean;
    dropdownThemeClass: string;
    fontOptions: FontOption[];
    mounted: boolean;
    setFontDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setSelectedFont: React.Dispatch<React.SetStateAction<FontOption>>;
    setIsDarkMode: () => void; 
};

const Header: React.FC<HeaderProps> = ({selectedFont, fontDropdownOpen, dropdownThemeClass, isDarkMode, fontOptions, mounted, setSelectedFont, setFontDropdownOpen, setIsDarkMode}) => {

    const selectFont = (font: FontOption) => {
        setSelectedFont(font);
        setFontDropdownOpen(false);
    };

  return (
    <div className="flex justify-between items-center mb-4">
                    <Link className="rounded text-2xl opacity-50 hover:opacity-100 cursor-pointer" title="Historial de búsqueda" href="/browsing_history">
                        <RiBook2Line/>
                    </Link>

                    {/* Font Selector Dropdown */}
                    <div className="relative">
                        <div
                            className="flex items-center space-x-2 cursor-pointer"
                            onClick={() => setFontDropdownOpen(!fontDropdownOpen)}
                        >
                            <span>{selectedFont.name}</span>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className={`w-4 h-4 transition-transform ${fontDropdownOpen ? 'rotate-180' : ''}`}
                            >
                                <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                        </div>

                        {/* Dropdown Menu */}
                        {fontDropdownOpen && (
                            <div className="absolute top-8 right-0 w-36 shadow-lg rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-white z-10">
                                {fontOptions.map((font, index) => (
                                    <div
                                        key={index}
                                        className={`p-2 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white cursor-pointer ${selectedFont.name === font.name ? 'text-purple-500 font-bold' : ''
                                            }`}
                                        onClick={() => selectFont(font)}
                                    >
                                        {font.name}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {mounted && (
                        <div className="flex items-center">
                            <div
                                className="w-10 h-6 relative rounded-full bg-gray-200 dark:bg-gray-600 cursor-pointer"
                                onClick={() => setIsDarkMode()} 
                            >
                                <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full transition-transform ${isDarkMode ? 'transform translate-x-4 bg-purple-400' : 'bg-white'}`}></div>
                            </div>
                            <span className="ml-2">{isDarkMode ? '🌙' : '☀️'}</span>
                        </div>
                    )}
                </div>
  )
}

export default Header;