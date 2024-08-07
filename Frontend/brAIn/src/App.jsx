import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import './App.css';

import Home from './pages/Home/Home'; // Home 페이지 추가
import LoginOption from './pages/User/LoginOption';
import Profile from './pages/Profile/Profile';
import Conference from './pages/Conference/Conference';
import AuthCallback from './pages/User/AuthCallback';

import NavBar from './components/Navbar/NavBar';
import ConferenceNavbar from './components/Navbar/ConferenceNavbar';

function App() {
    const location = useLocation();
    const isConferenceRoute = location.pathname.startsWith('/conferences');

    return (
        <div className="App">
            {isConferenceRoute ? <ConferenceNavbar /> : <NavBar />}
            <div className="content">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/loginoption" element={<LoginOption />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/conferences/:secureId" element={<Conference />} />
                    <Route path="/kakao-redirect" element={<AuthCallback />} />
                    <Route path="/google-redirect" element={<AuthCallback />} />
                </Routes>
            </div>
        </div>
    );
}

export default App;

