//@Maradou Solutions implement all js features here :IAmadou
document.addEventListener('error', (e) => {
  const t = e.target;
  if (!t || t.tagName !== 'IMG' || t.dataset.fbk) return;
  t.dataset.fbk = '1';
  const ps = t.closest('.ps-logo-area');
  if (ps) {
    const txt = ps.querySelector('.ps-txt');
    if (txt) txt.style.display = 'block';
    t.style.display = 'none';
    return;
  }
  const cl = t.closest('.company-logo');
  if (cl) {
    cl.textContent = t.alt || '';
    return;
  }
  t.style.visibility = 'hidden';
}, true);

window.addEventListener('load', () => {
  setTimeout(() => {
    const l = document.getElementById('loader');
    if (!l) return;
    l.style.opacity = '0';
    l.style.pointerEvents = 'none';
    setTimeout(() => l.style.display = 'none', 500);
    triggerReveal();
  }, 400);
});

function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nlink').forEach(l => l.classList.remove('active'));
  const target = document.getElementById('page-' + id);
  if (target) target.classList.add('active');
  document.querySelectorAll(`.nlink[data-page="${id}"]`).forEach(l => l.classList.add('active'));
  window.scrollTo({ top: 0, behavior: 'instant' });
  setTimeout(triggerReveal, 80);
}

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

const nav = document.getElementById('nav');
const btt = document.getElementById('btt');
window.addEventListener('scroll', () => {
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 20);
  if (btt) btt.classList.toggle('vis', window.scrollY > 500);
});

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

function switchPtab(btn, id) {
  document.querySelectorAll('.ptab').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.prog-content').forEach(c => c.classList.remove('active'));
  btn.classList.add('active');
  const target = document.getElementById(id);
  if (target) target.classList.add('active');
  setTimeout(triggerReveal, 80);
}

function switchFtab(btn, id) {
  document.querySelectorAll('.ftab').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.ftab-content').forEach(c => c.classList.remove('active'));
  btn.classList.add('active');
  const target = document.getElementById(id);
  if (target) target.classList.add('active');
}
// get all attr fq-q 
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

function toggleEt(el) { el.classList.toggle('open'); }

function loadYt(el, ev) {
  if (ev) ev.stopPropagation();
  if (el.classList.contains('loaded')) return;
  const id = el.getAttribute('data-yt');
  if (!id) return;
  el.classList.add('loaded', 'loading');
  const sp = document.createElement('span');
  sp.className = 'et-spinner';
  el.appendChild(sp);
  const done = () => {
    el.classList.remove('loading');
    if (sp.parentNode) sp.remove();
  };
  const ifr = document.createElement('iframe');
  ifr.src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0';
  ifr.title = 'Vidéo Coding Camp';
  ifr.loading = 'lazy';
  ifr.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
  ifr.allowFullscreen = true;
  ifr.addEventListener('load', done);
  setTimeout(done, 8000);
  el.appendChild(ifr);
}

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

const bttBtn = document.getElementById('btt');
if (bttBtn) {
  bttBtn.addEventListener('click', e => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}