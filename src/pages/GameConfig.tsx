import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Gamepad2,
    Plus,
    Trash2,
    Tag,
    User,
    Map,
    Crosshair,
    MoreHorizontal,
    ChevronDown,
    Sparkles,
} from 'lucide-react';
import { useApp } from '../store';
import type { Tag as TagType } from '../types';

const categoryOptions: { value: TagType['category']; label: string; icon: React.ElementType }[] = [
    { value: 'character', label: 'キャラクター', icon: User },
    { value: 'map', label: 'マップ', icon: Map },
    { value: 'weapon', label: '武器', icon: Crosshair },
    { value: 'other', label: 'その他', icon: MoreHorizontal },
];

const categoryColors: Record<string, string> = {
    character: 'bg-cyan/10 text-cyan border-cyan/20',
    map: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    weapon: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    other: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
};

export default function GameConfig() {
    const { state, dispatch } = useApp();
    const [gameName, setGameName] = useState('');
    const [selectedGameId, setSelectedGameId] = useState<string | null>(null);
    const [tagName, setTagName] = useState('');
    const [tagCategory, setTagCategory] = useState<TagType['category']>('character');

    const selectedGame = state.games.find(g => g.id === selectedGameId);

    const handleAddGame = (e: React.FormEvent) => {
        e.preventDefault();
        if (!gameName.trim()) return;
        dispatch({ type: 'ADD_GAME', payload: { name: gameName.trim(), tags: [] } });
        setGameName('');
    };

    const handleAddTag = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedGameId || !tagName.trim()) return;
        dispatch({
            type: 'ADD_TAG',
            payload: { gameId: selectedGameId, tag: { name: tagName.trim(), category: tagCategory } },
        });
        setTagName('');
    };

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            {/* Header */}
            <div>
                <h2 className="font-heading text-2xl font-bold tracking-wide">
                    GAME <span className="gradient-text">CONFIG</span>
                </h2>
                <p className="text-sm text-text-dim mt-1">
                    あなたの戦場を定義する ― ゲームタイトルとタグを登録
                </p>
            </div>

            {/* Add Game */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-6"
            >
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-cyan/10 border border-cyan/20">
                        <Gamepad2 className="w-4 h-4 text-cyan" />
                    </div>
                    <h3 className="font-heading text-sm font-semibold tracking-wide uppercase">Add Game</h3>
                </div>
                <form onSubmit={handleAddGame} className="flex gap-3">
                    <input
                        type="text"
                        value={gameName}
                        onChange={e => setGameName(e.target.value)}
                        placeholder='ゲームタイトルを入力 (例: "格ゲーX", "FPS Alpha")'
                        className="flex-1 px-4 py-2.5 rounded-xl bg-void-lighter border border-glass-border text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-cyan/40 transition-colors"
                    />
                    <button
                        type="submit"
                        className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan/80 to-cyan/60 text-void font-bold text-sm hover:from-cyan hover:to-cyan/80 transition-all flex items-center gap-2 glow-cyan"
                    >
                        <Plus className="w-4 h-4" />
                        追加
                    </button>
                </form>
            </motion.div>

            {/* Game List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <AnimatePresence>
                    {state.games.map((game, i) => (
                        <motion.div
                            key={game.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ delay: i * 0.05 }}
                            onClick={() => setSelectedGameId(game.id === selectedGameId ? null : game.id)}
                            className={`glass-card glass-card-hover p-5 cursor-pointer transition-all ${selectedGameId === game.id ? 'glow-cyan border-cyan/30' : ''
                                }`}
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <Gamepad2 className={`w-5 h-5 ${selectedGameId === game.id ? 'text-cyan' : 'text-text-dim'}`} />
                                    <h4 className="font-heading font-semibold text-text">{game.name}</h4>
                                </div>
                                <button
                                    onClick={e => {
                                        e.stopPropagation();
                                        dispatch({ type: 'DELETE_GAME', payload: game.id });
                                        if (selectedGameId === game.id) setSelectedGameId(null);
                                    }}
                                    className="p-1.5 rounded-lg text-text-muted hover:text-danger hover:bg-danger/10 transition-colors"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                                {game.tags.slice(0, 8).map(tag => (
                                    <span
                                        key={tag.id}
                                        className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${categoryColors[tag.category]}`}
                                    >
                                        {tag.name}
                                    </span>
                                ))}
                                {game.tags.length > 8 && (
                                    <span className="px-2 py-0.5 rounded-full text-[10px] text-text-muted">
                                        +{game.tags.length - 8}
                                    </span>
                                )}
                                {game.tags.length === 0 && (
                                    <span className="text-[10px] text-text-muted">タグ未登録</span>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {state.games.length === 0 && (
                <div className="text-center py-12">
                    <Sparkles className="w-12 h-12 text-text-muted/30 mx-auto mb-3" />
                    <p className="text-text-muted text-sm">ゲームを追加して始めましょう</p>
                </div>
            )}

            {/* Tag Management */}
            <AnimatePresence>
                {selectedGame && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="glass-card p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 rounded-lg bg-magenta/10 border border-magenta/20">
                                    <Tag className="w-4 h-4 text-magenta" />
                                </div>
                                <h3 className="font-heading text-sm font-semibold tracking-wide uppercase">
                                    Define Tags — {selectedGame.name}
                                </h3>
                            </div>

                            <form onSubmit={handleAddTag} className="flex flex-col sm:flex-row gap-3 mb-5">
                                <div className="relative flex-shrink-0">
                                    <select
                                        value={tagCategory}
                                        onChange={e => setTagCategory(e.target.value as TagType['category'])}
                                        className="px-4 py-2.5 pr-8 rounded-xl bg-void-lighter border border-glass-border text-sm text-text focus:outline-none focus:border-magenta/40 transition-colors appearance-none"
                                    >
                                        {categoryOptions.map(opt => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
                                </div>
                                <input
                                    type="text"
                                    value={tagName}
                                    onChange={e => setTagName(e.target.value)}
                                    placeholder="タグ名を入力..."
                                    className="flex-1 px-4 py-2.5 rounded-xl bg-void-lighter border border-glass-border text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-magenta/40 transition-colors"
                                />
                                <button
                                    type="submit"
                                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-magenta/80 to-magenta/60 text-white font-bold text-sm hover:from-magenta hover:to-magenta/80 transition-all flex items-center gap-2 glow-magenta"
                                >
                                    <Plus className="w-4 h-4" />
                                    追加
                                </button>
                            </form>

                            {/* Tag List */}
                            {categoryOptions.map(cat => {
                                const tags = selectedGame.tags.filter(t => t.category === cat.value);
                                if (tags.length === 0) return null;
                                return (
                                    <div key={cat.value} className="mb-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <cat.icon className="w-3.5 h-3.5 text-text-muted" />
                                            <span className="text-xs text-text-muted font-medium uppercase tracking-wider">
                                                {cat.label}
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {tags.map(tag => (
                                                <motion.span
                                                    key={tag.id}
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium border ${categoryColors[tag.category]}`}
                                                >
                                                    {tag.name}
                                                    <button
                                                        onClick={() =>
                                                            dispatch({
                                                                type: 'DELETE_TAG',
                                                                payload: { gameId: selectedGame.id, tagId: tag.id },
                                                            })
                                                        }
                                                        className="ml-1 hover:text-danger transition-colors"
                                                    >
                                                        ×
                                                    </button>
                                                </motion.span>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
