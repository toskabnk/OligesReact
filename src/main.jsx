import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import {BrowserRouter} from "react-router-dom"
import Providers from './providers/Providers';
import { LicenseInfo } from '@mui/x-license-pro';

import './index.css'

LicenseInfo.setLicenseKey(import.meta.env.VITE_MUI_LICENSE);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Providers>
        <App/>
      </Providers>
    </BrowserRouter>
  </React.StrictMode>
)

