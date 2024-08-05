// src/App.jsx
import { Router, Route, Routes} from 'react-router-dom';
import './App.css';

import Home from './pages/Home/Home'; // Home 페이지 추가
import LoginOption from './pages/User/LoginOption';
// import OAuthRedirect from './pages/OAuthRedirect'; // OAuth 리다이렉트 핸들러 추가
import Profile from './pages/Profile/Profile';
import NavBar from './components/Navbar/NavBar'
import Conference from './pages/Conference/Conference'
import AuthCallback from './pages/User/AuthCallback';
import MemberList from './pages/Conference/components/MemberList';

function App() {
    return (
        <div className="App">
            <NavBar />
            <div className="content">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/loginoption" element={<LoginOption />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/conferences/:secureId" element={<Conference />} />
                    <Route path="/kakao-redirect" element={<AuthCallback />} />
                    <Route path="/google-redirect" element={<AuthCallback />} />

                    {/* test */}
                    <Route path="/test" element={<MemberList />} />
                </Routes>
            </div>
        </div>
    );
}

export default App;
