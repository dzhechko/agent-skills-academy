import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Learning from './pages/Learning';
import SectionDetail from './pages/SectionDetail';
import FinalTest from './pages/FinalTest';
import Achievements from './pages/Achievements';
import Help from './pages/Help';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/learning" element={<Learning />} />
          <Route path="/learning/:sectionId" element={<SectionDetail />} />
          <Route path="/final-test" element={<FinalTest />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/help" element={<Help />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
