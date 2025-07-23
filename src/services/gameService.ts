import axiosInstance from "./axiosInstance";
import { handleApiError } from "@/utils/apiErrorHandler";

// Định nghĩa interface cho PlayerRequestDTO
interface PlayerRequestDTO {
  playerSession: string | null;
  nickname: string;
  isAnonymous: boolean;
  score: number;
}

// Định nghĩa interface cho PlayerResponseDTO
interface PlayerResponseDTO {
  playerId: string;
  gameId: string;
  userId?: string | null;
  nickname: string;
  score: number;
  anonymous: boolean;
  inGame: boolean;
}

// Định nghĩa interface cho GameResponseDTO
interface GameResponseDTO {
  gameId: string;
  quizId: string;
  hostId: string;
  pinCode: string;
  status: "WAITING" | "IN_PROGRESS" | "COMPLETED";
  startTime: string;
  endTime: string | null;
}

// Định nghĩa interface cho GameDetailsResponseDTO
interface GameDetailsResponseDTO {
  game: GameResponseDTO;
  players: PlayerResponseDTO[];
  title: string; // Thêm trường title nếu cần
}

// Định nghĩa interface cho CreateGameSessionResponse
interface CreateGameSessionResponse {
  gameId: string;
  pinCode: string;
  quizId: string;
  hostId: string;
  status: string;
  startTime: string;
  endTime: string | null;
}

// Hàm tham gia phòng game
export const joinGame = async (
  pinCode: string,
  nickname: string,
  playerSession?: string
): Promise<PlayerResponseDTO> => {
  if (!nickname.trim()) {
    throw new Error("Nickname cannot be empty");
  }

  try {
    const response = await axiosInstance.post<PlayerResponseDTO>(
      `/games/join?pinCode=${pinCode}`,
      {
        nickname: nickname.trim(),
        playerSession: playerSession || null,
        isAnonymous: true,
        score: 0,
      } as PlayerRequestDTO
    );
    if (response.data.playerId) {
      localStorage.setItem("playerSession", response.data.playerId); // Lưu playerId làm session
    }
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

// Hàm lấy thông tin game và danh sách người chơi
export const fetchGameData = async (gameId: string): Promise<GameDetailsResponseDTO> => {
  try {
    const response = await axiosInstance.get<GameDetailsResponseDTO>(`/games/${gameId}/details`);
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw new Error("Failed to fetch game data");
  }
};

// Hàm tạo phiên game
export const createGameSession = async (
  quizId: string
): Promise<CreateGameSessionResponse> => {
  try {
    console.log("Creating game session for quizId:", quizId);
    const response = await axiosInstance.post<CreateGameSessionResponse>(
      `/games/create`,
      {
        quizId,
      }
    );
    console.log("Create game session response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error creating game session:", error);
    handleApiError(error);
    throw error;
  }
};

// Hàm hủy game
export const cancelGame = async (gameId: string): Promise<void> => {
  try {
    console.log("Canceling game:", gameId);
    const response = await axiosInstance.post(`/games/${gameId}/end`, {});
    console.log("Cancel game response status:", response.status);
    console.log("Game canceled successfully:", response.data);
  } catch (error) {
    console.error("Error canceling game:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    throw new Error(errorMessage);
  }
};

// Hàm bắt đầu game
export const startGame = async (gameId: string): Promise<void> => {
  try {
    console.log("Starting game:", gameId);
    const response = await axiosInstance.post(`/games/${gameId}/start`, {});
    console.log("Start game response status:", response.status);
    console.log("Game started successfully:", response.data);
  } catch (error) {
    console.error("Error starting game:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    throw new Error(errorMessage);
  }
};