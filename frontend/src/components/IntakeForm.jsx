import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Send, Loader2, CheckCircle, XCircle } from 'lucide-react';
import VoiceInput from './VoiceInput';
import { createPatient } from '../services/api';

const SYMPTOM_OPTIONS = [
  'Chest Pain',
  'Shortness of Breath',
  'Fever',
  'Headache',
  'Nausea',
  'Dizziness',
  'Abdominal Pain',
  'Fatigue',
  'Cough',
  'Trauma/Injury'
];

const IntakeForm = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'Male',
    temperature: '',
    heart_rate: '',
    spo2: '',
    blood_pressure_systolic: '',
    blood_pressure_diastolic: '',
    respiratory_rate: '',
    symptoms: [],
    chief_complaint: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null); // { type: 'success' | 'error', message: string }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSymptomToggle = (symptom) => {
    setFormData(prev => ({
      ...prev,
      symptoms: prev.symptoms.includes(symptom)
        ? prev.symptoms.filter(s => s !== symptom)
        : [...prev.symptoms, symptom]
    }));
  };

  const handleVoiceTranscript = (text) => {
    setFormData(prev => ({
      ...prev,
      chief_complaint: prev.chief_complaint ? `${prev.chief_complaint} ${text}` : text
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setToast(null);

    try {
      const payload = {
        ...formData,
        age: parseInt(formData.age) || 0,
        temperature: parseFloat(formData.temperature) || 98.6,
        heart_rate: parseInt(formData.heart_rate) || 80,
        spo2: parseInt(formData.spo2) || 98,
        blood_pressure_systolic: parseInt(formData.blood_pressure_systolic) || 120,
        blood_pressure_diastolic: parseInt(formData.blood_pressure_diastolic) || 80,
        respiratory_rate: parseInt(formData.respiratory_rate) || 16,
        symptoms: formData.symptoms.join(', ')
      };

      await createPatient(payload);
      setToast({ type: 'success', message: t('intake.success') });

      // Redirect to dashboard after short delay
      setTimeout(() => navigate('/'), 1500);
    } catch (error) {
      console.error('Error creating patient:', error);
      setToast({ type: 'error', message: t('intake.error') });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t('intake.title')}</h1>
        <p className="text-gray-500 mt-1">{t('intake.subtitle')}</p>
      </div>

      {/* Toast notification */}
      {toast && (
        <div className={`mb-4 p-4 rounded-lg flex items-center gap-2 ${
          toast.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {toast.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
          {toast.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">

        {/* Patient Information */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('intake.patientInfo')}</h2>
          
          {/* Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('intake.name')}</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full h-14 px-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder={t('intake.name')}
            />
          </div>

          {/* Age */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('intake.age')}</label>
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => setFormData(prev => ({ ...prev, age: Math.max(0, (parseInt(prev.age) || 0) - 1).toString() }))} className="w-14 h-14 bg-gray-100 rounded-lg text-2xl font-bold hover:bg-gray-200 transition-colors">−</button>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                required
                min="0"
                max="120"
                className="flex-1 h-14 px-4 text-lg text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <button type="button" onClick={() => setFormData(prev => ({ ...prev, age: Math.min(120, (parseInt(prev.age) || 0) + 1).toString() }))} className="w-14 h-14 bg-gray-100 rounded-lg text-2xl font-bold hover:bg-gray-200 transition-colors">+</button>
            </div>
          </div>

          {/* Gender */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('intake.gender')}</label>
            <div className="grid grid-cols-3 gap-3">
              {['Male', 'Female', 'Other'].map(g => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, gender: g }))}
                  className={`h-14 rounded-lg font-medium text-lg transition-all ${
                    formData.gender === g 
                      ? 'bg-indigo-500 text-white shadow-md' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {t(`intake.${g.toLowerCase()}`)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Vital Signs */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('intake.vitals')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: 'temperature', label: t('intake.temperature'), placeholder: '98.6', unit: '°F' },
              { name: 'heart_rate', label: t('intake.heartRate'), placeholder: '60-100', unit: 'BPM' },
              { name: 'spo2', label: t('intake.spo2'), placeholder: '95-100', unit: '%' },
              { name: 'blood_pressure_systolic', label: t('intake.bpSystolic'), placeholder: '90-130', unit: 'mmHg' },
              { name: 'blood_pressure_diastolic', label: t('intake.bpDiastolic'), placeholder: '60-80', unit: 'mmHg' },
              { name: 'respiratory_rate', label: t('intake.respiratoryRate'), placeholder: '12-20', unit: '/min' }
            ].map(vital => (
              <div key={vital.name}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{vital.label}</label>
                <div className="relative">
                  <input
                    type="number"
                    name={vital.name}
                    value={formData[vital.name]}
                    onChange={handleChange}
                    required
                    step={vital.name === 'temperature' ? '0.1' : '1'}
                    className="w-full h-14 px-4 pr-16 text-xl border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder={vital.placeholder}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">{vital.unit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Symptoms */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('intake.symptoms')}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {SYMPTOM_OPTIONS.map(symptom => (
              <button
                key={symptom}
                type="button"
                onClick={() => handleSymptomToggle(symptom)}
                className={`h-12 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center ${
                  formData.symptoms.includes(symptom) 
                    ? 'bg-indigo-100 text-indigo-700 border-2 border-indigo-400' 
                    : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
                }`}
              >
                {t(`intake.symptomsList.${symptom}`)}
              </button>
            ))}
          </div>
        </div>

        {/* Chief Complaint with Voice Input */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('intake.chiefComplaint')}</h2>
          <div className="space-y-3">
            <textarea
              name="chief_complaint"
              value={formData.chief_complaint}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
              placeholder={t('intake.chiefComplaint')}
            />
            <VoiceInput 
              onTranscript={handleVoiceTranscript} 
              language={i18n.language} 
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full h-16 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white text-xl font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-3"
        >
          {submitting ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              {t('intake.submitting')}
            </>
          ) : (
            <>
              <Send className="w-6 h-6" />
              {t('intake.submit')}
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default IntakeForm;
