import { useEffect, useReducer, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { allModels, categories, initialTargets, models } from './data';
import { canInstall, freeGB, installReducer, readSavedTargets, validIPv4 } from './installation';
import type { InstallJob, InstallState, Model, Target } from './installation';

const STORAGE_KEY = 'ai-model-manager-demo-v1';
const format = (value: number) => value.toFixed(1);
function Icon({ name, width, className = '' }: { name: string; width: number; className?: string }) {
  return <img className={`icon ${className}`} style={{ width: `${width / 16}rem` }} src={`/assets/${name}.svg`} alt="" draggable="false" />;
}
function initialize(): InstallState {
  let raw: string | null = null;
  try { raw = localStorage.getItem(STORAGE_KEY); } catch { /* Storage can be unavailable in private browser contexts. */ }
  return { targets: readSavedTargets(raw, initialTargets, allModels.map(m => m.id)), jobs: [] };
}

function TargetCard({ target, model, selected, expanded, job, onSelect, onExpand, onEdit }: {
  target: Target; model: Model; selected: boolean; expanded: boolean; job?: InstallJob;
  onSelect: () => void; onExpand: () => void; onEdit: () => void;
}) {
  const installed = target.installed.includes(model.id);
  const currentJob = job?.modelId === model.id ? job : undefined;
  const projected = selected && !installed ? model.sizeGB : 0;
  const insufficient = projected > freeGB(target);
  const status = currentJob ? 'Installing...' : installed ? 'Installed' : 'Not Installed';
  const installedModels = target.installed.map(id => allModels.find(m => m.id === id)).filter((m): m is Model => !!m);
  return <article className={`target-card ${selected ? 'is-selected' : ''}`} data-testid={`target-${target.id}`}>
    <div className="target-card-top">
      <div className="target-identity">
        <button className="target-select" onClick={onSelect} aria-pressed={selected} aria-label={`Select target ${target.ip}`}>
          <span className={`selection-radio ${selected ? 'checked' : ''}`} aria-hidden="true">{selected && '✓'}</span>
          <span className="ip-address">{target.ip}</span>
        </button>
        <button className="edit-ip icon-button" aria-label={`Edit IP ${target.ip}`} onClick={onEdit} disabled={!!job}><Icon name="edit-ip" width={14} /></button>
        <span className={`online ${target.online ? '' : 'offline'}`}>● {target.online ? 'Online' : 'Offline'}</span>
      </div>
      <div className="capacity-line">
        <div className="capacity-track" role="meter" aria-label={`Available storage on ${target.ip}`} aria-valuenow={freeGB(target)} aria-valuemin={0} aria-valuemax={target.totalGB}>
          <span className="used-capacity" style={{ width: `${freeGB(target) / target.totalGB * 100}%` }} />
          {projected > 0 && <span className={`planned-capacity ${insufficient ? 'over-capacity' : ''}`} style={{ left: 0, width: `${Math.min(projected, freeGB(target)) / target.totalGB * 100}%` }} />}
        </div>
        <span className="used-label">Used {format(target.usedGB)} / {format(target.totalGB)} GB</span>
      </div>
      <div className="capacity-legend"><span className="free-label"><i />Free {format(freeGB(target))} GB</span>
        {!!projected && <span className={`planned-label ${insufficient ? 'warning' : ''}`}><i />Selected Model {format(projected)} GB{insufficient ? ' · Not enough space' : ''}</span>}
      </div>
    </div>
    <button className={`target-status ${installed ? 'installed' : ''} ${currentJob ? 'installing' : ''}`} onClick={onExpand} aria-expanded={expanded} aria-label={`${status} on ${target.ip}; ${expanded ? 'hide' : 'show'} installed models`}>
      <span>{installed ? <Icon name="installed" width={11} /> : !currentJob ? <span className="minus-circle" /> : null}{status}</span>
      <Icon name="chevron" width={11} className={expanded ? 'rotate-chevron' : ''} />
    </button>
    {currentJob && <div className="installation-progress" aria-live="off">
      <div className="progress-track" role="progressbar" aria-label={`Installing ${model.name} on ${target.ip}`} aria-valuenow={Math.floor(currentJob.progress)} aria-valuemin={0} aria-valuemax={100}>
        <span style={{ width: `${currentJob.progress}%` }} />
      </div>
      <span className="progress-percent">{Math.floor(currentJob.progress)}%</span>
    </div>}
    {job && !currentJob && <div className="other-job">Installing {allModels.find(m => m.id === job.modelId)?.name}… {Math.floor(job.progress)}%</div>}
    {expanded && <div className={`installed-models ${currentJob ? 'with-progress' : ''}`}>
      <p>Installed Models({installedModels.length})</p>
      <ul>{installedModels.map(m => <li key={m.id}><span>✓</span>{m.name === 'LongCat Avatar' ? 'LongCat-Avatar' : m.name}</li>)}</ul>
      {!installedModels.length && <span className="muted">No models installed</span>}
    </div>}
  </article>;
}

function TargetDialog({ target, targets, onSave, onClose }: { target: Target | null; targets: Target[]; onSave: (target: Target) => void; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [error, setError] = useState('');
  useEffect(() => { const dialog = dialogRef.current; dialog?.showModal(); return () => { dialog?.close(); }; }, []);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const ip = String(form.get('ip')).trim();
    const totalGB = Number(form.get('totalGB')); const usedGB = Number(form.get('usedGB'));
    if (!validIPv4(ip)) return setError('Enter a valid IPv4 address, e.g. 192.168.1.115.');
    if (targets.some(t => t.id !== target?.id && t.ip === ip)) return setError('This IP address already exists.');
    if (!Number.isFinite(totalGB) || !Number.isFinite(usedGB) || totalGB <= 0 || usedGB < 0 || usedGB > totalGB)
      return setError('Used storage must be between 0 and total capacity.');
    const initialUsed = target?.usedGB ?? 0;
    if (target && usedGB < initialUsed) return setError('Keep existing used storage, or increase it. Remove models from the main panel to free space.');
    onSave({ id: target?.id ?? crypto.randomUUID(), ip, totalGB, usedGB, online: true, installed: target?.installed ?? [] });
  }
  return <dialog ref={dialogRef} className="target-dialog" onCancel={onClose} onClick={e => { if (e.target === e.currentTarget) onClose(); }} aria-labelledby="dialog-title">
    <form onSubmit={submit}>
      <div className="dialog-heading"><h2 id="dialog-title">{target ? 'Edit Target IP' : 'Add Target IP'}</h2><button type="button" className="dialog-close" aria-label="Close dialog" onClick={onClose}>×</button></div>
      <label>IP address<input name="ip" autoFocus required defaultValue={target?.ip ?? ''} placeholder="192.168.1.115" /></label>
      <div className="dialog-grid"><label>Total storage (GB)<input name="totalGB" type="number" min="0.1" step="0.1" required defaultValue={target?.totalGB ?? 256} /></label><label>Used storage (GB)<input name="usedGB" type="number" min="0" step="0.1" required defaultValue={target?.usedGB ?? 32} /></label></div>
      {error && <p className="form-error" role="alert">{error}</p>}
      <div className="dialog-actions"><button type="button" onClick={onClose}>Cancel</button><button type="submit">{target ? 'Save changes' : 'Add target'}</button></div>
    </form>
  </dialog>;
}

export default function App() {
  const [state, dispatch] = useReducer(installReducer, undefined, initialize);
  const [selectedModelId, setSelectedModelId] = useState('ltx-25');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [expandedIds, setExpandedIds] = useState<string[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('AI Video');
  const [dialog, setDialog] = useState<Target | null | undefined>(undefined);
  const [toast, setToast] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const previousJobs = useRef<InstallJob[]>([]);
  const targetPanel = useRef<HTMLElement>(null);
  const model = allModels.find(m => m.id === selectedModelId) ?? models[3];
  const hasJobs = state.jobs.length > 0;
  useEffect(() => {
    if (!hasJobs) return;
    const timer = window.setInterval(() => dispatch({ type: 'tick', now: Date.now(), models: allModels }), 120);
    return () => window.clearInterval(timer);
  }, [hasJobs]);
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, targets: state.targets })); } catch { /* The demo remains usable without storage. */ }
  }, [state.targets]);
  useEffect(() => {
    const finished = previousJobs.current.filter(j => !state.jobs.some(current => current.targetId === j.targetId && current.modelId === j.modelId)
      && state.targets.find(t => t.id === j.targetId)?.installed.includes(j.modelId));
    if (finished.length) setToast(`${allModels.find(m => m.id === finished[0].modelId)?.name} installed successfully.`);
    previousJobs.current = state.jobs;
  }, [state.jobs, state.targets]);
  useEffect(() => { if (!toast) return; const timer = setTimeout(() => setToast(''), 3500); return () => clearTimeout(timer); }, [toast]);
  const selectedTargets = state.targets.filter(t => selectedIds.includes(t.id));
  const installable = selectedTargets.filter(t => canInstall(state, model, t));
  const selectedBusy = state.jobs.some(j => selectedIds.includes(j.targetId));
  const removable = selectedTargets.filter(t => t.installed.includes(model.id));
  const visibleModels = (category === 'AI Video' ? models : allModels.filter(m => m.category === category))
    .filter(m => `${m.name} ${m.publisher}`.toLowerCase().includes(query.toLowerCase().trim()));
  function selectModel(id: string) {
    if (id !== selectedModelId) { setHistory(h => [...h, selectedModelId]); setSelectedModelId(id); }
  }
  function toggleTarget(id: string) {
    setSelectedIds(ids => ids.includes(id) ? ids.filter(item => item !== id) : [...ids, id]);
    setExpandedIds(ids => ids.includes(id) ? ids : [...ids, id]);
  }
  function install() {
    if (!installable.length) return;
    const ids = installable.map(t => t.id);
    dispatch({ type: 'start', model, targetIds: ids, now: Date.now() });
    setExpandedIds(current => [...new Set([...current, ...ids])]);
  }
  function removeOrCancel() {
    if (selectedBusy) { dispatch({ type: 'cancel', targetIds: selectedIds }); setToast('Installation cancelled. No storage was used.'); }
    else if (removable.length) { dispatch({ type: 'remove', model, targetIds: selectedIds }); setToast(`${model.name} uninstalled. Storage has been released.`); }
  }
  function reset() {
    dispatch({ type: 'reset', targets: initialTargets }); setSelectedIds([]); setExpandedIds([]);
    setSelectedModelId('ltx-25'); setCategory('AI Video'); setQuery(''); setSearchOpen(false); setHistory([]);
    setToast('Demo reset.');
  }
  async function fullscreen() {
    try { if (document.fullscreenElement) await document.exitFullscreen(); else await document.documentElement.requestFullscreen(); }
    catch { setToast('Full screen is unavailable in this browser.'); }
  }
  const differentModel = model.id !== 'ltx-25';
  return <div className="app-shell">
    <header className="app-header">
      <button className="back-button icon-button" aria-label="Go back" onClick={() => {
        if (history.length) { setSelectedModelId(history[history.length - 1]); setHistory(h => h.slice(0, -1)); }
        else { setCategory('AI Video'); setQuery(''); setSelectedIds([]); }
      }}><Icon name="back" width={25} /></button>
      <h1>Control Panel</h1>
      <div className="header-utilities">
        <button className="icon-button refresh-button" aria-label="Reset demo" title="Reset demo" onClick={reset}><Icon name="refresh" width={44} /></button>
        <button className="icon-button ip-settings-button" aria-label="IP settings" title="IP settings" onClick={() => { targetPanel.current?.focus(); setDialog(null); }}><Icon name="ip-settings" width={48} /><span>IP</span></button>
        <button className="icon-button" aria-label="Toggle full screen" title="Full screen" onClick={fullscreen}><Icon name="fullscreen" width={37} /></button>
      </div>
    </header>
    <aside className="sidebar" aria-label="Control panel navigation">
      <div className="general-nav"><h2>GENERAL</h2><button className="manager-nav" onClick={() => { setCategory('AI Video'); setQuery(''); }}><Icon name="model-manager" width={15} /><span>AI Model Manager</span></button>
        <nav aria-label="Model categories">{categories.map(c => <button key={c} className={category === c ? 'active' : ''} aria-current={category === c ? 'page' : undefined} onClick={() => { setCategory(c); setQuery(''); }}>{c}</button>)}</nav>
      </div>
      <div className="usage-nav"><h2>USAGE</h2><span className="secondary-nav"><Icon name="usage" width={14} />Usage Logs</span></div>
      <div className="monetization-nav"><h2>MONETIZATION</h2><span className="secondary-nav"><Icon name="points" width={14} />Points &amp; Billing</span><span className="secondary-nav invoices"><Icon name="invoices" width={13} />Invoices</span></div>
    </aside>
    <main className="workspace">
      <section className="panel model-list-panel" aria-labelledby="model-list-heading">
        <div className="model-list-header"><div className="panel-title-row"><h2 id="model-list-heading">AI Model List</h2><button className="icon-button search-button" aria-label="Search models" aria-expanded={searchOpen} onClick={() => { setSearchOpen(open => !open); setQuery(''); }}><Icon name="search" width={19} /></button></div>
          {searchOpen ? <input className="model-search" autoFocus aria-label="Search models by name" placeholder="Search models…" value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => { if (e.key === 'Escape') { setSearchOpen(false); setQuery(''); } }} /> : <p>Select a model to view details and install.</p>}
        </div>
        <div className="model-list" role="list" aria-label="AI models">{visibleModels.map(m => {
          const count = state.targets.filter(t => t.installed.includes(m.id)).length;
          const selected = m.id === model.id;
          return <div role="listitem" key={m.id}><button className={`model-card ${m.featured && !selected ? 'featured' : ''} ${selected ? 'selected' : ''}`} onClick={() => selectModel(m.id)} aria-pressed={selected} aria-label={`Select ${m.name}`} data-testid={`model-${m.id}`}>
            <span className="model-name">{m.name}</span><span className="model-publisher">{m.publisher}</span>
            {m.isNew ? <span className="model-badges"><span>New!</span><span className={count === state.targets.length ? 'all-installed' : ''}>{count === state.targets.length ? 'Installed' : 'Not Installed'}</span></span>
              : <span className={`model-count ${count ? 'has-installed' : ''}`}>{count} / {state.targets.length} IPs installed</span>}
          </button></div>;
        })}{!visibleModels.length && <p className="empty-list">{query ? 'No models match your search.' : `No ${category} models available.`}</p>}</div>
      </section>
      <section className="panel target-panel" aria-labelledby="target-heading" ref={targetPanel} tabIndex={-1}>
        <div className="target-header"><div className="panel-title-row"><h2 id="target-heading">Target IPs</h2><button className="add-target" aria-label="Add target IP" onClick={() => setDialog(null)}>+</button></div><p>Choose the devices where the selected model should be installed</p></div>
        <div className="target-list">{state.targets.map(target => <TargetCard key={target.id} target={target} model={model} selected={selectedIds.includes(target.id)} expanded={expandedIds.includes(target.id)} job={state.jobs.find(j => j.targetId === target.id)} onSelect={() => toggleTarget(target.id)} onExpand={() => setExpandedIds(ids => ids.includes(target.id) ? ids.filter(id => id !== target.id) : [...ids, target.id])} onEdit={() => setDialog(target)} />)}</div>
        <div className="target-actions"><p className={!selectedIds.length ? 'none-selected' : ''} aria-live="polite">{selectedIds.length} server(s) selected</p>
          <div className="action-buttons"><button className="install-button" disabled={!installable.length || selectedBusy} onClick={install}><Icon name="install" width={16} />Install</button><button className="delete-button" aria-label={selectedBusy ? 'Cancel selected installations' : 'Uninstall selected model'} title={selectedBusy ? 'Cancel installation' : 'Uninstall model'} disabled={!selectedBusy && !removable.length} onClick={removeOrCancel}><Icon name="delete" width={14} /></button></div>
        </div>
      </section>
      <section className="panel details-panel" aria-labelledby="details-heading" key={model.id}>
        <div className="details-header"><h2 id="details-heading">{model.name}</h2><p>Released on 2026. 08.11</p></div>
        <div className="details-scroll"><img className="primary-preview" src="/assets/fantasy-yak.png" alt="A giant horned fantasy creature in an alpine valley" width="1428" height="796" />
          <div className="model-article"><h3>{model.headline ?? `${model.name}\nCreate more with ${model.publisher.includes('Convert') ? model.name : model.publisher}`}</h3><p>{model.description ?? `${model.name} brings creative AI workflows to your local devices. Select a target IP to check installation status and available storage, then install the model to get started.`}</p>
            {differentModel && <dl className="model-spec"><div><dt>Model size</dt><dd>{format(model.sizeGB)} GB</dd></div><div><dt>Installed on</dt><dd>{state.targets.filter(t => t.installed.includes(model.id)).length} / {state.targets.length} IPs</dd></div></dl>}
          </div>
          <div className="secondary-preview"><img src="/assets/chameleon.png" alt="Detailed chameleon showing colorful texture and lighting" width="1460" height="827" /><div className="preview-fade" /></div>
        </div>
      </section>
    </main>
    {toast && <div className="toast" role="status">{toast}<button aria-label="Dismiss notification" onClick={() => setToast('')}>×</button></div>}
    {dialog !== undefined && <TargetDialog key={dialog?.id ?? 'new'} target={dialog} targets={state.targets} onClose={() => setDialog(undefined)} onSave={target => { dispatch({ type: 'save-target', target }); setDialog(undefined); setToast(dialog ? 'Target IP updated.' : 'Target IP added.'); }} />}
  </div>;
}
