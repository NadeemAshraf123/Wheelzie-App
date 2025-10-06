import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

// Define TypeScript interface based on your db.json structure
interface Reminder {
  id: number;
  message: string;
  priority?: 'high' | 'medium' | 'low';
  date?: string;
}

const Reminders: React.FC = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['reminders'],
    queryFn: async () => {
      const res = await axios.get('http://localhost:3000/reminders');
      return res.data;
    }
  });

  if (isLoading) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Reminders</h3>
        <div className="space-y-3">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="animate-pulse flex items-center space-x-3">
              <div className="w-3 h-3 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Reminders</h3>
        <div className="bg-red-50 border border-red-200 rounded p-4 text-center">
          <p className="text-red-600">Error loading reminders: {error.message}</p>
        </div>
      </div>
    );
  }

  // Check if data exists and is an array
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Reminders</h3>
        <div className="bg-gray-50 border border-gray-200 rounded p-8 text-center">
          <div className="text-gray-400 text-4xl mb-2">📝</div>
          <p className="text-gray-500">No reminders available</p>
          <p className="text-sm text-gray-400 mt-1">All caught up!</p>
        </div>
      </div>
    );
  }

  // Helper function to get priority styles
  const getPriorityStyles = (priority?: string) => {
    switch (priority) {
      case 'high':
        return {
          bgColor: 'bg-red-50 border-red-200',
          dotColor: 'bg-red-500',
          textColor: 'text-red-700'
        };
      case 'medium':
        return {
          bgColor: 'bg-yellow-50 border-yellow-200',
          dotColor: 'bg-yellow-500',
          textColor: 'text-yellow-700'
        };
      case 'low':
        return {
          bgColor: 'bg-blue-50 border-blue-200',
          dotColor: 'bg-blue-500',
          textColor: 'text-blue-700'
        };
      default:
        return {
          bgColor: 'bg-gray-50 border-gray-200',
          dotColor: 'bg-gray-400',
          textColor: 'text-gray-700'
        };
    }
  };

  // Format date if available
  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Reminders</h3>
        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
          {data.length} items
        </span>
      </div>
      
      <div className="space-y-3">
        {data.map((item: Reminder) => {
          const styles = getPriorityStyles(item.priority);
          
          return (
            <div 
              key={item.id} 
              className={`${styles.bgColor} border rounded-lg p-4 transition-all hover:shadow-md`}
            >
              <div className="flex items-start space-x-3">
                <div className={`${styles.dotColor} w-2 h-2 rounded-full mt-2 flex-shrink-0`}></div>
                <div className="flex-1 min-w-0">
                  <p className={`${styles.textColor} font-medium text-sm leading-relaxed`}>
                    {item.message}
                  </p>
                  {item.date && (
                    <p className="text-xs text-gray-500 mt-1">
                      Due: {formatDate(item.date)}
                    </p>
                  )}
                </div>
                {item.priority && (
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    item.priority === 'high' 
                      ? 'bg-red-100 text-red-800' 
                      : item.priority === 'medium'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {item.priority}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Optional: Add reminder stats */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex justify-between text-xs text-gray-500">
          <span>High: {data.filter((item: Reminder) => item.priority === 'high').length}</span>
          <span>Medium: {data.filter((item: Reminder) => item.priority === 'medium').length}</span>
          <span>Low: {data.filter((item: Reminder) => item.priority === 'low').length}</span>
        </div>
      </div>
    </div>
  );
};

export default Reminders;