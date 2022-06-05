import '../node_modules/bootstrap/dist/css/bootstrap.css'
import './App.css'
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import "./App.css";
import Scene from "./pages/Scene";
import { Welcome } from './pages/Welcome';
import { Dashboard } from './pages/Dashboard';
import { LoadedScene } from './pages/LoadedScene';
import { LoadedEditorScene } from './pages/LoadedEditorScene';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="scene" element={<Scene />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="scene/:_id" element={<LoadedScene />} />
          <Route path="scene/editor/:_id" element={<LoadedEditorScene />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
