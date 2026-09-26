import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const PatientCard = ({ patient, onClick }) => {
  const { t } = useTranslation();

  const getCategoryLower = () => (patient.triage_category || '').toLowerCase();

  const getBorderColor = () => {
    switch (getCategoryLower()) {
      case 'critical': return 'border-triage-critical';
      case 'urgent': return 'border-triage-urgent';
      default: return 'border-triage-standard';
    }
  };

  const getBadgeColor = () => {
    switch (getCategoryLower()) {
      case 'critical': return 'bg-triage-critical text-white';
      case 'urgent': return 'bg-triage-urgent text-white';
      default: return 'bg-triage-standard text-white';
    }
  };

  const isAbnormal = (vital, value) => {
    switch (vital) {
      case 'spo2': return value < 95;
      case 'heart_rate': return value < 60 || value > 100;
      case 'temperature': return value < 97 || value > 99;
      default: return false;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick(patient)}
      className={`bg-white rounded-lg shadow-sm border-l-4 ${getBorderColor()} p-4 cursor-pointer mb-3 hover:shadow-md transition-shadow ${getCategoryLower() === 'critical' ? 'critical-pulse' : ''}`}
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-bold text-gray-900">{patient.name}</h3>
          <p className="text-xs text-gray-500">
            {patient.age} {t('modal.age')} • {patient.gender}
          </p>
        </div>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${getBadgeColor()}`}>
          {Math.round(patient.risk_score)}
        </div>
      </div>
      
      <div className="text-sm text-gray-700 mb-3 truncate">
        {patient.chief_complaint}
      </div>

      <div className="flex gap-2 flex-wrap">
        <div className={`text-xs px-2 py-1 rounded-full bg-gray-100 ${isAbnormal('spo2', patient.spo2) ? 'text-red-600 font-semibold bg-red-50' : 'text-gray-600'}`}>
          SpO2: {patient.spo2}%
        </div>
        <div className={`text-xs px-2 py-1 rounded-full bg-gray-100 ${isAbnormal('heart_rate', patient.heart_rate) ? 'text-red-600 font-semibold bg-red-50' : 'text-gray-600'}`}>
          HR: {patient.heart_rate}
        </div>
        <div className={`text-xs px-2 py-1 rounded-full bg-gray-100 ${isAbnormal('temperature', patient.temperature) ? 'text-red-600 font-semibold bg-red-50' : 'text-gray-600'}`}>
          Temp: {patient.temperature}°F
        </div>
      </div>
    </motion.div>
  );
};

export default PatientCard;
