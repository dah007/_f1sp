const CardSkeleton = ({ visible = true, className = '' }: { visible?: boolean; className?: string }) => {
    if (!visible) return null;

    return (
        <div className={`animate-pulse ${className}`}>
            <div className="h-4 bg-gray-300 rounded mb-2" />
            <div className="h-4 bg-gray-300 rounded mb-2" />
            <div className="h-4 bg-gray-300 rounded mb-2" />
        </div>
    );
};

export default CardSkeleton;
