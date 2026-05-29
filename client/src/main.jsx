import { createRoot } from 'react-dom/client';
import { Toaster } from 'sonner';
import { BrowserRouter as Router } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';

import GolobalStyles from '~/components/GlobalStyles';

import App from './App.jsx';

createRoot(document.getElementById('root')).render(
    <>
        <link rel="stylesheet" href="https://pro.fontawesome.com/releases/v5.10.0/css/all.css" integrity="sha384-AYmEC3Yw5cVb3ZcuHtOA93w35dYTsvhLPVnYs9eStHfGJvOvKxVfELGroGkvsg+p" crossorigin="anonymous"/>
        <Toaster richColors />
        <Router>
            <GolobalStyles>
                <App />
            </GolobalStyles>
        </Router>
    </>
);
