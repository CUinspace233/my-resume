export default function ResumeText({ text }: { text: string }) {
  const parts = text.split('→');

  if (parts.length === 1) {
    return <>{text}</>;
  }

  return (
    <>
      {parts.map((part, index) => (
        <span key={`${part}-${index}`}>
          {index > 0 && (
            <svg
              viewBox="0 0 12 12"
              className="mx-[0.12em] inline-block h-[0.8em] w-[0.8em] align-[-0.06em]"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              focusable="false"
            >
              <path
                d="M2 6H10M7 3L10 6L7 9"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
          {part}
        </span>
      ))}
    </>
  );
}
