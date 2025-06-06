import React, { useEffect, useState, useRef } from "react";
import socketIo from "socket.io-client";
import { Container, Row, Card, Form, Button } from "react-bootstrap";
import axios from "axios";
import "./Chat.css";
// import bgpic from "../../../../public/bg-pic.webp"

let socket;
const ENDPOINT = "https://socket.a1gaming.co.in/";
//  const ENDPOINT =  "https://socket.a1adda.com";

const Chat = ({ user, chatoption }) => {
  const [id, setId] = useState("");
  const [roomID, setRoomID] = useState("");
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const audioRef = useRef();

  const handleOptionClick = (option) => {
    const room = user?.Phone ? user.Phone.toString() : "defaultRoom";
    socket.emit("userOption", {
      optionId: option._id,
    });
  };

  const endChat = () => {
    const room = user?.Phone ? user.Phone.toString() : "defaultRoom";
    socket.emit("endChat", { room });
    setMessages([]);
    chatoption(false);
    window.location.reload();
  };

  const send = () => {
    if (chatInput.trim()) {
      const room = user?.Phone ? user.Phone.toString() : "defaultRoom";

      socket.emit("message", { message: chatInput, id: user?._id, Phone: user?.Phone, name: user?.Name, room });
      setChatInput("");
    }
  };

  useEffect(() => {
    socket = socketIo(ENDPOINT, { transports: ["websocket"] });

    socket.on("connect", () => {});

    socket.emit("supportChat");
    socket.emit("delayChat");

    socket.on("allMessages", (data) => {
      setMessages(data);
    });
    
    socket.on("sendMessage", (data) => {
      setMessages((prev) => [...prev, data?.message]);
    });

    socket.on("getOptions", (data) => {
      setMessages((prev) => [...prev, data?.message]);
    });

    socket.on("welcome", (data) => setMessages((prev) => [...prev, data]));

    return () => {
      socket.emit("endChat", { room: user?.Phone });
      socket.emit("disconnect");
      socket.emit("supportChat");
      socket.emit("delayChat");
      socket.off();
    };
  }, []);

  useEffect(() => {
    // const room = user?.Phone ? user.Phone.toString() : "defaultRoom";
    // setId(user?._id);
    // socket.emit("joined", { id: user?._id, Phone: user?.Phone, room });

    if (user) { 
      const room = user.Phone.toString();
      setId(user?._id);
      socket.emit("joined", { id: user?._id, Phone: user?.Phone, room }, (response) => {
        // console.log("Server acknowledged join:", response.data);
        setRoomID(response.data._id);
      });
    } 
  }, [user]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    recorder.ondataavailable = (event) => setAudioBlob(event.data);
    recorder.start();
    setMediaRecorder(recorder);
    setIsRecording(true);
  };

  const stopRecording = () => {
    mediaRecorder.stop();
    setIsRecording(false);
  };

  const backendLocalApiUrl = process.env.REACT_APP_BACKEND_LOCAL_API;
  const backendLiveApiUrl = process.env.REACT_APP_BACKEND_LIVE_API;
  const nodeMode = process.env.NODE_ENV;
  const baseUrl = nodeMode === "development" ? backendLocalApiUrl : backendLiveApiUrl;

  const sendAudioMessage = async () => {
    if (audioBlob) {
      const formData = new FormData();
      formData.append("audio", new File([audioBlob], "audioMessage.mp3", { type: "audio/mp3" }));
      formData.append("room", user.Phone.toString());
      formData.append("senderId", user._id);
      formData.append("Phone", user.Phone);
      formData.append("isAdmin", false);
      formData.append("name", user.Name);

      try {
        const { data } = await axios.post(`${baseUrl}upload`, formData);
        setAudioBlob(null);
        socket.emit("voiceMessage", {
          audioUrl: data?.audioUrl,
          senderId: data?.senderId,
          Phone: data?.Phone,
          room: data?.room,
          name: user?.Name,
        });
      } catch (error) {
        console.error("Error sending audio message:", error);
      }
    }
  };

  //   const uploadImageFile = async (event) => {
  //     const file = event.target.files[0];
  //     if (!file) return;

  //     const formData = new FormData();
  //     formData.append("image", file);
  //     formData.append("room", user.Phone.toString());
  //     formData.append("senderId", user._id);
  //     formData.append("Phone", user.Phone);
  //     formData.append("isAdmin", false);
  //     formData.append("name", user.Name);

  //     try {
  //       const { data } = await axios.post(`${baseUrl}upload/image`, formData);
  //       setSelectedImage(data.imageUrl); // Store image URL in state
  //       socket.emit("imageMessage", { imageUrl: data.imageUrl, senderId: user._id, room: user.Phone.toString() });
  //     } catch (error) {
  //       console.error("Error uploading image:", error);
  //     }
  //   };

  const uploadImageFile = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (event) => {
      const file = event.target.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append("image", file);
      formData.append("room", user.Phone.toString());
      formData.append("senderId", user._id);
      formData.append("Phone", user.Phone);
      formData.append("name", user.Name);
      formData.append("isAdmin", false);

      try {
        const { data } = await axios.post(`${baseUrl}upload/image`, formData);
        console.log("-----s-ds-d-sd-sd-s-ds-ds-d-sd-------", data);

        setSelectedImage(null);
        socket.emit("fileMessage", {
          fileUrl: data?.fileUrl,
          senderId: data?.senderId,
          Phone: data?.Phone,
          room: data?.room,
          name: user?.Name,
        });
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    };
    input.click();
  };

  return (
    <div
      className="leftContainer"
      style={{
        borderRadius: 20,
        overflow: "hidden",
        boxShadow: "0px 0px 10px #1a1a1a",
        background: "#0000",
      }}
    >
      <Container>
        <Row>
          <Card className="chat-container" style={{ background: "#121212" }}>
            <Card.Header className="text-center" style={{ background: "#161616" }}>
              <h4>A1 Gaming Support 24*7</h4>
              <span style={{ color: "yellow" }}>Online</span>
            </Card.Header>
            <Card.Body style={{ background: "transparent" }}>
              <div className="chat-messages" style={{ backgroundImage: "url(/bg-pic.webp)" }}>
                {messages.map((item, i) => {
                  console.log("::::::-----", item);

                  return (
                    <React.Fragment key={item.message + i}>
                      <div className={`message ${item.senderId === id ? "sent" : "received"}`}>
                        <strong>{item.name === id ? item.name : item.name}</strong>: <p>{item.message}</p>
                        {item.audioUrl && <audio controls src={baseUrl + item.audioUrl} />}
                        {item.fileUrl && (
                          <img
                            src={baseUrl + item.fileUrl}
                            alt=""
                            style={{
                              width: "200px",
                              height: "200px",
                              objectFit: "contain",
                            }}
                          />
                        )}
                      </div>
                      {item.options && (
                        <div
                          className="options"
                          style={{ gap: 10, display: "flex", flexWrap: "wrap", alignSelf: "flex-end" }}
                        >
                          {messages.length - 1 == i &&
                            item.options.map((option, index) => (
                              <Button
                                key={option + index}
                                style={{ borderRadius: 50 }}
                                onClick={() => handleOptionClick(option)}
                              >
                                {option.text}
                              </Button>
                            ))}
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </Card.Body>
            <Card.Footer>
              <Form>
                <Form.Group className="d-flex align-items-center" style={{ gap: "10px" }}>
                  <Form.Control
                    type="text"
                    placeholder="Type a message"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={(e) => (e.key === "Enter" ? send() : null)}
                    className="flex-grow-1 me-2"
                    style={{ borderColor: "transparent" }}
                  />
                  <Button variant="primary" onClick={uploadImageFile}>
                    <i className="mdi mdi-upload-outline" style={{ margin: 0, padding: 0 }}></i>
                  </Button>
                  {!isRecording && !audioBlob && (
                    <Button variant="primary" onClick={startRecording}>
                      <i className="mdi mdi-microphone" style={{ margin: 0, padding: 0 }}></i>
                    </Button>
                  )}
                  {isRecording && (
                    <Button
                      variant="danger"
                      onClick={stopRecording}
                      style={{ boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}
                    >
                      <i className="mdi mdi-pause" style={{ margin: 0, padding: 0 }}></i>
                    </Button>
                  )}
                  {audioBlob && (
                    <Button
                      variant="success"
                      onClick={sendAudioMessage}
                      style={{ boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}
                    >
                      <i className="mdi mdi-send" style={{ margin: 0, padding: 0 }}></i>
                    </Button>
                  )}
                  <Button
                    variant="primary"
                    onClick={send}
                    style={{ flexBasis: "10%", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}
                  >
                    <i className="mdi mdi-send" style={{ margin: 0, padding: 0 }}></i>
                  </Button>
                  <Button
                    variant="primary"
                    onClick={endChat}
                    style={{ flexBasis: "10%", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}
                  >
                    <i className="mdi mdi-logout" style={{ margin: 0, padding: 0 }}></i>
                  </Button>
                </Form.Group>
              </Form>
            </Card.Footer>
          </Card>
        </Row>
      </Container>
    </div>
  );
};

export default Chat;