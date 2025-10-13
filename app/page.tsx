export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <h1 className="text-4xl font-black text-center w-full">GDGC Dev Platform</h1>
        <p className="text-center w-full text-gray-400 font-mono">
          Work in progress.
        </p>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        &copy; All rights reserved
        <a href="https://github.com/gdgcnitj"> GDGC NITJ</a>
      </footer>
    </div>
  );
}
