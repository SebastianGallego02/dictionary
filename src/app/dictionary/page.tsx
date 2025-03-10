'use client';
import React, { useState, useEffect } from 'react';
import {
    Phonetic, Definition, Meaning, DictionaryApiResponse,
    FormattedDefinitions, DictionaryEntryProps
} from "./interfaces";
import { fonts } from '../ui/fonts';

import { setDictionaryApiResponse } from "../../redux/features/dictionarySlice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";

import { useGetWordQuery } from "../../redux/services/dictionaryApi";
import { formatApiResponse } from '../lib/functions';

// Tipos para las fuentes
type FontOption = {
    name: string;
    className: string;
};

const DictionaryEntry = () => {
    const [isDarkMode, setIsDarkMode] = useState<boolean | null>(false);
    const [mounted, setMounted] = useState(false);
    const [searchTerm, setSearchTerm] = useState("keyboard");
    const [dictionaryData, setDictionaryData] = useState<DictionaryEntryProps | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [audioUrl, setAudioUrl] = useState("");
    const [fontDropdownOpen, setFontDropdownOpen] = useState(false);
    
    // Estado para la fuente seleccionada
    const [selectedFont, setSelectedFont] = useState<FontOption>({
        name: 'Sans Serif',
        className: fonts.roboto.className
    });
    
    // Opciones de fuentes disponibles
    const fontOptions: FontOption[] = [
        { name: 'Sans Serif', className: fonts.roboto.className },
        { name: 'Serif', className: fonts.notoSerif.className },
        { name: 'Mono', className: fonts.spaceMono.className },
    ];

    const dispatch = useAppDispatch();
    const dictionaryApiResponse = useAppSelector(state => state.dictionaryReducer.DictionaryApiResponse);

    const { isFetching, data } = useGetWordQuery({word: searchTerm}); 
    
    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted) {
            if(data){
                const formattedData = formatApiResponse(data[0], setAudioUrl);
                setDictionaryData(formattedData);
            }
        }
    }, [mounted, data, searchTerm]);

    const playAudio = () => {
        if (dictionaryData && audioUrl) {
            const audio = new Audio(audioUrl);
            audio.play().catch(err => {
                console.error("Error reproduciendo audio:", err);
                setError("No se pudo reproducir el audio");
            });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
    };
    
    // Función para seleccionar una fuente
    const selectFont = (font: FontOption) => {
        setSelectedFont(font);
        setFontDropdownOpen(false);
    };

    // Determinar las clases según el tema
    const themeClass = !mounted ? '' : isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-800';
    const inputThemeClass = !mounted ? '' : isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-800';
    const dropdownThemeClass = !mounted ? '' : isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800';

    if (!mounted) {
        return <div className="max-w-md mx-auto p-4 font-serif">Cargando...</div>;
    }

    return (
        <div className={`w-full flex justify-center items-center p-4 ${selectedFont.className} ${themeClass}`}>
            <div className="max-w-md w-full">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <button className="p-2 border border-gray-300 rounded">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                        <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
                    </svg>
                </button>

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
                        <div className={`absolute top-8 right-0 w-36 shadow-lg rounded-md ${dropdownThemeClass} z-10`}>
                            {fontOptions.map((font, index) => (
                                <div 
                                    key={index} 
                                    className={`p-2 hover:bg-gray-100 hover:text-gray-900 cursor-pointer ${
                                        selectedFont.name === font.name ? 'text-purple-500 font-bold' : ''
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
                            className="w-10 h-6 relative rounded-full bg-gray-200 cursor-pointer"
                            onClick={() => setIsDarkMode(!isDarkMode)}
                        >
                            <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full transition-transform ${isDarkMode ? 'transform translate-x-4 bg-purple-400' : 'bg-white'}`}></div>
                        </div>
                        <span className="ml-2">{isDarkMode ? '🌙' : '☀️'}</span>
                    </div>
                )}
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSubmit} className="relative mb-6">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`w-full py-3 px-4 rounded-full ${inputThemeClass}`}
                    placeholder="Buscar palabra..."
                />
                <button type="submit" className="absolute right-4 top-3 text-purple-500">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                </button>
            </form>

            {/* Estados de carga y error */}
            {isLoading && (
                <div className="text-center py-8">
                    <p>Cargando...</p>
                </div>
            )}

            {error && (
                <div className="text-center py-8 text-red-500">
                    <p>{error}</p>
                    <p className="mt-2">Intenta con otra palabra</p>
                </div>
            )}

            {/* Word Definition Section */}
            {!isLoading && !error && dictionaryData && (
                <div>
                    <h1 className="text-3xl font-bold mb-1">{dictionaryData.word}</h1>
                    <div className="flex items-center mb-6">
                        <p className="text-purple-500">{dictionaryData.pronunciation}</p>
                        <button 
                            className="ml-auto p-2 bg-purple-100 text-purple-500 rounded-full cursor-pointer" 
                            onClick={playAudio}
                            disabled={!audioUrl}
                            title={audioUrl ? "Reproducir pronunciación" : "No hay audio disponible"}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                                <polygon points="5 3 19 12 5 21 5 3"></polygon>
                            </svg>
                        </button>
                    </div>

                    {/* Noun Section */}
                    {dictionaryData.definitions.noun.length > 0 && (
                        <div className="mb-6">
                            <p className="italic mb-3">noun</p>
                            <p className="text-gray-500 mb-2">Meaning</p>
                            <ul className="list-disc pl-6 space-y-4">
                                {dictionaryData.definitions.noun.map((def, index) => (
                                    <li key={`noun-${index}`} className="text-sm">{def}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Synonyms */}
                    {dictionaryData.synonyms.length > 0 && (
                        <div className="mb-6">
                            <span className="text-gray-500">Synonyms</span>
                            <div className="flex flex-wrap gap-2 mt-1">
                                {dictionaryData.synonyms.map((synonym, index) => (
                                    <span key={`syn-${index}`} className="text-purple-500 hover:underline cursor-pointer" onClick={() => setSearchTerm(synonym)}>
                                        {synonym}
                                    </span> 
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Verb Section */}
                    {dictionaryData.definitions.verb.length > 0 && (
                        <div className="mb-6">
                            <p className="italic mb-3">verb</p>
                            <p className="text-gray-500 mb-2">Meaning</p>
                            <ul className="list-disc pl-6">
                                {dictionaryData.definitions.verb.map((def, index) => (
                                    <li key={`verb-${index}`} className="text-sm">{def}</li>
                                ))}
                            </ul>
                            {dictionaryData.definitions.example && (
                                <p className="text-sm mt-4 pl-6 italic">"{dictionaryData.definitions.example}"</p>
                            )}
                        </div>
                    )}

                    {/* Source */}
                    {dictionaryData.source.url && (
                        <div className="mt-8 pt-4 border-t border-gray-200">
                            <p className="text-gray-500 text-sm">Source</p>
                            <a href={dictionaryData.source.url} className="text-sm underline break-all" target="_blank" rel="noopener noreferrer">
                                {dictionaryData.source.url}
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3 inline-block ml-1">
                                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                    <polyline points="15 3 21 3 21 9"></polyline>
                                    <line x1="10" y1="14" x2="21" y2="3"></line>
                                </svg>
                            </a>
                        </div>
                    )}
                </div>
            )}
        </div>
        </div>
    );
};

const DictionaryPage: React.FC = () => {
    return <DictionaryEntry />;
};

export default DictionaryPage;