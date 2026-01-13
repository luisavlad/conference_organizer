import { useState, useEffect } from "react";
import ConferenceCard from "../components/conferences/ConferenceCard";
import conferenceRequests from "../api/conferenceRequests";
import styles from "./Conferences.module.css";

export default function Conferences() {
  const [conferences, setConferences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchConferences = async () => {
      try {
        setLoading(true);
        const data = await conferenceRequests.getAll();
        setConferences(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message || "Failed to load conferences");
        console.error("Error fetching conferences:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchConferences();
  }, []);

  if (loading) {
    return (
      <div className={styles.container}>
        <h1>Conferences</h1>
        <p>Loading conferences...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <h1>Conferences</h1>
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1>Conferences</h1>
      <div className={styles.grid}>
        {conferences.map((conference) => (
          <div key={conference.id}>
            <ConferenceCard conference={conference} />
          </div>
        ))}
      </div>
    </div>
  );
}
