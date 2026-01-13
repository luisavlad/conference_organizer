import ConferenceCard from "../components/conferences/ConferenceCard";
import styles from "./Conferences.module.css";

const mockConferences = [
  {
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
  },
  {
    id: "b2c3d4e5-f6a7-8901-bcde-f12345678901",
    title: "AI & Machine Learning Summit 2026",
    description:
      "Explore cutting-edge AI research, deep learning applications, and the future of artificial intelligence in industry and academia.",
    location: "London, UK",
    startDate: "2026-09-10T08:00:00.000Z",
    endDate: "2026-09-12T18:00:00.000Z",
    submissionStart: "2026-02-15T00:00:00.000Z",
    submissionEnd: "2026-05-30T23:59:59.000Z",
    createdBy: "22222222-3333-4444-5555-666666666666",
    createdAt: "2025-11-20T14:15:00.000Z",
    updatedAt: "2025-12-05T09:20:00.000Z",
  },
  {
    id: "c3d4e5f6-a7b8-9012-cdef-123456789012",
    title: "Web Technologies & Development Conference",
    description:
      "Discover the latest in web development, frontend frameworks, backend architectures, and modern web standards.",
    location: "Berlin, Germany",
    startDate: "2026-04-20T09:00:00.000Z",
    endDate: "2026-04-22T17:00:00.000Z",
    submissionStart: "2026-01-10T00:00:00.000Z",
    submissionEnd: "2026-02-28T23:59:59.000Z",
    createdBy: "33333333-4444-5555-6666-777777777777",
    createdAt: "2025-12-10T11:45:00.000Z",
    updatedAt: "2025-12-10T11:45:00.000Z",
  },
  {
    id: "d4e5f6a7-b8c9-0123-def0-234567890123",
    title: "Cybersecurity and Privacy Symposium",
    description:
      "Address critical challenges in cybersecurity, data privacy, cryptography, and secure system design.",
    location: "Tokyo, Japan",
    startDate: "2026-11-05T09:00:00.000Z",
    endDate: "2026-11-08T17:00:00.000Z",
    submissionStart: "2026-04-01T00:00:00.000Z",
    submissionEnd: "2026-07-15T23:59:59.000Z",
    createdBy: "44444444-5555-6666-7777-888888888888",
    createdAt: "2025-12-15T16:00:00.000Z",
    updatedAt: "2025-12-18T10:30:00.000Z",
  },
  {
    id: "e5f6a7b8-c9d0-1234-ef01-345678901234",
    title: "Cloud Computing and Distributed Systems Forum",
    description:
      "Focus on cloud infrastructure, microservices, serverless computing, and distributed system architectures.",
    location: "Seattle, WA, USA",
    startDate: "2026-08-12T08:30:00.000Z",
    endDate: "2026-08-14T18:00:00.000Z",
    submissionStart: "2026-02-01T00:00:00.000Z",
    submissionEnd: "2026-05-01T23:59:59.000Z",
    createdBy: "55555555-6666-7777-8888-999999999999",
    createdAt: "2026-01-05T13:20:00.000Z",
    updatedAt: "2026-01-05T13:20:00.000Z",
  },
];

export default function Conferences() {
  return (
    <div className={styles.container}>
      <h1>Conferences</h1>
      <div className={styles.grid}>
        {mockConferences.map((conference) => (
          <div key={conference.id}>
            <ConferenceCard conference={conference} />
          </div>
        ))}
      </div>
    </div>
  );
}
