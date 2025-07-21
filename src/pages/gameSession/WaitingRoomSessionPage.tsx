"use client";

import React, {useState, useEffect, useMemo} from "react";
import {useParams, useLocation, useNavigate} from "react-router-dom";
import SockJS from "sockjs-client";
import {Client, IMessage} from "@stomp/stompjs";

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
    const {gameId} = useParams<{gameId: string}>();
    const location = useLocation();
    const navigate = useNavigate();
    const [gameData, setGameData] = useState<GameSession | null>(null);
    const [players, setPlayers] = useState<Player[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [quizTitle, setQuizTitle] = useState<string>("");
    const [stompClient, setStompClient] = useState<Client | null>(null);

    // Get game data from location state or fetch it
    useEffect(() => {
        interface LocationState {
            gameData?: GameSession;
            quizTitle?: string;
        }

        const state = location.state as LocationState | undefined;
        if (state?.gameData) {
            setGameData(state.gameData);
            setQuizTitle(state.quizTitle || "Quiz Game");
            setIsLoading(false);
        } else if (gameId) {
            fetchGameData(gameId);
        } else {
            navigate("/");
        }
    }, [gameId, location.state, navigate]);

    // Fetch game data from API
    const fetchGameData = async (id: string) => {
        try {
            setIsLoading(true);
            const baseUrl =
                import.meta.env.VITE_API_URL || "http://localhost:8080";
            const response = await fetch(`${baseUrl}/games/${id}`);

            if (!response.ok) {
                throw new Error("Failed to fetch game data");
            }

            const data: GameSession = await response.json();
            setGameData(data);
            setQuizTitle(
                (location.state as {quizTitle?: string})?.quizTitle ||
                    "Quiz Game",
            );
            setIsLoading(false);
        } catch (error) {
            console.error("Error fetching game data:", error);
            setIsLoading(false);
        }
    };

    // Set up WebSocket connection
    useEffect(() => {
        if (!gameData || !gameId) return;

        // Initialize WebSocket client
        const client = new Client({
            webSocketFactory: () =>
                new SockJS(
                    `${import.meta.env.VITE_API_URL || "http://localhost:8080"}/ws`,
                ),
            reconnectDelay: 5000, // Auto-reconnect after 5s
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
        });
        setStompClient(client);

        client.onConnect = () => {
            console.log("Connected to WebSocket");

            // Subscribe to player updates
            client.subscribe(
                `/topic/game/${gameId}/players`,
                (message: IMessage) => {
                    try {
                        const newPlayers: PlayerResponseDTO[] = JSON.parse(
                            message.body,
                        );
                        const formattedPlayers: Player[] = newPlayers
                            .filter((p) => p.inGame)
                            .map((p) => ({
                                playerId: p.playerId,
                                nickname: p.nickname,
                                avatar: p.avatar || "/placeholder.svg",
                                joinedAt:
                                    p.joinedAt || new Date().toISOString(),
                            }));
                        setPlayers(formattedPlayers);
                    } catch (error) {
                        console.error("Error parsing player message:", error);
                    }
                },
            );

            // Subscribe to game status updates
            client.subscribe(
                `/topic/game/${gameId}/status`,
                (message: IMessage) => {
                    try {
                        const statusUpdate: GameSession = JSON.parse(
                            message.body,
                        );
                        if (statusUpdate.status === "STARTED") {
                            navigate(`/game-play/${gameId}`);
                        } else if (statusUpdate.status === "COMPLETED") {
                            navigate(`/game-results/${gameId}`);
                        }
                    } catch (error) {
                        console.error("Error parsing status message:", error);
                    }
                },
            );
        };

        client.onStompError = (error: unknown) => {
            console.error("WebSocket connection error:", error);
        };

        client.activate();

        // Clean up WebSocket connection
        return () => {
            if (client.connected) {
                client.deactivate();
                console.log("Disconnected from WebSocket");
            }
        };
    }, [gameData, gameId, navigate]);

    // Start the game
    const handleStartGame = async () => {
        if (!gameData) return;

        try {
            const baseUrl =
                import.meta.env.VITE_API_URL || "http://localhost:8080";
            const response = await fetch(
                `${baseUrl}/games/${gameData.gameId}/start`,
                {
                    method: "POST",
                },
            );

            if (!response.ok) {
                throw new Error("Failed to start game");
            }
            // Navigation handled by WebSocket status update
        } catch (error) {
            console.error("Error starting game:", error);
            alert("Failed to start game. Please try again.");
        }
    };

    // Copy pin code to clipboard
    const copyPinCode = () => {
        if (!gameData) return;

        navigator.clipboard
            .writeText(gameData.pinCode)
            .then(() => {
                alert("Pin code copied to clipboard!");
            })
            .catch((err) => {
                console.error("Failed to copy pin code:", err);
            });
    };

    // Memoize players to stabilize rendering
    const memoizedPlayers = useMemo(() => players, [players]);

    if (isLoading) {
        return (
            <div
                className="container d-flex justify-content-center align-items-center"
                style={{minHeight: "80vh"}}
            >
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-3">Loading game session...</p>
                </div>
            </div>
        );
    }

    if (!gameData) {
        return (
            <div className="container text-center py-5">
                <div className="alert alert-danger">
                    <i className="bx bx-error-circle me-2"></i>
                    Game session not found
                </div>
                <button
                    className="btn btn-primary mt-3"
                    onClick={() => navigate("/")}
                >
                    Return to Home
                </button>
            </div>
        );
    }

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <div className="card border-0 shadow-sm">
                        <div className="card-header bg-primary text-white py-4">
                            <h3 className="mb-0 text-center">{quizTitle}</h3>
                            <p className="text-center mb-0 mt-2 text-white-50">
                                Game Session
                            </p>
                        </div>

                        <div className="card-body p-4">
                            {/* Game Pin Section */}
                            <div className="text-center mb-5">
                                <h4 className="mb-3">Game PIN</h4>
                                <div className="d-flex justify-content-center align-items-center">
                                    <div className="pin-code-display bg-light py-3 px-5 rounded-3 d-inline-block">
                                        <h1 className="display-4 mb-0 fw-bold">
                                            {gameData.pinCode}
                                        </h1>
                                    </div>
                                    <button
                                        className="btn btn-outline-primary ms-3"
                                        onClick={copyPinCode}
                                        title="Copy PIN"
                                    >
                                        <i className="bx bx-copy"></i>
                                    </button>
                                </div>
                                <p className="text-muted mt-3">
                                    Share this PIN with your participants to
                                    join the game
                                </p>
                            </div>

                            {/* Players Section */}
                            <div className="mb-4">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h4 className="mb-0">
                                        Players ({memoizedPlayers.length})
                                    </h4>
                                    <span className="badge bg-success py-2 px-3">
                                        <i className="bx bx-time me-1"></i>{" "}
                                        Waiting for players...
                                    </span>
                                </div>

                                {memoizedPlayers.length === 0 ? (
                                    <div className="text-center py-5 bg-light rounded-3">
                                        <i
                                            className="bx bx-user-plus"
                                            style={{
                                                fontSize: "3rem",
                                                color: "#adb5bd",
                                            }}
                                        ></i>
                                        <p className="mt-3 text-muted">
                                            No players have joined yet
                                        </p>
                                    </div>
                                ) : (
                                    <div className="row g-3">
                                        {memoizedPlayers.map((player) => (
                                            <div
                                                key={player.playerId}
                                                className="col-md-6"
                                            >
                                                <div className="card border-0 bg-light">
                                                    <div className="card-body py-2 px-3">
                                                        <div className="d-flex align-items-center">
                                                            <img
                                                                src={
                                                                    player.avatar ||
                                                                    "/placeholder.svg"
                                                                }
                                                                alt={
                                                                    player.nickname
                                                                }
                                                                className="rounded-circle me-3"
                                                                width="40"
                                                                height="40"
                                                            />
                                                            <div>
                                                                <h6 className="mb-0">
                                                                    {
                                                                        player.nickname
                                                                    }
                                                                </h6>
                                                                <small className="text-muted">
                                                                    Joined{" "}
                                                                    {new Date(
                                                                        player.joinedAt,
                                                                    ).toLocaleTimeString()}
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

                            {/* Action Buttons */}
                            <div className="d-flex justify-content-between mt-4">
                                <button
                                    className="btn btn-outline-danger"
                                    onClick={() => navigate(-1)}
                                >
                                    <i className="bx bx-x me-2"></i>
                                    Cancel Game
                                </button>

                                <button
                                    className="btn btn-success"
                                    onClick={handleStartGame}
                                    disabled={memoizedPlayers.length === 0}
                                >
                                    <i className="bx bx-play me-2"></i>
                                    Start Game
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WaitingRoomSessionPage;
