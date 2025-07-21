// QuizCreateModal.tsx
import React, {useRef, useEffect} from "react";

interface QuizCreateModalProps {
    show: boolean;
    onClose: () => void;
    onSave: (quizData: any) => Promise<void>;
    loading?: boolean;
}

const QuizCreateModal: React.FC<QuizCreateModalProps> = ({
    show,
    onClose,
    onSave,
    loading = false,
}) => {
    const [title, setTitle] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [titleError, setTitleError] = React.useState<string | null>(null);
    const modalRef = useRef<HTMLDivElement>(null);
    const titleInputRef = useRef<HTMLInputElement>(null);

    // Focus input when modal opens
    useEffect(() => {
        if (show && titleInputRef.current) {
            titleInputRef.current.focus();
        }
    }, [show]);

    // Handle ESC key to close
    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === "Escape" && !loading) onClose();
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [loading, onClose]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim()) {
            setTitleError("Please enter a quiz title");
            return;
        }

        const quizData = {
            title: title.trim(),
            description: description.trim(),
            status: "DRAFT",
        };

        await onSave(quizData);
        if (!loading) {
            setTitle("");
            setDescription("");
            setTitleError(null);
        }
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setTitle(value);
        if (value.trim()) {
            setTitleError(null);
        }
    };

    if (!show) return null;

    return (
        <div
            className="modal fade show d-block position-fixed"
            tabIndex={-1}
            style={{
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                backgroundColor: "rgba(0, 0, 0, 0.75)",
                backdropFilter: "blur(5px)",
                zIndex: 1100, // Higher z-index to ensure it stays on top
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                overflow: "auto",
            }}
            onClick={onClose}
        >
            <div
                className="modal-dialog modal-dialog-centered modal-lg"
                onClick={(e) => e.stopPropagation()}
                ref={modalRef}
                style={{maxWidth: "600px", width: "100%"}}
            >
                <div
                    className="modal-content border-0 shadow-lg"
                    style={{borderRadius: "12px"}}
                >
                    <div
                        className="modal-header bg-gradient-primary text-white px-4 py-3 position-relative"
                        style={{
                            background:
                                "linear-gradient(45deg, #6a11cb, #2575fc)",
                            zIndex: 1101, // Ensure header is above content
                        }}
                    >
                        <h5 className="modal-title fw-bold d-flex align-items-center">
                            <i
                                className="bx bx-plus-circle me-2"
                                style={{fontSize: "1.2em"}}
                            ></i>
                            Create New Quiz
                        </h5>
                        <button
                            type="button"
                            className="btn-close btn-close-white position-absolute top-0 end-0 mt-2 me-2"
                            onClick={onClose}
                            disabled={loading}
                            aria-label="Close"
                            style={{
                                zIndex: 1102, // Ensure button is above header
                                opacity: 0.8,
                                transition: "opacity 0.2s ease",
                                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23fff'%3e%3cpath d='M.293.293a1 1 0 011.414 0L8 6.586 14.293.293a1 1 0 111.414 1.414L9.414 8l6.293 6.293a1 1 0 01-1.414 1.414L8 9.414l-6.293 6.293a1 1 0 01-1.414-1.414L6.586 8 .293 1.707a1 1 0 010-1.414z'/%3e%3c/svg%3e")`,
                                backgroundSize: "1em",
                                backgroundPosition: "center",
                            }}
                            onMouseEnter={(e) =>
                                (e.currentTarget.style.opacity = "1")
                            }
                            onMouseLeave={(e) =>
                                (e.currentTarget.style.opacity = "0.8")
                            }
                        ></button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div
                            className="modal-body p-4 bg-light"
                            style={{backgroundColor: "#f8f9fa"}}
                        >
                            <div className="mb-4">
                                <label
                                    htmlFor="quizTitle"
                                    className="form-label fw-semibold text-dark mb-2"
                                >
                                    Quiz Title
                                    <span className="text-danger ms-1">*</span>
                                </label>
                                <div className="input-group">
                                    <span className="input-group-text bg-white">
                                        <i className="bx bx-pencil text-muted"></i>
                                    </span>
                                    <input
                                        ref={titleInputRef}
                                        type="text"
                                        className={`form-control form-control-lg shadow-sm ${titleError ? "is-invalid" : ""}`}
                                        id="quizTitle"
                                        value={title}
                                        onChange={handleTitleChange}
                                        placeholder="Enter a captivating quiz title"
                                        required
                                        disabled={loading}
                                        maxLength={100}
                                        style={{borderRadius: "0 8px 8px 0"}}
                                    />
                                    {titleError && (
                                        <div className="invalid-feedback d-block mt-1">
                                            {titleError}
                                        </div>
                                    )}
                                </div>
                                <small className="text-muted d-block mt-1">
                                    {title.length}/100 characters
                                </small>
                            </div>
                            <div className="mb-0">
                                <label
                                    htmlFor="quizDescription"
                                    className="form-label fw-semibold text-dark mb-2"
                                >
                                    Description
                                    <span className="text-muted ms-1 fw-normal">
                                        (optional)
                                    </span>
                                </label>
                                <textarea
                                    className="form-control shadow-sm"
                                    id="quizDescription"
                                    value={description}
                                    onChange={(e) =>
                                        setDescription(e.target.value)
                                    }
                                    rows={4}
                                    placeholder="Describe your quiz - what makes it special?"
                                    disabled={loading}
                                    maxLength={500}
                                    style={{
                                        resize: "vertical",
                                        borderRadius: "8px",
                                        backgroundColor: "white",
                                    }}
                                />
                                <small className="text-muted d-block mt-1">
                                    {description.length}/500 characters
                                </small>
                            </div>
                        </div>
                        <div
                            className="modal-footer bg-white px-4 py-3 border-top"
                            style={{borderColor: "#e9ecef"}}
                        >
                            <button
                                type="button"
                                className="btn btn-outline-secondary px-4 py-2 fw-medium"
                                onClick={onClose}
                                disabled={loading}
                                style={{
                                    borderRadius: "8px",
                                    transition: "all 0.2s ease",
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary px-4 py-2 fw-medium"
                                disabled={loading || !title.trim()}
                                style={{
                                    borderRadius: "8px",
                                    transition: "all 0.2s ease",
                                    background:
                                        "linear-gradient(45deg, #6a11cb, #2575fc)",
                                }}
                            >
                                {loading ? (
                                    <>
                                        <span
                                            className="spinner-border spinner-border-sm me-2"
                                            role="status"
                                            aria-hidden="true"
                                            style={{
                                                borderColor: "white",
                                                borderRightColor: "transparent",
                                            }}
                                        ></span>
                                        Creating...
                                    </>
                                ) : (
                                    <>
                                        <i className="bx bx-check me-1"></i>
                                        Create Quiz
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default QuizCreateModal;
