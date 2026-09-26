import React from 'react';
import { useTranslation } from 'react-i18next';
import { AnimatePresence } from 'framer-motion';
import PatientCard from './PatientCard';

const KanbanBoard = ({ patients, onPatientClick }) => {
  const { t } = useTranslation();

  const getPatientsByCategory = (category) => {
    return patients.filter(p => p.triage_category?.toLowerCase() === category.toLowerCase());
  };

  const columns = [
    {
      id: 'Critical',
      title: t('triage.critical'),
      patients: getPatientsByCategory('Critical'),
      headerBg: 'bg-red-600',
      columnBg: 'bg-red-50'
    },
    {
      id: 'Urgent',
      title: t('triage.urgent'),
      patients: getPatientsByCategory('Urgent'),
      headerBg: 'bg-amber-500',
      columnBg: 'bg-amber-50'
    },
    {
      id: 'Standard',
      title: t('triage.standard'),
      patients: getPatientsByCategory('Standard'),
      headerBg: 'bg-green-600',
      columnBg: 'bg-green-50'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
      {columns.map(column => (
        <div key={column.id} className={`${column.columnBg} rounded-xl overflow-hidden flex flex-col shadow-sm border border-gray-200`}>
          <div className={`${column.headerBg} p-3 text-white flex justify-between items-center`}>
            <h2 className="font-bold text-lg">{column.title}</h2>
            <span className="bg-white bg-opacity-20 px-2 py-1 rounded-full text-sm font-semibold">
              {column.patients.length}
            </span>
          </div>
          
          <div className="p-3 flex-1 overflow-y-auto">
            <AnimatePresence>
              {column.patients.length > 0 ? (
                column.patients.map(patient => (
                  <PatientCard 
                    key={patient.id} 
                    patient={patient} 
                    onClick={onPatientClick} 
                  />
                ))
              ) : (
                <div className="text-center p-4 text-gray-500 italic mt-4 bg-white bg-opacity-50 rounded-lg">
                  {t('dashboard.noPatients')}
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      ))}
    </div>
  );
};

export default KanbanBoard;
