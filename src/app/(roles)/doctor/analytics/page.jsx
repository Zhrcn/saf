'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
} from '@mui/material';
import PatientAnalytics from '@/components/doctor/PatientAnalytics';

export default function AnalyticsPage() {
  return (
    <Box className="p-6">
      <Box className="mb-6">
        <Typography variant="h4" component="h1" className="font-bold text-foreground">
          Patient Analytics
        </Typography>
        <Typography variant="body1" className="text-muted-foreground">
          View analytics and statistics about your patients, appointments, and prescriptions.
        </Typography>
      </Box>
      
      <PatientAnalytics />
    </Box>
  );
} 