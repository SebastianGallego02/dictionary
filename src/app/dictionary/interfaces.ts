export interface Phonetic {
    text: string;
    audio?: string;
}

export interface Definition {
    definition: string;
    example?: string;
    synonyms: string[];
    antonyms: string[];
}

export interface Meaning {
    partOfSpeech: string;
    definitions: Definition[];
    synonyms: string[];
    antonyms: string[];
}

export interface DictionaryApiResponse {
    word: string;
    phonetic?: string;
    phonetics: Phonetic[];
    meanings: Meaning[];
    sourceUrls: string[];
}

export interface FormattedDefinitions {
    noun: string[];
    verb: string[];
    example: string;
}

export interface DictionaryEntryProps {
    word: string;
    pronunciation: string;
    definitions: FormattedDefinitions;
    synonyms: string[];
    source: {
        url: string;
    };
}