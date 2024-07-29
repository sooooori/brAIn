
import { Routes, Route } from 'react-router-dom';
import './App.css';
import NavBar from './components/NavBar';
import Home from './pages/Home'; // Home page added
import LoginOption from './pages/LoginOption';
import OAuthRedirect from './components/OAuthRedirect'; // OAuth 리다이렉트 핸들러 추가

function App() {
    return (
        <div className="App">
            <NavBar />
            <div className="content">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/loginoption" element = {<LoginOption />} />
                    <Route path="/oauth/redirect" element={<OAuthRedirect />} />
                </Routes>
            </div>
        </div>
    );
}

export default App;
