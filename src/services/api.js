// API service for Study Plan backend calls

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class ApiService {
  async getStudyPlan(userId) {
    try {
      const response = await fetch(`${API_BASE_URL}/study-plan/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch study plan');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching study plan:', error);
      // Return mock data for demo purposes
      return this.getMockStudyPlan();
    }
  }

  async markProgress(userId, topicId, date, completed = true) {
    try {
      const response = await fetch(`${API_BASE_URL}/progress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          topicId,
          date,
          completed,
          timestamp: new Date().toISOString(),
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update progress');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating progress:', error);
      // Return success for demo purposes
      return { success: true, message: 'Progress updated successfully' };
    }
  }

  getMockStudyPlan() {
    const today = new Date();
    const dates = [];
    
    // Generate 7 days of study plan
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }

    return {
      userId: 'user123',
      studyPlan: dates.map((date, index) => ({
        date,
        subjects: [
          {
            id: `physics_${date}`,
            subject: 'Physics',
            topic: index % 2 === 0 ? 'Mechanics - Motion in Straight Line' : 'Thermodynamics - Laws of Thermodynamics',
            duration: '2 hours',
            timeSlot: '09:00 - 11:00',
            completed: false,
            difficulty: index % 3 === 0 ? 'Hard' : index % 2 === 0 ? 'Medium' : 'Easy',
            examType: 'JEE'
          },
          {
            id: `chemistry_${date}`,
            subject: 'Chemistry',
            topic: index % 2 === 0 ? 'Organic Chemistry - Hydrocarbons' : 'Physical Chemistry - Atomic Structure',
            duration: '1.5 hours',
            timeSlot: '11:30 - 13:00',
            completed: false,
            difficulty: index % 3 === 0 ? 'Medium' : 'Hard',
            examType: 'JEE'
          },
          {
            id: `biology_${date}`,
            subject: 'Biology',
            topic: index % 2 === 0 ? 'Human Physiology - Circulatory System' : 'Plant Physiology - Photosynthesis',
            duration: '2 hours',
            timeSlot: '14:00 - 16:00',
            completed: false,
            difficulty: 'Medium',
            examType: 'NEET'
          },
          {
            id: `mathematics_${date}`,
            subject: 'Mathematics',
            topic: index % 2 === 0 ? 'Calculus - Differentiation' : 'Algebra - Quadratic Equations',
            duration: '1.5 hours',
            timeSlot: '16:30 - 18:00',
            completed: false,
            difficulty: index % 3 === 0 ? 'Hard' : 'Medium',
            examType: 'JEE'
          }
        ]
      }))
    };
  }
}

export default new ApiService();