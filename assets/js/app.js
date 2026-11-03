
const COURSE_PREFIX='ia_apr_';
const MODULES=['01-revisao','02-engenharia-prompts','03-processos','04-workflows','05-integracoes-apis','06-automacao-ia','07-gemini-processos','08-agentes','09-seguranca','10-projeto'];
function getDone(){try{return JSON.parse(localStorage.getItem(COURSE_PREFIX+'done')||'[]')}catch(e){return[]}}
function saveDone(a){localStorage.setItem(COURSE_PREFIX+'done',JSON.stringify([...new Set(a)]));updateProgress();updateDashboard()}
function completeModule(id){const a=getDone();if(!a.includes(id))a.push(id);saveDone(a);const m=document.getElementById('completeMsg');if(m){m.style.display='block';m.textContent='Módulo marcado como concluído. Progresso salvo neste navegador.'}}
function updateProgress(){const d=getDone(),pct=Math.round(d.length/MODULES.length*100);document.querySelectorAll('.progressbar>span').forEach(x=>x.style.width=pct+'%');document.querySelectorAll('[data-progress-label]').forEach(x=>x.textContent=pct+'%');document.querySelectorAll('[data-module]').forEach(x=>{if(d.includes(x.dataset.module))x.classList.add('done')})}
function firstIncomplete(){const d=getDone();return MODULES.find(x=>!d.includes(x))||MODULES[MODULES.length-1]}
function updateDashboard(){const d=getDone(),pct=Math.round(d.length/MODULES.length*100);document.querySelectorAll('[data-done-count]').forEach(x=>x.textContent=d.length);document.querySelectorAll('[data-total-count]').forEach(x=>x.textContent=MODULES.length);document.querySelectorAll('.progress-ring').forEach(r=>{r.style.setProperty('--pct',pct);const s=r.querySelector('span');if(s)s.textContent=pct+'%'});document.querySelectorAll('[data-continue-course]').forEach(a=>a.href='modulos/'+firstIncomplete()+'.html');document.querySelectorAll('.module-card[data-module]').forEach(c=>{if(d.includes(c.dataset.module)){const t=c.querySelector('.tag');if(t)t.textContent='Concluído ✓'}})}
function answer(btn,correct,ok,no){const q=btn.closest('.quiz');if(q.dataset.answered)return;q.dataset.answered='1';q.querySelectorAll('.option').forEach(x=>x.disabled=true);btn.classList.add(correct?'correct':'wrong');const f=q.querySelector('.feedback');f.classList.add('show',correct?'ok':'no');f.textContent=(correct?'✅ ':'💡 ')+(correct?ok:no)}
function copyPrompt(btn){const p=btn.closest('.prompt');const clone=p.cloneNode(true);clone.querySelectorAll('.copy').forEach(x=>x.remove());navigator.clipboard?.writeText(clone.textContent.trim());const o=btn.textContent;btn.textContent='Copiado!';setTimeout(()=>btn.textContent=o,1200)}
function initNotes(){document.querySelectorAll('[data-note]').forEach(el=>{const k=COURSE_PREFIX+'note_'+el.dataset.note;el.value=localStorage.getItem(k)||'';el.addEventListener('input',()=>{localStorage.setItem(k,el.value);const s=el.parentElement.querySelector('.note-status');if(s){s.textContent='Salvo.';clearTimeout(el._t);el._t=setTimeout(()=>s.textContent='',1200)}})})}
function initLabFields(){document.querySelectorAll('[data-lab]').forEach(el=>{const k=COURSE_PREFIX+'lab_'+el.dataset.lab;el.value=localStorage.getItem(k)||'';el.addEventListener('input',()=>localStorage.setItem(k,el.value))})}
function initProject(){document.querySelectorAll('[data-project]').forEach(el=>{const k=COURSE_PREFIX+'project_'+el.dataset.project;el.value=localStorage.getItem(k)||'';el.addEventListener('input',()=>localStorage.setItem(k,el.value))})}
function exportProject(){const fields=[['Problema','problema'],['AS-IS','asis'],['Gargalos','gargalos'],['TO-BE','tobe'],['Papel da IA','ia'],['Prompt','prompt'],['Workflow','workflow'],['Integrações/APIs','integracoes'],['Agente','agente'],['Riscos e validação','riscos'],['Indicadores','indicadores']];let out='PROJETO INTEGRADOR — APERFEIÇOAMENTO EM IA PARA EMPREENDEDORES\n\n';fields.forEach(([l,k])=>out+=l.toUpperCase()+'\n'+(localStorage.getItem(COURSE_PREFIX+'project_'+k)||'(não preenchido)')+'\n\n');downloadText(out,'projeto-integrador-aperfeicoamento-ia.txt')}
function downloadText(text,name){const b=new Blob([text],{type:'text/plain;charset=utf-8'}),a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),500)}
function buildAdvancedPrompt(){const ids=['papel','contexto','entrada','instrucao','regras','restricoes','saida','validacao'];const labels=['Papel','Contexto','Entrada variável','Instruções','Regras e critérios','Restrições','Formato de saída','Validação'];const parts=ids.map((id,i)=>{const v=(document.getElementById('pb_'+id)?.value||'').trim();return v?labels[i]+':\n'+v:''}).filter(Boolean);document.getElementById('advancedPromptOutput').textContent=parts.join('\n\n')||'Preencha os campos para montar o prompt.'}
function renderWorkflow(){const t=document.getElementById('wfTrigger').value,a=document.getElementById('wfAI').value,c=document.getElementById('wfCond').value,o=document.getElementById('wfAction').value;const p=document.getElementById('workflowPreview');let parts=[['trigger',t]];if(a!=='Sem IA')parts.push(['ai',a]);if(c!=='Sem condição')parts.push(['condition',c]);parts.push(['action',o]);p.innerHTML='<div class="workflow-row">'+parts.map((x,i)=>`${i?'<span class="wf-arrow">→</span>':''}<div class="wf-node ${x[0]}"><b>${x[1]}</b></div>`).join('')+'</div>';localStorage.setItem(COURSE_PREFIX+'workflow',JSON.stringify({t,a,c,o}));}
function saveWorkflow(){renderWorkflow();alert('Workflow salvo neste navegador.')}
function exportWorkflow(){const v=localStorage.getItem(COURSE_PREFIX+'workflow');if(!v)renderWorkflow();const d=JSON.parse(localStorage.getItem(COURSE_PREFIX+'workflow'));downloadText(`WORKFLOW\nGatilho: ${d.t}\nIA: ${d.a}\nCondição: ${d.c}\nAção: ${d.o}\n`,'workflow-conceitual.txt')}
function restoreWorkflow(){try{const d=JSON.parse(localStorage.getItem(COURSE_PREFIX+'workflow'));if(!d)return;document.getElementById('wfTrigger').value=d.t;document.getElementById('wfAI').value=d.a;document.getElementById('wfCond').value=d.c;document.getElementById('wfAction').value=d.o;renderWorkflow()}catch(e){}}
function simulateAPI(){const method=document.getElementById('apiMethod').value,endpoint=document.getElementById('apiEndpoint').value.trim(),body=document.getElementById('apiBody').value.trim(),status=document.getElementById('apiStatus'),out=document.getElementById('apiResponse');if(!endpoint.startsWith('/')){status.innerHTML='<span class="status-400">400 Bad Request</span> — endpoint deve começar com /';out.textContent=JSON.stringify({erro:'endpoint invalido'},null,2);return}let parsed={};if(method==='POST'){try{parsed=JSON.parse(body)}catch(e){status.innerHTML='<span class="status-400">400 Bad Request</span> — JSON inválido';out.textContent=JSON.stringify({erro:'JSON inválido'},null,2);return}}if(method==='GET'){status.innerHTML='<span class="status-200">200 OK</span>';out.textContent=JSON.stringify({id:42,nome:'Marina',categoria:'LEAD_QUENTE',origem:'simulador local'},null,2)}else{status.innerHTML='<span class="status-200">201 Created</span>';out.textContent=JSON.stringify({id:Math.floor(Math.random()*9000+1000),...parsed,status:'criado',origem:'simulador local'},null,2)}}
function initAgent(){document.querySelectorAll('[data-agent]').forEach(el=>{const k=COURSE_PREFIX+'agent_'+el.dataset.agent;el.value=localStorage.getItem(k)||'';el.addEventListener('input',()=>localStorage.setItem(k,el.value))})}
function exportAgentCanvas(){const f=[['Objetivo','objetivo'],['Contexto','contexto'],['Ferramentas','ferramentas'],['Limites','limites'],['Aprovação humana','humano'],['Critério de sucesso','criterio']];let o='CANVAS DE AGENTE\n\n';f.forEach(([l,k])=>o+=l.toUpperCase()+'\n'+(localStorage.getItem(COURSE_PREFIX+'agent_'+k)||'(não preenchido)')+'\n\n');downloadText(o,'canvas-agente.txt')}
const QUESTION_BANK=[
{q:'Qual deve ser a primeira etapa antes de automatizar?',a:['Escolher a ferramenta','Mapear problema e processo','Criar um agente'],c:1,t:'Processos'},
{q:'O que caracteriza uma saída estruturada?',a:['Resposta sempre longa','Formato previsível com campos definidos','Texto sem pontuação'],c:1,t:'Prompts'},
{q:'Quando uma regra determinística é melhor que IA?',a:['Quando a condição é simples como valor > 500','Quando há texto livre complexo','Quando é preciso resumir documento'],c:0,t:'Workflows'},
{q:'Qual papel do webhook?',a:['Receber notificação/evento em uma URL','Armazenar senha','Formatar imagem'],c:0,t:'APIs'},
{q:'JSON é usado principalmente para...',a:['Troca de dados estruturados','Editar vídeo','Criptografar senhas automaticamente'],c:0,t:'APIs'},
{q:'HTTP Request é útil quando...',a:['Precisamos chamar uma API','Queremos apenas mudar cor do site','Queremos desligar o computador'],c:0,t:'n8n'},
{q:'AS-IS representa...',a:['Processo atual','Processo desejado','Banco de dados'],c:0,t:'Processos'},
{q:'TO-BE representa...',a:['Processo desejado','Prompt inicial','Senha da API'],c:0,t:'Processos'},
{q:'Um agente se diferencia por...',a:['Usar ferramentas e encadear ações','Ter texto maior','Sempre ser autônomo'],c:0,t:'Agentes'},
{q:'A autonomia de um agente deve...',a:['Ser máxima desde o início','Ser proporcional ao risco','Ignorar permissões'],c:1,t:'Agentes'},
{q:'Credenciais devem...',a:['Ficar em mecanismos seguros de credenciais','Ser escritas no prompt','Ser enviadas por chat público'],c:0,t:'Segurança'},
{q:'Human-in-the-loop significa...',a:['Eliminar pessoas','Inserir revisão/aprovação humana em pontos do fluxo','Usar somente humanos'],c:1,t:'Segurança'},
{q:'Uma IA é boa candidata para...',a:['Interpretar mensagem livre','Comparar igualdade exata','Somar 2+2 em workflow'],c:0,t:'Gemini'},
{q:'Qual é uma boa métrica de automação?',a:['Cor do botão','Tempo médio do processo antes/depois','Quantidade de palavras no prompt'],c:1,t:'Resultados'},
{q:'Em prompt profissional, entrada variável é...',a:['O dado que muda a cada execução','A cor do site','A senha do usuário'],c:0,t:'Prompts'},
{q:'Se a IA retorna baixa confiança, o workflow pode...',a:['Encaminhar para revisão humana','Inventar dados','Ignorar'],c:0,t:'Workflows'},
{q:'Qual risco aumenta ao conectar ferramentas a um agente?',a:['Risco operacional de ações','Somente risco estético','Nenhum'],c:0,t:'Agentes'},
{q:'Conector é...',a:['Integração pronta entre plataforma e serviço','Um tipo de prompt','Uma planilha'],c:0,t:'Integrações'},
{q:'Automatizar um processo ruim...',a:['Pode acelerar erros e desperdícios','Sempre resolve o problema','Elimina necessidade de análise'],c:0,t:'Processos'},
{q:'A validação humana é mais importante quando...',a:['A ação tem maior impacto ou é irreversível','O texto é apenas rascunho interno','A regra é simples'],c:0,t:'Segurança'}
,{q:'Um workflow recebe JSON sintaticamente válido, mas score=999 onde o limite é 100. Qual camada falhou?',a:['Sintaxe JSON','Regra semântica/de negócio','Conexão TLS','HTML'],c:1,t:'APIs'}
,{q:'Qual abordagem reduz falhas quando a IA alimenta um workflow?',a:['Saída livre com introdução textual','Saída estruturada + validação','Remover todos os campos obrigatórios','Usar apenas respostas longas'],c:1,t:'Prompts'}
,{q:'Uma API retorna 401. O primeiro ponto a verificar é:',a:['Autenticação/credencial','Cor do nó','Quantidade de texto','Nome da planilha'],c:0,t:'APIs'}
,{q:'Uma API retorna 429 após muitas chamadas. Uma resposta adequada é:',a:['Retry com espera/backoff e respeito ao limite','Loop infinito imediato','Ignorar o status','Duplicar chamadas'],c:0,t:'Automação'}
,{q:'Se reexecutar um workflow cria pedidos duplicados, qual conceito deve ser considerado?',a:['Idempotência','CSS','Few-shot','Temperatura visual'],c:0,t:'Automação'}
,{q:'No troubleshooting, qual prática é mais eficiente?',a:['Alterar vários nós ao mesmo tempo','Localizar o primeiro nó com saída inesperada','Recriar tudo sem observar dados','Ignorar a entrada'],c:1,t:'Automação'}
,{q:'Few-shot prompting é útil principalmente para:',a:['Ensinar um padrão por exemplos','Criptografar tokens','Hospedar APIs','Substituir validação'],c:0,t:'Prompts'}
,{q:'Human-in-the-loop é especialmente importante quando:',a:['A ação tem impacto relevante ou risco alto','O texto usa poucas palavras','O workflow possui cor azul','Não existem dados'],c:0,t:'Agentes'}
,{q:'Em um agente, uma ferramenta bem definida deve informar:',a:['Quando usar e quais argumentos fornecer','A cor preferida do usuário','Somente o nome comercial','A resolução da tela'],c:0,t:'Agentes'}
,{q:'Qual é um sinal de contrato quebrado entre nós?',a:['Campo anterior chama email_cliente e próximo espera email','Os dois nós usam o mesmo campo','Status 200 com dados esperados','JSON validado'],c:0,t:'Workflows'}

,{q:'Quando há apenas duas rotas simples, qual nó costuma ser mais direto?',a:['IF','Merge','Wait'],c:0,t:'n8n intermediário'}
,{q:'Quando existem várias categorias possíveis de roteamento, qual nó tende a ser mais adequado?',a:['Switch','Wait','Webhook'],c:0,t:'n8n intermediário'}
,{q:'Qual é a finalidade principal do Merge?',a:['Recombinar dados/caminhos','Criar credenciais','Treinar o Gemini'],c:0,t:'n8n intermediário'}
,{q:'Loop Over Items é útil quando...',a:['Precisamos processar itens em lotes ou controlar iterações','Queremos apenas mudar o título do workflow','Precisamos ocultar credenciais'],c:0,t:'n8n intermediário'}
,{q:'O nó Wait é útil para...',a:['Pausar uma execução até um tempo ou condição de retomada','Converter qualquer texto em JSON','Substituir um webhook'],c:0,t:'n8n intermediário'}
,{q:'Retry infinito diante de 429 é uma boa estratégia?',a:['Não; deve haver limite e espera/backoff','Sim; quanto mais rápido melhor','Sim; 429 significa sucesso parcial'],c:0,t:'Resiliência'}
,{q:'Por que limitar batch size em uma integração?',a:['Para controlar volume e reduzir risco de rate limit','Para aumentar o tamanho da fonte','Para eliminar a necessidade de dados'],c:0,t:'Resiliência'}
,{q:'Um Error Workflow serve para...',a:['Tratar/registrar falhas de outro workflow','Criar uma senha','Trocar IF por Gemini'],c:0,t:'Resiliência'}
,{q:'Ao reconstruir um workflow quebrado, qual passo é mais seguro?',a:['Localizar o primeiro contrato de dados rompido','Alterar todos os nós ao mesmo tempo','Apagar o histórico de execução'],c:0,t:'Troubleshooting'}
,{q:'Se duas branches produzem dados que serão usados juntas depois, qual conceito é central?',a:['Merge/recombinação','Webhook público','Temperatura do modelo'],c:0,t:'n8n intermediário'}
,{q:'Qual é a principal vantagem de um sub-workflow bem definido?',a:['Reutilizar uma responsabilidade com contrato claro','Esconder todos os erros','Evitar qualquer entrada de dados'],c:0,t:'Arquitetura'}
,{q:'No Execute Sub-workflow, o contrato de entrada serve para...',a:['Definir dados esperados entre workflow pai e filho','Guardar senha do Gmail','Aumentar a fonte do editor'],c:0,t:'Arquitetura'}
,{q:'Qual indicador ajuda a avaliar confiabilidade operacional?',a:['Taxa de sucesso das execuções','Quantidade de cores do workflow','Tamanho do nome do nó'],c:0,t:'Observabilidade'}
,{q:'Correlation ID é útil para...',a:['Rastrear uma mesma transação entre etapas e sistemas','Criptografar a API automaticamente','Substituir credenciais'],c:0,t:'Observabilidade'}
,{q:'Um custo pequeno por execução pode se tornar relevante quando...',a:['O volume de execuções cresce','O workflow tem poucos nós','O nome do projeto é curto'],c:0,t:'Custos'}
,{q:'Credenciais e tokens devem ser...',a:['Gerenciados por mecanismos próprios de credenciais/segredos','Hard-coded em prompts','Colocados em comentários públicos'],c:0,t:'Segurança'}
,{q:'Princípio do menor privilégio significa...',a:['Conceder apenas permissões necessárias à tarefa','Dar acesso administrativo a todos','Reutilizar a mesma senha em tudo'],c:0,t:'Segurança'}
,{q:'Observabilidade é diferente de apenas registrar logs porque...',a:['Também busca entender saúde, comportamento e impacto do sistema','Elimina a necessidade de métricas','Serve somente para alterar prompts'],c:0,t:'Observabilidade'}
,{q:'Antes de publicar um workflow em produção, é importante...',a:['Testar caminho feliz, exceções, segurança e rollback/tratamento','Apagar os logs','Remover toda validação'],c:0,t:'Produção'}
,{q:'Quando uma automação deve ser modularizada?',a:['Quando há responsabilidades reutilizáveis ou fluxo grande/difícil de manter','Sempre que existe um único nó','Somente quando há erro 404'],c:0,t:'Arquitetura'}
,{"q": "Qual é a principal diferença entre saída estruturada e tool calling?", "a": ["Saída estruturada formata a resposta final; tool calling solicita uma ação externa", "São a mesma coisa", "Tool calling só serve para JSON"], "c": 0, "t": "Agentes"}
,{"q": "Quando um agente tende a ser mais justificável?", "a": ["Quando a sequência de passos e ferramentas pode variar conforme o caso", "Quando há uma única regra fixa", "Quando só precisamos formatar texto"], "c": 0, "t": "Agentes"}
,{"q": "Qual é uma boa política para uma ferramenta de exclusão?", "a": ["Exigir forte governança/aprovação e limitar escopo", "Executar sempre automaticamente", "Dar permissão administrativa ampla"], "c": 0, "t": "Segurança"}
,{"q": "Memória persistente deve guardar...", "a": ["Somente dados necessários, com propósito e governança", "Todo dado recebido", "Segredos e senhas para facilitar"], "c": 0, "t": "Agentes"}
,{"q": "O que mede tool accuracy em uma avaliação de agente?", "a": ["Se o agente escolheu a ferramenta adequada", "Se o texto ficou bonito", "Se a execução foi longa"], "c": 0, "t": "Agentes"}
,{"q": "Por que manter casos de teste fixos após mudar um agente?", "a": ["Para detectar regressões", "Para aumentar tokens", "Para evitar logs"], "c": 0, "t": "Resultados"}
,{"q": "Human-in-the-loop é mais valioso em...", "a": ["Ações de maior risco ou difícil reversão", "Toda leitura simples obrigatoriamente", "Nenhuma ação"], "c": 0, "t": "Segurança"}
,{"q": "Se um workflow determinístico resolve completamente o problema...", "a": ["Ele pode ser preferível a um agente por simplicidade e previsibilidade", "Um agente sempre é obrigatório", "Deve-se adicionar memória longa"], "c": 0, "t": "Workflows"}
,{"q": "Quem executa uma função customizada solicitada por tool calling?", "a": ["A aplicação/ambiente externo, que depois devolve o resultado ao modelo", "O modelo necessariamente executa tudo sozinho", "O navegador sem código"], "c": 0, "t": "APIs"}
,{"q": "Qual é um risco de memória excessiva em agentes?", "a": ["Persistir dados sem necessidade e ampliar exposição", "Reduzir contexto", "Eliminar custo"], "c": 0, "t": "Segurança"}

,{q:'Qual evidência é mais útil para demonstrar melhoria após automatizar um processo?',a:['Indicadores comparáveis antes e depois','Quantidade de nós no workflow','Tamanho do prompt'],c:0,t:'Resultados'}
,{q:'Em uma solução pronta para operação, rollback significa...',a:['Ter uma forma planejada de voltar ou interromper a mudança com segurança','Apagar todos os logs','Repetir a execução indefinidamente'],c:0,t:'Produção'}
,{q:'Qual é uma boa prática para contratos entre sub-workflows?',a:['Definir campos esperados de entrada e saída','Usar nomes aleatórios em cada execução','Compartilhar credenciais como dados de entrada'],c:0,t:'Produção'}
,{q:'Se um agente precisa enviar e-mail para destinatários externos, o controle mais adequado pode ser...',a:['Preparar a ação e exigir aprovação humana conforme risco','Dar permissão irrestrita e ocultar logs','Ignorar destinatário e assunto'],c:0,t:'Agentes'}
,{q:'Observabilidade serve principalmente para...',a:['Entender comportamento, falhas, duração e resultados das execuções','Aumentar a quantidade de prompts','Substituir validação'],c:0,t:'Produção'}
,{q:'Qual é o melhor motivo para modularizar um workflow grande?',a:['Reduzir acoplamento e facilitar manutenção/reuso','Aumentar o número de telas','Evitar qualquer documentação'],c:0,t:'n8n'}
,{q:'Ao estimar custo de uma automação com IA, devemos considerar...',a:['Chamadas de IA, volume, revisões humanas e operação','Somente o preço do computador','Somente a quantidade de caracteres do nome do workflow'],c:0,t:'Resultados'}
,{q:'Qual princípio ajuda a reduzir risco de credenciais?',a:['Menor privilégio e escopos mínimos','Usar conta administrativa para tudo','Colocar token em campo público'],c:0,t:'Segurança'}
,{q:'Uma avaliação de agente deve incluir cenários de exceção porque...',a:['O caminho feliz sozinho não revela falhas de política, ferramenta ou escalonamento','Exceções nunca acontecem','Serve apenas para aumentar a nota'],c:0,t:'Agentes'}
,{q:'O certificado gerado pelo site é simbólico porque...',a:['O site não comprova critérios institucionais como identidade e frequência','O curso não possui conteúdo','A avaliação não existe'],c:0,t:'Resultados'}
];

function validateJsonLab(){const el=document.getElementById('jsonLabInput'),out=document.getElementById('jsonLabResult');if(!el||!out)return;let d;try{d=JSON.parse(el.value)}catch(e){out.innerHTML='<div class="feedback show no">❌ Camada 1 falhou: JSON inválido. '+e.message+'</div>';return}const missing=['categoria','score','email'].filter(k=>!(k in d));if(missing.length){out.innerHTML='<div class="feedback show no">⚠️ Camada 1 OK, mas a estrutura está incompleta. Faltam: '+missing.join(', ')+'</div>';return}const cats=['LEAD_QUENTE','LEAD_MORNO','LEAD_FRIO','REVISAR'];const problems=[];if(!cats.includes(d.categoria))problems.push('categoria fora das opções permitidas');if(typeof d.score!=='number'||d.score<0||d.score>100)problems.push('score deve ser número de 0 a 100');if(typeof d.email!=='string'||!d.email.includes('@'))problems.push('email inválido');if(problems.length){out.innerHTML='<div class="feedback show no">✅ Sintaxe e estrutura OK. ⚠️ Regra de negócio falhou: '+problems.join('; ')+'.</div>';return}out.innerHTML='<div class="feedback show ok">✅ As três camadas passaram: JSON válido, estrutura esperada e valores compatíveis com as regras.</div>'}
function loadBadJson(){const el=document.getElementById('jsonLabInput');if(el)el.value='{"categoria":"VIP","score":999,"email":"sem-arroba"}';validateJsonLab()}
const DEBUG_CASES={field:{title:'Campo não encontrado',symptom:'O nó IF usa {{$json.email}}, mas recebe undefined. O nó anterior exibiu {"email_cliente":"ana@exemplo.com"}.',options:['A API está fora do ar','O nome/caminho do campo mudou','A chave de API expirou'],correct:1,why:'O contrato entre nós não coincide: email ≠ email_cliente. Ajuste o mapeamento ou normalize os campos.'},json:{title:'JSON imprevisível da IA',symptom:'O parser falha algumas vezes porque a resposta começa com “Claro! Aqui está:” antes do objeto JSON.',options:['Usar saída estruturada/schema e validar','Aumentar a fonte da interface','Duplicar o nó IF'],correct:0,why:'Workflows precisam de saída previsível. Use formato estruturado e valide antes de consumir.'},auth:{title:'API retorna 401',symptom:'O HTTP Request chega ao serviço, mas recebe 401 Unauthorized.',options:['Adicionar mais texto ao prompt','Revisar autenticação/credencial/token','Trocar POST por planilha'],correct:1,why:'401 indica problema de autenticação. Verifique credencial, token, escopo e expiração.'},rate:{title:'API retorna 429',symptom:'O workflow funciona em poucos testes, mas falha quando muitas requisições são enviadas rapidamente.',options:['Implementar espera/retry e respeitar rate limit','Remover toda validação','Reenviar em loop sem limite'],correct:0,why:'429 indica limite de requisições. Reduza ritmo, implemente backoff/retry e trate a exceção.'},duplicate:{title:'Registro duplicado',symptom:'Após uma falha de rede, o workflow foi reexecutado e criou dois pedidos iguais.',options:['Pensar em idempotência/chave única antes de criar','Aumentar a temperatura do modelo','Executar três vezes para confirmar'],correct:0,why:'Ação repetida precisa ser segura. Use identificador único, verificação prévia ou estratégia idempotente.'}};
function renderDebugScenario(){const sel=document.getElementById('debugScenario'),box=document.getElementById('debugCase'),opts=document.getElementById('debugOptions'),feed=document.getElementById('debugFeedback');if(!sel||!box||!opts)return;const c=DEBUG_CASES[sel.value];box.innerHTML='<h3>'+c.title+'</h3><p>'+c.symptom+'</p>';opts.innerHTML=c.options.map((o,i)=>'<button class="option" onclick="answerDebug('+i+')">'+o+'</button>').join('');if(feed)feed.innerHTML=''}
function answerDebug(i){const sel=document.getElementById('debugScenario'),feed=document.getElementById('debugFeedback'),c=DEBUG_CASES[sel.value];feed.innerHTML='<div class="feedback show '+(i===c.correct?'ok':'no')+'">'+(i===c.correct?'✅ Correto. ':'💡 Ainda não. ')+c.why+'</div>'}
function shuffle(a){return [...a].sort(()=>Math.random()-.5)}
function initAssessment(){const w=document.getElementById('dynamicAssessment');if(!w)return;let chosen;try{chosen=JSON.parse(sessionStorage.getItem(COURSE_PREFIX+'questions')||'null')}catch(e){}if(!chosen){chosen=shuffle(QUESTION_BANK.map((_,i)=>i)).slice(0,12);sessionStorage.setItem(COURSE_PREFIX+'questions',JSON.stringify(chosen))}w.innerHTML=chosen.map((idx,n)=>{const q=QUESTION_BANK[idx],order=shuffle(q.a.map((_,i)=>i));return `<div class="quiz dynamic-q" data-qidx="${idx}"><div class="quiz-question">${n+1}. ${q.q}</div>${order.map(i=>`<label class="option" style="display:block"><input type="radio" name="q${n}" value="${i}"> ${q.a[i]}</label>`).join('')}<div class="feedback"></div></div><br>`}).join('')}
function gradeAssessment(){const qs=[...document.querySelectorAll('.dynamic-q')];let correct=0,answered=0,cats={};qs.forEach(q=>{const idx=+q.dataset.qidx,item=QUESTION_BANK[idx],p=q.querySelector('input:checked'),f=q.querySelector('.feedback');if(!p)return;answered++;const ok=+p.value===item.c;if(ok)correct++;cats[item.t]=cats[item.t]||[0,0];cats[item.t][1]++;if(ok)cats[item.t][0]++;f.className='feedback show '+(ok?'ok':'no');f.textContent=ok?'✅ Correto.':'💡 Resposta correta: '+item.a[item.c]});const r=document.getElementById('assessmentResult');if(answered<qs.length){r.innerHTML=`Responda todas as questões. ${answered}/${qs.length} respondidas.`;return}const pct=Math.round(correct/qs.length*100);localStorage.setItem(COURSE_PREFIX+'score',pct);const best=Math.max(pct,+localStorage.getItem(COURSE_PREFIX+'best')||0);localStorage.setItem(COURSE_PREFIX+'best',best);localStorage.setItem(COURSE_PREFIX+'cats',JSON.stringify(cats));localStorage.setItem(COURSE_PREFIX+'assessment_at',new Date().toISOString());r.innerHTML=`<div class="final-score">${pct}%</div><strong>${correct} de ${qs.length}</strong><br>Melhor resultado: ${best}%<div class="hero-actions" style="margin-top:1rem"><a class="btn btn-primary" href="resultado-final.html">Ver desempenho consolidado →</a></div>`}
function getCourseData(){const o={version:9,exportedAt:new Date().toISOString(),items:{}};Object.keys(localStorage).filter(k=>k.startsWith(COURSE_PREFIX)).forEach(k=>o.items[k]=localStorage.getItem(k));return o}
function exportCourseData(){const b=new Blob([JSON.stringify(getCourseData(),null,2)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='backup-aperfeicoamento-ia.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),500)}
function importCourseData(input){const f=input.files?.[0];if(!f)return;const r=new FileReader();r.onload=()=>{try{const d=JSON.parse(r.result);if(!d.items)throw 0;if(!confirm('Substituir os dados atuais deste curso?'))return;Object.keys(localStorage).filter(k=>k.startsWith(COURSE_PREFIX)).forEach(k=>localStorage.removeItem(k));Object.entries(d.items).forEach(([k,v])=>{if(k.startsWith(COURSE_PREFIX))localStorage.setItem(k,v)});location.reload()}catch(e){alert('Backup inválido.')}};r.readAsText(f)}
function updateDataSummary(){const e=document.getElementById('dataSummary');if(!e)return;const keys=Object.keys(localStorage).filter(k=>k.startsWith(COURSE_PREFIX));e.innerHTML=`<strong>${keys.length}</strong> registros locais • ${getDone().length}/10 módulos concluídos • melhor avaliação: ${localStorage.getItem(COURSE_PREFIX+'best')||'—'}%`}
function applyPreferences(){const theme=localStorage.getItem(COURSE_PREFIX+'theme');if(theme)document.documentElement.dataset.theme=theme}
function addAccessTools(){if(document.querySelector('.access-tools'))return;const d=document.createElement('div');d.className='access-tools no-print';d.innerHTML='<button title="Alternar tema" onclick="toggleTheme()">◐</button><button title="Aumentar texto" onclick="changeFont(1)">A+</button><button title="Diminuir texto" onclick="changeFont(-1)">A−</button>';document.body.appendChild(d)}
function toggleTheme(){const dark=document.documentElement.dataset.theme==='dark';document.documentElement.dataset.theme=dark?'light':'dark';localStorage.setItem(COURSE_PREFIX+'theme',dark?'light':'dark')}
function changeFont(d){const cur=+(localStorage.getItem(COURSE_PREFIX+'font')||100);const v=Math.min(125,Math.max(90,cur+d*5));document.documentElement.style.fontSize=v+'%';localStorage.setItem(COURSE_PREFIX+'font',v)}
function initPrefs(){applyPreferences();const f=localStorage.getItem(COURSE_PREFIX+'font');if(f)document.documentElement.style.fontSize=f+'%';addAccessTools()}

function validateWebhookLab(){const el=document.getElementById('webhookPayload'),result=document.getElementById('webhookLabResult'),out=document.getElementById('webhookNormalized');if(!el||!result)return;let d;try{d=JSON.parse(el.value)}catch(e){result.innerHTML='<div class="feedback show no">❌ O corpo recebido não é JSON válido.</div>';out.textContent='{}';return}const req=['nome','email','mensagem'];const missing=req.filter(k=>typeof d[k]!=='string'||!d[k].trim());if(missing.length){result.innerHTML='<div class="feedback show no">⚠️ Evento recebido, mas faltam campos obrigatórios: '+missing.join(', ')+'. O fluxo deve ser interrompido ou roteado para tratamento.</div>';out.textContent=JSON.stringify(d,null,2);return}const norm={nome:d.nome.trim(),email:d.email.trim().toLowerCase(),mensagem:d.mensagem.trim(),origem:d.origem||'nao-informada'};localStorage.setItem(COURSE_PREFIX+'v3_webhook',JSON.stringify(norm));result.innerHTML='<div class="feedback show ok">✅ Entrada válida. O payload já pode alimentar os próximos nós.</div>';out.textContent=JSON.stringify(norm,null,2)}
function loadWebhookError(){const el=document.getElementById('webhookPayload');if(el)el.value='{"nome":"Marina","mensagem":"Quero orçamento"}';validateWebhookLab()}
function buildN8nExpression(){const f=document.getElementById('exprField'),s=document.getElementById('exprSource'),o=document.getElementById('exprOutput'),e=document.getElementById('exprExplain');if(!f||!s)return;const expr=s.value==='current'?`{{ $json.${f.value} }}`:`{{ $('Webhook').item.json.${f.value} }}`;o.textContent=expr;e.innerHTML=s.value==='current'?`Essa expressão lê <strong>${f.value}</strong> do item atual.`:`Essa expressão referencia <strong>${f.value}</strong> diretamente do nó Webhook.`}
function simulateGeminiIf(){const txt=(document.getElementById('geminiLeadText')?.value||'').trim(),threshold=Math.max(0,Math.min(100,+document.getElementById('geminiThreshold').value||70)),out=document.getElementById('geminiStructured'),route=document.getElementById('geminiRoute');if(!txt){route.innerHTML='<div class="feedback show no">Informe uma mensagem.</div>';return}const lower=txt.toLowerCase();let score=40;if(/contrat|compr|orçament|pedido|assinatura/.test(lower))score+=25;if(/\b\d+\b/.test(lower))score+=10;if(/semana|urgente|hoje|amanhã|prazo/.test(lower))score+=10;score=Math.min(100,score);let categoria=score>=80?'LEAD_QUENTE':score>=60?'LEAD_MORNO':score>=35?'LEAD_FRIO':'REVISAR';const precisa=categoria==='REVISAR';const d={categoria,score,resumo:txt.slice(0,110)+(txt.length>110?'…':''),precisa_humano:precisa};out.textContent=JSON.stringify(d,null,2);localStorage.setItem(COURSE_PREFIX+'v3_gemini',JSON.stringify(d));const pass=score>=threshold&&!precisa;route.innerHTML=`<div class="feedback show ${pass?'ok':'no'}">${pass?'✅ Rota VERDADEIRA':'➡️ Rota FALSA/REVISÃO'}: score ${score} ${pass?'≥':'<'} ${threshold}${precisa?' e requer revisão humana':''}.</div>`}
function simulateFinalN8n(){const cat=document.getElementById('finalCategory')?.value,score=+document.getElementById('finalScore')?.value||0,approved=!!document.getElementById('finalApproved')?.checked,out=document.getElementById('finalExecution');if(!out)return;const log=[];log.push(['ok','Google Sheets','Linha registrada com categoria '+cat+' e score '+score+'.']);if(cat==='REVISAR'){log.push(['warn','Roteamento','Categoria REVISAR: encaminhado para análise humana.']);}else if(score>=70){log.push(['ok','Preparação','Mensagem de retorno preparada.']);if(approved)log.push(['ok','Gmail','Aprovação confirmada: envio simulado concluído.']);else log.push(['warn','Aprovação','Workflow aguardando aprovação humana antes do Gmail.']);}else{log.push(['warn','IF','Score abaixo do limite: sem envio comercial automático.']);}out.innerHTML=log.map(x=>`<div class="exec-line ${x[0]}"><strong>${x[1]}</strong><span>${x[2]}</span></div>`).join('');localStorage.setItem(COURSE_PREFIX+'v3_final',JSON.stringify({cat,score,approved}))}



// ===== V4: simuladores n8n intermediário =====
function simulateRouting(){
  const score=+(document.getElementById('routeScore')?.value||0),category=document.getElementById('routeCategory')?.value||'LEAD_FRIO',mode=document.querySelector('input[name="routeMode"]:checked')?.value||'if',out=document.getElementById('routeResult');
  if(!out)return;let route='';
  if(mode==='if') route=score>=70?'VERDADEIRO → Comercial':'FALSO → Nutrição/Revisão';
  else route=category==='LEAD_QUENTE'?'Saída 1 → Comercial':category==='LEAD_MORNO'?'Saída 2 → Nutrição':category==='LEAD_FRIO'?'Saída 3 → Automação leve':'Fallback → Humano';
  out.innerHTML='<div class="feedback show ok"><strong>'+mode.toUpperCase()+'</strong>: '+route+'</div>';
  document.querySelectorAll('.route-box').forEach(x=>x.classList.remove('active'));
  const id=mode==='if'?(score>=70?'r-commercial':'r-review'):(category==='LEAD_QUENTE'?'r-commercial':category==='LEAD_MORNO'?'r-nurture':category==='LEAD_FRIO'?'r-low':'r-review');document.getElementById(id)?.classList.add('active');
}
function simulateMerge(){
  const strategy=document.getElementById('mergeStrategy')?.value||'append',out=document.getElementById('mergeOutput');if(!out)return;
  const a=[{id:1,nome:'Ana'},{id:2,nome:'Bruno'}],b=[{id:1,score:82},{id:2,score:51}];let r;
  if(strategy==='append')r=[...a,...b];else r=a.map(x=>({...x,...(b.find(y=>y.id===x.id)||{})}));out.textContent=JSON.stringify(r,null,2);
}
function simulateLoop(){
  const size=Math.max(1,Math.min(5,+document.getElementById('batchSize')?.value||2)),out=document.getElementById('loopConsole'),items=[1,2,3,4,5,6,7,8].map(i=>'Lead '+i);if(!out)return;
  const batches=[];for(let i=0;i<items.length;i+=size)batches.push(items.slice(i,i+size));
  out.textContent=batches.map((b,i)=>`Lote ${i+1}/${batches.length}: ${b.join(', ')}\n→ processar\n${i<batches.length-1?'→ próxima iteração':'→ saída Done'}`).join('\n\n');
  const view=document.getElementById('batchView');if(view)view.innerHTML=items.map((x,i)=>`<span class="batch-item ${i<size?'processing':'waiting'}">${x}</span>`).join('');
}
function simulateRetry(){
  const status=+(document.getElementById('retryStatus')?.value||429),max=Math.max(0,Math.min(5,+document.getElementById('retryMax')?.value||3)),base=Math.max(1,+document.getElementById('retryBase')?.value||2),out=document.getElementById('retryOutput'),tl=document.getElementById('retryTimeline');if(!out)return;
  let log=[],steps=[];
  if(status>=200&&status<300){log.push('Tentativa 1 → '+status+' → sucesso');steps.push(['ok','1','sucesso']);}
  else if(status===400||status===401||status===403||status===404){log.push('Tentativa 1 → '+status+' → erro não transitório');log.push('Ação: corrigir dados/credencial/endpoint antes de repetir.');steps.push(['fail','1',status]);}
  else {for(let i=0;i<=max;i++){if(i===max){log.push(`Tentativa ${i+1} → ${status} → limite de retries atingido`);steps.push(['fail',i+1,status]);break}const wait=base*Math.pow(2,i);log.push(`Tentativa ${i+1} → ${status} → aguardar ${wait}s`);steps.push(['fail',i+1,status]);steps.push(['wait','',wait+'s']);}log.push('Encaminhar para tratamento de erro/alerta.');}
  out.textContent=log.join('\n');if(tl)tl.innerHTML=steps.map(s=>`<span class="retry-step ${s[0]}">${s[1]?'T'+s[1]+' · ':''}${s[2]}</span>`).join('');
}
const BROKEN_WORKFLOWS={
 mapping:{title:'Contrato quebrado',nodes:['Webhook ✅','Edit Fields ✅','Gemini ✅','IF ❌ espera {{$json.email}}','Gmail ⏸'],why:'O IF usa um campo que não existe no item atual. Corrija o mapeamento ou normalize o nome antes da condição.',fix:'Mapear email_cliente → email antes do IF.'},
 switch:{title:'Roteamento incompleto',nodes:['Webhook ✅','Gemini ✅','Switch ⚠️ sem fallback','CRM ✅'],why:'Categorias inesperadas podem não ter rota. Um fallback evita itens perdidos silenciosamente.',fix:'Adicionar saída fallback → Revisão humana.'},
 loop:{title:'Rate limit em lote',nodes:['Sheets ✅ 200 itens','HTTP Request ❌ 429','Loop inexistente','Fim'],why:'Todos os itens estão sendo enviados sem controle de volume. Use lotes/espera e limite de retry.',fix:'Loop Over Items + batch pequeno + Wait/backoff.'},
 error:{title:'Erro sem observabilidade',nodes:['Trigger ✅','API ❌ 500','Workflow encerra','Sem alerta'],why:'A falha não possui tratamento ou notificação. Crie estratégia de erro e registro.',fix:'Error Workflow/alerta + contexto da execução.'}
};
function renderBrokenScenario(){const sel=document.getElementById('brokenScenario'),canvas=document.getElementById('brokenCanvas'),out=document.getElementById('brokenFeedback');if(!sel||!canvas)return;const c=BROKEN_WORKFLOWS[sel.value];canvas.innerHTML=c.nodes.map(n=>`<div class="broken-node ${n.includes('❌')?'error':''}"><strong>${n}</strong></div>`).join('');if(out)out.innerHTML=''}
function diagnoseBroken(){const c=BROKEN_WORKFLOWS[document.getElementById('brokenScenario').value],out=document.getElementById('brokenFeedback');out.innerHTML=`<div class="feedback show ok"><strong>Diagnóstico:</strong> ${c.why}<br><strong>Correção recomendada:</strong> ${c.fix}</div>`}

document.addEventListener('DOMContentLoaded',()=>{if(document.getElementById('debugScenario'))renderDebugScenario();updateProgress();updateDashboard();initNotes();initLabFields();initProject();restoreWorkflow();initAgent();initAssessment();updateDataSummary();initPrefs();if(document.getElementById('exprField'))buildN8nExpression();if(document.getElementById('brokenScenario'))renderBrokenScenario();if(document.getElementById('routeScore'))simulateRouting();if(document.getElementById('mergeOutput'))simulateMerge();if(document.getElementById('batchSize'))simulateLoop();if(document.getElementById('retryStatus'))simulateRetry()});


// ===== V5: produção, observabilidade e arquitetura =====
function simulateSubworkflow(){
  const id=(document.getElementById('subLeadId')?.value||'').trim(),email=(document.getElementById('subEmail')?.value||'').trim(),msg=(document.getElementById('subMsg')?.value||'').trim(),out=document.getElementById('subResult');if(!out)return;
  const errs=[];if(!id)errs.push('lead_id obrigatório');if(!/^\S+@\S+\.\S+$/.test(email))errs.push('email inválido');if(msg.length<8)errs.push('mensagem curta/ausente');
  if(errs.length){out.innerHTML='<div class="feedback show no">❌ Contrato rejeitado: '+errs.join('; ')+'</div>';return}
  const lower=msg.toLowerCase();const score=Math.min(100,40+(/orçamento|contrat|compr|assinatura/.test(lower)?30:0)+( /urgente|semana|prazo/.test(lower)?15:0));const category=score>=70?'LEAD_QUENTE':score>=50?'LEAD_MORNO':'LEAD_FRIO';
  const result={lead_id:id,categoria:category,score,needs_human:score<50};localStorage.setItem(COURSE_PREFIX+'v5_subworkflow',JSON.stringify(result));out.innerHTML='<div class="feedback show ok">✅ Contrato aceito. Retorno do sub-workflow:</div><pre class="sim-console">'+JSON.stringify(result,null,2)+'</pre>';
}
function simulateObservability(){
  const total=Math.max(1,+document.getElementById('obsTotal')?.value||1000),fails=Math.max(0,Math.min(total,+document.getElementById('obsFails')?.value||20)),avg=Math.max(0,+document.getElementById('obsAvg')?.value||1.8),human=Math.max(0,+document.getElementById('obsHuman')?.value||80),cards=document.getElementById('obsMetrics'),log=document.getElementById('obsLog');if(!cards)return;
  const success=((total-fails)/total*100),review=(human/total*100),p95=(avg*1.9).toFixed(1);cards.innerHTML=`<div class="metric-box"><small>Sucesso</small><strong class="${success>=99?'status-good':success>=95?'status-warn':'status-bad'}">${success.toFixed(1)}%</strong></div><div class="metric-box"><small>Duração média</small><strong>${avg.toFixed(1)}s</strong></div><div class="metric-box"><small>P95 estimado</small><strong>${p95}s</strong></div><div class="metric-box"><small>Revisão humana</small><strong>${review.toFixed(1)}%</strong></div>`;
  const cid='lead-'+Date.now().toString().slice(-6);if(log)log.textContent=`[INFO] correlation_id=${cid} workflow=qualificacao start\n[INFO] node=Gemini status=ok duration_ms=${Math.round(avg*350)}\n[INFO] node=IF route=${review>20?'REVIEW':'AUTO'}\n[${fails?'WARN':'INFO'}] total=${total} failures=${fails} success_rate=${success.toFixed(2)}%\n[INFO] workflow=end`;
}
function calculateCapacity(){
  const exec=Math.max(0,+document.getElementById('capExec')?.value||0),calls=Math.max(0,+document.getElementById('capCalls')?.value||0),callCost=Math.max(0,+document.getElementById('capCallCost')?.value||0),reviewPct=Math.max(0,Math.min(100,+document.getElementById('capReview')?.value||0)),mins=Math.max(0,+document.getElementById('capMinutes')?.value||0),hour=Math.max(0,+document.getElementById('capHour')?.value||0),out=document.getElementById('capResult');if(!out)return;
  const ai=exec*calls*callCost,humanExec=exec*(reviewPct/100),humanHours=humanExec*mins/60,humanCost=humanHours*hour,total=ai+humanCost;out.innerHTML=`<div class="cost-grid"><div class="cost-card"><small>Custo IA/mês</small><strong>R$ ${ai.toFixed(2)}</strong></div><div class="cost-card"><small>Revisão humana</small><strong>${humanHours.toFixed(1)} h</strong><span>R$ ${humanCost.toFixed(2)}</span></div><div class="cost-card"><small>Custo operacional estimado</small><strong>R$ ${total.toFixed(2)}</strong></div></div><p class="small">Simulação didática. Use valores reais do seu provedor e do seu processo para decisão empresarial.</p>`;
}
function scoreSecrets(){
  const ids=['secPrompt','secShared','secAdmin','secRotation','secPublic','secScope'],weights=[3,2,3,2,3,2];let risk=0;ids.forEach((id,i)=>{if(document.getElementById(id)?.checked)risk+=weights[i]});const out=document.getElementById('secretRisk');if(!out)return;const level=risk>=10?'ALTO':risk>=5?'MÉDIO':'BAIXO';out.innerHTML=`<div class="risk-score ${risk>=10?'status-bad':risk>=5?'status-warn':'status-good'}">${level}</div><p>Score didático de risco: ${risk}/15.</p><p>${risk>=10?'Interrompa a publicação e corrija segredos/permissões antes de produção.':risk>=5?'Há pontos que devem ser tratados antes de escalar.':'Boas práticas básicas presentes; continue validando acesso e rotação.'}</p>`;
}
function initProductionChecklist(){document.querySelectorAll('[data-prod-check]').forEach(el=>{const k=COURSE_PREFIX+'prod_'+el.dataset.prodCheck;el.checked=localStorage.getItem(k)==='1';el.addEventListener('change',()=>{localStorage.setItem(k,el.checked?'1':'0');updateProductionReadiness()})});updateProductionReadiness();document.querySelectorAll('[data-arch]').forEach(el=>{const k=COURSE_PREFIX+'arch_'+el.dataset.arch;el.value=localStorage.getItem(k)||'';el.addEventListener('input',()=>localStorage.setItem(k,el.value))})}
function updateProductionReadiness(){const all=[...document.querySelectorAll('[data-prod-check]')];if(!all.length)return;const done=all.filter(x=>x.checked).length,pct=Math.round(done/all.length*100),meter=document.querySelector('.readiness-meter span'),label=document.getElementById('readinessLabel');if(meter)meter.style.width=pct+'%';if(label)label.textContent=`${done}/${all.length} itens • ${pct}%`}
function exportProductionChecklist(){const lines=[...document.querySelectorAll('[data-prod-check]')].map(x=>`${x.checked?'[x]':'[ ]'} ${x.dataset.label||x.parentElement.textContent.trim()}`);downloadText('CHECKLIST DE PRODUÇÃO — IA + n8n\n\n'+lines.join('\n'),'checklist-producao.txt')}
function exportArchitecture(){const fields=[['Responsável','owner'],['Objetivo/SLO','slo'],['Entrada','input'],['Sub-workflows','subflows'],['Credenciais','credentials'],['Tratamento de erro','errors'],['Observabilidade','observability'],['Custos/limites','cost'],['Rollback','rollback']];let out='ARQUITETURA DE PRODUÇÃO — IA + n8n\n\n';fields.forEach(([l,k])=>out+=l.toUpperCase()+'\n'+(localStorage.getItem(COURSE_PREFIX+'arch_'+k)||'(não preenchido)')+'\n\n');downloadText(out,'arquitetura-producao.txt')}

document.addEventListener('DOMContentLoaded',()=>{if(document.getElementById('subLeadId'))simulateSubworkflow();if(document.getElementById('obsTotal'))simulateObservability();if(document.getElementById('capExec'))calculateCapacity();if(document.getElementById('secretRisk'))scoreSecrets();initProductionChecklist()});


/* ===== V6: agentes profissionais ===== */
function recommendArchitecture(){
  const free=document.getElementById('adFreeText')?.checked,multi=document.getElementById('adMulti')?.checked,steps=document.getElementById('adSteps')?.checked,rules=document.getElementById('adRules')?.checked,risk=document.getElementById('adRisk')?.checked,audit=document.getElementById('adAudit')?.checked,out=document.getElementById('architectureRecommendation');if(!out)return;
  let title='Workflow determinístico',why='O caso parece previsível e pode ser modelado por regras claras.';
  if((free||multi)&&!steps){title='Workflow + IA em uma etapa';why='Use IA para interpretar/classificar e mantenha decisões/ações críticas em regras determinísticas.'}
  if(multi&&steps&&!audit){title='Agente com ferramentas e limites';why='Há seleção dinâmica de ferramentas e sequência variável de passos. Defina escopo, permissões e avaliação.'}
  if(risk||audit){why+=' Como há risco/auditabilidade, inclua aprovação humana e prefira rotas determinísticas para ações críticas.'}
  out.innerHTML=`<h3>${title}</h3><p>${why}</p>`;
}
function simulateToolCall(){
 const req=(document.getElementById('toolRequest')?.value||'').toLowerCase(),out=document.getElementById('toolDecision');if(!out)return;let name='nenhuma_ferramenta',args={},reason='O pedido pode ser respondido sem ação externa.';
 if(/pedido|status|situaç|situac/.test(req)){name='consultar_pedido';const m=req.match(/\b\d{3,}\b/);args={id:m?m[0]:'ID_NAO_INFORMADO'};reason='A resposta depende de consultar um sistema externo.'}
 else if(/tarefa|lembrete|atividade/.test(req)){name='criar_tarefa';args={titulo:'Revisar solicitação do cliente',prioridade:/urgente|alta/.test(req)?'alta':'normal'};reason='O usuário pediu criação de uma ação externa.'}
 else if(/enviar|mande|email|e-mail/.test(req)){name='enviar_email';args={destinatario:'DESTINATARIO_A_CONFIRMAR',assunto:'Solicitação do usuário'};reason='Enviar mensagem produz efeito externo e deve passar por política/aprovação.'}
 else if(/estoque|produto|quantidade/.test(req)){name='consultar_estoque';args={produto:'PRODUTO_EXTRAIDO_DO_PEDIDO'};reason='É necessária consulta a dados atuais de estoque.'}
 out.innerHTML=`<div class="tool-call-box"><h3>${name==='nenhuma_ferramenta'?'Resposta direta':'Function call proposto'}</h3><p>${reason}</p><pre>${JSON.stringify({name,args},null,2)}</pre>${name==='enviar_email'?'<p class="status-warn"><strong>Governança:</strong> antes de executar, valide destinatário e aprovação.</p>':''}</div>`;
}
function simulateMemory(){
 const name=document.getElementById('memName')?.value||'',pref=document.getElementById('memPref')?.value||'',sens=document.getElementById('memSensitive')?.value||'',persist=document.getElementById('memPersist')?.checked,out=document.getElementById('memoryOutput');if(!out)return;
 const session={nome:name,preferencia_contato:pref,dado_sensivel:'[USADO SOMENTE SE NECESSARIO NA SESSAO]'};const memory=persist?{preferencia_contato:pref}:{};
 out.textContent=`CONTEXTO DA SESSÃO\n${JSON.stringify(session,null,2)}\n\nMEMÓRIA PERSISTENTE\n${JSON.stringify(memory,null,2)}\n\nDECISÃO\n${sens?'Dado sensível informado: não persistir sem finalidade/necessidade e autorização apropriada.':'Nenhum dado sensível informado.'}`;
}
function evaluateApproval(){
 const action=document.getElementById('approvalAction')?.value,impact=document.getElementById('approvalImpact')?.value,out=document.getElementById('approvalDecision');if(!out)return;let mode='auto',title='🟢 Execução automática',text='Ação reversível/de baixo impacto dentro do escopo.';
 if(['send','refund'].includes(action)||impact==='medium'){mode='review';title='🟡 Exigir aprovação humana';text='A ação produz efeito externo relevante. O agente pode preparar, mas o humano aprova antes da execução.'}
 if(action==='delete'||(impact==='high'&&action!=='read')){mode='block';title='🔴 Bloquear ou exigir fluxo especial';text='Ação de alto impacto/irreversível. Exija política específica, autorização forte e trilha de auditoria.'}
 if(action==='read'&&impact==='high'){mode='review';title='🟡 Revisar acesso';text='Mesmo leitura pode ser sensível quando envolve dados de alto impacto.'}
 out.className='approval-decision '+mode;out.innerHTML=`<h3>${title}</h3><p>${text}</p>`;
}
const AGENT_TESTS=[
 ['Consultar status de pedido existente','tool','policy','complete','escalate'],
 ['Enviar resposta comercial ao cliente','tool','policy','complete','escalate'],
 ['Excluir cadastro solicitado em linguagem ambígua','tool','policy','complete','escalate'],
 ['Consultar estoque e propor alternativa','tool','policy','complete','escalate'],
 ['Emitir reembolso de alto valor','tool','policy','complete','escalate'],
 ['Pedido fora do escopo do agente','tool','policy','complete','escalate']
];
function initAgentEval(){const w=document.getElementById('agentEvalTable');if(!w)return;w.innerHTML='<div class="eval-row head"><span>Cenário</span><span>Ferramenta</span><span>Política</span><span>Concluiu</span><span>Escalou bem</span></div>'+AGENT_TESTS.map((r,i)=>`<div class="eval-row"><strong>${i+1}. ${r[0]}</strong>${['tool','policy','complete','escalate'].map(k=>`<label><input type="checkbox" data-agent-eval="${k}" data-case="${i}"> <span>${k==='tool'?'OK':k==='policy'?'OK':k==='complete'?'OK':'OK'}</span></label>`).join('')}</div>`).join('')}
function calculateAgentEval(){const total=AGENT_TESTS.length,out=document.getElementById('agentEvalResult');if(!out)return;const metrics=['tool','policy','complete','escalate'].map(k=>[k,[...document.querySelectorAll(`[data-agent-eval="${k}"]`)].filter(x=>x.checked).length]);const labels={tool:'Tool accuracy',policy:'Policy compliance',complete:'Completion rate',escalate:'Escalation quality'};out.innerHTML=metrics.map(([k,n])=>`<div class="metric-box"><strong>${Math.round(n/total*100)}%</strong><small>${labels[k]} • ${n}/${total}</small></div>`).join('')}

document.addEventListener('DOMContentLoaded',()=>{recommendArchitecture();evaluateApproval();initAgentEval();});


/* ===== V7: fechamento, desempenho e certificado simbólico ===== */
function getProjectCompleteness(){
  const keys=['problema','asis','gargalos','tobe','ia','prompt','workflow','integracoes','agente','riscos','indicadores'];
  const filled=keys.filter(k=>(localStorage.getItem(COURSE_PREFIX+'project_'+k)||'').trim().length>=12).length;
  return {filled,total:keys.length,pct:Math.round(filled/keys.length*100)};
}
function getProductionCompleteness(){
  const keys=Object.keys(localStorage).filter(k=>k.startsWith(COURSE_PREFIX+'prod_'));
  const done=keys.filter(k=>localStorage.getItem(k)==='1').length;
  return {done,total:20,pct:Math.round(done/20*100)};
}
function renderFinalDashboard(){
  const host=document.getElementById('finalDashboard');if(!host)return;
  const done=getDone().length,best=+(localStorage.getItem(COURSE_PREFIX+'best')||0),proj=getProjectCompleteness(),prod=getProductionCompleteness();
  let cats={};try{cats=JSON.parse(localStorage.getItem(COURSE_PREFIX+'cats')||'{}')}catch(e){}
  const catRows=Object.entries(cats).map(([k,v])=>{const pct=v[1]?Math.round(v[0]/v[1]*100):0;return `<div class="skill-row"><span>${k}</span><div class="skillbar"><i style="width:${pct}%"></i></div><strong>${pct}%</strong></div>`}).join('')||'<p class="small">Faça a autoavaliação para gerar o desempenho por tema.</p>';
  const eligible=done===MODULES.length && best>=70;
  host.innerHTML=`
    <div class="final-dashboard-grid">
      <div class="summary-card"><small>Módulos</small><strong>${done}/10</strong><span>${Math.round(done/10*100)}% da trilha</span></div>
      <div class="summary-card"><small>Melhor avaliação</small><strong>${best?best+'%':'—'}</strong><span>${best>=70?'meta atingida':'meta sugerida: 70%'}</span></div>
      <div class="summary-card"><small>Projeto Integrador</small><strong>${proj.filled}/${proj.total}</strong><span>${proj.pct}% preenchido</span></div>
      <div class="summary-card"><small>Prontidão de produção</small><strong>${prod.done}/20</strong><span>${prod.pct}% do checklist</span></div>
    </div>
    <div class="final-columns">
      <div class="section-lite"><h2>Desempenho por tema</h2>${catRows}</div>
      <div class="section-lite"><h2>Próxima ação recomendada</h2>${buildFinalRecommendation(done,best,proj,prod)}</div>
    </div>
    <div class="certificate-status ${eligible?'eligible':'not-eligible'}">
      <strong>${eligible?'✅ Elegível ao certificado simbólico':'📌 Certificado simbólico ainda bloqueado'}</strong>
      <p>${eligible?'Você concluiu os 10 módulos e atingiu pelo menos 70% na autoavaliação.':'Conclua os 10 módulos e alcance pelo menos 70% na autoavaliação.'}</p>
      <a class="btn ${eligible?'btn-primary':'btn-outline'}" href="certificado.html">Abrir certificado →</a>
    </div>`;
}
function buildFinalRecommendation(done,best,proj,prod){
  const rows=[];
  if(done<10) rows.push(`<li>Concluir os ${10-done} módulo(s) restante(s).</li>`);
  if(best<70) rows.push('<li>Refazer a autoavaliação após revisar os temas de menor desempenho.</li>');
  if(proj.pct<80) rows.push('<li>Completar o Projeto Integrador, especialmente processo, workflow, riscos e indicadores.</li>');
  if(prod.pct<70) rows.push('<li>Executar o checklist de produção para revisar segurança, observabilidade e rollback.</li>');
  if(!rows.length) rows.push('<li>Curso consolidado. Revise a arquitetura do projeto e prepare uma demonstração executiva de 5 minutos.</li>');
  return '<ul>'+rows.join('')+'</ul>';
}
function renderConclusion(){
  const el=document.getElementById('conclusionSummary');if(!el)return;const done=getDone().length,best=+(localStorage.getItem(COURSE_PREFIX+'best')||0),proj=getProjectCompleteness();
  el.innerHTML=`<div class="completion-hero"><div class="completion-ring" style="--pct:${Math.round(done/10*100)}"><span>${done}/10</span></div><div><h2>${done===10?'Trilha principal concluída':'Sua jornada está em andamento'}</h2><p>Módulos: <strong>${done}/10</strong> • melhor avaliação: <strong>${best?best+'%':'não realizada'}</strong> • projeto: <strong>${proj.pct}% preenchido</strong>.</p></div></div>`;
}
function initCertificate(){
  const wrap=document.getElementById('certificateApp');if(!wrap)return;const done=getDone().length,best=+(localStorage.getItem(COURSE_PREFIX+'best')||0),eligible=done===10&&best>=70;
  const gate=document.getElementById('certificateGate'),paper=document.getElementById('certificatePaper'),name=document.getElementById('certName');
  if(name){name.value=localStorage.getItem(COURSE_PREFIX+'cert_name')||'';name.addEventListener('input',()=>localStorage.setItem(COURSE_PREFIX+'cert_name',name.value.trim()))}
  if(!eligible){gate.innerHTML=`<div class="feedback show no"><strong>Certificado simbólico bloqueado.</strong><br>Requisitos: 10/10 módulos e pelo menos 70% na autoavaliação.<br>Seu status: ${done}/10 módulos • ${best||0}%.</div>`;paper.hidden=true;return}
  gate.innerHTML='<div class="feedback show ok">✅ Requisitos didáticos atendidos. Informe seu nome para gerar o certificado simbólico.</div>';paper.hidden=false;updateCertificate();
}
function updateCertificate(){
  const name=(document.getElementById('certName')?.value||'').trim()||'Participante';const best=+(localStorage.getItem(COURSE_PREFIX+'best')||0);
  const n=document.getElementById('certDisplayName'),s=document.getElementById('certScore'),d=document.getElementById('certDate');if(n)n.textContent=name;if(s)s.textContent=best+'%';if(d)d.textContent=new Intl.DateTimeFormat('pt-BR',{dateStyle:'long'}).format(new Date());
}
function printCertificate(){updateCertificate();window.print()}
function exportFinalReport(){
  const done=getDone().length,best=+(localStorage.getItem(COURSE_PREFIX+'best')||0),proj=getProjectCompleteness(),prod=getProductionCompleteness();
  const text=`RELATÓRIO FINAL — APERFEIÇOAMENTO EM IA PARA EMPREENDEDORES\n\nMódulos: ${done}/10\nMelhor avaliação: ${best}%\nProjeto Integrador: ${proj.filled}/${proj.total} campos (${proj.pct}%)\nChecklist de produção: ${prod.done}/20 (${prod.pct}%)\n\nObservação: relatório gerado localmente pelo material autoinstrucional.`;
  downloadText(text,'relatorio-final-aperfeicoamento-ia.txt');
}

document.addEventListener('DOMContentLoaded',()=>{renderFinalDashboard();renderConclusion();initCertificate();});
