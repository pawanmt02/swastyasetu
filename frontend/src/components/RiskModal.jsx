import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, Brain } from 'lucide-react';
import { getExplanation } from '../services/api';

const RiskModal = ({ patient, onClose }) => {
  const { t } = useTranslation();
  const [explanation, setExplanation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  useEffect(() => {
    const fetchExplanation = async () => {
      if (patient) {
        setLoading(true);
        try {
          const data = await getExplanation(patient.id);
          setExplanation(data);
        } catch (error) {
          console.error("Failed to fetch explanation", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchExplanation();
  }, [patient]);

  if (!patient) return null;

  const isAbnormal = (vital, value) => {
    switch (vital) {
      case 'spo2': return value < 95;
      case 'heart_rate': return value < 60 || value > 100;
      case 'temperature': return value < 97 || value > 99;
      case 'systolic': return value > 130 || value < 90;
      case 'diastolic': return value > 80 || value < 60;
      case 'respiratory_rate': return value < 12 || value > 20;
      default: return false;
    }
  };

  const getCategoryLower = () => (patient.triage_category || '').toLowerCase();

  const getBadgeColor = () => {
    switch (getCategoryLower()) {
      case 'critical': return 'bg-triage-critical';
      case 'urgent': return 'bg-triage-urgent';
      default: return 'bg-triage-standard';
    }
  };

  // Vitals data built from flat patient fields
  const vitalsData = [
    { key: 'temperature', label: t('modal.temperature'), value: `${patient.temperature} °F`, abnormalCheck: 'temperature', rawValue: patient.temperature },
    { key: 'heart_rate', label: t('modal.heartRate'), value: `${patient.heart_rate} BPM`, abnormalCheck: 'heart_rate', rawValue: patient.heart_rate },
    { key: 'spo2', label: t('modal.spo2'), value: `${patient.spo2}%`, abnormalCheck: 'spo2', rawValue: patient.spo2 },
    { key: 'bp_sys', label: `${t('modal.bloodPressure')} (Sys)`, value: `${patient.blood_pressure_systolic} mmHg`, abnormalCheck: 'systolic', rawValue: patient.blood_pressure_systolic },
    { key: 'bp_dia', label: `${t('modal.bloodPressure')} (Dia)`, value: `${patient.blood_pressure_diastolic} mmHg`, abnormalCheck: 'diastolic', rawValue: patient.blood_pressure_diastolic },
    { key: 'rr', label: t('modal.respiratoryRate'), value: `${patient.respiratory_rate} /min`, abnormalCheck: 'respiratory_rate', rawValue: patient.respiratory_rate },
  ];

  // Normalize contribution values to percentages for the bar chart
  const getContributionPercent = (factors) => {
    if (!factors || factors.length === 0) return [];
    const totalAbs = factors.reduce((sum, f) => sum + Math.abs(f.contribution), 0);
    if (totalAbs === 0) return factors.map(f => ({ ...f, percent: 0 }));
    return factors.map(f => ({
      ...f,
      percent: Math.round((Math.abs(f.contribution) / totalAbs) * 100)
    }));
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-gray-900">{patient.name}</h2>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold text-white ${getBadgeColor()}`}>
                {patient.triage_category}
              </span>
              <span className="text-sm text-gray-500">
                {t('triage.riskScore')}: {Math.round(patient.risk_score)}
              </span>
            </div>
            <button 
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              aria-label={t('modal.close')}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">

            {/* Patient Info */}
            <div className="flex gap-4 text-sm text-gray-600">
              <span><strong>{t('modal.age')}:</strong> {patient.age}</span>
              <span><strong>{t('modal.gender')}:</strong> {patient.gender}</span>
              <span><strong>{t('modal.chiefComplaint')}:</strong> {patient.chief_complaint}</span>
            </div>
            
            {/* Vitals Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">{t('modal.vitals')}</h3>
              <div className="grid grid-cols-2 gap-3">
                {vitalsData.map((vital) => {
                  const abnormal = isAbnormal(vital.abnormalCheck, vital.rawValue);
                  return (
                    <div key={vital.key} className={`p-3 rounded-lg border ${abnormal ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'} flex justify-between items-center`}>
                      <span className="text-gray-600 text-sm">{vital.label}</span>
                      <div className="flex items-center gap-2">
                        <span className={`font-bold ${abnormal ? 'text-red-600' : 'text-gray-900'}`}>{vital.value}</span>
                        {abnormal && <AlertTriangle className="w-4 h-4 text-red-500" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Risk Breakdown Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Brain className="w-5 h-5 text-indigo-500" />
                {t('modal.riskBreakdown')}
              </h3>
              {loading ? (
                <div className="flex justify-center p-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
              ) : explanation && explanation.factors && explanation.factors.length > 0 ? (
                <div className="space-y-3">
                  {getContributionPercent(explanation.factors).map((factor, idx) => (
                    <div key={idx} className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">{factor.feature}</span>
                        <span className="text-sm text-gray-500">{t('modal.contributionToRisk')}: {factor.percent}%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 w-16">Val: {factor.value}</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2.5">
                          <div 
                            className={`h-2.5 rounded-full transition-all duration-500 ${factor.contribution > 0 ? 'bg-red-500' : 'bg-green-500'}`} 
                            style={{ width: `${Math.min(factor.percent, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 italic">No risk explanation available.</p>
              )}
            </div>

            {/* Recommendation Section */}
            {explanation && explanation.recommendation && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{t('modal.recommendation')}</h3>
                <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-lg">
                  <p className="text-indigo-900 text-sm">{explanation.recommendation}</p>
                </div>
              </div>
            )}

            {/* Symptoms Section */}
            {patient.symptoms && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{t('modal.symptoms')}</h3>
                <div className="flex flex-wrap gap-2">
                  {patient.symptoms.split(',').map((symptom, idx) => (
                    <span key={idx} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                      {symptom.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default RiskModal;
