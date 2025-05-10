'use client';

import { useEffect, useState } from 'react';
import { Log } from '@deckai/client/types/api';
import { Button } from '@deckai/deck-ui';

export default function LogsPage() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [expandedLogIds, setExpandedLogIds] = useState<Set<number>>(new Set()); // Track expanded logs

  useEffect(() => {
    const eventSource = new EventSource('/api/logs');

    eventSource.onmessage = (event) => {
      const newLogs = JSON.parse(event.data);
      setLogs(newLogs);
    };

    eventSource.onerror = () => {
      console.error('Error connecting to the logs stream');
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  const toggleExpand = (logId: number) => {
    setExpandedLogIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(logId)) {
        newSet.delete(logId); // Collapse if already expanded
      } else {
        newSet.add(logId); // Expand if not already expanded
      }
      return newSet;
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Logs</h1>
        <ul className="space-y-4">
          {logs?.map((log) => (
            <li
              key={log.id}
              className={`p-4 rounded-lg shadow-sm ${
                log.level === 'error'
                  ? 'bg-red-100 border-l-4 border-red-500'
                  : log.level === 'warn'
                  ? 'bg-yellow-100 border-l-4 border-yellow-500'
                  : 'bg-green-100 border-l-4 border-green-500'
              }`}
            >
              <div className="flex justify-between items-center">
                <span
                  className={`font-semibold text-sm ${
                    log.level === 'error'
                      ? 'text-red-600'
                      : log.level === 'warn'
                      ? 'text-yellow-600'
                      : 'text-green-600'
                  }`}
                >
                  [{log.level.toUpperCase()}]
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(log.created_at).toLocaleString()}
                </span>
              </div>
              <p className="text-gray-800 mt-2">{log.message}</p>
              {log.metadata && (
                <div className="mt-2">
                  <Button
                    onClick={() => toggleExpand(log.id)}
                    variant={expandedLogIds.has(log.id) ? 'outlined' : 'filled'}
                  >
                    {expandedLogIds.has(log.id) ? 'Hide Metadata' : 'Show Metadata'}
                  </Button>
                  {expandedLogIds.has(log.id) && (
                    <pre className="mt-2 bg-gray-50 p-2 rounded text-sm text-gray-600 overflow-x-auto">
                      {JSON.stringify(log.metadata, null, 2)}
                    </pre>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}