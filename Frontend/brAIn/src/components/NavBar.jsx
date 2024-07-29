import { Link, useNavigate } from 'react-router-dom';
import './NavBar.css'; // CSS 파일을 사용하여 스타일링
import { Button } from '@mui/material';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import axios from 'axios'; // axios를 import
import Cookies from 'js-cookie';
import { useSelector, useDispatch } from 'react-redux'; // useSelector와 useDispatch import
import { logout, login } from '../features/auth/authSlice';
import { useEffect } from 'react';

const NavBar = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Redux store에서 로그인 상태를 가져옵니다.
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const user = useSelector((state) => state.auth.user);

    // Load the authentication state from localStorage and update Redux store
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        const accessToken = localStorage.getItem('accessToken');
        
        if (storedUser && accessToken) {
            dispatch(login(storedUser));
        }
    }, [dispatch]);

    const handleStartClick = () => {
        navigate('/loginoption');
    };

    const handleLogout = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            const refreshToken = Cookies.get('refreshToken');
            await axios.post('http://localhost:8080/api/v1/members/logout', { refreshToken: refreshToken }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            // Redux store에서 로그아웃 상태로 업데이트
            dispatch(logout());

            // 로컬 스토리지와 쿠키에서 인증 정보 삭제
            localStorage.removeItem('accessToken');
            localStorage.removeItem('user');
            Cookies.remove('refreshToken');
            
            // 홈 페이지로 리다이렉트
            navigate('/');
        } catch (error) {
            console.error('로그아웃 실패:', error);
            // 로그아웃 실패 시 사용자에게 피드백을 줄 수 있습니다.
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
                    onClick: () => {} // 취소 시 아무 동작도 하지 않음
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
                {!isAuthenticated ? (
                    <Button
                        variant="contained"
                        color="primary"
                        className="primary" // CSS에서 정의된 클래스
                        onClick={handleStartClick}
                    >
                        brAIn 시작하기
                    </Button>
                ) : (
                    <Button
                        variant="outlined"
                        color="secondary"
                        className="logout" // CSS에서 정의된 클래스
                        onClick={confirmLogout}
                    >
                        로그아웃
                    </Button>
                )}
            </div>
        </nav>
    );
};

export default NavBar;