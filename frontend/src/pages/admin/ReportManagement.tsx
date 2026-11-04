import React, { useState } from 'react';
import { AlertCircle, CheckCircle, XCircle, ShieldAlert } from 'lucide-react';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';

interface ReportItem {
  id: string;
  reporterName: string;
  reportedTarget: string;
  targetType: 'USER' | 'POST';
  reason: string;
  description: string;
  status: 'PENDING' | 'RESOLVED' | 'DISMISSED';
  createdAt: string;
}

export const ReportManagement: React.FC = () => {
  const [reports, setReports] = useState<ReportItem[]>([
    {
      id: 'rep-1',
      reporterName: 'Priya Karthik',
      reportedTarget: 'Commercial Rental Spam Post',
      targetType: 'POST',
      reason: 'Spam / Commercial Brokerage',
      description: 'Multiple unverified broker posts advertising PG rooms without locality accuracy.',
      status: 'PENDING',
      createdAt: '2026-11-03T14:20:00Z',
    },
    {
      id: 'rep-2',
      reporterName: 'Suresh Varma',
      reportedTarget: 'Fake Profile (Cyber City)',
      targetType: 'USER',
      reason: 'Fake Identity / Bot',
      description: 'Suspicious profile asking for bank transfers for shared apartment deposit.',
      status: 'PENDING',
      createdAt: '2026-11-04T07:15:00Z',
    },
  ]);

  const handleUpdateStatus = (id: string, newStatus: 'RESOLVED' | 'DISMISSED') => {
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-4">
      <div>
        <h3 className="text-base font-bold text-gray-900">Abuse Reports & Moderation Queue</h3>
        <p className="text-xs text-gray-500">Review community violations, spam reports, and safety alerts.</p>
      </div>

      <div className="space-y-3">
        {reports.map((report) => {
          const isPending = report.status === 'PENDING';
          return (
            <div
              key={report.id}
              className="p-4 rounded-xl border border-gray-100 bg-gray-50/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-xs text-gray-900">{report.reportedTarget}</span>
                  <Badge variant={report.targetType === 'POST' ? 'secondary' : 'warning'} size="sm" className="text-[10px]">
                    {report.targetType}
                  </Badge>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      report.status === 'RESOLVED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : report.status === 'DISMISSED'
                        ? 'bg-gray-200 text-gray-700'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {report.status}
                  </span>
                </div>
                <p className="text-xs text-gray-600 font-medium">Reason: {report.reason}</p>
                <p className="text-xs text-gray-500">{report.description}</p>
                <p className="text-[10px] text-gray-400">
                  Reported by {report.reporterName} on {new Date(report.createdAt).toLocaleDateString()}
                </p>
              </div>

              {isPending && (
                <div className="flex items-center space-x-2 self-end sm:self-center shrink-0">
                  <Button
                    size="sm"
                    onClick={() => handleUpdateStatus(report.id, 'RESOLVED')}
                    className="bg-emerald-600 hover:bg-emerald-700 text-xs py-1 px-3"
                  >
                    <CheckCircle className="w-3.5 h-3.5 mr-1" />
                    Take Action
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUpdateStatus(report.id, 'DISMISSED')}
                    className="text-xs py-1 px-3"
                  >
                    <XCircle className="w-3.5 h-3.5 mr-1 text-gray-400" />
                    Dismiss
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

