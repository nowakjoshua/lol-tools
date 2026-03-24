// navbar.js - Shared top navigation bar + login modal for all LoL Tools pages
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
        <div class="nav-auth">
          <a href="/lol-tools/profile.html" class="nav-profile-btn" id="navProfileBtn" style="display:none">👤 <span id="navUsername"></span></a>
          <button class="nav-login-btn" id="navLoginBtn">🔑 Login</button>
          <button class="nav-logout-btn" id="navLogoutBtn" style="display:none">Logout</button>
        </div>
      </div>
    </nav>

    <!-- Global Auth Modal -->
    <div id="navAuthModal" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.75);z-index:9999;align-items:center;justify-content:center">
      <div style="background:#111118;border:1px solid #2a2a3a;border-radius:12px;padding:28px;width:380px;max-width:95vw;display:flex;flex-direction:column;gap:16px">
        <div style="font-size:1rem;font-weight:700;color:#c89b3c;letter-spacing:0.05em">Account</div>
        <div style="display:flex;border-bottom:1px solid #2a2a3a">
          <button id="navTabLogin" style="background:none;border:none;border-bottom:2px solid #c89b3c;color:#c89b3c;cursor:pointer;font-size:0.82rem;font-weight:600;letter-spacing:0.06em;margin-bottom:-1px;padding:8px 16px;text-transform:uppercase">Login</button>
          <button id="navTabRegister" style="background:none;border:none;border-bottom:2px solid transparent;color:#5b5b5b;cursor:pointer;font-size:0.82rem;font-weight:600;letter-spacing:0.06em;margin-bottom:-1px;padding:8px 16px;text-transform:uppercase">Register</button>
        </div>
        <div style="display:flex;flex-direction:column;gap:6px">
          <label style="font-size:0.7rem;text-transform:uppercase;letter-spacing:0.1em;color:#5b5b5b">Username</label>
          <input id="navAuthUser" type="text" placeholder="your_username" autocomplete="off" spellcheck="false"
            style="background:#0d0d14;border:1px solid #2a2a3a;border-radius:6px;color:#c8a96e;font-size:0.95rem;padding:10px 14px;outline:none;width:100%">
        </div>
        <div style="display:flex;flex-direction:column;gap:6px">
          <label style="font-size:0.7rem;text-transform:uppercase;letter-spacing:0.1em;color:#5b5b5b">Password</label>
          <input id="navAuthPass" type="password" placeholder="••••••••"
            style="background:#0d0d14;border:1px solid #2a2a3a;border-radius:6px;color:#c8a96e;font-size:0.95rem;padding:10px 14px;outline:none;width:100%">
        </div>
        <div id="navAuthError" style="color:#f44336;font-size:0.78rem;min-height:18px"></div>
        <div style="display:flex;gap:8px">
          <button id="navAuthCancel" style="flex:1;background:none;border:1px solid #2a2a3a;border-radius:6px;color:#5b5b5b;cursor:pointer;font-size:0.82rem;padding:9px 14px">Cancel</button>
          <button id="navAuthSubmit" style="flex:1;background:#1a1608;border:1px solid #c89b3c;border-radius:6px;color:#c89b3c;cursor:pointer;font-size:0.82rem;font-weight:700;padding:9px 14px">Login</button>
        </div>
      </div>
    </div>

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
      body { padding-top: 80px !important; }
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
      .nav-links a:hover, .nav-links a.active { color: #c8a96e; background: #1a1a24; }
      .nav-auth { display: flex; align-items: center; gap: 8px; margin-left: auto; flex-shrink: 0; }
      .nav-profile-btn {
        color: #c8a96e; text-decoration: none;
        font-size: 0.78rem; padding: 5px 10px;
        border: 1px solid #2a2a3a; border-radius: 5px;
        transition: all 0.15s;
        display: inline-flex; align-items: center; gap: 5px;
      }
      .nav-profile-btn:hover { border-color: #c89b3c; color: #c89b3c; }
      .nav-login-btn, .nav-logout-btn {
        background: none; cursor: pointer;
        font-size: 0.78rem; padding: 5px 12px;
        border-radius: 5px; transition: all 0.15s;
      }
      .nav-login-btn { border: 1px solid #c89b3c44; color: #c89b3c; background: #1a1608; }
      .nav-login-btn:hover { background: #c89b3c; color: #0a0a0f; }
      .nav-logout-btn { border: 1px solid #2a2a3a; color: #5b5b5b; }
      .nav-logout-btn:hover { border-color: #f44336; color: #f44336; }
      #navAuthUser:focus, #navAuthPass:focus { border-color: #c89b3c !important; }
    </style>
  `;

  document.body.insertAdjacentHTML('afterbegin', NAV_HTML);

  // Mark active nav link
  const path = window.location.pathname;
  document.querySelectorAll('.nav-links a').forEach(a => {
    if (path.endsWith(a.getAttribute('href').split('/').pop())) a.classList.add('active');
  });

  // ── Auth modal logic ──
  let navAuthMode = 'login';
  const modal = document.getElementById('navAuthModal');

  function openNavModal(mode) {
    navAuthMode = mode || 'login';
    document.getElementById('navAuthUser').value = '';
    document.getElementById('navAuthPass').value = '';
    document.getElementById('navAuthError').textContent = '';
    setNavTab(navAuthMode);
    modal.style.display = 'flex';
    setTimeout(() => document.getElementById('navAuthUser').focus(), 50);
  }

  function closeNavModal() {
    modal.style.display = 'none';
  }

  function setNavTab(mode) {
    navAuthMode = mode;
    const loginTab    = document.getElementById('navTabLogin');
    const registerTab = document.getElementById('navTabRegister');
    const submitBtn   = document.getElementById('navAuthSubmit');
    loginTab.style.borderBottomColor    = mode === 'login'    ? '#c89b3c' : 'transparent';
    loginTab.style.color                = mode === 'login'    ? '#c89b3c' : '#5b5b5b';
    registerTab.style.borderBottomColor = mode === 'register' ? '#c89b3c' : 'transparent';
    registerTab.style.color             = mode === 'register' ? '#c89b3c' : '#5b5b5b';
    submitBtn.textContent = mode === 'login' ? 'Login' : 'Register';
  }

  document.getElementById('navTabLogin').onclick    = () => setNavTab('login');
  document.getElementById('navTabRegister').onclick = () => setNavTab('register');
  document.getElementById('navAuthCancel').onclick  = closeNavModal;
  modal.addEventListener('click', e => { if (e.target === modal) closeNavModal(); });

  ['navAuthUser', 'navAuthPass'].forEach(id => {
    document.getElementById(id).addEventListener('keydown', e => {
      if (e.key === 'Enter') document.getElementById('navAuthSubmit').click();
    });
  });

  document.getElementById('navAuthSubmit').onclick = async () => {
    const username = document.getElementById('navAuthUser').value.trim().toLowerCase();
    const password = document.getElementById('navAuthPass').value;
    const errEl    = document.getElementById('navAuthError');
    const btn      = document.getElementById('navAuthSubmit');

    errEl.textContent = '';
    if (!username || !password) { errEl.textContent = 'Please fill in all fields.'; return; }
    if (username.length < 3)    { errEl.textContent = 'Username must be at least 3 characters.'; return; }
    if (password.length < 6)    { errEl.textContent = 'Password must be at least 6 characters.'; return; }

    const email = username + '@lol-tools.app';
    btn.disabled = true;
    btn.textContent = '⏳';

    const sb = window._sb;
    if (navAuthMode === 'register') {
      const { error } = await sb.auth.signUp({ email, password, options: { data: { username } } });
      if (error) {
        errEl.textContent = error.message.includes('already') ? 'Username already taken.' : error.message;
        btn.disabled = false; btn.textContent = 'Register'; return;
      }
    } else {
      const { error } = await sb.auth.signInWithPassword({ email, password });
      if (error) {
        errEl.textContent = 'Invalid username or password.';
        btn.disabled = false; btn.textContent = 'Login'; return;
      }
    }
    btn.disabled = false;
    closeNavModal();
  };

  // Make openNavModal globally available so page scripts can call it
  window.openAuthModal = openNavModal;

  // ── Auth state ──
  async function updateNav(session) {
    const user = session?.user || null;
    if (user) {
      const { data: profile } = await window._sb.from('profiles').select('username').eq('id', user.id).single();
      const username = profile?.username || user.email?.split('@')[0] || 'Profile';
      document.getElementById('navUsername').textContent = username;
      document.getElementById('navProfileBtn').style.display = 'flex';
      document.getElementById('navLoginBtn').style.display   = 'none';
      document.getElementById('navLogoutBtn').style.display  = 'block';
    } else {
      document.getElementById('navProfileBtn').style.display = 'none';
      document.getElementById('navLoginBtn').style.display   = 'block';
      document.getElementById('navLogoutBtn').style.display  = 'none';
    }
  }

  window.addEventListener('load', async () => {
    // auth-service.js already initialized window._sb — subscribe to its state
    window._onAuthChange(async (session) => await updateNav(session));

    document.getElementById('navLoginBtn').onclick  = () => openNavModal('login');
    document.getElementById('navLogoutBtn').onclick = async () => { await window._sb.auth.signOut(); };
  });

})();
