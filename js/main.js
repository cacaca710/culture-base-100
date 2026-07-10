/* 山海匯聚 — 主頁互動邏輯 */
(function () {
  "use strict";

  const mapHost = document.getElementById("taiwan-map");
  const tooltip = document.getElementById("tooltip");
  const panelHead = document.getElementById("panel-head");
  const panelKicker = document.getElementById("panel-kicker");
  const panelTitle = document.getElementById("panel-title");
  const panelBody = document.getElementById("panel-body");
  const panelClose = document.getElementById("panel-close");

  const idToCounty = {};
  Object.entries(COUNTIES).forEach(([name, c]) => (idToCounty[c.id] = name));

  const basesByCounty = {};
  BASES.forEach(b => (basesByCounty[b.county] = basesByCounty[b.county] || []).push(b));

  let locked = null; // 鎖定中的縣市名

  /* ── 地圖初始化 ───────────────────── */
  mapHost.innerHTML = TAIWAN_SVG;
  const svg = mapHost.querySelector("svg");
  const paths = Array.from(svg.querySelectorAll("path.land"));

  // 主島 viewBox(排除金門、連江,稍後移為離島框)
  const OUTLYING = ["TW-KIN", "TW-LIE"];
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  paths.forEach(p => {
    if (OUTLYING.includes(p.id)) return;
    const b = p.getBBox();
    x0 = Math.min(x0, b.x); y0 = Math.min(y0, b.y);
    x1 = Math.max(x1, b.x + b.width); y1 = Math.max(y1, b.y + b.height);
  });
  const PAD = 24;
  const vb = { x: x0 - PAD - 120, y: y0 - PAD, w: (x1 - x0) + PAD * 2 + 120, h: (y1 - y0) + PAD * 2 };
  svg.setAttribute("viewBox", `${vb.x} ${vb.y} ${vb.w} ${vb.h}`);
  svg.setAttribute("preserveAspectRatio", "xMidYMid meet");

  // 離島框:連江(上)、金門(下)移到地圖左側
  // 這兩縣的 bbox 因離散小島礁而過大,改鎖定「最大子島」置中放大,超出框的以 clipPath 裁切
  const ns = "http://www.w3.org/2000/svg";
  function largestSubpathBBox(p) {
    const segs = (p.getAttribute("d") || "").split(/(?=[Mm])/).filter(s => s.trim());
    let best = null, bestArea = -1;
    const tmp = document.createElementNS(ns, "path");
    svg.appendChild(tmp);
    segs.forEach(d => {
      tmp.setAttribute("d", d);
      const b = tmp.getBBox();
      const area = b.width * b.height;
      if (area > bestArea) { bestArea = area; best = b; }
    });
    tmp.remove();
    return best || p.getBBox();
  }
  const insetSlots = { "TW-LIE": { label: "連江縣", cy: 0.16 }, "TW-KIN": { label: "金門縣", cy: 0.40 } };
  Object.entries(insetSlots).forEach(([id, slot], idx) => {
    const p = svg.getElementById(id);
    if (!p) return;
    const b = largestSubpathBBox(p);
    const boxW = 104, boxH = 92;
    const cx = vb.x + 14 + boxW / 2;
    const cy = vb.y + vb.h * slot.cy + boxH / 2;
    const scale = Math.min((boxW - 30) / b.width, (boxH - 42) / b.height);
    const tx = cx - (b.x + b.width / 2) * scale;
    const ty = cy - 6 - (b.y + b.height / 2) * scale;
    p.setAttribute("transform", `translate(${tx},${ty}) scale(${scale})`);
    p.style.strokeWidth = (1.2 / scale);

    const clip = document.createElementNS(ns, "clipPath");
    clip.setAttribute("id", "inset-clip-" + idx);
    clip.setAttribute("clipPathUnits", "userSpaceOnUse");
    const clipRect = document.createElementNS(ns, "rect");
    clipRect.setAttribute("x", cx - boxW / 2 + 2); clipRect.setAttribute("y", cy - boxH / 2 + 2);
    clipRect.setAttribute("width", boxW - 4); clipRect.setAttribute("height", boxH - 4);
    clipRect.setAttribute("rx", 10);
    clip.appendChild(clipRect);
    svg.appendChild(clip);
    // 裁切放在無 transform 的外層 g,座標系才會是地圖根座標
    const wrap = document.createElementNS(ns, "g");
    wrap.setAttribute("clip-path", `url(#inset-clip-${idx})`);
    p.parentNode.insertBefore(wrap, p);
    wrap.appendChild(p);

    const rect = document.createElementNS(ns, "rect");
    rect.setAttribute("x", cx - boxW / 2); rect.setAttribute("y", cy - boxH / 2);
    rect.setAttribute("width", boxW); rect.setAttribute("height", boxH);
    rect.setAttribute("rx", 12);
    rect.setAttribute("class", "island-box");
    svg.insertBefore(rect, svg.firstChild);

    const label = document.createElementNS(ns, "text");
    label.setAttribute("x", cx); label.setAttribute("y", cy + boxH / 2 - 8);
    label.setAttribute("text-anchor", "middle");
    label.setAttribute("class", "island-label");
    label.textContent = slot.label;
    svg.appendChild(label);
  });

  // 縣市著色與事件
  paths.forEach(p => {
    const county = idToCounty[p.id];
    if (!county) return;
    const info = COUNTIES[county];
    if (info.focus) {
      p.classList.add("focus");
      p.style.fill = info.color;
      p.style.setProperty("--glow", info.color);
    }
    p.addEventListener("mousemove", e => showTooltip(e, county));
    p.addEventListener("mouseenter", () => { if (!locked) renderCounty(county, false); });
    p.addEventListener("mouseleave", () => { hideTooltip(); if (!locked) renderOverview(); });
    p.addEventListener("click", () => selectCounty(county));
  });

  /* ── Tooltip ───────────────────── */
  function showTooltip(e, county) {
    const info = COUNTIES[county];
    const n = (basesByCounty[county] || []).length;
    tooltip.innerHTML =
      `<div class="n">${county}${info.focus ? "・展覽主軸" : ""}</div>` +
      `<div class="c">${n} 處百大文化基地｜點擊查看</div>`;
    tooltip.style.left = e.clientX + "px";
    tooltip.style.top = e.clientY + "px";
    tooltip.classList.add("on");
  }
  function hideTooltip() { tooltip.classList.remove("on"); }

  /* ── 選取狀態 ───────────────────── */
  function selectCounty(county) {
    locked = county;
    paths.forEach(p => p.classList.toggle("selected", idToCounty[p.id] === county));
    renderCounty(county, true);
  }
  function unselect() {
    locked = null;
    paths.forEach(p => p.classList.remove("selected"));
    renderOverview();
  }
  panelClose.addEventListener("click", unselect);

  /* ── 面板:總覽 ───────────────────── */
  function renderOverview() {
    panelHead.classList.remove("locked");
    panelHead.style.background = "";
    panelKicker.textContent = "第 1 屆百大文化基地";
    panelTitle.innerHTML = `山海匯聚・文化地圖`;

    const chips = ["臺中市", "彰化縣", "雲林縣", "南投縣"].map(c => {
      const info = COUNTIES[c];
      return `<button class="focus-chip" style="background:${info.color}" data-county="${c}">
        ${info.label}<small>${(basesByCounty[c] || []).length} 處基地</small></button>`;
    }).join("");

    const ws = WORKSHOPS.map(w => wsCard(w, "工作坊")).join("");
    const mt = meetupIntro() + MEETUPS.map(m => wsCard({ ...m, tag: "交流會", time: "" }, "交流會")).join("");

    panelBody.innerHTML = `
      <div class="overview">
        <p class="lead">文化部「百大文化基地」串連全臺 110 處文化場域。「山海匯聚」以臺中、彰化、雲林、南投四縣市為展覽主軸,透過走讀工作坊、交流會與共創展,交織人文地景的對話。<br>滑入地圖上的縣市,探索各地的文化基地。</p>
        <div class="stats">
          <div class="stat"><b>110</b><span>百大文化基地</span></div>
          <div class="stat"><b>22</b><span>縣市全境串連</span></div>
          <div class="stat"><b>4</b><span>展覽主軸縣市</span></div>
        </div>
        <div class="section-title">展覽主軸縣市</div>
        <div class="focus-chips">${chips}</div>
        <div class="section-title">文化基地工作坊</div>
        ${ws}
        <div class="section-title">中臺灣文化基地交流會</div>
        ${mt}
        <div class="section-title">共創展</div>
        ${expoCard()}
      </div>`;

    panelBody.querySelectorAll(".focus-chip").forEach(btn =>
      btn.addEventListener("click", () => selectCounty(btn.dataset.county)));
    panelBody.querySelectorAll("[data-goto-expo]").forEach(el =>
      el.addEventListener("click", () => (location.href = "exhibition.html")));
  }

  /* ── 面板:縣市 ───────────────────── */
  function renderCounty(county, isLocked) {
    const info = COUNTIES[county];
    const bases = basesByCounty[county] || [];
    const color = info.color || "#3b3a36";

    panelHead.classList.toggle("locked", !!isLocked);
    panelHead.style.background = info.focus ? info.colorSoft : "";
    panelKicker.textContent = info.focus ? "展覽主軸縣市・山海匯聚" : "百大文化基地";
    panelTitle.innerHTML = `${county}<span class="count">${bases.length} 處基地</span>`;

    let html = "";

    if (info.focus) {
      const ws = WORKSHOPS.filter(w => w.counties.includes(county));
      const mt = MEETUPS.filter(m => m.counties.includes(county));
      if (ws.length) {
        html += `<div class="section-title">文化基地工作坊</div>`;
        html += ws.map(w => wsCard(w, "工作坊", color)).join("");
      }
      if (mt.length) {
        html += `<div class="section-title">交流會</div>`;
        html += meetupIntro();
        html += mt.map(m => wsCard({ ...m, tag: "交流會", time: "" }, "交流會", color)).join("");
      }
      if (EXPO.counties.includes(county)) {
        html += `<div class="section-title">共創展</div>${expoCard(color)}`;
      }
    }

    html += `<div class="section-title">文化基地</div>`;
    html += bases.map(baseCard).join("");
    panelBody.innerHTML = html;
    panelBody.scrollTop = 0;

    panelBody.querySelectorAll(".base-card > .head").forEach(head =>
      head.addEventListener("click", () => toggleBase(head.parentElement)));
    panelBody.querySelectorAll("[data-goto-expo]").forEach(el =>
      el.addEventListener("click", () => (location.href = "exhibition.html")));
  }

  /* ── 卡片模板 ───────────────────── */
  function meetupIntro() {
    return `<div class="meetup-intro">
      <p>${MEETUP_INTRO.lead}</p>
      <ol>${MEETUP_INTRO.goals.map(g => `<li><b>${g.title}</b>${g.text}</li>`).join("")}</ol>
    </div>`;
  }

  function wsCard(w, badge, color) {
    const c = color || "#3b3a36";
    return `<div class="ws-card" style="border-left-color:${c}">
      <div class="row1">
        <span class="badge" style="background:${c}">${w.session ? badge + "・" + w.session : badge}</span>
        <span class="date">${w.date}(${w.weekday})</span>
        ${w.time ? `<span class="tag">${w.time}</span>` : ""}
        ${w.tag && badge !== "交流會" ? `<span class="tag">${w.tag}</span>` : ""}
      </div>
      <h4>${w.title}</h4>
      <div class="venue">📍 ${w.venue}</div>
    </div>`;
  }

  function expoCard(color) {
    const c = color || COUNTIES["彰化縣"].color;
    return `<div class="ws-card" style="border-left-color:${c};cursor:pointer" data-goto-expo title="前往共創展頁面">
      <div class="row1">
        <span class="badge" style="background:${c}">共創展</span>
        <span class="date">${EXPO.dateFrom}(${EXPO.weekdayFrom}) — ${EXPO.dateTo}(${EXPO.weekdayTo})</span>
      </div>
      <h4>${EXPO.title}｜${EXPO.slogan} →</h4>
      <div class="venue">📍 ${EXPO.venue}・${EXPO.time}</div>
    </div>`;
  }

  function baseCard(b) {
    return `<div class="base-card" data-q="${encodeURIComponent(b.name + " " + b.county)}">
      <button class="head">
        <span class="txt">
          <span class="nm">${b.name}</span>
        </span>
        <span class="arrow">▼</span>
      </button>
      <div class="base-detail">
        <div class="map-slot"></div>
        <a class="gmap-link" target="_blank" rel="noopener"
           href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(b.name + " " + b.county)}">
          在 Google 地圖開啟 ↗</a>
      </div>
    </div>`;
  }

  function toggleBase(card) {
    const wasOpen = card.classList.contains("open");
    panelBody.querySelectorAll(".base-card.open").forEach(c => c.classList.remove("open"));
    if (wasOpen) return;
    card.classList.add("open");
    const slot = card.querySelector(".map-slot");
    if (!slot.querySelector("iframe")) {
      const iframe = document.createElement("iframe");
      iframe.loading = "lazy";
      iframe.referrerPolicy = "no-referrer-when-downgrade";
      iframe.src = `https://maps.google.com/maps?q=${card.dataset.q}&z=15&hl=zh-TW&output=embed`;
      slot.appendChild(iframe);
    }
    card.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  /* ── 啟動(支援 ?county=彰化縣 深連結) ───────────────────── */
  const initial = new URLSearchParams(location.search).get("county");
  if (initial && COUNTIES[initial]) selectCounty(initial);
  else renderOverview();
})();
