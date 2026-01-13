import { Link } from "react-router-dom";
import styles from "./ArticleCard.module.css";

export default function ArticleCard({ article, conferenceId }) {
  const { id: articleId } = article;

  return (
    <Link
      className={styles.container}
      to={`/conferences/${conferenceId}/articles/${articleId}`}
    >
      <h3 className={styles.title}>{article.title}</h3>
      <p>{article.summary}</p>
      <p>Status: {article.status.replace(/_/g, " ")}</p>
      <p>Version: {article.currentVersion}</p>
      <p>Submitted: {new Date(article.createdAt).toLocaleDateString()}</p>
      <p>Last Updated: {new Date(article.updatedAt).toLocaleDateString()}</p>
    </Link>
  );
}
