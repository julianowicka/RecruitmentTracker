import { useState } from 'react';
import type { Application } from '../../api/applications';

interface ExportButtonProps {
  applications: Application[];
}

export function ExportButton({ applications }: ExportButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const exportToCSV = () => {
    if (applications.length === 0) {
      alert('Brak danych do eksportu!');
      return;
    }

    // Przygotuj nagłówki
    const headers = ['ID', 'Firma', 'Stanowisko', 'Status', 'Link', 'Pensja Min', 'Pensja Max', 'Data utworzenia', 'Data aktualizacji'];
    
    // Przygotuj wiersze
    const rows = applications.map(app => [
      app.id,
      app.company,
      app.role,
      app.status,
      app.link || '',
      app.salaryMin || '',
      app.salaryMax || '',
      new Date(app.createdAt).toLocaleDateString('pl-PL'),
      new Date(app.updatedAt).toLocaleDateString('pl-PL'),
    ]);

    // Połącz w CSV
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // Pobierz plik
    downloadFile(csvContent, 'aplikacje.csv', 'text/csv;charset=utf-8;');
    setIsOpen(false);
  };

  const exportToJSON = () => {
    if (applications.length === 0) {
      alert('Brak danych do eksportu!');
      return;
    }

    const jsonContent = JSON.stringify(applications, null, 2);
    downloadFile(jsonContent, 'aplikacje.json', 'application/json;charset=utf-8;');
    setIsOpen(false);
  };

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 bg-purple-500 text-white border-none rounded-lg cursor-pointer text-sm font-bold flex items-center gap-2 hover:bg-purple-600 transition-colors"
      >
        📤 Eksportuj
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu */}
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border-2 border-gray-200 z-20">
            <button
              onClick={exportToCSV}
              className="w-full px-4 py-3 text-left hover:bg-gray-100 transition-colors border-none bg-transparent cursor-pointer flex items-center gap-2 text-gray-700"
            >
              📊 Eksportuj do CSV
            </button>
            <div className="border-t border-gray-200" />
            <button
              onClick={exportToJSON}
              className="w-full px-4 py-3 text-left hover:bg-gray-100 transition-colors border-none bg-transparent cursor-pointer flex items-center gap-2 text-gray-700"
            >
              📦 Eksportuj do JSON
            </button>
          </div>
        </>
      )}
    </div>
  );
}


