import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createApplicationSchema } from '../../lib/validations';
import { APPLICATION_STATUSES, STATUS_LABELS } from '../../lib/constants';

type ApplicationFormData = z.infer<typeof createApplicationSchema>;

interface ApplicationFormProps {
  onSubmit: (data: ApplicationFormData) => void;
  isSubmitting?: boolean;
}

export function ApplicationForm({ onSubmit, isSubmitting = false }: ApplicationFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(createApplicationSchema),
    defaultValues: {
      status: APPLICATION_STATUSES.APPLIED,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div>
        <label htmlFor="company" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
          Firma *
        </label>
        <input
          id="company"
          {...register('company')}
          style={{
            width: '100%',
            padding: '0.5rem',
            border: errors.company ? '2px solid #ef4444' : '1px solid #d1d5db',
            borderRadius: '0.375rem',
            fontSize: '1rem',
          }}
          placeholder="np. Arasaka Corporation"
        />
        {errors.company && (
          <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            {errors.company.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="role" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
          Stanowisko *
        </label>
        <input
          id="role"
          {...register('role')}
          style={{
            width: '100%',
            padding: '0.5rem',
            border: errors.role ? '2px solid #ef4444' : '1px solid #d1d5db',
            borderRadius: '0.375rem',
            fontSize: '1rem',
          }}
          placeholder="np. Senior Frontend Developer"
        />
        {errors.role && (
          <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            {errors.role.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="status" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
          Status
        </label>
        <select
          id="status"
          {...register('status')}
          style={{
            width: '100%',
            padding: '0.5rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.375rem',
            fontSize: '1rem',
          }}
        >
          <option value={APPLICATION_STATUSES.APPLIED}>{STATUS_LABELS.applied}</option>
          <option value={APPLICATION_STATUSES.HR_INTERVIEW}>{STATUS_LABELS.hr_interview}</option>
          <option value={APPLICATION_STATUSES.TECH_INTERVIEW}>{STATUS_LABELS.tech_interview}</option>
          <option value={APPLICATION_STATUSES.OFFER}>{STATUS_LABELS.offer}</option>
          <option value={APPLICATION_STATUSES.REJECTED}>{STATUS_LABELS.rejected}</option>
        </select>
      </div>

      <div>
        <label htmlFor="link" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
          Link do ogłoszenia
        </label>
        <input
          id="link"
          {...register('link')}
          type="url"
          style={{
            width: '100%',
            padding: '0.5rem',
            border: errors.link ? '2px solid #ef4444' : '1px solid #d1d5db',
            borderRadius: '0.375rem',
            fontSize: '1rem',
          }}
          placeholder="https://..."
        />
        {errors.link && (
          <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            {errors.link.message}
          </p>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label htmlFor="salaryMin" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Wynagrodzenie min (PLN)
          </label>
          <input
            id="salaryMin"
            {...register('salaryMin', { valueAsNumber: true })}
            type="number"
            style={{
              width: '100%',
              padding: '0.5rem',
              border: errors.salaryMin ? '2px solid #ef4444' : '1px solid #d1d5db',
              borderRadius: '0.375rem',
              fontSize: '1rem',
            }}
            placeholder="15000"
          />
          {errors.salaryMin && (
            <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.25rem' }}>
              {errors.salaryMin.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="salaryMax" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Wynagrodzenie max (PLN)
          </label>
          <input
            id="salaryMax"
            {...register('salaryMax', { valueAsNumber: true })}
            type="number"
            style={{
              width: '100%',
              padding: '0.5rem',
              border: errors.salaryMax ? '2px solid #ef4444' : '1px solid #d1d5db',
              borderRadius: '0.375rem',
              fontSize: '1rem',
            }}
            placeholder="20000"
          />
          {errors.salaryMax && (
            <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.25rem' }}>
              {errors.salaryMax.message}
            </p>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: isSubmitting ? '#9ca3af' : '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            fontSize: '1rem',
            fontWeight: 'bold',
          }}
        >
          {isSubmitting ? '⏳ Dodawanie...' : '✅ Dodaj aplikację'}
        </button>
      </div>
    </form>
  );
}

