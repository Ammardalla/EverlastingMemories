
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authClient } from "../lib/auth-client";import { authClient } from "../lib/auth-client";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await authClient.signIn.email({
        email,
        password,
      });

      if (result.error) {
        setError(
          result.error.message || "Invalid email or password."
        );
        return;
      }

navigate("/");
    } catch {
      setError(
        "Unable to connect to the server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f8f4ee] px-4 py-6 text-[#503a32] sm:px-8">
      {/* Header */}
      <header className="mx-auto mb-8 flex max-w-7xl items-center justify-between">
<Link to="/" className="flex items-center gap-3">
          <span className="text-2xl text-[#c9653b]">◎</span>
          <span className="font-serif text-xxl leading-tight sm:text-xl">
            Everlasting Memories
          </span>
        </Link>

<Link
  to="/"
  className="rounded-full bg-[#c9653b] px-5 py-2.5 text-sm text-white transition hover:bg-[#a94e2c]"
>
  Home
</Link>
      </header>

      {/* Login Card */}
      <section className="mx-auto grid max-w-6xl overflow-hidden rounded-2xl bg-white shadow-[0_15px_60px_rgba(80,58,50,0.10)] lg:min-h-[690px] lg:grid-cols-2">
        {/* Form */}
        <div className="flex items-center px-6 py-10 sm:px-12 lg:px-14 lg:py-14">
          <div className="mx-auto w-full max-w-md">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#c9653b]">
              Welcome Back
            </p>

            <h1 className="font-serif text-4xl leading-tight sm:text-5xl">
              Log In to Your{" "}
              <span className="italic text-[#c9653b]">
                Account
              </span>
            </h1>

            <p className="mb-8 mt-4 leading-7 text-[#8b756a]">
              Welcome back to Everlasting Memories.
              Sign in to continue your journey with us.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium"
                >
                  Email Address
                </label>

                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  className="w-full rounded-xl border border-[#e4d8ce] bg-[#fdfbf8] px-4 py-3.5 outline-none transition placeholder:text-[#b09c90] focus:border-[#c9653b] focus:ring-2 focus:ring-[#c9653b]/15"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium"
                >
                  Password
                </label>

                <div className="flex items-center rounded-xl border border-[#e4d8ce] bg-[#fdfbf8] focus-within:border-[#c9653b] focus-within:ring-2 focus-within:ring-[#c9653b]/15">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(event) =>
                      setPassword(event.target.value)
                    }
                    required
                    className="min-w-0 flex-1 bg-transparent px-4 py-3.5 outline-none placeholder:text-[#b09c90]"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="px-4 text-sm text-[#8b756a] hover:text-[#c9653b]"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {error && (
                <p
                  role="alert"
                  className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-[#c9653b] px-5 py-4 font-medium text-white transition hover:bg-[#a94e2c] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Logging in..." : "Log In  →"}
              </button>
            </form>

            <div className="my-7 flex items-center gap-4">
              <div className="h-px flex-1 bg-[#e4d8ce]" />
              <span className="text-xs uppercase tracking-widest text-[#a18a7e]">
                Memories await
              </span>
              <div className="h-px flex-1 bg-[#e4d8ce]" />
            </div>

            <p className="text-center text-sm text-[#8b756a]">
              Don’t have an account?{" "}
<Link
  to="/signup"
  className="font-semibold text-[#c9653b] hover:underline"
>
  Sign Up
</Link>
            </p>
          </div>
        </div>

        {/* Photography panel */}
        <div className="relative hidden min-h-[690px] lg:block">
          <img
            src={`${import.meta.env.BASE_URL}images/img1.jpg`}
            alt="A beautiful photography moment"
            className="absolute inset-0 h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-[#24150f]/75 via-[#24150f]/10 to-[#24150f]/5" />

          <div className="absolute inset-x-8 bottom-14 text-center text-white">
            <p className="font-serif text-4xl italic leading-snug">
              Real Moments.
              <br />
              Lasting Memories.
            </p>
            <div className="mx-auto mt-5 h-1 w-14 rounded-full bg-[#df784b]" />
          </div>
        </div>
      </section>

      <footer className="mx-auto mt-8 max-w-6xl border-t border-[#e4d8ce] py-5 text-center text-xs text-[#967e72]">
        © {new Date().getFullYear()} Everlasting Memories.
        All rights reserved.
      </footer>
    </main>
  );
}
