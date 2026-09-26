import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Loader2 } from 'lucide-react';
import KanbanBoard from '../components/KanbanBoard';
import StatsBar from '../components/StatsBar';
import RiskModal from '../components/RiskModal';
import { getPatients, getStats } from '../services/api';

const Dashboard = () => {
  const { t } = useTranslation();
  const [patients, setPatients] = useState([]);
  const [stats, setStats] = useState({ total: 0, critical: 0, urgent: 0, standard: 0 });
  const [loading, setLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      const [patientsData, statsData] = await Promise.all([
        getPatients(),
        getStats()
      ]);
      setPatients(patientsData);
      setStats(statsData);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();

    // Auto-refresh every 15 seconds
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const handlePatientClick = (patient) => {
    setSelectedPatient(patient);
  };

  const handleCloseModal = () => {
    setSelectedPatient(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-indigo-500 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">{t('dashboard.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t('dashboard.title')}</h1>
        <p className="text-gray-500 mt-1">{t('dashboard.subtitle')}</p>
      </div>

      <StatsBar externalStats={stats} />

      <KanbanBoard 
        patients={patients} 
        onPatientClick={handlePatientClick} 
      />

      {selectedPatient && (
        <RiskModal 
          patient={selectedPatient} 
          onClose={handleCloseModal} 
        />
      )}
    </div>
  );
};

export default Dashboard;
