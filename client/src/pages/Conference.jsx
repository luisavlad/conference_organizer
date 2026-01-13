const conference = {
  id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  title: "International Conference on Software Engineering 2026",
  description:
    "Join leading researchers and practitioners to discuss the latest advances in software engineering, development methodologies, and emerging technologies.",
  location: "San Francisco, CA, USA",
  startDate: "2026-06-15T09:00:00.000Z",
  endDate: "2026-06-18T17:00:00.000Z",
  submissionStart: "2026-01-01T00:00:00.000Z",
  submissionEnd: "2026-03-31T23:59:59.000Z",
  createdBy: "11111111-2222-3333-4444-555555555555",
  createdAt: "2025-12-01T10:30:00.000Z",
  updatedAt: "2025-12-01T10:30:00.000Z",
};

const mockArticles = [
  {
    id: "f1e2d3c4-b5a6-7890-abcd-ef1234567890",
    title: "A Novel Approach to Distributed System Architecture",
    summary:
      "This paper presents a new framework for designing scalable distributed systems using microservices and event-driven architecture. We demonstrate improved performance and fault tolerance through comprehensive benchmarking.",
    pdfPath: "/uploads/articles/novel-approach-distributed-systems.pdf",
    status: "under_review",
    authorId: "11111111-2222-3333-4444-555555555555",
    conferenceId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    currentVersion: 1,
    reviewerId: "66666666-7777-8888-9999-000000000000",
    createdAt: "2026-01-05T14:30:00.000Z",
    updatedAt: "2026-01-05T14:30:00.000Z",
  },
  {
    id: "a2b3c4d5-e6f7-8901-bcde-f12345678901",
    title:
      "Machine Learning Optimization Techniques for Real-Time Applications",
    summary:
      "We explore various optimization strategies for deploying machine learning models in production environments with strict latency requirements. Our results show up to 40% reduction in inference time while maintaining accuracy.",
    pdfPath: "/uploads/articles/ml-optimization-real-time.pdf",
    status: "accepted",
    authorId: "22222222-3333-4444-5555-666666666666",
    conferenceId: "b2c3d4e5-f6a7-8901-bcde-f12345678901",
    currentVersion: 2,
    reviewerId: "77777777-8888-9999-0000-111111111111",
    createdAt: "2025-12-20T10:15:00.000Z",
    updatedAt: "2026-01-08T16:45:00.000Z",
  },
];

import ArticleCard from "../components/articles/ArticleCard";
import styles from "./Conference.module.css";

export default function Conference() {
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
        <p>
          Submission Period:{" "}
          {new Date(conference.submissionStart).toLocaleDateString()} -{" "}
          {new Date(conference.submissionEnd).toLocaleDateString()}
        </p>
        <p>Created: {new Date(conference.createdAt).toLocaleDateString()}</p>

        <div className={styles.join_container}>
          <button className={styles.join_button}>Join</button>
        </div>
      </div>

      <>
        <h2>Submitted Articles</h2>
        <div className={styles.articlesSection}>
          {mockArticles.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              conferenceId={conference.id}
            />
          ))}
        </div>
      </>
    </div>
  );
}
