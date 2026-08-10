import React, { useState } from 'react';
import { supabase } from '../../services/supabaseClient';

interface DeleteTemplateModalProps {
  templateId: string;
  templateName?: string;
  onClose: () => void;
  onDeleted: () => void;
}

type ModalStep = 'ask_delete_logs' | 'confirm_hard_delete' | 'confirm_soft_delete';

export const DeleteTemplateModal: React.FC<DeleteTemplateModalProps> = ({
  templateId,
  templateName: _templateName = 'Template',
  onClose,
  onDeleted,
}) => {
  const [step, setStep] = useState<ModalStep>('ask_delete_logs');
  const [loading, setLoading] = useState(false);

  // Hard Delete: Deletes template + all day exercises + all logs + all saved sets
  const handleHardDelete = async () => {
    setLoading(true);
    try {
      // 1. Fetch workout logs for this template
      const { data: logs } = await supabase
        .from('workout_logs')
        .select('id')
        .eq('template_id', templateId);

      const logIds = (logs || []).map((l: any) => l.id);
      if (logIds.length > 0) {
        await supabase.from('workout_log_sets').delete().in('workout_log_id', logIds);
        await supabase.from('workout_logs').delete().in('id', logIds);
      }

      // 2. Fetch template days
      const { data: days } = await supabase
        .from('workout_template_days')
        .select('id')
        .eq('template_id', templateId);

      const dayIds = (days || []).map((d: any) => d.id);
      if (dayIds.length > 0) {
        await supabase.from('workout_template_exercises').delete().in('template_day_id', dayIds);
        await supabase.from('workout_template_days').delete().in('id', dayIds);
      }

      // 3. Delete template row
      await supabase.from('workout_templates').delete().eq('id', templateId);

      onDeleted();
    } catch (err) {
      console.error('Failed to hard delete template:', err);
      alert('Error deleting template. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Soft Delete: Sets deleted_at on template (removes template from user view while preserving logs in Supabase)
  const handleSoftDelete = async () => {
    setLoading(true);
    try {
      await supabase
        .from('workout_templates')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', templateId);

      onDeleted();
    } catch (err) {
      console.error('Failed to soft delete template:', err);
      alert('Error deleting template. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.45)',
        backdropFilter: 'blur(4px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        animation: 'fadeIn 200ms ease-out',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 24,
          padding: '28px 24px',
          maxWidth: 380,
          width: '100%',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          animation: 'fadeInUp 200ms ease-out',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Step 1: Ask if user wants to delete logs along with template */}
        {step === 'ask_delete_logs' && (
          <>
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: '50%',
                backgroundColor: '#FEE2E2',
                color: '#EF4444',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 16,
              }}
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
            </div>

            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1F2937', margin: '0 0 8px' }}>
              Delete Workout Logs?
            </h2>
            <p style={{ fontSize: 14, color: '#6B7280', margin: '0 0 24px', lineHeight: 1.5 }}>
              Would you want your workout save logs to be deleted along with the template?
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%' }}>
              {/* Yes (Highlighted in Red) */}
              <button
                type="button"
                onClick={() => setStep('confirm_hard_delete')}
                style={{
                  width: '100%',
                  height: 46,
                  borderRadius: 14,
                  backgroundColor: '#EF4444',
                  color: '#FFFFFF',
                  fontSize: 15,
                  fontWeight: 650,
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(239, 68, 68, 0.25)',
                }}
              >
                Yes
              </button>

              {/* No */}
              <button
                type="button"
                onClick={() => setStep('confirm_soft_delete')}
                style={{
                  width: '100%',
                  height: 46,
                  borderRadius: 14,
                  backgroundColor: '#F3F4F6',
                  color: '#374151',
                  fontSize: 15,
                  fontWeight: 650,
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                No
              </button>
            </div>
          </>
        )}

        {/* Step 2A: Confirm Hard Delete (Logs + Template) */}
        {step === 'confirm_hard_delete' && (
          <>
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: '50%',
                backgroundColor: '#FEE2E2',
                color: '#EF4444',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 16,
              }}
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>

            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1F2937', margin: '0 0 8px' }}>
              Delete All Template Data & Logs
            </h2>
            <p style={{ fontSize: 14, color: '#6B7280', margin: '0 0 24px', lineHeight: 1.5 }}>
              All your data log will be deleted.
            </p>

            <div style={{ display: 'flex', gap: 12, width: '100%' }}>
              {/* Cancel */}
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                style={{
                  flex: 1,
                  height: 46,
                  borderRadius: 14,
                  backgroundColor: '#F3F4F6',
                  color: '#374151',
                  fontSize: 15,
                  fontWeight: 650,
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>

              {/* OK (Red) */}
              <button
                type="button"
                onClick={handleHardDelete}
                disabled={loading}
                style={{
                  flex: 1,
                  height: 46,
                  borderRadius: 14,
                  backgroundColor: '#EF4444',
                  color: '#FFFFFF',
                  fontSize: 15,
                  fontWeight: 650,
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(239, 68, 68, 0.25)',
                }}
              >
                {loading ? 'Deleting...' : 'OK'}
              </button>
            </div>
          </>
        )}

        {/* Step 2B: Confirm Soft Delete (Template deleted, logs kept) */}
        {step === 'confirm_soft_delete' && (
          <>
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: '50%',
                backgroundColor: '#EFF6FF',
                color: '#3B82F6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 16,
              }}
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
            </div>

            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1F2937', margin: '0 0 8px' }}>
              Delete Template Only
            </h2>
            <p style={{ fontSize: 14, color: '#6B7280', margin: '0 0 24px', lineHeight: 1.5 }}>
              Your template is deleted but logs are saved.
            </p>

            <div style={{ display: 'flex', gap: 12, width: '100%' }}>
              {/* Cancel */}
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                style={{
                  flex: 1,
                  height: 46,
                  borderRadius: 14,
                  backgroundColor: '#F3F4F6',
                  color: '#374151',
                  fontSize: 15,
                  fontWeight: 650,
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>

              {/* OK (In Red) */}
              <button
                type="button"
                onClick={handleSoftDelete}
                disabled={loading}
                style={{
                  flex: 1,
                  height: 46,
                  borderRadius: 14,
                  backgroundColor: '#EF4444',
                  color: '#FFFFFF',
                  fontSize: 15,
                  fontWeight: 650,
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(239, 68, 68, 0.25)',
                }}
              >
                {loading ? 'Deleting...' : 'OK'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
