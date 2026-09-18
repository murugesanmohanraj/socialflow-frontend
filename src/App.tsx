import { FormEvent, ReactElement, useEffect, useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { AuthBrand, AuthMobileBrand } from "./Components/Auth/AuthBrand";
import { AuthTabs } from "./Components/Auth/AuthTabs";
import { ForgotPasswordForm } from "./Components/Auth/ForgotPassword/ForgotPasswordForm";
import { LoginForm } from "./Components/Auth/Login/LoginForm";
import { RegisterForm } from "./Components/Auth/Register/RegisterForm";
import ResetPasswordView from "./Components/Auth/ResetPassword/ResetPasswordView";
import { SuccessMessage } from "./Components/Auth/SuccessMessage";
import { Toast } from "./Components/Auth/Toast";
import { AuthMode } from "./Components/Auth/types";
import CreateActionView from "./Components/Actions/CreateActionView";
import ActionExecutionView from "./Components/Actions/ActionExecutionView";
import ActionResultView from "./Components/Actions/ActionResultView";
import ActivityDetailsView from "./Components/Activity/ActivityDetailsView";
import AccountDetailsView from "./Components/Accounts/AccountDetailsView";
import FacebookConnectView from "./Components/Accounts/FacebookConnectView";
import InstagramConnectView from "./Components/Accounts/InstagramConnectView";
import OAuthAuthorizationView from "./Components/Accounts/OAuthAuthorizationView";
import TikTokConnectView from "./Components/Accounts/TikTokConnectView";
import TikTokWorkflowView from "./Components/Workflow/TikTokWorkflowView";
import YouTubeWorkflowView from "./Components/Workflow/YouTubeWorkflowView";
import FacebookBrowserView from "./Components/Workflow/FacebookBrowserView";
import InstagramBrowserView from "./Components/Workflow/InstagramBrowserView";
import DashboardOverview from "./Components/Dashboard/DashboardOverview";
import { AUTH_TOKEN_KEY } from "./services/apiClient";
import {
  loginUser,
  logoutUser,
  registerUser,
  requestPasswordReset,
} from "./services/authApi";

const AUTH_STORAGE_KEY = "socialflow_authenticated";

function App() {
  return <AuthRouter />;
}

function AuthRouter() {
  const [isAuthenticated, setIsAuthenticated] = useState(() =>
    Boolean(localStorage.getItem(AUTH_TOKEN_KEY)),
  );

  useEffect(() => {
    function handleUnauthorized() {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      setIsAuthenticated(false);
    }

    window.addEventListener("socialflow:unauthorized", handleUnauthorized);
    return () =>
      window.removeEventListener("socialflow:unauthorized", handleUnauthorized);
  }, []);

  function handleLogin(token: string) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    localStorage.setItem(AUTH_STORAGE_KEY, "true");
    setIsAuthenticated(true);
  }

  function handleLogout() {
    void logoutUser().catch(() => undefined);
    localStorage.removeItem(AUTH_TOKEN_KEY);
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
      <Route path="/reset-password" element={<ResetPasswordView />} />
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
        path="/accounts/:accountId"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <AccountDetailsView onLogout={handleLogout} />
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
        path="/youtube-workflow"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <YouTubeWorkflowView />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tiktok-workflow"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <TikTokWorkflowView />
          </ProtectedRoute>
        }
      />
      <Route
        path="/facebook-browser"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <FacebookBrowserView />
          </ProtectedRoute>
        }
      />
      <Route
        path="/instagram-browser"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <InstagramBrowserView />
          </ProtectedRoute>
        }
      />
      <Route
        path="/actions/new"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <CreateActionView />
          </ProtectedRoute>
        }
      />
      <Route
        path="/actions/run"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <ActionExecutionView />
          </ProtectedRoute>
        }
      />
      <Route
        path="/actions/run/:actionId"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <ActionExecutionView />
          </ProtectedRoute>
        }
      />
      <Route
        path="/actions/result"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <ActionResultView />
          </ProtectedRoute>
        }
      />
      <Route
        path="/actions/result/:actionId"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <ActionResultView />
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
        path="/activity/:activityId"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <ActivityDetailsView />
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
        path="/connect/tiktok"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <TikTokConnectView />
          </ProtectedRoute>
        }
      />
      <Route
        path="/connect/youtube"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <OAuthAuthorizationView platform="youtube" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/connect/facebook"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <FacebookConnectView />
          </ProtectedRoute>
        }
      />
      <Route
        path="/connect/instagram"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <InstagramConnectView />
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
  onLogin?: (token: string) => void;
}) {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [resetUrl, setResetUrl] = useState<string | undefined>();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const isRegistering = mode === "register";
  const isForgotPassword = mode === "forgot";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;
    setError("");
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "");
    const password = String(form.get("password") ?? "");
    const confirmPassword = String(form.get("confirmPassword") ?? "");

    if (isRegistering && password !== confirmPassword) {
      showError("Passwords do not match.");
      return;
    }
    if (mode === "login") {
      setIsSubmitting(true);
      try {
        const response = await loginUser({ email, password });
        showSuccess("Signed in successfully. Redirecting...");
        window.setTimeout(() => {
          onLogin?.(response.token);
          navigate("/dashboard");
          setIsSubmitting(false);
        }, 650);
      } catch (requestError) {
        const message =
          requestError instanceof Error
            ? requestError.message
            : "Invalid email or password. Please try again.";
        setIsSubmitting(false);
        setError(message);
        showError(message);
      }
      return;
    }
    if (isRegistering) {
      setIsSubmitting(true);
      try {
        const response = await registerUser({
          name: String(form.get("name") ?? ""),
          email,
          password,
        });
        showSuccess("Account created successfully. Redirecting...");
        window.setTimeout(() => {
          onLogin?.(response.token);
          navigate("/dashboard");
          setIsSubmitting(false);
        }, 650);
      } catch (requestError) {
        const message =
          requestError instanceof Error
            ? requestError.message
            : "Unable to create your account. Please try again.";
        setIsSubmitting(false);
        setError(message);
        showError(message);
      }
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await requestPasswordReset({ email });
      setResetUrl(response.resetUrl);
      setSubmitted(true);
      showSuccess(response.message);
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : "Unable to request a password reset.";
      setError(message);
      showError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  function showSuccess(message: string) {
    setToast({ type: "success", message });
  }

  function showError(message: string) {
    setToast({ type: "error", message });
  }

  function changeMode(nextMode: AuthMode) {
    setSubmitted(false);
    setResetUrl(undefined);
    setError("");
    setToast(null);
    setIsSubmitting(false);
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
          isSubmitting={isSubmitting}
        />
      );
    if (isRegistering)
      return (
        <RegisterForm
          onSubmit={handleSubmit}
          error={error}
          showPassword={showPassword}
          onTogglePassword={() => setShowPassword((visible) => !visible)}
          isSubmitting={isSubmitting}
        />
      );
    return (
      <LoginForm
        onSubmit={handleSubmit}
        error={error}
        showPassword={showPassword}
        onTogglePassword={() => setShowPassword((visible) => !visible)}
        onForgotPassword={() => changeMode("forgot")}
        isSubmitting={isSubmitting}
      />
    );
  }

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  return (
    <main className="min-h-screen bg-[#f5f7fb] text-slate-900">
      {toast && <Toast type={toast.type} message={toast.message} />}
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
                    : "Sign in to Social Media Manager"}
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
                resetUrl={resetUrl}
                onBack={() =>
                  isForgotPassword ? changeMode("login") : setSubmitted(false)
                }
              />
            ) : (
              renderAuthForm()
            )}
            <p className="mt-8 text-center text-xs leading-5 text-slate-400">
              By continuing, you agree to Social Media Manager&apos;s terms and
              privacy policy.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

export default App;
