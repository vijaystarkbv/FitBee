import React, { useState, useCallback, useRef } from 'react';
import { supabase } from '../../services/supabaseClient';
import './auth.css';

interface LoginFormProps {
  onSuccess: () => void;
}

type AuthView = 'login' | 'signup';
type ButtonState = 'idle' | 'loading' | 'success';

/* ── Inline SVG Icons ── */

const PaintbrushIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18.37 2.63 14 7l-1.59-1.59a2 2 0 0 0-2.82 0L8 7l9 9 1.59-1.59a2 2 0 0 0 0-2.82L17 10l4.37-4.37a2.12 2.12 0 1 0-3-3Z" />
    <path d="M9 8c-2 3-4 3.5-7 4l8 10c2-1 6-5 6-7" />
    <path d="M14.5 17.5 4.5 15" />
  </svg>
);

const EyeIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
    <line x1="2" x2="22" y1="2" y2="22" />
  </svg>
);

const GoogleIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" width="20" height="20">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

const CheckIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const AlertCircleIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" x2="12" y1="8" y2="12" />
    <line x1="12" x2="12.01" y1="16" y2="16" />
  </svg>
);

/* ── Helpers ── */

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* ── Component ── */

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const [view, setView] = useState<AuthView>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [buttonState, setButtonState] = useState<ButtonState>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<{ visible: boolean; fadeOut: boolean }>({ visible: false, fadeOut: false });
  const btnRef = useRef<HTMLButtonElement>(null);

  const isLogin = view === 'login';

  /* ── Validation ── */
  const validateEmail = useCallback((value: string) => {
    if (value && !isValidEmail(value)) {
      setEmailError('Please enter a valid email address.');
    } else {
      setEmailError(null);
    }
  }, []);

  /* ── Ripple effect ── */
  const createRipple = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const ripple = document.createElement('span');
    ripple.className = 'auth-ripple';
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    button.appendChild(ripple);

    setTimeout(() => ripple.remove(), 500);
  }, []);

  /* ── Show snackbar ── */
  const showSnackbar = useCallback(() => {
    setSnackbar({ visible: true, fadeOut: false });
    setTimeout(() => {
      setSnackbar({ visible: true, fadeOut: true });
      setTimeout(() => setSnackbar({ visible: false, fadeOut: false }), 300);
    }, 2500);
  }, []);

  /* ── Submit ── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setEmailError(null);

    if (!isValidEmail(email)) {
      setEmailError('This email address is not valid.');
      return;
    }

    setButtonState('loading');

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
      }

      setButtonState('success');

      if (!isLogin) {
        showSnackbar();
      }

      setTimeout(() => {
        onSuccess();
      }, isLogin ? 800 : 1200);
    } catch (err: any) {
      setButtonState('idle');
      const msg = err.message || 'Authentication failed. Please try again.';
      if (msg.toLowerCase().includes('email') || msg.toLowerCase().includes('user not found')) {
        setEmailError(msg);
      } else {
        setErrorMessage(msg);
      }
    }
  };

  /* ── Google Sign In ── */
  const handleGoogleAuth = async () => {
    setErrorMessage(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setErrorMessage(err.message || 'Google sign-in failed.');
    }
  };

  /* ── Switch view ── */
  const switchView = () => {
    setView(isLogin ? 'signup' : 'login');
    setErrorMessage(null);
    setEmailError(null);
    setButtonState('idle');
  };

  /* ── Button content ── */
  const renderButtonContent = () => {
    if (buttonState === 'loading') {
      return (
        <>
          <span className="auth-loading-dots">
            <span className="auth-loading-dot" />
            <span className="auth-loading-dot" />
            <span className="auth-loading-dot" />
          </span>
          <span className="auth-loading-text">
            {isLogin ? 'Signing in…' : 'Creating account…'}
          </span>
        </>
      );
    }
    if (buttonState === 'success') {
      return (
        <span className="auth-success-check">
          <CheckIcon />
        </span>
      );
    }
    return isLogin ? 'Sign In' : 'Create Account';
  };

  return (
    <div className="auth-page">
      {/* Snackbar */}
      {snackbar.visible && (
        <div className={`auth-snackbar${snackbar.fadeOut ? ' fade-out' : ''}`}>
          <CheckIcon />
          Sign up complete
        </div>
      )}

      <div className="auth-card" key={view}>
        {/* Logo & Header */}
        <div className="auth-header">
          <div className="auth-logo">
            <PaintbrushIcon />
          </div>
          <h1 className="auth-title">
            {isLogin ? 'Welcome back' : 'Create your account'}
          </h1>
          <p className="auth-subtitle">
            {isLogin
              ? 'Sign in to your FitBee account'
              : 'Start your fitness journey with FitBee'}
          </p>
        </div>

        {/* Form */}
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          {/* Global error */}
          {errorMessage && (
            <div className="auth-error-banner">{errorMessage}</div>
          )}

          {/* Email */}
          <div className="auth-input-group">
            <label className="auth-input-label" htmlFor="auth-email">
              Email Address
            </label>
            <input
              id="auth-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) validateEmail(e.target.value);
              }}
              onBlur={() => validateEmail(email)}
              placeholder="you@example.com"
              className={`auth-input${emailError ? ' has-error' : ''}`}
            />
            {emailError && (
              <div className="auth-field-error">
                <AlertCircleIcon />
                {emailError}
              </div>
            )}
          </div>

          {/* Password */}
          <div className="auth-input-group">
            <label className="auth-input-label" htmlFor="auth-password">
              Password
            </label>
            <div className="auth-password-wrapper">
              <input
                id="auth-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete={isLogin ? 'current-password' : 'new-password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="auth-input"
                style={{ paddingRight: 48 }}
              />
              <button
                type="button"
                className="auth-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                tabIndex={-1}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>

          {/* Primary Button */}
          <button
            ref={btnRef}
            type="submit"
            className="auth-btn-primary"
            disabled={buttonState !== 'idle' || !email || !password}
            onClick={(e) => {
              if (buttonState === 'idle') createRipple(e);
            }}
          >
            {renderButtonContent()}
          </button>

          {/* Divider */}
          <div className="auth-divider">
            <span>or</span>
          </div>

          {/* Google Button */}
          <button
            type="button"
            className="auth-btn-google"
            onClick={handleGoogleAuth}
            disabled={buttonState !== 'idle'}
          >
            <GoogleIcon />
            {isLogin ? 'Continue with Google' : 'Sign up with Google'}
          </button>
        </form>

        {/* Footer */}
        <div className="auth-footer">
          <p className="auth-footer-text">
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button type="button" className="auth-footer-link" onClick={switchView}>
              {isLogin ? 'Create one' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
