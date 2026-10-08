export interface Employment {
    id?: number | string;
    company: string;
    role: string;
    product: string;
    startDate: Date;
    endDate?: Date | null;
    description: string;
}