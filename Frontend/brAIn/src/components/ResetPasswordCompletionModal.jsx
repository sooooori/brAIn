import React, { useState } from 'react';
import Modal from 'react-modal';
import { Button, TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';  // Import logout action
import axios from 'axios';

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

const ResetPasswordCompletionModal = ({ isOpen, onRequestClose }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const { accessToken } = useSelector((state) => state.auth);

    const handlePasswordChange = async () => {

        try {
            const response = await axios.put('http://localhost:8080/api/v1/members/resetPassword', {newPassword}, { 
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            console.log(response);
            handleLogout();
        } catch (error) {
            console.error('Password change failed', error);
            setErrorMessage('비밀번호 변경 중 오류가 발생했습니다.');
        }
    };

    const handleLogout = async () => {
        await dispatch(logout());
        // Perform different actions based on the current location
        if (location.pathname === '/profile') {
            navigate('/');
        } else {
            onRequestClose();
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
        </Modal>
    );
};

export default ResetPasswordCompletionModal;
