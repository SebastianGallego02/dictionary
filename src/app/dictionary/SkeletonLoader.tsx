const SkeletonLoader = () => {
    return (
        <div className="animate-pulse space-y-4">
            {/* Título */}
            <div className="h-6 bg-gray-300 rounded w-3/4"></div>

            {/* Pronunciación */}
            <div className="h-4 bg-gray-300 rounded w-1/4"></div>

            {/* Definiciones */}
            <div className="space-y-2">
                <div className="h-4 bg-gray-300 rounded w-full"></div>
                <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                <div className="h-4 bg-gray-300 rounded w-2/3"></div>
            </div>

            {/* Sinónimos */}
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
        </div>
    );
};
