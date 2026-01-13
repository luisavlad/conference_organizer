import { Link } from "react-router-dom";
import styles from "./ConferenceCard.module.css";

export default function ConferenceCard({ conference }) {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{conference.title}</h2>
      <p>{conference.description}</p>
      <p>Location: {conference.location}</p>

      <Link to={`/conferences/${conference.id}`}>See articles</Link>
    </div>
  );
}
