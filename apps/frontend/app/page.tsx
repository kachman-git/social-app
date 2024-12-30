import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)] py-2">
      <h1 className="text-5xl font-bold mb-8 text-gray-800 text-center dark:text-white">
        Welcome to Social App
      </h1>
      <p className="text-xl mb-12 text-gray-600 text-center max-w-2xl dark:text-white">
        Connect with friends, share your thoughts, and explore a world of social
        interactions!
      </p>
      <div className="space-x-4">
        <Link
          href="/signin"
          className="bg-white text-blue-500 font-semibold py-3 px-6 rounded-full border-2 border-blue-500 hover:bg-blue-500 hover:text-white transition-colors duration-300"
        >
          Sign In
        </Link>
        <Link
          href="/signup"
          className="bg-blue-500 text-white font-semibold py-3 px-6 rounded-full hover:bg-blue-600 transition-colors duration-300"
        >
          Sign Up
        </Link>
      </div>
    </div>
  );
}
