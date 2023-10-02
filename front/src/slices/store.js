import { configureStore } from "@reduxjs/toolkit";
import userReducer from './userSlice'
import articlesReducer from './articleSlice'

const store = configureStore({
    reducer: {
        user: userReducer,
        articles: articlesReducer,
    }
})

export default store