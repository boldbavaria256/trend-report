export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="relative w-16 h-16">
        <div className="absolute top-0 left-0 w-full h-full border-4 border-zinc-200 dark:border-zinc-800 rounded-full opacity-25"></div>
        <div className="absolute top-0 left-0 w-full h-full border-4 border-zinc-900 dark:border-white rounded-full border-t-transparent animate-spin"></div>
      </div>
    </div>
  );
}
