"use client";

import "../../css/index.css";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const router = useRouter();

  function handleSignIn(e) {
    e.preventDefault();
    router.push("/inbox");
  }

  return (
    <div className="page">
      <div className="card">
        <div className="logo">
          <div className="logo-mark">
            <img src="/icons/16px/ClarityLogo.svg" width={18} height={18} alt="Clarity" />
          </div>
          <span className="logo-name">Clarity</span>
        </div>

        <div className="card-header">
          <h1 className="card-title">Welcome back</h1>
          <p className="card-subtitle">Sign in to your workspace to continue.</p>
        </div>

        <form className="form" onSubmit={handleSignIn}>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" placeholder="you@company.com" autoComplete="email" required />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input id="password" type="password" placeholder="••••••••" autoComplete="current-password" required />
          </div>
          <a className="forgot" href="#">Forgot password?</a>
          <button className="btn-signin" type="submit">Sign in</button>
        </form>

        <div className="divider">
          <div className="divider-line"></div>
          <span className="divider-text">or</span>
          <div className="divider-line"></div>
        </div>

        <button className="btn-sso" type="button">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M14.5 8.16c0-.5-.04-.87-.13-1.25H8.1v2.27h3.7c-.07.6-.46 1.5-1.33 2.1l-.01.08 1.93 1.5.13.01c1.23-1.14 1.94-2.81 1.94-4.71z" fill="#4285F4" />
            <path d="M8.1 14.5c1.82 0 3.35-.6 4.46-1.63l-2.12-1.64c-.57.4-1.33.67-2.34.67-1.78 0-3.29-1.17-3.83-2.79l-.08.01-2 1.55-.03.07C3.25 13.19 5.53 14.5 8.1 14.5z" fill="#34A853" />
            <path d="M4.27 9.11a4.7 4.7 0 0 1-.25-1.51c0-.53.09-1.04.24-1.51l-.01-.09L2.23 4.4l-.07.03A6.5 6.5 0 0 0 1.5 7.6c0 1.05.25 2.04.66 2.93l2.11-1.42z" fill="#FBBC05" />
            <path d="M8.1 3.3c1.26 0 2.11.55 2.6 1l1.9-1.85C11.44 1.39 9.92.5 8.1.5 5.53.5 3.25 1.81 2.16 3.87l2.1 1.63C4.8 4.47 6.32 3.3 8.1 3.3z" fill="#EA4335" />
          </svg>
          Continue with Google
        </button>

        <p className="card-footer">Don&apos;t have an account? <a href="#">Sign up</a></p>
      </div>
    </div>
  );
}
