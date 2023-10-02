import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    articles: []
}

export const articleSlice = createSlice({
    name: "articles",
    initialState,
    reducers: {
        loadArticles: (state, action) =>{
            state.articles = action.payload
        }
    }
})


export const { loadArticles } = articleSlice.actions
export const selectArticles = (state) => state.articles
export default articleSlice.reducer