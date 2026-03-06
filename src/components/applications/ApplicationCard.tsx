import { Badge } from '../ui/Badge';
import type { Application } from '../../api/applications';
import type { ApplicationStatus } from '../../lib/constants';
import { Link } from '@tanstack/react-router';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Button } from '../ui/button';
import { Building2, Briefcase, DollarSign, Calendar, ExternalLink, Eye, Edit, Trash2, Star } from 'lucide-react';
import { parseTags, getTagColor } from '../../lib/tag-utils';

interface ApplicationCardProps {
  application: Application;
  onDelete: (id: number, company: string) => void;
  onEdit: (id: number) => void;
  isDeleting?: boolean;
}

export function ApplicationCard({ application, onDelete, onEdit, isDeleting = false }: ApplicationCardProps) {
  const { id, company, role, status, link, salaryMin, salaryMax, createdAt, tags, rating } = application;
  const parsedTags = parseTags(tags);

  return (
    <Card
      className={`border-slate-300 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
        isDeleting ? 'opacity-50' : 'opacity-100'
      }`}
    >
      <CardHeader className="pb-3">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <Building2 className="h-5 w-5 text-slate-700" />
              <h3 className="m-0 text-2xl font-semibold tracking-tight text-slate-900">{company}</h3>
              <Badge status={status as ApplicationStatus} />
            </div>

            <div className="flex items-center gap-2 text-slate-700">
              <Briefcase className="h-4 w-4" />
              <span className="font-medium text-slate-900">{role}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 lg:flex-nowrap">
            <Button
              asChild
              variant="outline"
              size="sm"
              disabled={isDeleting}
              className="border-2 border-slate-300 bg-white font-semibold text-slate-900 hover:bg-slate-50"
            >
              <Link to="/applications/$id" params={{ id: id.toString() }}>
                <Eye className="h-4 w-4" />
                Szczegóły
              </Link>
            </Button>
            <Button onClick={() => onEdit(id)} disabled={isDeleting} size="sm" className="font-semibold">
              <Edit className="h-4 w-4" />
              Edytuj
            </Button>
            <Button onClick={() => onDelete(id, company)} disabled={isDeleting} variant="destructive" size="sm" className="font-semibold">
              <Trash2 className="h-4 w-4" />
              Usuń
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {(parsedTags.length > 0 || rating) && (
          <div className="mb-3 flex items-center gap-3 border-b border-slate-200 pb-3">
            {parsedTags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {parsedTags.map((tag, index) => (
                  <span key={tag} className={`rounded-full px-2 py-1 text-xs font-medium ${getTagColor(tag, index)}`}>
                    {tag}
                  </span>
                ))}
              </div>
            )}
            {rating && rating > 0 && (
              <div className="ml-auto flex items-center gap-1">
                {Array.from({ length: rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                ))}
                <span className="ml-1 text-xs text-slate-700">({rating}/5)</span>
              </div>
            )}
          </div>
        )}

        <div className="flex flex-wrap gap-4 text-sm">
          {(salaryMin || salaryMax) && (
            <div className="flex items-center gap-2 text-slate-700">
              <DollarSign className="h-4 w-4" />
              <span>
                {salaryMin && salaryMax
                  ? `${salaryMin.toLocaleString()} - ${salaryMax.toLocaleString()} PLN`
                  : salaryMin
                    ? `od ${salaryMin.toLocaleString()} PLN`
                    : `do ${salaryMax?.toLocaleString()} PLN`}
              </span>
            </div>
          )}

          {link && (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 font-medium text-blue-700 hover:text-blue-800 hover:underline"
            >
              <ExternalLink className="h-4 w-4" />
              Link do ogłoszenia
            </a>
          )}

          <div className="ml-auto flex items-center gap-2 text-slate-700">
            <Calendar className="h-4 w-4" />
            <span>{new Date(createdAt).toLocaleDateString('pl-PL')}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
