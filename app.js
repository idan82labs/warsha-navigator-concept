/* Warsha · Weitzen — Immigration Navigator · "The Compass"
   Vanilla controller: hash-routed state machine + View Transitions morph +
   deterministic free-text matcher + he/en i18n + the live compass instrument
   (intro seal, needle seek/idle, typewriter, magnetic, radial need-headings).
   See index.html head comment for the design system + content disclaimer. */

'use strict';

/* ───────────────────────── content: the 6 tracks ───────────────────────── */
const TRACKS = {
  relationship: {
    he: { tag:'זוגיות בינלאומית', short:'זוגיות', title:'איחוד משפחות והסדרת מעמד לבן/בת הזוג',
      time:'12–24 חודשים', fit:'strong',
      fitNote:'התיק חזק כשיש תיעוד רציף של הקשר — מגורים, כלכלה ותקשורת משותפים.',
      docs:['דרכונים ותעודות זהות','הוכחות לקשר זוגי אמיתי ומתמשך','תעודות מצב אישי מהמדינה הזרה'] },
    en: { tag:'International couple', short:'Couple', title:'Family unification & status for your partner',
      time:'12–24 months', fit:'strong',
      fitNote:'Strongest when the relationship is documented continuously — shared home, finances and contact.',
      docs:['Passports & ID documents','Evidence of a genuine, ongoing relationship','Foreign marital-status certificates'] },
  },
  relocation: {
    he: { tag:'רילוקיישן', short:'רילוקיישן', title:'הסדרת מעמד ומסלול כניסה ליעד',
      time:'1–3 חודשים', fit:'moderate',
      fitNote:'מהיר יחסית כשיש חוזה העסקה או הוכחת אמצעים מסודרת מראש.',
      docs:['חוזה העסקה או הוכחת אמצעים','דרכון בתוקף','אישורים מהיעד (לפי המדינה)'] },
    en: { tag:'Relocation', short:'Relocation', title:'Status regulation & a clean route into your destination',
      time:'1–3 months', fit:'moderate',
      fitNote:'Faster when an employment contract or proof of means is arranged up front.',
      docs:['Employment contract or proof of means','Valid passport','Destination-country approvals'] },
  },
  refusal: {
    he: { tag:'סירוב ויזה', short:'סירוב ויזה', title:'ערר וערעור על סירוב — לפני שחלון הזמן נסגר',
      time:'30–90 יום · חלון הערר קצר', fit:'moderate',
      fitNote:'הסיכוי תלוי בעילת הסירוב — נתחיל בקריאת מכתב הסירוב ונבנה מענה ממוקד.',
      docs:['מכתב הסירוב המקורי','המסמכים שהוגשו בבקשה המקורית','ראיות תומכות חדשות'] },
    en: { tag:'Visa refusal', short:'Refusal', title:'Appeal a refusal — before the window closes',
      time:'30–90 days · short appeal window', fit:'moderate',
      fitNote:'Outcome hinges on the refusal grounds — we start by reading the refusal letter and build a targeted response.',
      docs:['The original refusal letter','Documents from the original application','New supporting evidence'] },
  },
  work: {
    he: { tag:'אשרת עבודה', short:'אשרת עבודה', title:'היתר העסקה ואשרת מומחה זר (B/1)',
      time:'1–3 חודשים', fit:'strong',
      fitNote:'חזק כשיש מעסיק תומך וכישורים מתועדים — נטפל גם בצד המעסיק.',
      docs:['בקשת מעסיק והצדקת התפקיד','הוכחת השכלה וניסיון','דרכון בתוקף'] },
    en: { tag:'Work visa', short:'Work visa', title:'Employment permit & foreign-expert visa (B/1)',
      time:'1–3 months', fit:'strong',
      fitNote:'Strong with a supporting employer and documented expertise — we handle the employer side too.',
      docs:['Employer petition & role justification','Proof of education & experience','Valid passport'] },
  },
  parents: {
    he: { tag:'הורים מבוגרים', short:'הורים', title:'הבאת הורה מבוגר — מסלול הומניטרי/איחוד',
      time:'משתנה · נדרשת הערכה פרטנית', fit:'complex',
      fitNote:'מסלול מורכב מטבעו — נבחן תלות, מצב רפואי ונסיבות, ונאמר לכם בכנות מה הסיכוי.',
      docs:['הוכחת תלות וקשר','מסמכים רפואיים','אסמכתאות על היעדר תמיכה במדינת המוצא'] },
    en: { tag:'Elderly parents', short:'Parents', title:'Bringing an aging parent — humanitarian / unification',
      time:'Varies · individual assessment needed', fit:'complex',
      fitNote:'A genuinely complex track — we assess dependence, medical status and circumstances, and tell you honestly where it stands.',
      docs:['Proof of dependence & relationship','Medical documentation','Evidence of no support in the origin country'] },
  },
  asylum: {
    he: { tag:'מקלט מדיני', short:'מקלט מדיני', title:'בקשת מקלט ופליטות — בדיסקרטיות מלאה',
      time:'הליך ממושך', fit:'complex',
      fitNote:'כל פנייה חסויה. עו״ד אסף וייצן ניהל את מחלקת הפליטים — תקבלו יחס אנושי, ללא שיפוט.',
      docs:['עדות אישית מפורטת','ראיות לרדיפה או סכנה','כל מסמך מהליך קודם, אם קיים'] },
    en: { tag:'Political asylum', short:'Asylum', title:'Asylum & refugee claims — in full confidence',
      time:'Extended process', fit:'complex',
      fitNote:'Every approach is confidential. Adv. Asaf Weitzen ran the refugee dept — you get a human, non-judgmental hearing.',
      docs:['A detailed personal account','Evidence of persecution or danger','Any prior-process documents, if any'] },
  },
};

const NEED_ORDER = ['relationship','relocation','refusal','work','parents','asylum'];
/* bearing of each heading on the compass (deg clockwise from north) */
const NEED_BEARING = { relationship:30, relocation:90, refusal:150, work:210, parents:270, asylum:330 };

/* ───────────────────────── i18n (UI chrome) ───────────────────────── */
const I18N = {
  he: {
    brand:'ורשה', brand2:'וייצן', brandsub:'Immigration Law', lockname:'תומר ורשה · אסף וייצן',
    eyebrow:'המנווט להגירה',
    h1a:'מסע ההגירה שלכם', h1b:'מתחיל ב', h1c:'שאלה אחת',
    go:'בנו לי מסלול', analyzing:'מנתח…',
    m_conf:'ללא התחייבות · הכול נשאר בינינו', m_rank:'Dun’s 100 בהגירה',
    rkicker:'המסלול שזוהה', c_time:'לוח זמנים משוער', c_docs:'מסמכים מרכזיים', c_fit:'התאמת התיק',
    back:'חזרה', cta_call:'דברו עם עו״ד עכשיו', cta_wa:'או בוואטסאפ',
    disc:'ההערכות לעיל כלליות ומיועדות להתמצאות בלבד — אינן ייעוץ משפטי או התחייבות לתוצאה. תמונה מלאה — רק לאחר פגישת ייעוץ.',
    s_rank:'Dun’s 100 להגירה', s_years:'שנות ניסיון', s_lawyers:'עורכי דין למעמד', s_langs:'שפות שירות', trusted:'לקוחות הפירמה', logos_hint:'לחצו לצבע',
    final_h1:'מוכנים להתחיל? בחירה בנו היא בחירה ב', final_h2:'עתיד בטוח.',
    final_p:'23 שנה שאנחנו לוקחים את המקרים שאחרים אומרים עליהם "אי אפשר". בואו נתחיל בשיחה.',
    final_call:'03-561-5845', final_mail:'office@warsha-adv.com', addr:'רח׳ ריב״ל 18, תל אביב',
    bar_call:'חייגו עכשיו', bar_wa:'וואטסאפ',
    fit_strong:'התאמה גבוהה', fit_moderate:'התאמה חלקית', fit_complex:'תיק מורכב — נדרשת בדיקה',
    echo_lead:'הבנו:', echo_manual:'בחרתם:', echo_country:'מ־',
    err_nomatch:'לא הצלחנו לזהות במדויק — בחרו כיוון מהמצפן, או נסחו מחדש.',
    ph:['אני אזרחית ישראלית ובן הזוג שלי מארגנטינה',
        'קיבלתי הצעת עבודה בהייטק ואין לי אשרה',
        'הבקשה שלי לוויזה נדחתה — צריך לערער',
        'אני רוצה להביא הורה מבוגר לישראל'],
  },
  en: {
    brand:'Warsha', brand2:'Weitzen', brandsub:'Immigration Law', lockname:'Tomer Warsha · Asaf Weitzen',
    eyebrow:'The immigration navigator',
    h1a:'Your immigration journey', h1b:'begins with ', h1c:'one question',
    go:'Map my route', analyzing:'Analyzing…',
    m_conf:'No commitment · fully confidential', m_rank:'#1 on Dun’s 100',
    rkicker:'Your matched route', c_time:'Estimated timeline', c_docs:'Key documents', c_fit:'Case fit',
    back:'Back', cta_call:'Talk to a lawyer now', cta_wa:'or on WhatsApp',
    disc:'The estimates above are general orientation only — not legal advice or a guarantee of outcome. A complete picture requires a consultation.',
    s_rank:'on Dun’s 100 immigration', s_years:'years of practice', s_lawyers:'status attorneys', s_langs:'service languages', trusted:'Firm clients', logos_hint:'Tap for colour',
    final_h1:'Ready to begin? Choosing us is choosing ', final_h2:'a future you can count on.',
    final_p:'For 23 years we’ve taken the cases others call impossible. Let’s start with a conversation.',
    final_call:'+972-3-561-5845', final_mail:'office@warsha-adv.com', addr:'18 Rival St, Tel Aviv',
    bar_call:'Call now', bar_wa:'WhatsApp',
    fit_strong:'Strong fit', fit_moderate:'Partial fit', fit_complex:'Complex — needs review',
    echo_lead:'We understood:', echo_manual:'You chose:', echo_country:'from ',
    err_nomatch:'We couldn’t pin it down — pick a heading on the compass, or rephrase.',
    ph:['I’m an Israeli citizen and my partner is from Argentina',
        'I got a tech job offer and have no visa',
        'My visa application was refused — I need to appeal',
        'I want to bring an aging parent to Israel'],
  },
};

/* ───────────────────────── free-text matcher ─────────────────────────
   Deterministic keyword/intent scorer over HE+EN+translit. LLM upgrade path:
   replace matchQuery() with the firm's OpenAI key (Responses API,
   gpt-5.4-mini) returning {track,country,confidence}; keep this as fallback. */
const SIGNALS = [
  ['relationship', ['בן זוג','בת זוג','בן הזוג','בת הזוג','בני זוג','נישוא','חתונה','ידוע','ידועים בציבור','זוגי','partner','spouse','wife','husband','married','marry','girlfriend','boyfriend','fianc']],
  ['refusal',      ['סירוב','סורב','נדחה','דחיי','דחתה','ערר','ערעור','refus','denied','denial','rejected','appeal','overturn']],
  ['work',         ['עבודה','מועסק','מעסיק','מומחה','העסק','שכר','הייטק','b/1','b1','work','employ','job','expert','permit','hire','salary','tech','offer']],
  ['parents',      ['הור','אמא','אבא','סבא','סבתא','מבוגר','קשיש','סיעוד','parent','mother','father','elderly','aging','grandparent']],
  ['asylum',       ['מקלט','פליט','רדיפ','סכנה','בקשת מקלט','asylum','refugee','persecut','danger','flee']],
  ['relocation',   ['רילוקיישן','רילוקשיין','מעבר','עוברים','להגר','להעתיק','relocat','move','moving','immigrat','aliyah','relocation']],
];
const COUNTRIES = [
  ['ארגנטינה','Argentina'],['ארה"ב','the US'],['ארהב','the US'],['אמריקה','the US'],
  ['רוסיה','Russia'],['אוקראינה','Ukraine'],['צרפת','France'],['גרמניה','Germany'],
  ['אנגליה','the UK'],['בריטניה','the UK'],['קנדה','Canada'],['ברזיל','Brazil'],
  ['הודו','India'],['סין','China'],['פיליפינים','the Philippines'],['תאילנד','Thailand'],
  ['ניגריה','Nigeria'],['אתיופיה','Ethiopia'],['אריתריאה','Eritrea'],['קולומביה','Colombia'],
  ['מקסיקו','Mexico'],['ספרד','Spain'],['איטליה','Italy'],['פולין','Poland'],['מולדובה','Moldova'],
];
const COUNTRIES_EN = ['argentina','united states','usa','u.s','russia','ukraine','france','germany','uk','britain','england','canada','brazil','india','china','philippines','thailand','nigeria','ethiopia','eritrea','colombia','mexico','spain','italy','poland','moldova'];

function normalize(s){ return (s||'').toLowerCase().normalize('NFKD').replace(/[֑-ׇ]/g,'').replace(/[‎‏]/g,'').trim(); }
function matchQuery(raw){
  const q = normalize(raw);
  if (!q) return null;
  const score = Object.create(null);
  for (const [track, terms] of SIGNALS){ for (const t of terms){ if (q.includes(normalize(t))) score[track] = (score[track]||0) + 1; } }
  let country = null;
  for (const [he,en] of COUNTRIES){ if (q.includes(normalize(he))){ country = en; break; } }
  if (!country){ for (const c of COUNTRIES_EN){ if (q.includes(c)){ country = c.replace(/\b\w/g,m=>m.toUpperCase()); break; } } }
  if (country && !Object.keys(score).length) score.relationship = 1;
  const ranked = Object.entries(score).sort((a,b)=>b[1]-a[1]);
  if (!ranked.length) return { track:null, country };
  return { track: ranked[0][0], country, confident: ranked.length===1 || ranked[0][1] > ranked[1][1] };
}

/* ───────────────────────── state + helpers ───────────────────────── */
const root = document.documentElement;
const state = { view:'hero', need:null, country:null, source:'manual', lang:'he' };
const $ = (s,el=document)=>el.querySelector(s);
const $$ = (s,el=document)=>[...el.querySelectorAll(s)];
const RM = matchMedia('(prefers-reduced-motion: reduce)');
const FINE = matchMedia('(pointer: fine)');
const mouse = { x:-999, y:-999 };
const reduce = ()=>RM.matches;
function t(key){ return (I18N[state.lang] && I18N[state.lang][key]) || I18N.he[key] || key; }

/* ───────────────────────── compass ───────────────────────── */
const SVGNS = 'http://www.w3.org/2000/svg';
function buildTicks(){
  const g = $('#ticks'); if (!g) return;
  g.innerHTML = '';
  for (let deg=0; deg<360; deg+=6){
    const major = deg % 30 === 0;
    const r0 = 161, len = major ? 11 : 5;
    const ln = document.createElementNS(SVGNS,'line');
    ln.setAttribute('x1',200); ln.setAttribute('y1',200 - r0);
    ln.setAttribute('x2',200); ln.setAttribute('y2',200 - (r0 - len));
    ln.setAttribute('stroke', major ? 'rgba(227,192,122,.75)' : 'rgba(227,192,122,.28)');
    ln.setAttribute('stroke-width', major ? 1.5 : 0.8);
    ln.setAttribute('transform', `rotate(${deg} 200 200)`);
    g.appendChild(ln);
  }
}

/* needle: eased seek toward a target bearing; gentle idle wobble otherwise */
const needle = { cur:0, target:0, idle:true, hold:0, raf:0 };
function setNeedle(deg){ needle.target = deg; needle.idle = false; needle.hold = performance.now() + 2600; }
function releaseNeedle(){ needle.hold = performance.now(); }
function needleTick(now){
  if (!needle.idle && now > needle.hold) needle.idle = true;
  let target = needle.target;
  if (needle.idle) target = 9 * Math.sin(now/2100);     // calm ±9° drift
  // shortest-path interpolation
  let d = ((target - needle.cur + 540) % 360) - 180;
  needle.cur += d * 0.12;
  const el = $('#needle'); if (el) el.style.setProperty('--ndl', needle.cur.toFixed(2)+'deg');
  needle.raf = requestAnimationFrame(needleTick);
}

/* ───────────────────────── need headings ───────────────────────── */
function buildNeeds(){
  const host = $('#needs'); if (!host) return;
  host.innerHTML = '';
  NEED_ORDER.forEach((key)=>{
    const tk = TRACKS[key][state.lang];
    const b = document.createElement('button');
    b.type='button'; b.className='need'; b.dataset.need = key;
    b.style.setProperty('--a', NEED_BEARING[key]+'deg'); // 0deg = north (matches needle bearing)
    b.innerHTML = `<span class="pip" aria-hidden="true"></span><span>${tk.short}</span>`;
    b.setAttribute('aria-label', tk.tag);
    b.addEventListener('click', ()=>choose(key,'manual'));
    if (FINE.matches){
      b.addEventListener('pointerenter', ()=>{ lightNeed(key); setNeedle(NEED_BEARING[key]); });
      b.addEventListener('pointerleave', ()=>{ lightNeed(null); releaseNeedle(); });
    }
    b.addEventListener('focus', ()=>{ lightNeed(key); setNeedle(NEED_BEARING[key]); });
    b.addEventListener('blur', ()=>{ lightNeed(null); releaseNeedle(); });
    host.appendChild(b);
  });
  positionNeeds();
}
function lightNeed(key){ $$('#needs .need').forEach(b=>b.classList.toggle('lit', b.dataset.need===key)); }
function positionNeeds(){
  const inst = $('#instrument'); if (!inst) return;
  if (!FINE.matches && window.matchMedia('(max-width:979px)').matches){ inst.style.removeProperty('--r'); return; }
  const r = inst.clientWidth * 0.53;
  $$('#needs .need').forEach(b=>b.style.setProperty('--r', r+'px'));
}

/* ───────────────────────── i18n + lang ───────────────────────── */
function moveThumb(){
  const seg = $('.seg'), thumb = $('.seg .thumb'); if (!seg||!thumb) return;
  const active = $(`.seg button[aria-pressed="true"]`); if (!active) return;
  thumb.style.width = active.offsetWidth+'px';
  thumb.style.transform = `translateX(${active.offsetLeft - 4}px)`;
}
function applyLang(){
  root.lang = state.lang; root.dir = state.lang==='he'?'rtl':'ltr'; root.dataset.lang = state.lang;
  $$('[data-i18n]').forEach(el=>{ const k=el.getAttribute('data-i18n'); if (I18N[state.lang][k]!=null) el.textContent = I18N[state.lang][k]; });
  $$('[data-lang-btn]').forEach(b=>b.setAttribute('aria-pressed', String(b.dataset.langBtn===state.lang)));
  buildNeeds(); moveThumb(); resetTypewriter();
  if (state.view==='result' && state.need) paintResult();
}

/* ───────────────────────── typewriter placeholder ───────────────────────── */
const tw = { i:0, c:0, del:false, timer:0 };
function resetTypewriter(){ clearTimeout(tw.timer); tw.i=0; tw.c=0; tw.del=false; runTypewriter(); }
function runTypewriter(){
  const ghost = $('#navGhost'), input = $('#navInput'); if (!ghost||!input) return;
  const phrases = I18N[state.lang].ph;
  if (input.value || document.activeElement===input || document.hidden){
    ghost.style.display = input.value ? 'none' : 'flex';
    if (!input.value && (document.activeElement===input)) ghost.innerHTML = esc(phrases[0]); // static while focused/empty
    tw.timer = setTimeout(runTypewriter, 400); return;
  }
  ghost.style.display='flex';
  if (reduce()){ ghost.innerHTML = esc(phrases[0]) + '<span class="caret"></span>'; return; }
  const p = phrases[tw.i];
  if (!tw.del){ tw.c++; if (tw.c>=p.length){ tw.del=true; tw.timer=setTimeout(runTypewriter,1900); ghost.innerHTML=esc(p)+'<span class="caret"></span>'; return; } }
  else { tw.c--; if (tw.c<=0){ tw.del=false; tw.i=(tw.i+1)%phrases.length; } }
  ghost.innerHTML = esc(p.slice(0,tw.c)) + '<span class="caret"></span>';
  tw.timer = setTimeout(runTypewriter, tw.del ? 24 : (40 + Math.random()*30));
}
function esc(s){ return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

/* ───────────────────────── result ───────────────────────── */
function paintResult(){
  const tk = TRACKS[state.need][state.lang];
  $('#crumbPill').textContent = tk.tag;
  $('#r-title').textContent = tk.title;
  $('#rTime').textContent = tk.time;
  $('#rDocs').innerHTML = tk.docs.map(d=>`<li>${d}</li>`).join('');
  const FILL = { strong:84, moderate:62, complex:40 };
  const ring = $('#rRing'), target = FILL[tk.fit] || 50;
  ring.style.setProperty('--p', 0);
  if (reduce()) ring.style.setProperty('--p', target);
  else requestAnimationFrame(()=>requestAnimationFrame(()=>ring.style.setProperty('--p', target)));
  $('#rFitLbl').textContent = t('fit_'+tk.fit);
  $('#rFitNote').textContent = tk.fitNote;
  let echo;
  if (state.source==='nav'){
    // isolate the Latin country name so it never reorders inside the RTL run
    const from = state.country ? ` · <bdi dir="ltr">${state.country}</bdi>` : '';
    echo = `<b>${t('echo_lead')}</b> ${tk.tag}${from}`;
  } else { echo = `<b>${t('echo_manual')}</b> ${tk.tag}`; }
  $('#rEcho').innerHTML = echo;
}

function commit(){
  const apply = ()=>{
    root.dataset.view = state.view;
    if (state.view==='result'){
      paintResult();
      requestAnimationFrame(()=>{ const h=$('#r-title'); h&&h.focus({preventScroll:true}); window.scrollTo({top:0,behavior:'instant' in document.body.style?'instant':'auto'}); });
    } else { requestAnimationFrame(()=>{ const h=$('#hero-h1'); h&&h.focus({preventScroll:true}); }); }
  };
  if (!reduce() && document.startViewTransition) document.startViewTransition(apply); else apply();
}
function choose(need, source){
  state.need = need; state.source = source||'manual'; state.view='result';
  const hash = `#/route?need=${need}` + (state.country?`&from=${encodeURIComponent(state.country)}`:'');
  if (location.hash !== hash) history.pushState({need,source}, '', hash);
  commit();
}
function goHero(push){
  state.view='hero'; state.need=null; state.country=null;
  if (push && location.hash) history.pushState({}, '', location.pathname + location.search);
  commit();
}

/* navigator submit */
function onNav(e){
  e.preventDefault();
  const val = $('#navInput').value;
  const btn = $('#navForm .nav-go');
  const goSpan = btn.querySelector('[data-i18n="go"]');
  const resolve = ()=>{
    btn.removeAttribute('aria-busy'); if (goSpan) goSpan.textContent = t('go');
    const m = matchQuery(val);
    if (!m || !m.track){
      $('#navHint').textContent = t('err_nomatch');
      releaseNeedle();
      $('#instrument').scrollIntoView({behavior: reduce()?'auto':'smooth', block:'center'});
      return;
    }
    state.country = m.country || null;
    setNeedle(NEED_BEARING[m.track]);
    choose(m.track, 'nav');
  };
  btn.setAttribute('aria-busy','true'); if (goSpan) goSpan.textContent = t('analyzing');
  // a brief "instrument seeking" beat before locking
  const guess = matchQuery(val);
  if (guess && guess.track && !reduce()) setNeedle(NEED_BEARING[guess.track]);
  if (reduce()) resolve(); else setTimeout(resolve, 460);
}

/* live needle reaction while typing */
let liveT = 0;
function onType(){
  const ghost = $('#navGhost'); if (ghost) ghost.style.display = $('#navInput').value ? 'none' : 'flex';
  $('#navHint').textContent = '';
  clearTimeout(liveT);
  liveT = setTimeout(()=>{
    const m = matchQuery($('#navInput').value);
    if (m && m.track){ setNeedle(NEED_BEARING[m.track]); lightNeed(m.track); }
    else { lightNeed(null); releaseNeedle(); }
  }, 130);
}

/* ───────────────────────── magnetic buttons (pointer:fine) ───────────────────────── */
function initMagnetic(){
  if (!FINE.matches || reduce()) return;
  $$('[data-magnetic]').forEach(el=>{
    const s = parseFloat(el.dataset.magnetic)||0.3;
    el.addEventListener('pointermove', e=>{
      const r = el.getBoundingClientRect();
      const dx=(e.clientX-(r.left+r.width/2))*s, dy=(e.clientY-(r.top+r.height/2))*s;
      el.style.transition='transform .08s ease-out'; el.style.transform=`translate(${dx}px,${dy}px)`;
    });
    el.addEventListener('pointerleave', ()=>{ el.style.transition='transform .5s cubic-bezier(.34,1.5,.64,1)'; el.style.transform='translate(0,0)'; });
  });
}

/* ───────────────────────── constellation (reactive bg) ─────────────────────────
   A celestial-navigation starfield behind the glass: points drift, link to near
   neighbours, and connect/light to the cursor. Desktop + motion only; pauses
   when the tab is hidden. */
function initConstellation(){
  const cv = document.getElementById('stars'); if (!cv) return;
  const ctx = cv.getContext('2d'); const DPR = Math.min(devicePixelRatio||1, 2);
  let W=0,H=0,pts=[],raf=0,running=true;
  function resize(){
    W=innerWidth; H=innerHeight; cv.width=W*DPR; cv.height=H*DPR; ctx.setTransform(DPR,0,0,DPR,0,0);
    const n=Math.min(88, Math.round(W*H/16500));
    pts=Array.from({length:n},()=>({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.12,vy:(Math.random()-.5)*.12,r:Math.random()*1.3+.4}));
  }
  function step(){
    ctx.clearRect(0,0,W,H);
    for(const p of pts){ p.x+=p.vx; p.y+=p.vy; if(p.x<0||p.x>W)p.vx*=-1; if(p.y<0||p.y>H)p.vy*=-1;
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,6.2832); ctx.fillStyle='rgba(227,192,122,.5)'; ctx.fill(); }
    for(let i=0;i<pts.length;i++){ for(let j=i+1;j<pts.length;j++){
      const a=pts[i],b=pts[j],dx=a.x-b.x,dy=a.y-b.y,d=dx*dx+dy*dy;
      if(d<13000){ ctx.strokeStyle='rgba(227,192,122,'+((1-d/13000)*.14).toFixed(3)+')'; ctx.lineWidth=.6;
        ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke(); } } }
    if(mouse.x>0){ for(const p of pts){ const dx=p.x-mouse.x,dy=p.y-mouse.y,d=dx*dx+dy*dy;
      if(d<42000){ ctx.strokeStyle='rgba(243,215,140,'+((1-d/42000)*.5).toFixed(3)+')'; ctx.lineWidth=.7;
        ctx.beginPath(); ctx.moveTo(p.x,p.y); ctx.lineTo(mouse.x,mouse.y); ctx.stroke(); } } }
    if(running) raf=requestAnimationFrame(step);
  }
  resize(); addEventListener('resize', resize);
  document.addEventListener('visibilitychange', ()=>{ running=!document.hidden; if(running){ step(); } else cancelAnimationFrame(raf); });
  step();
}

/* ───────────────────────── routing + boot ───────────────────────── */
function readHash(){
  const h = location.hash || '';
  const qs = h.includes('?') ? new URLSearchParams(h.slice(h.indexOf('?')+1)) : new URLSearchParams();
  const need = qs.get('need');
  if (h.startsWith('#/route') && need && TRACKS[need]){
    state.need=need; state.country=qs.get('from')||null;
    state.source = qs.get('from') ? 'nav' : (state.source==='nav'?'nav':'manual'); state.view='result';
  } else { state.view='hero'; state.need=null; }
}

function init(){
  try{ const s=localStorage.getItem('ww.lang'); if (s==='en'||s==='he') state.lang=s; }catch(_){}
  buildTicks();
  applyLang();
  readHash();
  root.dataset.view = state.view;
  if (state.view==='result') paintResult();

  // intro seal → light up (rings draw + content reveal); safety fallback
  requestAnimationFrame(()=>document.body.classList.add('lit'));
  setTimeout(()=>document.body.classList.add('lit'), 2400);

  // needle loop
  if (reduce()){ const el=$('#needle'); if(el) el.style.setProperty('--ndl','0deg'); }
  else needle.raf = requestAnimationFrame(needleTick);

  // typewriter
  runTypewriter();
  document.addEventListener('visibilitychange', ()=>{ if(!document.hidden) resetTypewriter(); });

  // events
  $('#navForm').addEventListener('submit', onNav);
  $('#navInput').addEventListener('input', onType);
  $('#navInput').addEventListener('focus', ()=>{ const g=$('#navGhost'); if(g&&!$('#navInput').value) g.innerHTML=esc(I18N[state.lang].ph[0]); });
  $('#navInput').addEventListener('blur', resetTypewriter);
  $('#backBtn').addEventListener('click', ()=>history.back());
  $$('[data-lang-btn]').forEach(b=>b.addEventListener('click', ()=>{
    state.lang=b.dataset.langBtn; try{ localStorage.setItem('ww.lang',state.lang);}catch(_){}
    applyLang();
  }));
  window.addEventListener('popstate', ()=>{ readHash(); commit(); });
  window.addEventListener('resize', ()=>{ positionNeeds(); moveThumb(); });

  // client logos: greyscale → colour on click (toggle)
  const logos = $('#logos');
  if (logos) logos.addEventListener('click', e=>{ const b=e.target.closest('.cl-logo'); if(b) b.classList.toggle('on'); });

  // scroll chrome + reactive background (cursor-lit grid, parallax) + constellation
  addEventListener('scroll', ()=>document.body.classList.toggle('scrolled', scrollY>8), {passive:true});
  if (FINE.matches && !reduce()){
    addEventListener('pointermove', e=>{
      const x=e.clientX, y=e.clientY; mouse.x=x; mouse.y=y;
      root.style.setProperty('--mx', x+'px'); root.style.setProperty('--my', y+'px');
      root.style.setProperty('--px', ((x/innerWidth-0.5)*-16).toFixed(1)+'px');
      root.style.setProperty('--py', ((y/innerHeight-0.5)*-16).toFixed(1)+'px');
    }, {passive:true});
    initConstellation();
  }
  initMagnetic();
}

if (document.readyState==='loading') document.addEventListener('DOMContentLoaded', init); else init();
