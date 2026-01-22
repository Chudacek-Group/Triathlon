// --- PAGE LOADER ---
function loadPage(name) {
  fetch(`pages/${name}.html`)
    .then(r => r.text())
    .then(html => {
      document.getElementById("pageContainer").innerHTML = html;

      if (name === "race") initRaceLogic();
      if (name === "runplus") initRunLogic();
      if (name === "bikeplus") initBikePlusLogic();
    });
}

// --- TAB SWITCHING ---
document.querySelectorAll(".tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    loadPage(tab.dataset.page);
  });
});

// Load default page
loadPage("runplus");
document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
document.querySelector('.tab[data-page="runplus"]').classList.add("active");



// --- RACE LOGIC ---
function initRaceLogic() {
  const el = id => document.getElementById(id);

  function secToMMSS(s){
    return Math.floor(s/60)+":"+String(s%60).padStart(2,"0")
  }
  function paceToSec(v){
    const p=v.split(":");
    if(p.length<2) return 0;
    return (+p[0]||0)*60+(+p[1]||0)
  }
  function fmt(m){
    const h=Math.floor(m/60),
          mi=Math.floor(m%60),
          s=Math.floor(m*60%60);
    return `${h}:${String(mi).padStart(2,"0")}:${String(s).padStart(2,"0")}`
  }

  function calc(){
    const swim=(el("swimDist").value/100)*(el("swimSlider").value/60);
    const bike=(el("bikeDist").value/el("bikeSlider").value)*60;
    const run =el("runDist").value*(el("runSlider").value/60);
    const t1  =paceToSec(el("t1Text").value)/60;
    const t2  =paceToSec(el("t2Text").value)/60;

    const toT2 = swim + t1 + bike + t2;

    el("swimTime").textContent = fmt(swim);
    el("bikeTime").textContent = fmt(bike);
    el("runTime").textContent  = fmt(run);
    el("t1Time").textContent   = fmt(t1);
    el("t2Time").textContent   = fmt(t2);
    el("toT2Time").textContent = fmt(toT2);
    el("total").textContent    = fmt(toT2 + run);
  }

  ["swim","run"].forEach(d=>{
    el(d+"Slider").addEventListener("input",()=>{
      el(d+"Pace").value=secToMMSS(+el(d+"Slider").value);
      calc();
    });
    el(d+"Pace").addEventListener("input",()=>{
      el(d+"Slider").value=paceToSec(el(d+"Pace").value);
      calc();
    });
  });

  el("bikeSlider").addEventListener("input",()=>{
    el("bikeSpeed").value=el("bikeSlider").value; calc();
  });
  el("bikeSpeed").addEventListener("input",()=>{
    el("bikeSlider").value=el("bikeSpeed").value; calc();
  });

  ["t1","t2"].forEach(t=>{
    el(t+"Slider").addEventListener("input",()=>{
      el(t+"Text").value=secToMMSS(+el(t+"Slider").value);
      calc();
    });
    el(t+"Text").addEventListener("input",()=>{
      el(t+"Slider").value=paceToSec(el(t+"Text").value);
      calc();
    });
  });

  el("halfBtn").onclick=()=>{
    el("swimDist").value=1900;
    el("bikeDist").value=90;
    el("runDist").value=21.1;
    calc();
  }
  el("fullBtn").onclick=()=>{
    el("swimDist").value=3800;
    el("bikeDist").value=180;
    el("runDist").value=42.2;
    calc();
  }

  calc();
}



// --- RUN+ LOGIC ---
function initRunLogic() {
  const el = id => document.getElementById(id);

  function paceToSeconds(pace) {
    const [m, s] = pace.split(":").map(Number);
    return m * 60 + s;
  }

  function secondsToTime(sec) {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = Math.floor(sec % 60);

    if (h > 0) {
      return `${h}:${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;
    }

    return `${m}:${String(s).padStart(2,"0")}`;
  }

  function updateRun() {
    const paceSec = paceToSeconds(el("runPace").value);
    el("runSlider").value = paceSec;

    const speed = 3600 / paceSec;
    el("runSpeed").textContent = speed.toFixed(1) + " km/h";

    el("t0_1").textContent = secondsToTime(paceSec * 0.1);
    el("t0_4").textContent = secondsToTime(paceSec * 0.4);
    el("t0_8").textContent = secondsToTime(paceSec * 0.8);
    el("t1").textContent   = secondsToTime(paceSec * 1);
    el("t3").textContent   = secondsToTime(paceSec * 3);
    el("t5").textContent   = secondsToTime(paceSec * 5);
    el("t10").textContent  = secondsToTime(paceSec * 10);
    el("t21").textContent  = secondsToTime(paceSec * 21.097);
    el("t42").textContent  = secondsToTime(paceSec * 42.195);
  }

  function updateSlider() {
    const sec = Number(el("runSlider").value);
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    el("runPace").value = `${m}:${String(s).padStart(2,"0")}`;
    updateRun();
  }

  el("runPace").addEventListener("input", updateRun);
  el("runSlider").addEventListener("input", updateSlider);

  updateRun();
}



// --- BIKE+ LOGIC ---
function initBikePlusLogic() {
  const el = id => document.getElementById(id);

  function bikeFormatTime(hours) {
    const h = Math.floor(hours);
    const m = Math.floor((hours - h) * 60);
    const s = Math.round(((hours - h) * 60 - m) * 60);
    return `${h}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  }

  function updateBikePlus() {
    const speed = parseFloat(el("bikePlusSpeed").value);
    if (!speed) return;

    el("b90").textContent  = bikeFormatTime(90 / speed);
    el("b180").textContent = bikeFormatTime(180 / speed);
  }

  el("bikePlusSpeed").addEventListener("input", e => {
    el("bikePlusSlider").value = e.target.value;
    updateBikePlus();
  });

  el("bikePlusSlider").addEventListener("input", e => {
    el("bikePlusSpeed").value = e.target.value;
    updateBikePlus();
  });

  updateBikePlus();
}
