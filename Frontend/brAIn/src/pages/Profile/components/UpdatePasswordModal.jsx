import React, { useState } from 'react';
import Modal from 'react-modal';
import { Button, TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../../features/auth/authSlice';
import axios from 'axios';
import Cookies from 'js-cookie';
import './UpdatePasswordModal.css';

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
};

const UpdatePasswordModal = ({ isOpen, onRequestClose }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const { accessToken } = useSelector((state) => state.auth);

    const handlePasswordChange = async () => {
        if (newPassword !== confirmPassword) {
            setErrorMessage('새 비밀번호와 비밀번호 확인이 일치하지 않습니다.');
            return;
        }

        try {
            await axios.put('http://localhost:8080/api/v1/members/updatePassword', 
                { newPassword },
                {  
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
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

    const handleClose = () => {
        // Clear the state when modal is closed
        setNewPassword('');
        setConfirmPassword('');
        setErrorMessage('');
        onRequestClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={handleClose}
            contentLabel="Reset Password Completion Modal"
            style={customStyles}
        >
            <div className="modal-header">
                <Button onClick={handleClose} style={{ color: '#000' }}>
                    <CloseIcon />
                </Button>
            </div>
            <h1 className="h1">비밀번호 재설정</h1>
            <TextField
                id="newPassword"
                label="새 비밀번호"
                type="password"
                placeholder="새 비밀번호를 입력하세요"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                fullWidth
                variant="outlined"
                style={{ marginBottom: '15px' }}
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
                style={{ marginBottom: '15px' }}
            />
            <Button
                onClick={handlePasswordChange}
                variant="contained"
                color="primary"
                className="modal-button"
                style={customStyles.button}
            >
                비밀번호 재설정
            </Button>
            {errorMessage && <p className="error-text">{errorMessage}</p>}
        </Modal>
    );
};

export default UpdatePasswordModal;
