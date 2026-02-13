import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
    Swords,
    TrendingUp,
    AlertTriangle,
    BookOpen,
    Plus,
    Trophy,
    Skull,
    Flame,
    ChevronDown,
    Zap,
} from 'lucide-react';
import {
    XAxis, YAxis, Tooltip, ResponsiveContainer,
    CartesianGrid, Area, AreaChart,
} from 'recharts';
import { useApp } from '../store';
import ReactMarkdown from 'react-markdown';

// ========================================
// Widget Card Wrapper
// ========================================
function WidgetCard({
    title,
    icon: Icon,
    spanClass = 'col-12',
    children,
    accentColor = 'cyan',
}: {
    title: string;
    icon: React.ElementType;
    spanClass?: string;
    children: React.ReactNode;
    accentColor?: 'cyan' | 'magenta';
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className={`widget-card ${spanClass}`}
        >
            <div className="widget-header">
                <div className={`widget-icon-wrap ${accentColor}`}>
                    <Icon size={22} color={accentColor === 'cyan' ? 'var(--cyan)' : 'var(--magenta)'} />
                </div>
                <h3 className="widget-title">{title}</h3>
            </div>
            <div style={{ flex: 1 }}>{children}</div>
        </motion.div>
    );
}

// ========================================
// Widget A: Battle Log
// ========================================
function BattleLogWidget() {
    const { state, dispatch } = useApp();
    const [myChar, setMyChar] = useState('');
    const [oppChar, setOppChar] = useState('');
    const [result, setResult] = useState<'win' | 'lose'>('win');
    const [lpChange, setLpChange] = useState('');
    const [memo, setMemo] = useState('');

    const selectedGame = state.games.find(g => g.id === state.selectedGameId);
    const characters = selectedGame?.tags.filter(t => t.category === 'character') || [];

    const streak = useMemo(() => {
        const records = state.battleRecords.filter(
            r => !state.selectedGameId || r.gameId === state.selectedGameId
        );
        if (records.length === 0) return { count: 0, type: 'none' as const };
        const firstResult = records[0]?.result;
        let count = 0;
        for (const r of records) {
            if (r.result === firstResult) count++;
            else break;
        }
        return { count, type: firstResult || ('none' as const) };
    }, [state.battleRecords, state.selectedGameId]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!myChar || !oppChar) return;
        const gameId = state.selectedGameId || state.games[0]?.id;
        if (!gameId) return;

        const existingChars = state.games.find(g => g.id === gameId)?.tags.filter(t => t.category === 'character') || [];
        if (!existingChars.some(t => t.name === myChar)) {
            dispatch({ type: 'ADD_TAG', payload: { gameId, tag: { name: myChar, category: 'character' } } });
        }
        if (!existingChars.some(t => t.name === oppChar)) {
            dispatch({ type: 'ADD_TAG', payload: { gameId, tag: { name: oppChar, category: 'character' } } });
        }

        dispatch({
            type: 'ADD_BATTLE',
            payload: {
                gameId,
                myCharacter: myChar,
                opponentCharacter: oppChar,
                result,
                lpChange: parseInt(lpChange) || 0,
                memo,
            },
        });
        setMyChar('');
        setOppChar('');
        setLpChange('');
        setMemo('');
    };

    return (
        <WidgetCard title="Battle Log" icon={Swords} spanClass="col-7">
            {/* Streak */}
            {streak.count >= 2 && (
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    style={{
                        marginBottom: 20,
                        padding: 14,
                        borderRadius: 12,
                        border: `1px solid ${streak.type === 'win' ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'}`,
                        background: streak.type === 'win' ? 'rgba(34,197,94,0.05)' : 'rgba(239,68,68,0.05)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                    }}
                >
                    {streak.type === 'win' ? (
                        <Flame size={22} color="var(--success)" className="animate-pulse-glow" />
                    ) : (
                        <Skull size={22} color="var(--danger)" />
                    )}
                    <span style={{ fontFamily: "'Chakra Petch', sans-serif", fontWeight: 700, fontSize: '1rem' }}>
                        {streak.type === 'win' ? `🔥 ${streak.count}連勝中！` : `💀 ${streak.count}連敗中...`}
                    </span>
                </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div>
                        <label className="form-label">自キャラ</label>
                        <input
                            type="text"
                            list="my-chars"
                            value={myChar}
                            onChange={e => setMyChar(e.target.value)}
                            placeholder="キャラ名"
                            className="form-input"
                        />
                        <datalist id="my-chars">
                            {characters.map(c => <option key={c.id} value={c.name} />)}
                        </datalist>
                    </div>
                    <div>
                        <label className="form-label">相手キャラ</label>
                        <input
                            type="text"
                            list="opp-chars"
                            value={oppChar}
                            onChange={e => setOppChar(e.target.value)}
                            placeholder="キャラ名"
                            className="form-input"
                        />
                        <datalist id="opp-chars">
                            {characters.map(c => <option key={c.id} value={c.name} />)}
                        </datalist>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                    <div>
                        <label className="form-label">勝敗</label>
                        <div style={{ display: 'flex', gap: 8 }}>
                            <button
                                type="button"
                                onClick={() => setResult('win')}
                                className={`btn-win ${result === 'win' ? 'selected' : ''}`}
                            >
                                <Trophy size={16} />WIN
                            </button>
                            <button
                                type="button"
                                onClick={() => setResult('lose')}
                                className={`btn-lose ${result === 'lose' ? 'selected' : ''}`}
                            >
                                <Skull size={16} />LOSE
                            </button>
                        </div>
                    </div>
                    <div>
                        <label className="form-label">LP増減</label>
                        <input
                            type="number"
                            value={lpChange}
                            onChange={e => setLpChange(e.target.value)}
                            placeholder="±50"
                            className="form-input"
                        />
                    </div>
                    <div>
                        <label className="form-label">メモ</label>
                        <input
                            type="text"
                            value={memo}
                            onChange={e => setMemo(e.target.value)}
                            placeholder="対空が甘い..."
                            className="form-input"
                        />
                    </div>
                </div>

                <button type="submit" className="btn-primary">
                    <Plus size={20} />
                    記録を追加
                </button>
            </form>

            {/* Recent Records */}
            <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 300, overflowY: 'auto' }}>
                {state.battleRecords
                    .filter(r => !state.selectedGameId || r.gameId === state.selectedGameId)
                    .slice(0, 10)
                    .map(record => (
                        <div key={record.id} className="record-item">
                            <span style={{ fontWeight: 700, color: record.result === 'win' ? 'var(--success)' : 'var(--danger)' }}>
                                {record.result === 'win' ? 'W' : 'L'}
                            </span>
                            <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{record.myCharacter}</span>
                            <span style={{ color: 'var(--text-muted)' }}>vs</span>
                            <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{record.opponentCharacter}</span>
                            <span style={{
                                marginLeft: 'auto',
                                fontFamily: 'monospace',
                                color: record.lpChange >= 0 ? 'var(--success)' : 'var(--danger)',
                            }}>
                                {record.lpChange >= 0 ? '+' : ''}{record.lpChange} LP
                            </span>
                        </div>
                    ))}
                {state.battleRecords.length === 0 && (
                    <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.95rem', padding: '24px 0' }}>
                        まだ記録がありません
                    </p>
                )}
            </div>
        </WidgetCard>
    );
}

// ========================================
// Widget B: Matchup Notes
// ========================================
function MatchupNotesWidget() {
    const { state, dispatch } = useApp();
    const [selectedOpp, setSelectedOpp] = useState('');
    const [noteContent, setNoteContent] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    const selectedGame = state.games.find(g => g.id === state.selectedGameId);
    const characters = selectedGame?.tags.filter(t => t.category === 'character') || [];

    const opponents = useMemo(() => {
        const opps = new Set<string>();
        state.battleRecords
            .filter(r => !state.selectedGameId || r.gameId === state.selectedGameId)
            .forEach(r => opps.add(r.opponentCharacter));
        characters.forEach(c => opps.add(c.name));
        return Array.from(opps);
    }, [state.battleRecords, state.selectedGameId, characters]);

    const currentNote = state.matchupNotes.find(
        n => n.opponentCharacter === selectedOpp &&
            (!state.selectedGameId || n.gameId === state.selectedGameId)
    );

    const handleSave = () => {
        const gameId = state.selectedGameId || state.games[0]?.id;
        if (!gameId || !selectedOpp) return;
        dispatch({
            type: 'SET_MATCHUP_NOTE',
            payload: { gameId, opponentCharacter: selectedOpp, content: noteContent },
        });
        setIsEditing(false);
    };

    return (
        <WidgetCard title="Matchup Notes" icon={BookOpen} spanClass="col-5" accentColor="magenta">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>
                    <label className="form-label">対戦相手キャラ</label>
                    <div style={{ position: 'relative' }}>
                        <select
                            value={selectedOpp}
                            onChange={e => {
                                setSelectedOpp(e.target.value);
                                const note = state.matchupNotes.find(
                                    n => n.opponentCharacter === e.target.value
                                );
                                setNoteContent(note?.content || '');
                                setIsEditing(false);
                            }}
                            className="form-select"
                        >
                            <option value="">選択...</option>
                            {opponents.map(opp => (
                                <option key={opp} value={opp}>{opp}</option>
                            ))}
                        </select>
                        <ChevronDown size={18} color="var(--text-muted)" style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                    </div>
                </div>

                {selectedOpp && (
                    <div style={{ minHeight: 180 }}>
                        {isEditing ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                <textarea
                                    value={noteContent}
                                    onChange={e => setNoteContent(e.target.value)}
                                    placeholder={"対策メモをMarkdownで記入...\n\n## 注意ポイント\n- 飛び込みに対空\n- 波動拳を読んで飛び"}
                                    rows={7}
                                    className="form-input"
                                    style={{ resize: 'none' }}
                                />
                                <div style={{ display: 'flex', gap: 8 }}>
                                    <button
                                        onClick={handleSave}
                                        style={{
                                            flex: 1, padding: 12, borderRadius: 12,
                                            background: 'rgba(255,0,170,0.2)', border: '1px solid rgba(255,0,170,0.3)',
                                            color: 'var(--magenta)', fontSize: '0.9rem', fontWeight: 700,
                                            cursor: 'pointer',
                                        }}
                                    >保存</button>
                                    <button
                                        onClick={() => setIsEditing(false)}
                                        style={{
                                            padding: '12px 20px', borderRadius: 12,
                                            background: 'var(--void-lighter)', border: '1px solid var(--glass-border)',
                                            color: 'var(--text-muted)', fontSize: '0.9rem',
                                            cursor: 'pointer',
                                        }}
                                    >キャンセル</button>
                                </div>
                            </div>
                        ) : (
                            <div
                                onClick={() => {
                                    setNoteContent(currentNote?.content || '');
                                    setIsEditing(true);
                                }}
                                style={{
                                    minHeight: 180, padding: 16, borderRadius: 12,
                                    background: 'rgba(17,17,24,0.5)', border: '1px solid var(--glass-border)',
                                    cursor: 'pointer', transition: 'border-color 0.2s',
                                }}
                            >
                                {currentNote?.content ? (
                                    <div style={{ color: 'var(--text-dim)', fontSize: '1rem', lineHeight: 1.7 }}>
                                        <ReactMarkdown>{currentNote.content}</ReactMarkdown>
                                    </div>
                                ) : (
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', textAlign: 'center', paddingTop: 64 }}>
                                        クリックして対策メモを追加...
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {!selectedOpp && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 180, color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                        対戦相手を選択するとメモが表示されます
                    </div>
                )}
            </div>
        </WidgetCard>
    );
}

// ========================================
// Widget C: Growth Graph
// ========================================
function GrowthGraphWidget() {
    const { state } = useApp();

    const chartData = useMemo(() => {
        const records = state.battleRecords
            .filter(r => !state.selectedGameId || r.gameId === state.selectedGameId)
            .slice()
            .reverse();

        let lp = state.profile.currentLP;
        for (const r of [...records].reverse()) {
            lp -= r.lpChange;
        }

        const data: { name: string; lp: number; game: number }[] = [];
        let currentLP = lp;
        records.forEach((r, i) => {
            currentLP += r.lpChange;
            data.push({ name: `#${i + 1}`, lp: currentLP, game: i + 1 });
        });
        return data;
    }, [state.battleRecords, state.selectedGameId, state.profile.currentLP]);

    return (
        <WidgetCard title="Growth Graph" icon={TrendingUp} spanClass="col-7">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                <Zap size={22} color="var(--cyan)" className="animate-pulse-glow" />
                <span style={{ fontFamily: "'Chakra Petch', sans-serif", fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {state.profile.currentLP.toLocaleString()}
                </span>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>LP</span>
            </div>

            {chartData.length > 1 ? (
                <div style={{ height: 280, marginLeft: -8, marginRight: -8 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="lpGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#00f3ff" stopOpacity={0.3} />
                                    <stop offset="100%" stopColor="#00f3ff" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                            <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={{ stroke: 'rgba(255,255,255,0.1)' }} />
                            <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={{ stroke: 'rgba(255,255,255,0.1)' }} />
                            <Tooltip
                                contentStyle={{
                                    background: '#0d0d14',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '8px',
                                    color: '#e2e8f0',
                                    fontSize: '13px',
                                }}
                                labelStyle={{ color: '#64748b' }}
                            />
                            <Area
                                type="monotone"
                                dataKey="lp"
                                stroke="#00f3ff"
                                strokeWidth={2}
                                fill="url(#lpGradient)"
                                dot={{ r: 3, fill: '#00f3ff', strokeWidth: 0 }}
                                activeDot={{ r: 5, fill: '#00f3ff', stroke: '#050505', strokeWidth: 2 }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 280, color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                    2件以上の戦績データを入力するとグラフが表示されます
                </div>
            )}
        </WidgetCard>
    );
}

// ========================================
// Widget D: Analysis
// ========================================
function AnalysisWidget() {
    const { state } = useApp();

    const matchupStats = useMemo(() => {
        const records = state.battleRecords.filter(
            r => !state.selectedGameId || r.gameId === state.selectedGameId
        );
        const stats: Record<string, { wins: number; losses: number; total: number }> = {};
        records.forEach(r => {
            if (!stats[r.opponentCharacter]) {
                stats[r.opponentCharacter] = { wins: 0, losses: 0, total: 0 };
            }
            stats[r.opponentCharacter].total++;
            if (r.result === 'win') stats[r.opponentCharacter].wins++;
            else stats[r.opponentCharacter].losses++;
        });
        return Object.entries(stats)
            .map(([name, s]) => ({ name, winRate: Math.round((s.wins / s.total) * 100), ...s }))
            .sort((a, b) => a.winRate - b.winRate);
    }, [state.battleRecords, state.selectedGameId]);

    return (
        <WidgetCard title="Analysis" icon={AlertTriangle} spanClass="col-5" accentColor="magenta">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxHeight: 350, overflowY: 'auto' }}>
                {matchupStats.length > 0 ? (
                    matchupStats.map(stat => {
                        const isDanger = stat.winRate < 40;
                        const isStrong = stat.winRate >= 60;
                        return (
                            <motion.div
                                key={stat.name}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className={`analysis-item ${isDanger ? 'danger' : isStrong ? 'strong' : ''}`}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                                    {isDanger && <AlertTriangle size={18} color="var(--danger)" className="animate-pulse-glow" />}
                                    {isStrong && <Trophy size={18} color="var(--success)" />}
                                    <div>
                                        <p style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--text-primary)' }}>vs {stat.name}</p>
                                        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{stat.total}戦 ({stat.wins}勝 {stat.losses}敗)</p>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <p style={{
                                        fontFamily: "'Chakra Petch', sans-serif",
                                        fontSize: '1.3rem',
                                        fontWeight: 700,
                                        color: isDanger ? 'var(--danger)' : isStrong ? 'var(--success)' : 'var(--text-primary)',
                                    }}>{stat.winRate}%</p>
                                    {isDanger && (
                                        <span style={{ fontSize: '0.75rem', color: 'var(--danger)', fontWeight: 500 }}>⚠ 危険!</span>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })
                ) : (
                    <div style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                        minHeight: 250, color: 'var(--text-muted)', fontSize: '0.95rem', gap: 12,
                    }}>
                        <AlertTriangle size={48} color="rgba(100,116,139,0.3)" />
                        <p>戦績を記録すると分析が表示されます</p>
                    </div>
                )}
            </div>
        </WidgetCard>
    );
}

// ========================================
// Dashboard Page
// ========================================
export default function Dashboard() {
    const { state, dispatch } = useApp();

    return (
        <div>
            {/* Page Header */}
            <div className="page-header">
                <div>
                    <h2 className="page-title">
                        THE <span className="gradient-text">COCKPIT</span>
                    </h2>
                    <p className="page-subtitle">あなたの戦場を俯瞰するダッシュボード</p>
                </div>

                {state.games.length > 0 && (
                    <div style={{ position: 'relative' }}>
                        <select
                            value={state.selectedGameId || ''}
                            onChange={e => dispatch({ type: 'SELECT_GAME', payload: e.target.value || null })}
                            className="form-select"
                            style={{ minWidth: 220 }}
                        >
                            <option value="">全てのゲーム</option>
                            {state.games.map(g => (
                                <option key={g.id} value={g.id}>{g.name}</option>
                            ))}
                        </select>
                        <ChevronDown size={18} color="var(--text-muted)" style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                    </div>
                )}
            </div>

            {/* Empty State */}
            {state.games.length === 0 && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-card empty-state"
                >
                    <div className="empty-icon-wrap">
                        <Swords size={48} color="var(--cyan)" />
                    </div>
                    <h3 className="empty-title">まずはゲームを登録しよう</h3>
                    <p className="empty-desc">
                        Game Config からゲームタイトルとキャラクターを登録すると、ここにデータが表示されます。
                    </p>
                    <a href="/config" className="empty-btn">
                        <Plus size={24} />
                        Game Config へ
                    </a>
                </motion.div>
            )}

            {/* Bento Grid */}
            {state.games.length > 0 && (
                <div className="bento-grid">
                    <BattleLogWidget />
                    <MatchupNotesWidget />
                    <GrowthGraphWidget />
                    <AnalysisWidget />
                </div>
            )}
        </div>
    );
}
