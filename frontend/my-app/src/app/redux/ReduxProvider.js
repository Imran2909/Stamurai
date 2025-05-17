// src/app/redux/ReduxProvider.js
'use client';

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store';


// Wrap your app with Redux Provider and PersistGate
// so Redux state is available and persisted across reloads
export default function ReduxProvider({ children }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}
