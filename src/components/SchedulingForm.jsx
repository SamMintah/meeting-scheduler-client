import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  TextField,
  Button,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { AvailabilitySelector } from './AvailabilitySelector';
import { format } from 'date-fns';

export const SchedulingForm = ({ onSubmit, initialData }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    date: initialData?.startTime ? new Date(initialData.startTime) : null,
    duration: initialData?.duration || 30,
    participantsEmails: initialData?.participants?.join(', ') || '',
    availableSlots: [],
    selectedSlot: initialData
      ? {
          startTime: new Date(initialData.startTime),
          endTime: new Date(initialData.endTime)
        }
      : null
  });

  useEffect(() => {
    if (formData.date) {
      fetchAvailableSlots(formData.date);
    }
  }, [formData.date]);

  const fetchAvailableSlots = async (date) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/users/1/available-slots?date=${
          date.toISOString().split('T')[0]
        }`
      );
      if (response.data.message === 'available time fetched successfully') {
        setFormData((prev) => ({
          ...prev,
          availableSlots: response.data.data
        }));
      }
    } catch (error) {
      console.error('Error fetching available slots:', error);
    }
  };
  // Handle the change in the email input
  const handleEmailChange = (e) => {
    setFormData({ ...formData, participantsEmails: e.target.value });
  };
  const handleTimeSlotSelect = (slot) => {
    setFormData((prev) => ({
      ...prev,
      selectedSlot: slot
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    const { selectedSlot, title, description, participantsEmails } = formData;

    if (!selectedSlot || !selectedSlot.startTime || !selectedSlot.endTime) {
      alert('Please select a valid time slot.');
      return;
    }

    const meetingData = {
      title,
      description,
      startTime: new Date(selectedSlot.startTime).toISOString(),
      endTime: new Date(selectedSlot.endTime).toISOString(),
      participants: participantsEmails.split(',').map((email) => email.trim())
    };

    setIsSubmitting(true);

    try {
      onSubmit(meetingData); 
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <form onSubmit={handleSubmit} className="w-full max-w-4xl">
        <Stack spacing={3}>
          <TextField
            label="Meeting Title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            required
            fullWidth
          />

          <TextField
            label="Description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            multiline
            rows={4}
            fullWidth
          />

          <DatePicker
            label="Date"
            value={formData.date}
            onChange={(date) => setFormData({ ...formData, date })}
            disablePast
          />

          {formData.date && (
            <AvailabilitySelector
              selectedDate={formData.date}
              availableSlots={formData.availableSlots}
              onTimeSlotSelect={handleTimeSlotSelect}
            />
          )}
          {formData.selectedSlot && (
            <Typography variant="h6" className="mt-4">
              Selected Time: {format(formData.selectedSlot.startTime, 'h:mm a')}
            </Typography>
          )}

          <FormControl fullWidth>
            <InputLabel>Duration</InputLabel>
            <Select
              value={formData.duration}
              label="Duration"
              onChange={(e) =>
                setFormData({ ...formData, duration: e.target.value })
              }
            >
              <MenuItem value={15}>15 minutes</MenuItem>
              <MenuItem value={30}>30 minutes</MenuItem>
              <MenuItem value={45}>45 minutes</MenuItem>
              <MenuItem value={60}>1 hour</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Participants Emails (comma separated)"
            type="text"
            value={formData.participantsEmails}
            onChange={handleEmailChange}
            required
            fullWidth
            helperText="Enter participant emails, separated by commas"
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            className="mt-4"
          >
            {initialData ? 'Update Meeting' : 'Schedule Meeting'}
          </Button>
        </Stack>
      </form>
    </LocalizationProvider>
  );
};
