import React from 'react';
import { PerformanceData } from '../types';

interface DashboardProps {
  performanceData: PerformanceData;
}

const getFluencyColor = (fluency: number | undefined) => {
    if (fluency === undefined) return 'bg-slate-200 dark:bg-slate-700';
    if (fluency > 0.9) return 'bg-green-500';
    if (fluency > 0.75) return 'bg-green-400';
    if (fluency > 0.6) return 'bg-yellow-400';
    if (fluency > 0.4) return 'bg-yellow-500';
    if (fluency > 0.2) return 'bg-orange-500';
    return 'bg-red-500';
};

const Dashboard: React.FC<DashboardProps> = ({ performanceData }) => {
  const tableSize = 20;
  const headers = Array.from({ length: tableSize }, (_, i) => i + 1);

  const hasData = Object.keys(performanceData).length > 0;

  return (
    <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-xl shadow-lg animate-fade-in">
      <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">My Fluency Dashboard</h2>
      <p className="text-slate-600 dark:text-slate-300 mb-6">
        {hasData 
          ? "Here is your progress at a glance. Darker green means higher fluency!" 
          : "Complete a practice session to see your progress visualized here."
        }
      </p>

      {!hasData ? (
        <div className="text-center py-12 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-slate-900 dark:text-white">No data yet</h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Get started by setting up a session below.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
            <div className="grid gap-1.5" style={{gridTemplateColumns: `repeat(${tableSize + 1}, minmax(0, 1fr))`}}>
                <div className="font-bold text-center">×</div>
                {headers.map(h => <div key={`head-${h}`} className="font-bold text-center p-2 text-slate-600 dark:text-slate-300">{h}</div>)}
                {headers.map(row => (
                    <React.Fragment key={`row-${row}`}>
                        <div className="font-bold text-center p-2 text-slate-600 dark:text-slate-300">{row}</div>
                        {headers.map(col => {
                            const key = [row, col].sort().join('x');
                            const data = performanceData[key];
                            const color = getFluencyColor(data?.fluency);
                            const accuracy = data ? (data.correct / data.totalAttempts * 100).toFixed(0) + '%' : 'N/A';
                            return (
                                <div key={key} className="relative group">
                                    <div className={`aspect-square w-full h-full rounded-md transition-all ${color}`}></div>
                                    <div className="absolute inset-0 p-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/80 text-white rounded-lg flex flex-col items-center justify-center pointer-events-none">
                                        <span className="font-bold">{row}×{col}</span>
                                        <span className="text-center">Acc: {accuracy}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </React.Fragment>
                ))}
            </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;