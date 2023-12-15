interface selectOption {
    colmun?: string;
    table: string;
    filter?: string;
    distinct?: boolean;
}

interface insertOption {
    table: string;
    colmun?: string[];
    values?: string[];
}

interface updateOption {
    table: string;
    data: object;
    filter?: string;
}

interface deleteOption {
    table: string;
    filter?: string;
}