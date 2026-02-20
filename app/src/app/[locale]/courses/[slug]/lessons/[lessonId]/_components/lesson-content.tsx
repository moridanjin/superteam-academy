"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import type { Components } from "react-markdown";
import { useTranslations } from "next-intl";
import type { Lesson } from "@/lib/cms/types";

const markdownComponents: Components = {
  h1: ({ children }) => (
    <h1 className="mb-4 text-2xl font-bold tracking-tight text-white md:text-3xl">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="mt-8 mb-3 text-xl font-semibold text-white">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="mt-6 mb-2 text-lg font-semibold text-neutral-200">
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p className="mb-4 leading-relaxed text-neutral-400">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="mb-4 ml-4 list-disc space-y-1 text-neutral-400">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="mb-4 ml-4 list-decimal space-y-1 text-neutral-400">
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  a: ({ href, children }) => (
    <a
      href={href}
      className="text-solana-blue decoration-solana-blue/30 hover:text-solana-green underline underline-offset-2 transition-colors"
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-solana-purple/50 my-4 border-l-2 pl-4 text-neutral-500 italic">
      {children}
    </blockquote>
  ),
  code: ({ className, children, ...props }) => {
    const isInline = !className;
    if (isInline) {
      return (
        <code className="text-solana-green rounded bg-white/[0.06] px-1.5 py-0.5 font-mono text-[13px]">
          {children}
        </code>
      );
    }
    return (
      <code className={className} {...props}>
        {children}
      </code>
    );
  },
  pre: ({ children }) => (
    <pre className="mb-4 overflow-x-auto rounded-lg border border-white/[0.06] bg-neutral-900/80 p-4 font-mono text-[13px] leading-relaxed">
      {children}
    </pre>
  ),
  table: ({ children }) => (
    <div className="mb-4 overflow-x-auto">
      <table className="w-full border-collapse text-sm">{children}</table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="border-b border-white/[0.08]">{children}</thead>
  ),
  th: ({ children }) => (
    <th className="px-3 py-2 text-left text-xs font-semibold text-neutral-300">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border-b border-white/[0.04] px-3 py-2 text-neutral-400">
      {children}
    </td>
  ),
  hr: () => <hr className="my-6 border-white/[0.06]" />,
  strong: ({ children }) => (
    <strong className="font-semibold text-neutral-200">{children}</strong>
  ),
  img: ({ src, alt }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt ?? ""}
      className="my-4 max-w-full rounded-lg border border-white/[0.06]"
    />
  ),
};

export function LessonContent({ lesson }: { lesson: Lesson }) {
  const t = useTranslations("lesson");

  if (!lesson.content) {
    return (
      <div className="flex min-h-[200px] items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.02]">
        <p className="text-sm text-neutral-500">{t("contentComingSoon")}</p>
      </div>
    );
  }

  return (
    <div className="lesson-content">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={markdownComponents}
      >
        {lesson.content}
      </ReactMarkdown>
    </div>
  );
}
