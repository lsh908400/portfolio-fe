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
    type: 'paragraph' | 'header' | 'list' | 'image' | 'title';
    index: number;
    data: {
        text?: string;
        level?: number;
        items?: string[];
        url?: string;
        caption?: string;
        style?: 'underline' | 'bold' | 'crooked' | 'cancelline' | 'link' | 'basic'
        color?: string; 
    };
}

export enum IconHoverEnum {
    PLUS,
    BASIC,
    CROOKED,
    UNDERLINE,
    BOLD,
    CANCELLINE,
    LINK,
    COLOR
}