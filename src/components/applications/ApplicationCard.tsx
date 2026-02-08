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
    <Card className={`transition-all duration-200 hover:shadow-md ${
      isDeleting ? 'opacity-50' : 'opacity-100'
    }`}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-3 mb-2">
              <Building2 className="w-5 h-5 text-muted-foreground" />
              <h3 className="text-xl font-semibold m-0">
                {company}
              </h3>
              <Badge status={status as ApplicationStatus} />
            </div>

            <div className="flex items-center gap-2 text-muted-foreground">
              <Briefcase className="w-4 h-4" />
              <span className="font-medium">{role}</span>
            </div>
          </div>

          <div className="flex gap-2 flex-shrink-0">
            <Button
              asChild
              variant="outline"
              size="sm"
              disabled={isDeleting}
            >
              <Link
                to="/applications/$id"
                params={{ id: id.toString() }}
              >
                <Eye className="w-4 h-4" />
                Szczegóły
              </Link>
            </Button>
            <Button
              onClick={() => onEdit(id)}
              disabled={isDeleting}
              variant="default"
              size="sm"
            >
              <Edit className="w-4 h-4" />
              Edytuj
            </Button>
            <Button
              onClick={() => onDelete(id, company)}
              disabled={isDeleting}
              variant="destructive"
              size="sm"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Tagi i Rating */}
        {(parsedTags.length > 0 || rating) && (
          <div className="flex items-center gap-3 mb-3 pb-3 border-b border-gray-200">
            {parsedTags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {parsedTags.map((tag, index) => (
                  <span
                    key={tag}
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getTagColor(tag, index)}`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            {rating && rating > 0 && (
              <div className="flex items-center gap-1 ml-auto">
                {Array.from({ length: rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
                <span className="text-xs text-gray-600 ml-1">({rating}/5)</span>
              </div>
            )}
          </div>
        )}

        <div className="flex flex-wrap gap-4 text-sm">
          {(salaryMin || salaryMax) && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <DollarSign className="w-4 h-4" />
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
              className="flex items-center gap-2 text-primary hover:underline"
            >
              <ExternalLink className="w-4 h-4" />
              Link do ogłoszenia
            </a>
          )}

          <div className="flex items-center gap-2 text-muted-foreground ml-auto">
            <Calendar className="w-4 h-4" />
            <span>{new Date(createdAt).toLocaleDateString('pl-PL')}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

