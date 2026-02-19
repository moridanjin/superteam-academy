"use client";

import { useEffect, useState } from "react";
import { EnrollButton } from "@/components/courses/enroll-button";

export function MobileEnrollCTA({
  courseId,
  courseSlug,
}: {
  courseId: string;
  courseSlug: string;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Show sticky CTA when the desktop card scrolls out of view
        setVisible(!entry!.isIntersecting);
      },
      { threshold: 0 }
    );

    const target = document.getElementById("enroll-card");
    if (target) observer.observe(target);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={`fixed right-0 bottom-0 left-0 z-40 border-t border-white/[0.08] bg-neutral-950/90 px-4 py-3 backdrop-blur-xl transition-transform duration-300 lg:hidden ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <EnrollButton courseId={courseId} courseSlug={courseSlug} />
    </div>
  );
}
