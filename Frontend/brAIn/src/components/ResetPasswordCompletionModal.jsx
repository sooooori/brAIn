import React, { useState } from 'react';
import Modal from 'react-modal';
import { Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';  // Import logout action
import axios from 'axios';
import Cookies from 'js-cookie';

// Custom styles for the modal
const customStyles = {
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
    button: {
        marginTop: '10px',
        marginBottom: '10px',
    }
};

const ResetPasswordCompletionModal = ({ isOpen, onRequestClose, newPassword, email }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [errorMessage, setErrorMessage] = useState('');
    const { accessToken } = useSelector((state) => state.auth);
    console.log(email)
    const handlePasswordChange = async () => {
        try {
            await axios.put('http://localhost:8080/api/v1/members/resetPassword', 
                 newPassword ,  // Wrap newPassword in an object
                {  
                    headers: {
                        Authorization: `Bearer ${accessToken}`,  // Pass the access token in the Authorization header
                        'Content-Type': 'application/json'  // Ensure correct content type
                    }
                }
            );
            dispatch(logout());
            localStorage.removeItem('accessToken');
            localStorage.removeItem('user');
            Cookies.remove('refreshToken');
            navigate('/');
        } catch (error) {
            console.error('Password change failed', error);
            setErrorMessage('비밀번호 변경 중 오류가 발생했습니다.');
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Reset Password Completion Modal"
            style={customStyles}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>비밀번호 재설정 완료</h1>
                <Button onClick={onRequestClose} style={{ color: '#000' }}>
                    <CloseIcon />
                </Button>
            </div>
            <Button 
                onClick={handlePasswordChange} 
                variant="contained" 
                color="primary"
                style={customStyles.button}
            >
                확인
            </Button>
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        </Modal>
    );
};

export default ResetPasswordCompletionModal;
