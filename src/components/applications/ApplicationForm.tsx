import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createApplicationSchema } from '../../lib/validations';
import { APPLICATION_STATUSES, STATUS_LABELS } from '../../lib/constants';
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
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

