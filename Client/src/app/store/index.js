// src/app/store/index.js
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { baseApi } from '../../shared/services/baseApi';
import rootReducer from './rootReducer';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['checkout', 'cart', 'auth'], // Persist checkout, cart, and auth
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // Ignore non-serializable values in RTK Query internal state and redux-persist actions
      serializableCheck: {
        ignoredActions: [
          'api/executeQuery/fulfilled',
          'api/executeQuery/pending',
          'api/executeMutation/fulfilled',
          FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER
        ],
      },
    }).concat(baseApi.middleware),
  devTools: __DEV__,
});

export const persistor = persistStore(store);
