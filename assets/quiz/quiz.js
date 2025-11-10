/* MkDocs Material – Quiz persistence + scoring (works with instant loading)
   - Per page/group/quiz persistence via localStorage
   - Stable radio/checkbox groups + per-option IDs (data-optid)
   - Delegated "Rätta alla" button
   - Robust init on DOMContentLoaded + document$.subscribe + fallback observers
   - Patch: sparar 'graded' och återställer .quiz-correct/.quiz-wrong vid init
*/

(function () {
  // ===== Utils =====
  function pageKeyPrefix() {
    const path = location.pathname.replace(/\/index\.html?$/, '/');
    return `quiz:${path}`;
  }
  function qsAll(root, sel) {
    return Array.from((root || document).querySelectorAll(sel));
  }
  function lsGet(key, fallback = null) {
    try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
    catch { return fallback; }
  }
  function lsSet(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
  }

  // ===== Stable names + option IDs =====
  function assignOptionIds(opts) {
    const inputs = opts.querySelectorAll('input[type="radio"],input[type="checkbox"]');
    inputs.forEach((el, idx) => {
      if (!el.dataset.optid) el.dataset.optid = String(idx);
      if (!el.hasAttribute('value')) el.value = `i${idx}`; // fallback for other scripts
    });
  }
  function ensureGroupNames(quizEl) {
    const opts = quizEl.querySelector('.quiz-options');
    const qid  = quizEl.getAttribute('data-quiz-id') || '';
    if (!opts) return;
    const base = opts.getAttribute('aria-label') || qid || `q-${Math.random().toString(36).slice(2,8)}`;
    const radios = opts.querySelectorAll('input[type="radio"]');
    const checks = opts.querySelectorAll('input[type="checkbox"]');
    if (radios.length) radios.forEach(r => { if (!r.name) r.name = base; });
    if (checks.length) checks.forEach(c => { if (!c.name) c.name = base; });
    assignOptionIds(opts);
  }

  // ===== Input helpers =====
  function inputsInQuiz(quizEl) {
    const arr = [];
    const opts = quizEl.querySelector('.quiz-options');
    if (opts) arr.push(...opts.querySelectorAll('input[type="radio"],input[type="checkbox"],select,textarea,input[type="text"]'));
    arr.push(...quizEl.querySelectorAll('.quiz-inline-input'));
    return arr;
  }
  function collectAnswers(quizEl) {
    const answers = {};
    for (const el of inputsInQuiz(quizEl)) {
      const key = (el.name || el.id || el.dataset.key || el.type || 'x');
      if (el.type === 'checkbox') {
        if (!Array.isArray(answers[key])) answers[key] = [];
        if (el.checked) {
          const oid = el.dataset.optid ?? el.value ?? 'on';
          answers[key].push(String(oid));
        }
      } else if (el.type === 'radio') {
        if (!(key in answers)) answers[key] = null;
        if (el.checked) {
          const oid = el.dataset.optid ?? el.value ?? 'on';
          answers[key] = String(oid);
        }
      } else if (el.tagName === 'SELECT') {
        answers[key] = el.multiple
          ? Array.from(el.selectedOptions).map(o => o.value)
          : el.value;
      } else {
        answers[key] = el.value ?? '';
      }
    }
    return answers;
  }
  function restoreAnswers(quizEl, saved) {
    if (!saved) return;
    for (const el of inputsInQuiz(quizEl)) {
      const key = (el.name || el.id || el.dataset.key || el.type || 'x');
      const val = saved[key];
      if (val === undefined) continue;

      if (el.type === 'checkbox') {
        const oid = el.dataset.optid ?? el.value ?? 'on';
        el.checked = Array.isArray(val) && val.map(String).includes(String(oid));
      } else if (el.type === 'radio') {
        const oid = el.dataset.optid ?? el.value ?? 'on';
        el.checked = (val !== null) && String(val) === String(oid);
      } else if (el.tagName === 'SELECT') {
        if (el.multiple && Array.isArray(val)) {
          for (const opt of el.options) opt.selected = val.includes(opt.value);
        } else {
          el.value = val ?? '';
        }
      } else {
        el.value = val ?? '';
      }
    }
  }

  // ===== Completion & correctness =====
  function isAnswered(quizEl) {
    const opts = quizEl.querySelector('.quiz-options');
    const inline = quizEl.querySelector('.quiz-inline-input');
    if (inline) return !!inline.value.trim();
    if (!opts) return false;

    const radios = Array.from(opts.querySelectorAll('input[type="radio"]'));
    const checks = Array.from(opts.querySelectorAll('input[type="checkbox"]'));
    if (radios.length) return radios.some(r => r.checked);
    if (checks.length) {
      const name = checks[0].name;
      const group = checks.filter(c => c.name === name);
      return group.some(c => c.checked);
    }
    const any = opts.querySelector('input[type="text"],textarea,select');
    if (any) {
      if (any.tagName === 'SELECT') return any.multiple ? any.selectedOptions.length > 0 : !!any.value;
      return !!any.value?.trim();
    }
    return false;
  }
  function markCompleted(quizEl, done) {
    quizEl.classList.toggle('quiz-completed', !!done);
  }
  function checkCorrectness(quizEl) {
    const pts = Number(quizEl.getAttribute('data-points') || 0);
    const fb = quizEl.querySelector('.quiz-feedback');
    let correct = false;

    const inline = quizEl.querySelector('.quiz-inline-input');
    const pattern = quizEl.getAttribute('data-pattern');
    if (inline) {
      if (pattern) {
        try { correct = new RegExp(pattern).test(inline.value); }
        catch { correct = inline.value.trim().length > 0; }
      } else {
        correct = inline.value.trim().length > 0;
      }
      if (fb) { fb.hidden = false; fb.textContent = correct ? 'Rätt!' : 'Inte riktigt, prova igen.'; }
      return { correct, points: correct ? pts : 0, max: pts };
    }

    const opts = quizEl.querySelector('.quiz-options');
    if (!opts) return { correct: false, points: 0, max: pts };

    const radios = Array.from(opts.querySelectorAll('input[type="radio"]'));
    const checks = Array.from(opts.querySelectorAll('input[type="checkbox"]'));
    if (radios.length) {
      const correctEl = radios.find(r => r.hasAttribute('data-correct'));
      correct = !!correctEl && !!correctEl.checked;
    } else if (checks.length) {
      const should = new Set(checks.filter(c => c.hasAttribute('data-correct')).map(c => c));
      const chosen = new Set(checks.filter(c => c.checked).map(c => c));
      correct = (should.size === chosen.size) && Array.from(should).every(c => chosen.has(c));
    }
    if (fb) { fb.hidden = false; fb.textContent = correct ? 'Rätt!' : 'Inte riktigt, prova igen.'; }
    return { correct, points: correct ? pts : 0, max: pts };
  }

  // ===== Init (idempotent) =====
  const initializedQuizzes = new WeakSet();

  function initQuiz(quizEl, groupKey) {
    if (initializedQuizzes.has(quizEl)) return; // avoid double-binding on re-init
    ensureGroupNames(quizEl);

    const qid = quizEl.getAttribute('data-quiz-id') || '';
    const keyAnswers = `${pageKeyPrefix()}|${groupKey}|${qid}|answers`;
    const keyDone    = `${pageKeyPrefix()}|${groupKey}|${qid}|done`;

    // Restore
    restoreAnswers(quizEl, lsGet(keyAnswers));
    markCompleted(quizEl, lsGet(keyDone) === true || (lsGet(keyDone) === 'true'));

    // Save on change/input
    const handler = () => {
      lsSet(keyAnswers, collectAnswers(quizEl));
      const done = isAnswered(quizEl);
      lsSet(keyDone, !!done);
      markCompleted(quizEl, done);
    };
    for (const el of inputsInQuiz(quizEl)) {
      el.addEventListener('change', handler, { passive: true });
      el.addEventListener('input',  handler, { passive: true });
    }

    initializedQuizzes.add(quizEl);
  }

  function initGroup(groupEl) {
    const groupId  = groupEl.id || groupEl.getAttribute('data-quiz-group') || 'group';
    const keyScore = `${pageKeyPrefix()}|:${groupId}|score`; // keep legacy-safe? we'll use consistent below too
    // NOTE: keep a consistent key (without colon typo); fix to:
    const fixedKeyScore = `${pageKeyPrefix()}|${groupId}|score`;

    const quizzes = qsAll(groupEl, '.quiz');
    quizzes.forEach(q => initQuiz(q, groupId));

    const resultEl = document.querySelector(`#${groupId}-result`);
    const saved = lsGet(fixedKeyScore) ?? lsGet(keyScore); // read either, if older key existed

    if (saved && resultEl) {
      resultEl.hidden = false;
      resultEl.textContent = `Tidigare resultat: ${saved.total} / ${saved.max} poäng.`;
    }

    // NYTT: applicera rätt/fel-klasser vid init om resultat finns (dvs gruppen har rättats)
    if (saved) {
      quizzes.forEach(q => {
        const r = checkCorrectness(q);
        q.classList.toggle('quiz-correct', r.correct);
        q.classList.toggle('quiz-wrong',  !r.correct);
        markCompleted(q, true);
      });
    }
  }

  function initAll() {
    qsAll(document, '.quiz-group').forEach(initGroup);
  }

  // ===== Delegated "Rätta alla" =====
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.quiz-check-all');
    if (!btn) return;

    const sel = btn.getAttribute('data-target');
    if (!sel) return;
    const groupEl = document.querySelector(sel);
    if (!groupEl) return;

    const groupId = groupEl.id || groupEl.getAttribute('data-quiz-group') || 'group';
    const quizzes = Array.from(groupEl.querySelectorAll('.quiz'));

    let total = 0, max = 0, answeredAll = true;

    quizzes.forEach(q => {
      ensureGroupNames(q); // safety
      if (!isAnswered(q)) answeredAll = false;

      const r = checkCorrectness(q);
      total += r.points; max += r.max;

      // visuellt: rätt/fel per fråga
      q.classList.toggle('quiz-correct', r.correct);
      q.classList.toggle('quiz-wrong',  !r.correct);

      const qid = q.getAttribute('data-quiz-id') || '';
      lsSet(`${pageKeyPrefix()}|${groupId}|${qid}|done`, true);
      markCompleted(q, true);
    });

    const msg = answeredAll
      ? `Resultat: ${total} / ${max} poäng.`
      : `Resultat (ofullständigt): ${total} / ${max} poäng. Besvara alla frågor för full rättning.`;

    const resId = `${groupId}-result`;
    const resultEl = document.getElementById(resId);
    if (resultEl) {
      resultEl.hidden = false;
      resultEl.textContent = msg;
    }

    // spara totalscore + graded-flagga
    lsSet(`${pageKeyPrefix()}|${groupId}|score`, { total, max, ts: Date.now() });
    lsSet(`${pageKeyPrefix()}|${groupId}|graded`, true);
  });

  // ===== Robust hooks for MkDocs Material =====
  const schedule = (() => {
    let t = null;
    return (delay = 0) => { clearTimeout(t); t = setTimeout(initAll, delay); };
  })();

  // 1) First load
  document.addEventListener('DOMContentLoaded', () => schedule(0));

  // 2) MkDocs Material official hook (preferred)
  if (window.document$ && typeof window.document$.subscribe === 'function') {
    window.document$.subscribe(() => {
      // Wait a tick so new content is in the DOM
      schedule(0);
    });
  } else {
    // 3) Fallback: custom 'navigation' + MutationObserver on content
    document.addEventListener('navigation', () => schedule(0));
    const contentRoot = document.querySelector('main') || document.body;
    const mo = new MutationObserver((mutations) => {
      for (const m of mutations) {
        for (const n of m.addedNodes) {
          if (n.nodeType === 1 && (n.matches?.('.quiz-group') || n.querySelector?.('.quiz-group'))) {
            schedule(0);
            return;
          }
        }
      }
    });
    mo.observe(contentRoot, { childList: true, subtree: true });
  }
})();
