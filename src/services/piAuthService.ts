import { PiUser, UserProfile } from '../types';

declare global {
  interface Window {
    Pi?: {
      init: (config: { version: string; sandbox?: boolean }) => Promise<void>;
      authenticate: (
        scopes: string[],
        onIncompletePaymentFound?: (payment: unknown) => void
      ) => Promise<{
        accessToken: string;
        user: {
          uid: string;
          username: string;
          roles?: string[];
        };
      }>;
    };
    __PI_AUTH_RESULT__?: {
      accessToken: string;
      user: {
        uid: string;
        username: string;
        roles?: string[];
      };
    };
    __PI_USER__?: PiUser;
  }
}

export interface PiVerificationResponse {
  success: boolean;
  user?: PiUser;
  error?: string;
  details?: string;
}

class PiAuthService {
  private isInitialized = false;
  private isAuthenticating = false;

  /**
   * Helper to wait for window.Pi SDK script to finish loading
   */
  public async waitForPiSdk(maxWaitMs = 6000): Promise<boolean> {
    if (typeof window === 'undefined') return false;
    if (window.Pi) return true;

    const start = Date.now();
    while (Date.now() - start < maxWaitMs) {
      if (window.Pi) return true;
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
    return Boolean(window.Pi);
  }

  /**
   * Treat Pi.init(...) as a Promise; await it fully before calling Pi.authenticate(...)
   */
  public async initPi(): Promise<boolean> {
    if (this.isInitialized) return true;

    const sdkAvailable = await this.waitForPiSdk();
    if (!sdkAvailable || !window.Pi) {
      console.warn('Pi SDK not detected on window.');
      return false;
    }

    try {
      console.log('Treating Pi.init({ version: "2.0" }) as a Promise and awaiting fully...');
      await window.Pi.init({ version: '2.0' });
      this.isInitialized = true;
      console.log('Pi.init resolved successfully.');
      return true;
    } catch (err: any) {
      console.warn('Pi.init notice:', err?.message || err);
      try {
        await window.Pi.init({ version: '2.0', sandbox: true });
        this.isInitialized = true;
        return true;
      } catch (sandboxErr: any) {
        console.warn('Pi.init sandbox notice:', sandboxErr?.message || sandboxErr);
      }
      this.isInitialized = true;
      return true;
    }
  }

  /**
   * Behavior requirements:
   * - Treat Pi.init(...) as a Promise; await it fully before calling Pi.authenticate(...).
   * - Use the "username" scope.
   * - Send the returned access token to the backend, which must validate it by calling
   *   GET https://api.minepi.com/v2/me with Authorization: Bearer <accessToken> before establishing a session.
   *   No Pi Network API key is required for this flow.
   */
  public async authenticate(onIncompletePayment?: (payment: unknown) => void): Promise<{
    success: boolean;
    user?: PiUser;
    accessToken?: string;
    error?: string;
  }> {
    if (typeof window === 'undefined') {
      return { success: false, error: 'Window not defined' };
    }

    // If an early background auth already succeeded and verified user
    if (window.__PI_USER__ && window.__PI_AUTH_RESULT__?.accessToken) {
      return {
        success: true,
        user: window.__PI_USER__,
        accessToken: window.__PI_AUTH_RESULT__.accessToken,
      };
    }

    if (this.isAuthenticating) {
      // Return waiting or wait a moment
      await new Promise((res) => setTimeout(res, 800));
      if (window.__PI_USER__ && window.__PI_AUTH_RESULT__?.accessToken) {
        return {
          success: true,
          user: window.__PI_USER__,
          accessToken: window.__PI_AUTH_RESULT__.accessToken,
        };
      }
    }

    this.isAuthenticating = true;

    try {
      // Requirement: Treat Pi.init(...) as a Promise; await it fully before calling Pi.authenticate(...)
      await this.initPi();

      if (!window.Pi) {
        throw new Error('Pi Network SDK is not available. Please open inside Pi Browser.');
      }

      // Requirement: Use the "username" scope
      const scopes = ['username'];
      const onIncomplete = onIncompletePayment || ((payment: unknown) => {
        console.log('Pi incomplete payment found:', payment);
      });

      console.log('Calling Pi.authenticate(["username"]) ...');
      const authResult = await window.Pi.authenticate(scopes, onIncomplete);

      if (!authResult || !authResult.accessToken) {
        throw new Error('No access token returned by Pi Network SDK.');
      }

      console.log('Pi authentication received token. Validating with backend /api/pi/verify ...');
      window.__PI_AUTH_RESULT__ = authResult;

      // Requirement: Send the returned access token to the backend, which must validate it
      // by calling GET https://api.minepi.com/v2/me with Authorization: Bearer <accessToken>
      const verifyResult = await this.verifyTokenWithBackend(authResult.accessToken);
      if (!verifyResult.success || !verifyResult.user) {
        throw new Error(verifyResult.error || 'Server validation of Pi access token failed.');
      }

      window.__PI_USER__ = verifyResult.user;
      return {
        success: true,
        user: verifyResult.user,
        accessToken: authResult.accessToken,
      };
    } catch (error: any) {
      console.warn('Pi authenticate error handled:', error?.message || error);
      return {
        success: false,
        error: error?.message || 'Failed to authenticate with Pi Network',
      };
    } finally {
      this.isAuthenticating = false;
    }
  }

  /**
   * Send the returned access token to the backend endpoint (/api/pi/verify),
   * which validates via GET https://api.minepi.com/v2/me with Authorization: Bearer <accessToken>
   */
  public async verifyTokenWithBackend(accessToken: string): Promise<PiVerificationResponse> {
    try {
      const response = await fetch('/api/pi/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ accessToken }),
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        return {
          success: false,
          error: errJson.error || `Server responded with status ${response.status}`,
          details: errJson.details,
        };
      }

      const data = await response.json();
      return {
        success: true,
        user: data.user,
      };
    } catch (err: any) {
      console.error('Failed to communicate with /api/pi/verify:', err);
      return {
        success: false,
        error: err?.message || 'Network error communicating with verification server',
      };
    }
  }

  /**
   * Trigger Pi authentication automatically when the app loads
   */
  public autoTriggerAuthOnLoad(
    onSuccess: (profile: Partial<UserProfile>) => void,
    onStatus?: (status: { type: 'success' | 'error' | 'info'; message: string }) => void
  ): () => void {
    const handlePiUserFound = (piUser: PiUser, token?: string) => {
      onSuccess({
        isLoggedIn: true,
        oauthProvider: 'pi',
        name: piUser.username || 'Pi Pioneer',
        email: `${(piUser.username || 'pioneer').toLowerCase().replace(/\s+/g, '')}@pi.network`,
        piUsername: piUser.username,
        piUid: piUser.uid,
        accessToken: token,
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(piUser.username || 'pi')}`,
        lastSyncTimestamp: new Date().toISOString(),
      });

      onStatus?.({
        type: 'success',
        message: `Authenticated with Pi Network as @${piUser.username}`,
      });
    };

    // If already verified by early bootstrap
    if (window.__PI_USER__) {
      handlePiUserFound(window.__PI_USER__, window.__PI_AUTH_RESULT__?.accessToken);
    }

    // Listen for custom events dispatched by early loader or manual actions
    const onVerifiedEvent = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.user) {
        handlePiUserFound(detail.user, window.__PI_AUTH_RESULT__?.accessToken);
      }
    };

    window.addEventListener('pi:verified', onVerifiedEvent);

    // Also initiate authenticate directly if not yet verified
    (async () => {
      if (window.__PI_USER__) return;
      const ready = await this.waitForPiSdk(5000);
      if (ready && window.Pi && !window.__PI_USER__) {
        try {
          const result = await this.authenticate();
          if (result.success && result.user) {
            handlePiUserFound(result.user, result.accessToken);
          }
        } catch (err) {
          console.log('Auto auth note:', err);
        }
      }
    })();

    return () => {
      window.removeEventListener('pi:verified', onVerifiedEvent);
    };
  }
}

export const piAuthService = new PiAuthService();
