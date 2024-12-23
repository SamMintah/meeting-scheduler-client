import React, { useMemo } from 'react';
import { Typography } from '@mui/material';
import { TimeSlotGrid } from './TimeSlotGrid';
import { format } from 'date-fns';

export const AvailabilitySelector = ({
  selectedDate,
  availableSlots, 
  onTimeSlotSelect,
}) => {
  const timeSlots = useMemo(() => {
    return availableSlots.map((slot) => {
      const { startTime, endTime } = slot;
      return {
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        isAvailable: true, 
      };
    });
  }, [availableSlots]);

  return (
    <div className="w-full">
      <Typography variant="h6" className="mb-4">
        Available Time Slots for {format(selectedDate, 'MMMM d, yyyy')}
      </Typography>
      <TimeSlotGrid
        timeSlots={timeSlots}
        onSelectTimeSlot={onTimeSlotSelect}
      />
    </div>
  );
};
