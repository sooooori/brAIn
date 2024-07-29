import { Link, useNavigate } from 'react-router-dom';
import './NavBar.css'; // CSS 파일을 사용하여 스타일링
import { Button } from '@mui/material';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import axios from 'axios'; // axios를 import
import Cookies from 'js-cookie';

const NavBar = () => {
    const navigate = useNavigate();

    const handleStartClick = () => {
        navigate('/loginoption');
    };

    // 로그인 상태를 확인하는 함수
    const isLoggedIn = () => {
        // Access Token이 localStorage에 저장되어 있으면 로그인된 상태로 간주
        return localStorage.getItem('accessToken') !== null;
    };

    const handleLogout = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            const refreshToken = Cookies.get('refreshToken');
            await axios.post('http://localhost:8080/api/v1/members/logout', {refreshToken: refreshToken}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            // 로컬 스토리지에서 accessToken 삭제
            localStorage.removeItem('accessToken');
            localStorage.removeItem('accessTokenExpiration');
            Cookies.remove('refreshToken');

            // 홈 페이지로 리다이렉트
            navigate('/');
        } catch (error) {
            console.error('Logout failed', error);
            // 로그아웃 실패 시 처리할 로직을 추가할 수 있습니다.
        }
    };

    const confirmLogout = () => {
        confirmAlert({
            title: '로그아웃 확인',
            message: '정말 로그아웃 하시겠습니까?',
            buttons: [
                {
                    label: '로그아웃',
                    onClick: () => handleLogout()
                },
                {
                    label: '취소',
                    onClick: () => {}
                }
            ]
        });
    };

    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <Link to="/">
                    <img className="logo-img" src="images/brAIn_2.png" alt="brAIn" />
                    brAIn
                </Link>
            </div>
            <div className="navbar-links">
                <Button 
                    variant="contained" 
                    color="primary" 
                    className="primary" 
                    onClick={handleStartClick}
                >
                    brAIn 시작하기
                </Button>

                {isLoggedIn() && (
                    <Button
                        variant="outlined"
                        color="secondary"
                        className="logout" // css - 로그아웃 버튼에 logout 클래스 추가
                        onClick={confirmLogout} // 로그아웃 버튼 클릭 시 confirmLogout 호출
                    >
                        로그아웃
                    </Button>
                )}
            </div>
        </nav>
    );
};

export default NavBar;
