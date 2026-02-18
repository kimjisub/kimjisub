'use client';

import { FormEvent, useCallback, useRef, useState } from 'react';
import {
  faCheck,
  faExclamationCircle,
  faPaperPlane,
  faSpinner,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AnimatePresence, motion, useInView } from 'framer-motion';

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

export function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });

  const [formState, setFormState] = useState<FormState>('idle');
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [focusedField, setFocusedField] = useState<keyof FormData | null>(null);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

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
          setFormState('success');
          // 3초 후 폼 리셋
          setTimeout(() => {
            setFormData(initialFormData);
            setFormState('idle');
          }, 3000);
        } else {
          setFormState('error');
          setTimeout(() => setFormState('idle'), 3000);
        }
      } catch {
        setFormState('error');
        setTimeout(() => setFormState('idle'), 3000);
      }
    },
    [formData]
  );

  const inputClasses = (field: keyof FormData) =>
    `w-full px-4 py-3 rounded-xl border bg-background/50 backdrop-blur-sm
     text-foreground placeholder:text-muted-foreground/60
     transition-all duration-300 outline-none
     ${
       focusedField === field
         ? 'border-accent ring-2 ring-accent/20 shadow-lg shadow-accent/5'
         : 'border-border hover:border-accent/50'
     }`;

  const labelClasses = (field: keyof FormData) =>
    `absolute left-4 transition-all duration-200 pointer-events-none
     ${
       focusedField === field || formData[field]
         ? '-top-2.5 text-xs bg-background px-1 text-accent'
         : 'top-3 text-sm text-muted-foreground'
     }`;

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="mt-12"
    >
      <div className="max-w-2xl mx-auto">
        <motion.div
          className="p-8 rounded-2xl border border-border bg-card/30 backdrop-blur-md shadow-xl"
          whileHover={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)' }}
        >
          <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
            <FontAwesomeIcon icon={faPaperPlane} className="text-accent" />
            메시지 보내기
          </h3>

          <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name */}
              <div className="relative">
                <label htmlFor="contact-name" className={labelClasses('name')}>
                  이름
                </label>
                <input
                  id="contact-name"
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField(null)}
                  className={inputClasses('name')}
                  aria-label="이름"
                  disabled={formState === 'sending'}
                />
              </div>

              {/* Email */}
              <div className="relative">
                <label htmlFor="contact-email" className={labelClasses('email')}>
                  이메일
                </label>
                <input
                  id="contact-email"
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  className={inputClasses('email')}
                  aria-label="이메일"
                  disabled={formState === 'sending'}
                />
              </div>
            </div>

            {/* Subject */}
            <div className="relative">
              <label htmlFor="contact-subject" className={labelClasses('subject')}>
                제목 (선택)
              </label>
              <input
                id="contact-subject"
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                onFocus={() => setFocusedField('subject')}
                onBlur={() => setFocusedField(null)}
                className={inputClasses('subject')}
                aria-label="제목"
                disabled={formState === 'sending'}
              />
            </div>

            {/* Message */}
            <div className="relative">
              <label htmlFor="contact-message" className={labelClasses('message')}>
                메시지
              </label>
              <textarea
                id="contact-message"
                name="message"
                required
                rows={5}
                value={formData.message}
                onChange={handleChange}
                onFocus={() => setFocusedField('message')}
                onBlur={() => setFocusedField(null)}
                className={`${inputClasses('message')} resize-none`}
                aria-label="메시지"
                disabled={formState === 'sending'}
              />
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={formState === 'sending' || formState === 'success'}
              className={`
                w-full py-4 px-6 rounded-xl font-medium text-sm
                flex items-center justify-center gap-2
                transition-all duration-300
                focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:outline-none
                ${
                  formState === 'success'
                    ? 'bg-green-500 text-white'
                    : formState === 'error'
                    ? 'bg-red-500 text-white'
                    : 'bg-accent text-accent-foreground hover:bg-accent/90'
                }
                disabled:cursor-not-allowed
              `}
              whileHover={formState === 'idle' ? { scale: 1.02 } : {}}
              whileTap={formState === 'idle' ? { scale: 0.98 } : {}}
            >
              <AnimatePresence mode="wait">
                {formState === 'idle' && (
                  <motion.span
                    key="idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    <FontAwesomeIcon icon={faPaperPlane} />
                    보내기
                  </motion.span>
                )}
                {formState === 'sending' && (
                  <motion.span
                    key="sending"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                    준비 중...
                  </motion.span>
                )}
                {formState === 'success' && (
                  <motion.span
                    key="success"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    <FontAwesomeIcon icon={faCheck} />
                    메시지가 전송되었습니다!
                  </motion.span>
                )}
                {formState === 'error' && (
                  <motion.span
                    key="error"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    <FontAwesomeIcon icon={faExclamationCircle} />
                    오류가 발생했습니다
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </form>

          {/* Privacy note */}
          <p className="mt-4 text-xs text-muted-foreground text-center">
            메시지는 안전하게 저장되며, 빠른 시일 내에 답변드리겠습니다.
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
