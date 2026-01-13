const article = {
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
};

export default function About() {
  return (
    <div>
      <h1>About</h1>
      <p>About the conference organizer application</p>
    </div>
  );
}
