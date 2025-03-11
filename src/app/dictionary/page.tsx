'use client';
import React, { useState, useEffect } from 'react';
import { DictionaryEntryProps, FontOption
} from "./interfaces";
import { fonts } from '../ui/fonts';
import { useGetWordQuery } from "../../redux/services/dictionaryApi";
import { formatApiResponse } from '../lib/functions';
import Header from '../ui/Header';
import { useAppDispatch } from '@/src/redux/hooks';
import { addToHistory } from '@/src/redux/features/historySlice';
import Modal from '../ui/Modal';

// Tipos para las fuentes


const DictionaryEntry = () => {
    const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
    const [mounted, setMounted] = useState(false);
    const [searchTerm, setSearchTerm] = useState("keyboard");
    const [dictionaryData, setDictionaryData] = useState<DictionaryEntryProps | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [audioUrl, setAudioUrl] = useState("");
    const [fontDropdownOpen, setFontDropdownOpen] = useState(false);
    const dispatch = useAppDispatch();
    const [currentTerm, setCurrentTerm] = useState("keyboard");
    const [selectedFont, setSelectedFont] = useState<FontOption>({
        name: 'Sans Serif',
        className: fonts.roboto.className
    });
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const openModal = (): void => setIsModalOpen(true);
  const closeModal = (): void => setIsModalOpen(false);
  const fontOptions: FontOption[] = [
        { name: 'Sans Serif', className: fonts.roboto.className },
        { name: 'Serif', className: fonts.notoSerif.className },
        { name: 'Mono', className: fonts.spaceMono.className },
    ];
  const { data, isLoading } = useGetWordQuery({ word: currentTerm });

    useEffect(() => {
          // Detectar preferencia del sistema
          const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
          const prefersDarkMode = darkModeMediaQuery.matches;
          console.log(prefersDarkMode);
          // Comprobar si hay una preferencia guardada
          const savedTheme = localStorage.getItem('theme');
          console.log(savedTheme);
          
          // Establecer el tema inicial
          if (savedTheme === 'dark' || (!savedTheme && prefersDarkMode)) {
              setIsDarkMode(true);
              document.documentElement.classList.add('dark');
          } else {
              setIsDarkMode(false);
              document.documentElement.classList.remove('dark');
          }
  
          // Escuchar cambios en la preferencia del sistema
          const handleChange = (e: MediaQueryListEvent) => {
              // Solo actualizar automáticamente si el usuario no ha establecido una preferencia manual
              if (!localStorage.getItem('theme')) {
                  setIsDarkMode(e.matches);
                  if (e.matches) {
                      document.documentElement.classList.add('dark');
                  } else {
                      document.documentElement.classList.remove('dark');
                  }
              }
          };
  
          darkModeMediaQuery.addEventListener('change', handleChange);


        setMounted(true);

        return () => {
            darkModeMediaQuery.removeEventListener('change', handleChange);
        };
    }, []);

    useEffect(() => {
        if (mounted) {
            if (data ) {
                const formattedData = formatApiResponse(data[0], setAudioUrl);
                setDictionaryData(formattedData);

                dispatch(addToHistory(searchTerm));
            }
        }
    }, [mounted, data, currentTerm, dispatch]);

   const toggleDarkMode = () => {
        const newDarkMode = !isDarkMode;
        setIsDarkMode(newDarkMode);
        
        // Almacenar preferencia del usuario
        localStorage.setItem('theme', newDarkMode ? 'dark' : 'light');
        
        // Actualizar clase en el elemento HTML
        if (newDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

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
        if(searchTerm === "") {
            //alert("Por favor, ingrese una palabra");
            openModal();
            return;
        }
        setCurrentTerm(searchTerm);
        console.log("Buscando:", searchTerm);
    };

    const themeClass = !mounted ? '' : isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-800';
    const inputThemeClass = !mounted ? '' : isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-800';
    const dropdownThemeClass = !mounted ? '' : isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800';

    if (!mounted) {
        return <div className="max-w-md mx-auto p-4 font-serif">Cargando...</div>;
    }

    return (
        <div className={`w-full flex justify-center h-dvh items-start p-4 ${selectedFont.className} ${themeClass}`}>
            <div className="max-w-md w-full mt-5">
                {/* Header */}
                <Header 
                selectedFont={selectedFont} 
                fontDropdownOpen={fontDropdownOpen} 
                dropdownThemeClass={dropdownThemeClass} 
                fontOptions={fontOptions} 
                isDarkMode={isDarkMode}
                mounted={mounted}
                setFontDropdownOpen={setFontDropdownOpen}
                setIsDarkMode={toggleDarkMode}  
                setSelectedFont={setSelectedFont}
                />
        <Modal 
        isOpen={isModalOpen} 
        onClose={closeModal}
        children={null}
        title="Por favor, ingrese una palabra"
        ></Modal>
                {/* Search Bar */}
                <form onSubmit={handleSubmit} className="relative mb-6">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`w-full py-3 px-4 rounded-full ${inputThemeClass}`}
                        placeholder="Buscar palabra..."
                    />
                    <button type="submit" className="absolute right-4 top-3 text-purple-500 cursor-pointer">
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
                                        <span key={`syn-${index}`} className="text-purple-500 hover:underline cursor-pointer" onClick={() => setCurrentTerm(synonym)}>
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