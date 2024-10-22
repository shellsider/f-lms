// authStore.js

import { configureStore, createSlice } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import createWebStorage from 'redux-persist/lib/storage/createWebStorage';
import { readable } from 'svelte/store';

// Create a noop storage for SSR
function createNoopStorage() {
  return {
    getItem() {
      return Promise.resolve(null);
    },
    setItem() {
      return Promise.resolve();
    },
    removeItem() {
      return Promise.resolve();
    },
  };
}

// Determine storage based on environment
const createPersistStorage = () => {
  if (typeof window !== 'undefined') {
    // Client-side: use localStorage
    return createWebStorage('local');
  } else {
    // Server-side: use noop storage
    return createNoopStorage();
  }
};

const storage = createPersistStorage();

// Persist configuration
const persistConfig = {
  key: 'auth',
  storage,
};

// Create the auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    idToken: null,
    refreshToken: null,
    isAuthenticated: false,
    expiresIn: null,
    username: null
  },
  reducers: {
    setAuth(state, action) {
      state.idToken = action.payload.idToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
      state.expiresIn = action.payload.expiresIn;
      state.username = action.payload.username;
    },
    clearAuth(state) {
      state.idToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.expiresIn = null;
      state.username = null;
    },
  },
});

// Extract actions
const { setAuth, clearAuth } = authSlice.actions;

// Apply persistReducer
const persistedReducer = persistReducer(persistConfig, authSlice.reducer);

// Create the Redux store
const store = configureStore({
  reducer: {
    auth: persistedReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable serializable checks for redux-persist
    }),
});

// Create the persistor
const persistor = persistStore(store);

// Create Svelte-readable stores for auth state
function createReadableStore(selector) {
  return readable(selector(store.getState()), (set) => {
    const unsubscribe = store.subscribe(() => {
      set(selector(store.getState()));
    });
    return unsubscribe;
  });
}

const isAuthenticated = createReadableStore((state) => state.auth.isAuthenticated);
const idToken = createReadableStore((state) => state.auth.idToken);
const refreshToken = createReadableStore((state) => state.auth.refreshToken);
const expiresIn = createReadableStore((state) => state.auth.expiresIn);
const username = createReadableStore((state) => state.auth.username);

// Export the store, actions, and readable stores
export {
  store,
  persistor,
  setAuth,
  clearAuth,
  isAuthenticated,
  idToken,
  refreshToken,
  expiresIn,
  username,
};
