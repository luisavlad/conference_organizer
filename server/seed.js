const sequelize = require("./config/sequelize");
const { User, Conference, Article, Review, Comment } = require("./models");

async function seedDatabase() {
  try {
    console.log("🌱 Starting database seeding...");

    await sequelize.sync({ force: true });
    console.log("✅ Database synced");

    const users = await User.bulkCreate([
      {
        id: "a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d",
        name: "John Smith",
        email: "john.reviewer@conference.com",
        role: "REVIEWER",
        isAvailable: true,
      },
      {
        id: "b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d6e",
        name: "Sarah Johnson",
        email: "sarah.author@conference.com",
        role: "AUTHOR",
        isAvailable: true,
      },
      {
        id: "c3d4e5f6-a7b8-4c5d-0e1f-2a3b4c5d6e7f",
        name: "Michael Chen",
        email: "michael.organizer@conference.com",
        role: "ORGANIZER",
        isAvailable: true,
      },
      {
        id: "d4e5f6a7-b8c9-4d5e-1f2a-3b4c5d6e7f8a",
        name: "David Wilson",
        email: "david.reviewer@conference.com",
        role: "REVIEWER",
        isAvailable: true,
      },
      {
        id: "e5f6a7b8-c9d0-4e5f-2a3b-4c5d6e7f8a9b",
        name: "Lisa Anderson",
        email: "lisa.author@conference.com",
        role: "AUTHOR",
        isAvailable: true,
      },
      {
        id: "f6a7b8c9-d0e1-4f5a-3b4c-5d6e7f8a9b0c",
        name: "Robert Brown",
        email: "robert.reviewer@conference.com",
        role: "REVIEWER",
        isAvailable: true,
      },
    ]);
    console.log(`✅ Created ${users.length} users`);

    const conferences = await Conference.bulkCreate([
      {
        id: "conf-001-uuid-here-0000-000000000001",
        title: "International Conference on Software Engineering 2026",
        description:
          "Leading conference on software engineering research and practice",
        location: "San Francisco, CA",
        startDate: new Date("2026-06-15"),
        endDate: new Date("2026-06-18"),
        submissionStart: new Date("2026-01-01"),
        submissionEnd: new Date("2026-03-31"),
        createdBy: "c3d4e5f6-a7b8-4c5d-0e1f-2a3b4c5d6e7f", // Michael Chen
      },
      {
        id: "conf-002-uuid-here-0000-000000000002",
        title: "AI and Machine Learning Symposium 2026",
        description:
          "Exploring the latest advances in artificial intelligence and machine learning",
        location: "Boston, MA",
        startDate: new Date("2026-09-20"),
        endDate: new Date("2026-09-23"),
        submissionStart: new Date("2026-02-01"),
        submissionEnd: new Date("2026-05-15"),
        createdBy: "c3d4e5f6-a7b8-4c5d-0e1f-2a3b4c5d6e7f", // Michael Chen
      },
      {
        id: "conf-003-uuid-here-0000-000000000003",
        title: "Web Technologies Conference 2026",
        description:
          "Modern web development frameworks, tools, and best practices",
        location: "Austin, TX",
        startDate: new Date("2026-11-10"),
        endDate: new Date("2026-11-12"),
        submissionStart: new Date("2026-03-01"),
        submissionEnd: new Date("2026-07-30"),
        createdBy: "c3d4e5f6-a7b8-4c5d-0e1f-2a3b4c5d6e7f", // Michael Chen
      },
    ]);
    console.log(`✅ Created ${conferences.length} conferences`);

    // Create articles
    const articles = await Article.bulkCreate([
      // Conference 1 - Software Engineering
      {
        id: "article-001-uuid-0000-000000000001",
        title: "Efficient Code Review Practices in Distributed Teams",
        summary:
          "This paper explores best practices for conducting code reviews in geographically distributed software development teams.",
        pdfPath: "/mock/sample.pdf",
        status: "under_review",
        authorId: "b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d6e", // Sarah Johnson
        conferenceId: "conf-001-uuid-here-0000-000000000001",
        currentVersion: 1,
      },
      {
        id: "article-002-uuid-0000-000000000002",
        title: "Microservices Architecture Patterns for Scalability",
        summary:
          "An analysis of various microservices patterns and their impact on system scalability and maintainability.",
        pdfPath: "/mock/sample.pdf",
        status: "under_review",
        authorId: "e5f6a7b8-c9d0-4e5f-2a3b-4c5d6e7f8a9b", // Lisa Anderson
        conferenceId: "conf-001-uuid-here-0000-000000000001",
        currentVersion: 1,
      },
      // Conference 2 - AI/ML
      {
        id: "article-003-uuid-0000-000000000003",
        title: "Deep Learning for Natural Language Understanding",
        summary:
          "Novel approaches to natural language understanding using transformer-based architectures.",
        pdfPath: "/mock/sample.pdf",
        status: "accepted",
        authorId: "b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d6e", // Sarah Johnson
        conferenceId: "conf-002-uuid-here-0000-000000000002",
        currentVersion: 2,
      },
      {
        id: "article-004-uuid-0000-000000000004",
        title: "Reinforcement Learning in Robotics Applications",
        summary:
          "Exploring the application of reinforcement learning algorithms in real-world robotics scenarios.",
        pdfPath: "/mock/sample.pdf",
        status: "revision_required",
        authorId: "e5f6a7b8-c9d0-4e5f-2a3b-4c5d6e7f8a9b", // Lisa Anderson
        conferenceId: "conf-002-uuid-here-0000-000000000002",
        currentVersion: 1,
      },
      // Conference 3 - Web Tech
      {
        id: "article-005-uuid-0000-000000000005",
        title: "Progressive Web Applications: A Comprehensive Study",
        summary:
          "Evaluating the performance and user experience of progressive web applications across different platforms.",
        pdfPath: "/mock/sample.pdf",
        status: "under_review",
        authorId: "b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d6e", // Sarah Johnson
        conferenceId: "conf-003-uuid-here-0000-000000000003",
        currentVersion: 1,
      },
      {
        id: "article-006-uuid-0000-000000000006",
        title: "WebAssembly Performance Optimization Techniques",
        summary:
          "A study on optimizing WebAssembly modules for improved performance in web applications.",
        pdfPath: "/mock/sample.pdf",
        status: "under_review",
        authorId: "e5f6a7b8-c9d0-4e5f-2a3b-4c5d6e7f8a9b", // Lisa Anderson
        conferenceId: "conf-003-uuid-here-0000-000000000003",
        currentVersion: 1,
      },
    ]);
    console.log(`✅ Created ${articles.length} articles`);

    // Create reviews (each article has at least 2 reviewers)
    const reviews = await Review.bulkCreate([
      // Article 1 reviews
      {
        articleId: "article-001-uuid-0000-000000000001",
        reviewerId: "a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d", // John Smith
        decision: "pending",
      },
      {
        articleId: "article-001-uuid-0000-000000000001",
        reviewerId: "d4e5f6a7-b8c9-4d5e-1f2a-3b4c5d6e7f8a", // David Wilson
        decision: "pending",
      },
      // Article 2 reviews
      {
        articleId: "article-002-uuid-0000-000000000002",
        reviewerId: "a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d", // John Smith
        decision: "pending",
      },
      {
        articleId: "article-002-uuid-0000-000000000002",
        reviewerId: "f6a7b8c9-d0e1-4f5a-3b4c-5d6e7f8a9b0c", // Robert Brown
        decision: "pending",
      },
      // Article 3 reviews
      {
        articleId: "article-003-uuid-0000-000000000003",
        reviewerId: "d4e5f6a7-b8c9-4d5e-1f2a-3b4c5d6e7f8a", // David Wilson
        decision: "accepted",
      },
      {
        articleId: "article-003-uuid-0000-000000000003",
        reviewerId: "f6a7b8c9-d0e1-4f5a-3b4c-5d6e7f8a9b0c", // Robert Brown
        decision: "accepted",
      },
      // Article 4 reviews
      {
        articleId: "article-004-uuid-0000-000000000004",
        reviewerId: "a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d", // John Smith
        decision: "revision_required",
      },
      {
        articleId: "article-004-uuid-0000-000000000004",
        reviewerId: "d4e5f6a7-b8c9-4d5e-1f2a-3b4c5d6e7f8a", // David Wilson
        decision: "revision_required",
      },
      // Article 5 reviews
      {
        articleId: "article-005-uuid-0000-000000000005",
        reviewerId: "f6a7b8c9-d0e1-4f5a-3b4c-5d6e7f8a9b0c", // Robert Brown
        decision: "pending",
      },
      {
        articleId: "article-005-uuid-0000-000000000005",
        reviewerId: "a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d", // John Smith
        decision: "pending",
      },
      // Article 6 reviews
      {
        articleId: "article-006-uuid-0000-000000000006",
        reviewerId: "d4e5f6a7-b8c9-4d5e-1f2a-3b4c5d6e7f8a", // David Wilson
        decision: "pending",
      },
      {
        articleId: "article-006-uuid-0000-000000000006",
        reviewerId: "f6a7b8c9-d0e1-4f5a-3b4c-5d6e7f8a9b0c", // Robert Brown
        decision: "pending",
      },
    ]);
    console.log(`✅ Created ${reviews.length} reviews`);

    // Create some sample comments
    const comments = await Comment.bulkCreate([
      {
        reviewId: reviews[0].id,
        text: "The methodology section needs more detail. Please clarify the sample selection process.",
        isVisibleToAuthor: true,
      },
      {
        reviewId: reviews[0].id,
        text: "Internal note: This paper shows promise but needs major revisions.",
        isVisibleToAuthor: false,
      },
      {
        reviewId: reviews[1].id,
        text: "Excellent discussion section! The implications for future research are well articulated.",
        isVisibleToAuthor: true,
      },
      {
        reviewId: reviews[4].id,
        text: "The experimental results are impressive. Consider adding a comparison with baseline methods.",
        isVisibleToAuthor: true,
      },
      {
        reviewId: reviews[6].id,
        text: "The literature review needs to include recent works from 2025.",
        isVisibleToAuthor: true,
      },
    ]);
    console.log(`✅ Created ${comments.length} comments`);

    console.log("\n🎉 Database seeding completed successfully!");
    console.log("\n📊 Summary:");
    console.log(`   Users: ${users.length}`);
    console.log(`   Conferences: ${conferences.length}`);
    console.log(`   Articles: ${articles.length}`);
    console.log(`   Reviews: ${reviews.length}`);
    console.log(`   Comments: ${comments.length}`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

seedDatabase();
