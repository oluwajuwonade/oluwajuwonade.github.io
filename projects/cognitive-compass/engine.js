(function(){
  'use strict';

  function shuffled(values, random){
    const out=values.slice();
    for(let i=out.length-1;i>0;i--){
      const j=Math.floor(Math.max(0,Math.min(0.999999,random()))*(i+1));
      const hold=out[i];out[i]=out[j];out[j]=hold;
    }
    return out;
  }

  function createSession(domains, now=Date.now(), random=Math.random){
    const ids=domains.map(d=>d.id);
    return {
      version:3,answers:{},asked:[],started:now,deadline:now+24*60*1000,
      level:Object.fromEntries(ids.map(id=>[id,2])),
      counts:Object.fromEntries(ids.map(id=>[id,0])),
      correct:Object.fromEntries(ids.map(id=>[id,0])),
      order:shuffled(ids,random),current:null,times:{},itemStartedAt:now
    };
  }

  function chooseQuestion(state,bank,perDomain=5,random=Math.random){
    if(!state)return null;
    const domain=state.order.find(id=>(state.counts[id]||0)<perDomain);
    if(!domain)return null;
    const level=state.level[domain]||2;
    const pool=bank.filter(q=>q.d===domain&&!state.asked.includes(q.id));
    if(!pool.length)return null;
    const distance=Math.min(...pool.map(q=>Math.abs(q.level-level)));
    const nearest=pool.filter(q=>Math.abs(q.level-level)===distance);
    const pick=nearest[Math.min(nearest.length-1,Math.floor(Math.max(0,Math.min(0.999999,random()))*nearest.length))];
    state.itemStartedAt=Date.now();
    return pick||null;
  }

  function recordResponse(state,choice,bank){
    if(!state||!state.current)throw new Error("There is no active assessment item.");
    if(!Number.isInteger(choice)||choice<0||choice>3)throw new Error("Select one of the four available answers.");
    const question=bank.find(q=>q.id===state.current.id);
    if(!question)throw new Error("The active assessment item is missing from the question bank.");
    const correct=choice===question.a;
    state.answers[question.id]={choice,correct};
    state.asked.push(question.id);
    state.counts[question.d]=(state.counts[question.d]||0)+1;
    if(correct){
      state.correct[question.d]=(state.correct[question.d]||0)+1;
      state.level[question.d]=Math.min(3,(state.level[question.d]||2)+1);
    }else{
      state.level[question.d]=Math.max(1,(state.level[question.d]||2)-1);
    }
    state.times=state.times||{};
    state.times[question.id]=Math.max(0,Date.now()-(state.itemStartedAt||Date.now()));
    return {question,correct};
  }

  function median(values){
    const items=values.filter(Number.isFinite).sort((a,b)=>a-b);
    if(!items.length)return null;
    const middle=Math.floor(items.length/2);
    return items.length%2?items[middle]:(items[middle-1]+items[middle])/2;
  }

  function scoreSession(state,bank,domains){
    const total=state.asked.length;
    const correct=state.asked.filter(id=>state.answers[id]&&state.answers[id].correct).length;
    const domainsOut={};
    domains.forEach(d=>{
      const n=state.counts[d.id]||0;
      const c=state.correct[d.id]||0;
      domainsOut[d.id]={total:n,correct:c,score:n?Math.round(c/n*100):0};
    });
    const speedIds=new Set(bank.filter(q=>q.d==='speed').map(q=>q.id));
    const speedMedianMs=median(state.asked.filter(id=>speedIds.has(id)).map(id=>state.times&&state.times[id]).filter(Number.isFinite));
    return {
      version:3,date:new Date().toISOString(),score:total?Math.round(correct/total*100):0,
      correct,total,domains:domainsOut,duration:Math.max(0,Math.round((Date.now()-state.started)/1000)),
      answers:{...state.answers},responseTimes:{...(state.times||{})},speedMedianMs
    };
  }

  function validateBank(domains,bank,practice){
    const domainIds=domains.map(d=>d.id);
    if(domainIds.length!==8||new Set(domainIds).size!==8)return false;
    if(bank.length!==80||new Set(bank.map(q=>q.id)).size!==bank.length)return false;
    const domainCounts=Object.fromEntries(domainIds.map(id=>[id,0]));
    for(const q of bank){
      if(!domainCounts.hasOwnProperty(q.d))return false;
      domainCounts[q.d]++;
      if(!Array.isArray(q.o)||q.o.length!==4||!Number.isInteger(q.a)||q.a<0||q.a>3)return false;
      if(!Number.isInteger(q.level)||q.level<1||q.level>3||typeof q.e!=="string"||!q.e.trim())return false;
    }
    if(!domainIds.every(id=>domainCounts[id]===10))return false;
    if(!Array.isArray(practice)||practice.length!==16)return false;
    if(new Set(practice.map(q=>q.t)).size!==practice.length)return false;
    if(!domainIds.every(id=>practice.some(q=>q.d===id)))return false;
    return practice.every(q=>Array.isArray(q.o)&&q.o.length===4&&Number.isInteger(q.a)&&q.a>=0&&q.a<4&&typeof q.e==="string"&&q.e.trim());
  }

  window.CC_ENGINE={
    createSession,chooseQuestion,recordResponse,scoreSession,validateBank,median
  };
})();