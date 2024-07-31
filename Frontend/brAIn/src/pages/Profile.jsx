import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Button from '../components/Button/Button';
import axios from '../utils/Axios';
import ResetPasswordModal from '../components/ResetPasswordModal';
import ProfileImageModal from '../components/ProfileImageModal';
import './Profile.css';
import { logout } from '../features/auth/authSlice';

const Profile = () => {
    const [userData, setUserData] = useState(null);
    const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);
    const [isProfileImageModalOpen, setIsProfileImageModalOpen] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { accessToken } = useSelector((state) => state.auth);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                if (accessToken) {
                    const response = await axios.get('http://localhost:8080/api/v1/members/member', {
                        headers: {
                            Authorization: `Bearer ${accessToken}`
                        }
                    });
                    setUserData(response.data.member);
                    console.log('User data fetched:', response.data.member);
                } else {
                    console.log('No access token found.');
                }
            } catch (error) {
                console.error('Failed to fetch user data:', error);
            }
        };

        fetchUserData();
    }, [accessToken]);

    const handleEditProfileImage = async (file) => {
        const formData = new FormData();
        formData.append('file', file); // 서버에서 예상하는 키와 일치시킵니다.

        try {
            const response = await axios.put('http://localhost:8080/api/v1/members/updatePhoto', formData, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });

            // 즉시 업데이트된 이미지를 반영
            const updatedPhotoUrl = URL.createObjectURL(file);
            setUserData(prevData => ({
                ...prevData,
                photo: updatedPhotoUrl
            }));

            console.log('Profile image updated:', response.data);
            navigate('/profile'); // 이미지 변경 후 /profile로 리디렉션
            
        } catch (error) {
            console.error('Failed to update profile image:', error);
        } finally {
            setIsProfileImageModalOpen(false);
        }
    };

    const handleChangePassword = () => {
        setIsResetPasswordModalOpen(true);
    };

    const handleDeleteAccount = async () => {
        try {
            await axios.delete('http://localhost:8080/api/v1/members/member', {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });

            dispatch(logout());
            navigate('/');
        } catch (error) {
            console.error('Failed to delete account:', error);
        }
    };

    const handleGoHome = () => {
        navigate('/');
    };

    const isAnyModalOpen = isProfileImageModalOpen || isResetPasswordModalOpen;

    if (!userData) {
        return <div>Loading...</div>;
    }

    return (
        <div className="profile-container">
            <h1>프로필 재설정</h1>
            <div className="profile-details">
                <div className="profile-image-container">
                    <img
                        src={userData.photo || 'images/default-profile.png'}
                        alt="Profile"
                        className="profile-image"
                    />
                    {!isAnyModalOpen && (
                        <button 
                            onClick={() => setIsProfileImageModalOpen(true)} 
                            className="profile-image-button"
                        >
                            <img src="images/edit.jfif" alt="edit" />
                        </button>
                    )}
                </div>
                <div className="profile-info">
                    <h2 className='profile-name'>{userData.name}</h2>
                    <h3 className="profile-email">Email: {userData.email}</h3>
                </div>
                <div className="profile-actions">
                    <Button onClick={handleChangePassword}>비밀번호 변경</Button>
                    <Button 
                        variant="outlined"
                        color="secondary"
                        onClick={handleDeleteAccount}
                    >
                        회원 탈퇴
                    </Button>
                    <Button onClick={handleGoHome}>홈으로 돌아가기</Button>
                </div>
            </div>

            <ProfileImageModal
                isOpen={isProfileImageModalOpen}
                onRequestClose={() => setIsProfileImageModalOpen(false)}
                onSave={handleEditProfileImage}
                currentPhoto={userData.photo}  // Pass current photo URL
            />

            <ResetPasswordModal
                isOpen={isResetPasswordModalOpen}
                onRequestClose={() => setIsResetPasswordModalOpen(false)}
            />
        </div>
    );
};

export default Profile;
