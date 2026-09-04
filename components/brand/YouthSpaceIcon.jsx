import Image from "next/image";

export default function YouthSpaceIcon({
  size = 40,
  className = "",
  priority = false,
}) {
  return (
    <div
      className={`flex shrink-0 items-center p-1 justify-center overflow-hidden rounded-xl bg-slate-950 ${className}`}
      style={{ width: size, height: size }}
    >
      <Image
        src="/images/brand/youth-space-icon.webp"
        alt="Youth Space"
        width={size}
        height={size}
        priority={priority}
        className="h-full w-full object-contain"
      />
    </div>
  );
}
