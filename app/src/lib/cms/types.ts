export type Difficulty = "beginner" | "intermediate" | "advanced";
export type LessonType = "content" | "challenge";

export interface StrapiResponse<T> {
  data: StrapiEntity<T>[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface StrapiSingleResponse<T> {
  data: StrapiEntity<T>;
}

export interface StrapiEntity<T> {
  id: number;
  attributes: T & {
    createdAt: string;
    updatedAt: string;
    publishedAt: string | null;
  };
}

export interface CmsCourse {
  title: string;
  slug: string;
  description: string;
  difficulty: Difficulty;
  duration: number;
  thumbnail: StrapiMedia | null;
  track: string | null;
  xp_reward: number;
  modules: { data: StrapiEntity<CmsModule>[] };
}

export interface CmsModule {
  title: string;
  order: number;
  lessons: { data: StrapiEntity<CmsLesson>[] };
}

export interface CmsLesson {
  title: string;
  type: LessonType;
  content: string;
  order: number;
  xp_reward: number;
  challenge: { data: StrapiEntity<CmsChallenge> | null };
}

export interface CmsChallenge {
  prompt: string;
  starter_code: string;
  test_cases: string;
  expected_output: string;
  hints: string | null;
  solution: string;
}

export interface StrapiMedia {
  data: {
    id: number;
    attributes: {
      url: string;
      width: number;
      height: number;
      alternativeText: string | null;
      formats: Record<
        string,
        { url: string; width: number; height: number }
      > | null;
    };
  } | null;
}

// Flattened types for frontend consumption (no Strapi wrapper)
export interface Course {
  id: number;
  title: string;
  slug: string;
  description: string;
  difficulty: Difficulty;
  duration: number;
  thumbnailUrl: string | null;
  track: string | null;
  xpReward: number;
  modules: Module[];
  publishedAt: string | null;
}

export interface Module {
  id: number;
  title: string;
  order: number;
  lessons: Lesson[];
}

export interface Lesson {
  id: number;
  title: string;
  type: LessonType;
  content: string;
  order: number;
  xpReward: number;
  challenge: Challenge | null;
}

export interface Challenge {
  id: number;
  prompt: string;
  starterCode: string;
  testCases: string;
  expectedOutput: string;
  hints: string | null;
  solution: string;
}
