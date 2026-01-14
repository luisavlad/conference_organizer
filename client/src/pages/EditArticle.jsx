import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import articleRequests from "../api/articleRequests";
import styles from "./CreateConference.module.css";

export default function EditArticle() {
  const navigate = useNavigate();
  const { conferenceId, articleId } = useParams();
  const [article, setArticle] = useState(null);
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [pdfFile, setPdfFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const fetchedArticle = await articleRequests.getById(articleId);
        setArticle(fetchedArticle);
        setTitle(fetchedArticle.title);
        setSummary(fetchedArticle.summary);
      } catch (error) {
        console.error("Failed to fetch article:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [articleId]);

  // ---------------------------------------------------------
  // Handle drag events for file upload
  // ---------------------------------------------------------
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  };

  // ---------------------------------------------------------
  // Handle file drop for PDF upload
  // ---------------------------------------------------------
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files[0] && files[0].type === "application/pdf") {
      setPdfFile(files[0]);
    } else {
      alert("Please upload a PDF file");
    }
  };

  // ---------------------------------------------------------
  // Handle file selection from input
  // ---------------------------------------------------------
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setPdfFile(file);
    } else {
      alert("Please upload a PDF file");
    }
  };

  // ---------------------------------------------------------
  // Submit article update with new version
  // ---------------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!pdfFile) {
      alert("Please upload a PDF file");
      return;
    }

    const formData = new FormData();
    formData.append("pdf", pdfFile);
    formData.append("title", title);
    formData.append("summary", summary);

    try {
      await articleRequests.update(articleId, formData);
      navigate(`/conferences/${conferenceId}/articles/${articleId}`);
    } catch (error) {
      console.error("Failed to update article:", error);
      alert("Failed to update article");
    }
  };

  if (loading) {
    return <div className={styles.container}>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <h1>Update Article - Revision {article.currentVersion + 1}</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="summary">Summary</label>
          <textarea
            id="summary"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            required
            rows={5}
            className={styles.textarea}
          />
        </div>

        <div className={styles.formGroup}>
          <label>Upload Updated PDF</label>
          <div
            className={`${styles.dropZone} ${
              isDragging ? styles.dragging : ""
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className={styles.fileInput}
              id="pdfUpload"
            />
            <label htmlFor="pdfUpload" className={styles.fileLabel}>
              {pdfFile ? (
                <>
                  <span>✓ {pdfFile.name}</span>
                  <span className={styles.fileSize}>
                    ({(pdfFile.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                </>
              ) : (
                <>
                  <span>Drop PDF here or click to upload</span>
                  <span className={styles.hint}>Maximum file size: 10 MB</span>
                </>
              )}
            </label>
          </div>
        </div>

        <div className={styles.infoBox}>
          <p>
            <strong>Current Version:</strong> {article.currentVersion}
          </p>
          <p>
            <strong>Previous Status:</strong>{" "}
            {article.status.replace(/_/g, " ")}
          </p>
          <p>After update, status will be reset to "IN REVIEW"</p>
        </div>

        <div className={styles.buttonGroup}>
          <button
            type="button"
            onClick={() =>
              navigate(`/conferences/${conferenceId}/articles/${articleId}`)
            }
            className={styles.cancelButton}
          >
            Cancel
          </button>
          <button type="submit" className={styles.submitButton}>
            Submit Updated Version
          </button>
        </div>
      </form>
    </div>
  );
}
