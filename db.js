/* ===== Camada de banco de dados (Supabase) =====
   Sem url e anonKey no config.js, o sistema roda em MODO DEMONSTRAÇÃO (nada é salvo).
   Com as chaves, ele exige login e salva tudo no banco. */
const DB={email:"",ok:false,nome:"",codigo:"",ev:false,on:false,gate:"",loja:null,sb:null,user:null,msg:"",sig:"",t:null};
DB.on=!!(typeof CONFIG!=="undefined"&&CONFIG.supabase&&CONFIG.supabase.url&&CONFIG.supabase.anonKey);

const q=async p=>{const r=await p;if(r.error)throw new Error(r.error.message);return r.data;};
const upd=(t,obj,id)=>DB.client().from(t).update(obj).eq("id",id);
const el=id=>document.getElementById(id);
DB.client=()=>{if(!DB.sb){if(!window.supabase)throw new Error("Biblioteca do Supabase não carregou. Verifique a internet.");DB.sb=window.supabase.createClient(CONFIG.supabase.url,CONFIG.supabase.anonKey);}return DB.sb;};
DB.pt=m=>{const s=String(m||"");
 const t=[[/Anonymous sign-ins are disabled/i,"Digite o e-mail e a senha."],[/Invalid login credentials/i,"E-mail ou senha incorretos."],
  [/Email not confirmed/i,"E-mail ainda não confirmado. Confirme o e-mail ou peça para liberar o acesso."],
  [/User already registered|already been registered/i,"Este e-mail já tem conta. Use o botão Entrar."],
  [/Password should be at least/i,"A senha precisa ter pelo menos 6 caracteres."],
  [/rate limit/i,"Muitas tentativas. Espere alguns minutos."],[/Invalid API key/i,"Chave do Supabase inválida. Confira o config.js."],
  [/Failed to fetch|NetworkError/i,"Sem conexão com o Supabase. Confira a URL no config.js e a internet."],
  [/valid email|invalid format|Unable to validate email/i,"Digite um e-mail válido."],
  [/New password should be different/i,"A nova senha precisa ser diferente da atual."]];
 for(const [r,x] of t)if(r.test(s))return x;return s;};
DB.err=e=>toast("Erro: "+(e&&e.message?e.message:e));

DB.ped=r=>({n:r.numero,id:r.id,cli:r.cliente,tipo:r.tipo,obs:r.obs||"",end:r.endereco||"",it:Array.isArray(r.itens)?r.itens:[],tot:Number(r.total),pag:r.pagamento,st:Math.min(r.status,3),t:Date.parse(r.criado_em)});

DB.boot=async()=>{
 try{
  [stock,team,exps,orders,dels].forEach(a=>{a.length=0;});
  if(!DB.ev){DB.ev=true;DB.client().auth.onAuthStateChange(ev=>{if(ev==="PASSWORD_RECOVERY"){DB.gate="nova";DB.msg="";DB.ok=false;render();}});}
  const {data}=await DB.client().auth.getSession();
  if(DB.gate==="nova")return render();
  if(!data.session){DB.gate="login";return render();}
  DB.user=data.session.user;await DB.entrar();
 }catch(e){DB.gate="erro";DB.msg=e.message;render();}
};
DB.entrar=async()=>{
 const m=await q(DB.client().from("membros").select("*").eq("user_id",DB.user.id));
 if(!m.length){
  const meta=DB.user.user_metadata||{};
  DB.nome=DB.nome||meta.nome_pizzaria||"";
  DB.codigo=DB.codigo||meta.codigo_convite||"";
  if(DB.nome&&DB.codigo){
   try{await DB.criarLoja(DB.nome,DB.codigo);}catch(e){DB.gate="loja";DB.msg=DB.pt(e.message);render();}
   return;
  }
  DB.gate="loja";DB.msg="";return render();
 }
 const l=await q(DB.client().from("lojas").select("*").eq("id",m[0].loja_id));
 DB.loja={id:m[0].loja_id,nome:l[0]?l[0].nome:"",papel:m[0].papel};
 el("store-name").textContent=DB.loja.nome;
 await DB.load();DB.gate="";DB.msg="";render();DB.poll();
};
DB.criarLoja=async(nome,codigo)=>{
 const id=await q(DB.client().rpc("criar_loja",{p_nome:nome,p_codigo:codigo}));
 DB.loja={id,nome,papel:"dono"};await DB.seed();
 try{
  const limpeza=await DB.client().auth.updateUser({data:{nome_pizzaria:null,codigo_convite:null}});
  if(limpeza.error)throw limpeza.error;
 }catch(e){toast("Pizzaria criada, mas não foi possível limpar os dados temporários do convite.");}
 el("store-name").textContent=nome;DB.nome="";DB.codigo="";
 await DB.load();DB.gate="";DB.msg="";render();DB.poll();
};
DB.seed=async()=>{const L=DB.loja.id,s=DB.client();
 await q(s.from("estoque").insert(CONFIG.estoque.map((r,i)=>({loja_id:L,item:r[0],unidade:r[1],qtd:r[2],minimo:r[3],ordem:i}))));
 await q(s.from("equipe").insert(CONFIG.equipe.map((r,i)=>({loja_id:L,nome:r[0],funcao:r[1],horario:r[2],em_turno:false,entrada:"",ordem:i}))));};

DB.load=async()=>{
 const L=DB.loja.id,s=DB.client();
 const [p,e,t,d]=await Promise.all([
  q(s.from("pedidos").select("*").eq("loja_id",L).order("numero",{ascending:false}).limit(300)),
  q(s.from("estoque").select("*").eq("loja_id",L).order("ordem")),
  q(s.from("equipe").select("*").eq("loja_id",L).order("ordem")),
  q(s.from("despesas").select("*").eq("loja_id",L).order("criado_em"))]);
 const h0=new Date();h0.setHours(0,0,0,0);const ini=h0.getTime();
 [orders,done,dels,cancelled,stock,team,exps].forEach(a=>{a.length=0;});
 p.slice().reverse().forEach(r=>{const o=DB.ped(r);if(r.status<4)orders.push(o);else if(o.t>=ini)(r.status===4?done:cancelled).push(o);});
 p.forEach(r=>{if(r.entrega!==null&&r.entrega!==undefined&&(r.entrega<2||Date.parse(r.criado_em)>=ini))dels.push({n:r.numero,id:r.id,cli:r.cliente,end:r.endereco||"Endereço não informado",bairro:r.bairro||"",taxa:0,st:r.entrega,mt:r.motoboy});});
 e.forEach(r=>{const a=[r.item,r.unidade,Number(r.qtd),Number(r.minimo)];a.id=r.id;stock.push(a);});
 t.forEach(r=>{const a=[r.nome,r.funcao,r.horario,r.em_turno?1:0,r.entrada||""];a.id=r.id;team.push(a);});
 d.filter(r=>Date.parse(r.criado_em)>=ini).forEach(r=>exps.push([r.categoria,Number(r.valor)]));
 DB.sig=JSON.stringify([orders.map(o=>[o.n,o.st]),dels.map(o=>[o.n,o.st,o.mt]),stock.map(x=>x[2]),team.map(x=>x[3]),exps.length,done.length,cancelled.length]);
};

DB.criarPedido=async o=>{
 const r=await q(DB.client().from("pedidos").insert({loja_id:DB.loja.id,cliente:o.cli,tipo:o.tipo,obs:o.obs,itens:o.it,total:o.tot,pagamento:o.pag,endereco:o.end||null}).select().single());
 await DB.load();return DB.ped(r);
};
DB.adv=async n=>{const o=orders.find(x=>x.n===n);if(!o)return;
 try{
  if(o.st<3){await q(upd("pedidos",{status:o.st+1},o.id));}
  else{await q(upd("pedidos",o.tipo==="Entrega"?{status:4,entrega:0}:{status:4},o.id));toast(`Pedido #${n} concluído`);}
  await DB.load();render();
 }catch(e){DB.err(e);}};

DB.charts=all=>{const h={},s={};
 all.forEach(o=>{const hr=new Date(o.t).getHours();h[hr]=(h[hr]||0)+1;o.it.forEach(x=>{const m=x.match(/^(\d+)x (.+) \(.+\)$/);if(m)s[m[2]]=(s[m[2]]||0)+(+m[1]);});});
 return [Object.keys(h).sort((a,b)=>a-b).map(k=>[k+"h",h[k]]),Object.entries(s).sort((a,b)=>b[1]-a[1]).slice(0,5)];};

DB.renderGate=()=>{
 el("nav").innerHTML="";
 const m=DB.msg?`<p style="margin:0;color:var(--${DB.ok?"green":"accent"})">${esc(DB.msg)}</p>`:"";
 const box=h=>`<div class="gate panel">${h}</div>`;
 const mail=`<input id="lemail" type="email" placeholder="E-mail" value="${esc(DB.email||"")}" aria-label="E-mail">`;
 const g=DB.gate;
 $("#view").innerHTML=
  g==="login"?box(`<h1>Entrar</h1><p class="muted">Acesse o sistema da sua pizzaria.</p>${mail}<input id="lsenha" type="password" placeholder="Senha (mínimo 6 caracteres)" aria-label="Senha">${m}<button class="btn" data-a="dblogin">Entrar</button><button class="btn ghost" data-a="dbcadastro">Criar conta</button><button class="lnk" data-a="dbesqueci">Esqueci minha senha</button>`)
  :g==="cadastro"?box(`<h1>Criar conta</h1><p class="muted">Informe seus dados e o convite para criar sua pizzaria.</p>${mail}<input id="lsenha" type="password" placeholder="Senha (mínimo 6 caracteres)" aria-label="Senha"><input id="lnome" placeholder="Nome da pizzaria" value="${esc(DB.nome)}" aria-label="Nome da pizzaria"><input id="lcodigo" placeholder="Código de convite" value="${esc(DB.codigo)}" autocapitalize="characters" aria-label="Código de convite">${m}<button class="btn" data-a="dbsignup">Criar conta e acessar</button><button class="lnk" data-a="dbvoltar">Já tenho uma conta</button>`)
  :g==="esqueci"?box(`<h1>Recuperar senha</h1><p class="muted">Digite o e-mail da conta. Enviaremos um link para criar uma nova senha.</p>${mail}${m}<button class="btn" data-a="dbenviar">Enviar link</button><button class="lnk" data-a="dbvoltar">Voltar</button>`)
  :g==="nova"?box(`<h1>Nova senha</h1><p class="muted">Escolha uma nova senha para entrar.</p><input id="lsenha" type="password" placeholder="Nova senha (mínimo 6 caracteres)" aria-label="Nova senha"><input id="lsenha2" type="password" placeholder="Repita a nova senha" aria-label="Repita a nova senha">${m}<button class="btn" data-a="dbnova">Salvar senha</button>`)
  :g==="loja"?box(`<h1>Criar sua pizzaria</h1><p class="muted">Informe o nome da loja e o código de convite que você recebeu.</p><input id="lnome" placeholder="Nome da pizzaria" value="${esc(DB.nome)}" aria-label="Nome da pizzaria"><input id="lcodigo" placeholder="Código de convite" value="${esc(DB.codigo)}" autocapitalize="characters" aria-label="Código de convite">${m}<button class="btn" data-a="dbcriar">Criar</button><button class="lnk" data-a="dbsair">Sair</button>`)
  :box(`<h1>Algo deu errado</h1><p class="err">${esc(DB.msg)}</p><button class="btn ghost" data-a="dbsair">Voltar ao login</button>`);
};

DB.poll=()=>{clearInterval(DB.t);
 DB.t=setInterval(async()=>{
  if(DB.gate||document.hidden)return;
  const a=document.activeElement;if(a&&/INPUT|SELECT|TEXTAREA/.test(a.tagName))return;
  try{const antes=DB.sig;await DB.load();if(DB.sig!==antes&&view!=="pedido")render();}catch(e){}
 },10000);};

DB.override=M=>{
 const run=async fn=>{try{await fn();await DB.load();render();}catch(e){DB.err(e);}};
 const cred=()=>{const c={email:el("lemail").value.trim(),password:el("lsenha").value};DB.email=c.email;return c;};
 const vazio=c=>{if(!c.email||!c.password){DB.msg="Digite o e-mail e a senha.";render();return true;}return false;};
 M.dblogin=async()=>{DB.msg="";DB.ok=false;const c=cred();if(vazio(c))return;let r;
  try{r=await DB.client().auth.signInWithPassword(c);}catch(e){DB.msg=DB.pt(e.message);return render();}
  if(r.error){DB.msg=DB.pt(r.error.message);return render();}
  DB.user=r.data.user;try{await DB.entrar();}catch(e){DB.gate="erro";DB.msg=DB.pt(e.message);render();}};
 M.dbcadastro=()=>{DB.gate="cadastro";DB.msg="";DB.ok=false;render();};
 M.dbsignup=async()=>{DB.msg="";const c=cred(),nome=el("lnome").value.trim(),codigo=el("lcodigo").value.trim();DB.nome=nome;DB.codigo=codigo;
  if(vazio(c))return;
  if(!nome){DB.msg="Informe o nome da pizzaria.";return render();}
  if(!codigo){DB.msg="Informe o código de convite.";return render();}
  let r;
  try{r=await DB.client().auth.signUp({...c,options:{data:{nome_pizzaria:nome,codigo_convite:codigo}}});}catch(e){DB.msg=DB.pt(e.message);return render();}
  if(r.error){DB.msg=DB.pt(r.error.message);return render();}
  if(!r.data.session){DB.gate="login";DB.ok=true;DB.msg="Conta criada. Confirme o e-mail e depois entre; usaremos o convite informado para criar sua pizzaria.";return render();}
  DB.user=r.data.session.user;try{await DB.entrar();}catch(e){DB.gate="erro";DB.msg=DB.pt(e.message);render();}};
 M.dbcriar=async()=>{const nome=el("lnome").value.trim(),codigo=el("lcodigo").value.trim();DB.nome=nome;DB.codigo=codigo;DB.ok=false;
  if(!nome){DB.msg="Informe o nome da pizzaria.";return render();}
  if(!codigo){DB.msg="Informe o código de convite.";return render();}
  try{await DB.criarLoja(nome,codigo);}catch(e){DB.msg=DB.pt(e.message);render();}};
 M.dbesqueci=()=>{DB.gate="esqueci";DB.msg="";DB.ok=false;render();};
 M.dbvoltar=()=>{DB.gate="login";DB.msg="";DB.ok=false;render();};
 M.dbenviar=async()=>{const email=el("lemail").value.trim();DB.email=email;DB.ok=false;
  if(!email){DB.msg="Digite o e-mail.";return render();}
  try{const r=await DB.client().auth.resetPasswordForEmail(email,{redirectTo:location.origin+location.pathname});
   if(r.error)DB.msg=DB.pt(r.error.message);else{DB.ok=true;DB.msg="Se este e-mail tiver conta, enviamos um link para criar uma nova senha.";}
  }catch(e){DB.msg=DB.pt(e.message);}render();};
 M.dbnova=async()=>{const a=el("lsenha").value,b=el("lsenha2").value;DB.ok=false;
  if(a.length<6){DB.msg="A senha precisa ter pelo menos 6 caracteres.";return render();}
  if(a!==b){DB.msg="As senhas não são iguais.";return render();}
  try{const r=await DB.client().auth.updateUser({password:a});
   if(r.error){DB.msg=DB.pt(r.error.message);return render();}
   const ss=await DB.client().auth.getSession();DB.user=ss.data.session.user;DB.msg="";await DB.entrar();
  }catch(e){DB.msg=DB.pt(e.message);render();}};
 M.dbsair=async()=>{try{await DB.client().auth.signOut();}catch(e){}
  clearInterval(DB.t);DB.loja=null;DB.user=null;DB.msg="";[orders,done,dels,cancelled,stock,team,exps].forEach(a=>{a.length=0;});
  el("store-name").textContent="";DB.gate="login";render();};
 M.cancel=d=>{const o=orders.find(x=>x.n==d.n);if(!o||!confirm(`Cancelar o pedido #${o.n} (${o.cli})?`))return;
  run(async()=>{await q(upd("pedidos",{status:5},o.id));toast(`Pedido #${o.n} cancelado`);});};
 M.desp=d=>{const x=dels.find(o=>o.n==d.n),m=MT.find(n=>!busy(n));if(!x||!m)return;
  run(async()=>{await q(upd("pedidos",{entrega:1,motoboy:m},x.id));toast(`${m} saiu para entregar o pedido #${x.n}`);});};
 M.entr=d=>{const x=dels.find(o=>o.n==d.n);if(!x)return;
  run(async()=>{await q(upd("pedidos",{entrega:2},x.id));toast(`Pedido #${x.n} entregue`);});};
 M.sinc=d=>{const s=stock[+d.i];if(!s)return;run(async()=>{await q(upd("estoque",{qtd:s[2]+(s[1]==="un"?10:1)},s.id));});};
 M.sdec=d=>{const s=stock[+d.i];if(!s)return;const k=s[1]==="un"?10:1;run(async()=>{await q(upd("estoque",{qtd:Math.max(0,s[2]-k)},s.id));});};
 M.ponto=d=>{const t=team[+d.i];if(!t)return;const on=t[3]?0:1,h=new Date().toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"});
  run(async()=>{await q(upd("equipe",{em_turno:!!on,entrada:on?h:""},t.id));toast(on?`${t[0]} começou o turno`:`${t[0]} encerrou o turno`);});};
 M.lanc=()=>{const v=parseFloat(f.dval);if(!(v>0)){toast("Informe um valor");return;}
  run(async()=>{await q(DB.client().from("despesas").insert({loja_id:DB.loja.id,categoria:f.dcat,valor:v}));f.dval="";toast("Despesa lançada");});};
};