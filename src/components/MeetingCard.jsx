import React from 'react';
import { Card, CardContent, Typography, Button, Stack } from '@mui/material';
import { Calendar, Clock } from 'lucide-react';
import { format, differenceInMinutes } from 'date-fns';

export const MeetingCard = ({ meeting, onReschedule, onCancel }) => {
  // Calculate duration in minutes
  const duration = differenceInMinutes(
    new Date(meeting.endTime),
    new Date(meeting.startTime)
  );

  return (
    <Card className="w-full max-w-md hover:shadow-lg transition-shadow duration-200">
      <CardContent>
        <Typography variant="h6" className="font-semibold mb-4">
          {meeting.title}
        </Typography>
        <Typography variant="h6" className="font-semibold mb-4">
          {meeting.description}
        </Typography>
        
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gray-500" />
            <Typography variant="body2">
              {format(new Date(meeting.startTime), 'MMMM d, yyyy')}
            </Typography>
          </div>
          
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-gray-500" />
            <Typography variant="body2">
              {format(new Date(meeting.startTime), 'h:mm a')} -{' '}
              {format(new Date(meeting.endTime), 'h:mm a')} ({duration} minutes)
            </Typography>
          </div>
        </div>
        
        <Stack direction="row" spacing={2} className="mt-4">
          <Button
            variant="outlined"
            color="primary"
            onClick={() => onReschedule(meeting)}
            className="flex-1"
          >
            Reschedule
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={() => onCancel(meeting)}
            className="flex-1"
          >
            Cancel
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};
