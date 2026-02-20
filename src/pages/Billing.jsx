import { useState, useEffect } from 'react';
import { 
    FileText, Plus, Search, Filter, IndianRupee, Calendar, 
    CheckCircle2, Clock, AlertCircle, Download, Send, Eye, 
    Printer, MoreVertical, Building2, TrendingUp, CreditCard,
    Receipt, ArrowUpRight, ArrowDownRight
} from 'lucide-react';

const Billing = () => {
    const [activeTab, setActiveTab] = useState('invoices');
    const [searchQuery, setSearchQuery] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [invoices, setInvoices] = useState([]);
    const [payments, setPayments] = useState([]);

    useEffect(() => {
        const storedInvoices = localStorage.getItem('billing_invoices');
        const storedPayments = localStorage.getItem('billing_payments');
        
        if (storedInvoices) {
            setInvoices(JSON.parse(storedInvoices));
        } else {
            const initialInvoices = [
                { id: 'INV-2024-001', client: 'Horizon Developers Pvt Ltd', project: 'Horizon Tower', amount: 4500000, gst: 810000, total: 5310000, status: 'Paid', issueDate: '2024-01-15', dueDate: '2024-02-15', paidDate: '2024-02-10', description: 'Foundation Work - Phase 1' },
                { id: 'INV-2024-002', client: 'Green Valley Constructions', project: 'Green Valley', amount: 3200000, gst: 576000, total: 3776000, status: 'Pending', issueDate: '2024-02-01', dueDate: '2024-03-01', paidDate: '', description: 'Structural Work - Block A' },
                { id: 'INV-2024-003', client: 'Metro Infrastructure Ltd', project: 'Metro Complex', amount: 2800000, gst: 504000, total: 3304000, status: 'Overdue', issueDate: '2024-01-20', dueDate: '2024-02-20', paidDate: '', description: 'Civil Work - Phase 2' },
                { id: 'INV-2024-004', client: 'Horizon Developers Pvt Ltd', project: 'Horizon Tower', amount: 6200000, gst: 1116000, total: 7316000, status: 'Partial', issueDate: '2024-02-05', dueDate: '2024-03-05', paidDate: '', paidAmount: 3000000, description: 'Superstructure Work - Floors 1-5' },
                { id: 'INV-2024-005', client: 'Green Valley Constructions', project: 'Green Valley', amount: 1500000, gst: 270000, total: 1770000, status: 'Draft', issueDate: '2024-02-14', dueDate: '', paidDate: '', description: 'Finishing Work - Common Areas' },
            ];
            setInvoices(initialInvoices);
            localStorage.setItem('billing_invoices', JSON.stringify(initialInvoices));
        }

        if (storedPayments) {
            setPayments(JSON.parse(storedPayments));
        } else {
            const initialPayments = [
                { id: 'PAY-001', invoiceId: 'INV-2024-001', amount: 5310000, method: 'Bank Transfer', date: '2024-02-10', reference: 'NEFT/123456789' },
                { id: 'PAY-002', invoiceId: 'INV-2024-004', amount: 3000000, method: 'Cheque', date: '2024-02-12', reference: 'CHQ-987654' },
            ];
            setPayments(initialPayments);
            localStorage.setItem('billing_payments', JSON.stringify(initialPayments));
        }
    }, []);

    const statusColors = {
        'Draft': 'bg-gray-100 text-gray-700',
        'Pending': 'bg-amber-100 text-amber-700',
        'Partial': 'bg-blue-100 text-blue-700',
        'Paid': 'bg-green-100 text-green-700',
        'Overdue': 'bg-red-100 text-red-700',
        'Cancelled': 'bg-gray-100 text-gray-500'
    };

    const stats = {
        totalInvoiced: invoices.reduce((sum, inv) => sum + inv.total, 0),
        totalPaid: invoices.filter(i => i.status === 'Paid').reduce((sum, inv) => sum + inv.total, 0) + 
                   invoices.filter(i => i.status === 'Partial').reduce((sum, inv) => sum + (inv.paidAmount || 0), 0),
        totalPending: invoices.filter(i => ['Pending', 'Partial'].includes(i.status)).reduce((sum, inv) => sum + inv.total - (inv.paidAmount || 0), 0),
        overdueAmount: invoices.filter(i => i.status === 'Overdue').reduce((sum, inv) => sum + inv.total, 0),
        invoiceCount: invoices.length
    };

    const filteredInvoices = invoices.filter(inv => {
        const matchesSearch = inv.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              inv.client.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = selectedStatus === 'all' || inv.status === selectedStatus;
        return matchesSearch && matchesStatus;
    });

    const handleCreateInvoice = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        
        const amount = parseInt(data.amount);
        const gst = Math.round(amount * 0.18);
        
        const newInvoice = {
            id: `INV-2024-${String(invoices.length + 1).padStart(3, '0')}`,
            client: data.client,
            project: data.project,
            amount: amount,
            gst: gst,
            total: amount + gst,
            status: 'Draft',
            issueDate: new Date().toISOString().split('T')[0],
            dueDate: data.dueDate,
            paidDate: '',
            description: data.description
        };

        const updated = [...invoices, newInvoice];
        setInvoices(updated);
        localStorage.setItem('billing_invoices', JSON.stringify(updated));
        setShowCreateModal(false);
        e.target.reset();
    };

    const updateInvoiceStatus = (id, newStatus) => {
        const updated = invoices.map(inv => 
            inv.id === id ? { ...inv, status: newStatus, paidDate: newStatus === 'Paid' ? new Date().toISOString().split('T')[0] : inv.paidDate } : inv
        );
        setInvoices(updated);
        localStorage.setItem('billing_invoices', JSON.stringify(updated));
    };

    const formatCurrency = (amount) => {
        if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
        if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)} L`;
        return `₹${amount.toLocaleString()}`;
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">Billing & Invoices</h1>
                    <p className="text-gray-500 font-medium text-sm sm:text-base">Generate invoices, track payments, and manage receivables</p>
                </div>
                <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
                    <button className="flex-1 sm:flex-none bg-white border border-gray-200 text-gray-700 px-3 sm:px-4 py-2 rounded-xl font-semibold hover:bg-gray-50 transition-all flex items-center justify-center gap-2 text-sm">
                        <Download size={16} /> Export
                    </button>
                    <button 
                        onClick={() => setShowCreateModal(true)}
                        className="flex-1 sm:flex-none bg-slate-800 text-white px-4 py-2 rounded-xl font-semibold hover:bg-slate-700 transition-all flex items-center justify-center gap-2 text-sm shadow-lg"
                    >
                        <Plus size={16} /> New Invoice
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 mb-6">
                <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-500 text-xs sm:text-sm font-medium">Total Invoiced</span>
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <FileText size={16} className="text-blue-600" />
                        </div>
                    </div>
                    <p className="text-lg sm:text-2xl font-bold text-slate-900">{formatCurrency(stats.totalInvoiced)}</p>
                    <p className="text-xs text-gray-400 mt-1">{stats.invoiceCount} invoices</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-500 text-xs sm:text-sm font-medium">Received</span>
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                            <ArrowDownRight size={16} className="text-green-600" />
                        </div>
                    </div>
                    <p className="text-lg sm:text-2xl font-bold text-green-600">{formatCurrency(stats.totalPaid)}</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-500 text-xs sm:text-sm font-medium">Pending</span>
                        <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                            <Clock size={16} className="text-amber-600" />
                        </div>
                    </div>
                    <p className="text-lg sm:text-2xl font-bold text-amber-600">{formatCurrency(stats.totalPending)}</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-500 text-xs sm:text-sm font-medium">Overdue</span>
                        <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                            <AlertCircle size={16} className="text-red-600" />
                        </div>
                    </div>
                    <p className="text-lg sm:text-2xl font-bold text-red-600">{formatCurrency(stats.overdueAmount)}</p>
                </div>
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-4 shadow-lg col-span-2 lg:col-span-1">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-300 text-xs sm:text-sm font-medium">Collection Rate</span>
                        <TrendingUp size={16} className="text-green-400" />
                    </div>
                    <p className="text-lg sm:text-2xl font-bold text-white">
                        {stats.totalInvoiced > 0 ? Math.round((stats.totalPaid / stats.totalInvoiced) * 100) : 0}%
                    </p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-4 border-b border-gray-200 pb-4 overflow-x-auto">
                {['invoices', 'payments', 'clients'].map(tab => (
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
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by invoice number or client..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                    />
                </div>
                <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm font-medium text-gray-700 bg-white"
                >
                    <option value="all">All Status</option>
                    <option value="Draft">Draft</option>
                    <option value="Pending">Pending</option>
                    <option value="Partial">Partial</option>
                    <option value="Paid">Paid</option>
                    <option value="Overdue">Overdue</option>
                </select>
            </div>

            {/* Invoices Tab */}
            {activeTab === 'invoices' && (
                <div className="space-y-4">
                    {filteredInvoices.map(inv => (
                        <div key={inv.id} className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden">
                            <div className="p-4 sm:p-5">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
                                            <Receipt size={20} className="text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900 text-sm sm:text-base">{inv.id}</h3>
                                            <p className="text-xs sm:text-sm text-gray-500">{inv.client}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${statusColors[inv.status]}`}>
                                            {inv.status}
                                        </span>
                                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-all">
                                            <MoreVertical size={16} className="text-gray-400" />
                                        </button>
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-3 rounded-lg mb-4">
                                    <p className="text-sm text-gray-700">{inv.description}</p>
                                    <p className="text-xs text-gray-500 mt-1">Project: {inv.project}</p>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-4">
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">Amount</p>
                                        <p className="text-sm font-semibold text-slate-900">{formatCurrency(inv.amount)}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">GST (18%)</p>
                                        <p className="text-sm font-medium text-gray-700">{formatCurrency(inv.gst)}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">Total</p>
                                        <p className="text-sm font-bold text-slate-900">{formatCurrency(inv.total)}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">Due Date</p>
                                        <p className="text-sm font-medium text-gray-700">{inv.dueDate || 'Not set'}</p>
                                    </div>
                                </div>

                                {inv.status === 'Partial' && (
                                    <div className="bg-blue-50 p-3 rounded-lg mb-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-blue-700">Paid: {formatCurrency(inv.paidAmount)}</span>
                                            <span className="text-sm font-semibold text-blue-700">Balance: {formatCurrency(inv.total - inv.paidAmount)}</span>
                                        </div>
                                    </div>
                                )}

                                <div className="flex flex-wrap gap-2">
                                    <button className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs font-semibold hover:bg-gray-200 transition-all flex items-center gap-1">
                                        <Eye size={12} /> View
                                    </button>
                                    <button className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs font-semibold hover:bg-gray-200 transition-all flex items-center gap-1">
                                        <Printer size={12} /> Print
                                    </button>
                                    {inv.status === 'Draft' && (
                                        <button 
                                            onClick={() => updateInvoiceStatus(inv.id, 'Pending')}
                                            className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold hover:bg-blue-200 transition-all flex items-center gap-1"
                                        >
                                            <Send size={12} /> Send
                                        </button>
                                    )}
                                    {['Pending', 'Partial', 'Overdue'].includes(inv.status) && (
                                        <button 
                                            onClick={() => updateInvoiceStatus(inv.id, 'Paid')}
                                            className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-xs font-semibold hover:bg-green-200 transition-all flex items-center gap-1"
                                        >
                                            <CheckCircle2 size={12} /> Mark Paid
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Payments Tab */}
            {activeTab === 'payments' && (
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-gray-100">
                        <h3 className="font-bold text-slate-900">Payment History</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Payment ID</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Invoice</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Amount</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Method</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Reference</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {payments.map(pay => (
                                    <tr key={pay.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 text-sm font-semibold text-slate-900">{pay.id}</td>
                                        <td className="px-4 py-3 text-sm text-blue-600 font-medium">{pay.invoiceId}</td>
                                        <td className="px-4 py-3 text-sm font-bold text-green-600">{formatCurrency(pay.amount)}</td>
                                        <td className="px-4 py-3">
                                            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                                                {pay.method}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-600">{pay.date}</td>
                                        <td className="px-4 py-3 text-sm text-gray-500 font-mono">{pay.reference}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Clients Tab */}
            {activeTab === 'clients' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...new Set(invoices.map(i => i.client))].map(client => {
                        const clientInvoices = invoices.filter(i => i.client === client);
                        const totalAmount = clientInvoices.reduce((sum, i) => sum + i.total, 0);
                        const paidAmount = clientInvoices.filter(i => i.status === 'Paid').reduce((sum, i) => sum + i.total, 0);
                        
                        return (
                            <div key={client} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-slate-700 to-slate-900 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                                        {client.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900">{client}</h3>
                                        <p className="text-xs text-gray-500">{clientInvoices.length} invoices</p>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Total Billed</span>
                                        <span className="font-semibold text-slate-900">{formatCurrency(totalAmount)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Received</span>
                                        <span className="font-semibold text-green-600">{formatCurrency(paidAmount)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Outstanding</span>
                                        <span className="font-semibold text-amber-600">{formatCurrency(totalAmount - paidAmount)}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Create Invoice Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-100">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold text-slate-900">Create Invoice</h2>
                                <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600">
                                    ✕
                                </button>
                            </div>
                        </div>
                        <form onSubmit={handleCreateInvoice} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Client Name *</label>
                                <input
                                    name="client"
                                    type="text"
                                    required
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                    placeholder="Client company name"
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
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Description *</label>
                                <textarea
                                    name="description"
                                    required
                                    rows={2}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                                    placeholder="Work description for this invoice"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Amount (₹) *</label>
                                    <input
                                        name="amount"
                                        type="number"
                                        required
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                        placeholder="500000"
                                    />
                                    <p className="text-xs text-gray-400 mt-1">GST 18% will be added</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Due Date *</label>
                                    <input
                                        name="dueDate"
                                        type="date"
                                        required
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateModal(false)}
                                    className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2.5 bg-slate-800 text-white rounded-xl font-semibold hover:bg-slate-700 transition-all"
                                >
                                    Create Invoice
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Billing;
