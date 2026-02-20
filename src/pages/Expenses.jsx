import { useState, useEffect } from 'react';
import { 
    Receipt, Plus, Search, IndianRupee, Calendar, 
    CheckCircle2, Clock, XCircle, Download, Upload, Eye,
    TrendingUp, TrendingDown, PieChart, Briefcase, Car, 
    Utensils, Wrench, Fuel, Package, MoreVertical, Filter
} from 'lucide-react';

const Expenses = () => {
    const [activeTab, setActiveTab] = useState('expenses');
    const [searchQuery, setSearchQuery] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [expenses, setExpenses] = useState([]);
    const [budgets, setBudgets] = useState({});

    useEffect(() => {
        const storedExpenses = localStorage.getItem('erp_expenses');
        const storedBudgets = localStorage.getItem('erp_budgets');
        
        if (storedExpenses) {
            setExpenses(JSON.parse(storedExpenses));
        } else {
            const initialExpenses = [
                { id: 'EXP-001', category: 'Travel', description: 'Site visit to Green Valley project', amount: 2500, date: '2024-02-14', submittedBy: 'Rajesh Kumar', project: 'Green Valley', status: 'Approved', receipt: true },
                { id: 'EXP-002', category: 'Materials', description: 'Emergency construction supplies', amount: 15000, date: '2024-02-13', submittedBy: 'Suresh Singh', project: 'Horizon Tower', status: 'Pending', receipt: true },
                { id: 'EXP-003', category: 'Equipment', description: 'Drill machine rental - 3 days', amount: 4500, date: '2024-02-12', submittedBy: 'Amit Sharma', project: 'Metro Complex', status: 'Approved', receipt: true },
                { id: 'EXP-004', category: 'Food', description: 'Team lunch - project milestone', amount: 3200, date: '2024-02-11', submittedBy: 'Vikram Yadav', project: 'Horizon Tower', status: 'Rejected', receipt: false },
                { id: 'EXP-005', category: 'Fuel', description: 'Generator diesel - weekly', amount: 8500, date: '2024-02-10', submittedBy: 'Deepak Gupta', project: 'Green Valley', status: 'Approved', receipt: true },
                { id: 'EXP-006', category: 'Maintenance', description: 'Crane servicing', amount: 12000, date: '2024-02-09', submittedBy: 'Mohan Verma', project: 'Metro Complex', status: 'Pending', receipt: true },
                { id: 'EXP-007', category: 'Travel', description: 'Client meeting transportation', amount: 1800, date: '2024-02-08', submittedBy: 'Rajesh Kumar', project: 'Horizon Tower', status: 'Approved', receipt: true },
                { id: 'EXP-008', category: 'Materials', description: 'Safety equipment purchase', amount: 25000, date: '2024-02-07', submittedBy: 'Sanjay Patel', project: 'Green Valley', status: 'Approved', receipt: true },
            ];
            setExpenses(initialExpenses);
            localStorage.setItem('erp_expenses', JSON.stringify(initialExpenses));
        }

        if (storedBudgets) {
            setBudgets(JSON.parse(storedBudgets));
        } else {
            const initialBudgets = {
                'Horizon Tower': { allocated: 5000000, spent: 1850000 },
                'Green Valley': { allocated: 3500000, spent: 2100000 },
                'Metro Complex': { allocated: 4200000, spent: 980000 }
            };
            setBudgets(initialBudgets);
            localStorage.setItem('erp_budgets', JSON.stringify(initialBudgets));
        }
    }, []);

    const categories = ['all', 'Travel', 'Materials', 'Equipment', 'Food', 'Fuel', 'Maintenance', 'Office', 'Miscellaneous'];

    const categoryIcons = {
        'Travel': Car,
        'Materials': Package,
        'Equipment': Wrench,
        'Food': Utensils,
        'Fuel': Fuel,
        'Maintenance': Wrench,
        'Office': Briefcase,
        'Miscellaneous': Receipt
    };

    const categoryColors = {
        'Travel': 'bg-blue-100 text-blue-700',
        'Materials': 'bg-purple-100 text-purple-700',
        'Equipment': 'bg-orange-100 text-orange-700',
        'Food': 'bg-green-100 text-green-700',
        'Fuel': 'bg-amber-100 text-amber-700',
        'Maintenance': 'bg-red-100 text-red-700',
        'Office': 'bg-slate-100 text-slate-700',
        'Miscellaneous': 'bg-gray-100 text-gray-700'
    };

    const statusColors = {
        'Pending': 'bg-amber-100 text-amber-700',
        'Approved': 'bg-green-100 text-green-700',
        'Rejected': 'bg-red-100 text-red-700'
    };

    const stats = {
        totalExpenses: expenses.reduce((sum, e) => sum + e.amount, 0),
        approvedExpenses: expenses.filter(e => e.status === 'Approved').reduce((sum, e) => sum + e.amount, 0),
        pendingExpenses: expenses.filter(e => e.status === 'Pending').reduce((sum, e) => sum + e.amount, 0),
        pendingCount: expenses.filter(e => e.status === 'Pending').length,
        thisMonth: expenses.filter(e => e.date.startsWith('2024-02')).reduce((sum, e) => sum + e.amount, 0)
    };

    const filteredExpenses = expenses.filter(exp => {
        const matchesSearch = exp.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              exp.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              exp.submittedBy.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || exp.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const expensesByCategory = categories.filter(c => c !== 'all').map(cat => ({
        category: cat,
        amount: expenses.filter(e => e.category === cat && e.status === 'Approved').reduce((sum, e) => sum + e.amount, 0)
    })).filter(c => c.amount > 0);

    const handleAddExpense = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        
        const newExpense = {
            id: `EXP-${String(expenses.length + 1).padStart(3, '0')}`,
            category: data.category,
            description: data.description,
            amount: parseInt(data.amount),
            date: data.date,
            submittedBy: data.submittedBy,
            project: data.project,
            status: 'Pending',
            receipt: data.receipt === 'yes'
        };

        const updated = [newExpense, ...expenses];
        setExpenses(updated);
        localStorage.setItem('erp_expenses', JSON.stringify(updated));
        setShowAddModal(false);
        e.target.reset();
    };

    const updateExpenseStatus = (id, newStatus) => {
        const updated = expenses.map(exp => 
            exp.id === id ? { ...exp, status: newStatus } : exp
        );
        setExpenses(updated);
        localStorage.setItem('erp_expenses', JSON.stringify(updated));
    };

    const formatCurrency = (amount) => {
        if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
        if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
        return `₹${amount.toLocaleString()}`;
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">Expenses</h1>
                    <p className="text-gray-500 font-medium text-sm sm:text-base">Track expenses, reimbursements, and project budgets</p>
                </div>
                <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
                    <button className="flex-1 sm:flex-none bg-white border border-gray-200 text-gray-700 px-3 sm:px-4 py-2 rounded-xl font-semibold hover:bg-gray-50 transition-all flex items-center justify-center gap-2 text-sm">
                        <Download size={16} /> Export
                    </button>
                    <button 
                        onClick={() => setShowAddModal(true)}
                        className="flex-1 sm:flex-none bg-slate-800 text-white px-4 py-2 rounded-xl font-semibold hover:bg-slate-700 transition-all flex items-center justify-center gap-2 text-sm shadow-lg"
                    >
                        <Plus size={16} /> Add Expense
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 mb-6">
                <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-500 text-xs sm:text-sm font-medium">Total Expenses</span>
                        <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                            <Receipt size={16} className="text-slate-600" />
                        </div>
                    </div>
                    <p className="text-lg sm:text-2xl font-bold text-slate-900">{formatCurrency(stats.totalExpenses)}</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-500 text-xs sm:text-sm font-medium">Approved</span>
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                            <CheckCircle2 size={16} className="text-green-600" />
                        </div>
                    </div>
                    <p className="text-lg sm:text-2xl font-bold text-green-600">{formatCurrency(stats.approvedExpenses)}</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-500 text-xs sm:text-sm font-medium">Pending</span>
                        <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                            <Clock size={16} className="text-amber-600" />
                        </div>
                    </div>
                    <p className="text-lg sm:text-2xl font-bold text-amber-600">{formatCurrency(stats.pendingExpenses)}</p>
                    <p className="text-xs text-gray-400 mt-1">{stats.pendingCount} requests</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-500 text-xs sm:text-sm font-medium">This Month</span>
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Calendar size={16} className="text-blue-600" />
                        </div>
                    </div>
                    <p className="text-lg sm:text-2xl font-bold text-slate-900">{formatCurrency(stats.thisMonth)}</p>
                </div>
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-4 shadow-lg col-span-2 lg:col-span-1">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-300 text-xs sm:text-sm font-medium">Budget Used</span>
                        <PieChart size={16} className="text-white" />
                    </div>
                    <p className="text-lg sm:text-2xl font-bold text-white">42%</p>
                    <p className="text-xs text-slate-400 mt-1">Across all projects</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-4 border-b border-gray-200 pb-4 overflow-x-auto">
                {['expenses', 'budgets', 'analytics'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 rounded-lg font-semibold text-sm capitalize whitespace-nowrap transition-all ${
                            activeTab === tab 
                                ? 'bg-slate-800 text-white shadow-md' 
                                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Search and Filter */}
            {activeTab === 'expenses' && (
                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search expenses..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                        />
                    </div>
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm font-medium text-gray-700 bg-white"
                    >
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat}</option>
                        ))}
                    </select>
                </div>
            )}

            {/* Expenses Tab */}
            {activeTab === 'expenses' && (
                <div className="space-y-3">
                    {filteredExpenses.map(exp => {
                        const IconComponent = categoryIcons[exp.category] || Receipt;
                        return (
                            <div key={exp.id} className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-4">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${categoryColors[exp.category]?.split(' ')[0] || 'bg-gray-100'}`}>
                                            <IconComponent size={18} className={categoryColors[exp.category]?.split(' ')[1] || 'text-gray-600'} />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-slate-900 text-sm">{exp.description}</h4>
                                            <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                                                <span>{exp.id}</span>
                                                <span>•</span>
                                                <span>{exp.submittedBy}</span>
                                                <span>•</span>
                                                <span>{exp.date}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="text-right">
                                            <p className="font-bold text-slate-900">₹{exp.amount.toLocaleString()}</p>
                                            <p className="text-xs text-gray-500">{exp.project}</p>
                                        </div>
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[exp.status]}`}>
                                            {exp.status}
                                        </span>
                                    </div>
                                </div>
                                
                                {exp.status === 'Pending' && (
                                    <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                                        <button 
                                            onClick={() => updateExpenseStatus(exp.id, 'Approved')}
                                            className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-xs font-semibold hover:bg-green-200 transition-all flex items-center gap-1"
                                        >
                                            <CheckCircle2 size={12} /> Approve
                                        </button>
                                        <button 
                                            onClick={() => updateExpenseStatus(exp.id, 'Rejected')}
                                            className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-xs font-semibold hover:bg-red-200 transition-all flex items-center gap-1"
                                        >
                                            <XCircle size={12} /> Reject
                                        </button>
                                        {exp.receipt && (
                                            <button className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs font-semibold hover:bg-gray-200 transition-all flex items-center gap-1">
                                                <Eye size={12} /> View Receipt
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Budgets Tab */}
            {activeTab === 'budgets' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(budgets).map(([project, budget]) => {
                        const percentage = Math.round((budget.spent / budget.allocated) * 100);
                        const remaining = budget.allocated - budget.spent;
                        const isOverBudget = percentage > 100;
                        const isWarning = percentage > 80;
                        
                        return (
                            <div key={project} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-bold text-slate-900">{project}</h3>
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                        isOverBudget ? 'bg-red-100 text-red-700' : 
                                        isWarning ? 'bg-amber-100 text-amber-700' : 
                                        'bg-green-100 text-green-700'
                                    }`}>
                                        {percentage}% used
                                    </span>
                                </div>
                                
                                <div className="mb-4">
                                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full rounded-full transition-all ${
                                                isOverBudget ? 'bg-red-500' : 
                                                isWarning ? 'bg-amber-500' : 
                                                'bg-green-500'
                                            }`}
                                            style={{ width: `${Math.min(percentage, 100)}%` }}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Allocated</span>
                                        <span className="font-semibold text-slate-900">{formatCurrency(budget.allocated)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Spent</span>
                                        <span className="font-semibold text-slate-900">{formatCurrency(budget.spent)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm pt-2 border-t border-gray-100">
                                        <span className="text-gray-500">Remaining</span>
                                        <span className={`font-bold ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            {formatCurrency(Math.abs(remaining))}
                                            {remaining < 0 && ' over'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Expenses by Category */}
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                        <h3 className="font-bold text-slate-900 mb-4">Expenses by Category</h3>
                        <div className="space-y-3">
                            {expensesByCategory.sort((a, b) => b.amount - a.amount).map(cat => {
                                const IconComponent = categoryIcons[cat.category] || Receipt;
                                const maxAmount = Math.max(...expensesByCategory.map(c => c.amount));
                                const percentage = Math.round((cat.amount / maxAmount) * 100);
                                
                                return (
                                    <div key={cat.category} className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${categoryColors[cat.category]?.split(' ')[0] || 'bg-gray-100'}`}>
                                            <IconComponent size={14} className={categoryColors[cat.category]?.split(' ')[1] || 'text-gray-600'} />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="font-medium text-gray-700">{cat.category}</span>
                                                <span className="font-semibold text-slate-900">₹{cat.amount.toLocaleString()}</span>
                                            </div>
                                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                                <div 
                                                    className={`h-full rounded-full ${categoryColors[cat.category]?.split(' ')[0].replace('100', '500') || 'bg-gray-500'}`}
                                                    style={{ width: `${percentage}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Monthly Trend */}
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                        <h3 className="font-bold text-slate-900 mb-4">Monthly Trend</h3>
                        <div className="space-y-4">
                            {['February', 'January', 'December'].map((month, idx) => {
                                const amounts = [72500, 65000, 58000];
                                const trends = ['+11.5%', '+12.1%', '-5.2%'];
                                const isUp = !trends[idx].startsWith('-');
                                
                                return (
                                    <div key={month} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div>
                                            <p className="font-semibold text-slate-900">{month}</p>
                                            <p className="text-xs text-gray-500">2024</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-slate-900">₹{amounts[idx].toLocaleString()}</p>
                                            <p className={`text-xs flex items-center justify-end gap-1 ${isUp ? 'text-red-600' : 'text-green-600'}`}>
                                                {isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                                                {trends[idx]}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* Add Expense Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-100">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold text-slate-900">Add Expense</h2>
                                <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">
                                    ✕
                                </button>
                            </div>
                        </div>
                        <form onSubmit={handleAddExpense} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Category *</label>
                                    <select
                                        name="category"
                                        required
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                    >
                                        {categories.filter(c => c !== 'all').map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Amount (₹) *</label>
                                    <input
                                        name="amount"
                                        type="number"
                                        required
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                        placeholder="5000"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Description *</label>
                                <textarea
                                    name="description"
                                    required
                                    rows={2}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                                    placeholder="Brief description of the expense"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Date *</label>
                                    <input
                                        name="date"
                                        type="date"
                                        required
                                        defaultValue={new Date().toISOString().split('T')[0]}
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Project *</label>
                                    <select
                                        name="project"
                                        required
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                    >
                                        <option value="">Select project</option>
                                        <option value="Horizon Tower">Horizon Tower</option>
                                        <option value="Green Valley">Green Valley</option>
                                        <option value="Metro Complex">Metro Complex</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Submitted By *</label>
                                <input
                                    name="submittedBy"
                                    type="text"
                                    required
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                    placeholder="Your name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Receipt Attached?</label>
                                <div className="flex gap-4">
                                    <label className="flex items-center gap-2">
                                        <input type="radio" name="receipt" value="yes" defaultChecked className="text-blue-600" />
                                        <span className="text-sm text-gray-700">Yes</span>
                                    </label>
                                    <label className="flex items-center gap-2">
                                        <input type="radio" name="receipt" value="no" className="text-blue-600" />
                                        <span className="text-sm text-gray-700">No</span>
                                    </label>
                                </div>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2.5 bg-slate-800 text-white rounded-xl font-semibold hover:bg-slate-700 transition-all"
                                >
                                    Submit Expense
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Expenses;
