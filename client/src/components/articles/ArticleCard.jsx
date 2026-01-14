import { Link } from "react-router-dom";
import styles from "./ArticleCard.module.css";

export default function ArticleCard({ article, conferenceId, currentUser }) {
  const { id: articleId } = article;

  const isAuthor = article.authorId === currentUser.id;
  const isOrganizer = currentUser.role === "ORGANIZER";
  const isAssignedReviewer =
    article.reviewer1Id === currentUser.id ||
    article.reviewer2Id === currentUser.id;

  const canAccess = isAuthor || isOrganizer || isAssignedReviewer;
  const needsRevision =
    isAuthor &&
    (article.status === "REVISION_REQUIRED" || article.status === "REJECTED");

  const content = (
    <>
      <h3 className={styles.title}>{article.title}</h3>
      <p>{article.summary}</p>
      <p>Status: {article.status.replace(/_/g, " ")}</p>
      <p>Version: {article.currentVersion}</p>
      <p>Submitted: {new Date(article.createdAt).toLocaleDateString()}</p>
      <p>Last Updated: {new Date(article.updatedAt).toLocaleDateString()}</p>
      {needsRevision && (
        <Link
          to={`/conferences/${conferenceId}/articles/${articleId}/edit`}
          className={styles.editButton}
          onClick={(e) => e.stopPropagation()}
        >
          Edit Article
        </Link>
      )}
    </>
  );

  if (canAccess) {
    return (
      <Link
        className={styles.container}
        to={`/conferences/${conferenceId}/articles/${articleId}`}
      >
        {content}
      </Link>
    );
  }

  return (
    <div className={`${styles.container} ${styles.disabled}`}>{content}</div>
  );
}
