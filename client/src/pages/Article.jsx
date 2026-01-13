import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import styles from "./Article.module.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const mockComments = [
  {
    id: "123e4567-e89b-12d3-a456-426614174000",
    reviewId: "987e4567-e89b-12d3-a456-426614174999",
    text: "The methodology section needs more detail. Please clarify the sample selection process and explain why this approach was chosen over alternatives.",
    isVisibleToAuthor: true,
    createdAt: "2026-01-10T10:30:00Z",
  },
  {
    id: "223e4567-e89b-12d3-a456-426614174001",
    reviewId: "987e4567-e89b-12d3-a456-426614174999",
    text: "The results in Table 3 are impressive. However, have you considered the potential confounding variables mentioned in Smith et al. (2025)?",
    isVisibleToAuthor: true,
    createdAt: "2026-01-11T14:20:00Z",
  },
  {
    id: "323e4567-e89b-12d3-a456-426614174002",
    reviewId: "987e4567-e89b-12d3-a456-426614174999",
    text: "Internal note: This paper shows promise but needs major revisions before acceptance.",
    isVisibleToAuthor: false,
    createdAt: "2026-01-11T16:45:00Z",
  },
  {
    id: "423e4567-e89b-12d3-a456-426614174003",
    reviewId: "987e4567-e89b-12d3-a456-426614174999",
    text: "Excellent discussion section! The implications for future research are well articulated. Minor suggestion: consider adding a figure to visualize the conceptual framework.",
    isVisibleToAuthor: true,
    createdAt: "2026-01-12T09:15:00Z",
  },
];

export default function Article() {
  const [numPages, setNumPages] = useState(null);
  const [reviewText, setReviewText] = useState("");
  const [visibility, setVisibility] = useState("visible");

  const samplePdfUrl = "/mock/sample.pdf";

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  function formatDate(dateString) {
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function handleSendReview() {
    console.log({
      text: reviewText,
      isVisibleToAuthor: visibility === "visible",
      timestamp: new Date().toISOString(),
    });
    setReviewText("");
  }

  return (
    <div className={styles.container}>
      {/* PDF Viewer Section */}
      <div className={styles.pdfSection}>
        <h2>Research Article PDF</h2>
        <div className={styles.pdfViewer}>
          <Document
            file={samplePdfUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={<div>Loading PDF...</div>}
          >
            {Array.from(new Array(numPages), (el, index) => (
              <Page
                key={`page_${index + 1}`}
                pageNumber={index + 1}
                width={800}
              />
            ))}
          </Document>
        </div>
      </div>

      {/* Comments Section */}
      <div className={styles.commentsSection}>
        <h2>Review Comments ({mockComments.length})</h2>

        <div className={styles.writeReview}>
          <textarea
            className={styles.reviewInput}
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Write your review comment..."
            rows={4}
          />
          <div className={styles.reviewActions}>
            <select
              className={styles.visibilitySelect}
              value={visibility}
              onChange={(e) => setVisibility(e.target.value)}
            >
              <option value="visible">Visible to Author</option>
              <option value="internal">Internal Only</option>
            </select>
            <button className={styles.sendButton} onClick={handleSendReview}>
              Send
            </button>
          </div>
        </div>

        <div className={styles.commentsList}>
          {mockComments.map((comment) => (
            <div key={comment.id} className={styles.comment}>
              <div className={styles.commentHeader}>
                <span className={styles.commentId}>
                  {comment.id.substring(0, 8)}...
                </span>
                <span className={styles.commentDate}>
                  {formatDate(comment.createdAt)}
                </span>
              </div>
              <p className={styles.commentText}>{comment.text}</p>
              <span
                className={`${styles.commentBadge} ${
                  comment.isVisibleToAuthor
                    ? styles.visibleBadge
                    : styles.hiddenBadge
                }`}
              >
                {comment.isVisibleToAuthor
                  ? "Visible to Author"
                  : "Internal Only"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
