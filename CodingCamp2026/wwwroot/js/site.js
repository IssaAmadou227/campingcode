/* ── LOADER ── */
window.addEventListener('load', () => {
  setTimeout(() => {
    const l = document.getElementById('loader');
    if (!l) return;
    l.style.opacity = '0';
    l.style.pointerEvents = 'none';
    setTimeout(() => l.style.display = 'none', 500);
    triggerReveal();
  }, 1600);
});

/* ── PAGE SYSTEM ── */
function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nlink').forEach(l => l.classList.remove('active'));
  const target = document.getElementById('page-' + id);
  if (target) target.classList.add('active');
  document.querySelectorAll(`.nlink[data-page="${id}"]`).forEach(l => l.classList.add('active'));
  window.scrollTo({ top: 0, behavior: 'instant' });
  setTimeout(triggerReveal, 80);
}

/* ── HAMBURGER ── */
const ham = document.getElementById('ham');
const mob = document.getElementById('mob');
if (ham && mob) {
  ham.addEventListener('click', () => {
    ham.classList.toggle('open');
    mob.classList.toggle('open');
  });
}
function closeMob() {
  if (ham) ham.classList.remove('open');
  if (mob) mob.classList.remove('open');
}

/* ── SCROLL ── */
const nav = document.getElementById('nav');
const btt = document.getElementById('btt');
window.addEventListener('scroll', () => {
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 20);
  if (btt) btt.classList.toggle('vis', window.scrollY > 500);
});

/* ── REVEAL ── */
function triggerReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
  }, { threshold: 0.07 });
  document.querySelectorAll('.page.active .r, .page.active .rl, .page.active .rr').forEach(el => {
    el.classList.remove('in');
    obs.observe(el);
  });
}
setTimeout(triggerReveal, 200);

/* ── COUNTDOWN ── */
function tick() {
  const target = document.getElementById('cd-d');
  if (!target) return;
  const diff = new Date('2026-08-02T08:00:00') - new Date();
  if (diff <= 0) return;
  const p = n => String(n).padStart(2, '0');
  document.getElementById('cd-d').textContent = p(Math.floor(diff / 864e5));
  document.getElementById('cd-h').textContent = p(Math.floor((diff % 864e5) / 36e5));
  document.getElementById('cd-m').textContent = p(Math.floor((diff % 36e5) / 6e4));
  document.getElementById('cd-s').textContent = p(Math.floor((diff % 6e4) / 1e3));
}
tick();
setInterval(tick, 1000);

/* ── COUNTERS ── */
function animCtr(el) {
  if (el.dataset.done) return;
  el.dataset.done = '1';
  const t = +el.dataset.t, dur = 1500, step = 14, inc = t / (dur / step);
  let cur = 0;
  const iv = setInterval(() => {
    cur = Math.min(cur + inc, t);
    el.textContent = t >= 1000 ? Math.round(cur).toLocaleString('fr-FR') : Math.round(cur);
    if (cur >= t) {
      el.textContent = t >= 1000 ? t.toLocaleString('fr-FR') : t;
      clearInterval(iv);
    }
  }, step);
}
const cObs = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) animCtr(e.target); }), { threshold: 0.5 });
document.querySelectorAll('.ctr').forEach(el => cObs.observe(el));

/* ── PROG TABS ── */
function switchPtab(btn, id) {
  document.querySelectorAll('.ptab').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.prog-content').forEach(c => c.classList.remove('active'));
  btn.classList.add('active');
  const target = document.getElementById(id);
  if (target) target.classList.add('active');
  setTimeout(triggerReveal, 80);
}

/* ── FORMATION TABS ── */
function switchFtab(btn, id) {
  document.querySelectorAll('.ftab').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.ftab-content').forEach(c => c.classList.remove('active'));
  btn.classList.add('active');
  const target = document.getElementById(id);
  if (target) target.classList.add('active');
}

/* ── FAQ ── */
document.querySelectorAll('.fq-q').forEach(q => {
  q.addEventListener('click', () => {
    const item = q.parentElement;
    const open = item.classList.contains('open');
    document.querySelectorAll('.fq-item').forEach(i => {
      i.classList.remove('open');
      const ans = i.querySelector('.fq-a');
      if (ans) ans.classList.remove('open');
    });
    if (!open) {
      item.classList.add('open');
      const ans = item.querySelector('.fq-a');
      if (ans) ans.classList.add('open');
    }
  });
});

/* ── ÉDITIONS ACCORDION ── */
function toggleEt(el) { el.classList.toggle('open'); }

/* ── CONTACT FORM ── */
function submitForm() {
  const p = document.getElementById('f-prenom').value;
  const n = document.getElementById('f-nom').value;
  const o = document.getElementById('f-objet').value;
  const m = document.getElementById('f-msg').value;
  if (!p || !n || !o || !m) {
    alert('Veuillez remplir tous les champs obligatoires.');
    return;
  }
  document.getElementById('form-success').style.display = 'block';
  document.getElementById('f-prenom').value = '';
  document.getElementById('f-nom').value = '';
  document.getElementById('f-email').value = '';
  document.getElementById('f-objet').value = '';
  document.getElementById('f-msg').value = '';
}

/* ── BACK TO TOP ── */
const bttBtn = document.getElementById('btt');
if (bttBtn) {
  bttBtn.addEventListener('click', e => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
