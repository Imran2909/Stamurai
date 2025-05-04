// src/app/redux/ReduxProvider.js
'use client'; // This is important

import { Provider } from 'react-redux';
import store from './store';

export default function ReduxProvider({ children }) {
  return <Provider store={store}>{children}</Provider>;
}
