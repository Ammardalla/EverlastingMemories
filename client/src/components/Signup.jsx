
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authClient } from "../lib/auth-client";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await authClient.signUp.email({
        name,
        email,
        password,
      });

      if (result.error) {
        setError(
          result.error.message || "Could not create your account."
        );
        return;
      }

      navigate("/");
    } catch {
      setError("Unable to connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f8f4ee] px-4 py-10 text-[#503a32]">
      <section className="w-full max-w-md rounded-2xl bg-white p-7 shadow-xl sm:p-10">
        <Link
          to="/"
          className="font-serif text-xl text-[#c9653b]"
        >
          Everlasting Memories
        </Link>

        <p className="mt-8 text-xs font-semibold uppercase tracking-[0.25em] text-[#c9653b]">
          Join Us
        </p>

        <h1 className="mt-2 font-serif text-4xl">
          Create Your Account
        </h1>

        <p className="mt-3 text-sm leading-6 text-[#8b756a]">
          Start your journey with Everlasting Memories.
        </p>

        <form onSubmit={handleSubmit} className="mt-7 space-y-5">
          <div>
            <label htmlFor="name" className="mb-2 block text-sm">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              autoComplete="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              className="w-full rounded-xl border border-[#e4d8ce] bg-[#fdfbf8] px-4 py-3 outline-none focus:border-[#c9653b]"
              placeholder="Your name"
            />
          </div>

          <div>
            <label htmlFor="email" className="mb-2 block text-sm">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="w-full rounded-xl border border-[#e4d8ce] bg-[#fdfbf8] px-4 py-3 outline-none focus:border-[#c9653b]"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              minLength={8}
              required
              className="w-full rounded-xl border border-[#e4d8ce] bg-[#fdfbf8] px-4 py-3 outline-none focus:border-[#c9653b]"
              placeholder="At least 8 characters"
            />
          </div>

          {error && (
            <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#c9653b] px-5 py-3.5 font-medium text-white transition hover:bg-[#a94e2c] disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#8b756a]">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-[#c9653b] hover:underline"
          >
            Log In
          </Link>
        </p>
      </section>
    </main>
  );
}
