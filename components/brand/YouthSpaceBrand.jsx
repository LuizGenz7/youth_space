import Image from "next/image";

export default function YouthSpaceBrand({
  size = 35,
  className = "",
  priority = false,
  transparent = false,
  showTitle = true,
}) {
  return (
    <div
      className={`flex items-center ${
        showTitle ? "gap-2.5" : ""
      } ${className}`}
    >
      {/* Logo Icon */}
      <div
        className="flex shrink-0 items-center justify-center overflow-hidden rounded-xl p-1"
        style={{
          width: size,
          height: size,
          backgroundColor: transparent ? "transparent" : "#0f172a",
        }}
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

      {/* Brand Information */}
      {showTitle && (
        <div className="min-w-0 leading-none">
          <span
            className={`block text-[14px] font-black tracking-tight sm:text-[15px] ${
              transparent
                ? "text-white"
                : "text-slate-950"
            }`}
          >
            Youth Space
          </span>

          <p
            className={`mt-1 text-[8px] font-medium leading-tight tracking-[0.01em] sm:text-[9px] ${
              transparent
                ? "text-white/65"
                : "text-slate-400"
            }`}
          >
            Turning Talent Into Opportunity.
          </p>
        </div>
      )}
    </div>
  );
}