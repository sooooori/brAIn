import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { OpenVidu } from 'openvidu-browser';
import UserVideoComponent from './UserVideoComponent';

const APPLICATION_SERVER_URL = 'https://i11b203.p.ssafy.io/openvidu/api';
const DEFAULT_SESSION_ID = null;

const VideoConference = () => {
    const { secureId } = useParams();
    const [mySessionId, setMySessionId] = useState(secureId || DEFAULT_SESSION_ID);
    const [myUserName, setMyUserName] = useState(generateRandomUserName());
    const [session, setSession] = useState(undefined);
    const [mainStreamManager, setMainStreamManager] = useState(undefined);
    const [publisher, setPublisher] = useState(undefined);
    const [subscribers, setSubscribers] = useState([]);
    const [currentVideoDevice, setCurrentVideoDevice] = useState(undefined);
    const OV = new OpenVidu();
    const customAxios = axios.create();
    const username = "OPENVIDUAPP";
    const password = "ssafybrain"; // Replace with your actual OPENVIDU_SECRET
    const credentials = btoa(`${username}:${password}`);

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${credentials}`
    };


    useEffect(() => {
        window.addEventListener('beforeunload', onbeforeunload);
        if (mySessionId && myUserName) {
            joinSession(); // Automatically join the session if session ID and name are available
        }
        return () => {
            window.removeEventListener('beforeunload', onbeforeunload);
            leaveSession(); // Ensure session is left when component unmounts
        };
    }, [mySessionId, myUserName]);

    function onbeforeunload() {
        leaveSession();
    }

    function generateRandomUserName() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        return `Participant_${Array.from({ length: 8 }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('')}`;
    }

    function handleChangeSessionId(e) {
        setMySessionId(e.target.value);
    }

    function handleChangeUserName(e) {
        setMyUserName(e.target.value);
    }

    function handleMainVideoStream(stream) {
        if (mainStreamManager !== stream) {
            setMainStreamManager(stream);
        }
    }

    function deleteSubscriber(streamManager) {
        setSubscribers(prevSubscribers => prevSubscribers.filter(sub => sub !== streamManager));
    }

    async function joinSession() {
        const session = OV.initSession();

        session.on('streamCreated', (event) => {
            const subscriber = session.subscribe(event.stream, undefined);
            setSubscribers(prevSubscribers => [...prevSubscribers, subscriber]);
        });

        session.on('streamDestroyed', (event) => {
            deleteSubscriber(event.stream.streamManager);
        });

        session.on('exception', (exception) => {
            console.warn(exception);
        });

        try {
            const token = await getToken();
            await session.connect(token, { clientData: myUserName });

            const publisher = await OV.initPublisherAsync(undefined, {
                audioSource: undefined,
                videoSource: undefined,
                publishAudio: true,
                publishVideo: true,
                resolution: '640x480',
                frameRate: 30,
                insertMode: 'APPEND',
                mirror: false,
            });

            await session.publish(publisher);

            const devices = await OV.getDevices();
            const videoDevices = devices.filter(device => device.kind === 'videoinput');
            const currentVideoDeviceId = publisher.stream.getMediaStream().getVideoTracks()[0].getSettings().deviceId;
            const currentVideoDevice = videoDevices.find(device => device.deviceId === currentVideoDeviceId);

            setCurrentVideoDevice(currentVideoDevice);
            setMainStreamManager(publisher);
            setPublisher(publisher);
            setSession(session);

        } catch (error) {
            console.log('Error connecting to the session:', error);
        }
    }

    async function leaveSession() {
        if (session) {
            session.disconnect();
        }

        setSession(undefined);
        setSubscribers([]);
        setMySessionId(DEFAULT_SESSION_ID);
        setMyUserName(generateRandomUserName());
        setMainStreamManager(undefined);
        setPublisher(undefined);
    }

    async function switchCamera() {
        try {
            const devices = await OV.getDevices();
            const videoDevices = devices.filter(device => device.kind === 'videoinput');

            if (videoDevices.length > 1) {
                const newVideoDevice = videoDevices.find(device => device.deviceId !== currentVideoDevice.deviceId);

                if (newVideoDevice) {
                    const newPublisher = OV.initPublisher(undefined, {
                        videoSource: newVideoDevice.deviceId,
                        publishAudio: true,
                        publishVideo: true,
                        mirror: true,
                    });

                    await session.unpublish(mainStreamManager);
                    await session.publish(newPublisher);

                    setCurrentVideoDevice(newVideoDevice);
                    setMainStreamManager(newPublisher);
                    setPublisher(newPublisher);
                }
            }
        } catch (error) {
            console.error('Error switching camera:', error);
        }
    }

    async function getToken() {
        const sessionId = await createSession(mySessionId);
        return await createToken(sessionId);
    }

async function createSession(sessionId) {
    try {
        console.log(headers)
        const response = await customAxios.post(
            `${APPLICATION_SERVER_URL}/sessions`,
            { customSessionId: sessionId },
            { headers }
        );
        return response.data.sessionId;
    } catch (error) {
        console.error('Error creating session:', error);
        return sessionId;
    }
}

// Example function to create a token
async function createToken(sessionId) {
    try {
        console.log(headers)
        const response = await customAxios.post(
            `${APPLICATION_SERVER_URL}/sessions/${sessionId}/connection`,
            {},
            { headers }
        );
        return response.data.token;
    } catch (error) {
        console.error('Error creating token:', error);
    }
}

    return (
        <div className="container">
            {!session ? (
                <div id="join">
                    <div id="img-div">
                        <img src="resources/images/openvidu_grey_bg_transp_cropped.png" alt="OpenVidu logo" />
                    </div>
                    <div id="join-dialog" className="jumbotron vertical-center">
                        <h1>Join a video session</h1>
                        <form className="form-group" onSubmit={e => { e.preventDefault(); joinSession(); }}>
                            <p>
                                <label>WAITING:</label>
                            </p>
                        </form>
                    </div>
                </div>
            ) : null}

            {session ? (
                <div id="session">
                    <div id="session-header">
                        <h1 id="session-title">{mySessionId}</h1>
                        <button className="btn btn-large btn-danger" onClick={leaveSession}>Leave session</button>
                    </div>

                    {mainStreamManager ? (
                        <div id="main-video" className="col-md-6">
                            <UserVideoComponent streamManager={mainStreamManager} />
                        </div>
                    ) : null}

                    <div id="video-container" className="col-md-12">
                        {subscribers.map((sub, i) => (
                            <div key={i} className="stream-container" onClick={() => handleMainVideoStream(sub)}>
                                <UserVideoComponent streamManager={sub} />
                            </div>
                        ))}
                    </div>


                </div>
            ) : null}
        </div>
    );
};

export default VideoConference;
