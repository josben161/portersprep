import { upsertSchool, addSchoolQuestion } from "../lib/apps";

async function seedSchools() {
  console.log("🌱 Seeding schools and questions...");

  // Harvard Business School
  const hbsId = await upsertSchool({
    name: "Harvard Business School",
    slug: "hbs",
    website: "https://www.hbs.edu/mba",
    brief: {
      values: ["leadership", "impact", "innovation", "global perspective"],
      tone: "aspirational, confident, community-focused",
    },
  });

  await addSchoolQuestion(hbsId, {
    prompt:
      "What more would you like us to know as we consider your candidacy for the Harvard Business School MBA program?",
    archetype: "open_ended",
    word_limit: 500,
  });

  await addSchoolQuestion(hbsId, {
    prompt:
      "Briefly describe an experience you had that was important to you and what you learned from it.",
    archetype: "reflection",
    word_limit: 300,
  });

  // Stanford GSB
  const stanfordId = await upsertSchool({
    name: "Stanford Graduate School of Business",
    slug: "stanford-gsb",
    website: "https://www.gsb.stanford.edu/programs/mba",
    brief: {
      values: [
        "innovation",
        "entrepreneurship",
        "social impact",
        "collaboration",
      ],
      tone: "creative, purpose-driven, collaborative",
    },
  });

  await addSchoolQuestion(stanfordId, {
    prompt: "What matters most to you, and why?",
    archetype: "values",
    word_limit: 650,
  });

  await addSchoolQuestion(stanfordId, {
    prompt: "Why Stanford?",
    archetype: "fit",
    word_limit: 400,
  });

  // Wharton
  const whartonId = await upsertSchool({
    name: "The Wharton School",
    slug: "wharton",
    website: "https://mba.wharton.upenn.edu/",
    brief: {
      values: [
        "analytics",
        "business fundamentals",
        "global business",
        "leadership",
      ],
      tone: "analytical, strategic, results-oriented",
    },
  });

  await addSchoolQuestion(whartonId, {
    prompt:
      "How do you plan to use the Wharton MBA program to help you achieve your future professional goals?",
    archetype: "goals",
    word_limit: 500,
  });

  await addSchoolQuestion(whartonId, {
    prompt:
      "Describe an impactful experience or accomplishment that is not reflected elsewhere in your application.",
    archetype: "achievement",
    word_limit: 400,
  });

  // MIT Sloan
  const mitId = await upsertSchool({
    name: "MIT Sloan School of Management",
    slug: "mit-sloan",
    website: "https://mitsloan.mit.edu/mba",
    brief: {
      values: ["innovation", "technology", "analytics", "sustainability"],
      tone: "technical, innovative, data-driven",
    },
  });

  await addSchoolQuestion(mitId, {
    prompt:
      "The mission of the MIT Sloan School of Management is to develop principled, innovative leaders who improve the world and generate ideas that advance management practice. Discuss how you will contribute toward advancing the mission based on examples of past work and activities.",
    archetype: "mission_alignment",
    word_limit: 500,
  });

  await addSchoolQuestion(mitId, {
    prompt:
      "Describe a time when you went beyond what was defined, expected, or established.",
    archetype: "innovation",
    word_limit: 300,
  });

  // Columbia Business School
  const columbiaId = await upsertSchool({
    name: "Columbia Business School",
    slug: "columbia",
    website: "https://www8.gsb.columbia.edu/mba",
    brief: {
      values: [
        "global business",
        "finance",
        "entrepreneurship",
        "social responsibility",
      ],
      tone: "sophisticated, global, ambitious",
    },
  });

  await addSchoolQuestion(columbiaId, {
    prompt:
      "Through your resume and recommendations, we have a clear sense of your professional path to date. What are your career goals over the next 3-5 years and what, in your imagination, would be your long-term dream job?",
    archetype: "career_goals",
    word_limit: 500,
  });

  await addSchoolQuestion(columbiaId, {
    prompt: "Who is a leader you admire, and why?",
    archetype: "leadership",
    word_limit: 300,
  });

  console.log("✅ Schools and questions seeded successfully!");
  console.log("📚 Schools created:");
  console.log("- Harvard Business School (HBS)");
  console.log("- Stanford Graduate School of Business");
  console.log("- The Wharton School");
  console.log("- MIT Sloan School of Management");
  console.log("- Columbia Business School");
}

// Run the seed function
seedSchools().catch(console.error);
