import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import type { AppState, AppAction } from './types';

// ========================================
// 初期状態
// ========================================
const initialState: AppState = {
    games: [],
    battleRecords: [],
    matchupNotes: [],
    profile: {
        displayName: 'Player',
        currentLP: 1000,
        plan: 'starter',
    },
    selectedGameId: null,
};

// ========================================
// ユーティリティ
// ========================================
const generateId = () => crypto.randomUUID();

// ========================================
// Reducer
// ========================================
function appReducer(state: AppState, action: AppAction): AppState {
    switch (action.type) {
        case 'ADD_GAME':
            return {
                ...state,
                games: [...state.games, { ...action.payload, id: generateId(), createdAt: Date.now() }],
            };

        case 'DELETE_GAME':
            return {
                ...state,
                games: state.games.filter(g => g.id !== action.payload),
                battleRecords: state.battleRecords.filter(b => b.gameId !== action.payload),
                matchupNotes: state.matchupNotes.filter(n => n.gameId !== action.payload),
                selectedGameId: state.selectedGameId === action.payload ? null : state.selectedGameId,
            };

        case 'ADD_TAG': {
            return {
                ...state,
                games: state.games.map(g =>
                    g.id === action.payload.gameId
                        ? { ...g, tags: [...g.tags, { ...action.payload.tag, id: generateId() }] }
                        : g
                ),
            };
        }

        case 'DELETE_TAG':
            return {
                ...state,
                games: state.games.map(g =>
                    g.id === action.payload.gameId
                        ? { ...g, tags: g.tags.filter(t => t.id !== action.payload.tagId) }
                        : g
                ),
            };

        case 'ADD_BATTLE': {
            const newRecord = { ...action.payload, id: generateId(), createdAt: Date.now() };
            const newLP = state.profile.currentLP + action.payload.lpChange;
            return {
                ...state,
                battleRecords: [newRecord, ...state.battleRecords],
                profile: { ...state.profile, currentLP: newLP },
            };
        }

        case 'DELETE_BATTLE':
            return {
                ...state,
                battleRecords: state.battleRecords.filter(b => b.id !== action.payload),
            };

        case 'SET_MATCHUP_NOTE': {
            const existing = state.matchupNotes.find(
                n => n.gameId === action.payload.gameId && n.opponentCharacter === action.payload.opponentCharacter
            );
            if (existing) {
                return {
                    ...state,
                    matchupNotes: state.matchupNotes.map(n =>
                        n.id === existing.id
                            ? { ...n, content: action.payload.content, updatedAt: Date.now() }
                            : n
                    ),
                };
            }
            return {
                ...state,
                matchupNotes: [
                    ...state.matchupNotes,
                    { ...action.payload, id: generateId(), updatedAt: Date.now() },
                ],
            };
        }

        case 'SELECT_GAME':
            return { ...state, selectedGameId: action.payload };

        case 'UPDATE_PROFILE':
            return { ...state, profile: { ...state.profile, ...action.payload } };

        case 'LOAD_STATE':
            return action.payload;

        default:
            return state;
    }
}

// ========================================
// Context
// ========================================
const AppContext = createContext<{
    state: AppState;
    dispatch: React.Dispatch<AppAction>;
} | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(appReducer, initialState, () => {
        try {
            const saved = localStorage.getItem('frameone-state');
            if (saved) return JSON.parse(saved) as AppState;
        } catch { /* ignore */ }
        return initialState;
    });

    useEffect(() => {
        localStorage.setItem('frameone-state', JSON.stringify(state));
    }, [state]);

    return (
        <AppContext.Provider value={{ state, dispatch }}>
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    const ctx = useContext(AppContext);
    if (!ctx) throw new Error('useApp must be used within AppProvider');
    return ctx;
}
