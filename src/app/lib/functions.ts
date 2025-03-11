import React from "react";
import { DictionaryApiResponse, DictionaryEntryProps, FormattedDefinitions } from "../dictionary/interfaces";

export const formatApiResponse = (apiData: DictionaryApiResponse, setAudioUrl: { (value: React.SetStateAction<string>): void; (arg0: string): void; }): DictionaryEntryProps => {
        // Obtener pronunciación
        const pronunciation = apiData.phonetic ||
            apiData.phonetics.find(p => p.text)?.text ||
            "";

        // Obtener audio URL (si existe)
        const audioUrl = apiData.phonetics.find(p => p.audio)?.audio || "";

        setAudioUrl(audioUrl);
        // Formatear definiciones por tipo de palabra
        const formattedDefinitions: FormattedDefinitions = {
            noun: [],
            verb: [],
            example: ""
        };

        let firstExample = "";
        let allSynonyms: string[] = [];

        apiData.meanings.forEach(meaning => {
            // Añadir sinónimos al array
            if (meaning.synonyms && meaning.synonyms.length > 0) {
                allSynonyms = [...allSynonyms, ...meaning.synonyms];
            }

            // Formatear definiciones según el tipo de palabra
            if (meaning.partOfSpeech === "noun") {
                formattedDefinitions.noun = meaning.definitions.map(def => def.definition);

                // Guardar el primer ejemplo encontrado
                if (!firstExample && meaning.definitions.some(def => def.example)) {
                    firstExample = meaning.definitions.find(def => def.example)?.example || "";
                }
            } else if (meaning.partOfSpeech === "verb") {
                formattedDefinitions.verb = meaning.definitions.map(def => def.definition);

                // Si no tenemos ejemplo de sustantivo, intentar con el de verbo
                if (!firstExample && meaning.definitions.some(def => def.example)) {
                    firstExample = meaning.definitions.find(def => def.example)?.example || "";
                }
            }
        });

        formattedDefinitions.example = firstExample;

        return {
            word: apiData.word,
            pronunciation,
            definitions: formattedDefinitions,
            synonyms: allSynonyms.slice(0, 5), // Limitar a 5 sinónimos
            source: {
                url: apiData.sourceUrls[0] || ""
            }
        };
    };
