import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  FaDollarSign,
  FaCalendarAlt,
  FaRedo,
  FaDownload,
} from "react-icons/fa";
import { IoFunnelOutline, IoShareOutline } from "react-icons/io5";
import config from "../../../config";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { userPaymentTranslations } from "./translation/userPaymentTranslations";

pdfMake.vfs = pdfFonts.vfs;

// --- Helper Classes ---
const getStatusClasses = (status) => {
  switch (status) {
    case "paid":
      return "text-green-700 bg-green-100";
    case "Refunded":
      return "text-red-700 bg-red-100";
    default:
      return "text-gray-700 bg-gray-100";
  }
};

const getAmountClasses = (amount) => {
  return amount < 0
    ? "text-red-500 font-semibold"
    : "text-green-600 font-semibold";
};

// --- Main Component ---
const UserPayment = () => {
  const [transactions, setTransactions] = useState([]);
  const [t, setT] = useState(() => {
    const lang = localStorage.getItem("lang") || "fr";
    return userPaymentTranslations[lang] || userPaymentTranslations.fr;
  });

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    const fetchTransactions = async () => {
      try {
        const res = await axios.get(
          `${config.baseUrl}/transaction/user/${userId}`
        );
        setTransactions(
          res.data.data.map((t) => ({
            id: t._id || t.id,
            date: new Date(t.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            }),
            name: t.trailerName || "N/A",
            amount: t.amount,
            status: t.status,
            transactor: "User",
            fee: t.fee || 0,
            feeSource: t.feeSource || "Stripe",
            receipt: t.status.toLowerCase() === "paid",
          }))
        );
      } catch (err) {
        console.error("Error fetching transactions:", err);
      }
    };
    fetchTransactions();

    // Handle language change dynamically
    const handleLangChange = () => {
      const lang = localStorage.getItem("lang") || "fr";
      setT(userPaymentTranslations[lang] || userPaymentTranslations.fr);
    };

    window.addEventListener("storage", handleLangChange);
    handleLangChange();

    return () => window.removeEventListener("storage", handleLangChange);
  }, []);

  const generatePDF = (singleTransaction = null) => {
    const tableBody = [
      [t.date, t.transactor, t.amount, "Fee", t.status], // translated table headers
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
      transactions.forEach((tn) => {
        tableBody.push([
          tn.date,
          tn.transactor,
          `$${tn.amount.toFixed(2)}`,
          `$${tn.fee.toFixed(2)}`,
          tn.status,
        ]);
      });
    }

    const docDefinition = {
      content: [
        {
          text: "LOREPA - Transaction Report",
          fontSize: 18,
          margin: [0, 0, 0, 10],
        },
        {
          text: `Generated on: ${new Date().toLocaleString()}`,
          fontSize: 12,
          margin: [0, 0, 0, 20],
        },
        {
          table: {
            headerRows: 1,
            widths: ["*", "*", "*", "*", "*"],
            body: tableBody,
          },
          layout: "lightHorizontalLines",
        },
      ],
      defaultStyle: { fontSize: 10 },
    };

    pdfMake
      .createPdf(docDefinition)
      .download(
        singleTransaction
          ? `transaction_${singleTransaction.date}.pdf`
          : "transaction_report.pdf"
      );
  };

  return (
    <div className="">
      {/* Header and Actions */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          {t.paymentsReceipts}
        </h1>
        <div className="flex items-center gap-2">
          <button className="flex-1 sm:flex-none flex items-center justify-center space-x-2 bg-white border border-gray-300 text-gray-700 text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-gray-50 transition duration-150 shadow-sm">
            <IoFunnelOutline className="w-4 h-4" />
            <span>{t.filterByDate}</span>
          </button>
          <button
            onClick={() => generatePDF()}
            className="flex-1 sm:flex-none flex items-center justify-center space-x-2 bg-blue-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-blue-700 transition duration-150 shadow-md"
          >
            <IoShareOutline className="w-4 h-4" />
            <span>{t.exportAll}</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2.5 bg-blue-50 rounded-xl">
              <FaDollarSign className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-xs font-bold text-gray-400">
              +5.2% MoM
            </span>
          </div>
          <span className="text-sm font-bold text-gray-500 mb-2 uppercase tracking-wider">
            {t.totalSpent}
          </span>
          <p className="text-3xl sm:text-4xl font-black text-gray-900 leading-tight">
            $
            {transactions
              .reduce((sum, t) => sum + (t.amount < 0 ? 0 : t.amount), 0)
              .toFixed(2)}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2.5 bg-green-50 rounded-xl">
              <FaCalendarAlt className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-xs font-bold text-green-600">
              +5.2% MoM
            </span>
          </div>
          <span className="text-sm font-bold text-gray-500 mb-2 uppercase tracking-wider">
            {t.thisMonth}
          </span>
          <p className="text-3xl sm:text-4xl font-black text-gray-900 leading-tight">
            $
            {transactions
              .filter(
                (tr) => new Date(tr.date).getMonth() === new Date().getMonth()
              )
              .reduce((sum, t) => sum + t.amount, 0)
              .toFixed(2)}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2.5 bg-red-50 rounded-xl">
              <FaRedo className="w-5 h-5 text-red-600" />
            </div>
            <span className="text-xs font-bold text-gray-400">
              +5.2% MoM
            </span>
          </div>
          <span className="text-sm font-bold text-red-500 mb-2 uppercase tracking-wider">
            {t.refunds}
          </span>
          <p className="text-3xl sm:text-4xl font-black text-red-500 leading-tight">
            $
            {transactions
              .filter((t) => t.status.toLowerCase() === "refunded")
              .reduce((sum, t) => sum + Math.abs(t.amount), 0)
              .toFixed(2)}
          </p>
        </div>
      </div>

      {/* Transaction History Section */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50">
          <h2 className="text-xl font-bold text-gray-900">
            {t.transactionHistory}
          </h2>
          <p className="text-sm text-gray-500 mt-1">{t.transactionDesc}</p>
        </div>

        {/* Table for Desktop */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">
                <th className="px-6 py-4">{t.date}</th>
                <th className="px-6 py-4">{t.trailerName}</th>
                <th className="px-6 py-4">{t.amount}</th>
                <th className="px-6 py-4">{t.status}</th>
                <th className="px-6 py-4 text-center">{t.receipt}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50/50 transition duration-150">
                  <td className="px-6 py-4 text-sm font-bold text-gray-900">{transaction.date}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{transaction.name}</td>
                  <td className={`px-6 py-4 text-sm ${getAmountClasses(transaction.amount)}`}>
                    {transaction.amount < 0
                      ? `-$${Math.abs(transaction.amount).toFixed(2)}`
                      : `$${transaction.amount.toFixed(2)}`}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${getStatusClasses(transaction.status)}`}>
                      {transaction.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {transaction.receipt && (
                      <button
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        onClick={() => generatePDF(transaction)}
                      >
                        <FaDownload className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Card List for Mobile */}
        <div className="md:hidden divide-y divide-gray-50">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="p-4 flex flex-col gap-3">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{transaction.date}</p>
                  <p className="text-sm font-bold text-gray-900 line-clamp-1">{transaction.name}</p>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${getStatusClasses(transaction.status)}`}>
                  {transaction.status}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <p className={`text-lg ${getAmountClasses(transaction.amount)}`}>
                  {transaction.amount < 0
                    ? `-$${Math.abs(transaction.amount).toFixed(2)}`
                    : `$${transaction.amount.toFixed(2)}`}
                </p>
                {transaction.receipt && (
                  <button
                    className="flex items-center space-x-2 text-blue-600 text-xs font-bold bg-blue-50 px-3 py-2 rounded-lg"
                    onClick={() => generatePDF(transaction)}
                  >
                    <FaDownload className="w-3 h-3" />
                    <span>PDF</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserPayment;
