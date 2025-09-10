import React from 'react';
import StudyCard from './StudyCard';

const ListView = ({ studyData, onMarkDone }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return {
      full: date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      isToday: dateString === new Date().toISOString().split('T')[0],
      isPast: new Date(dateString) < new Date().setHours(0, 0, 0, 0),
      isFuture: new Date(dateString) > new Date().setHours(23, 59, 59, 999)
    };
  };

  const getCompletionStats = (subjects) => {
    const completed = subjects.filter(s => s.completed).length;
    const total = subjects.length;
    return { completed, total, percentage: Math.round((completed / total) * 100) };
  };

  const getTotalStudyTime = (subjects) => {
    return subjects.reduce((total, subject) => {
      const hours = parseFloat(subject.duration.match(/[\d.]+/)[0]);
      return total + hours;
    }, 0);
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Study Schedule</h2>
        <p className="text-gray-600">Complete your daily study plan to achieve your JEE & NEET goals</p>
      </div>

      {studyData.map((day) => {
        const dateInfo = formatDate(day.date);
        const stats = getCompletionStats(day.subjects);
        const totalHours = getTotalStudyTime(day.subjects);
        
        return (
          <div key={day.date} className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Date Header */}
            <div className={`p-6 border-b-2 ${
              dateInfo.isToday 
                ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white border-teal-600' 
                : dateInfo.isPast
                ? 'bg-gray-50 text-gray-700 border-gray-200'
                : 'bg-gradient-to-r from-teal-50 to-teal-100 text-teal-900 border-teal-200'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div>
                    <h3 className="text-2xl font-bold">{dateInfo.full}</h3>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-sm opacity-90">
                        {totalHours} hours total study time
                      </span>
                      <span className="text-sm opacity-90">
                        {day.subjects.length} subjects
                      </span>
                    </div>
                  </div>
                  
                  {dateInfo.isToday && (
                    <div className="px-3 py-1 bg-white bg-opacity-20 rounded-full">
                      <span className="text-sm font-semibold">Today</span>
                    </div>
                  )}
                  
                  {dateInfo.isPast && (
                    <div className="px-3 py-1 bg-gray-200 rounded-full">
                      <span className="text-sm font-semibold text-gray-700">Past</span>
                    </div>
                  )}
                </div>
                
                {/* Progress Stats */}
                <div className="text-right">
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-2xl font-bold">{stats.percentage}%</div>
                      <div className="text-sm opacity-90">{stats.completed}/{stats.total} completed</div>
                    </div>
                    
                    {/* Progress Circle */}
                    <div className="relative w-16 h-16">
                      <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="rgba(255,255,255,0.3)"
                          strokeWidth="2"
                        />
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="white"
                          strokeWidth="3"
                          strokeDasharray={`${stats.percentage}, 100`}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg className="w-6 h-6" fill="white" viewBox="0 0 24 24">
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Study Cards */}
            <div className="p-6">
              <div className="grid gap-6">
                {day.subjects.map((study) => (
                  <StudyCard
                    key={study.id}
                    study={study}
                    onMarkDone={onMarkDone}
                  />
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ListView;