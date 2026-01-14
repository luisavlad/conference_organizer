import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import ArticleCard from "../components/articles/ArticleCard";
import conferenceRequests from "../api/conferenceRequests";
import articleRequests from "../api/articleRequests";
import { useUser } from "../contexts/UserContext";
import styles from "./Conference.module.css";

export default function Conference() {
  const { id } = useParams();
  const { currentUser } = useUser();
  const [conference, setConference] = useState(null);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch all conferences to find the current one
        const allConferences = await conferenceRequests.getAll();
        const currentConference = allConferences.find((conf) => conf.id === id);
        setConference(currentConference);

        // Fetch articles for this conference
        const conferenceArticles = await articleRequests.getByConferenceId(id);
        setArticles(conferenceArticles);
      } catch (error) {
        console.error("Failed to fetch conference data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return <div className={styles.container}>Loading...</div>;
  }

  if (!conference) {
    return <div className={styles.container}>Conference not found</div>;
  }

  const hasJoined = articles.some(
    (article) => article.authorId === currentUser.id
  );
  const isAuthor = currentUser.role === "AUTHOR";

  return (
    <div className={styles.container}>
      <div className={styles.conferece}>
        <h1 className={styles.title}>{conference.title}</h1>
        <p>{conference.description}</p>
        <p>Location: {conference.location}</p>
        <p>
          Conference Dates:{" "}
          {new Date(conference.startDate).toLocaleDateString()} -{" "}
          {new Date(conference.endDate).toLocaleDateString()}
        </p>

        {isAuthor && (
          <div className={styles.join_container}>
            {!hasJoined ? (
              <Link
                to={`/conferences/${id}/join`}
                className={styles.join_button}
              >
                Join
              </Link>
            ) : (
              <button className={styles.join_button} disabled>
                Joined
              </button>
            )}
          </div>
        )}
      </div>

      <>
        <h2>Submitted Articles</h2>
        <div className={styles.articlesSection}>
          {articles.length > 0 ? (
            articles.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                conferenceId={conference.id}
              />
            ))
          ) : (
            <p>No articles submitted yet.</p>
          )}
        </div>
      </>
    </div>
  );
}
