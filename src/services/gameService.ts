import { PlayerResponse, CreateGameSessionResponse } from "@/interfaces";
import axiosInstance from "./axiosInstance";
import { handleApiError } from "@/utils/apiErrorHandler";

export const joinGame = async (
  pinCode: string,
  nickname: string,
  token?: string,
  playerSession?: string
): Promise<PlayerResponse> => {
  if (!nickname || nickname.trim() === "") {
    throw new Error("Nickname cannot be empty");
  }

  try {
    console.log("Joining game with pinCode:", pinCode, "nickname:", nickname, "playerSession:", playerSession);
    const response = await axiosInstance.post(
      `/games/join?pinCode=${pinCode}`,
      {
        nickname: nickname.trim(),
        playerSession: playerSession || null,
        isAnonymous: !token, // Nếu không có token, đánh dấu là anonymous
        score: 0, // Đặt score mặc định là 0
      },
      {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        timeout: 10000, // Timeout 10 giây
      }
    );

    console.log("Join game response status:", response.status);
    console.log("Joined game successfully:", response.data);
    return response.data as PlayerResponse;
  } catch (error) {
    console.error("Error joining game:", error);
    handleApiError(error);
    throw error;
  }
};

export const createGameSession = async (
  quizId: string
): Promise<CreateGameSessionResponse> => {
  try {
    console.log("Creating game session for quizId:", quizId);
    const response = await axiosInstance.post(`/games/create`, {
      quizId,
    });

    console.log("Create game session response:", response.data);
    return response.data as CreateGameSessionResponse;
  } catch (error) {
    console.error("Error creating game session:", error);
    handleApiError(error);
    throw error;
  }
};

export const cancelGame = async (gameId: string): Promise<void> => {
  try {
    console.log("Canceling game:", gameId);
    const response = await axiosInstance.post(`/games/${gameId}/end`, {});
    console.log("Cancel game response status:", response.status);
    console.log("Game canceled successfully:", response.data);
  } catch (error) {
    console.error("Error canceling game:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    throw new Error(errorMessage);
  }
};

export const startGame = async (gameId: string): Promise<void> => {
  try {
    console.log("Starting game:", gameId);
    const response = await axiosInstance.post(`/games/${gameId}/start`, {});
    console.log("Start game response status:", response.status);
    console.log("Game started successfully:", response.data);
  } catch (error) {
    console.error("Error starting game:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    throw new Error(errorMessage);
  }
};