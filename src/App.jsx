import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import { UserProvider } from './context/UserContext';

export default function App() {

  return (
    <div className="App">
      <UserProvider>
        <Header
        />
        <Outlet
        />
      </UserProvider>
    </div>
  );
}

