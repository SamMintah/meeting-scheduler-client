import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Tab, Tabs } from '@mui/material';
import { Calendar as CalendarIcon, List, Plus } from 'lucide-react';
import axios from 'axios';
import { MeetingCard } from './components/MeetingCard';
import { SchedulingForm } from './components/SchedulingForm';

function App() {
  const [activeTab, setActiveTab] = useState(0);
  const [showSchedulingForm, setShowSchedulingForm] = useState(false);
  const [meetings, setMeetings] = useState([]);
  const [editingMeeting, setEditingMeeting] = useState(null);

  const API_URL = 'http://localhost:3000';

  // Fetch meetings from backend when component mounts
  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/users/1/meetings`);
        console.log('Fetched meetings:', response.data);
        setMeetings(response.data.data);
      } catch (error) {
        console.error('Error fetching meetings:', error);
      }
    };

    fetchMeetings();
  }, []);

  const handleScheduleMeeting = async (meetingData) => {
    try {
      const payload = {
        userId: 1,
        title: meetingData.title,
        description: meetingData.description,
        startTime: meetingData.startTime,
        endTime: meetingData.endTime,
        participants: meetingData.participants,
      };
  
      const url = editingMeeting 
        ? `${API_URL}/api/meetings/${editingMeeting.id}`
        : `${API_URL}/api/meetings`;
      
      console.log("url", url);
      console.log("payload", payload);
      
      const response = await axios({
        method: editingMeeting ? 'put' : 'post',
        url,
        data: payload,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log("response", response.data);
      if (response.status === 200 || response.status === 201) {
        // Only update the meetings list after a successful response
        setMeetings(prev => 
          editingMeeting
            ? prev.map(meeting => meeting.id === editingMeeting.id ? response.data : meeting)
            : [...prev, response.data]
        );
        setShowSchedulingForm(false);
        setEditingMeeting(null);
        alert('Meeting ' + (editingMeeting ? 'updated' : 'scheduled') + ' successfully');
      }
    } catch (error) {
      // Handle conflict error after all operations are done
      console.log(error)
      if (error.response?.status === 409) {
        alert('This time slot conflicts with another meeting');
      } else {
        alert('Error ' + (editingMeeting ? 'updating' : 'scheduling') + ' meeting');
      }
      console.error('Error:', error);
    }
  };

  const handleRescheduleMeeting = (meeting) => {
    setEditingMeeting(meeting);
    setShowSchedulingForm(true);
  };

  const handleCancelMeeting = (meeting) => {
    // DELETE request to cancel a meeting
    axios
      .delete(`${API_URL}/api/meetings/${meeting.id}`)
      .then(() => {
        // Update meetings list by removing the canceled meeting
        setMeetings((prevMeetings) =>
          prevMeetings.filter((m) => m.id !== meeting.id)
        );
      })
      .catch((error) => {
        console.error('Error deleting meeting:', error);
      });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Container maxWidth="lg" className="py-8">
        <Box className="flex justify-between items-center mb-8">
          <Typography variant="h4" component="h1" className="font-bold">
            Meeting Scheduler
          </Typography>
          {!showSchedulingForm && (
            <button
              onClick={() => setShowSchedulingForm(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Schedule Meeting
            </button>
          )}
        </Box>

        {showSchedulingForm ? (
          <Box className="bg-white p-6 rounded-lg shadow-md">
            <Typography variant="h5" className="mb-6">
              {editingMeeting ? 'Reschedule Meeting' : 'Schedule New Meeting'}
            </Typography>
            <SchedulingForm
              onSubmit={handleScheduleMeeting}
              initialData={editingMeeting}
            />
          </Box>
        ) : (
          <>
            <Tabs
              value={activeTab}
              onChange={(_, newValue) => setActiveTab(newValue)}
              className="mb-6"
            >
              <Tab
                icon={<List className="w-5 h-5" />}
                label="List View"
                iconPosition="start"
              />
              <Tab
                icon={<CalendarIcon className="w-5 h-5" />}
                label="Calendar View"
                iconPosition="start"
              />
            </Tabs>

            <div className="grid gap-6">
              {meetings.length > 0 ? (
                meetings.map((meeting) => (
                  <MeetingCard
                    key={meeting.id}
                    meeting={meeting}
                    onReschedule={handleRescheduleMeeting}
                    onCancel={handleCancelMeeting}
                  />
                ))
              ) : (
                <div>No meetings found</div>
              )}
            </div>
          </>
        )}
      </Container>
    </div>
  );
}

export default App;
