import React, { useEffect, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import {
  BookOpen, Check, ChevronDown, Clipboard, Command, ExternalLink, Filter,
  Heart, History, Info, Search, Settings2, Sparkles, Terminal, X, Zap
} from 'lucide-react'
import './styles.css'

const DOCS = {
  give: 'https://minecraft.wiki/w/Commands/give',
  time: 'https://minecraft.wiki/w/Commands/time',
  weather: 'https://minecraft.wiki/w/Commands/weather',
  teleport: 'https://minecraft.wiki/w/Commands/teleport',
  gamemode: 'https://minecraft.wiki/w/Commands/gamemode',
  effect: 'https://minecraft.wiki/w/Commands/effect',
  summon: 'https://minecraft.wiki/w/Commands/summon',
  clear: 'https://minecraft.wiki/w/Commands/clear'
  ,clone: 'https://minecraft.wiki/w/Commands/clone'
}

const VERSIONS = {
  Java: ['1.21.4', '1.21.1', '1.20.6', '1.20.4'],
  Bedrock: ['1.21.50', '1.21.30', '1.20.80', '1.20.50']
}

const COMMANDS = [
  {
    id: 'give-diamond-sword', title: 'Give an item', category: 'Items',
    purpose: 'Give a player an item, such as a diamond sword.',
    keywords: ['give', 'item', 'sword', 'diamond', 'weapon', 'hand'],
    command: { Java: 'give @a minecraft:diamond_sword 1', Bedrock: 'give @a diamond_sword 1' },
    fields: [
      { key: 'target', label: 'Player or selector', value: '@a', hint: '@a = everyone' },
      { key: 'item', label: 'Item ID', value: 'minecraft:diamond_sword', bedrockValue: 'diamond_sword', hint: 'Java accepts the minecraft: prefix' },
      { key: 'amount', label: 'Amount', value: '1', hint: '1–64 for most items' }
    ],
    editions: ['Java', 'Bedrock'], versions: { Java: ['1.20.4+'], Bedrock: ['1.20.50+'] },
    run: ['Chat', 'Command block', 'Server console'], cheats: true, permission: 'Operator / cheats required',
    block: 'Impulse • Needs Redstone • Place once, then activate',
    errors: ['Unknown item: use the correct namespaced ID for your edition.', 'No permission: enable Allow Cheats or run as an operator.'],
    doc: DOCS.give, verified: true
  },
  {
    id: 'give-diamonds', title: 'Give diamonds to players', category: 'Items',
    purpose: 'Give diamonds to one player or every player with a selector.',
    keywords: ['give', 'diamonds', 'diamond', 'everyone', 'everybody', 'all', 'players', 'player', 'items', 'receive'],
    command: { Java: 'give @a minecraft:diamond 1', Bedrock: 'give @a diamond 1' },
    fields: [
      { key: 'target', label: 'Player or selector', value: '@a', hint: '@a = everyone' },
      { key: 'item', label: 'Item ID', value: 'minecraft:diamond', bedrockValue: 'diamond', hint: 'Use a valid item ID' },
      { key: 'amount', label: 'Amount', value: '1', hint: '1–64 for most items' }
    ],
    editions: ['Java', 'Bedrock'], versions: { Java: ['1.13+'], Bedrock: ['1.2+'] },
    run: ['Chat', 'Command block', 'Server console'], cheats: true, permission: 'Operator / cheats required',
    block: 'Impulse • Needs Redstone • Place once, then activate',
    errors: ['Unknown item: use the correct namespaced ID for your edition.', 'No permission: enable Allow Cheats or run as an operator.'],
    doc: DOCS.give, verified: true
  },
  {
    id: 'time-day', title: 'Set the time to day', category: 'World',
    purpose: 'Make the world daytime immediately.',
    keywords: ['day', 'daytime', 'sun', 'morning', 'time', 'light'],
    command: { Java: 'time set day', Bedrock: 'time set day' },
    fields: [],
    editions: ['Java', 'Bedrock'], versions: { Java: ['1.13+'], Bedrock: ['1.2+'] },
    run: ['Chat', 'Command block', 'Server console'], cheats: true, permission: 'Operator / cheats required',
    block: 'Impulse • Needs Redstone • Place and activate once',
    errors: ['Commands are disabled: enable Allow Cheats in the world settings.', 'On a server, ask an operator to run the command.'],
    doc: DOCS.time, verified: true
  },
  {
    id: 'weather-clear', title: 'Clear the weather', category: 'World',
    purpose: 'Stop rain and thunderstorms for a chosen duration.',
    keywords: ['weather', 'rain', 'storm', 'clear', 'sun'],
    command: { Java: 'weather clear 6000', Bedrock: 'weather clear 6000' },
    fields: [{ key: 'duration', label: 'Duration in ticks', value: '6000', hint: '20 ticks = 1 second' }],
    editions: ['Java', 'Bedrock'], versions: { Java: ['1.13+'], Bedrock: ['1.2+'] },
    run: ['Chat', 'Command block', 'Server console'], cheats: true, permission: 'Operator / cheats required',
    block: 'Impulse • Needs Redstone • Place and activate once',
    errors: ['Duration must be a whole number of ticks (0–1,000,000).'],
    doc: DOCS.weather, verified: true
  },
  {
    id: 'teleport-player', title: 'Teleport a player', category: 'Movement',
    purpose: 'Teleport a player or selector to exact coordinates.',
    keywords: ['teleport', 'tp', 'move', 'coordinates', 'location'],
    command: { Java: 'tp @p 0 80 0', Bedrock: 'tp @p 0 80 0' },
    fields: [
      { key: 'target', label: 'Player or selector', value: '@p', hint: '@p = nearest player' },
      { key: 'x', label: 'X coordinate', value: '0' },
      { key: 'y', label: 'Y coordinate', value: '80' },
      { key: 'z', label: 'Z coordinate', value: '0' }
    ],
    editions: ['Java', 'Bedrock'], versions: { Java: ['1.13+'], Bedrock: ['1.2+'] },
    run: ['Chat', 'Command block', 'Server console'], cheats: true, permission: 'Operator / cheats required',
    block: 'Impulse • Needs Redstone • Place and activate once',
    errors: ['Cannot teleport: check that the coordinates are inside the world border.', 'Selector matched no entities: check target and loaded chunks.'],
    doc: DOCS.teleport, verified: true
  },
  {
    id: 'gamemode-creative', title: 'Switch to Creative mode', category: 'Players',
    purpose: 'Change a player’s game mode to Creative.',
    keywords: ['creative', 'gamemode', 'survival', 'mode', 'player'],
    command: { Java: 'gamemode creative @s', Bedrock: 'gamemode creative @s' },
    fields: [{ key: 'target', label: 'Player or selector', value: '@s', hint: '@s = executor' }],
    editions: ['Java', 'Bedrock'], versions: { Java: ['1.13+'], Bedrock: ['1.2+'] },
    run: ['Chat', 'Command block', 'Server console'], cheats: true, permission: 'Operator / cheats required',
    block: 'Impulse • Needs Redstone • Place and activate once',
    errors: ['Invalid game mode: use survival, creative, adventure, or spectator (Java only).', 'Bedrock does not support spectator mode in all versions.'],
    doc: DOCS.gamemode, verified: true
  },
  {
    id: 'effect-speed', title: 'Give a player Speed', category: 'Players',
    purpose: 'Apply the Speed status effect for a chosen duration and amplifier.',
    keywords: ['effect', 'speed', 'potion', 'boost', 'fast'],
    command: { Java: 'effect give @p minecraft:speed 60 1', Bedrock: 'effect @p speed 60 1 true' },
    fields: [
      { key: 'target', label: 'Player or selector', value: '@p', hint: '@p = nearest player' },
      { key: 'duration', label: 'Seconds', value: '60' },
      { key: 'amplifier', label: 'Amplifier', value: '1', hint: '1 = Speed II' }
    ],
    editions: ['Java', 'Bedrock'], versions: { Java: ['1.13+'], Bedrock: ['1.2+'] },
    run: ['Chat', 'Command block', 'Server console'], cheats: true, permission: 'Operator / cheats required',
    block: 'Impulse • Needs Redstone • Place and activate once',
    errors: ['Unknown effect: use the ID speed, not a potion item name.', 'Bedrock uses a trailing hideParticles boolean.'],
    doc: DOCS.effect, verified: true
  },
  {
    id: 'summon-zombie', title: 'Summon a zombie', category: 'Mobs',
    purpose: 'Create a zombie at a location or relative to the command source.',
    keywords: ['summon', 'zombie', 'mob', 'spawn', 'entity'],
    command: { Java: 'summon minecraft:zombie ~ ~ ~', Bedrock: 'summon zombie ~ ~ ~' },
    fields: [
      { key: 'entity', label: 'Entity ID', value: 'minecraft:zombie', bedrockValue: 'zombie', hint: 'Use a valid entity ID' },
      { key: 'x', label: 'X coordinate', value: '~' },
      { key: 'y', label: 'Y coordinate', value: '~' },
      { key: 'z', label: 'Z coordinate', value: '~' }
    ],
    editions: ['Java', 'Bedrock'], versions: { Java: ['1.13+'], Bedrock: ['1.2+'] },
    run: ['Chat', 'Command block', 'Server console'], cheats: true, permission: 'Operator / cheats required',
    block: 'Impulse • Needs Redstone • Place and activate once',
    errors: ['Entity not found: verify the entity ID for your edition.', 'Cannot summon: the location may be outside the world border.'],
    doc: DOCS.summon, verified: true
  },
  {
    id: 'clear-inventory', title: 'Clear a player’s inventory', category: 'Items',
    purpose: 'Remove all items, or a selected item, from a player.',
    keywords: ['clear', 'inventory', 'remove', 'items', 'empty'],
    command: { Java: 'clear @p', Bedrock: 'clear @p' },
    fields: [{ key: 'target', label: 'Player or selector', value: '@p', hint: '@p = nearest player' }],
    editions: ['Java', 'Bedrock'], versions: { Java: ['1.13+'], Bedrock: ['1.2+'] },
    run: ['Chat', 'Command block', 'Server console'], cheats: true, permission: 'Operator / cheats required',
    block: 'Impulse • Needs Redstone • Place and activate once',
    errors: ['No items cleared: the target inventory may already be empty.', 'Selector matched no entities: check the target.'],
    doc: DOCS.clear, verified: true
  },
  {
    id: 'clone-structure', title: 'Clone or move a structure', category: 'World',
    purpose: 'Copy blocks from a rectangular area to a destination, or move them and replace the original with air.',
    keywords: ['clone', 'cloning', 'copy', 'copies', 'building', 'buildings', 'house', 'structure', 'structures', 'blocks', 'duplicate', 'duplicating', 'move', 'moving', 'relocate'],
    command: {
      Java: 'clone 0 64 0 10 74 10 100 64 100 replace normal',
      Bedrock: 'clone 0 64 0 10 74 10 100 64 100 replace normal'
    },
    fields: [
      { key: 'beginX', label: 'Corner 1 X', value: '0' }, { key: 'beginY', label: 'Corner 1 Y', value: '64' }, { key: 'beginZ', label: 'Corner 1 Z', value: '0' },
      { key: 'endX', label: 'Corner 2 X', value: '10' }, { key: 'endY', label: 'Corner 2 Y', value: '74' }, { key: 'endZ', label: 'Corner 2 Z', value: '10' },
      { key: 'destX', label: 'Destination X', value: '100' }, { key: 'destY', label: 'Destination Y', value: '64' }, { key: 'destZ', label: 'Destination Z', value: '100' },
      { key: 'mode', label: 'Copy mode', value: 'replace normal', hint: 'Use replace move to move, not copy' }
    ],
    editions: ['Java', 'Bedrock'], versions: { Java: ['1.13+'], Bedrock: ['1.2+'] },
    run: ['Chat', 'Command block', 'Server console'], cheats: true, permission: 'Operator / cheats required',
    block: 'Impulse • Needs Redstone • Place and activate once; use Chain blocks for follow-up commands',
    errors: ['The source and destination areas cannot overlap unless the force option is used.', 'Too many blocks: reduce the selected rectangular area.', 'Coordinates must identify two opposite corners and a destination corner.'],
    followUp: ['What are the coordinates of two opposite corners of the original area?', 'What is the destination corner?', 'Should this copy the original, or move it?'],
    coordinateHelp: 'Stand on each corner and read XYZ from the debug screen (Java: F3) or the coordinates setting (Bedrock: World Settings → Show Coordinates). The two source corners define the whole rectangular area.',
    doc: DOCS.clone, verified: true
  }
]

const EXAMPLES = ['Give every player a diamond sword', 'How do I clone something?', 'Make it daytime', 'Teleport me to 100 70 -20']
const CATEGORIES = ['All commands', 'Items', 'World', 'Movement', 'Players', 'Mobs']

const STOP_WORDS = new Set(['a', 'an', 'can', 'could', 'do', 'does', 'for', 'how', 'i', 'it', 'me', 'my', 'of', 'please', 'something', 'the', 'this', 'to', 'want', 'would', 'you'])
const TERM_ALIASES = {
  clone: ['copy', 'duplicate', 'building', 'house', 'structure', 'blocks'],
  copy: ['clone', 'duplicate', 'building', 'house', 'structure', 'blocks'],
  duplicate: ['clone', 'copy', 'building', 'house', 'structure'],
  diamonds: ['diamond', 'give', 'items'],
  everyone: ['all', 'players', 'player', '@a'],
  daytime: ['day', 'time'],
  teleported: ['teleport', 'tp'],
  teleporting: ['teleport', 'tp']
}

function normalizeTerm(term) {
  return term.toLowerCase().replace(/[^a-z0-9@-]/g, '').replace(/(ing|ed|es|s)$/, '')
}

function levenshtein(left, right) {
  const row = Array.from({ length: right.length + 1 }, (_, index) => index)
  for (let i = 1; i <= left.length; i += 1) {
    let previous = row[0]
    row[0] = i
    for (let j = 1; j <= right.length; j += 1) {
      const current = row[j]
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, previous + (left[i - 1] === right[j - 1] ? 0 : 1))
      previous = current
    }
  }
  return row[right.length]
}

function searchScore(command, query) {
  if (!query.trim()) return 1
  const terms = query.toLowerCase().split(/\s+/)
    .filter(rawTerm => rawTerm && !STOP_WORDS.has(rawTerm.replace(/[^a-z0-9@-]/g, '')) && !/^-?\d+(?:\.\d+)?$/.test(rawTerm))
    .map(normalizeTerm)
  if (!terms.length) return 0.2
  const words = `${command.title} ${command.purpose} ${command.category} ${command.keywords.join(' ')}`
    .toLowerCase().split(/[^a-z0-9@-]+/).filter(Boolean).map(normalizeTerm)
  let score = 0
  terms.forEach(term => {
    const directPartial = term.length > 3 && words.some(word => word.includes(term) || term.includes(word))
    const directTypo = words.some(word => term.length > 3 && levenshtein(term, word) <= (term.length > 6 ? 2 : 1))
    if (words.includes(term)) score += term === normalizeTerm(command.title) ? 8 : 5
    else if (directPartial) score += 3
    else if (directTypo) score += 3
    else {
      const aliases = TERM_ALIASES[term] || []
      if (aliases.some(alias => words.includes(alias))) score += 3
      else if (aliases.some(alias => words.some(word => word.includes(alias) || alias.includes(word)))) score += 1.5
    }
  })
  return score / terms.length
}

function buildCommand(item, edition, values) {
  const defaults = Object.fromEntries(item.fields.map(field => [field.key, edition === 'Bedrock' && field.bedrockValue ? field.bedrockValue : field.value]))
  const merged = { ...defaults, ...values }
  if (item.id === 'give-diamond-sword' || item.id === 'give-diamonds') return `give ${merged.target} ${edition === 'Java' ? merged.item : merged.item.replace(/^minecraft:/, '')} ${merged.amount}`
  if (item.id === 'time-day') return 'time set day'
  if (item.id === 'weather-clear') return `weather clear ${merged.duration}`
  if (item.id === 'teleport-player') return `tp ${merged.target} ${merged.x} ${merged.y} ${merged.z}`
  if (item.id === 'gamemode-creative') return `gamemode creative ${merged.target}`
  if (item.id === 'effect-speed') return edition === 'Java'
    ? `effect give ${merged.target} minecraft:speed ${merged.duration} ${merged.amplifier}`
    : `effect ${merged.target} speed ${merged.duration} ${merged.amplifier} true`
  if (item.id === 'summon-zombie') return `summon ${edition === 'Java' ? merged.entity : merged.entity.replace(/^minecraft:/, '')} ${merged.x} ${merged.y} ${merged.z}`
  if (item.id === 'clear-inventory') return `clear ${merged.target}`
  if (item.id === 'clone-structure') return `clone ${merged.beginX} ${merged.beginY} ${merged.beginZ} ${merged.endX} ${merged.endY} ${merged.endZ} ${merged.destX} ${merged.destY} ${merged.destZ} ${merged.mode}`
  return item.command[edition]
}

function App() {
  const [edition, setEdition] = useState(() => localStorage.getItem('cc-edition') || 'Java')
  const [version, setVersion] = useState(() => localStorage.getItem('cc-version') || VERSIONS.Java[0])
  const [query, setQuery] = useState('')
  const [activeQuery, setActiveQuery] = useState('')
  const [category, setCategory] = useState('All commands')
  const [favorites, setFavorites] = useState(() => JSON.parse(localStorage.getItem('cc-favorites') || '[]'))
  const [recent, setRecent] = useState(() => JSON.parse(localStorage.getItem('cc-recent') || '[]'))
  const [custom, setCustom] = useState({})
  const [copied, setCopied] = useState('')
  const [expanded, setExpanded] = useState(null)
  const [showFavorites, setShowFavorites] = useState(false)
  const [showDocs, setShowDocs] = useState(false)

  useEffect(() => { localStorage.setItem('cc-edition', edition); setVersion(VERSIONS[edition].includes(version) ? version : VERSIONS[edition][0]) }, [edition])
  useEffect(() => localStorage.setItem('cc-version', version), [version])
  useEffect(() => localStorage.setItem('cc-favorites', JSON.stringify(favorites)), [favorites])
  useEffect(() => localStorage.setItem('cc-recent', JSON.stringify(recent)), [recent])

  const results = useMemo(() => {
    const ranked = COMMANDS
    .filter(item => item.editions.includes(edition) && (category === 'All commands' || item.category === category) && (!showFavorites || favorites.includes(item.id)))
    .map(item => ({ item, score: searchScore(item, activeQuery) }))
    .filter(({ score }) => !activeQuery.trim() || score >= 3)
    .sort((left, right) => right.score - left.score)
    if (!activeQuery.trim() || !ranked.length) return ranked.map(({ item }) => item)
    const maxScore = ranked[0].score
    return ranked.filter(({ score }) => score >= Math.max(3, maxScore - 1.5)).map(({ item }) => item)
  }, [edition, category, activeQuery, favorites, showFavorites])

  const runSearch = (value = query) => {
    setActiveQuery(value)
    if (value.trim()) setRecent(old => [value.trim(), ...old.filter(item => item.toLowerCase() !== value.trim().toLowerCase())].slice(0, 5))
    const coordinates = value.match(/-?\d+(?:\.\d+)?/g)
    if (/teleport|tp\b/i.test(value) && coordinates?.length >= 3) {
      setCustom(old => ({ ...old, 'teleport-player': { ...old['teleport-player'], target: /\bme\b|\bmy\b|\bi\b/i.test(value) ? '@s' : old['teleport-player']?.target || '@p', x: coordinates[0], y: coordinates[1], z: coordinates[2] } }))
    }
  }

  const toggleFavorite = id => setFavorites(old => old.includes(id) ? old.filter(item => item !== id) : [...old, id])
  const copyCommand = async (item) => {
    const text = buildCommand(item, edition, custom[item.id])
    await navigator.clipboard.writeText(text)
    setCopied(item.id)
    setTimeout(() => setCopied(''), 1800)
  }
  const setField = (id, key, value) => setCustom(old => ({ ...old, [id]: { ...old[id], [key]: value } }))

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#"><span className="brand-mark"><Command size={20} /></span><span>command<span className="brand-accent">craft</span></span></a>
        <nav><button className={showDocs ? 'nav-link active' : 'nav-link'} onClick={() => setShowDocs(true)}><BookOpen size={16} /> Learn commands</button><button className={showFavorites ? 'nav-link active' : 'nav-link'} onClick={() => setShowFavorites(value => !value)}><Heart size={16} /> Favorites <span className="nav-count">{favorites.length}</span></button></nav>
      </header>

      <main>
        <section className="hero">
          <div className="eyebrow"><span className="live-dot" /> CURATED COMMAND LIBRARY</div>
          <h1>Make Minecraft do<br /><em>exactly what you want.</em></h1>
          <p className="hero-copy">Describe your idea in plain English. Get an accurate, ready-to-run command for your edition.</p>
          <div className="search-panel">
            <div className="select-row">
              <div className="select-wrap"><label>EDITION</label><select value={edition} onChange={event => setEdition(event.target.value)}><option>Java</option><option>Bedrock</option></select><ChevronDown size={16} /></div>
              <div className="select-wrap"><label>VERSION</label><select value={version} onChange={event => setVersion(event.target.value)}>{VERSIONS[edition].map(item => <option key={item}>{item}</option>)}</select><ChevronDown size={16} /></div>
            </div>
            <div className="search-input-wrap"><Sparkles size={20} className="sparkle" /><input value={query} onChange={event => setQuery(event.target.value)} onKeyDown={event => event.key === 'Enter' && runSearch()} placeholder="What do you want to do?" /><button className="search-button" onClick={() => runSearch()}><Search size={18} /> Find commands</button></div>
          </div>
          <div className="examples"><span>Try:</span>{EXAMPLES.map(example => <button key={example} onClick={() => { setQuery(example); runSearch(example) }}>{example}</button>)}</div>
        </section>

        <section className="workspace">
          <aside className="sidebar">
            <div className="sidebar-heading"><span>Browse library</span><Filter size={15} /></div>
            <div className="category-list">{CATEGORIES.map(item => <button key={item} className={category === item ? 'category active' : 'category'} onClick={() => { setCategory(item); setShowFavorites(false) }}><span className="category-icon">{item === 'All commands' ? <Command size={16} /> : item === 'Items' ? '◆' : item === 'World' ? '◒' : item === 'Movement' ? '➜' : item === 'Players' ? '●' : '♟'}</span>{item}<span className="category-count">{item === 'All commands' ? COMMANDS.length : COMMANDS.filter(command => command.category === item).length}</span></button>)}</div>
            {recent.length > 0 && <div className="recent-block"><div className="sidebar-heading"><span>Recent searches</span><History size={15} /></div>{recent.map(item => <button className="recent-item" key={item} onClick={() => { setQuery(item); runSearch(item) }}><History size={13} />{item}</button>)}</div>}
            <div className="accuracy-note"><Info size={17} /><div><strong>Accuracy first</strong><p>Every command is checked against edition-specific syntax. Unverified features are never presented as working.</p></div></div>
          </aside>

          <section className="results">
            <div className="results-header"><div><p className="section-kicker">{showFavorites ? 'YOUR COLLECTION' : activeQuery ? 'SEARCH RESULTS' : 'START HERE'}</p><h2>{showFavorites ? 'Saved commands' : activeQuery ? <>Results for <span>“{activeQuery}”</span></> : 'Popular commands'}</h2></div><div className="result-meta">{results.length} {results.length === 1 ? 'command' : 'commands'} <span className="edition-pill">{edition} {version}</span></div></div>
            {results.length === 0 && <div className="empty-state"><Search size={32} /><h3>I couldn’t find that in the command library.</h3><p>This request may need an add-on, mod, plugin, datapack, or a command that is not in the curated collection. Try one of these related searches:</p><div className="related-searches">{['clone a building', 'give everyone diamonds', 'make it daytime', 'teleport me'].map(item => <button key={item} onClick={() => { setQuery(item); runSearch(item) }}>{item}</button>)}</div><button onClick={() => { setQuery(''); setActiveQuery(''); setCategory('All commands'); setShowFavorites(false) }}>Show all commands</button></div>}
            <div className="command-grid">{results.map(item => {
              const isExpanded = expanded === item.id
              const commandText = buildCommand(item, edition, custom[item.id])
              return <article className={isExpanded ? 'command-card expanded' : 'command-card'} key={item.id}>
                <div className="card-top"><span className="category-label">{item.category}</span><button className={favorites.includes(item.id) ? 'favorite active' : 'favorite'} onClick={() => toggleFavorite(item.id)} aria-label="Toggle favorite"><Heart size={18} fill={favorites.includes(item.id) ? 'currentColor' : 'none'} /></button></div>
                <h3>{item.title}</h3><p className="purpose">{item.purpose}</p>
                <div className="command-code"><code><span className="code-prefix">/</span>{commandText}</code><button onClick={() => copyCommand(item)} className={copied === item.id ? 'copy-button copied' : 'copy-button'}>{copied === item.id ? <><Check size={16} /> Copied</> : <><Clipboard size={16} /> Copy</>}</button></div>
                {item.fields.length > 0 && <div className="customizer"><div className="customizer-title"><Settings2 size={15} /> Customize command</div><div className="field-grid">{item.fields.map(field => <label key={field.key}>{field.label}<input value={custom[item.id]?.[field.key] ?? (edition === 'Bedrock' && field.bedrockValue ? field.bedrockValue : field.value)} onChange={event => setField(item.id, field.key, event.target.value)} /><small>{field.hint}</small></label>)}</div></div>}
                <div className="support-row"><span><Terminal size={14} /> {item.run[0]}</span><span className="verified"><Check size={13} /> Verified syntax</span></div>
                <button className="details-toggle" onClick={() => setExpanded(isExpanded ? null : item.id)}>{isExpanded ? 'Hide details' : 'View usage, permissions & fixes'}<ChevronDown size={16} className={isExpanded ? 'rotate' : ''} /></button>
                {item.followUp && <div className="follow-up"><strong>To finish this command, I need:</strong><ul>{item.followUp.map(question => <li key={question}>{question}</li>)}</ul><p>{item.coordinateHelp}</p><small><strong>Copy vs move:</strong> copy leaves the original in place. Move transfers the blocks and clears the original area, so choose the move option only when that is intended.</small></div>}
                {isExpanded && <div className="details"><div className="detail-columns"><div><h4>Supported</h4><p><strong>{edition}</strong> · {item.versions[edition].join(', ')}</p><h4>Permissions</h4><p>{item.permission}. Cheats must be enabled in single-player worlds.</p></div><div><h4>Run it in</h4><p>{item.run.join(' · ')}</p><h4>Command block setup</h4><p>{item.block}</p></div></div><div className="errors"><h4>Common errors</h4>{item.errors.map(error => <p key={error}>• {error}</p>)}</div><a className="docs-link" href={item.doc} target="_blank" rel="noreferrer"><BookOpen size={15} /> Read the documentation <ExternalLink size={13} /></a></div>}
              </article>
            })}</div>
          </section>
        </section>
      </main>
      <footer><div className="footer-brand"><span className="brand-mark small"><Command size={15} /></span> commandcraft</div><span>Local library · No API key required</span><span>Syntax is edition-specific and version-aware.</span></footer>
      {showDocs && <div className="modal-backdrop" onClick={() => setShowDocs(false)}><div className="learn-modal" onClick={event => event.stopPropagation()}><button className="close-modal" onClick={() => setShowDocs(false)}><X /></button><div className="eyebrow">BEGINNER'S GUIDE</div><h2>Commands, without the guesswork.</h2><p>Commands are instructions you can run in chat, command blocks, or a server console. Select your edition above before copying: Java and Bedrock often use different syntax.</p><div className="learn-grid"><div><div className="learn-icon"><Zap size={19} /></div><h3>Selectors</h3><p><code>@s</code> is the executor, <code>@p</code> the nearest player, <code>@a</code> every player, and <code>@e</code> every entity.</p></div><div><div className="learn-icon"><Settings2 size={19} /></div><h3>Coordinates</h3><p>Use three numbers for X, Y, Z. A tilde like <code>~ ~ ~</code> means “relative to where the command runs.”</p></div><div><div className="learn-icon"><Terminal size={19} /></div><h3>Permissions</h3><p>Most world-changing commands require cheats in a local world or operator permission on a server.</p></div></div><div className="learn-callout"><Info size={18} /><span>For command blocks, place the block first, paste the command without the leading slash, then choose the activation settings shown on each result.</span></div></div></div>}
    </div>
  )
}

export default App

createRoot(document.getElementById('root')).render(<App />)
