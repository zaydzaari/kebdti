// Round flags for each language, from the circle-flags set (MIT, see public/flags/CREDITS.txt).
const FILE = { dar: "ma", fr: "fr", en: "gb", es: "es", nl: "nl", de: "de", it: "it", ar: "ar" };

export function Flag({ code, size = 32, className = "" }) {
  return (
    <img
      className={`k-flag ${className}`}
      src={`/flags/${FILE[code] || "ma"}.svg`}
      width={size}
      height={size}
      alt=""
      aria-hidden="true"
      draggable="false"
      decoding="async"
    />
  );
}
