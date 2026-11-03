/* ===== Aplicação (a lógica da demonstração) =====
   Para trocar nomes, contato, cardápio, estoque e equipe, edite o config.js.
   Os pedidos de exemplo da cozinha ficam logo abaixo, na lista "orders". */
document.title=CONFIG.sistema+" — Gestão para pizzarias";
document.getElementById("brand").textContent=CONFIG.sistema;
document.getElementById("store-name").textContent=CONFIG.pizzaria;
if(CONFIG.contato)document.getElementById("contact").textContent=CONFIG.contato;
const $=s=>document.querySelector(s);
const brl=n=>n.toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const ST=[["Recebido","Iniciar preparo"],["No preparo","Levar ao forno"],["No forno","Marcar como pronto"],["Pronto","Concluir pedido"]];
const SIZES=CONFIG.tamanhos;
const MENU=CONFIG.menu;
const mk=m=>Date.now()-m*60000;
let view="cozinha",size=1,cart=[],seq=1038,done=[],f={cli:"",tipo:"Balcão",pag:"Pix",obs:""};
let orders=[
{n:1038,cli:"Rafaela M.",tipo:"WhatsApp",it:["1x Calabresa (Grande)","1x Refrigerante 2L"],tot:80,st:0,t:mk(3)},
{n:1037,cli:"Bruno Alves",tipo:"Entrega",it:["2x Margherita (Média)"],tot:104,st:1,t:mk(9),obs:"Sem manjericão em uma delas"},
{n:1036,cli:"Mesa 4",tipo:"Balcão",it:["1x Quatro Queijos (Grande)","1x Portuguesa (Média)"],tot:136,st:1,t:mk(14)},
{n:1035,cli:"Carla Souza",tipo:"Entrega",it:["1x Pepperoni (Grande)"],tot:79,st:2,t:mk(22)},
{n:1034,cli:"Diego P.",tipo:"Telefone",it:["1x Frango c/ Catupiry (Média)","1x Refrigerante 2L"],tot:70,st:3,t:mk(26)}];
const SIM=[["Juliana R.","WhatsApp",["1x Margherita (Grande)"],65],["Mesa 2","Balcão",["1x Calabresa (Média)","1x Pepperoni (Broto)"],104],["Marcos T.","Telefone",["2x Quatro Queijos (Média)"],126],["Patrícia L.","Entrega",["1x Portuguesa (Grande)","1x Refrigerante 2L"],84]];

function card(o){const m=Math.floor((Date.now()-o.t)/60000);
 return `<article class="card"><div class="r1"><b>#${o.n} ${esc(o.cli)}</b><span class="tag">${o.tipo}</span></div><ul>${o.it.map(x=>`<li>${esc(x)}</li>`).join("")}</ul>${o.obs?`<p class="obs">${esc(o.obs)}</p>`:""}<div class="r1"><span class="time ${m>=20?"late":""}">${m} min</span><button class="btn sm" data-a="adv" data-n="${o.n}">${ST[o.st][1]}</button></div></article>`}
function cozinha(){return `<div class="top"><div><h1>Cozinha</h1><p class="muted">${orders.length} pedidos em andamento. Tempo acima de 20 min fica em vermelho.</p></div><button class="btn" data-a="sim">+ Simular pedido novo</button></div>
<div class="board">${ST.map((s,i)=>{const g=orders.filter(o=>o.st===i);return `<section class="col c${i}"><h3>${s[0]}<span>${g.length}</span></h3>${g.map(card).join("")||'<p class="muted empty">Nenhum pedido.</p>'}</section>`}).join("")}</div>`}
const total=()=>cart.reduce((a,c)=>a+c.p*c.q,0);
function pedido(){return `<div class="top"><div><h1>Novo pedido</h1><p class="muted">Toque no sabor para adicionar ao pedido.</p></div><div class="seg" role="group" aria-label="Tamanho">${SIZES.map((s,i)=>`<button data-a="size" data-i="${i}" aria-pressed="${i===size}">${s}</button>`).join("")}</div></div>
<div class="split"><div class="menu">${MENU.map((m,i)=>`<button class="item" data-a="add" data-i="${i}"><b>${m[0]}</b><small>${m[1]}</small><span>${brl(m[2][m[3]?0:size])}</span></button>`).join("")}</div>
<aside class="panel cart"><h2>Pedido</h2>${cart.length?cart.map((c,k)=>`<div class="line"><span>${esc(c.nome)}${c.size?` <small class="muted">${c.size}</small>`:""}</span><span class="q"><button data-a="dec" data-k="${k}" aria-label="Diminuir">−</button>${c.q}<button data-a="inc" data-k="${k}" aria-label="Aumentar">+</button></span></div>`).join(""):'<p class="muted">Nenhum item ainda.</p>'}
<input id="cli" placeholder="Nome do cliente ou mesa" value="${esc(f.cli)}" aria-label="Cliente">
<select id="tipo" aria-label="Origem">${["Balcão","Entrega","WhatsApp","Telefone"].map(x=>`<option ${x===f.tipo?"selected":""}>${x}</option>`).join("")}</select>
<select id="pag" aria-label="Pagamento">${["Pix","Cartão","Dinheiro"].map(x=>`<option ${x===f.pag?"selected":""}>${x}</option>`).join("")}</select>
<input id="obs" placeholder="Observações (ex.: sem cebola)" value="${esc(f.obs)}" aria-label="Observações">
<div class="tot"><span>Total</span><span>${brl(total())}</span></div>
<button class="btn" data-a="send" ${cart.length?"":"disabled"}>Enviar para a cozinha</button>
<button class="btn ghost" data-a="sendp" ${cart.length?"":"disabled"}>Enviar e ver comanda</button></aside></div>`}
function painel(){const all=orders.concat(done),v=1286+all.reduce((a,o)=>a+o.tot,0),p=31+all.length;
 const H=[["18h",6],["19h",13],["20h",21],["21h",17],["22h",9],["23h",4]],S=[["Calabresa",24],["Margherita",19],["Quatro Queijos",14],["Pepperoni",11],["Portuguesa",8]];
 return `<div class="top"><div><h1>Painel do dia</h1><p class="muted">Números atualizados a cada pedido enviado ou concluído.</p></div></div>
<div class="kpis"><div class="panel kpi"><b>${brl(v)}</b><span>Vendas hoje</span></div><div class="panel kpi"><b>${p}</b><span>Pedidos</span></div><div class="panel kpi"><b>${brl(v/p)}</b><span>Ticket médio</span></div><div class="panel kpi"><b>32 min</b><span>Tempo médio de entrega</span></div></div>
<div class="two"><section class="panel"><h2>Pedidos por horário</h2><div class="bars">${H.map(h=>`<div class="${h[1]===21?"pk":""}"><span>${h[1]}</span><i style="height:${h[1]*4}px"></i><span>${h[0]}</span></div>`).join("")}</div></section>
<section class="panel"><h2>Sabores mais pedidos</h2><div class="rank">${S.map(s=>`<div><p><span>${s[0]}</span><b>${s[1]}</b></p><i style="width:${s[1]/24*100}%"></i></div>`).join("")}</div></section></div>`}

/* ---------- Módulos: Entregas, Estoque, Equipe, Financeiro ---------- */
const AD=["Rua das Flores, 120","Av. Brasil, 845","Rua XV, 33","Alameda Sol, 410"],BA=["Centro","Vila Nova","Jardim América","São Judas"],MT=CONFIG.motoboys;
let dels=[{n:1033,cli:"Patrícia L.",end:AD[1],bairro:BA[1],taxa:6,st:0,mt:null},{n:1032,cli:"Marcos T.",end:AD[2],bairro:BA[0],taxa:5,st:1,mt:"Lucas"},{n:1031,cli:"Ana Beatriz",end:AD[0],bairro:BA[2],taxa:8,st:2,mt:"Rafael"}];
let stock=CONFIG.estoque.map(s=>s.slice());
let team=CONFIG.equipe.map(t=>t.slice());
let exps=[["Gás",120],["Diária de entregador",160],["Embalagens",95]];f.dcat="Insumos";f.dval="";
const busy=n=>dels.some(d=>d.st===1&&d.mt===n);
function entregas(){const free=MT.find(n=>!busy(n));
 const col=(st,t)=>{const g=dels.filter(d=>d.st===st);return `<section class="panel"><h3>${t}<span class="muted"> ${g.length}</span></h3>${g.map(d=>`<div class="line"><div><b>#${d.n} ${esc(d.cli)}</b><br><small class="muted">${esc(d.end)}, ${d.bairro}${d.mt?`, ${d.mt}`:""}</small></div>${st===0?`<button class="btn sm" data-a="desp" data-n="${d.n}" ${free?"":"disabled"}>Despachar</button>`:st===1?`<button class="btn sm" data-a="entr" data-n="${d.n}">Entregue</button>`:'<span class="tag okt">Entregue</span>'}</div>`).join("")||'<p class="muted">Nenhuma.</p>'}</section>`};
 return `<div class="top"><div><h1>Entregas</h1><p class="muted">Pedidos de entrega concluídos na cozinha chegam aqui sozinhos.</p></div></div><div class="g4">${col(0,"Aguardando motoboy")}${col(1,"Em rota")}${col(2,"Entregues")}<section class="panel"><h3>Motoboys</h3>${MT.map(n=>`<div class="line"><b>${n}</b><span class="tag ${busy(n)?"warnt":"okt"}">${busy(n)?"Em rota":"Livre"}</span></div>`).join("")}</section></div>`}
function estoque(){const low=stock.map((s,i)=>({s,i})).filter(x=>x.s[2]<x.s[3]);
 return `<div class="top"><div><h1>Estoque</h1><p class="muted">${low.length?`${low.length} ${low.length>1?"itens abaixo":"item abaixo"} do mínimo.`:"Tudo acima do mínimo."}</p></div></div><div class="split2"><section class="panel">${stock.map((s,i)=>{const p=Math.min(100,s[2]/(s[3]*2)*100);return `<div class="srow"><div class="sn"><b>${s[0]}</b><small class="muted">mínimo ${s[3]} ${s[1]}</small></div><div class="sbar"><i class="${s[2]<s[3]?"lowb":""}" style="width:${p}%"></i></div><span class="q"><button data-a="sdec" data-i="${i}" aria-label="Dar baixa">−</button><b>${s[2]} ${s[1]}</b><button data-a="sinc" data-i="${i}" aria-label="Registrar entrada">+</button></span></div>`}).join("")}</section>
 <aside class="panel"><h2>Lista de compras</h2>${low.length?low.map(x=>`<div class="line"><span>${x.s[0]}</span><b>${x.s[3]*2-x.s[2]} ${x.s[1]}</b></div>`).join("")+'<p class="muted">Sugestão: repor até o dobro do mínimo.</p>':'<p class="muted">Nada para comprar agora.</p>'}</aside></div>`}
function equipe(){const on=team.filter(t=>t[3]).length,D=["Seg","Ter","Qua","Qui","Sex","Sáb","Dom"];
 return `<div class="top"><div><h1>Equipe</h1><p class="muted">${on} de ${team.length} em turno agora.</p></div></div><div class="g3">${team.map((t,i)=>`<article class="panel"><div class="r1"><b>${t[0]}</b><span class="tag ${t[3]?"okt":""}">${t[3]?"Em turno":"Fora"}</span></div><p class="muted" style="margin:4px 0 10px">${t[1]}, ${t[2]}${t[3]?`. Entrada ${t[4]}`:""}</p><button class="btn ${t[3]?"ghost":""} sm" data-a="ponto" data-i="${i}">${t[3]?"Registrar saída":"Bater ponto"}</button></article>`).join("")}</div>
 <section class="panel" style="margin-top:14px;overflow-x:auto"><h2>Escala da semana</h2><table class="tbl"><tr><th></th>${D.map(x=>`<th>${x}</th>`).join("")}</tr>${team.map((t,i)=>`<tr><td>${t[0]}</td>${D.map((x,d)=>`<td class="${(d+i)%7===3?"off":""}">${(d+i)%7===3?"Folga":"●"}</td>`).join("")}</tr>`).join("")}</table></section>`}
function financeiro(){const P={Pix:520,"Cartão":610,Dinheiro:156};orders.concat(done).forEach(o=>{const k=o.pag||"Cartão";P[k]+=o.tot});
 const ent=Object.values(P).reduce((a,b)=>a+b,0),sai=exps.reduce((a,e)=>a+e[1],0),mx=Math.max(...Object.values(P));
 return `<div class="top"><div><h1>Financeiro</h1><p class="muted">Caixa do dia. Cada pedido enviado entra aqui automaticamente.</p></div></div>
 <div class="kpis"><div class="panel kpi"><b>${brl(ent)}</b><span>Entradas</span></div><div class="panel kpi"><b>${brl(sai)}</b><span>Saídas</span></div><div class="panel kpi"><b style="color:var(--green)">${brl(ent-sai)}</b><span>Saldo do dia</span></div></div>
 <div class="two"><section class="panel"><h2>Entradas por forma de pagamento</h2><div class="rank">${Object.entries(P).map(([k,v])=>`<div><p><span>${k}</span><b>${brl(v)}</b></p><i style="width:${v/mx*100}%"></i></div>`).join("")}</div></section>
 <section class="panel"><h2>Saídas</h2>${exps.map(e=>`<div class="line"><span>${e[0]}</span><b>${brl(e[1])}</b></div>`).join("")}<div class="row2"><select id="dcat" aria-label="Categoria">${["Insumos","Gás","Energia","Entregador","Outros"].map(x=>`<option ${x===f.dcat?"selected":""}>${x}</option>`).join("")}</select><input id="dval" type="number" min="0" placeholder="Valor (R$)" value="${esc(f.dval)}" aria-label="Valor"><button class="btn sm" data-a="lanc">Lançar</button></div></section></div>`}
const VIEWS={cozinha,pedido,painel,entregas,estoque,equipe,financeiro};
const MOD={
 desp:d=>{const x=dels.find(o=>o.n==d.n),m=MT.find(n=>!busy(n));if(x&&m){x.st=1;x.mt=m;toast(`${m} saiu para entregar o pedido #${x.n}`);}render();},
 entr:d=>{const x=dels.find(o=>o.n==d.n);x.st=2;toast(`Pedido #${x.n} entregue`);render();},
 sinc:d=>{const s=stock[+d.i];s[2]+=s[1]==="un"?10:1;render();},
 sdec:d=>{const s=stock[+d.i],k=s[1]==="un"?10:1;s[2]=Math.max(0,s[2]-k);render();},
 ponto:d=>{const t=team[+d.i];t[3]=t[3]?0:1;if(t[3])t[4]=new Date().toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"});toast(t[3]?`${t[0]} começou o turno`:`${t[0]} encerrou o turno`);render();},
 lanc:()=>{const v=parseFloat(f.dval);if(!(v>0)){toast("Informe um valor");return;}exps.push([f.dcat,v]);f.dval="";toast("Despesa lançada");render();}
};
function render(){
 $("#nav").innerHTML=[["cozinha","Cozinha",orders.length],["pedido","Novo pedido"],["entregas","Entregas",dels.filter(d=>d.st===0).length],["estoque","Estoque"],["equipe","Equipe"],["financeiro","Financeiro"],["painel","Painel"]].map(t=>`<button role="tab" data-a="view" data-v="${t[0]}" aria-selected="${view===t[0]}">${t[1]}${t[2]?`<span class="cnt">${t[2]}</span>`:""}</button>`).join("");
 $("#view").innerHTML=(VIEWS[view]||painel)();}
function toast(t){const e=$("#toast");e.textContent=t;e.classList.add("on");clearTimeout(toast.h);toast.h=setTimeout(()=>e.classList.remove("on"),2200);}
function ticket(o){$("#paper").innerHTML=`<h4>${esc(CONFIG.pizzaria.toUpperCase())}</h4><div class="big">PEDIDO #${o.n}</div><hr><div>${new Date().toLocaleString("pt-BR")}</div><div>Origem: ${o.tipo}</div><div>Cliente: ${esc(o.cli)}</div><hr>${o.it.map(x=>`<div>${esc(x)}</div>`).join("")}${o.obs?`<hr><div>OBS: ${esc(o.obs)}</div>`:""}<hr><div class="row"><b>TOTAL</b><b>${brl(o.tot)}</b></div><div>Pagamento: ${o.pag||"Pix"}</div><hr><div style="text-align:center">Obrigado pela preferência!</div>`;$("#tk").classList.add("open");}
function send(pr){if(!cart.length)return;const o={n:++seq,cli:f.cli.trim()||"Cliente balcão",tipo:f.tipo,obs:f.obs.trim(),it:cart.map(c=>`${c.q}x ${c.nome}${c.size?` (${c.size})`:""}`),tot:total(),pag:f.pag,st:0,t:Date.now()};
 orders.push(o);cart=[];f.cli="";f.obs="";view="cozinha";render();toast(`Pedido #${o.n} enviado para a cozinha`);if(pr)ticket(o);}
document.addEventListener("click",e=>{const b=e.target.closest("[data-a]");if(!b)return;const a=b.dataset.a,d=b.dataset;
 if(a==="view"){view=d.v;render();}
 else if(a==="size"){size=+d.i;render();}
 else if(a==="add"){const m=MENU[+d.i],sz=m[3]?"":SIZES[size],p=m[2][m[3]?0:size],x=cart.find(c=>c.nome===m[0]&&c.size===sz);x?x.q++:cart.push({nome:m[0],size:sz,p,q:1});render();}
 else if(a==="inc"){cart[+d.k].q++;render();}
 else if(a==="dec"){const c=cart[+d.k];if(--c.q<=0)cart.splice(+d.k,1);render();}
 else if(a==="send")send(false);
 else if(a==="sendp")send(true);
 else if(a==="sim"){const s=SIM[Math.floor(Math.random()*SIM.length)];orders.push({n:++seq,cli:s[0],tipo:s[1],it:s[2],tot:s[3],st:0,t:Date.now()});render();toast(`Novo pedido #${seq} via ${s[1]}`);}
 else if(a==="adv"){const i=orders.findIndex(o=>o.n===+d.n),o=orders[i];if(o.st<3)o.st++;else{done.push(o);if(o.tipo==="Entrega")dels.unshift({n:o.n,cli:o.cli,end:AD[o.n%4],bairro:BA[o.n%4],taxa:6,st:0,mt:null});orders.splice(i,1);toast(`Pedido #${o.n} concluído`);}render();}
 else if(MOD[a])MOD[a](d);
 else if(a==="print")window.print();
 else if(a==="close")$("#tk").classList.remove("open");});
document.addEventListener("input",e=>{if(e.target.id in f)f[e.target.id]=e.target.value;});
function tick(){$("#clock").textContent=new Date().toLocaleString("pt-BR",{weekday:"long",hour:"2-digit",minute:"2-digit"});}
tick();setInterval(()=>{tick();if(view==="cozinha")render();},30000);
render();