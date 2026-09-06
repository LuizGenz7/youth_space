"use client";

import Image from "next/image";
import { UserRound } from "lucide-react";
import { useState } from "react";

export default function ProfileAvatar({
  src,
  name,
  size = "xl",
}) {
  const [error, setError] =
    useState(false);

  const sizes = {
    sm: "h-10 w-10",
    md: "h-14 w-14",
    lg: "h-20 w-20",
    xl: "h-24 w-24 sm:h-28 sm:w-28",
  };

  const iconSizes = {
    sm: 18,
    md: 22,
    lg: 28,
    xl: 34,
  };

  const initials = String(name || "Y")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  const showImage =
    Boolean(src) && !error;

  return (
    <div
      className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-slate-100 shadow-xl ${sizes[size] || sizes.xl}`}
    >
      {showImage ? (
        <Image
          src={src}
          alt={name || "Profile"}
          fill
          sizes="112px"
          className="object-cover"
          onError={() => setError(true)}
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center bg-slate-100">
          {initials ? (
            <span className="text-2xl font-black text-slate-500">
              {initials}
            </span>
          ) : (
            <UserRound
              size={iconSizes[size] || 34}
              className="text-slate-400"
            />
          )}
        </div>
      )}
    </div>
  );
}