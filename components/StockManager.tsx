
import React, { useState, useMemo, useEffect } from 'react';
import type { DataObject } from '../types';
import { useTranslation } from 'react-i18next';

interface StockManagerProps {
  data: DataObject[];
  headers: string[];
  onDataChange: (newData: DataObject[]) => void;
}

const SearchIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
);
const DownloadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
);

const findStockColumn = (headers: string[]): string | null => {
  const stockKeywords = ['stock', 'quantity', 'qty', 'instock', 'inventory', 'count', 'enstock'];
  for (const header of headers) {
    const lowerHeader = header.toLowerCase().replace(/[^a-z0-9]/gi, '');
    if (stockKeywords.some(keyword => lowerHeader.includes(keyword))) {
      return header;
    }
  }
  return null;
};

const StockManager: React.FC<StockManagerProps> = ({ data, headers, onDataChange }) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [editingCell, setEditingCell] = useState<{ rowIndex: number; colKey: string } | null>(null);
  const [editValue, setEditValue] = useState<string | number>('');

  const stockColumn = useMemo(() => findStockColumn(headers), [headers]);

  const filteredAndSortedData = useMemo(() => {
    let filtered = [...data];
    if (searchTerm) {
      filtered = filtered.filter(row =>
        Object.values(row).some(value =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
    if (sortConfig) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return filtered;
  }, [data, searchTerm, sortConfig]);

  const requestSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleEditStart = (rowIndex: number, colKey: string) => {
    if (colKey !== stockColumn) return;
    const originalRowIndex = data.findIndex(row => row === filteredAndSortedData[rowIndex]);
    setEditingCell({ rowIndex: originalRowIndex, colKey });
    setEditValue(data[originalRowIndex][colKey]);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditValue(e.target.value);
  };

  const handleEditSave = () => {
    if (!editingCell) return;
    const newData = [...data];
    const valueToSave = !isNaN(Number(editValue)) ? Number(editValue) : editValue;
    newData[editingCell.rowIndex][editingCell.colKey] = valueToSave;
    onDataChange(newData);
    setEditingCell(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleEditSave();
    if (e.key === 'Escape') setEditingCell(null);
  };

  const exportToCsv = () => {
    const headerRow = headers.join(',');
    const dataRows = data.map(row => 
        headers.map(header => {
            const value = row[header];
            if (typeof value === 'string' && value.includes(',')) {
                return `"${value}"`;
            }
            return value;
        }).join(',')
    );
    const csvContent = "data:text/csv;charset=utf-8," + [headerRow, ...dataRows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "updated_stock.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="p-4 flex gap-4 items-center border-b border-secondary/20">
        <div className="relative flex-grow">
          <SearchIcon className="absolute left-3 rtl:right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-secondary" />
          <input
            type="text"
            placeholder={t('stockManager.searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-background/70 border border-secondary rounded-lg py-2 pl-10 rtl:pr-10 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <button
            onClick={exportToCsv}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-violet-500 transition-colors"
        >
            <DownloadIcon className="h-5 w-5"/>
            {t('stockManager.exportCsv')}
        </button>
      </div>
      <div className="flex-grow overflow-auto">
        <table className="w-full text-sm text-left rtl:text-right text-text-secondary">
          <thead className="text-xs text-text-primary uppercase bg-surface sticky top-0">
            <tr>
              {headers.map(header => (
                <th key={header} scope="col" className="px-6 py-3 cursor-pointer" onClick={() => requestSort(header)}>
                  {header}
                  {sortConfig?.key === header && (sortConfig.direction === 'asc' ? ' ▲' : ' ▼')}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedData.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-b border-secondary/50 hover:bg-background/50">
                {headers.map(colKey => (
                  <td
                    key={colKey}
                    className={`px-6 py-4 text-text-primary ${colKey === stockColumn ? 'bg-primary/10 cursor-pointer hover:bg-primary/20' : ''}`}
                    onClick={() => handleEditStart(rowIndex, colKey)}
                  >
                    {editingCell && editingCell.rowIndex === data.findIndex(r => r === row) && editingCell.colKey === colKey ? (
                        <input
                            type="text"
                            value={editValue}
                            onChange={handleEditChange}
                            onBlur={handleEditSave}
                            onKeyDown={handleKeyDown}
                            autoFocus
                            className="bg-background w-full p-1 rounded border border-primary"
                        />
                    ) : (
                      row[colKey]
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StockManager;