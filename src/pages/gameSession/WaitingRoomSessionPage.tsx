"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import SockJS from "sockjs-client";
import { Client, IMessage } from "@stomp/stompjs";
import axiosInstance from "@/services/axiosInstance";
import { cancelGame, startGame } from "@/services/gameService";
import unknownAvatar from "@/assets/img/avatars/unknown.jpg";

import avatar1 from "@/assets/img/avatars/1.png";
import avatar2 from "@/assets/img/avatars/2.png";
import avatar3 from "@/assets/img/avatars/3.png";
import avatar4 from "@/assets/img/avatars/4.png";
import avatar5 from "@/assets/img/avatars/5.png";
import avatar6 from "@/assets/img/avatars/6.png";
import avatar7 from "@/assets/img/avatars/7.png";
import avatar8 from "@/assets/img/avatars/8.png";
import avatar9 from "@/assets/img/avatars/9.png";
import avatar10 from "@/assets/img/avatars/10.png";
import avatar11 from "@/assets/img/avatars/11.png";
import avatar12 from "@/assets/img/avatars/12.png";
import avatar13 from "@/assets/img/avatars/13.png";
import avatar14 from "@/assets/img/avatars/14.png";
import avatar15 from "@/assets/img/avatars/15.png";


// Danh sách avatar (sử dụng import tĩnh tạm thời)
const AVATAR_LIST = [
  avatar1,
  avatar2,
  avatar3,
  avatar4,
  avatar5,
  avatar6,
  avatar7,
  avatar8,
  avatar9,
  avatar10,
  avatar11,
  avatar12,
  avatar13,
  avatar14,
  avatar15,
  ,
];

// Define types for game session data
interface GameSession {
  gameId: string;
  quizId: string;
  hostId: string;
  pinCode: string;
  status: "WAITING" | "STARTED" | "COMPLETED";
  startTime: string;
  endTime: string | null;
}

// Define type for player, matching backend PlayerResponseDTO
interface Player {
  playerId: string;
  nickname: string;
  avatar?: string;
  joinedAt: string;
}

// Type for WebSocket message payload (PlayerResponseDTO from backend)
interface PlayerResponseDTO {
  playerId: string;
  nickname: string;
  gameId: string;
  score: number;
  inGame: boolean;
  userId?: string;
  avatar?: string;
  joinedAt?: string;
}

const WaitingRoomSessionPage: React.FC = () => {
  console.log("WaitingRoomSessionPage component loaded");
  const { gameId } = useParams<{ gameId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const WS_ENDPOINT = import.meta.env.VITE_WS_URL || "http://localhost:8080/ws";
  const API_BASE_URL = import.meta.env.VITE_BASE_API_URL || "http://localhost:8080/api";

  const [gameData, setGameData] = useState<GameSession | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [quizTitle, setQuizTitle] = useState<string>("");
  const [stompClient, setStompClient] = useState<Client | null>(null);
  const [wsConnected, setWsConnected] = useState<boolean>(false);

  // State để theo dõi các avatar đã sử dụng
  const [usedAvatars, setUsedAvatars] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!gameId) {
      setError("No game ID provided");
      setIsLoading(false);
      return;
    }

    const state = location.state as { gameData?: GameSession; quizTitle?: string } | null;
    if (state?.gameData) {
      setGameData(state.gameData);
      setQuizTitle(state.quizTitle || "Quiz Game");
      setIsLoading(false);
    } else {
      setError("No game data provided in location state");
      setIsLoading(false);
    }
  }, [gameId, location.state]);

  useEffect(() => {
    if (!gameId) return;

    const client = new Client({
      webSocketFactory: () => new SockJS(WS_ENDPOINT),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      debug: (msg) => console.log("[STOMP]", msg),
    });

    client.onConnect = (frame) => {
      console.log("WebSocket connected successfully:", frame);
      setWsConnected(true);
      setError(null);

      client.subscribe(`/topic/game/${gameId}/players`, (message) => {
        console.log("Received WebSocket message for players:", message.body);
        try {
          const parsedData = JSON.parse(message.body);
          if (Array.isArray(parsedData)) {
            const newPlayers: Player[] = parsedData
              .filter((p: PlayerResponseDTO) => p.inGame)
              .map((p: PlayerResponseDTO) => {
                let avatar = p.avatar;
                if (!avatar || avatar === unknownAvatar) {
                  avatar = assignRandomAvatar();
                  console.log(`Assigned random avatar to ${p.nickname}: ${avatar}`);
                }
                return {
                  playerId: p.playerId,
                  nickname: p.nickname || "Unknown Player",
                  avatar,
                  joinedAt: p.joinedAt || new Date().toISOString(),
                };
              });
            setPlayers((prevPlayers) => {
              const playersChanged = !arraysEqual(prevPlayers, newPlayers);
              if (playersChanged) return newPlayers;
              return prevPlayers;
            });
          }
        } catch (error) {
          console.error("Error parsing player message:", error);
        }
      });

      client.subscribe(`/topic/game/${gameId}/status`, (message) => {
        console.log("Received status update:", message.body);
        try {
          const statusUpdate: GameSession = JSON.parse(message.body);
          if (statusUpdate.status === "STARTED") navigate(`/game-play/${gameId}`);
          else if (statusUpdate.status === "COMPLETED") navigate("/quizzes");
        } catch (error) {
          console.error("Error parsing status message:", error);
        }
      });

      console.log("WebSocket subscriptions created successfully");
    };

    client.onStompError = (error) => {
      console.error("WebSocket STOMP error:", error);
      setWsConnected(false);
      setError("Real-time connection error.");
    };

    client.onWebSocketError = (error) => {
      console.error("WebSocket connection error:", error);
      setWsConnected(false);
      setError("Failed to establish real-time connection.");
    };

    client.onDisconnect = () => {
      console.log("WebSocket disconnected");
      setWsConnected(false);
    };

    console.log("Activating WebSocket client");
    client.activate();
    setStompClient(client);

    return () => {
      if (client.active) client.deactivate();
      setWsConnected(false);
      setStompClient(null);
    };
  }, [gameId]);

  // Hàm gán avatar ngẫu nhiên không trùng lặp
  const assignRandomAvatar = (): string => {
    const availableAvatars = AVATAR_LIST.filter((avatar) => !usedAvatars.has(avatar.toString()));
    if (availableAvatars.length === 0) {
      // Reset usedAvatars nếu đã dùng hết
      setUsedAvatars(new Set());
      const randomAvatar = AVATAR_LIST[Math.floor(Math.random() * AVATAR_LIST.length)] || unknownAvatar;
      console.log("All avatars used, resetting and assigning:", randomAvatar);
      return randomAvatar.toString();
    }
    const randomAvatar = availableAvatars[Math.floor(Math.random() * availableAvatars.length)] || unknownAvatar;
    setUsedAvatars((prev) => new Set(prev).add(randomAvatar.toString()));
    console.log("Assigned random avatar:", randomAvatar);
    return randomAvatar.toString();
  };

  const arraysEqual = (arr1: Player[], arr2: Player[]) => {
    if (arr1.length !== arr2.length) return false;
    return arr1.every((item, index) => JSON.stringify(item) === JSON.stringify(arr2[index]));
  };

  const handleCancelGame = async () => {
    if (!gameData) {
      console.warn("Cannot cancel game - no game data");
      return;
    }

    try {
      await cancelGame(gameData.gameId);
      console.log("Game canceled successfully, navigating to /quizzes");
      navigate("/quizzes");
    } catch (error) {
      console.error("Error canceling game:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      alert(`Failed to cancel game: ${errorMessage}`);
    }
  };

  const handleStartGame = async () => {
    if (!gameData) {
      console.warn("Cannot start game - no game data");
      return;
    }

    try {
      await startGame(gameData.gameId);
    } catch (error) {
      console.error("Error starting game:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      alert(`Failed to start game: ${errorMessage}`);
    }
  };

  const copyPinCode = async () => {
    if (!gameData) {
      console.warn("Cannot copy pin code - no game data");
      return;
    }

    try {
      await navigator.clipboard.writeText(gameData.pinCode);
      alert("Pin code copied to clipboard!");
      console.log("Pin code copied successfully");
    } catch (err) {
      console.error("Failed to copy pin code:", err);
      const textArea = document.createElement("textarea");
      textArea.value = gameData.pinCode;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand("copy");
        alert("Pin code copied to clipboard!");
      } catch (fallbackErr) {
        console.error("Fallback copy also failed:", fallbackErr);
        alert("Failed to copy pin code. Please copy manually: " + gameData.pinCode);
      }
      document.body.removeChild(textArea);
    }
  };

  const memoizedPlayers = useMemo(() => {
    console.log("Memoizing players:", players);
    return players;
  }, [players]);

  if (isLoading) {
    console.log("Rendering loading state");
    return (
      <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading game session...</p>
          {gameId && <p className="text-muted">Game ID: {gameId}</p>}
        </div>
      </div>
    );
  }

  if (error) {
    console.log("Rendering error state:", error);
    return (
      <div className="container text-center py-5">
        <div className="alert alert-danger">
          <i className="bx bx-error-circle me-2"></i>
          <strong>Error:</strong> {error}
        </div>
        {gameId && <p className="text-muted mb-3">Game ID: {gameId}</p>}
        <div className="d-flex gap-2 justify-content-center">
          <button className="btn btn-primary" onClick={() => navigate(-1)}>
            <i className="bx bx-refresh me-2"></i>
            Retry
          </button>
          <button className="btn btn-outline-secondary" onClick={() => navigate("/")}>
            <i className="bx bx-home me-2"></i>
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  if (!gameData) {
    console.log("Rendering no game data state");
    return (
      <div className="container text-center py-5">
        <div className="alert alert-warning">
          <i className="bx bx-info-circle me-2"></i>
          Game session not found
        </div>
        {gameId && <p className="text-muted mb-3">Game ID: {gameId}</p>}
        <button className="btn btn-primary mt-3" onClick={() => navigate("/")}>
          <i className="bx bx-home me-2"></i>
          Return to Home
        </button>
      </div>
    );
  }

  console.log("Rendering main component with game data:", gameData);
  console.log("Rendering players list with:", memoizedPlayers);
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-primary text-white py-4">
              <h3 className="mb-0 text-center">{quizTitle}</h3>
              <p className="text-center mb-0 mt-2 text-white-50">
                Game Session
                {!wsConnected && (
                  <span className="ms-2 badge bg-warning">
                    <i className="bx bx-wifi-off me-1"></i>
                    Offline
                  </span>
                )}
                {wsConnected && (
                  <span className="ms-2 badge bg-success">
                    <i className="bx bx-wifi me-1"></i>
                    Connected
                  </span>
                )}
              </p>
            </div>

            <div className="card-body p-4">
              {/* Game Pin Section */}
              <div className="text-center mb-5">
                <h4 className="mb-3">Game PIN</h4>
                <div className="d-flex justify-content-center align-items-center">
                  <div className="pin-code-display bg-light py-3 px-5 rounded-3 d-inline-block">
                    <h1 className="display-4 mb-0 fw-bold">{gameData.pinCode}</h1>
                  </div>
                  <button className="btn btn-outline-primary ms-3" onClick={copyPinCode} title="Copy PIN">
                    <i className="bx bx-copy"></i>
                  </button>
                </div>
                <p className="text-muted mt-3">Share this PIN with your participants to join the game</p>
              </div>

              {/* Players Section */}
              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h4 className="mb-0">Players ({memoizedPlayers.length})</h4>
                  <span className="badge bg-success py-2 px-3">
                    <i className="bx bx-time me-1"></i>
                    Waiting for players...
                  </span>
                </div>

                {memoizedPlayers.length === 0 ? (
                  <div className="text-center py-5 bg-light rounded-3">
                    <i className="bx bx-user-plus" style={{ fontSize: "3rem", color: "#adb5bd" }}></i>
                    <p className="mt-3 text-muted">No players have joined yet</p>
                    <p className="text-muted">Share the PIN code above for players to join</p>
                  </div>
                ) : (
                  <div className="row g-3">
                    {memoizedPlayers.map((player) => (
                      <div key={player.playerId} className="col-md-6">
                        <div className="card border-0 bg-light">
                          <div className="card-body py-2 px-3">
                            <div className="d-flex align-items-center">
                              <img
                                src={player.avatar || unknownAvatar} // Sử dụng avatar đã gán
                                alt={player.nickname}
                                className="rounded-circle me-3"
                                width="40"
                                height="40"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  if (target.src !== unknownAvatar) {
                                    console.log("Avatar load failed for:", player.nickname);
                                    target.src = unknownAvatar;
                                  }
                                }}
                              />
                              <div>
                                <h6 className="mb-0">{player.nickname}</h6>
                                <small className="text-muted">
                                  Joined {new Date(player.joinedAt).toLocaleTimeString()}
                                </small>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Connection Status Warning */}
              {!wsConnected && (
                <div className="alert alert-warning mb-4">
                  <i className="bx bx-wifi-off me-2"></i>
                  <strong>Connection Issue:</strong> Real-time updates are not available. Players may still join, but you won't see live updates.
                </div>
              )}

              {/* Action Buttons */}
              <div className="d-flex justify-content-between mt-4">
                <button
                  className="btn btn-outline-danger"
                  onClick={handleCancelGame}
                >
                  <i className="bx bx-x me-2"></i>
                  Cancel Game
                </button>

                <button
                  className="btn btn-success"
                  onClick={handleStartGame}
                  disabled={memoizedPlayers.length === 0}
                  title={memoizedPlayers.length === 0 ? "Need at least 1 player to start" : "Start the game"}
                >
                  <i className="bx bx-play me-2"></i>
                  Start Game
                  {memoizedPlayers.length === 0 && (
                    <span className="ms-2 badge bg-light text-dark">Need players</span>
                  )}
                </button>
              </div>

              {/* Debug Info (remove in production) */}
              {process.env.NODE_ENV === "development" && (
                <div className="mt-4 p-3 bg-light rounded small">
                  <strong>Debug Info:</strong>
                  <br />
                  Game ID: {gameId}
                  <br />
                  WebSocket Connected: {wsConnected ? "Yes" : "No"}
                  <br />
                  API URL: {API_BASE_URL}
                  <br />
                  WebSocket URL: {WS_ENDPOINT}
                  <br />
                  Players Count: {memoizedPlayers.length}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaitingRoomSessionPage;