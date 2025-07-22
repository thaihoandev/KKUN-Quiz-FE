export interface UserRequestDTO {
    name: string;
    username: string;
    email: string;
    password: string;
}

export interface User {
    id: string;
    username: string;
    email: string;
    accessToken: string;
    refreshToken: string;
    avatar?: string;
    name: string;
}

export interface Option {
    optionId: string;
    optionText: string;
    correct: boolean;
    value?: boolean;
    correctAnswer?: string;
}

export interface Question {
    questionId: string;
    questionType:
        | "SINGLE_CHOICE"
        | "MULTIPLE_CHOICE"
        | "TRUE_FALSE"
        | "FILL_IN_THE_BLANK";
    questionText: string;
    options: Option[];
    timeLimit: number;
    points: number;
    imageUrl?: string;
}

export interface Host {
    userId: string;
    name: string;
    avatar: string | null;
}

export interface Quiz {
    quizId: string;
    title: string;
    description: string;
    host: Host;
    createdAt: string;
    updatedAt: string;
    status: "DRAFT" | "PUBLISHED" | "CLOSED" | "ARCHIVED";
    viewers: string[];
    editors: string[];
}
export interface CreateGameSessionResponse {
  gameId: string;
  quizId: string;
  hostId: string;
  pinCode: string;
  status: "WAITING" | "IN_PROGRESS" | "COMPLETED";
  startTime: string;
  endTime: string | null;
}
export interface PlayerResponse {
  playerId: string;
  nickname: string;
  gameId: string;
  score: number;
  inGame: boolean;
  userId?: string;
  avatar?: string;
  joinedAt?: string;
}