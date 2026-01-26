const Placeholder = ({ title, icon }) => {
    return (
        <>
            <div className="modern-page-header bg-gradient-to-r from-gray-700 to-gray-900 text-white p-8 rounded-xl shadow-lg mb-8 relative overflow-hidden">
                <div className="header-content relative z-10">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-lg flex items-center justify-center text-3xl border border-white/10">
                            <i className={icon}></i>
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold mb-1">{title}</h1>
                            <p className="text-lg opacity-90">Module is currently under development</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card">
                <div className="card-body text-center py-20">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-5xl text-gray-400">
                        <i className={icon}></i>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">{title} Module</h3>
                    <p className="text-gray-500 max-w-md mx-auto">
                        This feature is part of the full CCPL ERP suite. It will be implemented in the next phase of development with full React functionality.
                    </p>
                    <button className="btn btn-primary mt-8">
                        <i className="fas fa-bell"></i> Notify when ready
                    </button>
                </div>
            </div>
        </>
    );
};

export default Placeholder;
