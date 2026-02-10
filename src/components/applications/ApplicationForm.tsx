import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
  import { useState } from 'react';
import { createApplicationSchema } from '../../lib/validations';
import { APPLICATION_STATUSES, STATUS_LABELS } from '../../lib/constants';
import { PREDEFINED_TAGS, parseTags } from '../../lib/tag-utils';
import type { Application } from '../../db/schema';

type ApplicationFormData = z.infer<typeof createApplicationSchema>;

interface ApplicationFormProps {
  onSubmit: (data: ApplicationFormData) => void;
  isSubmitting?: boolean;
  initialData?: Application | null;
  mode?: 'create' | 'edit';
}

export function ApplicationForm({ 
  onSubmit, 
  isSubmitting = false,
  initialData = null,
  mode = 'create'
}: ApplicationFormProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>(
    initialData?.tags ? parseTags(initialData.tags) : []
  );
  const [customTag, setCustomTag] = useState('');
  const [rating, setRating] = useState<number>(initialData?.rating || 0);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(createApplicationSchema),
    defaultValues: initialData ? {
      company: initialData.company,
      role: initialData.role,
      status: initialData.status,
      link: initialData.link || undefined,
      salaryMin: initialData.salaryMin || undefined,
      salaryMax: initialData.salaryMax || undefined,
    } : {
      status: APPLICATION_STATUSES.APPLIED,
    },
  });

  const handleFormSubmit = (data: ApplicationFormData) => {
    onSubmit({
      ...data,
      tags: selectedTags.length > 0 ? selectedTags : undefined,
      rating: rating > 0 ? rating : undefined,
    } as any);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const addCustomTag = () => {
    if (customTag.trim() && !selectedTags.includes(customTag.trim())) {
      setSelectedTags(prev => [...prev, customTag.trim()]);
      setCustomTag('');
    }
  };

  const removeTag = (tag: string) => {
    setSelectedTags(prev => prev.filter(t => t !== tag));
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-4">
      <div>
        <label htmlFor="company" className="block mb-2 font-bold">
          Firma *
        </label>
        <input
          id="company"
          {...register('company')}
          className={`w-full px-3 py-2 rounded-md text-base ${
            errors.company ? 'border-2 border-red-500' : 'border border-gray-300'
          }`}
          placeholder="np. Arasaka Corporation"
        />
        {errors.company && (
          <p className="text-red-500 text-sm mt-1">
            {errors.company.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="role" className="block mb-2 font-bold">
          Stanowisko *
        </label>
        <input
          id="role"
          {...register('role')}
          className={`w-full px-3 py-2 rounded-md text-base ${
            errors.role ? 'border-2 border-red-500' : 'border border-gray-300'
          }`}
          placeholder="np. Senior Frontend Developer"
        />
        {errors.role && (
          <p className="text-red-500 text-sm mt-1">
            {errors.role.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="status" className="block mb-2 font-bold">
          Status
        </label>
        <select
          id="status"
          {...register('status')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-base"
        >
          <option value={APPLICATION_STATUSES.APPLIED}>{STATUS_LABELS.applied}</option>
          <option value={APPLICATION_STATUSES.HR_INTERVIEW}>{STATUS_LABELS.hr_interview}</option>
          <option value={APPLICATION_STATUSES.TECH_INTERVIEW}>{STATUS_LABELS.tech_interview}</option>
          <option value={APPLICATION_STATUSES.OFFER}>{STATUS_LABELS.offer}</option>
          <option value={APPLICATION_STATUSES.REJECTED}>{STATUS_LABELS.rejected}</option>
        </select>
      </div>

      <div>
        <label htmlFor="link" className="block mb-2 font-bold">
          Link do ogłoszenia
        </label>
        <input
          id="link"
          {...register('link')}
          type="url"
          className={`w-full px-3 py-2 rounded-md text-base ${
            errors.link ? 'border-2 border-red-500' : 'border border-gray-300'
          }`}
          placeholder="https://..."
        />
        {errors.link && (
          <p className="text-red-500 text-sm mt-1">
            {errors.link.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="salaryMin" className="block mb-2 font-bold">
            Wynagrodzenie min (PLN)
          </label>
          <input
            id="salaryMin"
            {...register('salaryMin', { valueAsNumber: true })}
            type="number"
            className={`w-full px-3 py-2 rounded-md text-base ${
              errors.salaryMin ? 'border-2 border-red-500' : 'border border-gray-300'
            }`}
            placeholder="15000"
          />
          {errors.salaryMin && (
            <p className="text-red-500 text-sm mt-1">
              {errors.salaryMin.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="salaryMax" className="block mb-2 font-bold">
            Wynagrodzenie max (PLN)
          </label>
          <input
            id="salaryMax"
            {...register('salaryMax', { valueAsNumber: true })}
            type="number"
            className={`w-full px-3 py-2 rounded-md text-base ${
              errors.salaryMax ? 'border-2 border-red-500' : 'border border-gray-300'
            }`}
            placeholder="20000"
          />
          {errors.salaryMax && (
            <p className="text-red-500 text-sm mt-1">
              {errors.salaryMax.message}
            </p>
          )}
        </div>
      </div>

      {/* Tagi */}
      <div>
        <label className="block mb-2 font-bold">🏷️ Tagi</label>
        
        {/* Wyświetl wybrane tagi */}
        {selectedTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {selectedTags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-2"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="hover:text-red-600 font-bold"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Predefiniowane tagi */}
        <div className="flex flex-wrap gap-2 mb-3">
          {PREDEFINED_TAGS.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => toggleTag(tag)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                selectedTags.includes(tag)
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Własny tag */}
        <div className="flex gap-2">
          <input
            type="text"
            value={customTag}
            onChange={(e) => setCustomTag(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addCustomTag();
              }
            }}
            placeholder="Dodaj własny tag..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
          />
          <button
            type="button"
            onClick={addCustomTag}
            className="px-4 py-2 bg-gray-500 text-white rounded-md text-sm hover:bg-gray-600"
          >
            + Dodaj
          </button>
        </div>
      </div>

      {/* Rating */}
      <div>
        <label className="block mb-2 font-bold">⭐ Ocena firmy/oferty (1-5)</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(rating === star ? 0 : star)}
              className={`text-3xl transition-all ${
                star <= rating ? 'text-yellow-400' : 'text-gray-300'
              } hover:scale-110`}
            >
              ⭐
            </button>
          ))}
          {rating > 0 && (
            <span className="ml-2 self-center text-gray-600">({rating}/5)</span>
          )}
        </div>
      </div>

      <div className="flex gap-2 justify-end mt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-6 py-3 text-white border-none rounded-md text-base font-bold ${
            isSubmitting 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-500 cursor-pointer hover:bg-blue-600'
          }`}
        >
          {isSubmitting 
            ? (mode === 'edit' ? '⏳ Zapisywanie...' : '⏳ Dodawanie...') 
            : (mode === 'edit' ? '💾 Zapisz zmiany' : '✅ Dodaj aplikację')
          }
        </button>
      </div>
    </form>
  );
}

