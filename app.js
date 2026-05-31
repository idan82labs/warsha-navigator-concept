/* Warsha · Weitzen — Immigration Navigator
   No-build vanilla controller: hash-routed state machine + View Transitions
   morph + deterministic free-text matcher + he/en i18n. See index.html head
   comment for the design system + content disclaimer. */

'use strict';

/* ───────────────────────── content: the 6 tracks ─────────────────────────
   "fit" is an orientation label (strong | moderate | complex) shown as a
   range with a visible disclaimer — never a guarantee (Israeli Bar rules). */
const TRACKS = {
  relationship: {
    he: { tag:'זוגיות בינלאומית', title:'איחוד משפחות והסדרת מעמד לבן/בת הזוג',
      time:'12–24 חודשים', fit:'strong',
      fitNote:'התיק חזק כשיש תיעוד רציף של הקשר — מגורים, כלכלה ותקשורת משותפים.',
      docs:['דרכונים ותעודות זהות','הוכחות לקשר זוגי אמיתי ומתמשך','תעודות מצב אישי מהמדינה הזרה'] },
    en: { tag:'International couple', title:'Family unification & status for your partner',
      time:'12–24 months', fit:'strong',
      fitNote:'Strongest when the relationship is documented continuously — shared home, finances and contact.',
      docs:['Passports & ID documents','Evidence of a genuine, ongoing relationship','Foreign marital-status certificates'] },
  },
  relocation: {
    he: { tag:'רילוקיישן', title:'הסדרת מעמד ומסלול כניסה ליעד',
      time:'1–3 חודשים', fit:'moderate',
      fitNote:'מהיר יחסית כשיש חוזה העסקה או הוכחת אמצעים מסודרת מראש.',
      docs:['חוזה העסקה או הוכחת אמצעים','דרכון בתוקף','אישורים מהיעד (לפי המדינה)'] },
    en: { tag:'Relocation', title:'Status regulation & a clean route into your destination',
      time:'1–3 months', fit:'moderate',
      fitNote:'Faster when an employment contract or proof of means is arranged up front.',
      docs:['Employment contract or proof of means','Valid passport','Destination-country approvals'] },
  },
  refusal: {
    he: { tag:'סירוב ויזה', title:'ערר וערעור על סירוב — לפני שחלון הזמן נסגר',
      time:'30–90 יום · חלון הערר קצר', fit:'moderate',
      fitNote:'הסיכוי תלוי בעילת הסירוב — נתחיל בקריאת מכתב הסירוב ונבנה מענה ממוקד.',
      docs:['מכתב הסירוב המקורי','המסמכים שהוגשו בבקשה המקורית','ראיות תומכות חדשות'] },
    en: { tag:'Visa refusal', title:'Appeal a refusal — before the window closes',
      time:'30–90 days · short appeal window', fit:'moderate',
      fitNote:'Outcome hinges on the refusal grounds — we start by reading the refusal letter and build a targeted response.',
      docs:['The original refusal letter','Documents from the original application','New supporting evidence'] },
  },
  work: {
    he: { tag:'אשרת עבודה', title:'היתר העסקה ואשרת מומחה זר (B/1)',
      time:'1–3 חודשים', fit:'strong',
      fitNote:'חזק כשיש מעסיק תומך וכישורים מתועדים — נטפל גם בצד המעסיק.',
      docs:['בקשת מעסיק והצדקת התפקיד','הוכחת השכלה וניסיון','דרכון בתוקף'] },
    en: { tag:'Work visa', title:'Employment permit & foreign-expert visa (B/1)',
      time:'1–3 months', fit:'strong',
      fitNote:'Strong with a supporting employer and documented expertise — we handle the employer side too.',
      docs:['Employer petition & role justification','Proof of education & experience','Valid passport'] },
  },
  parents: {
    he: { tag:'הורים מבוגרים', title:'הבאת הורה מבוגר — מסלול הומניטרי/איחוד',
      time:'משתנה · נדרשת הערכה פרטנית', fit:'complex',
      fitNote:'מסלול מורכב מטבעו — נבחן תלות, מצב רפואי ונסיבות, ונאמר לכם בכנות מה הסיכוי.',
      docs:['הוכחת תלות וקשר','מסמכים רפואיים','אסמכתאות על היעדר תמיכה במדינת המוצא'] },
    en: { tag:'Elderly parents', title:'Bringing an aging parent — humanitarian / unification',
      time:'Varies · individual assessment needed', fit:'complex',
      fitNote:'A genuinely complex track — we assess dependence, medical status and circumstances, and tell you honestly where it stands.',
      docs:['Proof of dependence & relationship','Medical documentation','Evidence of no support in the origin country'] },
  },
  asylum: {
    he: { tag:'מקלט מדיני', title:'בקשת מקלט ופליטות — בדיסקרטיות מלאה',
      time:'הליך ממושך', fit:'complex',
      fitNote:'כל פנייה חסויה. עו״ד אסף וייצן ניהל את מחלקת הפליטים — תקבלו יחס אנושי, ללא שיפוט.',
      docs:['עדות אישית מפורטת','ראיות לרדיפה או סכנה','כל מסמך מהליך קודם, אם קיים'] },
    en: { tag:'Political asylum', title:'Asylum & refugee claims — in full confidence',
      time:'Extended process', fit:'complex',
      fitNote:'Every approach is confidential. Adv. Asaf Weitzen ran the refugee dept — you get a human, non-judgmental hearing.',
      docs:['A detailed personal account','Evidence of persecution or danger','Any prior-process documents, if any'] },
  },
};

const NEED_ORDER = ['relationship','relocation','refusal','work','parents','asylum'];

/* ───────────────────────── i18n (UI chrome) ───────────────────────── */
const I18N = {
  he: {
    brand:'ורשה', brand2:'וייצן', brandsub:'Immigration Law',
    rank:'מדורגים #1 בהגירה · Dun’s 100',
    h1a:'מסע ההגירה שלכם', h1b:'מתחיל ב', h1c:'שאלה אחת.',
    lede:'ספרו לנו במשפט אחד מה הביא אתכם — ונבנה עבורכם את המסלול: לוח זמנים, מסמכים נדרשים, והצעד הבא.',
    navlabel:'המנווט החכם', ph:'למשל: אני אזרחית ישראלית ובן הזוג שלי מארגנטינה',
    go:'בנו לי מסלול', analyzing:'מנתח…', hint:'ללא טפסים. תשובה מיידית. שיחה עם עו״ד רק כשתבחרו.',
    or:'או בחרו את הצורך',
    rkicker:'המסלול שזוהה', c_time:'לוח זמנים משוער', c_docs:'מסמכים מרכזיים', c_fit:'התאמת התיק',
    back:'חזרה', cta_call:'דברו עם עו״ד עכשיו', cta_wa:'או בוואטסאפ',
    disc:'ההערכות לעיל הן כלליות ומיועדות להתמצאות בלבד — אינן מהוות ייעוץ משפטי או התחייבות לתוצאה. כל תיק נבחן לגופו.',
    proof_lead:'למה בוחרים בנו', s_years:'שנות מומחיות', s_lawyers:'עורכי דין למעמד והגירה',
    s_rank:'בדירוג Dun’s 100', s_langs:'שפות שירות', trusted:'בין לקוחותינו',
    final_h:'בחירה בנו היא בחירה בביטחון, במקצוענות, ובעתיד בטוח.',
    final_p:'23 שנה שאנחנו לוקחים את המקרים שאחרים אומרים עליהם "אי אפשר". בואו נתחיל בשיחה.',
    final_call:'053-491-1336', final_mail:'office@warsha-adv.com', addr:'רח׳ ריב״ל 18, תל אביב',
    bar_call:'חייגו עכשיו', bar_wa:'וואטסאפ',
    fit_strong:'התאמה גבוהה', fit_moderate:'התאמה בינונית', fit_complex:'מורכב — נדרשת בדיקה',
    echo_lead:'הבנו:', echo_manual:'בחרתם:', echo_country:'מ־',
    needsub:{
      relationship:'בן/בת זוג מחו״ל, נישואין או ידועים בציבור',
      relocation:'מעבר לישראל או לחו״ל, תעסוקה והעברה',
      refusal:'בקשה שנדחתה — ערר בזמן',
      work:'מומחה זר, היתר העסקה ל-B/1',
      parents:'הבאת הורה מבוגר',
      asylum:'בקשת מקלט, חסוי לחלוטין',
    },
  },
  en: {
    brand:'Warsha', brand2:'Weitzen', brandsub:'Immigration Law',
    rank:'#1 in immigration · Dun’s 100',
    h1a:'Your immigration journey', h1b:'begins with ', h1c:'one question.',
    lede:'Tell us in one line what brought you — we’ll map your route: timeline, documents, and the next step.',
    navlabel:'The smart navigator', ph:'e.g. I’m an Israeli citizen and my partner is from Argentina',
    go:'Map my route', analyzing:'Analyzing…', hint:'No forms. Instant answer. You talk to a lawyer only when you choose to.',
    or:'or choose your need',
    rkicker:'Your matched route', c_time:'Estimated timeline', c_docs:'Key documents', c_fit:'Case fit',
    back:'Back', cta_call:'Talk to a lawyer now', cta_wa:'or on WhatsApp',
    disc:'The estimates above are general orientation only — not legal advice or a guarantee of outcome. Every case is assessed on its own merits.',
    proof_lead:'Why people choose us', s_years:'years of expertise', s_lawyers:'status & immigration attorneys',
    s_rank:'ranked on Dun’s 100', s_langs:'service languages', trusted:'Among our clients',
    final_h:'Choosing us is choosing security, expertise, and a future you can count on.',
    final_p:'For 23 years we’ve taken the cases others call impossible. Let’s start with a conversation.',
    final_call:'+972-53-491-1336', final_mail:'office@warsha-adv.com', addr:'18 Rival St, Tel Aviv',
    bar_call:'Call now', bar_wa:'WhatsApp',
    fit_strong:'Strong fit', fit_moderate:'Moderate fit', fit_complex:'Complex — needs review',
    echo_lead:'We understood:', echo_manual:'You chose:', echo_country:'from ',
    needsub:{
      relationship:'A partner from abroad — married or common-law',
      relocation:'Moving to or from Israel, work & transfer',
      refusal:'An application was refused — appeal in time',
      work:'Foreign expert, B/1 employment permit',
      parents:'Bringing an aging parent',
      asylum:'An asylum claim, fully confidential',
    },
  },
};

/* ───────────────────────── free-text matcher ─────────────────────────
   Deterministic keyword/intent scorer over HE+EN+translit. Echoes what it
   understood and always offers manual choice (never a silent wrong guess).
   LLM upgrade path: replace match() with a call to the firm's OpenAI key
   (Responses API, gpt-5.4-mini) returning {track,country,confidence};
   keep this matcher as the offline fallback + few-shot ground truth. */
const SIGNALS = [
  ['relationship', ['בן זוג','בת זוג','בן הזוג','בת הזוג','בני זוג','נישוא','חתונה','ידוע','ידועים בציבור','זוגי','partner','spouse','wife','husband','married','marry','girlfriend','boyfriend','fianc']],
  ['refusal',      ['סירוב','סורב','נדחה','דחיי','דחתה','ערר','ערעור','refus','denied','denial','rejected','appeal','overturn']],
  ['work',         ['עבודה','מועסק','מעסיק','מומחה','העסק','שכר','b/1','b1','work','employ','job','expert','permit','hire','salary']],
  ['parents',      ['הור','אמא','אבא','סבא','סבתא','מבוגר','קשיש','סיעוד','parent','mother','father','elderly','aging','grandparent']],
  ['asylum',       ['מקלט','פליט','רדיפ','סכנה','בקשת מקלט','asylum','refugee','persecut','danger','flee']],
  ['relocation',   ['רילוקיישן','רילוקשיין','מעבר','עוברים','להגר','להעתיק','relocat','move','moving','immigrat','aliyah','relocation']],
];
/* country dictionary (HE → display), used to enrich the echo */
const COUNTRIES = [
  ['ארגנטינה','Argentina'],['ארה"ב','the US'],['ארהב','the US'],['אמריקה','the US'],
  ['רוסיה','Russia'],['אוקראינה','Ukraine'],['צרפת','France'],['גרמניה','Germany'],
  ['אנגליה','the UK'],['בריטניה','the UK'],['קנדה','Canada'],['ברזיל','Brazil'],
  ['הודו','India'],['סין','China'],['פיליפינים','the Philippines'],['תאילנד','Thailand'],
  ['ניגריה','Nigeria'],['אתיופיה','Ethiopia'],['אריתריאה','Eritrea'],['קולומביה','Colombia'],
  ['מקסיקו','Mexico'],['ספרד','Spain'],['איטליה','Italy'],['פולין','Poland'],['מולדובה','Moldova'],
];
const COUNTRIES_EN = ['argentina','united states','usa','u.s','russia','ukraine','france','germany','uk','britain','england','canada','brazil','india','china','philippines','thailand','nigeria','ethiopia','eritrea','colombia','mexico','spain','italy','poland','moldova'];

function normalize(s){
  return (s||'').toLowerCase()
    .normalize('NFKD').replace(/[֑-ׇ]/g,'')   // strip niqqud
    .replace(/[‎‏]/g,'').trim();
}
function matchQuery(raw){
  const q = normalize(raw);
  if (!q) return null;
  const score = Object.create(null);
  for (const [track, terms] of SIGNALS){
    for (const t of terms){ if (q.includes(normalize(t))) score[track] = (score[track]||0) + 1; }
  }
  // country
  let country = null;
  for (const [he,en] of COUNTRIES){ if (q.includes(normalize(he))){ country = en; break; } }
  if (!country){ for (const c of COUNTRIES_EN){ if (q.includes(c)){ country = c.replace(/\b\w/g,m=>m.toUpperCase()); break; } } }
  // a foreign country + no other strong signal → most often a couples case
  if (country && !Object.keys(score).length) score.relationship = 1;

  const ranked = Object.entries(score).sort((a,b)=>b[1]-a[1]);
  if (!ranked.length) return { track:null, country };
  return { track: ranked[0][0], country, confident: ranked.length===1 || ranked[0][1] > ranked[1][1] };
}

/* ───────────────────────── state machine ───────────────────────── */
const root = document.documentElement;
const state = { view:'hero', need:null, country:null, source:'manual', lang:'he' };

const $ = (s,el=document)=>el.querySelector(s);
const $$ = (s,el=document)=>[...el.querySelectorAll(s)];
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

function t(key){ return (I18N[state.lang] && I18N[state.lang][key]) || I18N.he[key] || key; }

/* build the need pills once */
function buildNeeds(){
  const host = $('#needs');
  host.innerHTML = '';
  NEED_ORDER.forEach((key,i)=>{
    const tk = TRACKS[key][state.lang];
    const b = document.createElement('button');
    // Cap the stagger tail at 400ms so a fast tapper never hits a pill that's
    // still mid-fade (usability audit). Base 200 + 40/step → last pill ≤ 400ms.
    b.type='button'; b.className='need reveal'; b.style.setProperty('--d', Math.min(200 + i*40, 400)+'ms');
    b.dataset.need = key;
    b.innerHTML =
      `<span class="idx">0${i+1}</span>`+
      `<span class="ttl">${tk.tag}</span>`+
      `<span class="sub">${I18N[state.lang].needsub[key]}</span>`+
      `<span class="go" aria-hidden="true">`+
        `<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></span>`;
    b.setAttribute('aria-label', tk.tag);
    b.addEventListener('click', ()=>choose(key,'manual'));
    host.appendChild(b);
  });
}

/* i18n pass over static chrome */
function applyLang(){
  root.lang = state.lang; root.dir = state.lang==='he'?'rtl':'ltr'; root.dataset.lang = state.lang;
  $$('[data-i18n]').forEach(el=>{ const k=el.getAttribute('data-i18n'); if (I18N[state.lang][k]!=null) el.textContent = I18N[state.lang][k]; });
  $$('[data-i18n-ph]').forEach(el=>{ const k=el.getAttribute('data-i18n-ph'); if (I18N[state.lang][k]!=null) el.placeholder = I18N[state.lang][k]; });
  $$('[data-lang-btn]').forEach(b=>b.setAttribute('aria-pressed', String(b.dataset.langBtn===state.lang)));
  buildNeeds();
  if (state.view==='result' && state.need) paintResult();
}

/* render the matched result panel */
function paintResult(){
  const tk = TRACKS[state.need][state.lang];
  $('#crumbPill').textContent = tk.tag;
  $('#r-title').textContent = tk.title;
  $('#rTime').textContent = tk.time;
  const docs = $('#rDocs'); docs.innerHTML = tk.docs.map(d=>`<li>${d}</li>`).join('');
  const fit = $('#rFit'); fit.dataset.level = tk.fit;
  $('#rFitLbl').textContent = t('fit_'+tk.fit);
  $('#rFitNote').textContent = tk.fitNote;
  // echo what we understood
  let echo;
  if (state.source==='nav'){
    // Bidi-isolate the Latin country name so "מ־Argentina" doesn't render
    // with the hyphen on the wrong side in the RTL run.
    const from = state.country ? ` · ${t('echo_country')}‏<bdi>${state.country}</bdi>` : '';
    echo = `<b>${t('echo_lead')}</b> ${tk.tag}${from}`;
  } else {
    echo = `<b>${t('echo_manual')}</b> ${tk.tag}`;
  }
  $('#rEcho').innerHTML = echo;
}

/* the actual view swap, wrapped in a View Transition when allowed */
function commit(){
  const apply = ()=>{
    root.dataset.view = state.view;
    if (state.view==='result'){
      paintResult();
      requestAnimationFrame(()=>{ const h=$('#r-title'); h && h.focus({preventScroll:true}); window.scrollTo({top:0,behavior:'instant' in document.body.style?'instant':'auto'}); });
    } else {
      requestAnimationFrame(()=>{ const h=$('#hero-h1'); h && h.focus({preventScroll:true}); });
    }
  };
  if (!reduce && document.startViewTransition){
    document.startViewTransition(apply);
  } else { apply(); }
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

/* navigator submit — brief "analyzing" beat (the matcher genuinely parses the
   sentence). Instant under reduced-motion; never fakes latency beyond the read. */
function onNav(e){
  e.preventDefault();
  const val = $('#navInput').value;
  const btn = $('#navForm .nav-go');
  const goSpan = btn.querySelector('[data-i18n="go"]');

  const resolve = ()=>{
    btn.removeAttribute('aria-busy');
    if (goSpan) goSpan.textContent = t('go');
    const m = matchQuery(val);
    if (!m || !m.track){
      // didn't understand → guide to manual choice, don't fake a guess
      $('#navHint').innerHTML = state.lang==='he'
        ? 'לא הצלחנו לזהות במדויק — בחרו את הצורך מהאפשרויות למטה, או נסחו מחדש.'
        : 'We couldn’t pin it down — pick a need below, or rephrase.';
      $('#needs').scrollIntoView({behavior: reduce?'auto':'smooth', block:'center'});
      return;
    }
    state.country = m.country || null;
    choose(m.track, 'nav');
  };

  btn.setAttribute('aria-busy','true');
  if (goSpan) goSpan.textContent = t('analyzing');
  if (reduce) resolve(); else setTimeout(resolve, 380);
}

/* route from URL (deep-link + back/forward) */
function readHash(){
  const h = location.hash || '';
  const qs = h.includes('?') ? new URLSearchParams(h.slice(h.indexOf('?')+1)) : new URLSearchParams();
  const need = qs.get('need');
  if (h.startsWith('#/route') && need && TRACKS[need]){
    state.need = need; state.country = qs.get('from') || null;
    state.source = qs.get('from') ? 'nav' : (state.source==='nav'?'nav':'manual');
    state.view='result';
  } else {
    state.view='hero'; state.need=null;
  }
}

/* ───────────────────────── boot ───────────────────────── */
function init(){
  // lang from storage
  try{ const s = localStorage.getItem('ww.lang'); if (s==='en'||s==='he') state.lang=s; }catch(_){}
  applyLang();
  readHash();
  // first paint without a transition animation (just set the view)
  root.dataset.view = state.view;
  if (state.view==='result') paintResult();
  requestAnimationFrame(()=>document.body.classList.add('ready'));

  $('#navForm').addEventListener('submit', onNav);
  $('#backBtn').addEventListener('click', ()=>history.back());
  $$('[data-lang-btn]').forEach(b=>b.addEventListener('click', ()=>{
    state.lang = b.dataset.langBtn; try{ localStorage.setItem('ww.lang', state.lang); }catch(_){}
    applyLang();
  }));
  window.addEventListener('popstate', ()=>{ readHash(); commit(); });
}

if (document.readyState==='loading') document.addEventListener('DOMContentLoaded', init);
else init();
