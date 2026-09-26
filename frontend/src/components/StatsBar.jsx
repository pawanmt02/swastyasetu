import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Users, AlertTriangle, AlertCircle, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { getStats } from '../services/api';

const StatsBar = ({ externalStats }) => {
  const { t } = useTranslation();
  const [stats, setStats] = useState({ total: 0, critical: 0, urgent: 0, standard: 0 });

  useEffect(() => {
    if (externalStats) {
      setStats(externalStats);
    } else {
      const fetchStats = async () => {
        try {
          const data = await getStats();
          setStats(data);
        } catch (error) {
          console.error("Failed to fetch stats", error);
        }
      };
      fetchStats();
    }
  }, [externalStats]);

  const statCards = [
    { key: 'total', label: t('stats.totalPatients'), value: stats.total, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
    { key: 'critical', label: t('stats.criticalCount'), value: stats.critical, icon: AlertTriangle, color: 'text-triage-critical', bg: 'bg-triage-critical-light', pulse: true },
    { key: 'urgent', label: t('stats.urgentCount'), value: stats.urgent, icon: AlertCircle, color: 'text-triage-urgent', bg: 'bg-triage-urgent-light' },
    { key: 'standard', label: t('stats.standardCount'), value: stats.standard, icon: CheckCircle, color: 'text-triage-standard', bg: 'bg-triage-standard-light' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {statCards.map((stat) => (
        <div key={stat.key} className="bg-white rounded-lg shadow p-4 flex items-center">
          <div className={`p-3 rounded-full mr-4 ${stat.bg} ${stat.pulse ? 'relative' : ''}`}>
            {stat.pulse && (
              <span className="flex absolute h-3 w-3 top-0 right-0 -mt-1 -mr-1">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
            )}
            <stat.icon className={`h-6 w-6 ${stat.color}`} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 truncate">{stat.label}</p>
            <motion.p 
              key={stat.value}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl font-bold text-gray-900"
            >
              {stat.value}
            </motion.p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsBar;
