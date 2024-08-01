import { Link, useNavigate } from 'react-router-dom';
import './NavBar.css'; // CSS 파일을 사용하여 스타일링
import { Avatar, Popover, Box } from '@mui/material';
import Button from './Button/Button';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import axios from 'axios'; // axios를 import
import Cookies from 'js-cookie';
import { useSelector, useDispatch } from 'react-redux'; // useSelector와 useDispatch import
import { logout } from '../features/auth/authSlice';
import { useState } from 'react';

const NavBar = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Popover 상태와 핸들러
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const id = open ? 'profile-popover' : undefined;
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    // Redux store에서 로그인 상태와 사용자 정보를 가져옵니다.
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const user = useSelector((state) => state.auth.user);

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
        }
    };

    const confirmLogout = () => {
        handleClose();
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

    const handleProfileUpdate = async () => {
        navigate('/profile');
        handleClose();
    };

    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <Link to="/">
                    <img className="logo-img" src="images/brAIn_2.png" alt="brAIn" />
                    BrAIn
                </Link>
            </div>
            <div className="navbar-links">
                {!isAuthenticated ? (
                    <Button
                        type="fit"
                        buttonStyle="orange"
                        className="button-primary"
                        onClick={handleStartClick}
                        ariaLabel="Start BrAIn"
                    >
                        BrAIn 시작하기
                    </Button>
                ) : (
                    <div className='profile-container'>
                        <Avatar
                            src={user?.photo || ""}
                            alt="Profile"
                            onClick={handleClick}
                            className="profile-avatar" // Apply the profile-avatar class
                        />
                        <Popover
                            id={id}
                            open={open}
                            anchorEl={anchorEl}
                            onClose={handleClose}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'center',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'center',
                            }}
                        >
                            <Box className="modal-content">
                                <div className="profile-info">
                                    <Avatar src={user?.photo || ""} alt="Profile" className="profile-img-large" />
                                    <p>{user?.name}</p>
                                    <p>{user?.email}</p>
                                </div>
                                <Button
                                    type="fit"
                                    buttonStyle="green"
                                    onClick={handleProfileUpdate}
                                    className="button-profile-update"
                                    ariaLabel="Update Profile"
                                >
                                    회원정보수정
                                </Button>
                                <Button
                                    type="fit"
                                    buttonStyle="red"
                                    onClick={confirmLogout}
                                    className="button-logout"
                                    ariaLabel="Logout"
                                >
                                    로그아웃
                                </Button>
                            </Box>
                        </Popover>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default NavBar;
