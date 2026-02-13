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
    LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
    CartesianGrid, Area, AreaChart,
} from 'recharts';
import { useApp } from '../store';
import type { BattleRecord } from '../types';
import ReactMarkdown from 'react-markdown';

// ========================================
// Widget Card Wrapper
// ========================================
function WidgetCard({
    title,
    icon: Icon,
    span = 'col-span-12 md:col-span-6',
    children,
    accentColor = 'cyan',
}: {
    title: string;
    icon: React.ElementType;
    span?: string;
    children: React.ReactNode;
    accentColor?: 'cyan' | 'magenta';
}) {
    const colors = {
        cyan: { text: 'text-cyan', bg: 'bg-cyan/10', border: 'border-cyan/20', glow: 'glow-cyan' },
        magenta: { text: 'text-magenta', bg: 'bg-magenta/10', border: 'border-magenta/20', glow: 'glow-magenta' },
    };
    const c = colors[accentColor];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className={`${span} glass-card p-5 flex flex-col`}
        >
            <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-lg ${c.bg} ${c.border} border`}>
                    <Icon className={`w-4 h-4 ${c.text}`} />
                </div>
                <h3 className="font-heading text-sm font-semibold text-text tracking-wide uppercase">
                    {title}
                </h3>
            </div>
            <div className="flex-1">{children}</div>
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

    // Streak counter
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

        // スマートサジェスト: 新しいキャラ名を自動登録
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
        <WidgetCard title="Battle Log" icon={Swords} span="col-span-12 lg:col-span-7">
            {/* Streak */}
            {streak.count >= 2 && (
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={`mb-4 p-3 rounded-xl border flex items-center gap-3 ${streak.type === 'win'
                            ? 'bg-success/5 border-success/20'
                            : 'bg-danger/5 border-danger/20'
                        }`}
                >
                    {streak.type === 'win' ? (
                        <Flame className="w-5 h-5 text-success animate-pulse-glow" />
                    ) : (
                        <Skull className="w-5 h-5 text-danger" />
                    )}
                    <span className="font-heading font-bold text-sm">
                        {streak.type === 'win' ? `🔥 ${streak.count}連勝中！` : `💀 ${streak.count}連敗中...`}
                    </span>
                </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-xs text-text-muted mb-1">自キャラ</label>
                        <input
                            type="text"
                            list="my-chars"
                            value={myChar}
                            onChange={e => setMyChar(e.target.value)}
                            placeholder="キャラ名"
                            className="w-full px-3 py-2 rounded-lg bg-void-lighter border border-glass-border text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-cyan/40 transition-colors"
                        />
                        <datalist id="my-chars">
                            {characters.map(c => <option key={c.id} value={c.name} />)}
                        </datalist>
                    </div>
                    <div>
                        <label className="block text-xs text-text-muted mb-1">相手キャラ</label>
                        <input
                            type="text"
                            list="opp-chars"
                            value={oppChar}
                            onChange={e => setOppChar(e.target.value)}
                            placeholder="キャラ名"
                            className="w-full px-3 py-2 rounded-lg bg-void-lighter border border-glass-border text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-cyan/40 transition-colors"
                        />
                        <datalist id="opp-chars">
                            {characters.map(c => <option key={c.id} value={c.name} />)}
                        </datalist>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                    <div>
                        <label className="block text-xs text-text-muted mb-1">勝敗</label>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => setResult('win')}
                                className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-all ${result === 'win'
                                        ? 'bg-success/15 border-success/40 text-success'
                                        : 'bg-void-lighter border-glass-border text-text-muted hover:border-success/20'
                                    }`}
                            >
                                <Trophy className="w-3.5 h-3.5 inline mr-1" />WIN
                            </button>
                            <button
                                type="button"
                                onClick={() => setResult('lose')}
                                className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-all ${result === 'lose'
                                        ? 'bg-danger/15 border-danger/40 text-danger'
                                        : 'bg-void-lighter border-glass-border text-text-muted hover:border-danger/20'
                                    }`}
                            >
                                <Skull className="w-3.5 h-3.5 inline mr-1" />LOSE
                            </button>
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs text-text-muted mb-1">LP増減</label>
                        <input
                            type="number"
                            value={lpChange}
                            onChange={e => setLpChange(e.target.value)}
                            placeholder="±50"
                            className="w-full px-3 py-2 rounded-lg bg-void-lighter border border-glass-border text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-cyan/40 transition-colors"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-text-muted mb-1">メモ</label>
                        <input
                            type="text"
                            value={memo}
                            onChange={e => setMemo(e.target.value)}
                            placeholder="対空が甘い..."
                            className="w-full px-3 py-2 rounded-lg bg-void-lighter border border-glass-border text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-cyan/40 transition-colors"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan/80 to-cyan/60 text-void font-bold text-sm hover:from-cyan hover:to-cyan/80 transition-all flex items-center justify-center gap-2 glow-cyan"
                >
                    <Plus className="w-4 h-4" />
                    記録を追加
                </button>
            </form>

            {/* Recent Records */}
            <div className="mt-4 space-y-2 max-h-[200px] overflow-y-auto">
                {state.battleRecords
                    .filter(r => !state.selectedGameId || r.gameId === state.selectedGameId)
                    .slice(0, 10)
                    .map(record => (
                        <div
                            key={record.id}
                            className="flex items-center gap-3 p-2.5 rounded-lg bg-void-lighter/50 border border-glass-border text-xs"
                        >
                            <span className={`font-bold ${record.result === 'win' ? 'text-success' : 'text-danger'}`}>
                                {record.result === 'win' ? 'W' : 'L'}
                            </span>
                            <span className="text-text font-medium">{record.myCharacter}</span>
                            <span className="text-text-muted">vs</span>
                            <span className="text-text font-medium">{record.opponentCharacter}</span>
                            <span className={`ml-auto font-mono ${record.lpChange >= 0 ? 'text-success' : 'text-danger'}`}>
                                {record.lpChange >= 0 ? '+' : ''}{record.lpChange} LP
                            </span>
                        </div>
                    ))}
                {state.battleRecords.length === 0 && (
                    <p className="text-center text-text-muted text-xs py-4">まだ記録がありません</p>
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

    // 相手キャラの一覧（戦績から自動収集）
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
        <WidgetCard title="Matchup Notes" icon={BookOpen} span="col-span-12 lg:col-span-5" accentColor="magenta">
            <div className="space-y-3">
                <div>
                    <label className="block text-xs text-text-muted mb-1">対戦相手キャラ</label>
                    <div className="relative">
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
                            className="w-full px-3 py-2 rounded-lg bg-void-lighter border border-glass-border text-sm text-text focus:outline-none focus:border-magenta/40 transition-colors appearance-none"
                        >
                            <option value="">選択...</option>
                            {opponents.map(opp => (
                                <option key={opp} value={opp}>{opp}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
                    </div>
                </div>

                {selectedOpp && (
                    <div className="min-h-[180px]">
                        {isEditing ? (
                            <div className="space-y-2">
                                <textarea
                                    value={noteContent}
                                    onChange={e => setNoteContent(e.target.value)}
                                    placeholder="対策メモをMarkdownで記入...&#10;&#10;## 注意ポイント&#10;- 飛び込みに対空&#10;- 波動拳を読んで飛び"
                                    rows={7}
                                    className="w-full px-3 py-2 rounded-lg bg-void-lighter border border-glass-border text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-magenta/40 transition-colors resize-none"
                                />
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleSave}
                                        className="flex-1 py-2 rounded-lg bg-magenta/20 border border-magenta/30 text-magenta text-xs font-bold hover:bg-magenta/30 transition-colors"
                                    >
                                        保存
                                    </button>
                                    <button
                                        onClick={() => setIsEditing(false)}
                                        className="px-4 py-2 rounded-lg bg-void-lighter border border-glass-border text-text-muted text-xs hover:text-text transition-colors"
                                    >
                                        キャンセル
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div
                                onClick={() => {
                                    setNoteContent(currentNote?.content || '');
                                    setIsEditing(true);
                                }}
                                className="min-h-[180px] p-3 rounded-lg bg-void-lighter/50 border border-glass-border cursor-pointer hover:border-magenta/20 transition-colors"
                            >
                                {currentNote?.content ? (
                                    <div className="prose prose-invert prose-sm max-w-none text-text-dim text-sm leading-relaxed">
                                        <ReactMarkdown>{currentNote.content}</ReactMarkdown>
                                    </div>
                                ) : (
                                    <p className="text-text-muted text-xs text-center pt-16">
                                        クリックして対策メモを追加...
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {!selectedOpp && (
                    <div className="flex items-center justify-center min-h-[180px] text-text-muted text-xs">
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
        // LP逆算: 現在LPから過去に遡る
        for (const r of [...records].reverse()) {
            lp -= r.lpChange;
        }

        const data: { name: string; lp: number; game: number }[] = [];
        let currentLP = lp;
        records.forEach((r, i) => {
            currentLP += r.lpChange;
            data.push({
                name: `#${i + 1}`,
                lp: currentLP,
                game: i + 1,
            });
        });

        return data;
    }, [state.battleRecords, state.selectedGameId, state.profile.currentLP]);

    return (
        <WidgetCard title="Growth Graph" icon={TrendingUp} span="col-span-12 lg:col-span-7">
            <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-cyan animate-pulse-glow" />
                    <span className="font-heading text-2xl font-bold text-text">
                        {state.profile.currentLP.toLocaleString()}
                    </span>
                    <span className="text-xs text-text-muted">LP</span>
                </div>
            </div>

            {chartData.length > 1 ? (
                <div className="h-[200px] -mx-2">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="lpGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#00f3ff" stopOpacity={0.3} />
                                    <stop offset="100%" stopColor="#00f3ff" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                            <XAxis
                                dataKey="name"
                                tick={{ fill: '#64748b', fontSize: 10 }}
                                axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                            />
                            <YAxis
                                tick={{ fill: '#64748b', fontSize: 10 }}
                                axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                            />
                            <Tooltip
                                contentStyle={{
                                    background: '#0d0d14',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '8px',
                                    color: '#e2e8f0',
                                    fontSize: '12px',
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
                <div className="flex items-center justify-center h-[200px] text-text-muted text-xs">
                    2件以上の戦績データを入力するとグラフが表示されます
                </div>
            )}
        </WidgetCard>
    );
}

// ========================================
// Widget D: Analysis (弱点発見)
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
            .map(([name, s]) => ({
                name,
                winRate: Math.round((s.wins / s.total) * 100),
                ...s,
            }))
            .sort((a, b) => a.winRate - b.winRate);
    }, [state.battleRecords, state.selectedGameId]);

    return (
        <WidgetCard title="Analysis" icon={AlertTriangle} span="col-span-12 lg:col-span-5" accentColor="magenta">
            <div className="space-y-2 max-h-[280px] overflow-y-auto">
                {matchupStats.length > 0 ? (
                    matchupStats.map(stat => {
                        const isDanger = stat.winRate < 40;
                        const isStrong = stat.winRate >= 60;
                        return (
                            <motion.div
                                key={stat.name}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className={`p-3 rounded-lg border flex items-center justify-between ${isDanger
                                        ? 'bg-danger/5 border-danger/20'
                                        : isStrong
                                            ? 'bg-success/5 border-success/20'
                                            : 'bg-void-lighter/50 border-glass-border'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    {isDanger && <AlertTriangle className="w-4 h-4 text-danger animate-pulse-glow" />}
                                    {isStrong && <Trophy className="w-4 h-4 text-success" />}
                                    <div>
                                        <p className="text-sm font-medium text-text">vs {stat.name}</p>
                                        <p className="text-xs text-text-muted">{stat.total}戦 ({stat.wins}勝 {stat.losses}敗)</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className={`font-heading text-lg font-bold ${isDanger ? 'text-danger' : isStrong ? 'text-success' : 'text-text'
                                        }`}>
                                        {stat.winRate}%
                                    </p>
                                    {isDanger && (
                                        <span className="text-[10px] text-danger font-medium">⚠ 危険!</span>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })
                ) : (
                    <div className="flex flex-col items-center justify-center min-h-[200px] text-text-muted text-xs gap-2">
                        <AlertTriangle className="w-8 h-8 text-text-muted/30" />
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
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="font-heading text-2xl font-bold tracking-wide">
                        THE <span className="gradient-text">COCKPIT</span>
                    </h2>
                    <p className="text-sm text-text-dim mt-1">
                        あなたの戦場を俯瞰するダッシュボード
                    </p>
                </div>

                {/* Game Selector */}
                {state.games.length > 0 && (
                    <div className="relative">
                        <select
                            value={state.selectedGameId || ''}
                            onChange={e => dispatch({ type: 'SELECT_GAME', payload: e.target.value || null })}
                            className="px-4 py-2 pr-8 rounded-xl bg-void-lighter border border-glass-border text-sm text-text focus:outline-none focus:border-cyan/40 transition-colors appearance-none min-w-[180px]"
                        >
                            <option value="">全てのゲーム</option>
                            {state.games.map(g => (
                                <option key={g.id} value={g.id}>{g.name}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
                    </div>
                )}
            </div>

            {/* Empty State */}
            {state.games.length === 0 && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-card p-8 text-center"
                >
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-cyan/10 border border-cyan/20 flex items-center justify-center">
                        <Swords className="w-8 h-8 text-cyan" />
                    </div>
                    <h3 className="font-heading text-lg font-semibold mb-2">まずはゲームを登録しよう</h3>
                    <p className="text-sm text-text-dim mb-4">
                        Game Config からゲームタイトルとキャラクターを登録すると、ここにデータが表示されます。
                    </p>
                    <a
                        href="/config"
                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan/80 to-cyan/60 text-void font-bold text-sm hover:from-cyan hover:to-cyan/80 transition-all glow-cyan"
                    >
                        <Plus className="w-4 h-4" />
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
