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