import logo from './logo.svg';
import './App.css';
import { Box } from '@chakra-ui/react';
import {BrowserRouter as Router ,Routes,Route} from 'react-router-dom';
import {SignUp} from './SignUp';
function App() {
  return (
<Router>
  <Routes>
    <Route path='/:code' Component={SignUp} />
  </Routes>
</Router>
  );
}

export default App;
