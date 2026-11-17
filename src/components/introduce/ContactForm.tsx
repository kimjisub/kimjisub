'use client';

import { FormEvent, useCallback, useState } from 'react';

type FormState = 'idle' | 'sending' | 'success' | 'error';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const initialFormData: FormData = {
  name: '',
  email: '',
  subject: '',
  message: '',
};

const statusMessage: Record<Exclude<FormState, 'idle' | 'sending'>, string> = {
  success: '메시지를 보냈습니다. 확인하는 대로 답장드리겠습니다.',
  error: '보내지 못했습니다. 잠시 뒤 다시 시도하거나 이메일로 보내 주세요.',
};

const labelClass = 'block mb-1.5 text-sm text-muted-foreground';

// 글자 크기 16px: iOS Safari 가 입력칸에 포커스할 때 화면을 확대하지 않게 한다
const inputClass =
  'w-full rounded-lg border border-border-strong bg-card px-3.5 py-2.5 text-base text-foreground ' +
  'transition-colors focus:border-ring disabled:opacity-60';

interface FieldProps {
  name: keyof FormData;
  label: string;
  type?: string;
  autoComplete?: string;
  required?: boolean;
  value: string;
  disabled: boolean;
  onChange: (_e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Field = ({ name, label, type = 'text', autoComplete, required, value, disabled, onChange }: FieldProps) => (
  <div>
    <label htmlFor={`contact-${name}`} className={labelClass}>
      {label}
    </label>
    <input
      id={`contact-${name}`}
      type={type}
      name={name}
      autoComplete={autoComplete}
      required={required}
      value={value}
      onChange={onChange}
      className={inputClass}
      disabled={disabled}
    />
  </div>
);

export function ContactForm() {
  const [formState, setFormState] = useState<FormState>('idle');
  const [formData, setFormData] = useState<FormData>(initialFormData);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setFormState('sending');

      try {
        const res = await fetch('/api/contacts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        if (res.ok) {
          setFormData(initialFormData);
          setFormState('success');
        } else {
          setFormState('error');
        }
      } catch {
        setFormState('error');
      }
    },
    [formData],
  );

  const isSending = formState === 'sending';

  return (
    <form onSubmit={handleSubmit} className="max-w-[40rem] space-y-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field name="name" label="이름" autoComplete="name" required value={formData.name} disabled={isSending} onChange={handleChange} />
        <Field name="email" label="이메일" type="email" autoComplete="email" required value={formData.email} disabled={isSending} onChange={handleChange} />
      </div>

      <Field name="subject" label="제목 (선택)" value={formData.subject} disabled={isSending} onChange={handleChange} />

      <div>
        <label htmlFor="contact-message" className={labelClass}>
          메시지
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={5}
          value={formData.message}
          onChange={handleChange}
          className={`${inputClass} resize-y`}
          disabled={isSending}
        />
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <button
          type="submit"
          disabled={isSending}
          className="rounded-lg bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-[scale,opacity] duration-150 ease-out enabled:active:scale-[0.96] disabled:opacity-60"
        >
          {isSending ? '보내는 중…' : '보내기'}
        </button>

        {/* 빈 상태로 먼저 렌더해 두어야 화면 낭독기가 뒤에 채워지는 문구를 읽는다 */}
        <p role="status" className={`text-sm ${formState === 'error' ? 'text-red-600 dark:text-red-400' : 'text-muted-foreground'}`}>
          {formState === 'success' || formState === 'error' ? statusMessage[formState] : ''}
        </p>
      </div>
    </form>
  );
}
