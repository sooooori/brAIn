import React from 'react';
import Modal from 'react-modal';
import { Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';  // Import axios for making HTTP requests
import { useNavigate, useLocation } from 'react-router-dom';  // Import useNavigate and useLocation

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
    const navigate = useNavigate();
    const location = useLocation();

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
            <p>비밀번호 수정이 완료되었습니다. 다시 로그인해주세요.</p>
            <Button 
                onClick={handleLogout} 
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
