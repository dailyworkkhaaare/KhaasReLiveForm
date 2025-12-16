import React, { useEffect, useState } from 'react';
import { Download, Table, X } from 'lucide-react';
import { getRegistrations, downloadCSV } from '../services/storageService';
import { RegistrationData } from '../types';

const AdminSheet: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [data, setData] = useState<RegistrationData[]>([]);

  useEffect(() => {
    setData(getRegistrations());
  }, []);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-scale-in">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="bg-green-600 p-2 rounded-lg text-white">
              <Table className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Registration Sheet</h2>
              <p className="text-xs text-gray-500">Total Entries: {data.length}</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={downloadCSV}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-green-700 transition-colors"
            >
              <Download className="w-4 h-4" /> Export CSV
            </button>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors text-gray-500"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Table Content */}
        <div className="flex-1 overflow-auto p-0">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-100 text-gray-600 sticky top-0 z-10 shadow-sm">
              <tr>
                <th className="p-4 font-semibold whitespace-nowrap">Timestamp</th>
                <th className="p-4 font-semibold">Full Name</th>
                <th className="p-4 font-semibold">Phone</th>
                <th className="p-4 font-semibold text-center">Age</th>
                <th className="p-4 font-semibold text-center">Preference</th>
                <th className="p-4 font-semibold text-center">Tickets</th>
                <th className="p-4 font-semibold text-center">Terms</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-400">
                    No registrations yet.
                  </td>
                </tr>
              ) : (
                data.slice().reverse().map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 text-gray-500 font-mono text-xs whitespace-nowrap">
                      {new Date(row.timestamp).toLocaleString()}
                    </td>
                    <td className="p-4 font-medium text-gray-900 whitespace-nowrap">{row.fullName}</td>
                    <td className="p-4 text-gray-600 font-mono whitespace-nowrap">{row.phoneNumber}</td>
                    <td className="p-4 text-center text-gray-900">{row.age}</td>
                    <td className="p-4 text-center text-gray-900">
                      <span className="px-2 py-1 bg-yellow-50 text-yellow-800 rounded text-xs font-semibold border border-yellow-100">
                        {row.drinkPreference}
                      </span>
                    </td>
                    <td className="p-4 text-center font-bold">{row.ticketCount}</td>
                    <td className="p-4 text-center">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${row.agreedToTerms ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {row.agreedToTerms ? 'Yes' : 'No'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminSheet;