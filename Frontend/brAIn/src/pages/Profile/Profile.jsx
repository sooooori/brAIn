import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Modal from 'react-modal';
import Button from '../../components/Button/Button';
import axios from '../../utils/Axios';
import UpdatePasswordModal from './components/UpdatePasswordModal';
import ProfileImageModal from './components/ProfileImageModal';
import './Profile.css';
import { logout, updateUser } from '../../features/auth/authSlice';
import Cookies from 'js-cookie';

const customModalStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        width: '80%',
        maxWidth: '500px',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
        overflowY: 'auto',
    },
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
};

const Profile = () => {
    const [isProfileImageModalOpen, setIsProfileImageModalOpen] = useState(false);
    const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] = useState(false);
    const [isUpdatePasswordModalOpen, setIsUpdatePasswordModalOpen] = useState(false);
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
                    const response = await axios.get('http://localhost/api/v1/members/member', {
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
                const response = await axios.put('http://localhost/api/v1/members/updatePhoto', requestBody, {
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
        setIsUpdatePasswordModalOpen(true);
    };

    const handleDeleteAccount = async () => {
        try {
            // 요청 본문에 비밀번호를 포함
            const response = await axios.delete('http://localhost/api/v1/members/member', {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                },
                data: { password: deletePassword } // 비밀번호를 본문에 포함
            });

            console.log('Account deleted successfully:', response.data);

            dispatch(logout());
            Cookies.remove('refreshToken');
            navigate('/');
        } catch (error) {
            console.error('Failed to delete account:', error);
        }
    };

    const handleGoHome = () => {
        navigate('/');
    };

    const isAnyModalOpen = isProfileImageModalOpen || isDeleteAccountModalOpen || isUpdatePasswordModalOpen;

    // Determine the class for the profile container based on user type
    const containerClass = user?.type === 'None' ? 'profile-container-default' : 'profile-container-reduced';

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className={`profile-container ${containerClass}`}>
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
                            <img src="images/edit.jpg" alt="edit" />
                        </button>
                    )}
                </div>
                <div className="profile-info">
                    <h2 className='profile-name'>{user?.name}</h2>
                    <h3 className="profile-email">Email: {user?.email}</h3>
                </div>
                <div className="profile-actions">
                    {user?.type === 'None' && (
                        <>
                            <Button onClick={handleChangePassword}>비밀번호 수정하기</Button>
                            <Button 
                                className="profile-exit"
                                onClick={() => setIsDeleteAccountModalOpen(true)}
                            >
                                회원 탈퇴
                            </Button>
                        </>
                    )}
                    <Button onClick={handleGoHome}>홈 화면으로 돌아가기</Button>
                </div>
            </div>

            <ProfileImageModal
                isOpen={isProfileImageModalOpen}
                onRequestClose={() => setIsProfileImageModalOpen(false)}
                onSave={handleEditProfileImage}
                currentPhoto={user?.photo}  // Pass current photo URL
            />

            <UpdatePasswordModal
                isOpen={isUpdatePasswordModalOpen}
                onRequestClose={() => setIsUpdatePasswordModalOpen(false)}
            />

            <Modal
                isOpen={isDeleteAccountModalOpen}
                onRequestClose={() => setIsDeleteAccountModalOpen(false)}
                contentLabel="Delete Account Modal"
                style={customModalStyles}  // Apply custom styles here
            >
                <h2>정말 탈퇴하시겠습니까?</h2>
                <input
                    type="password"
                    placeholder="비밀번호를 입력해주세요"
                    value={deletePassword}
                    onChange={(e) => setDeletePassword(e.target.value)}
                    required
                    className="modal-input"
                />
                <div className="modal-actions">
                    <Button className="modal-button" onClick={handleDeleteAccount}>탈퇴</Button> 
                    <Button className="modal-button" onClick={() => setIsDeleteAccountModalOpen(false)}>취소</Button>
                </div>
            </Modal>
        </div>
    );
};

export default Profile;
