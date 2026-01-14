import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import commentRequests from "../api/commentRequests";
import articleRequests from "../api/articleRequests";
import { UserContext } from "../contexts/UserContext";
import styles from "./Article.module.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function Article() {
  const { articleId } = useParams();
  const { currentUser } = useContext(UserContext);
  const [numPages, setNumPages] = useState(null);
  const [reviewText, setReviewText] = useState("");
  const [visibility, setVisibility] = useState("visible");
  const [comments, setComments] = useState([]);
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [fetchedArticle, fetchedComments] = await Promise.all([
          articleRequests.getById(articleId),
          commentRequests.getByArticleId(articleId),
        ]);
        setArticle(fetchedArticle);
        setComments(fetchedComments);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [articleId]);

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

  async function handleSendReview() {
    if (!reviewText.trim()) return;

    try {
      const isPublic = canWriteInternalComments
        ? visibility === "visible"
        : true;

      await commentRequests.create({
        text: reviewText,
        isPublic,
        articleId,
        userId: currentUser.id,
      });

      // Refetch comments to include the new one
      const updatedComments = await commentRequests.getByArticleId(articleId);
      setComments(updatedComments);
      setReviewText("");
      setVisibility("visible"); // Reset to default
    } catch (error) {
      console.error("Failed to post comment:", error);
    }
  }

  async function handleStatusChange(newStatus) {
    try {
      const updatedArticle = await articleRequests.updateStatus(
        articleId,
        newStatus
      );
      setArticle(updatedArticle);
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  }

  if (!article || loading) {
    return <div className={styles.container}>Loading article...</div>;
  }

  const isOrganizer = currentUser?.role === "ORGANIZER";
  const isAssignedReviewer =
    currentUser?.id === article.reviewer1Id ||
    currentUser?.id === article.reviewer2Id;
  const canEditStatus = isOrganizer || isAssignedReviewer;
  const isAuthor = currentUser?.id === article.authorId;
  const canUploadNewVersion = isAuthor && article.status === "REVISION_REQUIRED";

  // Authors can only see and write public comments
  const canWriteInternalComments = isOrganizer || isAssignedReviewer;

  // Filter comments based on visibility permissions
  const visibleComments = comments.filter((comment) => {
    if (comment.isPublic) return true;
    // Internal comments: only organizers and assigned reviewers can see
    return isOrganizer || isAssignedReviewer;
  });

  return (
    <div className={styles.container}>
      {/* PDF Viewer Section */}
      <div className={styles.pdfSection}>
        <div className={styles.headerWithStatus}>
          <h2>Research Article PDF</h2>
          <div className={styles.statusContainer}>
            <label>Status:</label>
            {canEditStatus ? (
              <select
                className={styles.statusSelect}
                value={article.status}
                onChange={(e) => handleStatusChange(e.target.value)}
              >
                <option value="IN_REVIEW">In Review</option>
                <option value="REVISION_REQUIRED">Revision Required</option>
                <option value="ACCEPTED">Accepted</option>
                <option value="REJECTED">Rejected</option>
              </select>
            ) : (
              <span
                className={`${styles.statusBadge} ${
                  styles[article.status.toLowerCase()]
                }`}
              >
                {article.status.replace(/_/g, " ")}
              </span>
            )}
          </div>
        </div>

        {canUploadNewVersion && (
          <div className={styles.revisionNotice}>
            <p>⚠️ Revision required! Please upload a new version of your article.</p>
            <button
              className={styles.uploadNewVersionBtn}
              onClick={() => window.location.href = `/conferences/${article.conferenceId}/articles/${articleId}/edit`}
            >
              Upload New Version
            </button>
          </div>
        )}

        {article.reviewers && article.reviewers.length > 0 && (
          <div className={styles.reviewersInfo}>
            <h3>Assigned Reviewers:</h3>
            <ul className={styles.reviewersList}>
              {article.reviewers.map((reviewer) => (
                <li key={reviewer.id}>
                  <strong>{reviewer.name}</strong>
                  <span className={styles.reviewerEmail}>{reviewer.email}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className={styles.pdfViewer}>
          <Document
            file={`${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:8080'}/api/articles/${articleId}/pdf`}
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
        <h2>Review Comments ({visibleComments.length})</h2>

        <div className={styles.writeReview}>
          <textarea
            className={styles.reviewInput}
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Write your review comment..."
            rows={4}
          />
          <div className={styles.reviewActions}>
            {canWriteInternalComments && (
              <select
                className={styles.visibilitySelect}
                value={visibility}
                onChange={(e) => setVisibility(e.target.value)}
              >
                <option value="visible">Visible to Author</option>
                <option value="internal">Internal Only</option>
              </select>
            )}
            <button className={styles.sendButton} onClick={handleSendReview}>
              Send
            </button>
          </div>
        </div>

        {visibleComments.length > 0 ? (
          <div className={styles.commentsList}>
            {visibleComments.map((comment) => (
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
                    comment.isPublic ? styles.visibleBadge : styles.hiddenBadge
                  }`}
                >
                  {comment.isPublic ? "Visible to Author" : "Internal Only"}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.commentsList}>
            <p>No comments yet. Be the first to leave feedback!</p>
          </div>
        )}
      </div>
    </div>
  );
}
