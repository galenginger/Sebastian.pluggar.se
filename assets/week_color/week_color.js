/* --- Konfiguration --- */
const START_WEEK = 36;  // v.1 motsvarar vecka 36

function getISOWeek(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7; // torsdagstricket
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}
function weeksInISOYear(year) {
  const dec28 = new Date(Date.UTC(year, 11, 28));
  return getISOWeek(dec28);
}
function moduleToWeek(x, isoWeeks) {
  return ((START_WEEK - 1 + (x - 1)) % isoWeeks) + 1;
}
function academicIndex(week, isoWeeks) {
  return (week - START_WEEK + isoWeeks) % isoWeeks;
}

const WEEK_RE = /^[Vv](\d{2})\b/; // fångar "V01", "V10", även om mer text följer

function colorWeeks() {
  const now = new Date();
  const curYear = now.getFullYear();
  const isoWeeksThisYear = weeksInISOYear(curYear);
  const currentWeek = getISOWeek(now);
  const currentIdx = academicIndex(currentWeek, isoWeeksThisYear);

  // Ta lite bredare urval: länkar, titlar och ellipsis-span i navet
  const items = document.querySelectorAll('.md-nav__link, .md-nav__title, .md-nav__item .md-ellipsis');

  items.forEach(el => {
    const text = (el.textContent || '').trim();
    const m = text.match(WEEK_RE);
    if (!m) return;

    const x = parseInt(m[1], 10);
    if (Number.isNaN(x)) return;

    const wk = moduleToWeek(x, isoWeeksThisYear);
    const idx = academicIndex(wk, isoWeeksThisYear);

    el.classList.remove('week-past', 'week-current', 'week-future');
    if (idx < currentIdx) el.classList.add('week-past');
    else if (idx === currentIdx) el.classList.add('week-current');
    else el.classList.add('week-future');
  });
}

// Debounce så vi inte kör för ofta vid många mutationer
let _debounce;
function scheduleColor() {
  clearTimeout(_debounce);
  _debounce = setTimeout(colorWeeks, 50);
}

function initWeekColoring() {
  colorWeeks();

  // Kör vid navigering (Material instant loading)
  document.addEventListener('navigation', colorWeeks);

  // Kör när användaren fäller ut/ihop menyer
  document.addEventListener('click', (e) => {
    if (e.target.closest('.md-nav__item--nested')) scheduleColor();
  });

  // Observera förändringar i sidomenyn (expand/collapse, lazy render)
  const nav = document.querySelector('nav.md-nav');
  if (nav) {
    const obs = new MutationObserver(scheduleColor);
    obs.observe(nav, { childList: true, subtree: true });
  }
}

document.addEventListener('DOMContentLoaded', initWeekColoring);
