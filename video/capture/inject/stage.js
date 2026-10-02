// Çekim katmanı: sayfa yüklenmeden önce çalışır (addInitScript). Ürün kodu değişmez; yalnızca çekilen görüntü.
//  1) Marka: ekrandaki "Constructor" yazıları, çizilmeden önce "İskele" olur (ürünün yeni adı İskele ERP).
//  2) Saat: tarayıcı, backend ile aynı demo gününü görür (__STAGE__.offsetMs).
//  3) İmleç: başsız tarayıcıda imleç yoktur; kayıtta görünen, doğal bir imleç ve tıklama dalgası çizilir.
(() => {
  const STAGE = window.__STAGE__ ?? { offsetMs: 0, pointer: 'mouse' }

  const RealDate = Date
  class DemoDate extends RealDate {
    constructor(...args) {
      if (args.length === 0) super(RealDate.now() + STAGE.offsetMs)
      else super(...args)
    }
    static now() {
      return RealDate.now() + STAGE.offsetMs
    }
  }
  DemoDate.UTC = RealDate.UTC
  DemoDate.parse = RealDate.parse
  window.Date = DemoDate

  const rename = (text) => text.replace(/Constructor ERP/g, 'İskele ERP').replace(/Constructor/g, 'İskele')
  const fixNode = (node) => {
    if (node.nodeType === Node.TEXT_NODE && node.data.includes('Constructor')) node.data = rename(node.data)
    if (node.nodeType !== Node.ELEMENT_NODE) return
    for (const attribute of ['title', 'placeholder', 'aria-label', 'alt']) {
      const value = node.getAttribute(attribute)
      if (value?.includes('Constructor')) node.setAttribute(attribute, rename(value))
    }
    const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT)
    for (let text = walker.nextNode(); text; text = walker.nextNode()) {
      if (text.data.includes('Constructor')) text.data = rename(text.data)
    }
  }
  new MutationObserver((records) => {
    for (const record of records) {
      if (record.type === 'characterData') fixNode(record.target)
      record.addedNodes.forEach(fixNode)
      if (record.type === 'attributes') fixNode(record.target)
    }
    if (document.title.includes('Constructor')) document.title = rename(document.title)
  }).observe(document, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ['title', 'placeholder', 'aria-label', 'alt'] })

  // Kurulum bağlantısı gizlidir: ekranda yalnızca "…/kurulum/••••" görünür; gerçeği bir sonraki çekim için saklanır.
  const SECRET = /https?:\/\/[^\s"']*\/kurulum\/[A-Za-z0-9_-]{6,}/
  window.__stageSecrets = {}
  window.__stageMask = () => {
    for (const input of document.querySelectorAll('input, textarea')) {
      const found = input.value.match(SECRET)
      if (!found) continue
      window.__stageSecrets.setupUrl = found[0]
      input.value = input.value.replace(SECRET, '…/kurulum/••••••••••••')
    }
  }

  window.addEventListener('DOMContentLoaded', () => {
    const layer = document.createElement('div')
    layer.id = 'stage-pointer'
    const touch = STAGE.pointer === 'touch'
    layer.innerHTML = touch ? '<i class="stage-touch"></i>' : `
      <svg class="stage-arrow" width="26" height="30" viewBox="0 0 26 30"><path d="M3 2 L3 24 L8.6 18.6 L12.4 27.2 L16.2 25.6 L12.5 17.2 L20.4 17.2 Z" fill="#111827" stroke="#fff" stroke-width="1.8" stroke-linejoin="round"/></svg>
      <svg class="stage-hand" width="28" height="30" viewBox="0 0 28 30"><path d="M10 14V4.5a2 2 0 0 1 4 0V13l0-2.4a2 2 0 0 1 4 0V13.5l0-1.6a2 2 0 0 1 4 0V19c0 5-3.2 9-8.4 9h-1.2c-3 0-5-1.4-6.6-3.8L3 19.3a2.1 2.1 0 0 1 3.3-2.6L10 20" fill="#111827" stroke="#fff" stroke-width="1.7" stroke-linejoin="round"/></svg>`
    const style = document.createElement('style')
    style.textContent = `
      #stage-pointer{position:fixed;left:0;top:0;z-index:2147483647;pointer-events:none;transform:translate(-100px,-100px);opacity:0;transition:opacity .25s}
      #stage-pointer.on{opacity:1}
      #stage-pointer svg{position:absolute;left:-3px;top:-2px;filter:drop-shadow(0 2px 3px rgba(0,0,0,.28))}
      #stage-pointer .stage-hand{display:none;left:-10px;top:-3px}
      #stage-pointer.hand .stage-arrow{display:none} #stage-pointer.hand .stage-hand{display:block}
      .stage-touch{position:absolute;left:-22px;top:-22px;width:44px;height:44px;border-radius:50%;background:rgba(30,64,175,.18);border:2px solid rgba(255,255,255,.85);box-shadow:0 2px 10px rgba(0,0,0,.25);transition:transform .18s}
      .stage-ripple{position:fixed;z-index:2147483646;pointer-events:none;width:14px;height:14px;margin:-7px 0 0 -7px;border-radius:50%;border:2px solid rgba(30,64,175,.55);animation:stage-ripple .5s ease-out forwards}
      @keyframes stage-ripple{to{transform:scale(3.2);opacity:0}}
      *{caret-color:#1e40af}`
    document.head.append(style)
    document.body.append(layer)
    window.addEventListener('mousemove', (event) => {
      if (!touch) layer.classList.add('on')
      layer.style.transform = `translate(${event.clientX}px, ${event.clientY}px)`
      const target = document.elementFromPoint(event.clientX, event.clientY)
      layer.classList.toggle('hand', !!target && getComputedStyle(target).cursor === 'pointer')
    }, true)
    window.addEventListener('mousedown', (event) => {
      const ripple = document.createElement('span')
      ripple.className = 'stage-ripple'
      ripple.style.left = `${event.clientX}px`
      ripple.style.top = `${event.clientY}px`
      document.body.append(ripple)
      setTimeout(() => ripple.remove(), 600)
      if (!touch) return
      layer.classList.add('on')
      setTimeout(() => layer.classList.remove('on'), 380)
    }, true)
    window.__stageHidePointer = () => layer.classList.remove('on')
  })
})()
