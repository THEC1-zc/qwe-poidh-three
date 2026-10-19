(function () {
  function initTheme() {
    var saved = null;
    try { saved = localStorage.getItem('seer_ef_theme'); } catch (e) {}
    if (saved === 'light' || saved === 'dark') {
      document.documentElement.setAttribute('data-theme', saved);
    }
    var toggleBtn = document.getElementById('efThemeToggle');
    if (toggleBtn) {
      var updateLabel = function () {
        var cur = document.documentElement.getAttribute('data-theme') || 'dark';
        toggleBtn.textContent = cur === 'light' ? '☾ Dark Mode' : '☀ Light Mode';
      };
      updateLabel();
      toggleBtn.addEventListener('click', function () {
        var cur = document.documentElement.getAttribute('data-theme') || 'dark';
        var next = cur === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', next);
        try { localStorage.setItem('seer_ef_theme', next); } catch (e) {}
        updateLabel();
      });
    }
  }

  /* ============================================================
     1. HOMEPAGE INTERACTIVE PROTOCOL STACK & APP ROUTER
     ============================================================ */
  var HOME_LAYERS = [
    {id:'ct',title:'1. One shared protocol',summary:'Seer is the protocol beneath a family of prediction-market applications. The general explorer brings market types together; each specialist view focuses on a different decision.',invariant:'Shared infrastructure, different questions.'},
    {id:'shared',title:'2. Five ways to read a market',summary:'Deep compares many outcomes. Futarchy contrasts pass and fail forecasts. Opportunity Markets surface promising submissions. Contour compares market estimates of DeFi risk. The explorer connects the whole family.',invariant:'Different views expose different comparisons.'},
    {id:'oracle',title:'3. Forecasts inform human decisions',summary:'Prices express market estimates. A DAO uses conditional forecasts as evidence; reviewers use submission estimates as another signal. The responsible people retain the final decision.',invariant:'A market forecast is a signal, not the final decision.'}
  ];

  function initHome() {
    var layerWrap = document.getElementById('homeLayerButtons');
    var detail = document.getElementById('homeLayerDetail');
    if (!layerWrap || !detail) return;
    function render(idx) {
      var item = HOME_LAYERS[idx];
      Array.prototype.forEach.call(layerWrap.querySelectorAll('button'), function (b, i) {
        b.classList.toggle('active', i === idx);
      });
      detail.innerHTML =
        '<div style="font-weight:700;font-size:1.05rem;margin-bottom:6px;">' + item.title + '</div>' +
        '<p style="margin:0 0 8px;color:var(--ef-muted);font-size:0.92rem;">' + item.summary + '</p>' +
        '<div class="mono" style="font-size:0.8rem;color:var(--ef-violet-soft);">Design principle: ' + item.invariant + '</div>';
    }
    Array.prototype.forEach.call(layerWrap.querySelectorAll('button'), function (btn, idx) {
      btn.addEventListener('click', function () { render(idx); });
    });
    render(0);
  }

  /* ============================================================
     2. SEER APP — GENERAL MARKET EXPLORER
     ============================================================ */
  var APP_MARKETS = [
    {
      id: 'MKT-101',
      address: '0x4a91...e820',
      question: 'Will Ethereum L1 gas limit increase above 40M before Q1 2027?',
      category: 'Protocol',
      type: 'Binary',
      chain: 'Ethereum',
      status: 'Open Trading',
      yesPct: 64,
      volUsd: 184200,
      liqUsd: 92500,
      oracle: 'Reality.eth + Kleros General Court',
      closes: '2026-12-31'
    },
    {
      id: 'MKT-102',
      address: '0x7c31...9b14',
      question: 'Which ZK prover framework achieves highest verified throughput in Q4 2026 benchmark?',
      category: 'Cryptography',
      type: 'Categorical',
      chain: 'Gnosis',
      status: 'Open Trading',
      yesPct: 42,
      volUsd: 96400,
      liqUsd: 54000,
      oracle: 'Reality.eth + Kleros Technical Court',
      closes: '2026-12-15'
    },
    {
      id: 'MKT-103',
      address: '0x9e02...41c8',
      question: 'Grant Round #19: Expected Human Evaluator Score Field (24 Proposals)',
      category: 'Grants',
      type: 'Deep',
      chain: 'Gnosis',
      status: 'Open Trading',
      yesPct: 78,
      volUsd: 141000,
      liqUsd: 88000,
      oracle: 'Official Jury Scorecard Hash',
      closes: '2026-11-20'
    },
    {
      id: 'MKT-104',
      address: '0x2f88...d03a',
      question: 'GIP-114 Conditional Revenue Forecast: Pass vs. Fail 90-Day TWAP',
      category: 'Governance',
      type: 'Futarchy',
      chain: 'Gnosis',
      status: 'Open Trading',
      yesPct: 58,
      volUsd: 215800,
      liqUsd: 130000,
      oracle: 'Onchain Treasury TWAP + Reality.eth',
      closes: '2026-11-10'
    },
    {
      id: 'MKT-105',
      address: '0x6b19...77f1',
      question: 'Ecosystem Interface Redesign Cohort: Predicted Finalist Selection',
      category: 'Ecosystem',
      type: 'Opportunity',
      chain: 'Ethereum',
      status: 'Reality.eth Pending',
      yesPct: 31,
      volUsd: 68900,
      liqUsd: 41200,
      oracle: 'Seer Team Final Vote Record',
      closes: '2026-10-30'
    },
    {
      id: 'MKT-106',
      address: '0x8d44...12a9',
      question: 'Q4 2026 DeFi Protocol Default Probability Matrix (10 Assets)',
      category: 'DeFi Risk',
      type: 'Risk Pricing',
      chain: 'Ethereum',
      status: 'Open Trading',
      yesPct: 96,
      volUsd: 312000,
      liqUsd: 195000,
      oracle: 'Kleros Risk Definition Specification',
      closes: '2026-12-31'
    }
  ];

  function initExplorer() {
    var grid = document.getElementById('explorerGrid');
    var search = document.getElementById('explorerSearch');
    var catSelect = document.getElementById('explorerCategory');
    var statusSelect = document.getElementById('explorerStatus');
    var sortSelect = document.getElementById('explorerSort');
    var inspector = document.getElementById('explorerInspector');
    if (!grid || !inspector) return;

    var selectedId = APP_MARKETS[0].id;
    var simSide = 'UP';
    var simAmount = 100;

    function renderInspector(m) {
      var price = simSide === 'UP' ? (m.yesPct / 100) : ((100 - m.yesPct) / 100);
      var shares = price > 0 ? (simAmount / price).toFixed(2) : '0.00';
      inspector.innerHTML =
        '<div class="ef-eyebrow">Market Inspector · ' + m.id + '</div>' +
        '<h3 style="margin:4px 0 8px;font-size:1.05rem;">' + m.question + '</h3>' +
        '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px;">' +
          '<span class="ef-tag ef-tag-violet">' + m.type + '</span>' +
          '<span class="ef-tag">' + m.chain + '</span>' +
          '<span class="ef-tag">' + m.status + '</span>' +
        '</div>' +
        '<div class="mono" style="font-size:0.78rem;color:var(--ef-muted);margin-bottom:12px;">' +
          '<div>Wrapped ERC-20 Pool: <code>' + m.address + '</code></div>' +
          '<div>Resolution Oracle: ' + m.oracle + '</div>' +
          '<div>24h Volume: $' + m.volUsd.toLocaleString() + ' · Liquidity: $' + m.liqUsd.toLocaleString() + '</div>' +
        '</div>' +
        '<div style="background:var(--ef-nested);border:1px solid var(--ef-border);border-radius:10px;padding:12px;">' +
          '<div style="font-size:0.78rem;font-weight:700;margin-bottom:8px;">SIMULATED OUTCOME CALCULATOR (NO WALLET / NO FUNDS)</div>' +
          '<div class="ef-outcome-pair" style="margin-top:0;margin-bottom:10px;">' +
            '<button type="button" class="ef-btn-yes" id="simBtnUp" style="' + (simSide === 'UP' ? 'outline:2px solid #fff;' : 'opacity:0.8;') + '">' +
              '<span>Up / Yes</span><span class="num">' + m.yesPct + '¢</span>' +
            '</button>' +
            '<button type="button" class="ef-btn-no" id="simBtnDown" style="' + (simSide === 'DOWN' ? 'outline:2px solid var(--ef-violet-soft);' : 'opacity:0.85;') + '">' +
              '<span>Down / No</span><span class="num">' + (100 - m.yesPct) + '¢</span>' +
            '</button>' +
          '</div>' +
          '<label style="font-size:0.78rem;color:var(--ef-muted);display:block;margin-bottom:4px;">Illustrative Collateral ($ USDC fixture)</label>' +
          '<input type="number" id="simAmountInput" class="ef-input num" style="width:100%;border-radius:8px;margin-bottom:8px;" min="10" max="10000" value="' + simAmount + '" />' +
          '<div class="mono" style="font-size:0.8rem;color:var(--ef-text);">' +
            'Simulated Shares: <strong id="simSharesOutput">' + shares + '</strong> @ ' + (price * 100).toFixed(0) + '¢ (fixture prices sum to 100¢)' +
          '</div>' +
        '</div>';

      var bUp = document.getElementById('simBtnUp');
      var bDown = document.getElementById('simBtnDown');
      var inp = document.getElementById('simAmountInput');
      if (bUp) bUp.onclick = function () { simSide = 'UP'; renderInspector(m); };
      if (bDown) bDown.onclick = function () { simSide = 'DOWN'; renderInspector(m); };
      if (inp) inp.oninput = function () { simAmount = Math.max(0, parseFloat(this.value) || 0); document.getElementById('simSharesOutput').textContent = (price > 0 ? simAmount / price : 0).toFixed(2); };
    }

    function update() {
      var q = (search.value || '').toLowerCase();
      var cat = catSelect.value;
      var st = statusSelect.value;
      var sort = sortSelect.value;

      var list = APP_MARKETS.filter(function (m) {
        var matchQ = !q || m.question.toLowerCase().indexOf(q) !== -1 || m.id.toLowerCase().indexOf(q) !== -1 || m.address.toLowerCase().indexOf(q) !== -1;
        var matchCat = cat === 'ALL' || m.type === cat || m.category === cat;
        var matchSt = st === 'ALL' || m.status === st;
        return matchQ && matchCat && matchSt;
      });

      list.sort(function (a, b) {
        if (sort === 'liq') return b.liqUsd - a.liqUsd;
        if (sort === 'prob') return b.yesPct - a.yesPct;
        return b.volUsd - a.volUsd;
      });

      grid.innerHTML = list.map(function (m) {
        var isSel = m.id === selectedId;
        var noPct = 100 - m.yesPct;
        return (
          '<article class="ef-card ' + (isSel ? 'selected' : '') + '" data-id="' + m.id + '" tabindex="0" role="button" aria-label="Inspect ' + m.question + '">' +
            '<div style="display:flex;justify-content:space-between;gap:8px;margin-bottom:8px;flex-wrap:wrap;">' +
              '<span class="ef-tag ef-tag-violet">' + m.type + '</span>' +
              '<span class="mono" style="font-size:0.75rem;color:var(--ef-dim);">' + m.chain + ' · ' + m.id + '</span>' +
            '</div>' +
            '<h3 style="margin:0 0 10px;font-size:0.98rem;line-height:1.35;">' + m.question + '</h3>' +
            '<div class="ef-bar-track" style="margin-bottom:8px;"><div class="ef-bar-fill" style="width:' + m.yesPct + '%;"></div></div>' +
            '<div class="ef-outcome-pair">' +
              '<div class="ef-btn-yes"><span>Up / Yes</span><span class="num">' + m.yesPct + '%</span></div>' +
              '<div class="ef-btn-no"><span>Down / No</span><span class="num">' + noPct + '%</span></div>' +
            '</div>' +
            '<div class="mono" style="display:flex;justify-content:space-between;margin-top:10px;font-size:0.74rem;color:var(--ef-dim);">' +
              '<span>Vol $' + (m.volUsd / 1000).toFixed(1) + 'k</span>' +
              '<span>' + m.status + '</span>' +
            '</div>' +
          '</article>'
        );
      }).join('');

      Array.prototype.forEach.call(grid.querySelectorAll('.ef-card'), function (card) {
        card.addEventListener('click', function () {
          selectedId = card.getAttribute('data-id');
          update();
        });
        card.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            selectedId = card.getAttribute('data-id');
            update();
          }
        });
      });

      var current = list.find(function (x) { return x.id === selectedId; }) || list[0] || APP_MARKETS[0];
      renderInspector(current);
    }

    search.addEventListener('input', update);
    catSelect.addEventListener('change', update);
    statusSelect.addEventListener('change', update);
    sortSelect.addEventListener('change', update);
    update();
  }

  /* ============================================================
     3. DEEP — MANY-OUTCOME & AI-AGENT FORECASTING
     ============================================================ */
  var DEEP_OUTCOMES = [
    { id: 'P-01', name: 'ZK-EVM Formal Verifier Suite', track: 'Verification', agentScore: 8.8, humanEst: 8.2, weight: 18.5, agents: 14 },
    { id: 'P-02', name: 'Stateless verkle-tree state proof client', track: 'Clients', agentScore: 8.4, humanEst: 8.5, weight: 16.2, agents: 19 },
    { id: 'P-03', name: 'Account Abstraction session-key firewall', track: 'AA Security', agentScore: 7.9, humanEst: 6.8, weight: 14.0, agents: 11 },
    { id: 'P-04', name: 'Cross-L2 intent settlement prover', track: 'Interop', agentScore: 7.6, humanEst: 7.7, weight: 12.8, agents: 16 },
    { id: 'P-05', name: 'MEV-burn simulation telemetry dashboard', track: 'Consensus', agentScore: 7.2, humanEst: 8.1, weight: 11.5, agents: 9 },
    { id: 'P-06', name: 'P2P gossip Sub-slot latency benchmark', track: 'Networking', agentScore: 6.9, humanEst: 6.7, weight: 9.8, agents: 12 },
    { id: 'P-07', name: 'Solidity SMT invariant generator CLI', track: 'Verification', agentScore: 6.5, humanEst: 5.4, weight: 9.2, agents: 8 },
    { id: 'P-08', name: 'Light-client WASM browser verifier', track: 'Clients', agentScore: 6.1, humanEst: 6.3, weight: 8.0, agents: 10 }
  ];

  function initDeep() {
    var tbody = document.getElementById('deepTableBody');
    var cutSlider = document.getElementById('deepCutSlider');
    var cutLabel = document.getElementById('deepCutLabel');
    var sortSel = document.getElementById('deepSort');
    var normBtn = document.getElementById('deepNormalizeBtn');
    var summary = document.getElementById('deepSummaryBox');
    if (!tbody || !cutSlider) return;

    var normalized = true;

    function render() {
      var cut = parseFloat(cutSlider.value);
      cutLabel.textContent = cut.toFixed(1) + ' / 10';
      var sortBy = sortSel.value;

      var totalRaw = DEEP_OUTCOMES.reduce(function (acc, r) { return acc + r.weight; }, 0);
      var rows = DEEP_OUTCOMES.map(function (r) {
        var delta = r.agentScore - r.humanEst;
        var normShare = normalized ? ((r.weight / totalRaw) * 100) : r.weight;
        return {
          id: r.id,
          name: r.name,
          track: r.track,
          agentScore: r.agentScore,
          humanEst: r.humanEst,
          delta: delta,
          share: normShare,
          agents: r.agents,
          shortlisted: r.agentScore >= cut
        };
      });

      rows.sort(function (a, b) {
        if (sortBy === 'delta') return Math.abs(b.delta) - Math.abs(a.delta);
        if (sortBy === 'human') return b.humanEst - a.humanEst;
        return b.agentScore - a.agentScore;
      });

      var shortlistedCount = rows.filter(function (r) { return r.shortlisted; }).length;
      var highGapCount = rows.filter(function (r) { return Math.abs(r.delta) >= 0.8; }).length;

      summary.innerHTML =
        '<span>Shortlisted (&ge;' + cut.toFixed(1) + '): <strong class="num">' + shortlistedCount + ' / ' + rows.length + '</strong></span>' +
        '<span>Flagged for Closer Human Review (|Agent &minus; Human| &ge; 0.8): <strong class="num" style="color:var(--ef-amber);">' + highGapCount + ' proposals</strong></span>' +
        '<span>Illustrative Weight Total: <strong class="num">100.0%</strong> (Simulated)</span>';

      tbody.innerHTML = rows.map(function (r) {
        var gapFlag = Math.abs(r.delta) >= 0.8;
        var sign = r.delta >= 0 ? '+' : '';
        return (
          '<tr class="' + (r.shortlisted ? 'selected' : '') + '">' +
            '<td class="mono">' + r.id + '</td>' +
            '<td><strong>' + r.name + '</strong><div style="font-size:0.75rem;color:var(--ef-dim);">' + r.track + ' · ' + r.agents + ' agent models</div></td>' +
            '<td class="num"><strong>' + r.agentScore.toFixed(1) + '</strong></td>' +
            '<td class="num">' + r.humanEst.toFixed(1) + '</td>' +
            '<td class="num">' +
              '<span class="ef-tag ' + (gapFlag ? 'ef-tag-amber' : '') + '">' + sign + r.delta.toFixed(1) + (gapFlag ? ' · Review' : '') + '</span>' +
            '</td>' +
            '<td class="num">' +
              '<div style="display:flex;align-items:center;gap:8px;">' +
                '<div class="ef-bar-track" style="width:70px;"><div class="ef-bar-fill" style="width:' + Math.min(100, r.share * 3.5) + '%;"></div></div>' +
                '<span>' + r.share.toFixed(1) + '%</span>' +
              '</div>' +
            '</td>' +
            '<td>' + (r.shortlisted ? '<span class="ef-tag ef-tag-violet">Shortlisted</span>' : '<span class="ef-tag">Below Cut</span>') + '</td>' +
          '</tr>'
        );
      }).join('');
    }

    cutSlider.addEventListener('input', render);
    sortSel.addEventListener('change', render);
    if (normBtn) {
      normBtn.addEventListener('click', function () {
        DEEP_OUTCOMES.forEach(function (r) { r.weight = r.agentScore * r.agentScore; });
        render();
      });
    }
    render();
  }

  /* ============================================================
     4. FUTARCHY — CONDITIONAL PASS VS. FAIL COMPARISON
     ============================================================ */
  var FUTARCHY_PROPOSALS = [
    {
      id: 'GIP-114',
      title: 'GIP-114: Allocate 3.5M USDC to Cross-Chain Outcome AMM Incentives',
      metricName: '90-Day Protocol Fee Revenue + Active Liquidity Index (USD Equivalent)',
      unit: 'M USD',
      passForecast: 14.8,
      failForecast: 11.9,
      passProb: 62,
      liquidity: '$420,000',
      note: 'Conditional market prices forecast a +2.9M USD (+24.4%) higher metric under PASS vs. FAIL. Note: Conditional prices reflect trader expectations and correlation across states, not guaranteed causal proof. The DAO retains the binding governance vote.'
    },
    {
      id: 'SEP-29',
      title: 'SEP-29: Reduce Base Resolver Bond Escalation Multiplier from 2.0x to 1.5x',
      metricName: '90-Day Accurate Uncontested Resolution Rate (%)',
      unit: '%',
      passForecast: 96.2,
      failForecast: 98.1,
      passProb: 28,
      liquidity: '$195,000',
      note: 'Conditional market prices forecast a -1.9% lower uncontested accuracy rate under PASS vs. FAIL, signaling potential dispute spam risk. The DAO retains the final vote.'
    },
    {
      id: 'KIP-88',
      title: 'KIP-88: Enable Shared Collateral Vaults for Quarterly Risk Pricing Cohorts',
      metricName: 'Quarterly Active Risk-Pricing Open Interest (M USD)',
      unit: 'M USD',
      passForecast: 22.4,
      failForecast: 15.0,
      passProb: 74,
      liquidity: '$510,000',
      note: 'Conditional markets forecast +7.4M USD (+49.3%) higher open interest if enacted. Non-enacted conditional tokens void and refund collateral.'
    }
  ];

  function initFutarchy() {
    var sel = document.getElementById('futarchySelect');
    var view = document.getElementById('futarchyComparisonView');
    var shockSlider = document.getElementById('futarchyShock');
    var shockVal = document.getElementById('futarchyShockVal');
    if (!sel || !view) return;

    function render() {
      var p = FUTARCHY_PROPOSALS.find(function (x) { return x.id === sel.value; }) || FUTARCHY_PROPOSALS[0];
      var adj = parseFloat(shockSlider ? shockSlider.value : 0) || 0;
      if (shockVal) shockVal.textContent = (adj >= 0 ? '+' : '') + adj.toFixed(1) + ' ' + p.unit;

      var passVal = p.passForecast + adj;
      var failVal = p.failForecast;
      var delta = passVal - failVal;
      var pct = failVal !== 0 ? ((delta / failVal) * 100) : 0;
      var sign = delta >= 0 ? '+' : '';

      view.innerHTML =
        '<div class="ef-card" style="margin-bottom:16px;">' +
          '<div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px;margin-bottom:8px;">' +
            '<span class="ef-tag ef-tag-violet">Conditional Market Pair · ' + p.id + '</span>' +
            '<span class="mono" style="font-size:0.8rem;color:var(--ef-muted);">Pool Depth: ' + p.liquidity + ' (Simulated)</span>' +
          '</div>' +
          '<h2 style="margin:0 0 6px;font-size:1.25rem;">' + p.title + '</h2>' +
          '<div style="font-size:0.88rem;color:var(--ef-muted);">Target Success Metric: <strong>' + p.metricName + '</strong></div>' +
        '</div>' +
        '<div class="ef-grid-2" style="margin-bottom:16px;">' +
          '<div class="ef-card" style="border-color:var(--ef-violet);">' +
            '<div class="ef-eyebrow">CONDITIONAL BRANCH A · IF PROPOSAL PASSES</div>' +
            '<div class="num" style="font-size:2.1rem;font-weight:800;color:var(--ef-violet-soft);margin:6px 0;">' + passVal.toFixed(2) + ' ' + p.unit + '</div>' +
            '<div class="mono" style="font-size:0.8rem;color:var(--ef-muted);">Implied Enactment Likelihood: ' + p.passProb + '% · If Proposal Fails, PASS trades void &amp; refund collateral</div>' +
          '</div>' +
          '<div class="ef-card">' +
            '<div class="ef-eyebrow" style="color:var(--ef-muted);">CONDITIONAL BRANCH B · IF PROPOSAL FAILS</div>' +
            '<div class="num" style="font-size:2.1rem;font-weight:800;margin:6px 0;">' + failVal.toFixed(2) + ' ' + p.unit + '</div>' +
            '<div class="mono" style="font-size:0.8rem;color:var(--ef-muted);">Baseline Status-Quo Forecast (' + (100 - p.passProb) + '% branch) · If Proposal Passes, FAIL trades void &amp; refund</div>' +
          '</div>' +
        '</div>' +
        '<div class="ef-card" style="background:var(--ef-nested);">' +
          '<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;margin-bottom:8px;">' +
            '<strong>Implied Conditional Delta (&Delta; = E[Metric | Pass] &minus; E[Metric | Fail]):</strong>' +
            '<span class="ef-tag ' + (delta >= 0 ? 'ef-tag-teal' : 'ef-tag-rose') + '" style="font-size:0.95rem;padding:4px 10px;">' +
              sign + delta.toFixed(2) + ' ' + (p.unit === '%' ? 'pp' : p.unit) + ' (' + sign + pct.toFixed(1) + '%)' +
            '</span>' +
          '</div>' +
          '<p style="margin:0;font-size:0.88rem;color:var(--ef-muted);">Simulated forecast difference: ' + sign + delta.toFixed(2) + ' ' + (p.unit === '%' ? 'percentage points' : p.unit) + '. Conditional forecasts inform a decision; they do not prove causality. The DAO retains the final vote.</p>' +
        '</div>';
    }

    sel.addEventListener('change', render);
    if (shockSlider) shockSlider.addEventListener('input', render);
    render();
  }

  /* ============================================================
     5. OPPORTUNITY MARKETS — SUBMISSION SELECTION FORECASTS
     ============================================================ */
  var OPP_SUBMISSIONS = [
    { id: 'SUB-01', title: 'Convergent Signal — Unified EF System', author: '0x91a...44c', marketPct: 29.5, reviews: 4, status: 'Pending Team Vote' },
    { id: 'SUB-02', title: 'Modular Horizon — Six Protocol Desks', author: '0x3f2...81b', marketPct: 24.0, reviews: 5, status: 'Pending Team Vote' },
    { id: 'SUB-03', title: 'Electric Ledger — High-Density Tables', author: '0x77d...19e', marketPct: 19.5, reviews: 1, status: 'Pending Team Vote' },
    { id: 'SUB-04', title: 'Optic Grid — Agent & Human Dual View', author: '0x58c...02f', marketPct: 15.0, reviews: 3, status: 'Pending Team Vote' },
    { id: 'SUB-05', title: 'Minimalist Slate — Mobile Card Suite', author: '0x14b...90a', marketPct: 12.0, reviews: 2, status: 'Pending Team Vote' }
  ];

  function initOpportunity() {
    var tbody = document.getElementById('oppTableBody');
    var sortSel = document.getElementById('oppSort');
    var detail = document.getElementById('oppDetailBox');
    if (!tbody || !detail) return;

    var selectedId = OPP_SUBMISSIONS[0].id;

    function render() {
      var mode = sortSel ? sortSel.value : 'prob';
      var list = OPP_SUBMISSIONS.slice().sort(function (a, b) {
        if (mode === 'underreviewed') {
          return (b.marketPct / (b.reviews + 1)) - (a.marketPct / (a.reviews + 1));
        }
        return b.marketPct - a.marketPct;
      });

      tbody.innerHTML = list.map(function (s, idx) {
        var attentionScore = (s.marketPct / (s.reviews + 1)).toFixed(1);
        return (
          '<tr class="' + (s.id === selectedId ? 'selected' : '') + '" data-id="' + s.id + '">' +
            '<td class="mono">#' + (idx + 1) + ' · ' + s.id + '</td>' +
            '<td><button type="button" class="ef-row-open">' + s.title + '</button><div class="mono" style="font-size:0.74rem;color:var(--ef-dim);">Submitter: ' + s.author + '</div></td>' +
            '<td class="num"><strong>' + s.marketPct.toFixed(1) + '%</strong> (' + s.marketPct.toFixed(1) + '¢)</td>' +
            '<td class="num">' + s.reviews + ' reviewers (Signal/Rev: ' + attentionScore + ')</td>' +
            '<td><span class="ef-tag ef-tag-amber">' + s.status + '</span></td>' +
          '</tr>'
        );
      }).join('');

      Array.prototype.forEach.call(tbody.querySelectorAll('tr'), function (tr) {
        tr.addEventListener('click', function () {
          selectedId = tr.getAttribute('data-id');
          render();
        });
      });

      var cur = OPP_SUBMISSIONS.find(function (x) { return x.id === selectedId; }) || OPP_SUBMISSIONS[0];
      detail.innerHTML =
        '<div class="ef-eyebrow">Selected Submission · ' + cur.id + '</div>' +
        '<h3 style="margin:4px 0 8px;">' + cur.title + '</h3>' +
        '<p style="font-size:0.88rem;color:var(--ef-muted);margin:0 0 12px;">' +
          'Market-Implied Win Estimate: <strong class="num" style="color:var(--ef-violet-soft);">' + cur.marketPct.toFixed(1) + '%</strong> · ' +
          'Final Selection Authority: <strong>' + cur.status + '</strong> (Traders surface promising entries; the Seer team vote establishes the official winner and ranking).' +
        '</p>' +
        '<div style="display:flex;gap:8px;flex-wrap:wrap;">' +
          '<button type="button" class="ef-btn ef-btn-primary" id="oppSimBumpBtn">Simulate more backing (Demo)</button>' +
        '</div>';

      var bump = document.getElementById('oppSimBumpBtn');
      if (bump) {
        bump.onclick = function () {
          cur.marketPct += 2.0;
          var sum = OPP_SUBMISSIONS.reduce(function (a, b) { return a + b.marketPct; }, 0);
          OPP_SUBMISSIONS.forEach(function (x) { x.marketPct = (x.marketPct / sum) * 100; });
          render();
        };
      }
    }

    if (sortSel) sortSel.addEventListener('change', render);
    render();
  }

  /* ============================================================
     6. RISK PRICING (PROPOSED NAME: CONTOUR)
     ============================================================ */
  var RISK_PROTOCOLS = [
    { id: 'ASSET-01', name: 'Aave v3 Core Pool (Simulated)', category: 'Lending', pdQ3: 0.65, pdQ4: 0.80, liq: '$340k' },
    { id: 'ASSET-02', name: 'Sky / Maker Core Vaults (Simulated)', category: 'Stablecoin', pdQ3: 0.75, pdQ4: 0.90, liq: '$310k' },
    { id: 'ASSET-03', name: 'Lido stETH Withdrawal Queue (Simulated)', category: 'Staking', pdQ3: 0.95, pdQ4: 1.15, liq: '$290k' },
    { id: 'ASSET-04', name: 'Morpho Curated Credit Vault A (Simulated)', category: 'Lending', pdQ3: 1.60, pdQ4: 1.95, liq: '$215k' },
    { id: 'ASSET-05', name: 'Pendle Principal Yield Router (Simulated)', category: 'Yield', pdQ3: 2.10, pdQ4: 2.45, liq: '$180k' },
    { id: 'ASSET-06', name: 'EigenLayer AVS Slash Cohort (Simulated)', category: 'Restaking', pdQ3: 2.85, pdQ4: 3.40, liq: '$165k' },
    { id: 'ASSET-07', name: 'Synthetic Delta-Neutral USD Pool (Simulated)', category: 'Stablecoin', pdQ3: 3.90, pdQ4: 4.65, liq: '$240k' },
    { id: 'ASSET-08', name: 'Cross-Chain Fast Bridge Vault (Simulated)', category: 'Bridge', pdQ3: 5.40, pdQ4: 6.40, liq: '$140k' }
  ];

  function initRisk() {
    var tbody = document.getElementById('riskTableBody');
    var quarterSel = document.getElementById('riskQuarter');
    var catSel = document.getElementById('riskCategory');
    var sortSel = document.getElementById('riskSort');
    if (!tbody || !quarterSel) return;

    function render() {
      var q = quarterSel.value;
      var cat = catSel.value;
      var sort = sortSel.value;

      var list = RISK_PROTOCOLS.filter(function (p) {
        return cat === 'ALL' || p.category === cat;
      }).map(function (p) {
        var pd = q === 'Q3' ? p.pdQ3 : p.pdQ4;
        var shift = p.pdQ4 - p.pdQ3;
        return {
          id: p.id,
          name: p.name,
          category: p.category,
          pd: pd,
          shift: shift,
          liq: p.liq
        };
      });

      list.sort(function (a, b) {
        if (sort === 'pd_asc') return a.pd - b.pd;
        if (sort === 'shift') return b.shift - a.shift;
        return b.pd - a.pd;
      });

      tbody.innerHTML = list.map(function (p) {
        var tierClass = p.pd < 1.5 ? 'ef-tag-teal' : (p.pd < 3.5 ? 'ef-tag-violet' : 'ef-tag-amber');
        var tierName = p.pd < 1.5 ? 'Low Implied PD' : (p.pd < 3.5 ? 'Moderate Implied PD' : 'Elevated Tail Odds');
        return (
          '<tr>' +
            '<td><strong>' + p.name + '</strong><div class="mono" style="font-size:0.74rem;color:var(--ef-dim);">' + p.id + '</div></td>' +
            '<td><span class="ef-tag">' + p.category + '</span></td>' +
            '<td class="num"><strong style="font-size:0.98rem;">' + p.pd.toFixed(2) + '%</strong> <span style="color:var(--ef-dim);font-size:0.76rem;">(' + Math.round(p.pd * 100) + ' bps)</span></td>' +
            '<td class="num">' + (p.shift >= 0 ? '+' : '') + p.shift.toFixed(2) + ' pp</td>' +
            '<td>' +
              '<div style="display:flex;align-items:center;gap:8px;">' +
                '<div class="ef-bar-track" style="width:90px;"><div class="ef-bar-fill" style="width:' + Math.min(100, p.pd * 14) + '%;"></div></div>' +
                '<span class="ef-tag ' + tierClass + '">' + tierName + '</span>' +
              '</div>' +
            '</td>' +
            '<td class="num">' + p.liq + '</td>' +
          '</tr>'
        );
      }).join('');
    }

    quarterSel.addEventListener('change', render);
    catSel.addEventListener('change', render);
    sortSel.addEventListener('change', render);
    render();
  }

  function boot() {
    initTheme();
    initHome();
    initExplorer();
    initDeep();
    initFutarchy();
    initOpportunity();
    initRisk();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
