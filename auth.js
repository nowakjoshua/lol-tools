// auth.js - Shared Supabase auth + profile helpers
// Include BEFORE page-specific scripts

const SUPABASE_URL = 'https://pwqnwxxxrynlklxrbuco.supabase.co';
const SUPABASE_KEY = 'sb_publishable_OqIsltFoT9bYBcZ-Ik_uRg_Lr9xmpAh';
const sb = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let currentUser = null;
let currentProfile = null;

async function getProfile(userId) {
  const { data } = await sb.from('profiles').select('*').eq('id', userId).single();
  return data;
}

async function initAuth(onAuthChange) {
  const { data: { session } } = await sb.auth.getSession();
  currentUser = session?.user || null;
  if (currentUser) currentProfile = await getProfile(currentUser.id);
  if (onAuthChange) await onAuthChange(currentUser, currentProfile);

  sb.auth.onAuthStateChange(async (event, session) => {
    currentUser = session?.user || null;
    currentProfile = currentUser ? await getProfile(currentUser.id) : null;
    if (onAuthChange) await onAuthChange(currentUser, currentProfile);
  });
}
