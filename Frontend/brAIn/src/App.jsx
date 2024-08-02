// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import './App.css';

import Home from './pages/Home/Home'; // Home 페이지 추가
import LoginOption from './pages/User/LoginOption';
// import OAuthRedirect from './pages/OAuthRedirect'; // OAuth 리다이렉트 핸들러 추가
import Profile from './pages/Profile/Profile';
import NavBar from './components/Navbar/NavBar'
function App() {
    return (
        <div className="App">
            <NavBar />
            <div className="content">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/loginoption" element={<LoginOption />} />
                    {/* <Route path="/oauth/redirect" element={<OAuthRedirect />} /> */}
                    <Route path="/profile" element={<Profile />} />
                    {/*<Route path="/conferences/:roomUrl" element={<Conferences />} />*/}
                </Routes>
            </div>
        </div>
    );
}

export default App;
