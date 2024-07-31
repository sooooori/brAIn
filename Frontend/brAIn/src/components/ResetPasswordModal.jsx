import React, { useState } from 'react';
import Modal from 'react-modal';
import { Button, TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom'; // Import useNavigate and useLocation

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
    },
    errorText: {
        color: '#ff5252',  // Red color for error messages
        fontSize: '14px',
        marginTop: '10px',
    }
};

const ResetPasswordCompletionModal = ({ isOpen, onRequestClose }) => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const navigate = useNavigate();
    const location = useLocation();

    const handlePasswordReset = () => {
        if (!newPassword) {
            setErrorMessage('새 비밀번호를 입력해주세요.');
            return;
        }
        if (newPassword !== confirmPassword) {
            setErrorMessage('비밀번호가 일치하지 않습니다.');
            return;
        }
        if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(newPassword)) {
            setErrorMessage('비밀번호는 최소 8자 이상, 문자와 숫자를 포함해야 합니다.');
            return;
        }

        axios.post('http://localhost:8080/api/v1/members/resetPassword', { newPassword })
            .then(response => {
                // Password reset successful, now logout
                handleLogout();
            })
            .catch(error => {
                console.error('Password reset failed', error);
                setErrorMessage('비밀번호 재설정 중 오류가 발생했습니다.');
            });
    };

    const handleLogout = () => {
        axios.post('http://localhost:8080/api/v1/members/logout')
            .then(response => {
                // Perform different actions based on the current location
                if (location.pathname === '/mypage') {
                    navigate('/');
                } else {
                    onRequestClose();
                }
            })
            .catch(error => {
                console.error('Logout failed', error);
                // Handle logout error if needed
                if (location.pathname === '/mypage') {
                    navigate('/');
                } else {
                    onRequestClose();
                }
            });
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
            <TextField
                id="newPassword"
                label="새 비밀번호"
                type="password"
                placeholder="새 비밀번호를 입력하세요"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                fullWidth
                variant="outlined"
                style={{ marginBottom: '10px' }}
            />
            <TextField
                id="confirmPassword"
                label="비밀번호 확인"
                type="password"
                placeholder="비밀번호를 다시 입력하세요"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                fullWidth
                variant="outlined"
                style={{ marginBottom: '10px' }}
            />
            {errorMessage && <p style={customStyles.errorText}>{errorMessage}</p>}
            <Button 
                onClick={handlePasswordReset} 
                variant="contained" 
                color="primary"
                style={customStyles.button}
            >
                비밀번호 재설정
            </Button>
        </Modal>
    );
};

export default ResetPasswordCompletionModal;
