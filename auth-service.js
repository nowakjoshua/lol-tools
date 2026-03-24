// auth-service.js — Single Supabase client for all LoL Tools pages
// Must be loaded BEFORE any other scripts that need auth

(function () {
  const SUPABASE_URL = 'https://pwqnwxxxrynlklxrbuco.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_OqIsltFoT9bYBcZ-Ik_uRg_Lr9xmpAh';

  // Create one shared client, stored globally
  window.SUPABASE_URL = SUPABASE_URL;
  window.SUPABASE_KEY = SUPABASE_KEY;
  window._sb = supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: {
      persistSession: true,
      storageKey: 'lol-tools-auth',
      storage: window.localStorage,
      autoRefreshToken: true,
      detectSessionInUrl: false,
    }
  });

  // Global listeners registry — any page can subscribe to auth changes
  window._authListeners = [];
  window._currentSession = null;

  window._onAuthChange = function (callback) {
    window._authListeners.push(callback);
    // Immediately call with current session if already loaded
    if (window._authReady) callback(window._currentSession);
  };

  // Initialize auth once
  window._sb.auth.getSession().then(({ data: { session } }) => {
    window._currentSession = session;
    window._authReady = true;
    window._authListeners.forEach(fn => fn(session));
  });

  window._sb.auth.onAuthStateChange((event, session) => {
    window._currentSession = session;
    window._authReady = true;
    window._authListeners.forEach(fn => fn(session));
  });
})();
