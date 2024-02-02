import { configureStore } from '@reduxjs/toolkit'
import userDataSlice from './userData/userDataSlice'
import adminLoggedSlice from './adminLogged/adminLoggedSlice';

import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
    key: 'root',
    storage,
};

const persistedReducer = persistReducer(persistConfig, userDataSlice);
const adminPersistReducer =persistReducer(persistConfig, adminLoggedSlice)


const store = configureStore({
    reducer: {
        userData:persistedReducer,
        adminLogged:adminPersistReducer
    }
})

const persistor = persistStore(store);


export  {store,persistor}