// Impostor: hra na jednom mobile. Čistý JavaScript bez knižníc.
"use strict";

/* ============ Slová: "slovo:nápoveda" -> { w, h } ============ */
KATEGORIE.forEach(k => {
  k.items = k.words.map(s => {
    const i = s.indexOf(":");
    return i < 0 ? { w: s.trim(), h: "" } : { w: s.slice(0, i).trim(), h: s.slice(i + 1).trim() };
  });
});
const VSETKY_SLOVA = KATEGORIE.reduce((s, k) => s + k.items.length, 0);

/* ============ Uloženie do mobilu (localStorage) ============ */
const KLUC = "impostor.v1";
const PREDVOLENE = {
  players: [],
  settings: { cats: KATEGORIE.map(k => k.id), impostors: 1, mode: "klasika", showCat: true, hint: true, know: false, timer: 120 },
  used: {}            // už použité slová podľa kategórie, aby sa neopakovali
};

function nacitaj() {
  try {
    const raw = localStorage.getItem(KLUC);
    if (!raw) return structuredClone(PREDVOLENE);
    const d = JSON.parse(raw);
    return {
      players: Array.isArray(d.players) ? d.players.slice(0, 20) : [],
      settings: Object.assign({}, PREDVOLENE.settings, d.settings),
      used: d.used && typeof d.used === "object" ? d.used : {}
    };
  } catch (e) {
    return structuredClone(PREDVOLENE);
  }
}
function uloz() {
  try { localStorage.setItem(KLUC, JSON.stringify(stav)); } catch (e) { /* súkromné okno: hra ide aj bez ukladania */ }
}

const stav = nacitaj();
stav.settings.cats = stav.settings.cats.filter(id => KATEGORIE.some(k => k.id === id));
if (!stav.settings.cats.length) stav.settings.cats = KATEGORIE.map(k => k.id);
if (!["klasika", "undercover", "chaos"].includes(stav.settings.mode)) stav.settings.mode = "klasika";

/* ============ Náhoda ============ */
function nahodne(n) {                       // celé číslo 0 .. n-1 cez crypto, bez skreslenia
  const max = Math.floor(0x100000000 / n) * n;
  const buf = new Uint32Array(1);
  do { crypto.getRandomValues(buf); } while (buf[0] >= max);
  return buf[0] % n;
}
function zamiesaj(pole) {                   // Fisher-Yates, vráti novú kópiu
  const a = pole.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = nahodne(i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ============ Pomocné funkcie ============ */
const $ = sel => document.querySelector(sel);
const velke = s => s.charAt(0).toUpperCase() + s.slice(1);
const dvojmiestne = n => String(n).padStart(2, "0");
const maxImpostorov = pocet => Math.max(1, Math.min(3, Math.floor((pocet - 1) / 2)));
const kategoria = id => KATEGORIE.find(k => k.id === id);
const spojMena = m => m.length > 1 ? m.slice(0, -1).join(", ") + " a " + m.at(-1) : (m[0] || "");
const menejPohybu = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
const vibruj = v => { if (navigator.vibrate) { try { navigator.vibrate(v); } catch (e) {} } };

// znovu spustí CSS animáciu na prvku (napr. „bump“ pri zmene čísla)
function zahraj(el, trieda) {
  el.classList.remove(trieda);
  void el.offsetWidth;
  el.classList.add(trieda);
}
// rozdelí text na písmená, ktoré naskočia jedno po druhom
function pismena(el, text) {
  el.textContent = "";
  el.setAttribute("aria-label", text);
  [...text].forEach((ch, i) => {
    if (ch === " ") { el.appendChild(document.createTextNode(" ")); return; }
    const s = document.createElement("span");
    s.className = "ch";
    s.style.setProperty("--i", i);
    s.textContent = ch;
    s.setAttribute("aria-hidden", "true");
    el.appendChild(s);
  });
}

/* ============ Prepínanie obrazoviek ============ */
let aktualna = "home";
const historia = [];

function ukaz(meno, { spat = false } = {}) {
  if (!spat && aktualna !== meno) historia.push(aktualna);
  aktualna = meno;
  document.querySelectorAll("[data-screen]").forEach(el => { el.hidden = el.dataset.screen !== meno; });
  document.body.dataset.mode = (meno === "pass" || meno === "peek") ? "quiet" : (meno === "reveal" ? "reveal" : "");
  if (meno === "players") vykresliHracov();
  if (meno === "settings") vykresliNastavenia();
  window.scrollTo(0, 0);
}
function spat() { ukaz(historia.pop() || "home", { spat: true }); }
document.querySelectorAll("[data-back]").forEach(b => b.addEventListener("click", spat));
document.querySelectorAll("[data-go]").forEach(b => b.addEventListener("click", () => ukaz(b.dataset.go)));

/* ============ 1. Úvod ============ */
$("#stat-cats").textContent = KATEGORIE.length;
$("#stat-words").textContent = VSETKY_SLOVA;
// čísla sa pri štarte „dopočítajú“ od nuly
(function napocitaj() {
  if (menejPohybu()) return;
  const el = $("#stat-words");
  const t0 = performance.now(), trvanie = 1100;
  const krok = t => {
    const p = Math.min(1, (t - t0) / trvanie);
    el.textContent = Math.round(VSETKY_SLOVA * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(krok);
  };
  requestAnimationFrame(krok);
})();
$("#btn-play").addEventListener("click", () => ukaz("players"));

/* ============ 2. Hráči ============ */
let noveMeno = null;   // meno práve pridaného hráča (dostane animáciu)

function vykresliHracov() {
  const ul = $("#list-players");
  ul.innerHTML = "";
  stav.players.forEach((meno, i) => {
    const li = document.createElement("li");
    if (meno === noveMeno) li.classList.add("is-new");
    li.innerHTML = `<span class="players__n">${dvojmiestne(i + 1)}</span><span class="players__name"></span>` +
      `<button class="players__del" type="button">×</button>`;
    li.querySelector(".players__name").textContent = meno;
    const del = li.querySelector("button");
    del.setAttribute("aria-label", `Odstrániť ${meno}`);
    del.addEventListener("click", () => {
      li.classList.add("is-leaving");
      const hotovo = () => {
        const idx = stav.players.indexOf(meno);
        if (idx >= 0) stav.players.splice(idx, 1);
        uloz();
        vykresliHracov();
      };
      if (menejPohybu()) hotovo(); else setTimeout(hotovo, 220);
    });
    ul.appendChild(li);
  });
  noveMeno = null;
  const chyba = 3 - stav.players.length;
  $("#hint-players").textContent = chyba > 0
    ? `Pridaj ešte ${chyba} ${chyba === 1 ? "hráča" : "hráčov"}`
    : `${stav.players.length} hráčov`;
  $("#btn-to-settings").disabled = chyba > 0;
}

$("#form-add").addEventListener("submit", e => {
  e.preventDefault();
  const input = $("#input-name");
  const meno = input.value.trim().replace(/\s+/g, " ");
  const msg = $("#msg-players");
  msg.textContent = "";
  if (!meno) return;
  if (stav.players.length >= 20) { msg.textContent = "Maximum je 20 hráčov."; zahraj(input, "shake"); return; }
  if (stav.players.some(p => p.toLowerCase() === meno.toLowerCase())) {
    msg.textContent = `${meno} už v hre je.`;
    zahraj(input, "shake");
    return;
  }
  stav.players.push(meno);
  noveMeno = meno;
  uloz();
  input.value = "";
  vykresliHracov();
  input.focus();
});

$("#btn-to-settings").addEventListener("click", () => ukaz("settings"));

/* ============ 3. Nastavenia ============ */
const POPIS_REZIMU = {
  klasika: "Impostor vie, že je impostor. Dostane kategóriu a nápovedu.",
  undercover: "Impostor dostane podobné slovo z tej istej kategórie a nevie, že je impostor.",
  chaos: "Počet impostorov je náhodný: viac, jeden alebo aj nikto. Nikto nevie koľko."
};

// čipy kategórií sa vytvoria raz, potom sa im len mení stav (kvôli animácii)
function vytvorKategorie() {
  const box = $("#list-cats");
  KATEGORIE.forEach((k, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "cat";
    b.dataset.cat = k.id;
    b.style.setProperty("--i", i);
    b.innerHTML = `<span></span><small>${k.items.length}</small>`;
    b.querySelector("span").textContent = k.name;
    b.addEventListener("click", () => {
      const s = stav.settings;
      s.cats = s.cats.includes(k.id) ? s.cats.filter(id => id !== k.id) : [...s.cats, k.id];
      uloz();
      zahraj(b, "pop");
      vykresliNastavenia();
    });
    box.appendChild(b);
  });
}
vytvorKategorie();

function prepinac(sel, hodnota) { $(sel).setAttribute("aria-checked", String(!!hodnota)); }

function vykresliNastavenia() {
  const s = stav.settings;
  document.querySelectorAll("#list-cats .cat").forEach(b => b.setAttribute("aria-pressed", s.cats.includes(b.dataset.cat)));
  const slov = s.cats.reduce((n, id) => n + kategoria(id).items.length, 0);
  $("#cats-count").textContent = s.cats.length ? `${s.cats.length} · ${slov} slov` : "";

  document.querySelectorAll("#seg-mode button").forEach(b => b.setAttribute("aria-checked", b.dataset.mode === s.mode));
  $("#mode-note").textContent = POPIS_REZIMU[s.mode];

  const n = stav.players.length;
  const max = maxImpostorov(n);
  s.impostors = Math.min(Math.max(1, s.impostors), max);
  $("#imp-count").textContent = s.impostors;
  $("#btn-imp-minus").disabled = s.impostors <= 1;
  $("#btn-imp-plus").disabled = s.impostors >= max;
  $("#imp-note").textContent = `Pri ${n} hráčoch max. ${max}`;
  $("#row-imp").hidden = s.mode === "chaos";

  const under = s.mode === "undercover";
  ["#row-showcat", "#row-hint"].forEach(sel => $(sel).classList.toggle("is-off", under));
  $("#sw-showcat").disabled = under;
  $("#sw-hint").disabled = under;
  prepinac("#sw-showcat", s.showCat);
  prepinac("#sw-hint", s.hint);
  $("#row-know").hidden = under || (s.mode !== "chaos" && s.impostors < 2);
  prepinac("#sw-know", s.know);

  document.querySelectorAll("#seg-timer button").forEach(b => b.setAttribute("aria-checked", Number(b.dataset.t) === s.timer));

  $("#hint-settings").textContent = s.cats.length ? "" : "Vyber aspoň jednu kategóriu";
  $("#btn-start").disabled = !s.cats.length;
}

$("#btn-all-cats").addEventListener("click", () => {
  stav.settings.cats = KATEGORIE.map(k => k.id);
  uloz();
  document.querySelectorAll("#list-cats .cat").forEach(b => zahraj(b, "pop"));
  vykresliNastavenia();
});
$("#btn-imp-minus").addEventListener("click", () => { stav.settings.impostors--; uloz(); vykresliNastavenia(); zahraj($("#imp-count"), "bump"); });
$("#btn-imp-plus").addEventListener("click", () => { stav.settings.impostors++; uloz(); vykresliNastavenia(); zahraj($("#imp-count"), "bump"); });
[["#sw-showcat", "showCat"], ["#sw-hint", "hint"], ["#sw-know", "know"]].forEach(([sel, kluc]) => {
  $(sel).addEventListener("click", () => { stav.settings[kluc] = !stav.settings[kluc]; uloz(); vykresliNastavenia(); });
});
document.querySelectorAll("#seg-mode button").forEach(b => b.addEventListener("click", () => {
  stav.settings.mode = b.dataset.mode;
  uloz();
  vykresliNastavenia();
  zahraj($("#mode-note"), "fade-swap");
}));
document.querySelectorAll("#seg-timer button").forEach(b => b.addEventListener("click", () => {
  stav.settings.timer = Number(b.dataset.t);
  uloz();
  vykresliNastavenia();
}));
$("#btn-start").addEventListener("click", noveKolo);

/* ============ Losovanie kola ============ */
let kolo = null;

function vyberSlovo() {
  const cats = stav.settings.cats;
  let zasoba = [];
  const naplnZasobu = () => {
    zasoba = [];
    cats.forEach(id => {
      const pouzite = stav.used[id] || [];
      kategoria(id).items.forEach(it => { if (!pouzite.includes(it.w)) zasoba.push([id, it]); });
    });
  };
  naplnZasobu();
  if (!zasoba.length) {                     // všetko minuté: vybrané kategórie začnú odznova
    cats.forEach(id => { stav.used[id] = []; });
    naplnZasobu();
  }
  const [catId, it] = zasoba[nahodne(zasoba.length)];
  (stav.used[catId] = stav.used[catId] || []).push(it.w);
  return { catId, word: it.w, hint: it.h };
}

function noveKolo() {
  const hraci = stav.players;
  const s = stav.settings;
  if (hraci.length < 3 || !s.cats.length) return;
  const max = maxImpostorov(hraci.length);
  const pocet = s.mode === "chaos" ? nahodne(max + 1) : Math.min(s.impostors, max);
  const { catId, word, hint } = vyberSlovo();
  let undercover = null;
  if (s.mode === "undercover") {            // podobné slovo z tej istej kategórie
    const ine = kategoria(catId).items.filter(it => it.w !== word);
    undercover = ine[nahodne(ine.length)].w;
  }
  kolo = {
    mode: s.mode, word, hint, catId, undercover,
    impostors: new Set(zamiesaj(hraci).slice(0, pocet)),
    index: 0, starter: hraci[nahodne(hraci.length)], clueRound: 1
  };
  uloz();
  zastavCasovac();
  clearTimeout(odpocetTimer);
  clearTimeout(ruletaTimer);
  historia.length = 0;
  ukazPodanie();
}

/* ============ 4a. Podaj mobil ============ */
function postup() { return `${dvojmiestne(kolo.index + 1)} / ${dvojmiestne(stav.players.length)}`; }

function ukazPodanie() {
  const meno = stav.players[kolo.index];
  ukaz("pass");
  pismena($("#pass-name"), meno);
  $("#btn-iam").textContent = `Som ${meno}`;
  $("#pass-progress").textContent = postup();
  odzbrojZrusenie();
}

// naplní zadnú stranu karty podľa roly hráča
function pripravKartu(meno) {
  const s = stav.settings;
  const kat = kategoria(kolo.catId).name;
  const jeImpostor = kolo.impostors.has(meno);
  const ukazAkoImpostor = jeImpostor && kolo.mode !== "undercover";
  const clue = $("#face-clue"), pill = $("#face-cat"), sub = $("#face-sub");

  karta.dataset.impostor = ukazAkoImpostor ? "1" : "0";
  sub.textContent = "";
  if (!ukazAkoImpostor) {                    // civilista alebo undercover (ten o tom nevie)
    $("#face-label").textContent = "Tvoje slovo";
    $("#face-word").textContent = velke(jeImpostor ? kolo.undercover : kolo.word);
    pill.textContent = `Kategória · ${kat}`;
    pill.hidden = false;
    clue.hidden = true;
    return;
  }
  $("#face-label").textContent = "Si";
  $("#face-word").textContent = "Impostor";
  pill.textContent = `Kategória · ${kat}`;
  pill.hidden = !s.showCat;
  $("#face-hint").textContent = velke(kolo.hint || "");
  clue.hidden = !(s.hint && kolo.hint);
  if (s.know) {
    const ostatni = [...kolo.impostors].filter(m => m !== meno);
    if (ostatni.length) sub.textContent = `Spolu s tebou: ${spojMena(ostatni)}`;
    else if (kolo.mode === "chaos") sub.textContent = "Si jediný impostor";
  }
  if (!sub.textContent) sub.textContent = (pill.hidden && clue.hidden) ? "Nepoznáš slovo. Blafuj." : "Blafuj, nech zapadneš.";
}

$("#btn-iam").addEventListener("click", () => {
  const meno = stav.players[kolo.index];
  $("#peek-who").textContent = meno;
  $("#peek-progress").textContent = postup();
  videl = false;
  zatvorKartu();
  pripravKartu(meno);
  $("#btn-next").disabled = true;
  $("#hint-peek").textContent = "Najprv si pozri svoje slovo";
  ukaz("peek");
});

// Zrušenie kola na dve ťuknutia, aby sa nestalo omylom
let zrusTimer = null;
function odzbrojZrusenie() {
  clearTimeout(zrusTimer);
  const b = $("#btn-cancel");
  b.classList.remove("is-armed");
  b.textContent = "Zrušiť kolo";
}
$("#btn-cancel").addEventListener("click", () => {
  const b = $("#btn-cancel");
  if (b.classList.contains("is-armed")) {
    odzbrojZrusenie();
    kolo = null;
    historia.length = 0;
    historia.push("home", "players");
    ukaz("settings", { spat: true });
    return;
  }
  b.classList.add("is-armed");
  b.textContent = "Naozaj? Ťukni znova";
  zrusTimer = setTimeout(odzbrojZrusenie, 3000);
});

/* ============ 4b. Karta: otočí sa, kým držíš prst ============ */
const karta = $("#card");
let videl = false;

function otvorKartu() {
  karta.classList.add("is-open");
  karta.classList.toggle("is-impostor", karta.dataset.impostor === "1");
  vibruj(15);
  if (!videl) {
    videl = true;
    $("#btn-next").disabled = false;
    $("#hint-peek").textContent = "Pusti prst a podaj mobil ďalej";
    zahraj($("#btn-next"), "ready");
  }
}
function zatvorKartu() { karta.classList.remove("is-open"); }

karta.addEventListener("pointerdown", e => {
  e.preventDefault();
  try { karta.setPointerCapture(e.pointerId); } catch (err) {}
  otvorKartu();
});
["pointerup", "pointercancel", "lostpointercapture"].forEach(t => karta.addEventListener(t, zatvorKartu));
karta.addEventListener("contextmenu", e => e.preventDefault());
karta.addEventListener("keydown", e => {
  if ((e.key === " " || e.key === "Enter") && !e.repeat) { e.preventDefault(); otvorKartu(); }
});
karta.addEventListener("keyup", e => { if (e.key === " " || e.key === "Enter") zatvorKartu(); });
karta.addEventListener("blur", zatvorKartu);
document.addEventListener("visibilitychange", () => { if (document.hidden) zatvorKartu(); });

$("#btn-next").addEventListener("click", () => {
  zatvorKartu();
  kolo.index++;
  if (kolo.index < stav.players.length) ukazPodanie();
  else zacniKolo();
});

/* ============ 5. Kolo, ruleta začínajúceho a časovač ============ */
const OBVOD = 2 * Math.PI * 88;
let casovac = { zostava: 0, beziDo: 0, interval: null };
let wakeLock = null;
let ruletaTimer = null;

// mená sa rýchlo striedajú a spomaľujú, kým nezastanú na začínajúcom
function ruleta(cielove) {
  const el = $("#round-starter");
  clearTimeout(ruletaTimer);
  el.classList.remove("is-landed");
  const hraci = stav.players;
  if (menejPohybu() || hraci.length < 2) { el.textContent = cielove; el.classList.add("is-landed"); return; }
  const kroky = 12;
  let i = 0, idx = nahodne(hraci.length);
  const tik = () => {
    if (i >= kroky) {
      el.textContent = cielove;
      zahraj(el, "is-landed");
      vibruj(30);
      return;
    }
    idx = (idx + 1) % hraci.length;
    el.textContent = hraci.at(idx);
    zahraj(el, "spin");
    i++;
    ruletaTimer = setTimeout(tik, 40 + i * i * 1.1);
  };
  tik();
}

function zacniKolo() {
  const t = stav.settings.timer;
  $("#timer").hidden = t === 0;
  $("#timer-ctrl").hidden = t === 0;
  $("#round-label").textContent = `Kolo nápovedí ${kolo.clueRound}`;
  resetCasovac();
  historia.length = 0;
  ukaz("round");
  ruleta(kolo.starter);
  drzObrazovku();
}

$("#btn-more").addEventListener("click", () => {
  const hraci = stav.players;
  let novy = hraci[nahodne(hraci.length)];
  if (hraci.length > 1) while (novy === kolo.starter) novy = hraci[nahodne(hraci.length)];
  kolo.starter = novy;
  kolo.clueRound++;
  zacniKolo();
});

function vykresliCas() {
  const celkom = stav.settings.timer;
  const ms = casovac.interval ? Math.max(0, casovac.beziDo - Date.now()) : casovac.zostava;
  const s = Math.ceil(ms / 1000);
  const text = `${Math.floor(s / 60)}:${dvojmiestne(s % 60)}`;
  const el = $("#timer-time");
  if (el.textContent !== text) {
    el.textContent = text;
    if (casovac.interval && s <= 10 && s > 0) { zahraj(el, "tick"); vibruj(10); }
  }
  $("#timer").classList.toggle("is-urgent", !!casovac.interval && s <= 10 && s > 0);
  $("#timer-bar").style.strokeDashoffset = celkom ? OBVOD * (1 - ms / (celkom * 1000)) : 0;
  return ms;
}
function tik() {
  const ms = vykresliCas();
  if (ms <= 0) {
    zastavCasovac();
    casovac.zostava = 0;
    $("#timer").classList.remove("is-urgent");
    $("#timer").classList.add("is-done");
    $("#timer-state").textContent = "Čas vypršal";
    $("#btn-timer").textContent = "Spustiť";
    $("#btn-timer").disabled = true;
    document.body.dataset.mode = "alarm";
    vibruj([200, 100, 200]);
  }
}
function zastavCasovac() {
  clearInterval(casovac.interval);
  casovac.interval = null;
}
function resetCasovac() {
  zastavCasovac();
  casovac.zostava = stav.settings.timer * 1000;
  $("#timer").classList.remove("is-done", "is-urgent");
  $("#timer-state").textContent = "Diskusia";
  $("#btn-timer").textContent = "Spustiť";
  $("#btn-timer").disabled = false;
  if (document.body.dataset.mode === "alarm") document.body.dataset.mode = "";
  vykresliCas();
}
$("#btn-timer").addEventListener("click", () => {
  if (casovac.interval) {
    casovac.zostava = Math.max(0, casovac.beziDo - Date.now());
    zastavCasovac();
    $("#btn-timer").textContent = "Pokračovať";
    $("#timer-state").textContent = "Pauza";
  } else {
    casovac.beziDo = Date.now() + casovac.zostava;
    casovac.interval = setInterval(tik, 200);
    $("#btn-timer").textContent = "Pauza";
    $("#timer-state").textContent = "Diskusia beží";
  }
  vykresliCas();
});
$("#btn-timer-reset").addEventListener("click", resetCasovac);

async function drzObrazovku() {
  try { if ("wakeLock" in navigator) wakeLock = await navigator.wakeLock.request("screen"); } catch (e) { wakeLock = null; }
}
function pustObrazovku() { try { wakeLock && wakeLock.release(); } catch (e) {} wakeLock = null; }

/* ============ 6. Odhalenie: odpočet 3-2-1 a výbuch iskier ============ */
let odpocetTimer = null;

function naplnOdhalenie() {
  const mena = [...kolo.impostors];
  const kat = kategoria(kolo.catId).name;
  if (!mena.length) {
    $("#rev-label").textContent = "Impostor v tomto kole";
    $("#rev-names").textContent = "Nebol nikto!";
  } else {
    $("#rev-label").textContent = mena.length > 1 ? "Impostori boli" : "Impostor bol";
    $("#rev-names").textContent = spojMena(mena);
  }
  $("#rev-their").textContent = (kolo.mode === "undercover" && mena.length)
    ? `${mena.length > 1 ? "Ich" : "Jeho"} slovo: ${velke(kolo.undercover)}`
    : "";
  $("#rev-word").textContent = velke(kolo.word);
  $("#rev-cat").textContent = (kolo.hint && kolo.mode !== "undercover")
    ? `Kategória: ${kat} · nápoveda: ${kolo.hint}`
    : `Kategória: ${kat}`;
}

function ukazVysledok() {
  clearTimeout(odpocetTimer);
  const scr = $("[data-screen=reveal]");
  scr.classList.remove("is-counting");
  scr.classList.add("is-shown");
  vibruj([40, 60, 120]);
  if (!menejPohybu()) {
    const r = $("#rev-names").getBoundingClientRect();
    iskry(r.left + r.width / 2, r.top + r.height / 2);
  }
}

$("#btn-reveal").addEventListener("click", () => {
  zastavCasovac();
  pustObrazovku();
  clearTimeout(ruletaTimer);
  naplnOdhalenie();
  historia.length = 0;
  const scr = $("[data-screen=reveal]");
  scr.classList.remove("is-shown");
  ukaz("reveal");
  if (menejPohybu()) { ukazVysledok(); return; }
  scr.classList.add("is-counting");
  let n = 3;
  const cislo = $("#countdown-n");
  const dalsie = () => {
    if (n === 0) { ukazVysledok(); return; }
    cislo.textContent = n;
    zahraj(cislo, "zoom");
    vibruj(20);
    n--;
    odpocetTimer = setTimeout(dalsie, 600);
  };
  dalsie();
});
$("#countdown").addEventListener("click", ukazVysledok);   // ťuknutím sa dá odpočet preskočiť

$("#btn-again").addEventListener("click", noveKolo);
$("#btn-change-settings").addEventListener("click", () => { historia.length = 0; historia.push("home", "players"); ukaz("settings", { spat: true }); });
$("#btn-change-players").addEventListener("click", () => { historia.length = 0; historia.push("home"); ukaz("players", { spat: true }); });

/* ============ Iskry: tenké sklenené črepy, ktoré vyletia pri odhalení ============ */
const platno = $("#burst");
const ctx = platno.getContext("2d");
let castice = [], beziIskry = false;

function iskry(x, y) {
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  platno.width = innerWidth * dpr;
  platno.height = innerHeight * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const farby = ["#FC734D", "#FFB49C", "#FFE9DE", "#0297DE", "#EDF4F9"];
  for (let i = 0; i < 90; i++) {
    const uhol = Math.random() * Math.PI * 2;
    const rychlost = 3 + Math.random() * 9;
    castice.push({
      x, y,
      vx: Math.cos(uhol) * rychlost,
      vy: Math.sin(uhol) * rychlost - 3,
      w: 1.5 + Math.random() * 1.5,
      h: 8 + Math.random() * 18,
      rot: Math.random() * Math.PI,
      vr: (Math.random() - .5) * .3,
      zivot: 1,
      farba: farby[i % farby.length]
    });
  }
  if (!beziIskry) { beziIskry = true; requestAnimationFrame(animujIskry); }
}
function animujIskry() {
  ctx.clearRect(0, 0, innerWidth, innerHeight);
  castice.forEach(c => {
    c.x += c.vx; c.y += c.vy;
    c.vx *= .985; c.vy = c.vy * .985 + .22;
    c.rot += c.vr;
    c.zivot -= .012;
    ctx.save();
    ctx.globalAlpha = Math.max(0, c.zivot);
    ctx.translate(c.x, c.y);
    ctx.rotate(c.rot);
    ctx.fillStyle = c.farba;
    ctx.fillRect(-c.w / 2, -c.h / 2, c.w, c.h);
    ctx.restore();
  });
  castice = castice.filter(c => c.zivot > 0 && c.y < innerHeight + 40);
  if (castice.length) requestAnimationFrame(animujIskry);
  else { beziIskry = false; ctx.clearRect(0, 0, innerWidth, innerHeight); }
}

/* ============ Offline: service worker ============ */
if ("serviceWorker" in navigator && /^https?:$/.test(location.protocol)) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(() => { /* bez SW hra funguje, len nie offline */ });
  });
}

// pre testy: prístup k stavu kola
window.__impostor = { get kolo() { return kolo; }, stav };
