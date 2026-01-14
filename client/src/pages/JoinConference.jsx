import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import articleRequests from "../api/articleRequests";
import styles from "./CreateConference.module.css";

export default function JoinConference() {
  const { id: conferenceId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useUser();

  const [formData, setFormData] = useState({
    title: "",
    summary: "",
  });

  const [pdfFile, setPdfFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [errors, setErrors] = useState({});
  const [uploading, setUploading] = useState(false);

  // ---------------------------------------------------------
  // Handle form input changes
  // ---------------------------------------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // ---------------------------------------------------------
  // Handle drag events for file upload
  // ---------------------------------------------------------
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // ---------------------------------------------------------
  // Handle file drop for PDF upload
  // ---------------------------------------------------------
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  // ---------------------------------------------------------
  // Handle file selection from input
  // ---------------------------------------------------------
  const handleFileInput = (e) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  // ---------------------------------------------------------
  // Validate and set uploaded PDF file
  // ---------------------------------------------------------
  const handleFile = (file) => {
    if (file.type !== "application/pdf") {
      setErrors((prev) => ({
        ...prev,
        pdf: "Only PDF files are allowed",
      }));
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        pdf: "File size must be less than 10MB",
      }));
      return;
    }

    setPdfFile(file);
    setErrors((prev) => ({
      ...prev,
      pdf: "",
    }));
  };

  // ---------------------------------------------------------
  // Validate article submission form
  // ---------------------------------------------------------
  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!pdfFile) {
      newErrors.pdf = "PDF file is required";
    }

    return newErrors;
  };

  // ---------------------------------------------------------
  // Submit article to conference
  // ---------------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setUploading(true);

      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("summary", formData.summary);
      formDataToSend.append("conferenceId", conferenceId);
      formDataToSend.append("authorId", currentUser.id);
      formDataToSend.append("pdf", pdfFile);

      const createdArticle = await articleRequests.create(formDataToSend);
      console.log("Success! Article created:", createdArticle);

      navigate(`/conferences/${conferenceId}`);
    } catch (error) {
      console.error("Failed to create article:", error);
      setErrors((prev) => ({
        ...prev,
        submit: "Failed to submit article. Please try again.",
      }));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1>Submit Article</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="title">Article Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={errors.title ? styles.inputError : ""}
          />
          {errors.title && <span className={styles.error}>{errors.title}</span>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="summary">Summary</label>
          <textarea
            id="summary"
            name="summary"
            value={formData.summary}
            onChange={handleChange}
            rows="5"
          />
        </div>

        <div className={styles.formGroup}>
          <label>PDF File *</label>
          <div
            className={`${styles.dropZone} ${
              dragActive ? styles.dragActive : ""
            } ${errors.pdf ? styles.inputError : ""}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              id="pdfInput"
              accept=".pdf"
              onChange={handleFileInput}
              className={styles.fileInput}
            />
            <label htmlFor="pdfInput" className={styles.fileLabel}>
              {pdfFile ? (
                <>
                  <span>📄 {pdfFile.name}</span>
                  <span className={styles.fileSize}>
                    ({(pdfFile.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                </>
              ) : (
                <>
                  <span>Drag and drop PDF here</span>
                  <span>or click to browse</span>
                </>
              )}
            </label>
          </div>
          {errors.pdf && <span className={styles.error}>{errors.pdf}</span>}
        </div>

        {errors.submit && <div className={styles.error}>{errors.submit}</div>}

        <button
          type="submit"
          className={styles.submitButton}
          disabled={uploading}
        >
          {uploading ? "Submitting..." : "Submit Article"}
        </button>
      </form>
    </div>
  );
}
