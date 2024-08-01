import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Modal from 'react-modal';
import Button from '../../components/Button/Button'
import axios from '../../utils/Axios';
import ResetPasswordCompletionModal from './components/ResetPasswordCompletionModal';
import ProfileImageModal from './components/ProfileImageModal';
import './Profile.css';
import { logout, updateUser } from '../../features/auth/authSlice';

const Profile = () => {
    const [isProfileImageModalOpen, setIsProfileImageModalOpen] = useState(false);
    const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] = useState(false);
    const [isResetPasswordCompletionModalOpen, setIsResetPasswordCompletionModalOpen] = useState(false);
    const [deletePassword, setDeletePassword] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Redux에서 사용자 정보와 액세스 토큰 가져오기
    const { user, accessToken } = useSelector((state) => ({
        user: state.auth.user,
        accessToken: state.auth.accessToken
    }));

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                if (accessToken && !user) {  // 리덕스 상태에 사용자 정보가 없을 때만 호출
                    const response = await axios.get('http://localhost:8080/api/v1/members/member', {
                        headers: {
                            Authorization: `Bearer ${accessToken}`
                        }
                    });
                    // Redux 상태 업데이트
                    dispatch(updateUser(response.data.member));
                    console.log('User data fetched:', response.data.member);
                }
            } catch (error) {
                console.error('Failed to fetch user data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, [accessToken, user, dispatch]);

    const handleEditProfileImage = async (file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async () => {
            const base64FileData = reader.result.split(',')[1];
            const fileName = file.name;
            const requestBody = {
                fileData: base64FileData,
                fileName: fileName
            };

            try {
                const response = await axios.put('http://localhost:8080/api/v1/members/updatePhoto', requestBody, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                });

                const updatedPhotoUrl = URL.createObjectURL(file);

                // Redux 상태 업데이트
                dispatch(updateUser({ photo: updatedPhotoUrl }));

                console.log('Profile image updated:', response.data);
            } catch (error) {
                console.error('Failed to update profile image:', error);
            } finally {
                setIsProfileImageModalOpen(false);
            }
        };
    };

    const handleChangePassword = () => {
        // Open the Reset Password Completion Modal
        setIsResetPasswordCompletionModalOpen(true);
    };

    const handleDeleteAccount = async () => {
        try {
            // 요청 본문에 비밀번호를 포함
            const response = await axios.delete('http://localhost:8080/api/v1/members/member', {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                },
                data: deletePassword // 비밀번호를 본문에 포함
            });
    
            console.log('Account deleted successfully:', response.data);
    
            dispatch(logout());
            navigate('/');
        } catch (error) {
            console.error('Failed to delete account:', error);
        }
    };

    const handleGoHome = () => {
        navigate('/');
    };

    const isAnyModalOpen = isProfileImageModalOpen || isDeleteAccountModalOpen || isResetPasswordCompletionModalOpen;

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="profile-container">
            <h1>프로필 재설정</h1>
            <div className="profile-details">
                <div className="profile-image-container">
                    <img
                        src={user.photo || 'images/default-profile.png'}
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
                    <h2 className='profile-name'>{user?.name}</h2>
                    <h3 className="profile-email">Email: {user?.email}</h3>
                </div>
                <div className="profile-actions">
                    <Button onClick={handleChangePassword}>비밀번호 변경</Button>
                    <Button 
                        variant="outlined"
                        color="secondary"
                        onClick={() => setIsDeleteAccountModalOpen(true)}
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
                currentPhoto={user?.photo}  // Pass current photo URL
            />

            <ResetPasswordCompletionModal
                isOpen={isResetPasswordCompletionModalOpen}
                onRequestClose={() => setIsResetPasswordCompletionModalOpen(false)}
            />

            <Modal
                isOpen={isDeleteAccountModalOpen}
                onRequestClose={() => setIsDeleteAccountModalOpen(false)}
                contentLabel="Delete Account Modal"
            >
                <h2>정말 탈퇴하시겠습니까?</h2>
                <input
                    type="password"
                    placeholder="비밀번호를 입력해주세요"
                    value={deletePassword}
                    onChange={(e) => setDeletePassword(e.target.value)}
                    required
                />
                <div className="modal-actions">
                    <Button onClick={handleDeleteAccount}>탈퇴</Button>
                    <Button onClick={() => setIsDeleteAccountModalOpen(false)}>취소</Button>
                </div>
            </Modal>
        </div>
    );
};

export default Profile;
