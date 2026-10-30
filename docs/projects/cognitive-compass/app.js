
'use strict';
const {domains,bank,practice}=window.CC_DATA;
const CC_ENGINE=window.CC_ENGINE;
const KEY='cc_v2_history',SESSION='cc_v3_session',PRACT='cc_v2_practice';
const read=(k,d)=>{try{return JSON.parse(localStorage.getItem(k))??d}catch{return d}},write=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));return true}catch{return false}};
let state=read(SESSION,null),practiceDone=read(PRACT,[]),tick=null,activePractice=null,practiceMemoryReady=false,practiceStartedAt=Date.now();
const LEGACY_SESSION='cc_v2_session';
if(!state){
 const legacy=read(LEGACY_SESSION,null);
 if(legacy&&Array.isArray(legacy.asked)&&legacy.asked.length<=24&&legacy.answers&&legacy.counts&&legacy.level){
  state={...legacy,version:3,deadline:Date.now()+24*60*1000,times:{},memoryUnlocked:false,itemStartedAt:Date.now()};
  write(SESSION,state);
 }
}
try{localStorage.removeItem(LEGACY_SESSION)}catch(error){}
if(state)state.itemStartedAt=Date.now();
const $=s=>document.querySelector(s),esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function go(route){location.hash='/'+route}
function route(){return (location.hash.replace(/^#\/?/,'')||'home')}
function headerActive(){document.querySelectorAll('nav a').forEach(a=>{const active=a.hash==='#/'+route();a.classList.toggle('active',active);if(active)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')});const nav=document.querySelector('#nav'),menu=document.querySelector('#menu');if(nav)nav.classList.remove('open');if(menu)menu.setAttribute('aria-expanded','false')}
function home(){const h=read(KEY,[]),last=h[0];$('#main').innerHTML=`
<section class="hero"><div><div class="eyebrow">A free cognitive development workspace</div><h1>Understand how you <span>think.</span><br>Build how you reason.</h1><p class="lead">Explore eight cognitive skill areas through original challenges, transparent performance feedback and practical exercises. Track your own progress without subscriptions or artificial limits.</p><div class="actions"><button class="btn primary" onclick="go('assessment')">Start the assessment →</button><button class="btn secondary" onclick="go('lab')">Explore the development lab</button></div><div class="proof"><span><b>✓</b>Always free</span><span><b>✓</b>No account required</span><span><b>✓</b>Results stored on this device</span></div></div><div class="orb"><div class="rings"><div class="core"><span>CC</span></div></div><div class="float f1">Reasoning<small>Patterns & logic</small></div><div class="float f2">Memory<small>Retain & manipulate</small></div><div class="float f3">Quantitative<small>Numbers & evidence</small></div><div class="float f4">Development<small>Practise & reflect</small></div></div></section>
<section class="section"><div class="sectionhead"><div><div class="eyebrow">Eight domains</div><h2>A broader view of cognitive performance.</h2></div><p>Each domain is explored through a small set of original tasks. Scores describe performance on this question set—not a complete measure of ability.</p></div><div class="grid">${domains.map((d,i)=>`<article class="card domain"><small>0${i+1} / COGNITIVE DOMAIN</small><h3>${d.name}</h3><p>${d.desc}</p></article>`).join('')}</div></section>
<div class="band"><strong>Scientific responsibility</strong><p>This is an educational self-assessment, not a clinically validated IQ test. There are no population percentiles, diagnoses or high-stakes recommendations. Item-level results are sensitive to practice, language, attention and testing conditions.</p></div>
<section class="section"><div class="sectionhead"><div><div class="eyebrow">Your workspace</div><h2>${last?'Continue your development.':'A complete learning loop.'}</h2></div><p>Assess, review, practise, and repeat. The core experience remains free.</p></div><div class="grid"><article class="card"><small class="tag">01 · ASSESS</small><h3>Adaptive assessment</h3><p>Difficulty adjusts within each domain based on your previous response.</p></article><article class="card"><small class="tag">02 · UNDERSTAND</small><h3>Performance dashboard</h3><p>See domain accuracy, relative strengths, development priorities and attempt history.</p></article><article class="card"><small class="tag">03 · PRACTISE</small><h3>Development laboratory</h3><p>Use focused exercises with immediate explanations and unlimited retries.</p></article><article class="card"><small class="tag">04 · REASSESS</small><h3>Track your progress</h3><p>Compare your own attempts over time while accounting for task familiarity.</p></article></div></section>
${last?`<section class="card"><div class="eyebrow">Latest local result</div><h2>${last.score}% raw accuracy</h2><p>${new Date(last.date).toLocaleString()} · ${last.correct}/${last.total} correct</p><div class="actions"><button class="btn secondary" onclick="go('dashboard')">Open dashboard</button><button class="btn quiet" onclick="go('assessment')">New assessment</button></div></section>`:''}`;
}
function start(){state=CC_ENGINE.createSession(domains);state.current=chooseNext();write(SESSION,state);assessment()}
function chooseNext(){const question=CC_ENGINE.chooseQuestion(state,bank,5);if(question)state.memoryUnlocked=false;return question}
function assessment(){if(!state){$('#main').innerHTML=`<section class="pagehead"><div class="eyebrow">Baseline assessment · 40 items</div><h1>Map your current performance.</h1><p>Eight domains, five items per domain, approximately 20–25 minutes. Difficulty adapts between items based on your previous response. Your responses are saved locally. The countdown continues while the assessment session remains active.</p></section><div class="grid"><article class="card"><h3>Scoring</h3><p>Each item is scored 0 or 1. Domain and overall percentages are raw accuracy only. Domains receive equal weight.</p></article><article class="card"><h3>Adaptive routing</h3><p>Correct answers raise the next target difficulty; incorrect answers lower it. The item pool is small and not psychometrically calibrated.</p></article><article class="card"><h3>Conditions</h3><p>Use a quiet setting. Avoid calculators for numerical items. Timing is descriptive, not a validated speed norm.</p></article></div><div class="actions"><button class="btn primary" onclick="start()">Begin assessment →</button></div><div class="notice"><b>Important:</b> This informal assessment is not an IQ test, clinical instrument or population norm. It must not be used for diagnosis, selection or other high-stakes decisions.</div>`;return}
if(!state.current)state.current=chooseNext();if(!state.current){finish();return}const q=state.current;const n=state.asked.length+1;const total=40;$('#main').innerHTML=`<div class="pagehead"><div class="eyebrow">Adaptive assessment · ${n} of ${total}</div><h1>Reasoning challenge.</h1><div class="progress"><i style="width:${n/total*100}%"></i></div></div><div class="assessment"><section class="card question"><div class="qtop"><span>ITEM ${String(n).padStart(2,'0')} / 40</span><span class="timer" id="timer">${timeleft()}</span></div><div class="qdomain">${domains.find(d=>d.id===q.d).name} · Target level ${q.level}</div><h2 class="prompt">${esc(q.q)}</h2>${q.d==='memory'&&q.v&&!state.memoryUnlocked?`<div class="visual memory-stimulus">${esc(q.v)}</div><button type="button" class="btn secondary memory-hide" id="hideMemory">Hide sequence &amp; show choices</button><p class="muted memory-note">Take a moment to encode the sequence before revealing the answer choices.</p>`:q.v&&q.d!=='memory'?`<div class="visual">${esc(q.v)}</div>`:''}${q.d==='memory'&&q.v&&!state.memoryUnlocked?'':`<div class="answers">${q.o.map((v,i)=>`<button type="button" class="answer" data-a="${i}" aria-pressed="false"><span class="letter">${'ABCD'[i]}</span>${esc(v)}</button>`).join('')}</div>`}<div class="qcontrols"><button class="btn quiet" onclick="quit()">Exit assessment</button><button class="btn primary" id="confirm" disabled>Submit answer →</button></div><p class="muted" style="font-size:10px;margin-top:14px">Answers are saved locally on this device. You cannot change a response after submitting an item.</p></section><aside class="sidebar"><article class="card"><h3>Domain coverage</h3>${domains.map(d=>`<div class="historyitem"><span>${d.name}</span><b>${state.counts[d.id]}/5</b></div>`).join('')}</article><article class="card"><h3>Adaptive difficulty</h3><p>Current target: level ${q.level}</p><p>Correct responses move the next target up; incorrect responses move it down.</p></article></aside></div>`;
let chosen=null;document.querySelectorAll('[data-a]').forEach(b=>b.onclick=()=>{chosen=+b.dataset.a;document.querySelectorAll('[data-a]').forEach(x=>{x.classList.toggle('selected',x===b);x.setAttribute('aria-pressed',String(x===b))});$('#confirm').disabled=false});$('#confirm').onclick=()=>submit(chosen);const hideMemory=$('#hideMemory');if(hideMemory)hideMemory.onclick=()=>{state.memoryUnlocked=true;write(SESSION,state);assessment()};if(tick)clearInterval(tick);tick=setInterval(()=>{const t=$('#timer');if(t)t.textContent=timeleft();if(Date.now()>=state.deadline)finish()},1000)}
function timeleft(){if(!state)return '00:00';const s=Math.max(0,Math.ceil((state.deadline-Date.now())/1000));return String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0')}
function submit(choice){const q=state.current;let outcome;try{outcome=CC_ENGINE.recordResponse(state,choice,bank)}catch(error){alert(error.message);return}state.current=chooseNext();write(SESSION,state);showFeedback(q,choice,outcome.correct)}
function showFeedback(q,choice,ok){const complete=state.asked.length===40||!state.current;$('#main').innerHTML=`<section class="pagehead"><div class="eyebrow">Response recorded · ${state.asked.length} of 40</div><h1>${ok?'Correct response.':'Review the reasoning.'}</h1><p>${domains.find(d=>d.id===q.d).name} · ${ok?'Your next item will target a higher difficulty where available.':'Your next item will target a lower difficulty where available.'}</p></section><section class="card"><h2>${esc(q.q)}</h2><div class="feedback ${ok?'good':'bad'}" role="status" aria-live="polite"><b>${ok?'Correct.':'Not quite.'}</b> ${esc(q.e)}</div><p style="margin-top:16px">Your answer: <b>${esc(q.o[choice])}</b> · Correct answer: <b>${esc(q.o[q.a])}</b></p><div class="actions"><button class="btn primary" onclick="continueAssessment()">${complete?'View my results':'Continue →'}</button></div></section>`;headerActive()}
function continueAssessment(){if(!state)return;if(state.asked.length===40||!state.current)finish();else assessment()}
function quit(){if(confirm('Exit and discard this assessment?')){state=null;localStorage.removeItem(SESSION);localStorage.removeItem('cc_v2_session');if(tick)clearInterval(tick);go('home')}}
function finish(){if(!state)return;const result=CC_ENGINE.scoreSession(state,bank,domains);const history=read(KEY,[]);history.unshift(result);write(KEY,history.slice(0,30));state=null;localStorage.removeItem(SESSION);if(tick)clearInterval(tick);go('dashboard')}
function historyChartHtml(history){
 const items=history.slice(0,10).reverse();
 if(!items.length)return '';
 const columns=items.map((item,index)=>{
  const date=new Date(item.date);
  const label=Number.isNaN(date.getTime())?'Run '+(index+1):date.toLocaleDateString(undefined,{month:'short',day:'numeric'});
  return '<div class="historybar-col" title="'+esc(label)+': '+item.score+'%"><strong>'+item.score+'%</strong><div class="historybar-track"><span class="historybar" style="height:'+Math.max(4,item.score)+'%"></span></div><small>'+esc(label)+'</small></div>';
 }).join('');
 return '<section class="card trend-card"><div class="sectionhead"><div><div class="eyebrow">Historical performance</div><h2>Raw accuracy over time</h2></div><span class="tag">Latest 10 runs</span></div><div class="historychart" role="img" aria-label="Bar chart of historical assessment accuracy">'+columns+'</div><p class="muted trend-note">Repeated exposure, item selection and task familiarity can influence changes. This is a record of task performance, not a measure of changing general intelligence.</p></section>';
}
function answerReviewHtml(result){
 const ids=Object.keys(result.answers||{});
 const rows=ids.map((id,index)=>{
  const question=bank.find(item=>item.id===id);
  const answer=result.answers[id];
  if(!question||!answer)return '';
  const right=answer.correct===true;
  return '<details class="answer-review"><summary><span class="review-mark '+(right?'good':'bad')+'">'+(right?'✓':'×')+'</span><span>Item '+String(index+1).padStart(2,'0')+' · '+esc(question.q)+'</span><span class="review-state">'+(right?'Correct':'Incorrect')+'</span></summary><div class="review-detail"><p><b>Your answer:</b> '+esc(question.o[answer.choice]||'Not recorded')+'</p><p><b>Keyed answer:</b> '+esc(question.o[question.a])+'</p><p><b>Explanation:</b> '+esc(question.e)+'</p><p class="muted">'+esc(domains.find(d=>d.id===question.d)?.name||question.d)+' · Difficulty '+question.level+'</p></div></details>';
 }).join('');
 return '<section class="card review-report"><div class="sectionhead"><div><div class="eyebrow">Assessment review</div><h2>Review your responses</h2></div><span class="tag">'+ids.length+' answered items</span></div><div class="answer-review-list">'+(rows||'<p class="muted">No item-level responses were saved for this report.</p>')+'</div></section>';
}
function dashboard(){
 const history=read(KEY,[]),result=history[0];
 if(!result){
  $('#main').innerHTML='<section class="empty"><div class="eyebrow">Performance dashboard</div><h1>Your baseline starts here.</h1><p>Complete an assessment to see your domain profile, relative strengths, development priorities and personal history.</p><a class="btn primary" href="#/assessment">Start assessment</a></section>';
  return;
 }
 const ranked=domains.map(d=>Object.assign({},d,result.domains[d.id]||{total:0,correct:0,score:0})).sort((a,b)=>b.score-a.score);
 const strongest=ranked[0],weakest=ranked[ranked.length-1];
 const domainRows=domains.map(d=>{
  const x=result.domains[d.id]||{total:0,correct:0,score:0};
  return '<div class="domainrow"><span>'+esc(d.name)+'<small>'+x.correct+'/'+x.total+' correct</small></span><div class="progress" role="img" aria-label="'+esc(d.name)+': '+x.score+'%"><i style="width:'+x.score+'%"></i></div><strong>'+x.score+'%</strong></div>';
 }).join('');
 const historyRows=history.map((item,index)=>{
  const date=new Date(item.date);
  const dateLabel=Number.isNaN(date.getTime())?'Saved run':date.toLocaleString();
  return '<div class="historyitem"><span>'+esc(dateLabel)+' · Attempt '+(history.length-index)+'</span><b>'+item.score+'% <span>· '+item.correct+'/'+item.total+'</span></b></div>';
 }).join('');
 const recommendations=practice.filter(item=>item.d===weakest.id).slice(0,2).map(item=>
  '<article class="card"><div class="eyebrow">'+esc(weakest.name)+'</div><h3>'+esc(item.t)+'</h3><p>'+esc(item.q)+'</p><button type="button" class="btn secondary" data-open-recommended="'+esc(item.t)+'">Open exercise →</button></article>'
 ).join('');
 const speed=result.speedMedianMs===null||result.speedMedianMs===undefined?'Not available':(result.speedMedianMs/1000).toFixed(2)+' s';
 $('#main').innerHTML=
  '<section class="pagehead"><div class="eyebrow">Personal performance dashboard</div><h1>Your cognitive profile.</h1><p>Raw performance on Cognitive Compass tasks. This is a descriptive practice profile, not an IQ estimate or population ranking.</p></section>'+
  '<div class="stats"><article class="card stat"><strong>'+result.score+'%</strong><span>Overall raw accuracy</span></article><article class="card stat"><strong>'+result.correct+'/'+result.total+'</strong><span>Correct responses</span></article><article class="card stat"><strong>'+Math.floor(result.duration/60)+'m '+(result.duration%60)+'s</strong><span>Completion time</span></article><article class="card stat"><strong>'+history.length+'</strong><span>Saved attempts on device</span></article></div>'+
  '<section class="card"><div class="sectionhead"><div><div class="eyebrow">Domain profile</div><h2>Performance by cognitive domain</h2></div><span class="tag">${result.total===40?"Five items per domain":"Earlier assessment format"}</span></div>'+domainRows+'</section>'+
  historyChartHtml(history)+
  '<div class="grid" style="margin-top:13px"><article class="card"><div class="eyebrow">Relative strength in this run</div><h2>'+esc(strongest.name)+'</h2><p>'+strongest.score+'% raw accuracy on '+strongest.total+' items. This is the strongest sampled domain in this attempt, not a stable trait estimate.</p></article>'+
  '<article class="card"><div class="eyebrow">Development priority</div><h2>'+esc(weakest.name)+'</h2><p>'+weakest.score+'% raw accuracy. Review the explanations and practise this domain before reassessing.</p></article>'+
  '<article class="card"><div class="eyebrow">Processing-speed task timing</div><h2>'+speed+'</h2><p>Median response time for sampled processing-speed items. This is device-specific and not compared with a norm.</p></article>'+
  '<article class="card"><div class="eyebrow">Report controls</div><h3>Keep a copy</h3><p>Print this report or export saved local results as JSON.</p><div class="actions"><button type="button" class="btn secondary" id="printReport">Print / Save PDF</button><button type="button" class="btn quiet" id="exportReport">Export JSON</button></div></article></div>'+
  '<section class="section"><div class="sectionhead"><div><div class="eyebrow">Personalised development</div><h2>Start with a focused exercise.</h2></div></div><div class="grid">'+(recommendations||'<article class="card"><p>No matching exercise is available yet.</p></article>')+'</div></section>'+
  '<section class="section"><div class="sectionhead"><div><div class="eyebrow">Personal history</div><h2>Saved assessment attempts</h2></div><button type="button" class="btn quiet" id="clearHistory">Clear local history</button></div><div class="history">'+historyRows+'</div><p class="muted">Adaptive item selection and repeated exposure affect comparability. Small score changes should not be treated as validated changes in intelligence.</p></section>'+
  answerReviewHtml(result)+
  '<div class="notice"><b>Interpretation:</b> Five items per domain is a small sample. Differences are prompts for reflection and practice, not fixed ability labels or high-stakes evidence.</div>';
 document.getElementById('printReport').onclick=()=>window.print();
 document.getElementById('exportReport').onclick=exportData;
 document.getElementById('clearHistory').onclick=clearHistory;
 document.querySelectorAll('[data-open-recommended]').forEach(button=>button.onclick=()=>openPractice(button.dataset.openRecommended));
}

function exportData(){
 const payload={
  product:'Cognitive Compass',
  exportedAt:new Date().toISOString(),
  interpretation:'Educational task performance only. Not a clinical or norm-referenced IQ assessment.',
  assessmentHistory:read(KEY,[]),
  activeAssessment:read(SESSION,null),
  practiceCompletion:read(PRACT,[])
 };
 const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'});
 const url=URL.createObjectURL(blob);
 const link=document.createElement('a');
 link.href=url;link.download='cognitive-compass-local-data.json';
 document.body.appendChild(link);link.click();link.remove();URL.revokeObjectURL(url);
}
function clearHistory(){if(confirm('Delete all locally stored assessment history?')){localStorage.removeItem(KEY);dashboard()}}
function programmesHtml(){
 const pathways=[
  {title:'Reasoning foundations',focus:'Build rule discovery, inference and evidence evaluation.',days:['Rule transfer','Inductive rule','Evidence check']},
  {title:'Quantitative clarity',focus:'Rehearse percentages and proportional reasoning.',days:['Percentage reasoning','Proportional split']},
  {title:'Memory and attention',focus:'Practise mental manipulation, active recall and visual scanning.',days:['Mental manipulation','Active recall','Symbol scan']},
  {title:'Patterns and space',focus:'Move from sequence rules to spatial transformations.',days:['Sequence structure','Matrix sequence','Rotation']}
 ];
 const cards=pathways.map(pathway=>
  '<article class="card programme-card"><div class="eyebrow">LEARNING PATHWAY · '+pathway.days.length+' STEPS</div><h3>'+pathway.title+'</h3><p>'+pathway.focus+'</p><ol>'+pathway.days.map((title,index)=>
   '<li><span>Step '+(index+1)+' · '+esc(title)+'</span><button type="button" class="btn quiet btn-small" data-pathway-exercise="'+esc(title)+'">Open</button></li>'
  ).join('')+'</ol></article>'
 ).join('');
 return '<section class="section programme-section"><div class="sectionhead"><div><div class="eyebrow">Structured learning pathways</div><h2>Follow a short practice sequence.</h2></div><p>Use these pathways as a day-by-day routine. Exercise completion is saved in your local practice history.</p></div><div class="programme-grid">'+cards+'</div></section>';
}
function openPractice(title){activePractice=title;practiceMemoryReady=false;practiceStartedAt=Date.now();lab()}
function revealPracticeMemory(){practiceMemoryReady=true;lab()}
function retryPractice(){practiceMemoryReady=false;practiceStartedAt=Date.now();lab()}
function nextPractice(){
 const current=practice.findIndex(item=>item.t===activePractice);
 const next=practice[(current+1)%practice.length];
 openPractice(next.t);
}

function lab(){
 const item=activePractice?practice.find(x=>x.t===activePractice):null;
 if(item){
  const memoryStep=item.d==='memory'&&item.v&&!practiceMemoryReady;
  const visual=memoryStep?'<div class="visual memory-stimulus">'+esc(item.v)+'</div>':(item.v&&item.d!=='memory'?'<div class="visual">'+esc(item.v)+'</div>':'');
  const answerChoices=memoryStep?
   '<button type="button" class="btn secondary memory-hide" id="revealPracticeMemory">Hide sequence &amp; show choices</button><p class="muted memory-note">Read the material, hide it, then answer from recall.</p>':
   '<div class="answers">'+item.o.map((option,index)=>'<button type="button" class="answer" data-p="'+index+'" aria-pressed="false"><span class="letter">'+('ABCD'[index])+'</span>'+esc(option)+'</button>').join('')+'</div>';
  $('#main').innerHTML='<section class="pagehead"><div class="eyebrow">Development laboratory · '+esc(domains.find(d=>d.id===item.d).name)+'</div><h1>'+esc(item.t)+'.</h1><p>Try the exercise, check your response and review the explanation. Repeats are unlimited.</p></section>'+
   '<section class="card"><h2>'+esc(item.q)+'</h2>'+visual+answerChoices+'<div id="fb" aria-live="polite" role="status"></div><div class="actions"><button type="button" class="btn quiet" id="backPractice">Back to laboratory</button><button type="button" class="btn secondary" id="retryPractice">Try again</button><button type="button" class="btn primary" id="nextPractice">Next exercise →</button></div></section>';
  const reveal=document.getElementById('revealPracticeMemory');
  if(reveal)reveal.onclick=revealPracticeMemory;
  document.getElementById('backPractice').onclick=()=>{activePractice=null;lab()};
  document.getElementById('retryPractice').onclick=retryPractice;
  document.getElementById('nextPractice').onclick=nextPractice;
  document.querySelectorAll('[data-p]').forEach(button=>button.onclick=()=>{
   document.querySelectorAll('[data-p]').forEach(other=>{other.disabled=true;other.setAttribute('aria-pressed',String(other===button))});
   const choice=Number(button.dataset.p),ok=choice===item.a;
   button.classList.add('selected');
   const duration=Math.max(0,Date.now()-practiceStartedAt);
   $('#fb').innerHTML='<div class="feedback '+(ok?'good':'bad')+'"><b>'+(ok?'Correct.':'Not quite.')+'</b> '+esc(item.e)+
    (ok?'':'<p><b>Correct answer:</b> '+esc(item.o[item.a])+'</p>')+
    (item.d==='speed'?'<p class="muted">Time on this device: '+(duration/1000).toFixed(2)+' seconds. Descriptive only.</p>':'')+'</div>';
   if(ok&&!practiceDone.includes(item.t)){practiceDone.push(item.t);write(PRACT,practiceDone)}
  });
  return;
 }
 $('#main').innerHTML='<section class="pagehead"><div class="eyebrow">Cognitive development laboratory</div><h1>Practise with intention.</h1><p>Short original exercises help rehearse reasoning strategies. Feedback explains each task; it does not promise a general increase in intelligence.</p></section>'+
  '<div class="stats"><article class="card stat"><strong>'+practice.length+'</strong><span>Free exercises</span></article><article class="card stat"><strong>'+practiceDone.length+'/'+practice.length+'</strong><span>Completed correctly</span></article><article class="card stat"><strong>∞</strong><span>Retries</span></article><article class="card stat"><strong>0</strong><span>Paywalls</span></article></div>'+
  programmesHtml()+
  '<section class="section"><div class="sectionhead"><div><div class="eyebrow">Exercise library</div><h2>All practice challenges.</h2></div></div><div class="practicegrid">'+practice.map(x=>'<article class="card"><div class="eyebrow">'+esc(domains.find(d=>d.id===x.d).name)+'</div><h3>'+esc(x.t)+'</h3><p>'+esc(x.q)+'</p><div class="actions"><span class="muted">'+(practiceDone.includes(x.t)?'Completed':'Ready to practise')+'</span><button type="button" class="btn secondary" data-open-practice="'+esc(x.t)+'">Open exercise →</button></div></article>').join('')+'</div></section>'+
  '<div class="notice"><b>Learning note:</b> Practice can improve familiarity and task-specific strategies. Transfer to broad cognitive abilities is a separate empirical question and is not guaranteed by these exercises.</div>';
 document.querySelectorAll('[data-pathway-exercise]').forEach(button=>button.onclick=()=>openPractice(button.dataset.pathwayExercise));
 document.querySelectorAll('[data-open-practice]').forEach(button=>button.onclick=()=>openPractice(button.dataset.openPractice));
}

function about(){ $('#main').innerHTML=`<section class="pagehead"><div class="eyebrow">Methodology & evidence</div><h1>Clarity over claims.</h1><p>Cognitive Compass is an independent educational platform for exploring performance on selected reasoning tasks.</p></section><section class="card"><h2>What is measured?</h2><p>Eight task categories: fluid reasoning, numerical reasoning, verbal reasoning, pattern recognition, working memory, processing speed, spatial reasoning and critical thinking. The bank contains 10 original items per domain; each complete run samples five items in every domain, for 40 items total.</p><h2>Scoring</h2><p>Each item receives 1 point for the keyed answer and 0 otherwise. Overall raw accuracy is correct answers divided by attempted items. Domain accuracy is correct answers divided by attempted items in that domain. Domains are presented separately and receive equal weight in the descriptive overall score. There is no age adjustment, norm-referenced standardisation, percentile conversion or IQ transformation.</p><h2>Adaptive routing</h2><p>Each domain begins at target difficulty 2. A correct response raises the next target by one level; an incorrect response lowers it by one level, bounded between levels 1 and 3. The next unused item closest to that target is selected, with random tie-breaking. Every complete run samples five of the ten items in each domain. The small item bank and difficulty labels are heuristic product logic, not calibrated item-response theory.</p><h2>Processing speed and timing</h2><p>Some tasks involve quick visual discrimination, and total elapsed time is recorded. The interface does not claim a standardised processing-speed measure. Device latency, reading speed, accessibility settings and interruptions affect timing.</p><h2>Interpretation limits</h2><p>This platform has not undergone representative norming, reliability studies, construct validation, criterion validation or independent psychometric review. Scores are not clinical findings, diagnoses, IQ scores, population percentiles or evidence of fixed ability. Do not use them for hiring, admissions, diagnosis or other high-stakes decisions.</p><h2>Practice and learning</h2><p>Exercises offer feedback on task strategies. Practice may improve familiarity with similar tasks; general transfer to intelligence or unrelated real-world outcomes is not established here.</p></section>`}
function privacy(){ $('#main').innerHTML=`<section class="pagehead"><div class="eyebrow">Privacy & data controls</div><h1>Your results stay on this device.</h1><p>The core experience does not require registration, email, payment or an external scoring API.</p></section><section class="card"><h2>Local storage</h2><p>Assessment history, an active session and practice completion are stored in this browser's local storage. They do not synchronise between devices and may be lost if browser data is cleared. Hosting providers may process standard request logs to serve the site.</p><h2>Export or delete your data</h2><p>Use the dashboard's Export JSON control to download saved results, an active assessment and practice completion. The export remains on your device.</p><p>Export local records from the dashboard, or clear this site's storage in your browser settings. Exiting an active assessment discards that attempt.</p><h2>No account security claims</h2><p>Because there is no account system, there are no user passwords or cloud profiles. Anyone with access to this browser profile may be able to view its locally stored results.</p><button class="btn quiet" onclick="localStorage.removeItem(KEY);localStorage.removeItem(SESSION);localStorage.removeItem(PRACT);localStorage.removeItem('cc_v2_session');state=null;practiceDone=[];alert('Cognitive Compass local data cleared.');go('home')">Clear all Cognitive Compass data</button></section>`}
function render(){if(tick){clearInterval(tick);tick=null}headerActive();const r=route();if(r==='home')home();else if(r==='assessment')assessment();else if(r==='dashboard')dashboard();else if(r==='lab')lab();else if(r==='about')about();else if(r==='privacy')privacy();else home()}
$('#menu').onclick=()=>{const opened=$('#nav').classList.toggle('open');$('#menu').setAttribute('aria-expanded',String(opened))};window.addEventListener('hashchange',render);window.addEventListener('beforeunload',()=>{if(state)write(SESSION,state)});if(!CC_ENGINE.validateBank(domains,bank,practice)){$('#main').innerHTML='<section class="empty"><h1>Assessment content check failed.</h1><p>The question bank did not pass its integrity check. Refresh the app or contact the project maintainer.</p></section>'}else render();
