import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './i18n'
import { ProductionService } from './services/productionService'

// Initialize production monitoring
ProductionService.initializeMonitoring()

createRoot(document.getElementById("root")!).render(<App />);
