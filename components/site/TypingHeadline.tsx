"use client";

import { useEffect, useState } from "react";

/**
 * Typewriter headline that types out a rotating word, pauses, deletes it, and
 * moves to the next — cycling through `words` forever. A static `lead` line
 * (e.g. "FOR THE") sits above the animated word, so each cycle reads as a
 * distinct tagline: "FOR THE CULTURE." → "FOR THE NIGHT." → "FOR THE MOVEMENT."
 */
export function TypingHeadline({
  lead,
  words,
  className,
}: {
  lead?: string;
  words: string[];
  className?: string;
}) {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = words[index % words.length];
    let timer: ReturnType<typeof setTimeout>;

    if (!deleting) {
      if (text.length < current.length) {
        // Typing forward, one character at a time.
        timer = setTimeout(() => setText(current.slice(0, text.length + 1)), 95);
      } else {
        // Fully typed — hold, then start deleting.
        timer = setTimeout(() => setDeleting(true), 1800);
      }
    } else {
      if (text.length > 0) {
        // Deleting backward (a touch faster than typing).
        timer = setTimeout(() => setText(current.slice(0, text.length - 1)), 45);
      } else {
        // Cleared — advance to the next tagline.
        timer = setTimeout(() => {
          setDeleting(false);
          setIndex((i) => (i + 1) % words.length);
        }, 250);
      }
    }

    return () => clearTimeout(timer);
  }, [text, deleting, index, words]);

  return (
    <h1 className={className}>
      {lead && (
        <>
          {lead}
          <br />
        </>
      )}
      <span className="text-gradient">{text}</span>
      {/* Blinking caret */}
      <span
        aria-hidden
        className="ml-1 inline-block h-[0.78em] w-[4px] translate-y-[0.06em] animate-pulse bg-white sm:w-[6px]"
      />
      {/* Full text for screen readers / SEO */}
      <span className="sr-only">
        {lead ? `${lead} ` : ""}
        {words.join(", ")}
      </span>
    </h1>
  );
}
