import { BrowserRouter } from "react-router-dom";
import { Provider } from 'react-redux';
import { createRoot } from 'react-dom/client';
import { PersistGate } from 'redux-persist/integration/react';

import { store, persistor } from './store';
import App from "./App";

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
    <BrowserRouter>
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <App />
            </PersistGate>
        </Provider>
    </BrowserRouter>);