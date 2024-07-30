import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import Button from "../components/Button/Button"; // Import custom Button
import IconButton from '@mui/material/IconButton'; // MUI IconButton import
import CloseIcon from '@mui/icons-material/Close'; // MUI CloseIcon import
import SearchIcon from '@mui/icons-material/Search'; // MUI SearchIcon import
import AddIcon from '@mui/icons-material/Add'; // MUI AddIcon import
import ConferenceCodeInput from "./ConferenceCodeInput";
import Snackbar from '@mui/material/Snackbar'; // MUI Snackbar import
import Alert from '@mui/material/Alert'; // MUI Alert import
import Box from '@mui/material/Box'; // MUI Box import
import Typography from '@mui/material/Typography'; // MUI Typography import

const JoinConferenceBack = ({
  handleJoinConferenceFalse,
  isConferenceSearchClicked,
  handleConferenceSearchClickedTrue,
  codeInputs,
  setCodeInputs
}) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [notification, setNotification] = useState({ open: false, message: "", type: "info" });

  const handleSearchButtonClicked = () => {
    if (isConferenceSearchClicked) {
      navigate(`/participant?roomid=${codeInputs.join("")}`);
    } else {
      if (codeInputs.join("").length !== 6) {
        setNotification({ open: true, message: "회의 코드를 올바르게 입력해주세요.", type: "error" });
      } else {
        axios
          .get(`${import.meta.env.VITE_API_SERVER_URL}/conference?code=${codeInputs.join("")}`)
          .then((result) => {
            setTitle(result.data.title);
            setDescription(result.data.description);
            handleConferenceSearchClickedTrue();
          })
          .catch(() => {
            setNotification({ open: true, message: "회의 코드가 존재하지 않아요.", type: "error" });
          });
      }
    }
  };

  const handleCloseNotification = () => {
    setNotification({ open: false, message: "", type: "info" });
  };

  return (
    <Box className="w-full h-full flex flex-col absolute bg-grayscale-white overflow-hidden border-default rounded-xl rotate-180 z-[1] shadow-xl" p={3}>
      <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">회의 참여하기</Typography>
        <IconButton onClick={handleJoinConferenceFalse} className="w-6 h-6">
          <CloseIcon />
        </IconButton>
      </Box>

      {isConferenceSearchClicked ? (
        <>
          <Box mb={2}>
            <Typography variant="h6">회의 코드</Typography>
            <Typography variant="h5" color="primary">{codeInputs.join("")}</Typography>
          </Box>
          <Box mb={2}>
            <Typography variant="h6">회의 제목</Typography>
            <Typography variant="body1" color="textSecondary">{title}</Typography>
          </Box>
          <Box mb={2}>
            <Typography variant="h6">회의 설명</Typography>
            <Typography variant="body1" color="textSecondary">{description}</Typography>
          </Box>
        </>
      ) : (
        <Box mb={3}>
          <Typography variant="h6">회의 코드</Typography>
          <Typography variant="body2" color="textSecondary">
            회의 진행자에게 전달받은 회의 코드 6자리를 입력해주세요.
          </Typography>
          <ConferenceCodeInput inputs={codeInputs} setInputs={setCodeInputs} keyPress={handleSearchButtonClicked} />
        </Box>
      )}

      <Button
        type="full" // Adjust as needed
        buttonStyle={isConferenceSearchClicked ? "blue" : "gray"} // Set the button style conditionally
        onClick={handleSearchButtonClicked}
        startIcon={isConferenceSearchClicked ? <AddIcon /> : <SearchIcon />}
      >
        {isConferenceSearchClicked ? "회의 참여하기" : "회의 조회하기"}
      </Button>

      <Snackbar open={notification.open} autoHideDuration={6000} onClose={handleCloseNotification}>
        <Alert onClose={handleCloseNotification} severity={notification.type} sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default JoinConferenceBack;
