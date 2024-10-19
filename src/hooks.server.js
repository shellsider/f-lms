// src/hooks.server.js
import { PUBLIC_API_URL } from '$env/static/public';

export const handle = async ({ event, resolve }) => {
  const cookies = event.cookies;

  // Retrieve tokens from cookies
  let idToken = cookies.get('__session');
  const refreshToken = cookies.get('refresh_token');

  let shouldRefresh = false;

  if (idToken) {
    // Decode the JWT token to get the expiration time
    const tokenParts = idToken.split('.');
    if (tokenParts.length === 3) {
      const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString());
      const exp = payload.exp;
      const currentTime = Math.floor(Date.now() / 1000);
      const timeLeft = exp - currentTime;

      // Check if token is expired or about to expire (less than 5 minutes remaining)
      if (timeLeft < 300) {
        shouldRefresh = true;
      }
    } else {
      // Invalid token format, attempt to refresh
      shouldRefresh = true;
    }
  } else {
    // No idToken present, attempt to refresh
    shouldRefresh = true;
  }

  if (shouldRefresh && refreshToken) {
    try {
      // Refresh the token using the refresh_token
      const response = await fetch(`${PUBLIC_API_URL}/refresh-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          refresh_token: refreshToken
        }),
        credentials: 'include' // Include cookies
      });

      if (response.ok) {
        const data = await response.json();
        const newIdToken = data.idToken;
        const newRefreshToken = data.refreshToken;

        // Update cookies with new tokens
        cookies.set('__session', newIdToken, {
          httpOnly: true,
          maxAge: 3600, // 1 hour
          path: '/'
        });
        cookies.set('refresh_token', newRefreshToken, {
          httpOnly: true,
          maxAge: 30 * 24 * 3600, // 30 days
          path: '/'
        });

        idToken = newIdToken; // Update the idToken variable
      } else {
        // Clear cookies if refresh fails
        cookies.delete('__session');
        cookies.delete('refresh_token');
      }
    } catch (error) {
      console.error('Error refreshing token:', error);
      cookies.delete('__session');
      cookies.delete('refresh_token');
    }
  }

  // You can set the user information in locals if needed
  if (idToken) {
    event.locals.user = { idToken };
  } else {
    event.locals.user = null;
  }

  // Proceed with the request
  return await resolve(event);
};
