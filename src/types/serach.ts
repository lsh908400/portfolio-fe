export interface SnipetParams {
    cursor?: string | number | null | undefined;
    limit?: number;
    searchTerm?: string;
    tags?: string | string[];
}

export interface SnipetResponse {
    data: []; // 실제 데이터 타입으로 교체하세요
    nextCursor: string | null;
}