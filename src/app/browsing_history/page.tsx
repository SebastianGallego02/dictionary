'use client';
import React from 'react';
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { clearHistory } from "../../redux/features/historySlice";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { fonts } from '../ui/fonts';
import { RiArrowLeftLine } from "react-icons/ri";

const BrowsingHistory = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { searchHistory } = useAppSelector(state => state.historyReducer);
    
    const formatDate = (timestamp: number) => {
        return new Date(timestamp).toLocaleString();
    };
    
    const handleClearHistory = () => {
        if (window.confirm('¿Estás seguro de que deseas borrar todo el historial de búsqueda?')) {
            dispatch(clearHistory());
        }
    };
    
    const handleWordClick = (word: string) => {
        router.push(`/?word=${word}`);
    };
    
    return (
        <div className={`w-full flex justify-center h-dvh items-start p-4 ${fonts.roboto.className} bg-white text-gray-800`}>
            <div className="max-w-md w-full mt-5">
                <div className="flex justify-between items-center mb-6">
                    <Link href="/dictionary" className="flex items-center text-gray-700 hover:text-purple-500">
                        <RiArrowLeftLine className="mr-2" />
                        Volver al diccionario
                    </Link>
                    
                    {searchHistory.length > 0 && (
                        <button 
                            onClick={handleClearHistory}
                            className="text-red-500 text-sm hover:underline"
                        >
                            Borrar historial
                        </button>
                    )}
                </div>
                
                <h1 className="text-2xl font-bold mb-6">Historial de búsqueda</h1>
                
                {searchHistory.length === 0 ? (
                    <div className="text-center py-10 text-gray-500">
                        <p>No hay búsquedas en el historial</p>
                    </div>
                ) : (
                    <ul className="divide-y divide-gray-200">
                        {searchHistory.map((item, index) => (
                            <li 
                                key={`${item.word}-${index}`} 
                                className="py-3 cursor-pointer hover:bg-gray-50"
                                onClick={() => handleWordClick(item.word)}
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-purple-500 font-medium">{item.word}</span>
                                    <span className="text-xs text-gray-400">{formatDate(item.timestamp)}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default BrowsingHistory;