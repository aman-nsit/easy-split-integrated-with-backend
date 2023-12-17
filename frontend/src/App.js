import {BrowserRouter , Route , Routes , Link} from 'react-router-dom';
import SignupPage from './components/SignupPage';
import LoginPage from './components/LoginPage';
import LogoutPage from './components/LogoutPage';
import Home from './components/Home';
import RequireAuth from './components/RequireAuth';
import Header from "./components/Header"
import Normal from './components/Normal';
import './App.css' ;
function App() {

  return (
    <div className='App'>
      <Header />
      <BrowserRouter>
        <Routes>
          <Route index element={
            <RequireAuth>
              <Home /> 
             </RequireAuth>
          } />
          <Route path="/normalSplit" element = {<Normal />} />
          <Route path="/users/signup" element = {<SignupPage />} />
          <Route path="/users/login" element = {<LoginPage />} />
          <Route path="/users/logout" element = {<LogoutPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
