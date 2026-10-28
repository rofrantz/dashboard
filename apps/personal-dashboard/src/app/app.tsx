import { Navigate, Route, Routes } from 'react-router-dom';
import { Home } from './home/home';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="/home" element={<Home />} />
    </Routes>
  );
}
