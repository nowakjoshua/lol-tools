// navbar.js - Shared top navigation bar for all LoL Tools pages
// Requires: @supabase/supabase-js already loaded, SUPABASE_URL + SUPABASE_KEY defined

(function () {
  const NAV_HTML = `
    <nav id="lol-navbar">
      <div class="nav-inner">
        <a class="nav-logo" href="/lol-tools/index.html">⚔️ LoL Tools</a>
        <div class="nav-links">
          <a href="/lol-tools/item-comparer.html">🛡️ Items</a>
          <a href="/lol-tools/build-planner.html">🧮 Builds</a>
          <a href="/lol-tools/performance.html">📈 Performance</a>
        </div>
        <div class="nav-auth" id="navAuth">
          <a href="/lol-tools/profile.html" class="nav-profile-btn" id="navProfileBtn" style="display:none">👤 <span id="navUsername"></span></a>
          <button class="nav-login-btn" id="navLoginBtn">🔑 Login</button>
          <button class="nav-logout-btn" id="navLogoutBtn" style="display:none">Logout</button>
        </div>
      </div>
    </nav>
    <style>
      #lol-navbar {
        background: #0d0d14;
        border-bottom: 1px solid #1a1a24;
        padding: 0 24px;
        position: fixed;
        top: 0; left: 0; right: 0;
        z-index: 500;
        width: 100%;
      }
      body {
        padding-top: 52px !important;
      }
      .nav-inner {
        max-width: 1200px; margin: 0 auto;
        display: flex; align-items: center; gap: 24px;
        height: 52px;
      }
      .nav-logo {
        font-size: 0.95rem; font-weight: 800;
        color: #c89b3c; text-decoration: none;
        letter-spacing: 0.08em; text-transform: uppercase;
        flex-shrink: 0;
      }
      .nav-links { display: flex; gap: 4px; flex: 1; }
      .nav-links a {
        color: #5b5b5b; text-decoration: none;
        font-size: 0.78rem; padding: 6px 10px;
        border-radius: 5px; transition: all 0.15s;
        letter-spacing: 0.04em;
      }
      .nav-links a:hover, .nav-links a.active {
        color: #c8a96e; background: #1a1a24;
      }
      .nav-auth { display: flex; align-items: center; gap: 8px; margin-left: auto; flex-shrink: 0; }
      .nav-profile-btn {
        color: #c8a96e; text-decoration: none;
        font-size: 0.78rem; padding: 5px 10px;
        border: 1px solid #2a2a3a; border-radius: 5px;
        transition: all 0.15s;
      }
      .nav-profile-btn:hover { border-color: #c89b3c; color: #c89b3c; }
      .nav-login-btn, .nav-logout-btn {
        background: none; cursor: pointer;
        font-size: 0.78rem; padding: 5px 12px;
        border-radius: 5px; transition: all 0.15s;
      }
      .nav-login-btn {
        border: 1px solid #c89b3c44; color: #c89b3c;
        background: #1a1608;
      }
      .nav-login-btn:hover { background: #c89b3c; color: #0a0a0f; }
      .nav-logout-btn {
        border: 1px solid #2a2a3a; color: #5b5b5b;
      }
      .nav-logout-btn:hover { border-color: #f44336; color: #f44336; }

      @media (max-width: 600px) {
        .nav-links a span { display: none; }
        #navUsername { display: none; }
      }
    </style>
  `;

  // Inject navbar at top of body
  document.body.style.paddingTop = '0';
  document.body.style.marginTop = '0';
  document.body.insertAdjacentHTML('afterbegin', NAV_HTML);

  // Mark active link
  const path = window.location.pathname;
  document.querySelectorAll('.nav-links a').forEach(a => {
    if (path.endsWith(a.getAttribute('href').split('/').pop())) {
      a.classList.add('active');
    }
  });

  // Auth state
  async function updateNav(session) {
    const user = session?.user || null;
    const profileBtn  = document.getElementById('navProfileBtn');
    const loginBtn    = document.getElementById('navLoginBtn');
    const logoutBtn   = document.getElementById('navLogoutBtn');
    const usernameEl  = document.getElementById('navUsername');

    if (user) {
      // Get username from profiles
      const sb = window._sb || supabase.createClient(window.SUPABASE_URL, window.SUPABASE_KEY);
      window._sb = sb;
      const { data: profile } = await sb.from('profiles').select('username').eq('id', user.id).single();
      const username = profile?.username || user.email?.split('@')[0] || 'Profile';
      usernameEl.textContent = username;
      profileBtn.style.display = 'flex';
      loginBtn.style.display   = 'none';
      logoutBtn.style.display  = 'block';
    } else {
      profileBtn.style.display = 'none';
      loginBtn.style.display   = 'block';
      logoutBtn.style.display  = 'none';
    }
  }

  // Init after page scripts run
  window.addEventListener('load', async () => {
    const sb = window._sb || (window._sb = supabase.createClient(window.SUPABASE_URL, window.SUPABASE_KEY));
    const { data: { session } } = await sb.auth.getSession();
    await updateNav(session);
    sb.auth.onAuthStateChange(async (_, session) => await updateNav(session));

    // Login button → go to profile page (which has the auth modal)
    // Or open modal if defined on current page
    document.getElementById('navLoginBtn').onclick = () => {
      if (typeof openAuthModal === 'function') {
        openAuthModal('login');
      } else {
        window.location.href = '/lol-tools/profile.html';
      }
    };

    document.getElementById('navLogoutBtn').onclick = async () => {
      await sb.auth.signOut();
    };
  });
})();
