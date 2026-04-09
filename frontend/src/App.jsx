import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import FeatureFlags from './pages/FeatureFlags';
import Evaluator from './pages/Evaluator';
import CreateFlag from './pages/CreateFlag';
import Export from './pages/Export';
import Environments from './pages/Environments';
import Documentation from './pages/Documentation';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="flags" element={<FeatureFlags />} />
        <Route path="evaluator" element={<Evaluator />} />
        <Route path="create" element={<CreateFlag />} />
        <Route path="edit/:id" element={<CreateFlag />} />
        <Route path="export" element={<Export />} />
        <Route path="environments" element={<Environments />} />
        <Route path="docs" element={<Documentation />} />
      </Route>
    </Routes>
  );
}

export default App;
