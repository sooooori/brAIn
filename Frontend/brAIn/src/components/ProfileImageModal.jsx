import React, { useState } from 'react';
import Modal from 'react-modal'; // react-modal 패키지를 사용합니다.
import Button from '../components/Button/Button';
import './ProfileImageModal.css';

const ProfileImageModal = ({ isOpen, onRequestClose, onSave, currentPhoto }) => {
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
        console.log("Selected file:", event.target.files[0]);
    };

    const handleSave = () => {
        if (selectedFile) {
            onSave(selectedFile);
            console.log('Selected file to save:', selectedFile);
        } else {
            console.log('No file selected.');
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="프로필 이미지 수정"
            className="profile-image-modal"
            overlayClassName="profile-image-modal-overlay"
        >
            <h2>프로필 재설정</h2>
            {currentPhoto && (
                <img
                    src={currentPhoto}
                    alt="Current Profile"
                    className="current-profile-image"
                />
            )}
            <h3>프로필 이미지 업로드</h3>
            <input type="file" onChange={handleFileChange} />
            <div className="modal-actions">
                <Button onClick={handleSave}>프로필 이미지 변경</Button>
                <Button onClick={onRequestClose}>취소</Button>
            </div>
        </Modal>
    );
};

export default ProfileImageModal;