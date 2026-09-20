// --- Menu mobile ---
const navToggle = document.getElementById('navToggle');
const nav = document.getElementById('nav');
navToggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
});
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  nav.classList.remove('open');
  navToggle.setAttribute('aria-expanded', 'false');
}));

// --- Données dynamiques (mises à jour par le bot Discord via data.json) ---
async function loadData() {
  const territoireEl = document.getElementById('territoireCard');
  const equipeEl = document.getElementById('equipeGrid');

  try {
    // cache-buster pour être sûr d'afficher la dernière version publiée par le bot
    const res = await fetch('./data.json?t=' + Date.now());
    if (!res.ok) throw new Error('data.json introuvable');
    const data = await res.json();

    renderTerritoire(territoireEl, data.territoire);
    renderEquipe(equipeEl, data.membres || []);
  } catch (err) {
    territoireEl.innerHTML = '<p class="empty">Territoire non défini pour le moment.</p>';
    equipeEl.innerHTML = '<p class="empty">Aucun membre listé pour le moment.</p>';
    console.warn('Erreur de chargement de data.json :', err);
  }
}

function renderTerritoire(el, territoire) {
  if (!territoire || !territoire.quartier) {
    el.innerHTML = '<p class="empty">Aucun territoire revendiqué pour le moment.</p>';
    return;
  }
  const maj = territoire.dernierMAJ
    ? new Date(territoire.dernierMAJ).toLocaleString('fr-FR', { dateStyle: 'long', timeStyle: 'short' })
    : null;
  el.innerHTML = `
    <p class="quartier">${escapeHTML(territoire.quartier)}</p>
    ${territoire.description ? `<p class="description">${escapeHTML(territoire.description)}</p>` : ''}
    ${maj ? `<p class="maj">Dernière mise à jour : ${maj}</p>` : ''}
  `;
}

function renderEquipe(el, membres) {
  if (!membres.length) {
    el.innerHTML = '<p class="empty">Aucun membre listé pour le moment.</p>';
    return;
  }
  el.innerHTML = membres.map(m => `
    <div class="member-card">
      <p class="pseudo">${escapeHTML(m.pseudo || 'Sans nom')}</p>
      <p class="grade">${escapeHTML(m.grade || '')}</p>
    </div>
  `).join('');
}

function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

loadData();
