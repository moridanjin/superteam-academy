#!/usr/bin/env node
/**
 * Seed script: imports sample course data into Strapi via REST API.
 *
 * Usage:
 *   STRAPI_URL=http://localhost:1337 STRAPI_API_TOKEN=<token> node seed/import.mjs
 */

import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const STRAPI_URL = process.env.STRAPI_URL || "http://localhost:1337";
const TOKEN = process.env.STRAPI_API_TOKEN;

if (!TOKEN) {
  console.error("STRAPI_API_TOKEN is required");
  process.exit(1);
}

const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${TOKEN}`,
};

async function post(path, data) {
  const res = await fetch(`${STRAPI_URL}/api${path}`, {
    method: "POST",
    headers,
    body: JSON.stringify({ data }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`POST ${path} failed (${res.status}): ${body}`);
  }
  return res.json();
}

async function main() {
  const seedFile = resolve(__dirname, "solana-fundamentals.json");
  const seed = JSON.parse(readFileSync(seedFile, "utf-8"));

  console.log(`Importing course: ${seed.course.title}`);

  // 1. Create the course
  const courseRes = await post("/courses", seed.course);
  const courseId = courseRes.data.id;
  console.log(`  Created course #${courseId}`);

  // 2. Create modules and lessons
  for (const mod of seed.modules) {
    const moduleRes = await post("/modules", {
      title: mod.title,
      order: mod.order,
      course: courseId,
    });
    const moduleId = moduleRes.data.id;
    console.log(`  Created module #${moduleId}: ${mod.title}`);

    for (const lesson of mod.lessons) {
      let challengeId = null;

      // Create challenge first if present
      if (lesson.challenge) {
        const challengeRes = await post("/challenges", lesson.challenge);
        challengeId = challengeRes.data.id;
        console.log(`    Created challenge #${challengeId}`);
      }

      await post("/lessons", {
        title: lesson.title,
        type: lesson.type,
        content: lesson.content,
        order: lesson.order,
        xp_reward: lesson.xp_reward,
        module: moduleId,
        ...(challengeId ? { challenge: challengeId } : {}),
      });
      console.log(`    Created lesson: ${lesson.title}`);
    }
  }

  // 3. Publish the course
  const publishRes = await fetch(
    `${STRAPI_URL}/api/courses/${courseId}`,
    {
      method: "PUT",
      headers,
      body: JSON.stringify({ data: { publishedAt: new Date().toISOString() } }),
    },
  );
  if (publishRes.ok) {
    console.log(`  Published course`);
  }

  console.log("Done!");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
