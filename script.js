let percentageReturn, numberOfPeriods, finalValue, displayPct;
let history = [];

function setTheme(isDark) {
  document.documentElement.dataset.theme = isDark ? 'dark' : 'light';
  document.getElementById('themeToggle').checked = isDark;
  localStorage.setItem('cagr-theme', isDark ? 'dark' : 'light');
}

const savedTheme = localStorage.getItem('cagr-theme');
setTheme(savedTheme === 'dark');

document.getElementById('themeToggle').addEventListener('change', (event) => {
  setTheme(event.target.checked);
});

function newRound() {
  // percentage between -25% and +25% with 2-decimal display
  const rawPct = (Math.random() - 0.5) * 50; // -25 to +25
  displayPct = Math.round(rawPct * 100) / 100; // round to 2 decimals for display

  // use the displayed percentage consistently for calculation
  percentageReturn = displayPct / 100; // decimal rate

  // integer periods between 1 and 30
  numberOfPeriods = Math.floor(Math.random() * 30) + 1;

  finalValue = 100 * Math.pow(1 + percentageReturn, numberOfPeriods);

  const percentEl = document.getElementById('percentDisplay');
  percentEl.textContent = `Percentage return per period: ${displayPct.toFixed(2)}%`;
  if (displayPct > 0) {
    percentEl.style.color = '#16a34a'; // green for positive
  } else if (displayPct < 0) {
    percentEl.style.color = '#dc2626'; // red for negative
  } else {
    percentEl.style.color = '#1f2933'; // neutral
  }

  document.getElementById('periodsDisplay').textContent = `Number of periods: ${numberOfPeriods}`;
  document.getElementById('result').textContent = '';
  document.getElementById('guessInput').value = '';
}

function checkGuess() {
  const guess = parseFloat(document.getElementById('guessInput').value);
  if (isNaN(guess)) {
    document.getElementById('result').textContent = 'Please enter a valid number.';
    return;
  }

  const score = 100 - Math.abs(guess / finalValue - 1) * 100;
  const clampedScore = Math.max(0, Math.min(100, score));

  document.getElementById('result').innerHTML = `
    Actual final value (using displayed rate): ${finalValue.toFixed(2)}<br />
    Your guess: ${guess.toFixed(2)}<br />
    Raw score: ${score.toFixed(2)}<br />
    Score (0-100 scale): ${clampedScore.toFixed(2)}
  `;

  // update history (limit to 15 events)
  history.unshift({
    percent: displayPct,
    periods: numberOfPeriods,
    finalValue: finalValue,
    guess: guess,
    score: clampedScore
  });
  if (history.length > 15) {
    history.pop();
  }
  renderHistory();
}

function renderHistory() {
  const historyDiv = document.getElementById('history');
  if (history.length === 0) {
    historyDiv.innerHTML = '';
    return;
  }

  let html = '<h2>History (last ' + history.length + ')</h2>';
  html += '<table><thead><tr>' +
          '<th style="text-align:left;">Return %</th>' +
          '<th>Periods</th>' +
          '<th>Final value</th>' +
          '<th>Your guess</th>' +
          '<th>Score</th>' +
          '</tr></thead><tbody>';

  history.forEach((item) => {
    html += '<tr>' +
            '<td style="text-align:left;">' + item.percent.toFixed(2) + '%</td>' +
            '<td>' + item.periods + '</td>' +
            '<td>' + item.finalValue.toFixed(2) + '</td>' +
            '<td>' + item.guess.toFixed(2) + '</td>' +
            '<td>' + item.score.toFixed(2) + '</td>' +
            '</tr>';
  });

  html += '</tbody></table>';
  historyDiv.innerHTML = html;
}

// Submit on Enter key in input
document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('guessInput');
  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      checkGuess();
    }
  });
});

// initialize first round
newRound();
