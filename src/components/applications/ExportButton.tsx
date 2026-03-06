import { useState } from 'react';
import { Download, FileText, Braces } from 'lucide-react';
import { Button } from '../ui/button';
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

    const headers = ['ID', 'Firma', 'Stanowisko', 'Status', 'Link', 'Pensja Min', 'Pensja Max', 'Data utworzenia', 'Data aktualizacji'];

    const rows = applications.map((app) => [
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

    const csvContent = [headers.join(','), ...rows.map((row) => row.map((cell) => `"${cell}"`).join(','))].join('\n');

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
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="outline"
        className="h-10 border-2 border-slate-300 bg-white px-4 font-semibold text-slate-900 hover:bg-slate-50"
        aria-expanded={isOpen}
      >
        <Download className="h-4 w-4" />
        Eksportuj
      </Button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />

          <div className="absolute right-0 z-20 mt-2 w-52 rounded-xl border border-slate-300 bg-white p-1 shadow-lg">
            <button
              onClick={exportToCSV}
              className="flex w-full items-center gap-2 rounded-lg border border-transparent bg-white px-3 py-2 text-left text-sm font-medium text-slate-900 transition-colors hover:border-slate-300 hover:bg-slate-50"
            >
              <FileText className="h-4 w-4 text-slate-600" />
              Eksportuj do CSV
            </button>
            <button
              onClick={exportToJSON}
              className="flex w-full items-center gap-2 rounded-lg border border-transparent bg-white px-3 py-2 text-left text-sm font-medium text-slate-900 transition-colors hover:border-slate-300 hover:bg-slate-50"
            >
              <Braces className="h-4 w-4 text-slate-600" />
              Eksportuj do JSON
            </button>
          </div>
        </>
      )}
    </div>
  );
}
