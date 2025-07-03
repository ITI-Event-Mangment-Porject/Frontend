import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import './App.css';
import Messenger from './components/student/MessageBot';

function App() {
  return (
    <Router>
      <AppRoutes />
      <Messenger />
    </Router>
  );
}

export default App;
