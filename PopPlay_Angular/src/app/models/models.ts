interface Pagination {
    count: number;
    next: string;
    previous: string;
}

export interface MinigameCreate {
    id?: number;
    name: string;
    cover_url: File;
    theme_id: number;
    type_id: number;
    medias_id: number[];
    quizz_id: Quiz[];
}

export interface Minigame {
    id: number;
    name: string;
    cover_url: string;
    author: Account;
    theme: Theme;
    type: Type;
    medias: Media[];
    quizz: Quiz[];
    dateCreated: Date; // DateTime type in Django (string?)
    dateUpdated?: Date; // Nullable DateTime in Django
    notes: MinigameUserNote[];

}
export interface Question {
    id?: number;
    question: string;
}

export interface Quiz{
    id?: number;
    question: Question;
    answers: Answer[];
}

export interface QuizCreate{
    question_id: number;
    answers_id: number[];
}

export interface Theme {
    id?: number;
    name: string;
    category: ThemeCategory;
}

export interface ThemeCategory {
    id: number;
    name: string;
}

export interface Type {
    id: number;
    name: string;
}

export interface MediaType {
    id: number;
    name: string;
}

export interface MediaCreate {
    name: string;
    url: File; // FileField in Django maps to string for file URL
    type_id: number;
    answers_id: number[];
}

export interface Media {
    id: number;
    name: string;
    url: string; // FileField in Django maps to string for file URL
    type: MediaType;
    answers: Answer[];
}

export interface Media {
    id: number;
    name: string;
    url: string; // FileField in Django maps to string for file URL
    type: MediaType;
    answers: Answer[];
}

export interface Answer {
    id?: number;
    answer: string;
}

export interface MinigameUserNote {
    id: number;
    account: Account;
    minigame: Minigame;
    note: number; // Integer with validation between 0 and 5
}

export interface User {
    id: number;
    username: string;
    email: string;
    date_joined: Date;
    // other fields for User model as needed
}

export interface AccountRegister{
    username: string;
    email: string;
    password: string;
    password2: string;
}

export interface AccountLogin{
    username: string;
    password: string;
}

export interface Account {
    id: number;
    user: User;
    games_liked: Minigame[];
    themes_liked: Theme[];
    games_score: UserMinigameScore[];
    minigamesNotes: MinigameUserNote[];
}

export interface UserMinigameScore {
    id: number;
    account: Account;
    game: Minigame;
    score: number;
    date: Date; // DateTime field
}