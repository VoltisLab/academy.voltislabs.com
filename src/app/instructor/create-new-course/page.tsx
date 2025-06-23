"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function CreateNewCourseRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // If courseId is present in query, preserve it
    const courseId = searchParams!.get("courseId");
    if (courseId) {
      router.replace(
        `/instructor/create-new-course/basic?courseId=${courseId}`
      );
    } else {
      router.replace("/instructor/create-new-course/basic");
    }
  }, [router, searchParams]);

  return null;
}
