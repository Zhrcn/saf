'use client';

import React, { useState, useEffect } from 'react';
import { 
  Typography, Box, Grid, TextField, InputAdornment, Tabs, Tab, Card, CardContent,
  CardActions, Button, Avatar, Chip, Rating, CircularProgress, IconButton, Dialog,
  DialogTitle, DialogContent, DialogContentText, DialogActions, FormControl, InputLabel,
  Select, MenuItem, TextareaAutosize
} from '@mui/material';
import { 
  Search, MapPin, Phone, Mail, Award, Calendar, MessageCircle, 
  Clock, AlertCircle, Check, X
} from 'lucide-react';
import { PatientPageContainer } from '@/components/patient/PatientComponents';
import { useGetUsersQuery } from '@/store/services/user/userApi';
import { useRouter, usePathname } from 'next/navigation';
import PageHeader from '@/components/patient/PageHeader';

export default function ProvidersPage({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  const [searchTerm, setSearchTerm] = useState('');
  const [providers, setProviders] = useState({ doctors: [], pharmacists: [] });
  const [tabValue, setTabValue] = useState(0);
  
  const { data: users, isLoading: loadingProviders, error: providersError } = useGetUsersQuery();

  useEffect(() => {
    if (users) {
      const doctors = users.filter(user => user.role === 'doctor');
      const pharmacists = users.filter(user => user.role === 'pharmacist');
      setProviders({ doctors, pharmacists });
    }
    if (providersError) {
      console.error('Error loading providers:', providersError);
    }
  }, [users, providersError]);

  const loading = loadingProviders;
  const error = providersError;

  const [appointmentDialog, setAppointmentDialog] = useState(false);
  const [consultationDialog, setConsultationDialog] = useState(false);
  const [medicineDialog, setMedicineDialog] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);
  
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTimeSlot, setAppointmentTimeSlot] = useState('');
  const [appointmentReason, setAppointmentReason] = useState('');
  const [consultationReason, setConsultationReason] = useState('');
  const [preferredTime, setPreferredTime] = useState('');
  const [medicationName, setMedicationName] = useState('');
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [availabilityResult, setAvailabilityResult] = useState(null);
  
  const [appointmentSuccess, setAppointmentSuccess] = useState(false);
  const [consultationSuccess, setConsultationSuccess] = useState(false);

  const handleTabChange = (event, newValue) => {
    router.push(`/patient/providers/${newValue}`);
  };

  const currentTab = pathname.split('/').pop();

  const filteredProviders = currentTab === 'doctors' 
    ? providers.doctors.filter(provider =>
        provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        provider.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
        provider.hospital.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : providers.pharmacists.filter(provider =>
        provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        provider.pharmacy.toLowerCase().includes(searchTerm.toLowerCase())
      );

  const handleAppointmentOpen = (provider) => {
    setSelectedProvider(provider);
    setAppointmentDialog(true);
  };

  const handleConsultationOpen = (provider) => {
    setSelectedProvider(provider);
    setConsultationDialog(true);
  };

  const handleMedicineDialogOpen = (provider) => {
    setSelectedProvider(provider);
    setMedicineDialog(true);
    setAvailabilityResult(null);
  };

  const handleDialogClose = () => {
    setAppointmentDialog(false);
    setConsultationDialog(false);
    setMedicineDialog(false);
    setAppointmentDate('');
    setAppointmentTimeSlot('');
    setAppointmentReason('');
    setConsultationReason('');
    setPreferredTime('');
    setMedicationName('');
    setAvailabilityResult(null);
    setAppointmentSuccess(false);
    setConsultationSuccess(false);
  };

  const handleCheckAvailability = async () => {
    if (!medicationName.trim() || !selectedProvider) return;
    
    try {
      setCheckingAvailability(true);
      const result = await api.get(`/pharmacies/${selectedProvider.id}/availability`, { params: { medication: medicationName } });
      setAvailabilityResult(result);
    } catch (error) {
      console.error('Error checking medicine availability:', error);
    } finally {
      setCheckingAvailability(false);
    }
  };

  const handleScheduleAppointment = async () => {
    if (!appointmentTimeSlot || !appointmentReason || !selectedProvider) return;
    
    try {
      const appointment = {
        doctorId: selectedProvider.id,
        timeSlot: appointmentTimeSlot,
        reason: appointmentReason
      };
      
      await api.post('/appointments', appointment);
      setAppointmentSuccess(true);
      
      setTimeout(() => {
        handleDialogClose();
      }, 3000);
    } catch (error) {
      console.error('Error scheduling appointment:', error);
      setError('Failed to schedule appointment. Please try again later.');
    }
  };

  const handleRequestConsultation = async () => {
    if (!consultationReason || !preferredTime || !selectedProvider) return;
    
    try {
      await api.post('/consultations', {
        doctorId: selectedProvider.id,
        reason: consultationReason,
        preferredTime: preferredTime,
        attachments: []
      });
      
      setConsultationSuccess(true);
      
      setTimeout(() => {
        handleDialogClose();
        window.location.href = '/patient/consultations';
      }, 3000);
    } catch (error) {
      console.error('Error requesting consultation:', error);
      setError('Failed to request consultation. Please try again later.');
    }
  };

  const toggleDoctorAccess = async (doctorId, currentAccess) => {
    try {
      await api.patch(`/doctors/${doctorId}/access`, { hasAccess: !currentAccess });
      setProviders(prev => ({
        ...prev,
        doctors: prev.doctors.map(doctor => 
          doctor.id === doctorId 
            ? { ...doctor, hasAccess: !currentAccess } 
            : doctor
        )
      }));
    } catch (error) {
      console.error('Error updating doctor access:', error);
    }
  };

  const makePrimaryDoctor = async (doctorId) => {
    try {
      await api.patch(`/doctors/${doctorId}/primary`);
      
    } catch (error) {
      console.error('Error setting primary doctor:', error);
    }
  };

  return (
    <Box className="container mx-auto px-4 py-8">
      <PageHeader
        title="Healthcare Providers"
        description="Connect with doctors and pharmacists"
      />

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          aria-label="provider tabs"
        >
          <Tab
            label="Doctors"
            value="doctors"
            onClick={() => router.push('/patient/providers/doctors')}
          />
          <Tab
            label="Pharmacists"
            value="pharmacists"
            onClick={() => router.push('/patient/providers/pharmacists')}
          />
        </Tabs>
      </Box>

      {loading ? (
        <Box className="flex justify-center items-center h-64">
          <CircularProgress />
        </Box>
      ) : error ? (
        <Box className="flex justify-center items-center h-64">
          <Typography color="error">{error.message || 'An error occurred'}</Typography>
        </Box>
      ) : (
        <>
        <Box className="mb-6">
          <TextField
            fullWidth
            variant="outlined"
            size="medium"
              placeholder={currentTab === 'doctors' ? "Search doctors by name, specialty, or hospital..." : "Search pharmacists by name or pharmacy..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                    <Search size={20} className="text-muted-foreground" />
                </InputAdornment>
              ),
                className: 'text-foreground bg-background',
             }}
          />
        </Box>

          {filteredProviders.length === 0 ? (
            <Box className="text-center p-8 bg-muted rounded-lg">
              <AlertCircle size={48} className="mx-auto text-muted-foreground mb-4" />
              <Typography variant="h6" className="font-semibold">
                No providers found
              </Typography>
              <Typography variant="body2" component="div" className="text-muted-foreground">
                Try adjusting your search or browse all providers
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {filteredProviders.map((provider) => (
                <Grid item xs={12} md={6} lg={4} key={provider.id}>
                  {currentTab === 'doctors' ? (
                    <Card className="h-full flex flex-col border border-border bg-card hover:shadow-md transition-shadow">
                      <CardContent className="flex-1">
                        <Box className="flex items-start justify-between mb-4">
                          <Box className="flex items-center">
                            <Avatar 
                              src={provider.photo} 
                              alt={provider.name}
                              className="w-12 h-12 mr-3 bg-primary/10"
                            >
                              {provider.name.charAt(0)}
                            </Avatar>
                            <Box>
                              <Typography variant="h6" className="font-semibold">
                                {provider.name}
                              </Typography>
                              <Typography variant="body2" component="div" className="text-muted-foreground">
                                {provider.specialty}
                              </Typography>
                            </Box>
                          </Box>
                          <IconButton 
                            onClick={() => toggleDoctorAccess(provider.id, provider.hasAccess)}
                            color={provider.hasAccess ? "primary" : "default"}
                            className="h-8 w-8"
                            title={provider.hasAccess ? "Revoke access to medical files" : "Grant access to medical files"}
                          >
                            {provider.hasAccess ? <Check size={20} /> : <X size={20} />}
                          </IconButton>
                        </Box>
                        
                        <Box className="mb-4">
                          <Box className="flex items-center mb-2">
                            <MapPin size={16} className="mr-2 text-muted-foreground" />
                            <Typography variant="body2" component="span">{provider.hospital}</Typography>
                          </Box>
                          <Box className="flex items-center mb-2">
                            <Award size={16} className="mr-2 text-muted-foreground" />
                            <Typography variant="body2" component="span">{provider.yearsExperience} years experience</Typography>
                          </Box>
                          <Box className="flex items-center">
                            <Rating 
                              value={provider.rating} 
                              readOnly 
                              precision={0.1} 
                              size="small"
                            />
                            <Typography variant="body2" component="span" className="ml-1">
                              ({provider.rating})
                            </Typography>
                          </Box>
                        </Box>
                        
                        {provider.isPrimary && (
                          <Chip 
                            label="Primary Doctor" 
                            size="small" 
                            color="primary" 
                            className="mb-2"
                          />
                        )}
                      </CardContent>
                      <CardActions className="bg-muted/30 p-3 flex flex-wrap justify-between">
                        <Box className="flex flex-wrap gap-2 mb-2 w-full">
                          <Button 
                            size="small" 
                            variant="contained" 
                            startIcon={<Calendar size={16} />}
                            onClick={() => handleAppointmentOpen(provider)}
                            className="bg-primary text-primary-foreground flex-grow"
                          >
                            Schedule Appointment
                          </Button>
                          <Button 
                            size="small" 
                            variant="outlined" 
                            startIcon={<MessageCircle size={16} />}
                            onClick={() => handleConsultationOpen(provider)}
                            className="text-primary border-primary hover:bg-primary/10 flex-grow"
                          >
                            Request Consultation
                          </Button>
                        </Box>
                        <Box className="flex justify-between w-full">
                          <Button 
                            size="small" 
                            variant="text" 
                            startIcon={<MessageCircle size={16} />}
                            onClick={() => window.location.href = '/patient/messaging'}
                            className="text-muted-foreground hover:text-foreground"
                          >
                            Chat
                          </Button>
                          {!provider.isPrimary && (
                            <Button 
                              size="small" 
                              variant="text" 
                              onClick={() => makePrimaryDoctor(provider.id)}
                              className="text-muted-foreground hover:text-foreground"
                            >
                              Set as Primary
                            </Button>
                          )}
                        </Box>
                      </CardActions>
                    </Card>
                  ) : (
                    <Card className="h-full flex flex-col border border-border bg-card hover:shadow-md transition-shadow">
                      <CardContent className="flex-1">
                        <Box className="flex items-center mb-4">
                          <Avatar 
                            src={provider.photo} 
                            alt={provider.name}
                            className="w-12 h-12 mr-3 bg-green-100 text-green-600"
                          >
                            {provider.name.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography variant="h6" className="font-semibold">
                              {provider.name}
                            </Typography>
                            <Typography variant="body2" component="div" className="text-muted-foreground">
                              {provider.pharmacy}
                            </Typography>
                          </Box>
                        </Box>
                        
                        <Box className="mb-4">
                          <Box className="flex items-center mb-2">
                            <Phone size={16} className="mr-2 text-muted-foreground" />
                            <Typography variant="body2" component="span">+963 11 123 4567</Typography>
                          </Box>
                          <Box className="flex items-center mb-2">
                            <Mail size={16} className="mr-2 text-muted-foreground" />
                            <Typography variant="body2" component="span">contact@{provider.pharmacy.toLowerCase().replace(/\s+/g, '')}.sy</Typography>
                          </Box>
                          <Box className="flex items-center">
                            <Rating 
                              value={provider.rating} 
                              readOnly 
                              precision={0.1} 
                              size="small"
                            />
                            <Typography variant="body2" component="span" className="ml-1">
                              ({provider.rating})
                            </Typography>
                          </Box>
                          <Box className="flex items-center mt-2">
                            <Award size={16} className="mr-2 text-muted-foreground" />
                            <Typography variant="body2" component="span">{provider.yearsExperience} years experience</Typography>
                          </Box>
                        </Box>
                      </CardContent>
                      <CardActions className="bg-muted/30 p-3">
                        <Button 
                          size="small" 
                          variant="outlined" 
                          startIcon={<MessageCircle size={16} />}
                          className="mr-2"
                          onClick={() => window.location.href = '/patient/messaging'}
                        >
                          Chat
                        </Button>
                        <Button 
                          size="small" 
                          variant="outlined" 
                          startIcon={<Search size={16} />}
                          onClick={() => handleMedicineDialogOpen(provider)}
                        >
                          Check Availability
                        </Button>
                      </CardActions>
                    </Card>
                  )}
                </Grid>
              ))}
            </Grid>
          )}
          
          <Dialog 
            open={appointmentDialog} 
            onClose={handleDialogClose}
            fullWidth
            maxWidth="sm"
          >
            <DialogTitle className="bg-primary text-primary-foreground">
              Schedule Appointment with {selectedProvider?.name}
            </DialogTitle>
            <DialogContent className="mt-4">
              {appointmentSuccess ? (
                <Box className="text-center py-6">
                  <Check size={48} className="mx-auto text-green-500 mb-2" />
                  <Typography variant="h6" className="font-semibold">
                    Appointment Scheduled!
                  </Typography>
                  <Typography variant="body1">
                    Your appointment has been successfully scheduled.
                  </Typography>
                </Box>
              ) : (
                <>
                  <DialogContentText className="mb-4">
                    Please select a time slot and provide a reason for your appointment with {selectedProvider?.name}.
                  </DialogContentText>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <FormControl fullWidth className="mb-4">
                        <InputLabel id="appointment-time-slot-label">Time Slot</InputLabel>
                        <Select
                          labelId="appointment-time-slot-label"
                          value={appointmentTimeSlot}
                          onChange={(e) => setAppointmentTimeSlot(e.target.value)}
                          label="Time Slot"
                        >
                          <MenuItem value="morning">Morning (9:00 AM)</MenuItem>
                          <MenuItem value="afternoon">Afternoon (1:00 PM)</MenuItem>
                          <MenuItem value="evening">Evening (6:00 PM)</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Reason for Visit"
                        multiline
                        rows={3}
                        value={appointmentReason}
                        onChange={(e) => setAppointmentReason(e.target.value)}
                        className="mb-2"
                      />
                    </Grid>
                  </Grid>
                </>
              )}
            </DialogContent>
            <DialogActions className="bg-muted/30 p-3">
              {!appointmentSuccess && (
                <>
                  <Button 
                    onClick={handleDialogClose} 
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleScheduleAppointment} 
                    variant="contained"
                    disabled={!appointmentTimeSlot || !appointmentReason}
                    className="bg-primary text-primary-foreground"
                  >
                    Schedule Appointment
                  </Button>
                </>
              )}
            </DialogActions>
          </Dialog>
          
          <Dialog 
            open={consultationDialog} 
            onClose={handleDialogClose}
            fullWidth
            maxWidth="sm"
          >
            <DialogTitle className="bg-primary text-primary-foreground">
              Request Medical Consultation with {selectedProvider?.name}
            </DialogTitle>
            <DialogContent className="mt-4">
              {consultationSuccess ? (
                <Box className="text-center py-6">
                  <Check size={48} className="mx-auto text-green-500 mb-2" />
                  <Typography variant="h6" className="font-semibold">
                    Consultation Requested!
                  </Typography>
                  <Typography variant="body1">
                    Your consultation request has been sent successfully.
                  </Typography>
                </Box>
              ) : (
                <>
                  <DialogContentText className="mb-4">
                    Please provide details for your medical consultation request.
                  </DialogContentText>
                  <TextField
                    fullWidth
                    label="Reason for Consultation"
                    multiline
                    rows={4}
                    value={consultationReason}
                    onChange={(e) => setConsultationReason(e.target.value)}
                    className="mb-4"
                  />
                  <FormControl fullWidth className="mb-2">
                    <InputLabel>Preferred Time</InputLabel>
                    <Select
                      value={preferredTime}
                      onChange={(e) => setPreferredTime(e.target.value)}
                      label="Preferred Time"
                    >
                      <MenuItem value="Morning (8AM-12PM)">Morning (8AM-12PM)</MenuItem>
                      <MenuItem value="Afternoon (12PM-4PM)">Afternoon (12PM-4PM)</MenuItem>
                      <MenuItem value="Evening (4PM-8PM)">Evening (4PM-8PM)</MenuItem>
                    </Select>
                  </FormControl>
                </>
              )}
            </DialogContent>
            <DialogActions className="bg-muted/30 p-3">
              {!consultationSuccess && (
                <>
                  <Button 
                    onClick={handleDialogClose} 
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleRequestConsultation} 
                    variant="contained"
                    disabled={!consultationReason || !preferredTime}
                    className="bg-primary text-primary-foreground"
                  >
                    Send Request
                  </Button>
                </>
              )}
            </DialogActions>
          </Dialog>
          
          {/* Medicine Availability Dialog */}
          <Dialog 
            open={medicineDialog} 
            onClose={handleDialogClose}
            fullWidth
            maxWidth="sm"
          >
            <DialogTitle className="bg-primary text-primary-foreground">
              Check Medicine Availability at {selectedProvider?.pharmacy}
            </DialogTitle>
            <DialogContent className="mt-4">
              <DialogContentText className="mb-4">
                Enter the name of the medication you want to check availability for.
              </DialogContentText>
              <Box className="flex mb-4">
                <TextField
                  fullWidth
                  label="Medication Name"
                  value={medicationName}
                  onChange={(e) => setMedicationName(e.target.value)}
                  className="mr-2"
                />
                <Button 
                  variant="contained"
                  onClick={handleCheckAvailability}
                  disabled={!medicationName.trim() || checkingAvailability}
                  className="bg-primary text-primary-foreground whitespace-nowrap"
                >
                  {checkingAvailability ? (
                    <CircularProgress size={24} className="text-primary-foreground" />
                  ) : (
                    'Check'
                  )}
                </Button>
              </Box>

              {availabilityResult && (
                <Box className={`p-4 rounded-md ${availabilityResult.isAvailable ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                  <Box className="flex items-center mb-2">
                    {availabilityResult.isAvailable ? (
                      <Check className="mr-2 text-green-500" />
                    ) : (
                      <X className="mr-2 text-red-500" />
                    )}
                    <Typography variant="h6" className={availabilityResult.isAvailable ? 'text-green-700' : 'text-red-700'}>
                      {availabilityResult.isAvailable ? 'Available' : 'Not Available'}
                    </Typography>
                  </Box>
                  <Typography variant="body1" className={availabilityResult.isAvailable ? 'text-green-600' : 'text-red-600'}>
                    {availabilityResult.medication} is {availabilityResult.isAvailable ? 'in stock' : 'out of stock'} at {availabilityResult.pharmacy}.
                  </Typography>
                  {availabilityResult.isAvailable && (
                    <Typography variant="body2" component="div" className="mt-1 flex items-center text-green-600">
                      <Clock size={16} className="mr-1" /> 
                      Current stock: {availabilityResult.quantity} units
                    </Typography>
                  )}
                </Box>
              )}
            </DialogContent>
            <DialogActions className="bg-muted/30 p-3">
              <Button 
                onClick={handleDialogClose} 
                className="text-muted-foreground hover:text-foreground"
              >
                Close
              </Button>
              {availabilityResult && availabilityResult.isAvailable && (
                <Button 
                  variant="contained"
                  className="bg-primary text-primary-foreground"
                  onClick={() => window.location.href = '/patient/messaging'}
                >
                  Message Pharmacy
                </Button>
              )}
            </DialogActions>
          </Dialog>
        </>
      )}
    </Box>
  );
} 