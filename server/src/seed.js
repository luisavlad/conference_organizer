import "dotenv/config";
import database from "./core/database.js";
import { User, Conference, Article, Comment } from "./models/index.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the sample PDF file
const samplePdfPath = path.join(__dirname, "../../client/public/mock/sample.pdf");
const samplePdfData = fs.readFileSync(samplePdfPath);

// Hardcoded UUIDs to ensure connections are consistent and "real"
const U_IDS = {
  ORG1: "11111111-1111-4111-1111-111111111111",
  ORG2: "11111111-1111-4111-1111-222222222222",
  REV1: "22222222-2222-4222-2222-111111111111",
  REV2: "22222222-2222-4222-2222-222222222222",
  REV3: "22222222-2222-4222-2222-333333333333",
  REV4: "22222222-2222-4222-2222-444444444444",
  REV5: "22222222-2222-4222-2222-555555555555",
  AUTH1: "33333333-3333-4333-3333-111111111111",
  AUTH2: "33333333-3333-4333-3333-222222222222",
  AUTH3: "33333333-3333-4333-3333-333333333333",
};

const C_IDS = {
  CONF1: "aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa",
  CONF2: "bbbbbbbb-bbbb-4bbb-bbbb-bbbbbbbbbbbb",
  CONF3: "cccccccc-cccc-4ccc-cccc-cccccccccccc",
  CONF4: "dddddddd-dddd-4ddd-dddd-dddddddddddd",
  CONF5: "eeeeeeee-eeee-4eee-eeee-eeeeeeeeeeee",
};

const A_IDS = {
  ART1: "12345678-1234-4123-1234-1234567890ab",
  ART2: "12345678-1234-4123-1234-1234567890ac",
  ART3: "12345678-1234-4123-1234-1234567890ad",
  ART4: "12345678-1234-4123-1234-1234567890ae",
  ART5: "12345678-1234-4123-1234-1234567890af",
};

async function seed() {
  try {
    console.log("🔄 Syncing database...");
    // Force: true drops tables if they exist
    await database.sync({ force: true });
    console.log("✅ Database synced.");

    // ---------------------------------------------------------
    // 1. Create Users
    // ---------------------------------------------------------
    console.log("👤 Seeding Users...");
    const users = await User.bulkCreate([
      // Organizers
      {
        id: U_IDS.ORG1,
        name: "Alice Organizer",
        email: "alice@conf.com",
        role: "ORGANIZER",
      },
      {
        id: U_IDS.ORG2,
        name: "Bob Organizer",
        email: "bob@conf.com",
        role: "ORGANIZER",
      },
      // Reviewers
      {
        id: U_IDS.REV1,
        name: "Charlie Reviewer",
        email: "charlie@rev.com",
        role: "REVIEWER",
      },
      {
        id: U_IDS.REV2,
        name: "Diana Reviewer",
        email: "diana@rev.com",
        role: "REVIEWER",
      },
      {
        id: U_IDS.REV3,
        name: "Evan Reviewer",
        email: "evan@rev.com",
        role: "REVIEWER",
      },
      {
        id: U_IDS.REV4,
        name: "Fiona Reviewer",
        email: "fiona@rev.com",
        role: "REVIEWER",
      },
      {
        id: U_IDS.REV5,
        name: "George Reviewer",
        email: "george@rev.com",
        role: "REVIEWER",
      },
      // Authors
      {
        id: U_IDS.AUTH1,
        name: "Hannah Author",
        email: "hannah@uni.edu",
        role: "AUTHOR",
      },
      {
        id: U_IDS.AUTH2,
        name: "Ian Author",
        email: "ian@uni.edu",
        role: "AUTHOR",
      },
      {
        id: U_IDS.AUTH3,
        name: "Julia Author",
        email: "julia@uni.edu",
        role: "AUTHOR",
      },
    ]);

    // ---------------------------------------------------------
    // 2. Create Conferences
    // ---------------------------------------------------------
    console.log("📅 Seeding Conferences...");
    const conferences = await Conference.bulkCreate([
      {
        id: C_IDS.CONF1,
        title: "Tech Summit 2026",
        description: "Annual technology conference focusing on AI and Web.",
        location: "San Francisco, CA",
        startDate: new Date("2026-06-01"),
        endDate: new Date("2026-06-03"),
        reviewer1: U_IDS.REV1,
        reviewer2: U_IDS.REV2,
        reviewer3: U_IDS.REV3,
        articles: [A_IDS.ART1],
      },
      {
        id: C_IDS.CONF2,
        title: "BioMed Symposium",
        description: "Advances in medical research and biotechnology.",
        location: "London, UK",
        startDate: new Date("2026-07-15"),
        endDate: new Date("2026-07-17"),
        reviewer1: U_IDS.REV2,
        reviewer2: U_IDS.REV3,
        reviewer3: U_IDS.REV4,
        articles: [A_IDS.ART2],
      },
      {
        id: C_IDS.CONF3,
        title: "Global Art Expo",
        description: "Digital art and modern expression.",
        location: "Paris, France",
        startDate: new Date("2026-08-10"),
        endDate: new Date("2026-08-12"),
        reviewer1: U_IDS.REV3,
        reviewer2: U_IDS.REV4,
        reviewer3: U_IDS.REV5,
        articles: [A_IDS.ART3],
      },
      {
        id: C_IDS.CONF4,
        title: "CyberSecurity Con",
        description: "Protecting the future of the internet.",
        location: "Berlin, Germany",
        startDate: new Date("2026-09-05"),
        endDate: new Date("2026-09-07"),
        reviewer1: U_IDS.REV1,
        reviewer2: U_IDS.REV4,
        reviewer3: U_IDS.REV5,
        articles: [A_IDS.ART4],
      },
      {
        id: C_IDS.CONF5,
        title: "EduTech World",
        description: "The future of education technology.",
        location: "Toronto, Canada",
        startDate: new Date("2026-10-20"),
        endDate: new Date("2026-10-22"),
        reviewer1: U_IDS.REV1,
        reviewer2: U_IDS.REV2,
        reviewer3: U_IDS.REV5,
        articles: [A_IDS.ART5],
      },
    ]);

    // ---------------------------------------------------------
    // 3. Create Articles
    // ---------------------------------------------------------
    console.log("📄 Seeding Articles...");
    await Article.bulkCreate([
      {
        id: A_IDS.ART1,
        title: "Advances in Neural Networks",
        summary: "A deep dive into transformer architectures",
        pdfData: samplePdfData,
        pdfMimeType: "application/pdf",
        pdfFilename: "advances-neural-networks.pdf",
        status: "IN_REVIEW",
        authorId: U_IDS.AUTH1,
        conferenceId: C_IDS.CONF1, // Tech Summit
        currentVersion: 1,
        versions: [{ v: 1, date: new Date().toISOString() }],
        reviewer1Id: U_IDS.REV1,
        reviewer2Id: U_IDS.REV2,
      },
      {
        id: A_IDS.ART2,
        title: "CRISPR Applications",
        summary: "Gene editing techniques for the 21st century",
        pdfData: samplePdfData,
        pdfMimeType: "application/pdf",
        pdfFilename: "crispr-applications.pdf",
        status: "ACCEPTED",
        authorId: U_IDS.AUTH2,
        conferenceId: C_IDS.CONF2, // BioMed
        currentVersion: 2,
        versions: [
          { v: 1, date: "2026-01-01" },
          { v: 2, date: "2026-02-01" },
        ],
        reviewer1Id: U_IDS.REV2,
        reviewer2Id: U_IDS.REV4,
      },
      {
        id: A_IDS.ART3,
        title: "Digital Renaissance",
        summary: "NFTs and their impact on traditional art",
        pdfData: samplePdfData,
        pdfMimeType: "application/pdf",
        pdfFilename: "digital-renaissance.pdf",
        status: "REVISION_REQUIRED",
        authorId: U_IDS.AUTH3,
        conferenceId: C_IDS.CONF3, // Art Expo
        currentVersion: 1,
        versions: [{ v: 1, date: new Date().toISOString() }],
        reviewer1Id: U_IDS.REV3,
        reviewer2Id: U_IDS.REV5,
      },
      {
        id: A_IDS.ART4,
        title: "Zero Trust Architecture",
        summary: "Implementing security in distributed systems",
        pdfData: samplePdfData,
        pdfMimeType: "application/pdf",
        pdfFilename: "zero-trust-architecture.pdf",
        status: "IN_REVIEW",
        authorId: U_IDS.AUTH1, // Same author as Art 1
        conferenceId: C_IDS.CONF4, // CyberSec
        currentVersion: 1,
        versions: [{ v: 1, date: new Date().toISOString() }],
        reviewer1Id: U_IDS.REV1,
        reviewer2Id: U_IDS.REV5,
      },
      {
        id: A_IDS.ART5,
        title: "Gamification in Classrooms",
        summary: "Using game mechanics to improve student engagement",
        pdfData: samplePdfData,
        pdfMimeType: "application/pdf",
        pdfFilename: "gamification-classrooms.pdf",
        status: "REJECTED",
        authorId: U_IDS.AUTH2,
        conferenceId: C_IDS.CONF5, // EduTech
        currentVersion: 1,
        versions: [{ v: 1, date: new Date().toISOString() }],
        reviewer1Id: U_IDS.REV2,
        reviewer2Id: U_IDS.REV5,
      },
    ]);

    // ---------------------------------------------------------
    // 4. Create Comments (Feedback)
    // ---------------------------------------------------------
    console.log("💬 Seeding Comments...");
    await Comment.bulkCreate([
      // Feedback on Art 1 (Tech Summit) by Rev 1
      {
        id: "99999999-1111-4999-9999-111111111111",
        userId: U_IDS.REV1,
        articleId: A_IDS.ART1,
        text: "The methodology section needs more clarity regarding the dataset used.",
        isPublic: true,
      },
      // Feedback on Art 1 by Rev 2
      {
        id: "99999999-1111-4999-9999-222222222222",
        userId: U_IDS.REV2,
        articleId: A_IDS.ART1,
        text: "Excellent results, but please fix the typo in the abstract.",
        isPublic: true,
      },
      // Reply by Author 1 on Art 1
      {
        id: "99999999-1111-4999-9999-333333333333",
        userId: U_IDS.AUTH1,
        articleId: A_IDS.ART1,
        text: "Thank you. I have updated the dataset description in the new version.",
        isPublic: true,
      },
      // Feedback on Art 3 (Art Expo) by Rev 4
      {
        id: "99999999-1111-4999-9999-444444444444",
        userId: U_IDS.REV4,
        articleId: A_IDS.ART3,
        text: "The conclusion assumes trends that are not fully supported by the data.",
        isPublic: true,
      },
      // Feedback on Art 5 (EduTech) by Rev 5
      {
        id: "99999999-1111-4999-9999-555555555555",
        userId: U_IDS.REV5,
        articleId: A_IDS.ART5,
        text: "This topic is not suitable for the scope of this conference.",
        isPublic: false,
      },
    ]);

    console.log("✅ Seeding completed successfully!");
  } catch (err) {
    console.error("❌ Seeding failed:", err);
  }
}

seed();
