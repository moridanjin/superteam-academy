import type {
  StrapiResponse,
  StrapiSingleResponse,
  StrapiEntity,
  CmsCourse,
  CmsModule,
  CmsLesson,
  CmsChallenge,
  Course,
  Module,
  Lesson,
  Challenge,
} from "./types";

const STRAPI_URL = process.env.STRAPI_URL ?? "http://localhost:1337";
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

async function fetchStrapi<T>(
  path: string,
  params?: Record<string, string>
): Promise<T> {
  const url = new URL(`/api${path}`, STRAPI_URL);
  if (params) {
    Object.entries(params).forEach(([key, value]) =>
      url.searchParams.set(key, value)
    );
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (STRAPI_API_TOKEN) {
    headers["Authorization"] = `Bearer ${STRAPI_API_TOKEN}`;
  }

  const res = await fetch(url.toString(), {
    headers,
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error(`Strapi fetch failed: ${res.status} ${res.statusText}`);
  }

  return res.json() as Promise<T>;
}

// ── Transformers ──

function transformChallenge(entity: StrapiEntity<CmsChallenge>): Challenge {
  return {
    id: entity.id,
    prompt: entity.attributes.prompt,
    starterCode: entity.attributes.starter_code,
    testCases: entity.attributes.test_cases,
    expectedOutput: entity.attributes.expected_output,
    hints: entity.attributes.hints,
    solution: entity.attributes.solution,
  };
}

function transformLesson(entity: StrapiEntity<CmsLesson>): Lesson {
  return {
    id: entity.id,
    title: entity.attributes.title,
    type: entity.attributes.type,
    content: entity.attributes.content,
    order: entity.attributes.order,
    xpReward: entity.attributes.xp_reward,
    challenge: entity.attributes.challenge?.data
      ? transformChallenge(entity.attributes.challenge.data)
      : null,
  };
}

function transformModule(entity: StrapiEntity<CmsModule>): Module {
  const lessons = entity.attributes.lessons?.data ?? [];
  return {
    id: entity.id,
    title: entity.attributes.title,
    order: entity.attributes.order,
    lessons: lessons.map(transformLesson).sort((a, b) => a.order - b.order),
  };
}

function transformCourse(entity: StrapiEntity<CmsCourse>): Course {
  const modules = entity.attributes.modules?.data ?? [];
  return {
    id: entity.id,
    title: entity.attributes.title,
    slug: entity.attributes.slug,
    description: entity.attributes.description,
    difficulty: entity.attributes.difficulty,
    duration: entity.attributes.duration,
    thumbnailUrl: entity.attributes.thumbnail?.data?.attributes.url ?? null,
    track: entity.attributes.track,
    xpReward: entity.attributes.xp_reward,
    modules: modules.map(transformModule).sort((a, b) => a.order - b.order),
    publishedAt: entity.attributes.publishedAt,
  };
}

// ── Public API ──

export async function getCourses(): Promise<Course[]> {
  const res = await fetchStrapi<StrapiResponse<CmsCourse>>("/courses", {
    "populate[modules][populate][lessons][populate]": "challenge",
    publicationState: "live",
    sort: "title:asc",
  });
  return res.data.map(transformCourse);
}

export async function getCourseBySlug(slug: string): Promise<Course | null> {
  const res = await fetchStrapi<StrapiResponse<CmsCourse>>("/courses", {
    "filters[slug][$eq]": slug,
    "populate[modules][populate][lessons][populate]": "challenge",
    publicationState: "live",
  });
  const entity = res.data[0];
  return entity ? transformCourse(entity) : null;
}

export async function getCoursesSlugs(): Promise<string[]> {
  const res = await fetchStrapi<StrapiResponse<CmsCourse>>("/courses", {
    "fields[0]": "slug",
    publicationState: "live",
  });
  return res.data.map((e) => e.attributes.slug);
}

export async function getLesson(id: number): Promise<Lesson | null> {
  try {
    const res = await fetchStrapi<StrapiSingleResponse<CmsLesson>>(
      `/lessons/${id}`,
      { populate: "challenge" }
    );
    return transformLesson(res.data);
  } catch {
    return null;
  }
}
