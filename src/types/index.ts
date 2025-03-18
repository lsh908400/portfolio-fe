// src/types/index.ts
export interface CodeSnippet {
    HTML?: string;
    API?: string;
    JS?: string;
    Front?: any;
    Back?: string;
}

export interface userData {
    name : string,
    birth : string,
    addr : string,
    contacts : string,
    email : string,
    university : string,
}

export interface introduction {
    subtitle? : string,
    motivation? : string,
    growth? : string,
    adventage? : string,
    goals? : string
}

export interface category {
    id? : string,
    icon? : string,
    title : string,
}

export interface board {
    id? : string,
    title? : string,
    categoryId? : string,
    createAt? : string,
    modifyAt? : string
}

export interface BlockData {
    id: string;
    type: 'paragraph' | 'img' | 'title' | "code";
    index: number;
    data: {
        text?: string;
        level?: number;
        items?: string[];
        url?: string;
        caption?: string;
        style?: 'underline' | 'bold' | 'crooked' | 'cancelline' | 'link' | 'basic'
        color?: string; 
        imageWidth? : number;
        imageHeight? : number;
        language?: string;
        showLineNumbers?: boolean;
    };
}

type ItemState = 'start' | 'middle' | 'end';

export interface TreeItemProps {
    depth: number;
    state: ItemState;
    text: string;
}

export interface tree {
    id: number;
    depth: number;
    state: ItemState;
    text: string;
    type: string;
}

export interface purpose {
    id: number;
    text: string;
    type: string;
}

export interface project {
    id: number;
    name: string;
    desc: string;
    img: string;
}

export interface TimelineEvent {
    id: string;
    title: string;
    date: string;
    desc: string;
    category: string;
    color?: string;
}

export interface Snippet {
    id: string;
    title: string;
    code: string;
    language: string;
    desc: string;
    tags: string[];
    createdAt: string;
}