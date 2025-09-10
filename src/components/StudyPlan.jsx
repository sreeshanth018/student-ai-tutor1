import React, { useState, useEffect } from 'react';
import CalendarView from './CalendarView';
import ListView from './ListView';
import ProgressTracker from './ProgressTracker';
import ApiService from '../services/api';

const StudyPlan = () => {
  const [currentView, setCurrentView] = useState('list');
  const [studyData, setStudyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId] = useState('user123'); // In real app, get from auth context

  useEffect(() => {
    loadStudyPlan();
  }, []);

  const loadStudyPlan = async () => {
    try {
      setLoading(true);
      const data = await ApiService.getStudyPlan(userId);
      setStudyData(data.studyPlan || []);
      setError(null);
    } catch (err) {
      setError('Failed to load study plan');
      console.error('Error loading study plan:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkDone = async (topicId, completed) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      await ApiService.markProgress(userId, topicId, today, completed);
      
      // Update local state
      setStudyData(prevData => 
        prevData.map(day => ({
          ...day,
          subjects: day.subjects.map(subject => 
            subject.id === topicId 
              ? { ...subject, completed }
              : subject
          )
        }))
      );
    } catch (error) {
      console.error('Error updating progress:', error);
      // You could show a toast notification here
    }
  };

  const getViewIcon = (view) => {
    const icons = {
      list: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
        </svg>
      ),
      calendar: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      progress: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 00-2-2z" />
        </svg>
      )
    };
    return icons[view];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">Loading your study plan...</h2>
          <p className="text-gray-500 mt-2">Preparing your JEE & NEET preparation schedule</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Error Loading Study Plan</h2>
          <p className="text-gray-500 mb-4">{error}</p>
          <button 
            onClick={loadStudyPlan}
            className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-teal-500 to-teal-600 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Study Plan</h1>
                <p className="text-sm text-gray-600">JEE & NEET Preparation Schedule</p>
              </div>
            </div>
            
            {/* View Toggle */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              {['list', 'calendar', 'progress'].map((view) => (
                <button
                  key={view}
                  onClick={() => setCurrentView(view)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    currentView === view
                      ? 'bg-white text-teal-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {getViewIcon(view)}
                  <span className="capitalize">{view}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'list' && (
          <ListView studyData={studyData} onMarkDone={handleMarkDone} />
        )}
        
        {currentView === 'calendar' && (
          <CalendarView studyData={studyData} onMarkDone={handleMarkDone} />
        )}
        
        {currentView === 'progress' && (
          <ProgressTracker studyData={studyData} />
        )}
      </div>

      {/* Floating Action Button for Refresh */}
      <button
        onClick={loadStudyPlan}
        className="fixed bottom-6 right-6 p-4 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
        title="Refresh Study Plan"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </button>
    </div>
  );
};

export default StudyPlan;