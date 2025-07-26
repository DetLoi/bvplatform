import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

import './styles/fonts.css';
import './styles/base.css';
import './styles/components.css';
import './styles/pages/home.css';
import './styles/pages/moves.css';
import './styles/pages/badges.css';
import './styles/pages/events.css';
import './styles/pages/battles.css';
import './styles/pages/breaker-profile.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
