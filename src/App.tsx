import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './app/store';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { useAuth } from './hooks/useAuth';
import { useAppSelector } from './hooks/useRedux';

const AppRoutes: React.FC = () => {
  useAuth(); // Setup auth listener
  const { user } = useAppSelector(state => state.auth);
  
  return (
    <Routes>
      <Route 
        path="/" 
        element={user ? <Dashboard /> : <Navigate to="/login" />} 
      />
      <Route 
        path="/login" 
        element={user ? <Navigate to="/" /> : <Login />} 
      />
    </Routes>
  );
};

function App() {
  return (
    <Provider store={store}>
      <ChakraProvider>
        <Router>
          <AppRoutes />
        </Router>
      </ChakraProvider>
    </Provider>
  );
}

export default App;