import React, { useState, useEffect } from 'react'
import { FaDollarSign, FaCalendarAlt, FaDownload } from 'react-icons/fa'
import { IoFunnelOutline } from 'react-icons/io5'
import axios from 'axios'
import config from '../../../config'
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { earningsTranslations } from './translation/earningsTranslations'

pdfMake.vfs = pdfFonts.vfs;
const MetricCard = ({ icon: Icon, title, value, subtext, iconBgColor, valueColor }) => (
    <div className="flex flex-col p-6 sm:p-8 bg-white rounded-2xl shadow-sm border border-gray-100 transition duration-300 hover:shadow-md">
        <div className={`p-3 w-fit rounded-xl ${iconBgColor}`}>
            <Icon className={`w-6 h-6 ${valueColor}`} />
        </div>
        <p className="mt-6 text-xs text-gray-400 font-bold uppercase tracking-widest leading-none">{title}</p>
        <div className="flex items-baseline mt-3">
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900">{value}</h2>
            {subtext && <p className="ml-2 text-xs text-green-600 font-black">{subtext}</p>}
        </div>
    </div>
)

const EarningsDashboard = () => {
    const [transactions, setTransactions] = useState([])
    const [loading, setLoading] = useState(true)

    // Get translations from localStorage
    const [translations, setTranslations] = useState(() => {
        const lang = localStorage.getItem("lang")
        return earningsTranslations[lang] || earningsTranslations.fr
    })

    useEffect(() => {
        const handleStorageChange = () => {
            const lang = localStorage.getItem("lang")
            setTranslations(earningsTranslations[lang] || earningsTranslations.fr)
        }
        window.addEventListener('storage', handleStorageChange)
        handleStorageChange()
        return () => window.removeEventListener('storage', handleStorageChange)
    }, [])

    useEffect(() => {
        const userId = localStorage.getItem("userId")
        if (!userId) return
        const fetchTransactions = async () => {
            try {
                setLoading(true)
                const res = await axios.get(`${config.baseUrl}/transaction/user/${userId}`)
                setTransactions(
                    res.data.data.map((t) => ({
                        ...t,
                        date: new Date(t.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                        transactor: 'User',
                        fee: 0,
                        feeSource: 'Stripe',
                        receipt: t.status.toLowerCase() === 'paid',
                    }))
                )
            } catch (err) {
                console.error('Error fetching transactions:', err)
            } finally {
                setLoading(false)
            }
        }
        fetchTransactions()
    }, [])

    const generatePDF = (singleTransaction = null) => {
        const tableBody = [
            translations.tableHeaders
        ];

        if (singleTransaction) {
            tableBody.push([
                singleTransaction.date,
                singleTransaction.transactor,
                `$${singleTransaction.amount.toFixed(2)}`,
                `$${singleTransaction.fee.toFixed(2)}`,
                singleTransaction.status,
            ]);
        } else {
            transactions.forEach(t => {
                tableBody.push([
                    t.date,
                    t.transactor,
                    `$${t.amount.toFixed(2)}`,
                    `$${t.fee.toFixed(2)}`,
                    t.status,
                ]);
            });
        }

        const docDefinition = {
            content: [
                { text: 'LOREPA - Transaction Report', fontSize: 18, margin: [0, 0, 0, 10] },
                { text: `Generated on: ${new Date().toLocaleString()}`, fontSize: 12, margin: [0, 0, 0, 20] },
                {
                    table: {
                        headerRows: 1,
                        widths: ['*', '*', '*', '*', '*'],
                        body: tableBody,
                    },
                    layout: 'lightHorizontalLines'
                }
            ],
            defaultStyle: {
                fontSize: 10
            }
        };

        pdfMake.createPdf(docDefinition).download(
            singleTransaction ? `transaction_${singleTransaction.date}.pdf` : "transaction_report.pdf"
        );
    };

    const getStatusClasses = (status) => {
        switch (status) {
            case 'paid':
                return 'text-green-700 bg-green-100';
            case 'refunded':
                return 'text-red-700 bg-red-100';
            default:
                return 'text-gray-700 bg-gray-100';
        }
    };

    return (
        <div className="max-w-7xl mx-auto">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10">
                <div>
                    <h1 className="text-3xl sm:text-4xl font-black text-gray-900 leading-tight">{translations.pageTitle}</h1>
                    <p className="text-gray-500 mt-2 font-medium">Suivez et gérez l'historique de vos revenus</p>
                </div>
                <button
                    onClick={() => generatePDF()}
                    className="w-full sm:w-auto flex items-center justify-center px-6 py-3.5 bg-indigo-600 text-white text-sm font-black rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition active:scale-[0.98]"
                >
                    <FaDownload className="w-4 h-4 mr-2" />
                    {translations.downloadPDF}
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <MetricCard
                    icon={FaDollarSign}
                    title={translations.thisMonthRevenue}
                    value={`$${transactions.filter(t => t.status === 'paid').reduce((sum, t) => sum + t.amount, 0).toFixed(2)}`}
                    subtext={translations.subtextRevenue}
                    iconBgColor="bg-green-100"
                    valueColor="text-green-600"
                />
                <MetricCard
                    icon={FaCalendarAlt}
                    title={translations.pendingPayouts}
                    value={`$${transactions.filter(t => t.status === 'pending').reduce((sum, t) => sum + t.amount, 0).toFixed(2)}`}
                    subtext={translations.subtextPending}
                    iconBgColor="bg-yellow-100"
                    valueColor="text-yellow-600"
                />
                <MetricCard
                    icon={IoFunnelOutline}
                    title={translations.feesAndCharges}
                    value="$0"
                    subtext={translations.subtextFees}
                    iconBgColor="bg-blue-100"
                    valueColor="text-blue-600"
                />
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 sm:p-8 border-b border-gray-50 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-900">{translations.tableTitle}</h2>
                </div>

                {loading ? (
                    <div className="py-20 flex flex-col items-center justify-center">
                        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">{translations.loading}</p>
                    </div>
                ) : (
                    <>
                        {/* Desktop View */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                        <th className="px-8 py-4">{translations.tableHeaders[0]}</th>
                                        <th className="px-8 py-4">{translations.tableHeaders[1]}</th>
                                        <th className="px-8 py-4">{translations.tableHeaders[2]}</th>
                                        <th className="px-8 py-4">{translations.tableHeaders[4]}</th>
                                        <th className="px-8 py-4 text-center">{translations.tableHeaders[3]}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {transactions.map((t, i) => (
                                        <tr key={i} className="hover:bg-gray-50/50 transition">
                                            <td className="px-8 py-6 text-sm text-gray-600 font-medium">{t.date}</td>
                                            <td className="px-8 py-6 text-sm text-gray-900 font-bold">{t.transactor}</td>
                                            <td className="px-8 py-6 text-gray-900 font-black">${t.amount.toFixed(2)}</td>
                                            <td className="px-8 py-6">
                                                <span className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full ${getStatusClasses(t.status)}`}>
                                                    {t.status}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex justify-center">
                                                    {t.receipt ? (
                                                        <button
                                                            onClick={() => generatePDF(t)}
                                                            className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-600 hover:text-white transition"
                                                        >
                                                            <FaDownload className="w-4 h-4" />
                                                        </button>
                                                    ) : (
                                                        <span className="text-[10px] text-gray-300 font-bold uppercase">{translations.receiptNA}</span>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile View */}
                        <div className="md:hidden divide-y divide-gray-50">
                            {transactions.map((t, i) => (
                                <div key={i} className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{t.date}</p>
                                            <h3 className="text-base font-bold text-gray-900">{t.transactor}</h3>
                                        </div>
                                        <span className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full ${getStatusClasses(t.status)}`}>
                                            {t.status}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <p className="text-xl font-black text-gray-900">${t.amount.toFixed(2)}</p>
                                        {t.receipt ? (
                                            <button
                                                onClick={() => generatePDF(t)}
                                                className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-indigo-600 rounded-xl text-xs font-bold hover:bg-indigo-50 transition"
                                            >
                                                <FaDownload className="w-3.5 h-3.5" />
                                                Receipt
                                            </button>
                                        ) : (
                                            <span className="text-[10px] text-gray-300 font-bold uppercase">{translations.receiptNA}</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default EarningsDashboard
