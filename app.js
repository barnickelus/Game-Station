const games=[
  {
    id:'genesis2',title:'Genesis Evolution',category:'Science',duration:'Open world',repo:'Genesis-game2',plays:'Featured',symbol:'🧬',
    url:'https://barnickelus.github.io/Genesis-game2/',source:'https://github.com/barnickelus/Genesis-game2',
    description:'Begin as a living organism, gather mass, survive predators, and choose adaptations that change how your creature moves and survives.',
    colors:'linear-gradient(135deg,#041824,#056f75 48%,#2dd9a3)',
    discoveries:[['🧬','Adaptation','Traits trade speed, defense, perception, and energy.'],['🌱','Food webs','Small survival choices ripple through an ecosystem.'],['⚖️','Tradeoffs','Evolution rewards fit—not a single perfect form.']]
  },
  {
    id:'starfrenzy',title:'Star-Frenzy',category:'Science',duration:'3–10 min',repo:'3dpixel',plays:'Arcade',symbol:'🐉',
    url:'https://barnickelus.github.io/3dpixel/',source:'https://github.com/barnickelus/3dpixel',
    description:'Steer an evolving cosmic organism through a neon ecosystem, collect energy, unlock radar, and evade increasingly dangerous predators.',
    colors:'linear-gradient(135deg,#150a38,#6d1fa8 52%,#00b4d8)',
    discoveries:[['🧭','Spatial memory','Use landmarks and radar to navigate a larger world.'],['📈','Scaling systems','Growth changes speed, risk, and resource needs.'],['🕷️','Predator pressure','Enemy behavior reshapes your route and strategy.']]
  },
  {
    id:'spermracer',title:'Microsprint 64',category:'Arcade',duration:'2–5 min',repo:'Sperm-Racer',plays:'Racing',symbol:'🏁',
    url:'https://barnickelus.github.io/Sperm-Racer/',source:'https://github.com/barnickelus/Sperm-Racer',
    description:'A fast, touch-friendly microscopic racer with drifting, items, rivals, lap strategy, and a stylized car-radio interface.',
    colors:'linear-gradient(135deg,#092d34,#0b887b 52%,#ffb44a)',
    discoveries:[['🏎️','Racing lines','Momentum and turning angle shape the fastest route.'],['🧠','Reaction time','Read hazards while planning several turns ahead.'],['🎲','Risk and reward','Items can protect a lead or create a comeback.']]
  },
  {
    id:'fpsman',title:'FPS-MAN',category:'Creative',duration:'2–4 min',repo:'Pacman',plays:'Maze',symbol:'👁️',
    url:'https://barnickelus.github.io/Pacman/',source:'https://github.com/barnickelus/Pacman',
    description:'Explore a retro maze from a first-person perspective and learn how a simple 2D grid becomes a convincing 3D world through raycasting.',
    colors:'linear-gradient(135deg,#07132e,#063e8f 48%,#00f2ff)',
    discoveries:[['📐','Raycasting','A field of distance checks can create a 3D illusion.'],['🗺️','Mental maps','Build an internal map from corridors and turns.'],['💾','Retro engines','Early 3D games used clever limits instead of huge models.']]
  },
  {
    id:'geovoxel',title:'GeoVoxel',category:'Worlds',duration:'Explore',repo:'geovoxel',plays:'Simulation',symbol:'🏙️',
    url:'https://barnickelus.github.io/geovoxel/',source:'https://github.com/barnickelus/geovoxel',
    description:'Stream real map geometry into an explorable voxel world, with nearby areas rendered in greater detail than distant terrain.',
    colors:'linear-gradient(135deg,#071b2b,#0b5976 50%,#78d8be)',
    discoveries:[['🧊','Voxels','Continuous geography can be translated into discrete blocks.'],['🔭','Level of detail','Distance controls how much geometry the device must draw.'],['🗺️','Open map data','Shared geographic data can power new kinds of worlds.']]
  },
  {
    id:'neonfrenzy',title:'Neon Frenzy',category:'Arcade',duration:'3–8 min',repo:'lifegame',plays:'Classic build',symbol:'🟣',
    url:'https://barnickelus.github.io/lifegame/',source:'https://github.com/barnickelus/lifegame',
    description:'An earlier Genesis arcade build focused on mass, pursuit, frenzy bonuses, titans, spectres, and survival across a large neon field.',
    colors:'linear-gradient(135deg,#100426,#52006f 48%,#00e4b8)',
    discoveries:[['♻️','Iteration','Compare an early system with its later redesigns.'],['🎚️','Difficulty curves','New threats appear as player power increases.'],['✨','Feedback loops','Bonuses and risk can accelerate each other.']]
  }
];
const categories=['For You','Trending','Science','Arcade','Creative','Worlds'];
let currentIndex=0,currentFilter='For You',saved=new Set(JSON.parse(localStorage.getItem('curioplay-saved')||'[]'));
let xp=Number(localStorage.getItem('curioplay-xp')||0),plays=Number(localStorage.getItem('curioplay-plays')||0);
const $=s=>document.querySelector(s);
const stage=$('#stage'),frame=$('#gameFrame'),cover=$('#cover');

function toast(msg){const el=$('#toast');el.textContent=msg;el.classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(()=>el.classList.remove('show'),1800)}
function saveState(){localStorage.setItem('curioplay-saved',JSON.stringify([...saved]));localStorage.setItem('curioplay-xp',xp);localStorage.setItem('curioplay-plays',plays)}
function updateProfile(){const level=Math.floor(xp/300)+1,within=xp%300;$('#level').textContent=level;$('#xp').textContent=xp;$('#xpBar').style.width=(within/3)+'%';$('#streak').textContent=(Math.max(1,Math.min(7,Math.floor(plays/2)+1)))+' day'+(plays>1?'s':'')}
function filteredGames(){const q=$('#searchInput').value.trim().toLowerCase();return games.filter(g=>{
  const categoryOK=currentFilter==='For You'||currentFilter==='Trending'||g.category===currentFilter;
  const qOK=!q||[g.title,g.category,g.repo,g.description].join(' ').toLowerCase().includes(q);
  return categoryOK&&qOK;
})}
function renderTabs(){const wrap=$('#tabs');wrap.innerHTML='';categories.forEach(c=>{const b=document.createElement('button');b.className='tab'+(c===currentFilter?' active':'');b.textContent=c;b.onclick=()=>setFilter(c);wrap.appendChild(b)})}
function renderGrid(mode='normal'){
  let list=mode==='saved'?games.filter(g=>saved.has(g.id)):filteredGames();
  if(currentFilter==='Trending') list=[...list].reverse();
  $('#sectionTitle').textContent=mode==='saved'?'Your saved games':currentFilter==='For You'?'Recommended for you':currentFilter;
  $('#resultCount').textContent=list.length+' game'+(list.length===1?'':'s');
  const grid=$('#gameGrid');grid.innerHTML='';$('#emptyState').style.display=list.length?'none':'block';
  list.forEach(g=>{const card=document.createElement('article');card.className='game-card';card.innerHTML=`
    <div class="thumb" style="--thumb:${g.colors}"><span class="thumb-symbol">${g.symbol}</span><span class="duration">${g.duration}</span></div>
    <button class="save-dot ${saved.has(g.id)?'saved':''}" aria-label="Save ${g.title}">${saved.has(g.id)?'♥':'♡'}</button>
    <div class="card-body"><h3>${g.title}</h3><div class="card-meta"><span>${g.category}</span><span>${g.plays}</span></div></div>`;
    card.onclick=e=>{if(e.target.closest('.save-dot'))return;selectGame(g.id,true)};
    card.querySelector('.save-dot').onclick=()=>toggleSave(g.id);
    grid.appendChild(card);
  })
}
function setFilter(c){currentFilter=c;document.querySelectorAll('[data-view]').forEach(b=>b.classList.remove('active'));document.querySelectorAll('[data-filter]').forEach(b=>b.classList.toggle('active',b.dataset.filter===c));renderTabs();renderGrid()}
function selectGame(id,scroll=false){const i=games.findIndex(g=>g.id===id);if(i<0)return;currentIndex=i;const g=games[i];
  stage.classList.remove('loaded');frame.removeAttribute('src');cover.style.display='flex';cover.style.setProperty('--cover',g.colors);
  $('#heroTitle').textContent=g.title;$('#stageTitleSmall').textContent=g.title;$('#heroDescription').textContent=g.description;$('#heroCategory').textContent=g.category;$('#heroDuration').textContent=g.duration;$('#heroRepo').textContent='github/'+g.repo;$('#openButton').href=g.source;
  $('#saveButton').innerHTML=(saved.has(g.id)?'♥':'♡')+' <span class="save-label">'+(saved.has(g.id)?'Saved':'Save')+'</span>';
  $('#discoveryList').innerHTML=g.discoveries.map(d=>`<div class="discovery"><div class="discovery-icon">${d[0]}</div><div><strong>${d[1]}</strong><span>${d[2]}</span></div></div>`).join('');
  if(scroll)document.querySelector('.hero-grid').scrollIntoView({behavior:'smooth',block:'start'});
}
function playCurrent(){const g=games[currentIndex];frame.src=g.url;stage.classList.add('loaded');cover.style.display='none';plays++;xp+=25;saveState();updateProfile();toast('+25 XP · Playing '+g.title)}
function toggleSave(id=games[currentIndex].id){saved.has(id)?saved.delete(id):saved.add(id);saveState();selectGame(games[currentIndex].id);renderGrid();toast(saved.has(id)?'Saved to your library':'Removed from saved')}
function nextGame(){currentIndex=(currentIndex+1)%games.length;selectGame(games[currentIndex].id);playCurrent()}
function backToCover(){frame.src='about:blank';stage.classList.remove('loaded');cover.style.display='flex'}
function fullscreen(){if(stage.requestFullscreen)stage.requestFullscreen();else if(stage.webkitRequestFullscreen)stage.webkitRequestFullscreen()}

$('#playButton').onclick=playCurrent;$('#nextButton').onclick=nextGame;$('#backButton').onclick=backToCover;$('#saveButton').onclick=()=>toggleSave();$('#fullscreenButton').onclick=fullscreen;
$('#searchInput').addEventListener('input',()=>renderGrid());
document.querySelectorAll('[data-filter]').forEach(b=>b.onclick=()=>setFilter(b.dataset.filter));
document.querySelectorAll('[data-view="saved"]').forEach(b=>b.onclick=()=>{document.querySelectorAll('.nav button,.bottom-nav button').forEach(x=>x.classList.remove('active'));b.classList.add('active');renderGrid('saved')});
document.querySelectorAll('[data-view="home"]').forEach(b=>b.onclick=()=>setFilter('For You'));

$('#adButton').onclick=()=>{const modal=$('#sponsorModal'),btn=$('#closeAd'),text=$('#countdown');modal.classList.add('open');btn.disabled=true;let n=5;text.textContent=`Reward ready in ${n} seconds`;const timer=setInterval(()=>{n--;text.textContent=n?`Reward ready in ${n} seconds`:'Reward unlocked: +100 XP';if(!n){clearInterval(timer);btn.disabled=false}},1000);btn.onclick=()=>{modal.classList.remove('open');xp+=100;saveState();updateProfile();toast('+100 XP · Sponsor reward claimed')}};

let touchY=null;stage.addEventListener('touchstart',e=>touchY=e.changedTouches[0].clientY,{passive:true});stage.addEventListener('touchend',e=>{if(touchY===null)return;const dy=e.changedTouches[0].clientY-touchY;touchY=null;if(dy<-90&&!stage.classList.contains('loaded')){currentIndex=(currentIndex+1)%games.length;selectGame(games[currentIndex].id)}} ,{passive:true});
window.addEventListener('keydown',e=>{if(e.key==='ArrowRight')nextGame();if(e.key==='Escape')backToCover()});
renderTabs();selectGame(games[0].id);renderGrid();updateProfile();
