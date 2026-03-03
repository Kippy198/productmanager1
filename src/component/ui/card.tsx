type StatCard = {
    title: string,
    value: number,
}

export default function Card({title, value}: StatCard){
    return (
        <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-gray-100 p-6 sm:p-8 relative overflow-hidden group">
            {/* Background gradient decoration */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            
            {/* Content */}
            <div className="relative z-10">
                <p className="text-gray-500 text-sm font-semibold tracking-widest uppercase mb-3 group-hover:text-gray-700 transition-colors">{title}</p>
                <p className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">{value.toLocaleString && value.toLocaleString() || value}</p>
            </div>
            
            {/* Bottom accent line */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
        </div>
    )
}