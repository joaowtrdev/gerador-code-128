const $=id=>document.getElementById(id)
let lista=[]
let idx=0
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n))
function setProgress(done,total){
  const pct=total?Math.round(done/total*100):0
  $("bar").style.width=pct+"%"
  $("status").textContent=total?`Carregado: ${done}/${total} (${pct}%)`:"Pronto."
}
function parseCodes(text,limit){
  const lines=text.split(/\r?\n/)
  const out=[]
  for(let i=0;i<lines.length;i++){
    const s=lines[i].trim()
    if(!s) continue
    out.push(s)
    if(out.length>=limit) break
  }
  return out
}
function updateUI(){
  const total=lista.length
  $("counter").textContent=total?`${idx+1}/${total}`:"0/0"
  $("prevBtn").disabled=total<=1||idx<=0
  $("nextBtn").disabled=total<=1||idx>=total-1
  $("goto").max=total||1
  $("goto").value=""
}
function renderAtual(){
  const total=lista.length
  if(!total){
    $("codeText").textContent="—"
    const c=$("canvas")
    const ctx=c.getContext("2d")
    ctx.clearRect(0,0,c.width,c.height)
    return
  }
  const code=lista[idx]
  const scale=parseInt($("scale").value,10)
  const height=parseInt($("height").value,10)
  const textsize=parseInt($("textsize").value,10)
  const padding=parseInt($("padding").value,10)
  const canvas=$("canvas")
  try{
    bwipjs.toCanvas(canvas,{bcid:"code128",text:code,scale:scale,height:height,includetext:true,textxalign:"center",textsize:textsize,paddingwidth:padding,paddingheight:padding,backgroundcolor:"ffffff"})
    $("codeText").textContent=code
    $("status").textContent=`Pronto. (Código ${idx+1} de ${total})`
  }catch(e){
    $("codeText").textContent=`${code}  (ERRO: ${e.message||e})`
    $("status").textContent="Erro ao gerar este código."
  }
}
function carregarLista(){
  const limit=clamp(parseInt($("limit").value,10)||10000,1,10000)
  const codes=parseCodes($("codes").value,limit)
  lista=codes
  idx=0
  setProgress(codes.length,codes.length)
  $("status").textContent=codes.length?`Lista carregada: ${codes.length} códigos.`:"Cole pelo menos 1 código (1 por linha)."
  updateUI()
  renderAtual()
}
$("btnLoad").addEventListener("click",carregarLista)
$("btnRender").addEventListener("click",()=>renderAtual())
$("btnClear").addEventListener("click",()=>{
  $("codes").value=""
  lista=[]
  idx=0
  setProgress(0,0)
  $("status").textContent="Pronto."
  updateUI()
  renderAtual()
})
$("prevBtn").addEventListener("click",()=>{
  if(!lista.length) return
  idx=clamp(idx-1,0,lista.length-1)
  updateUI()
  renderAtual()
})
$("nextBtn").addEventListener("click",()=>{
  if(!lista.length) return
  idx=clamp(idx+1,0,lista.length-1)
  updateUI()
  renderAtual()
})
$("goto").addEventListener("keydown",ev=>{
  if(ev.key!=="Enter") return
  if(!lista.length) return
  const v=parseInt($("goto").value,10)
  if(!v) return
  idx=clamp(v-1,0,lista.length-1)
  updateUI()
  renderAtual()
})
window.addEventListener("keydown",ev=>{
  if(!lista.length) return
  const t=ev.target
  const tag=(t&&t.tagName)?t.tagName.toLowerCase():""
  if(tag==="textarea"||tag==="input") return
  if(ev.key==="ArrowLeft"){
    idx=clamp(idx-1,0,lista.length-1)
    updateUI()
    renderAtual()
  }else if(ev.key==="ArrowRight"){
    idx=clamp(idx+1,0,lista.length-1)
    updateUI()
    renderAtual()
  }
})
updateUI()
