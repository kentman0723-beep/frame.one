// ========================================
// FRAME.ONE - 型定義
// ========================================

export interface Game {
    id: string;
    name: string;
    tags: Tag[];
    createdAt: number;
}

export interface Tag {
    id: string;
    name: string;
    category: 'character' | 'map' | 'weapon' | 'other';
}

export interface BattleRecord {
    id: string;
    gameId: string;
    myCharacter: string;
    opponentCharacter: string;
    result: 'win' | 'lose';
    lpChange: number;
    memo: string;
    createdAt: number;
}

export interface MatchupNote {
    id: string;
    gameId: string;
    opponentCharacter: string;
    content: string;
    updatedAt: number;
}

export interface UserProfile {
    displayName: string;
    currentLP: number;
    plan: 'starter' | 'pro' | 'elite';
}

export interface AppState {
    games: Game[];
    battleRecords: BattleRecord[];
    matchupNotes: MatchupNote[];
    profile: UserProfile;
    selectedGameId: string | null;
}

export type AppAction =
    | { type: 'ADD_GAME'; payload: Omit<Game, 'id' | 'createdAt'> }
    | { type: 'DELETE_GAME'; payload: string }
    | { type: 'ADD_TAG'; payload: { gameId: string; tag: Omit<Tag, 'id'> } }
    | { type: 'DELETE_TAG'; payload: { gameId: string; tagId: string } }
    | { type: 'ADD_BATTLE'; payload: Omit<BattleRecord, 'id' | 'createdAt'> }
    | { type: 'DELETE_BATTLE'; payload: string }
    | { type: 'SET_MATCHUP_NOTE'; payload: Omit<MatchupNote, 'id' | 'updatedAt'> }
    | { type: 'SELECT_GAME'; payload: string | null }
    | { type: 'UPDATE_PROFILE'; payload: Partial<UserProfile> }
    | { type: 'LOAD_STATE'; payload: AppState };
