interface DistanceCellRendererParams {
    value: number;
}

export const DistanceCellRenderer = (params: DistanceCellRendererParams) => {
    return (
        <div>
            {new Number(new Intl.NumberFormat('us-EN', { localeMatcher: 'lookup' }).format(params.value)).toFixed(2)}
        </div>
    );
};

interface LinkRendererParams {
    gotoCB: (value: string) => void;
    label: string;
    value: string;
}

export const LinkRenderer = ({ gotoCB, label, value }: LinkRendererParams) => {
    return (
        <div role="link" className="text-blue-500 underline cursor-pointer" onClick={() => gotoCB(value)}>
            {label}
        </div>
    );
};
