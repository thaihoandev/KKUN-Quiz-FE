import HeaderProfile from "@/components/headers/HeaderProfile";
import NavigationMenuProfile from "@/components/NavigationMenuProfile";
import React, {useEffect, useState} from "react";
import {getCurrentUser} from "@/services/userService";
import {createQuiz, getQuizzesByUser} from "@/services/quizService"; // New import
import {useAuth} from "@/hooks/useAuth";
import QuizSubCard from "@/components/cards/QuizSubCard";
import QuizCreateModal from "@/components/modals/QuizCreateModal";
import {useNavigate} from "react-router-dom";

const QuizzesPage = () => {
    const testMenuItems = [
        {path: "/profile", icon: "bx-user", label: "Profile"},
        {path: "/classes", icon: "bx-chalkboard", label: "Classes"},
        {path: "/courses", icon: "bx-book", label: "Courses"},
        {path: "/quizzes", icon: "bx-task", label: "Quizzes"},
    ];
    const navigate = useNavigate();
    const {user} = useAuth();
    const [profile, setProfile] = useState<any>(null);
    const [quizzes, setQuizzes] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [creatingQuiz, setCreatingQuiz] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch user profile
                const profileData = await getCurrentUser();
                setProfile(profileData);
                // Fetch user quizzes if user exists
                if (profileData?.userId) {
                    const quizzesData = await getQuizzesByUser(
                        profileData.userId,
                    );
                    setQuizzes(quizzesData);
                }
            } catch (err: any) {
                setError("Failed to load user information or quizzes");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Separate quizzes by status
    const publishedQuizzes = quizzes.filter(
        (quiz) => quiz.status === "PUBLISHED",
    );
    const draftQuizzes = quizzes.filter((quiz) => quiz.status === "DRAFT");
    const archivedQuizzes = quizzes.filter(
        (quiz) => quiz.status === "ARCHIVED",
    );

    const handleCreateQuiz = () => {
        setShowCreateModal(true); // Show the modal
    };

    const handleCloseModal = () => {
        setShowCreateModal(false); // Hide the modal
    };
    const handleSaveQuiz = async (quizData: any) => {
        try {
            setCreatingQuiz(true);
            const newQuiz = {
                ...quizData,
                userId: profile.userId,
            };
            // Assuming createQuiz returns the created quiz with an id
            const createdQuiz = await createQuiz(newQuiz);
            setShowCreateModal(false);
            navigate(`/quizzes/${createdQuiz.quizId}`);
        } catch (err) {
            console.error("Failed to create quiz:", err);
            setError("Failed to create quiz");
        } finally {
            setCreatingQuiz(false);
        }
    };
    return (
        <div className="container-xxl flex-grow-1 container-p-y">
            <HeaderProfile profile={profile} />

            <NavigationMenuProfile menuItems={testMenuItems} />

            <div className="row">
                <div className="col-xl-12 d-flex justify-content-end">
                    <button
                        onClick={handleCreateQuiz}
                        className="btn btn-primary mb-5"
                        disabled={creatingQuiz}
                    >
                        <i className="icon-base bx bx-edit icon-sm me-2"></i>
                        Create new quiz
                    </button>
                </div>
                <div className="col-xl-12">
                    <div className="nav-align-top nav-tabs-shadow">
                        <ul className="nav nav-tabs nav-fill" role="tablist">
                            <li className="nav-item">
                                <button
                                    type="button"
                                    className="nav-link active"
                                    role="tab"
                                    data-bs-toggle="tab"
                                    data-bs-target="#navs-justified-published"
                                    aria-controls="navs-justified-published"
                                    aria-selected="true"
                                >
                                    <span className="d-none d-sm-inline-flex align-items-center">
                                        <i className="icon-base bx bx-home icon-sm me-1_5"></i>
                                        Published
                                        <span className="badge rounded-pill badge-center h-px-20 w-px-20 bg-label-danger ms-1_5">
                                            {publishedQuizzes.length}
                                        </span>
                                    </span>
                                    <i className="icon-base bx bx-home icon-sm d-sm-none"></i>
                                </button>
                            </li>
                            <li className="nav-item">
                                <button
                                    type="button"
                                    className="nav-link"
                                    role="tab"
                                    data-bs-toggle="tab"
                                    data-bs-target="#navs-justified-draft"
                                    aria-controls="navs-justified-draft"
                                    aria-selected="false"
                                >
                                    <span className="d-none d-sm-inline-flex align-items-center">
                                        <i className="icon-base bx bx-user icon-sm me-1_5"></i>
                                        Draft
                                        <span className="badge rounded-pill badge-center h-px-20 w-px-20 bg-label-danger ms-1_5">
                                            {draftQuizzes.length}
                                        </span>
                                    </span>
                                    <i className="icon-base bx bx-user icon-sm d-sm-none"></i>
                                </button>
                            </li>
                            <li className="nav-item">
                                <button
                                    type="button"
                                    className="nav-link"
                                    role="tab"
                                    data-bs-toggle="tab"
                                    data-bs-target="#navs-justified-archived"
                                    aria-controls="navs-justified-archived"
                                    aria-selected="false"
                                >
                                    <span className="d-none d-sm-inline-flex align-items-center">
                                        <i className="icon-base bx bx-message-square icon-sm me-1_5"></i>
                                        Archived
                                        <span className="badge rounded-pill badge-center h-px-20 w-px-20 bg-label-danger ms-1_5">
                                            {archivedQuizzes.length}
                                        </span>
                                    </span>
                                    <i className="icon-base bx bx-message-square icon-sm d-sm-none"></i>
                                </button>
                            </li>
                        </ul>
                        <div className="tab-content">
                            <div
                                className="tab-pane fade show active"
                                id="navs-justified-published"
                                role="tabpanel"
                            >
                                {publishedQuizzes.map((quiz) => (
                                    <QuizSubCard key={quiz.id} quiz={quiz} />
                                ))}
                            </div>
                            <div
                                className="tab-pane fade"
                                id="navs-justified-draft"
                                role="tabpanel"
                            >
                                {draftQuizzes.map((quiz) => (
                                    <QuizSubCard key={quiz.id} quiz={quiz} />
                                ))}
                            </div>
                            <div
                                className="tab-pane fade"
                                id="navs-justified-archived"
                                role="tabpanel"
                            >
                                {archivedQuizzes.map((quiz) => (
                                    <QuizSubCard key={quiz.id} quiz={quiz} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <QuizCreateModal
                show={showCreateModal}
                onClose={handleCloseModal}
                onSave={handleSaveQuiz}
                loading={creatingQuiz}
            />
        </div>
    );
};

export default QuizzesPage;
