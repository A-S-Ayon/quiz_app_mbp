const MARKS = {
  noOption: { correct: 5, wrong: -1 },
  withOption: { correct: 3, wrong: -2 },
  pass: 0,
  challenge: { correct: 4, wrong: -5 }
};

const QUESTIONS = [
  'প্রশ্ন ১',
  'প্রশ্ন ২',
  'প্রশ্ন ৩',
  'প্রশ্ন ৪',
  'প্রশ্ন ৫',
  'প্রশ্ন ৬',
  'প্রশ্ন ৭',
  'প্রশ্ন ৮',
  'প্রশ্ন ৯',
  'প্রশ্ন ১০',
  'এক্সট্রা'
];

let state = {};
let log = [];

function initState() {
  state = {};
  QUESTIONS.forEach((_, qi) => {
    ['t1', 't2'].forEach((t) => {
      state[`${qi}_${t}`] = { type: null, result: null, marks: 0 };
    });
  });
  log = [];
}

function getTeamName(team) {
  const el = document.getElementById(team === 't1' ? 'team1Input' : 'team2Input');
  if (!el) return team === 't1' ? 'টিম ১' : 'টিম ২';
  return el.value.trim() ? el.value.trim() : team === 't1' ? 'টিম ১' : 'টিম ২';
}

function calcMarks(type, result) {
  if (!type || !result) return 0;
  if (type === 'noOption') return result === 'correct' ? MARKS.noOption.correct : MARKS.noOption.wrong;
  if (type === 'withOption') return result === 'correct' ? MARKS.withOption.correct : MARKS.withOption.wrong;
  if (type === 'pass') return 0;
  if (type === 'challenge') return result === 'correct' ? MARKS.challenge.correct : MARKS.challenge.wrong;
  return 0;
}

function setMark(qi, team, type, result) {
  const key = `${qi}_${team}`;
  state[key] = { type, result, marks: calcMarks(type, result) };
  updateScores();
  renderRow(qi);
  const tName = getTeamName(team);
  const qLabel = QUESTIONS[qi];
  const typeLabel = {
    noOption: 'অপশন ছাড়া',
    withOption: 'অপশন সহ',
    pass: 'পাস',
    challenge: 'চ্যালেঞ্জ'
  }[type];
  const resultLabel = result === 'correct' ? '✓ সঠিক' : result === 'wrong' ? '✗ ভুল' : 'পাস';
  const m = state[key].marks;
  log.unshift(`${qLabel} — ${tName} — ${typeLabel} — ${resultLabel} — ${m > 0 ? '+' : ''}${m}`);
  if (log.length > 30) log.pop();
  renderLog();
}

function updateScores() {
  let t1 = 0;
  let t2 = 0;
  QUESTIONS.forEach((_, qi) => {
    t1 += state[`${qi}_t1`].marks;
    t2 += state[`${qi}_t2`].marks;
  });
  document.getElementById('t1Score').textContent = t1;
  document.getElementById('t2Score').textContent = t2;
  document.getElementById('t1Name').textContent = getTeamName('t1');
  document.getElementById('t2Name').textContent = getTeamName('t2');
}

function scoreClass(m) {
  if (m > 0) return 'score-pos';
  if (m < 0) return 'score-neg';
  return 'score-zero';
}

function btn(qi, team, type, result, label) {
  const s = state[`${qi}_${team}`];
  const isActive = s.type === type && s.result === result;
  const cls = isActive ? (result === 'correct' ? 'active-correct' : result === 'wrong' ? 'active-wrong' : 'active-pass') : '';
  return `<button class="mark-btn ${cls}" data-qi="${qi}" data-team="${team}" data-type="${type}" data-result="${result}" type="button">${label}</button>`;
}

function renderRow(qi) {
  const row = document.getElementById(`row_${qi}`);
  if (!row) return;
  ['t1', 't2'].forEach((t, ti) => {
    const s = state[`${qi}_${t}`];
    const m = s.marks;
    const scoreHtml = s.type ? `<span class="${scoreClass(m)}">${m > 0 ? '+' : ''}${m}</span>` : '<span class="score-zero">—</span>';

    row.cells[ti === 0 ? 2 : 11].innerHTML = `<div class="btn-group">${btn(qi, t, 'noOption', 'correct', '✓')}${btn(qi, t, 'noOption', 'wrong', '✗')}</div>`;
    row.cells[ti === 0 ? 3 : 12].innerHTML = '';
    row.cells[ti === 0 ? 4 : 13].innerHTML = `<div class="btn-group">${btn(qi, t, 'withOption', 'correct', '✓')}${btn(qi, t, 'withOption', 'wrong', '✗')}</div>`;
    row.cells[ti === 0 ? 5 : 14].innerHTML = '';
    row.cells[ti === 0 ? 6 : 15].innerHTML = `<div class="btn-group">${btn(qi, t, 'pass', 'pass', 'পাস')}</div>`;
    row.cells[ti === 0 ? 7 : 16].innerHTML = `<div class="btn-group">${btn(qi, t, 'challenge', 'correct', '✓')}${btn(qi, t, 'challenge', 'wrong', '✗')}</div>`;
    row.cells[ti === 0 ? 8 : 17].innerHTML = '';
    row.cells[ti === 0 ? 9 : 18].innerHTML = `<div class="score-cell">${scoreHtml}</div>`;
  });
}

function buildTable() {
  const tbody = document.getElementById('tbody');
  tbody.innerHTML = '';
  QUESTIONS.forEach((q, qi) => {
    const tr = document.createElement('tr');
    tr.id = `row_${qi}`;
    tr.innerHTML = `
      <td class="q-label" rowspan="1">${q}</td>
      <td class="team-label">${getTeamName('t1')}</td>
      <td></td><td></td><td></td><td></td><td></td><td></td><td></td>
      <td></td>
      <td class="team-label">${getTeamName('t2')}</td>
      <td></td><td></td><td></td><td></td><td></td><td></td><td></td>
      <td></td>`;
    tbody.appendChild(tr);
    renderRow(qi);
  });
}

function renderLog() {
  const ul = document.getElementById('logList');
  ul.innerHTML = log.map((l) => `<li class="log-item">${l}</li>`).join('');
}

function resetAll() {
  if (!confirm('সব স্কোর রিসেট করবেন?')) return;
  initState();
  buildTable();
  updateScores();
  renderLog();
}

function handleTableClick(event) {
  const button = event.target.closest('button[data-qi]');
  if (!button) return;
  const qi = Number(button.dataset.qi);
  setMark(qi, button.dataset.team, button.dataset.type, button.dataset.result);
}

['team1Input', 'team2Input'].forEach((id) => {
  document.getElementById(id).addEventListener('input', () => {
    updateScores();
    buildTable();
  });
});

document.getElementById('tbody').addEventListener('click', handleTableClick);
document.getElementById('resetBtn').addEventListener('click', resetAll);

initState();
buildTable();
updateScores();
