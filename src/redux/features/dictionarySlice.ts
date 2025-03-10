import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
    Phonetic, Definition, Meaning, DictionaryApiResponse,
    FormattedDefinitions, DictionaryEntryProps
} from "../../app/dictionary/interfaces";


export const dictionarySlice = createSlice({
    name: "dictionary",
    initialState: {
        DictionaryApiResponse: [] as DictionaryApiResponse[],
    },
    reducers: {
        setDictionaryApiResponse: (state, action) => {
            state.DictionaryApiResponse = action.payload;
        },
    },
});

export const {
    setDictionaryApiResponse,
  } = dictionarySlice.actions;

export default dictionarySlice.reducer;