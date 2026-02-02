import { Badge } from '../ui/Badge';
import type { Application } from '../../db/schema';
import type { ApplicationStatus } from '../../lib/constants';

interface ApplicationCardProps {
  application: Application;
  onDelete: (id: number, company: string) => void;
  onEdit: (id: number) => void;
  isDeleting?: boolean;
}

export function ApplicationCard({ application, onDelete, onEdit, isDeleting = false }: ApplicationCardProps) {
  const { id, company, role, status, link, salaryMin, salaryMax, createdAt } = application;

  return (
    <div
      className={`p-6 bg-white rounded-lg shadow-sm border border-gray-200 transition-all duration-200 ${
        isDeleting ? 'opacity-50' : 'opacity-100'
      }`}
    >
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-2">
            <h3 className="m-0 text-xl font-semibold">
              🏢 {company}
            </h3>
            <Badge status={status as ApplicationStatus} />
          </div>

          <p className="my-2 text-gray-700 text-lg">
            <strong>{role}</strong>
          </p>

          {(salaryMin || salaryMax) && (
            <p className="my-2 text-gray-500">
              💰 Widełki: {salaryMin || '?'} - {salaryMax || '?'} PLN
            </p>
          )}

          {link && (
            <p className="my-2">
              🔗{' '}
              <a 
                href={link} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-500 no-underline hover:text-blue-700 transition-colors"
              >
                Link do ogłoszenia
              </a>
            </p>
          )}

          <p className="mt-2 mb-0 text-gray-400 text-sm">
            📅 Dodano: {new Date(createdAt).toLocaleDateString('pl-PL')}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onEdit(id)}
            disabled={isDeleting}
            className={`px-4 py-2 bg-blue-500 text-white border-none rounded-md text-sm transition-all duration-200 ${
              isDeleting 
                ? 'opacity-50 cursor-not-allowed' 
                : 'opacity-100 cursor-pointer hover:bg-blue-600'
            }`}
          >
            ✏️ Edytuj
          </button>
          <button
            onClick={() => onDelete(id, company)}
            disabled={isDeleting}
            className={`px-4 py-2 bg-red-500 text-white border-none rounded-md text-sm transition-opacity duration-200 ${
              isDeleting 
                ? 'opacity-50 cursor-not-allowed' 
                : 'opacity-100 cursor-pointer hover:bg-red-600'
            }`}
          >
            🗑️ Usuń
          </button>
        </div>
      </div>
    </div>
  );
}

