<!-- YourComponent.svelte -->

<script>
    import { onMount } from 'svelte';
    import { readable } from 'svelte/store';
    import { configureStore, createSlice } from '@reduxjs/toolkit';
    import { persistStore, persistReducer } from 'redux-persist';
    import createWebStorage from 'redux-persist/lib/storage/createWebStorage';
  
    // Create a noop storage for server-side rendering
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
  
    // Determine the appropriate storage based on the environment
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
      key: 'Smith',
      storage,
    };
  
    // Create your counter slice
    const counterSlice = createSlice({
      name: 'counter',
      initialState: { value: 0 },
      reducers: {
        increment: (state) => {
          state.value += 1;
        },
        decrement: (state) => {
          state.value -= 1;
        },
      },
    });
  
    // Apply the persistReducer to your counter reducer
    const persistedReducer = persistReducer(persistConfig, counterSlice.reducer);
  
    // Create the Redux store
    const store = configureStore({
      reducer: {
        counter: persistedReducer,
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: false, // Disable serializable checks for redux-persist
        }),
    });
  
    // Create the persistor
    const persistor = persistStore(store);
  
    // Create a Svelte-readable store for the counter value
    const counter = readable(store.getState().counter.value, (set) => {
      const unsubscribe = store.subscribe(() => {
        set(store.getState().counter.value);
      });
      return unsubscribe;
    });
  
    // Create action dispatchers
    const increment = () => store.dispatch(counterSlice.actions.increment());
    const decrement = () => store.dispatch(counterSlice.actions.decrement());
  
    // Rehydration flag to handle asynchronous rehydration
    let rehydrated = false;
  
    // Function to check if the store has rehydrated
    function checkRehydration() {
      const { bootstrapped } = persistor.getState();
      if (bootstrapped) {
        rehydrated = true;
      }
    }
  
    // On component mount, check rehydration status
    onMount(() => {
      if (typeof window !== 'undefined') {
        // Wait for the store to rehydrate
        persistor.persist();
  
        if (persistor.getState().bootstrapped) {
          // Store is already rehydrated
          rehydrated = true;
        } else {
          // Subscribe to the persistor to detect when rehydration completes
          const unsubscribePersistor = persistor.subscribe(() => {
            checkRehydration();
            if (rehydrated) {
              unsubscribePersistor();
            }
          });
        }
      } else {
        // On the server, set rehydrated to true to avoid blocking the render
        rehydrated = true;
      }
    });
  </script>
  
  {#if rehydrated}
    <div>
      <h1>Counter: {$counter}</h1>
  
      <button on:click={increment}>Increment</button>
      <button on:click={decrement}>Decrement</button>
    </div>
  {:else}
    <div>Loading...</div>
  {/if}
  
  <style>
    /* Optional styles */
    div {
      text-align: center;
      margin-top: 50px;
    }
  
    button {
      margin: 5px;
      padding: 10px 20px;
      font-size: 16px;
    }
  </style>
  