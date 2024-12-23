import React from 'react';
import { Button, Grid, Typography } from '@mui/material';
import { format } from 'date-fns';

export const TimeSlotGrid = ({
  timeSlots,
  onSelectTimeSlot,
  selectedSlot, 
}) => {
  return (
    <Grid container spacing={2}>
      {timeSlots.map((slot, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <Button
            variant="outlined"
            fullWidth
            disabled={!slot.isAvailable || (selectedSlot && selectedSlot.startTime === slot.startTime)} // Disable the selected slot
            onClick={() => onSelectTimeSlot(slot)}
            className={`p-4 ${
              slot.isAvailable
                ? 'hover:bg-blue-50'
                : 'bg-gray-100 cursor-not-allowed'
            } ${selectedSlot && selectedSlot.startTime === slot.startTime ? 'bg-gray-300' : ''}`} // Change color of the selected slot
          >
            <div className="text-center">
              <Typography variant="subtitle1">
                {format(slot.startTime, 'h:mm a')}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                {slot.isAvailable ? 'Available' : 'Unavailable'}
              </Typography>
            </div>
          </Button>
        </Grid>
      ))}
    </Grid>
  );
};
