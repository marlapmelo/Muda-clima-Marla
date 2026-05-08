const FAKE_EMAILS = new Set(['teste@teste.com','admin@sistema.com','existente@ufsm.br']);

function sanitize(str){return String(str).replace(/[<>"'`]/g,'').trim()}

function showErr(fieldId, msgId, msg){
  const f=document.getElementById(fieldId);
  const e=document.getElementById(msgId);
  f.classList.add('invalid');f.classList.remove('valid');
  e.querySelector('span').textContent=msg;
  e.style.display='flex';
}
function clearErr(fieldId, msgId){
  const f=document.getElementById(fieldId);
  const e=document.getElementById(msgId);
  f.classList.remove('invalid');
  e.style.display='none';
}
function setValid(fieldId){
  const f=document.getElementById(fieldId);
  f.classList.add('valid');f.classList.remove('invalid');
}

function validateEmail(v){return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)}

function passwordScore(pw){
  let s=0;
  if(pw.length>=8)s++;
  if(pw.length>=12)s++;
  if(/[A-Z]/.test(pw))s++;
  if(/[0-9]/.test(pw))s++;
  if(/[^A-Za-z0-9]/.test(pw))s++;
  return s;
}

function updateRules(pw){
  function rule(id, ok) {
        const el = document.getElementById(id);
        if (el) {
            el.classList.toggle('ok', ok);
            // Troca o ícone de 'x' para 'check' quando a regra é atingida
            el.querySelector('i').className = 'ti ' + (ok ? 'ti-circle-check' : 'ti-circle-x');
        }
    }

    rule('r-len', pw.length>=8);
    rule('r-upper', /[A-Z]/.test(pw));
    rule('r-num', /[0-9]/.test(pw));
    rule('r-spec', /[^A-Za-z0-9]/.test(pw));
}

function updateStrength(pw){
  const fill=document.getElementById('strength-fill');
  const label=document.getElementById('strength-label');
  if(!pw){fill.style.width='0';label.textContent='';return;}
  const s=passwordScore(pw);
  const levels=[[20,'#E24B4A','Muito fraca'],[40,'#EF9F27','Fraca'],[60,'#EF9F27','Razoável'],[80,'#1D9E75','Boa'],[100,'#0F6E56','Forte']];
  const [w,c,t]=levels[Math.min(s,4)];
  fill.style.width=w+'%';fill.style.background=c;
  label.textContent='Força: '+t;label.style.color=c;
}

document.getElementById('senha').addEventListener('input',function(){
  const pw=this.value;
  updateRules(pw);updateStrength(pw);
  if(document.getElementById('confirma').value){ validateConfirma();
  }
});

function validateConfirma(){
  const p=document.getElementById('senha').value;
  const c=document.getElementById('confirma').value;
  if(c&&p!==c){showErr('f-confirma','e-confirma','As senhas não coincidem.');}
  else if(c){clearErr('f-confirma','e-confirma');setValid('f-confirma');}
}
document.getElementById('confirma').addEventListener('input',validateConfirma);

document.getElementById('email').addEventListener('blur',function(){
  const v=sanitize(this.value);
  if(!v)return;
  if(!validateEmail(v)){showErr('f-email','e-email','Formato de e-mail inválido.');return;}
  if(FAKE_EMAILS.has(v.toLowerCase())){showErr('f-email','e-email','Este e-mail já está cadastrado.');return;}
  clearErr('f-email','e-email');setValid('f-email');
});

document.querySelectorAll('.pw-toggle').forEach(btn=>{
  btn.addEventListener('click',function(){
    const inp=document.getElementById(this.dataset.target);
    const show=inp.type==='password';
    inp.type=show?'text':'password';
    this.querySelector('i').className='ti '+(show?'ti-eye-off':'ti-eye');
    this.setAttribute('aria-label',show?'Ocultar senha':'Mostrar senha');
  });
});

function showToast(msg,type){
  const t=document.getElementById('toast');
  const icon=document.getElementById('toast-icon');
  document.getElementById('toast-msg').textContent=msg;
  t.className='toast '+type+' show';
  icon.className='ti '+(type==='success'?'ti-circle-check':'ti-alert-circle');
  clearTimeout(t._timer);
  t._timer=setTimeout(()=>t.classList.remove('show'),4000);
}

document.getElementById('btn').addEventListener('click',function(){
  let ok=true;

  const nome=sanitize(document.getElementById('nome').value);
  if(!nome||nome.length<3){showErr('f-name','e-nome','Informe seu nome completo (mín. 3 caracteres).');ok=false;}
  else{clearErr('f-name','e-nome');setValid('f-name');}

  const email=sanitize(document.getElementById('email').value);
  if(!email){showErr('f-email','e-email','O e-mail é obrigatório.');ok=false;}
  else if(!validateEmail(email)){showErr('f-email','e-email','Formato de e-mail inválido.');ok=false;}
  else if(FAKE_EMAILS.has(email.toLowerCase())){showErr('f-email','e-email','Este e-mail já está cadastrado.');ok=false;}
  else{clearErr('f-email','e-email');setValid('f-email');}

  const senha=document.getElementById('senha').value;
////   
  //const score=passwordScore(senha);
  //if(!senha){showErr('f-senha','e-senha','A senha é obrigatória.');ok=false;}
////   else if(senha.length<8||!/[A-Z]/.test(senha)||!/[0-9]/.test(senha)){showErr('f-senha','e-senha','A senha não atende aos requisitos mínimos.');ok=false;}
  //else if(senha.length<8||!/[A-Z]/.test(senha)||!/[0-9]/.test(senha)||!/[^A-Za-z0-9]/.test(senha)){showErr('f-senha','e-senha','A senha não atende aos requisitos mínimos.');ok=false;}
  //else{clearErr('f-senha','e-senha');setValid('f-senha');}

  //const confirma=document.getElementById('confirma').value;
  //if(!confirma){showErr('f-confirma','e-confirma','Confirme sua senha.');ok=false;}
  //else if(confirma!==senha){showErr('f-confirma','e-confirma','As senhas não coincidem.');ok=false;}
  //else{clearErr('f-confirma','e-confirma');setValid('f-confirma');}

////   
  const hasLen = senha.length >= 8;
  const hasUpper = /[A-Z]/.test(senha);
  const hasNum = /[0-9]/.test(senha);
  const hasSpec = /[^A-Za-z0-9]/.test(senha);

  if (!senha) {
      showErr('f-senha', 'e-senha', 'A senha é obrigatória.');
      ok = false;
  } else if (!hasLen || !hasUpper || !hasNum || !hasSpec) {
      showErr('f-senha', 'e-senha', 'A senha não atende aos requisitos mínimos.');
      ok = false;
  } else {
      clearErr('f-senha', 'e-senha');
      setValid('f-senha');
  }
//// 

  const inst=sanitize(document.getElementById('inst').value);
  if(!inst||inst.length<3){showErr('f-inst','e-inst','Informe sua instituição (mín. 3 caracteres).');ok=false;}
  else{clearErr('f-inst','e-inst');setValid('f-inst');}

  const area=document.getElementById('area').value;
  if(!area){showErr('f-area','e-area','Selecione sua área de atuação.');ok=false;}
  else{clearErr('f-area','e-area');setValid('f-area');}

  if(!ok){showToast('Corrija os campos indicados antes de continuar.','error');return;}

  const btn=document.getElementById('btn');
  btn.disabled=true;
  btn.innerHTML='<i class="ti ti-loader" aria-hidden="true" style="animation:spin 1s linear infinite"></i> Cadastrando...';

  setTimeout(()=>{
    document.getElementById('form-area').style.display='none';
    const ss=document.getElementById('success-state');
    ss.style.display='block';
    document.getElementById('success-email').textContent=email;
    showToast('Conta criada com sucesso!','success');
  },1400);
});

const style=document.createElement('style');
style.textContent='@keyframes spin{to{transform:rotate(360deg)}}';
document.head.appendChild(style);