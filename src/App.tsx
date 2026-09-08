import { FormEvent, ReactElement, useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { AuthBrand, AuthMobileBrand } from "./Components/Auth/AuthBrand";
import { AuthTabs } from "./Components/Auth/AuthTabs";
import { ForgotPasswordForm } from "./Components/Auth/ForgotPassword/ForgotPasswordForm";
import { LoginForm } from "./Components/Auth/Login/LoginForm";
import { RegisterForm } from "./Components/Auth/Register/RegisterForm";
import { SuccessMessage } from "./Components/Auth/SuccessMessage";
import { AuthMode } from "./Components/Auth/types";
import DashboardOverview from "./Components/Dashboard/DashboardOverview";

const AUTH_STORAGE_KEY = "socialflow_authenticated";

function App() {
  return <AuthRouter />;
}

function AuthRouter() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => localStorage.getItem(AUTH_STORAGE_KEY) === "true",
  );

  function handleLogin() {
    localStorage.setItem(AUTH_STORAGE_KEY, "true");
    setIsAuthenticated(true);
  }

  function handleLogout() {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setIsAuthenticated(false);
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={
          <AuthPage
            mode="login"
            isAuthenticated={isAuthenticated}
            onLogin={handleLogin}
          />
        }
      />
      <Route
        path="/register"
        element={<AuthPage mode="register" isAuthenticated={isAuthenticated} />}
      />
      <Route
        path="/forgot-password"
        element={<AuthPage mode="forgot" isAuthenticated={isAuthenticated} />}
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <DashboardOverview onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/accounts"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <DashboardOverview onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/actions"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <DashboardOverview onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/activity"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <DashboardOverview onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <DashboardOverview onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />
      <Route
        path="*"
        element={
          <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />
        }
      />
    </Routes>
  );
}

function ProtectedRoute({
  isAuthenticated,
  children,
}: {
  isAuthenticated: boolean;
  children: ReactElement;
}) {
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function AuthPage({
  mode,
  isAuthenticated,
  onLogin,
}: {
  mode: AuthMode;
  isAuthenticated: boolean;
  onLogin?: () => void;
}) {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const isRegistering = mode === "register";
  const isForgotPassword = mode === "forgot";

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "");
    const password = String(form.get("password") ?? "");
    const confirmPassword = String(form.get("confirmPassword") ?? "");

    if (
      mode === "login" &&
      (email !== "demo@gmail.com" || password !== "123456")
    ) {
      setError("Invalid email or password. Please try again.");
      return;
    }
    if (isRegistering && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (mode === "login") {
      onLogin?.();
      navigate("/dashboard");
      return;
    }
    setSubmitted(true);
  }

  function changeMode(nextMode: AuthMode) {
    setSubmitted(false);
    setError("");
    setShowPassword(false);
    navigate(
      nextMode === "login"
        ? "/login"
        : nextMode === "register"
          ? "/register"
          : "/forgot-password",
    );
  }

  function renderAuthForm() {
    if (isForgotPassword)
      return (
        <ForgotPasswordForm
          onSubmit={handleSubmit}
          error={error}
          onBackToLogin={() => changeMode("login")}
        />
      );
    if (isRegistering)
      return (
        <RegisterForm
          onSubmit={handleSubmit}
          error={error}
          showPassword={showPassword}
          onTogglePassword={() => setShowPassword((visible) => !visible)}
        />
      );
    return (
      <LoginForm
        onSubmit={handleSubmit}
        error={error}
        showPassword={showPassword}
        onTogglePassword={() => setShowPassword((visible) => !visible)}
        onForgotPassword={() => changeMode("forgot")}
      />
    );
  }

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  return (
    <main className="min-h-screen bg-[#f5f7fb] text-slate-900">
      <div className="mx-auto grid min-h-screen max-w-7xl lg:grid-cols-[1.05fr_0.95fr]">
        <AuthBrand />
        <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-10">
          <div className="w-full max-w-md">
            <div className="lg:hidden">
              <AuthMobileBrand />
            </div>
            <div className="mb-8">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#2f80ed]">
                {isForgotPassword ? "Account recovery" : "Welcome back"}
              </p>
              <h2 className="text-3xl font-semibold tracking-tight text-[#102a43]">
                {isForgotPassword
                  ? "Reset your password"
                  : isRegistering
                    ? "Create your workspace"
                    : "Sign in to SocialFlow"}
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-500">
                {isForgotPassword
                  ? "Enter your email and we’ll send a secure password reset link."
                  : isRegistering
                    ? "Start managing your social accounts from one place."
                    : "Keep your social workflows moving forward."}
              </p>
            </div>
            {!isForgotPassword && (
              <AuthTabs mode={mode} onChange={changeMode} />
            )}
            {submitted ? (
              <SuccessMessage
                mode={mode}
                onBack={() =>
                  isForgotPassword ? changeMode("login") : setSubmitted(false)
                }
              />
            ) : (
              renderAuthForm()
            )}
            <p className="mt-8 text-center text-xs leading-5 text-slate-400">
              By continuing, you agree to SocialFlow&apos;s terms and privacy
              policy.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

export default App;
