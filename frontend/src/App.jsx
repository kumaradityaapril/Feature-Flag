import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import FeatureFlags from './pages/FeatureFlags';
import Evaluator from './pages/Evaluator';
import CreateFlag from './pages/CreateFlag';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="flags" element={<FeatureFlags />} />
        <Route path="evaluator" element={<Evaluator />} />
        <Route path="create" element={<CreateFlag />} />
      </Route>
    </Routes>
  );
}

export default App;
