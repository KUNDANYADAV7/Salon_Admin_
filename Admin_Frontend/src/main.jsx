import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import {AuthProvider} from './context/AuthProvider'
import { BlogProvider } from './context/BlogContext';
import { MenProvider } from './context/MenContext';
import { WomenProvider } from './context/WomenContext';
import { CertProvider } from './context/CertProvider';
import { OfferProvider } from './context/OfferContext';

createRoot(document.getElementById('root')).render(
    <AuthProvider>
    <BlogProvider>
      <MenProvider>
        <WomenProvider>
          <CertProvider>
          <OfferProvider>
                <App />
          </OfferProvider>
      </CertProvider>
      </WomenProvider>
      </MenProvider>   
    </BlogProvider>
    </AuthProvider>
);
