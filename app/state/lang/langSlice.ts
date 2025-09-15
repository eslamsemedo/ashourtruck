import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type SupportedLanguageCode = 'en' | 'ar'

export type LanguageState = {
  code: SupportedLanguageCode
}

const initialState: LanguageState = {
  code: 'en',
}

const langSlice = createSlice({
  name: 'lang',
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<SupportedLanguageCode>) => {
      state.code = action.payload
    },
    toggleLanguage: (state) => {
      state.code = state.code === 'en' ? 'ar' : 'en'
    },
  },
})

export const { setLanguage, toggleLanguage } = langSlice.actions
export default langSlice.reducer


