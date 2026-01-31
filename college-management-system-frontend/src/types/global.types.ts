export interface IResponse {
    _id: string;
    createdAt: string;
    updatedAt: string;
    isActive?: boolean;
}

export interface IImage {
    path: string;
    public_id: string;
}
