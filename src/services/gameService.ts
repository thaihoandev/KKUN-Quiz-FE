import axiosInstance from "./axiosInstance";
import {handleApiError} from "@/utils/apiErrorHandler";

interface CreateGameSessionResponse {
    gameId: string;
    quizId: string;
    hostId: string;
    pinCode: string;
    status: "WAITING" | "IN_PROGRESS" | "COMPLETED";
    startTime: string;
    endTime: string | null;
}

export const createGameSession = async (
    quizId: string,
): Promise<CreateGameSessionResponse> => {
    try {
        const response = await axiosInstance.post(`/games/create`, {
            quizId,
        });

        return response.data as CreateGameSessionResponse;
    } catch (error) {
        handleApiError(error);
        throw error;
    }
};
