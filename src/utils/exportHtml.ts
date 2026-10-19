/**
 * Utility to download the game as a 100% self-contained standalone HTML file
 * including HTML, CSS, JavaScript, and Web Audio API synthesis without external dependencies.
 */

export function downloadStandaloneHtmlGame() {
  const standaloneHtml = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>과전류를 차단하라! (Stop the Overcurrent)</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    background-color: #020617;
    color: #f8fafc;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }
  header {
    background: #0f172a;
    border-bottom: 1px solid #1e293b;
    padding: 12px 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .title-logo {
    font-size: 1.1rem;
    font-weight: 800;
    color: #f59e0b;
    letter-spacing: -0.5px;
  }
  .container {
    max-width: 1080px;
    margin: 0 auto;
    padding: 24px 16px;
    width: 100%;
    flex: 1;
  }
  .panel {
    background: #0f172a;
    border: 1px solid #334155;
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 20px;
  }
  .btn {
    background: #eab308;
    color: #020617;
    font-weight: 700;
    border: none;
    padding: 10px 20px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
  }
  .btn:hover { background: #fde047; }
  .btn-danger { background: #ef4444; color: #fff; }
  .btn-danger:hover { background: #dc2626; }
  .btn-outline { background: transparent; border: 1px solid #475569; color: #cbd5e1; }
  .btn-outline:hover { background: #1e293b; color: #fff; }
  .zone-card {
    background: #1e293b;
    border: 1px solid #334155;
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 12px;
  }
  .zone-card.short {
    border-color: #ef4444;
    background: #3b0764;
    box-shadow: 0 0 15px rgba(239, 68, 68, 0.4);
  }
  .meter-bar {
    height: 12px;
    background: #334155;
    border-radius: 6px;
    overflow: hidden;
    margin-top: 6px;
  }
  .meter-fill {
    height: 100%;
    transition: width 0.3s;
  }
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  @media (max-width: 768px) { .grid-2 { grid-template-columns: 1fr; } }
  .slider { width: 100%; accent-color: #eab308; }
  .badge { display: inline-block; padding: 2px 8px; font-size: 0.75rem; border-radius: 4px; font-weight: 600; }
  .badge-warn { background: #7f1d1d; color: #fca5a5; }
  .badge-safe { background: #064e3b; color: #6ee7b7; }
</style>
</head>
<body>
<header>
  <div class="title-logo">⚡ 과전류를 차단하라! (Stop the Overcurrent)</div>
  <div id="header-stats" style="font-size: 0.85rem; color: #94a3b8;">
    옴의 법칙(V=IR)과 단락 방지 시뮬레이터
  </div>
</header>

<div class="container" id="app">
  <div class="panel" style="text-align: center; padding: 40px 20px;">
    <h1 style="font-size: 2rem; margin-bottom: 12px; color: #f59e0b;">폭염 속 대정전(Blackout) 위기를 막아라!</h1>
    <p style="color: #94a3b8; max-width: 650px; margin: 0 auto 24px; line-height: 1.6;">
      전력 수요 급증과 단락(합선)으로 전력망이 폭주하고 있습니다.<br>
      옴의 법칙(<b>V = I × R</b>)을 활용해 각 구역의 저항(R)과 전압(V)을 제어하고, 과부하율을 30% 이하로 낮추어 변전소를 사수하세요!
    </p>
    <div style="background: #1e293b; padding: 16px; border-radius: 8px; max-width: 500px; margin: 0 auto 24px; text-align: left; font-size: 0.9rem;">
      <div style="font-weight: 700; color: #e2e8f0; margin-bottom: 6px;">💡 과학 핵심 원리</div>
      <div style="color: #cbd5e1; margin-bottom: 4px;">• <b>옴의 법칙 (I = V / R)</b>: 전압(V)이 일정할 때 저항(R)을 키우면 전류(I)가 줄어듭니다.</div>
      <div style="color: #cbd5e1;">• <b>단락(합선) 현상</b>: 저항이 0Ω에 가까워져 순간적으로 수천 암페어(A)의 과전류가 흘러 폭발을 유발합니다. 즉시 차단기를 내리고 고저항을 배치하세요!</div>
    </div>
    <button class="btn" style="font-size: 1.1rem; padding: 12px 32px;" onclick="startGame()">전력망 방어 개시 (Game Start)</button>
  </div>
</div>

<script>
// Web Audio Synthesizer
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playBeep(freq = 600, duration = 0.05) {
  if (audioCtx.state === 'suspended') audioCtx.resume();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
  gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + duration);
}

let stage = 1;
let timeLeft = 180;
let overload = 55;
let timerId = null;
let score = 0;

let zones = [
  { id: 1, name: '중앙 병원 (응급 인프라)', V: 220, R: 18, targetI: 12, isBreaker: false, isShort: false },
  { id: 2, name: '주거 단지 (아파트 에어컨 급증)', V: 220, R: 10, targetI: 14, isBreaker: false, isShort: false },
  { id: 3, name: '교통 신호망 & 지하철', V: 220, R: 25, targetI: 10, isBreaker: false, isShort: false },
  { id: 4, name: '중앙 변전소 메인 트랜스포머', V: 380, R: 30, targetI: 15, isBreaker: false, isShort: false }
];

function startGame() {
  playBeep(880, 0.1);
  renderGameUI();
  clearInterval(timerId);
  timerId = setInterval(gameLoop, 1000);
}

function gameLoop() {
  timeLeft--;
  // Calculate average current discrepancy
  let totalDiscrepancy = 0;
  zones.forEach(z => {
    if (z.isBreaker) return;
    const current = z.isShort ? (z.V / 0.2) : (z.V / z.R);
    if (current > z.targetI * 1.3) {
      totalDiscrepancy += (current - z.targetI);
    }
  });

  if (totalDiscrepancy > 15) {
    overload = Math.min(100, overload + 2.5);
  } else {
    overload = Math.max(5, overload - 1.2);
  }

  // Random short circuit event
  if (Math.random() < 0.15 && !zones.some(z => z.isShort)) {
    const target = zones[Math.floor(Math.random() * zones.length)];
    target.isShort = true;
    playBeep(200, 0.3);
  }

  // Stage progression
  if (overload <= 30 && stage < 5) {
    stage++;
    score += 1000;
  }

  if (overload >= 100) {
    endGame(false, '전력망 과부하 100% 도달! 도시 대정전(Blackout) 발생');
    return;
  }
  if (timeLeft <= 0) {
    if (overload <= 30) {
      endGame(true, '도시 전력망 안정화 성공!');
    } else {
      endGame(false, '제한시간 초과! 과부하 30% 이하 미달성');
    }
    return;
  }

  score += 15;
  renderGameUI();
}

function adjustResistance(id, delta) {
  const zone = zones.find(z => z.id === id);
  if (zone) {
    zone.R = Math.max(5, Math.min(100, zone.R + delta));
    playBeep(500 + zone.R * 5, 0.04);
    renderGameUI();
  }
}

function toggleBreaker(id) {
  const zone = zones.find(z => z.id === id);
  if (zone) {
    zone.isBreaker = !zone.isBreaker;
    if (zone.isBreaker && zone.isShort) {
      zone.isShort = false; // Isolated short
      zone.R = 25; // Reset resistance
    }
    playBeep(700, 0.06);
    renderGameUI();
  }
}

function renderGameUI() {
  const app = document.getElementById('app');
  let zonesHtml = zones.map(z => {
    const current = z.isBreaker ? 0 : (z.isShort ? (z.V / 0.2).toFixed(1) : (z.V / z.R).toFixed(1));
    const isSafe = !z.isBreaker && Math.abs(current - z.targetI) <= 3;
    const isDanger = z.isShort || current > z.targetI * 1.5;

    return \`
      <div class="zone-card \${z.isShort ? 'short' : ''}">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
          <b style="font-size:1.05rem;">\${z.name}</b>
          <div>
            \${z.isShort ? '<span class="badge badge-warn">⚡ 단락(합선) 비상!</span>' : ''}
            \${z.isBreaker ? '<span class="badge badge-warn">차단기 TRIP됨</span>' : (isSafe ? '<span class="badge badge-safe">안전 정격전류</span>' : '<span class="badge badge-warn">과전류 경고</span>')}
          </div>
        </div>
        <div style="font-size:0.9rem; color:#94a3b8; margin-bottom:10px;">
          전압: <b style="color:#e2e8f0;">\${z.V}V</b> | 
          저항: <b style="color:#f59e0b;">\${z.isShort ? '0.2Ω (단락)' : z.R + 'Ω'}</b> | 
          흐르는 전류: <b style="color:\${isDanger ? '#ef4444' : '#10b981'}; font-size:1.1rem;">\${current}A</b> (목표: \${z.targetI}A)
        </div>
        <div style="display:flex; gap:8px;">
          <button class="btn btn-outline" onclick="adjustResistance(\${z.id}, -5)" \${z.isBreaker ? 'disabled' : ''}>-5Ω 저항 낮춤</button>
          <button class="btn btn-outline" onclick="adjustResistance(\${z.id}, +5)" \${z.isBreaker ? 'disabled' : ''}>+5Ω 저항 높임 (전류감소)</button>
          <button class="btn \${z.isBreaker ? 'btn' : 'btn-danger'}" onclick="toggleBreaker(\${z.id})">
            \${z.isBreaker ? '스위치 재투입 (ON)' : '긴급 차단기 TRIP (OFF)'}
          </button>
        </div>
      </div>
    \`;
  }).join('');

  app.innerHTML = \`
    <div class="panel">
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom:16px;">
        <div><b>스테이지:</b> \${stage}/5단계 | <b>점수:</b> \${score}점</div>
        <div><b>남은 시간:</b> \${Math.floor(timeLeft/60)}분 \${timeLeft%60}초</div>
        <div>
          <b>도시 과부하율:</b> <span style="color:\${overload > 60 ? '#ef4444' : (overload <= 30 ? '#10b981' : '#f59e0b')}; font-weight:800;">\${overload.toFixed(1)}%</span> (목표: 30% 이하)
        </div>
      </div>
      <div class="meter-bar">
        <div class="meter-fill" style="width:\${overload}%; background:\${overload > 60 ? '#ef4444' : (overload <= 30 ? '#10b981' : '#f59e0b')};"></div>
      </div>
    </div>
    <div style="margin-bottom:16px;">\${zonesHtml}</div>
    <div style="text-align:right;">
      <button class="btn btn-outline" onclick="endGame(false, '사용자에 의해 비상 종료되었습니다.')">게임 포기</button>
    </div>
  \`;
}

function endGame(isVictory, message) {
  clearInterval(timerId);
  const app = document.getElementById('app');
  if (isVictory) playBeep(1200, 0.4);
  else playBeep(180, 0.5);

  app.innerHTML = \`
    <div class="panel" style="text-align:center; padding:40px 20px;">
      <h2 style="font-size:2rem; color:\${isVictory ? '#10b981' : '#ef4444'}; margin-bottom:12px;">
        \${isVictory ? '🎉 대정전 방어 성공! (VICTORY)' : '💀 도시 대정전 발생 (BLACKOUT)'}
      </h2>
      <p style="color:#cbd5e1; margin-bottom:20px; font-size:1.1rem;">\${message}</p>
      <div style="background:#1e293b; padding:16px; border-radius:8px; max-width:450px; margin:0 auto 24px; text-align:left;">
        <div>• 최종 점수: <b>\${score}점</b></div>
        <div>• 최종 과부하율: <b>\${overload.toFixed(1)}%</b></div>
        <div>• 옴의 법칙 핵심: <b>I = V / R</b> (저항을 높이면 과전류를 막을 수 있습니다)</div>
      </div>
      <button class="btn" onclick="startGame()">다시 플레이하기</button>
    </div>
  \`;
}
</script>
</body>
</html>`;

  const blob = new Blob([standaloneHtml], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = '과전류를_차단하라_독립실행.html';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
