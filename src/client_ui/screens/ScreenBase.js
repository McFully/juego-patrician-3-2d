export class ScreenBase {
  constructor(mgr, title, icon) {
    this.mgr = mgr;
    this.title = title;
    this.icon = icon;
  }

  build(contentHTML) {
    const div = document.createElement('div');
    div.className = 'glass-modal';
    div.style.cssText = 'border-radius:16px;overflow:hidden;color:#e4e4cc;';
    div.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;padding:16px 24px;border-bottom:1px solid rgba(228,228,204,0.1);background:rgba(31,33,17,0.3);">
        <h2 style="margin:0;color:#ffe088;font-size:20px;font-weight:700;text-transform:uppercase;letter-spacing:0.02em;font-family:Montserrat,sans-serif;">${this.icon} ${this.title}</h2>
        <span style="font-size:28px;color:rgba(196,198,207,0.6);cursor:pointer;padding:0 6px;line-height:1;transition:color 200ms cubic-bezier(0.4,0,0.2,1);font-family:Montserrat,sans-serif;" id="screenClose" onmouseover="this.style.color='rgba(196,198,207,1)'" onmouseout="this.style.color='rgba(196,198,207,0.6)'">&times;</span>
      </div>
      <div id="screenBody" style="padding:20px 24px;max-height:65vh;overflow-y:auto;font-size:13px;line-height:1.6;font-family:Montserrat,sans-serif;">${contentHTML}</div>
    `;
    return div;
  }

  bindEvents(engine, mgr) {
    const close = document.getElementById('screenClose');
    if (close) close.onclick = () => mgr.closeAll();
  }

  refresh(engine, mgr) {}
}
