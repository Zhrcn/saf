'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
    Typography, Box, TextField, InputAdornment, Avatar,
    CircularProgress, Chip, Fade, Paper, Divider,
    Grid, Card, CardContent, List, ListItem, ListItemText,
    Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Stack,
    Tabs, Tab, Button, Alert
} from '@mui/material';
import {
    User, Mail, Phone, Home, CalendarDays, FileText, HeartPulse,
    DropletIcon, Edit, Save, X, AlertCircle, Check, MapPin,
    Shield, Stethoscope, Pill, Clock, BarChart3, ChevronRight,
    History, FileImage, Download, FilePlus2
} from 'lucide-react';
import { PatientPageContainer } from '@/components/patient/PatientComponents';
import CardComponent from '@/components/ui/Card';
import PageHeader from '@/components/patient/PageHeader';
import FormLayout from '@/components/patient/FormLayout';
import LoadingState from '@/components/patient/LoadingState';
import ErrorState from '@/components/patient/ErrorState';
import { useNotification } from '@/components/ui/Notification';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPatientProfile, updatePatientProfile } from '@/store/slices/patient/profileSlice';
import AddAllergyDialog from '@/components/patient/medical-file/AddAllergyDialog';
import AddChronicConditionDialog from '@/components/patient/medical-file/AddChronicConditionDialog';
import AddMedicationDialog from '@/components/patient/medical-file/AddMedicationDialog';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { useGetProfileQuery, useUpdateProfileMutation } from '@/store/services/patient/patientApi';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

function PatientProfilePage() {
    const dispatch = useDispatch();
    const { profile, loading, error } = useSelector((state) => state.patient);
    const { showNotification } = useNotification();
    const [editMode, setEditMode] = useState(false);
    const [saving, setSaving] = useState(false);
    const [activeSection, setActiveSection] = useState('personal');
    
    // Dialog states
    const [allergyDialogOpen, setAllergyDialogOpen] = useState(false);
    const [chronicConditionDialogOpen, setChronicConditionDialogOpen] = useState(false);
    const [medicationDialogOpen, setMedicationDialogOpen] = useState(false);
    
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        address: {
            street: '',
            city: '',
            state: '',
            zipCode: '',
            country: '',
        },
    });

    const [emergencyContactData, setEmergencyContactData] = useState({
        name: '',
        relationship: '',
        phone: '',
        email: '',
    });

    const [insuranceData, setInsuranceData] = useState({
        provider: '',
        policyNumber: '',
        groupNumber: '',
        expiryDate: '',
    });

    const initializedProfileData = useRef(false);

    // State for Medical File Tabs
    const [medicalTabValue, setMedicalTabValue] = useState(0);
    const medicalRecordCategories = [
        { id: 0, label: 'Vital Signs', icon: HeartPulse },
        { id: 1, label: 'Allergies', icon: DropletIcon },
        { id: 2, label: 'Chronic Conditions', icon: Stethoscope },
        { id: 3, label: 'Diagnoses', icon: HeartPulse },
        { id: 4, label: 'Lab Results', icon: BarChart3 },
        { id: 5, label: 'Imaging Reports', icon: FileImage },
        { id: 6, label: 'Medications', icon: Pill },
        { id: 7, label: 'Immunizations', icon: Shield },
        { id: 8, label: 'Surgical History', icon: History },
        { id: 9, label: 'Documents', icon: FileText },
        { id: 10, label: 'Family History', icon: User },
        { id: 11, label: 'Social History', icon: Home },
        { id: 12, label: 'General History', icon: CalendarDays },
    ];

    // State for PDF Viewer
    const [pdfDialogOpen, setPdfDialogOpen] = useState(false);
    const [selectedPdf, setSelectedPdf] = useState(null);
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [scale, setScale] = useState(1.2);

    const { data: profileData, isLoading, error: apiError } = useGetProfileQuery();
    const [updateProfile] = useUpdateProfileMutation();

    useEffect(() => {
        if (!initializedProfileData.current && !loading && !error && profileData) {
            setFormData({
                firstName: profileData.firstName || '',
                lastName: profileData.lastName || '',
                email: profileData.email || '',
                phoneNumber: profileData.phoneNumber || '',
                address: profileData.address || {
                    street: '',
                    city: '',
                    state: '',
                    zipCode: '',
                    country: '',
                },
            });
            setEmergencyContactData(profileData.emergencyContact || {
                name: '',
                relationship: '',
                phone: '',
                email: '',
            });
            setInsuranceData(profileData.insuranceDetails || {
                provider: '',
                policyNumber: '',
                groupNumber: '',
                expiryDate: '',
            });
            initializedProfileData.current = true;
        }
    }, [loading, error, profileData]);

    const handleRefresh = () => {
        dispatch(fetchPatientProfile());
    };

    const handleEditToggle = () => {
        if (editMode) {
            setFormData({
                firstName: profileData?.firstName || '',
                lastName: profileData?.lastName || '',
                email: profileData?.email || '',
                phoneNumber: profileData?.phoneNumber || '',
                address: profileData?.address || {},
            });
        }
        setEditMode(!editMode);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('address.')) {
            const addressField = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                address: {
                    ...prev.address,
                    [addressField]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleEmergencyContactChange = (e) => {
        const { name, value } = e.target;
        setEmergencyContactData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleInsuranceChange = (e) => {
        const { name, value } = e.target;
        setInsuranceData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = async () => {
        if (!isFormValid()) {
            showNotification('Please fill in all required fields', 'error');
            return;
        }

        setSaving(true);
        try {
            await updateProfile({
                ...formData,
                emergencyContact: emergencyContactData,
                insuranceDetails: insuranceData
            }).unwrap();
            showNotification('Profile updated successfully', 'success');
            setEditMode(false);
        } catch (error) {
            showNotification(error.message || 'Failed to update profile', 'error');
        } finally {
            setSaving(false);
        }
    };

    const isFormValid = () => {
        return formData.firstName && formData.lastName && formData.email && formData.phoneNumber;
    };

    const getStatusText = (loadingState, errorState) => {
        if (loadingState) return 'Loading...';
        if (errorState) return 'Error loading data';
        return '';
    };

    const handleMedicalTabChange = (event, newValue) => {
        setMedicalTabValue(newValue);
    };

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
    };

    const changePage = (offset) => {
        setPageNumber(prevPageNumber => prevPageNumber + offset);
    };

    const previousPage = () => changePage(-1);
    const nextPage = () => changePage(1);

    const handlePdfOpen = (document) => {
        setSelectedPdf(document);
        setPdfDialogOpen(true);
    };

    const handlePdfClose = () => {
        setPdfDialogOpen(false);
        setSelectedPdf(null);
        setPageNumber(1);
    };

    const renderProfileHeader = () => (
        <Box sx={{ mb: 4 }}>
            <Grid container spacing={2} alignItems="center">
                <Grid item>
                    <Avatar
                        sx={{ width: 100, height: 100 }}
                        src={profileData?.profilePicture}
                    />
                </Grid>
                <Grid item xs>
                    <Typography variant="h4" gutterBottom>
                        {profileData?.firstName} {profileData?.lastName}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        {profileData?.email}
                    </Typography>
                </Grid>
                <Grid item>
                    <Button
                        variant={editMode ? "contained" : "outlined"}
                        onClick={handleEditToggle}
                        startIcon={editMode ? <Save /> : <Edit />}
                    >
                        {editMode ? 'Save Changes' : 'Edit Profile'}
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );

    const renderNavigation = () => (
        <Box sx={{ mb: 4 }}>
            <Tabs
                value={activeSection}
                onChange={(e, newValue) => setActiveSection(newValue)}
                variant="scrollable"
                scrollButtons="auto"
            >
                <Tab
                    value="personal"
                    label="Personal Information"
                    icon={<User size={20} />}
                    iconPosition="start"
                />
                <Tab
                    value="medical"
                    label="Medical Information"
                    icon={<HeartPulse size={20} />}
                    iconPosition="start"
                />
                <Tab
                    value="insurance"
                    label="Insurance"
                    icon={<Shield size={20} />}
                    iconPosition="start"
                />
                <Tab
                    value="emergency"
                    label="Emergency Contact"
                    icon={<AlertCircle size={20} />}
                    iconPosition="start"
                />
            </Tabs>
        </Box>
    );

    const renderPersonalInfo = () => (
        <FormLayout>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="First Name"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        disabled={!editMode}
                        required
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Last Name"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        disabled={!editMode}
                        required
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled={!editMode}
                        required
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Phone Number"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        disabled={!editMode}
                        required
                    />
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>
                        Address
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Street Address"
                        name="address.street"
                        value={formData.address.street}
                        onChange={handleInputChange}
                        disabled={!editMode}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="City"
                        name="address.city"
                        value={formData.address.city}
                        onChange={handleInputChange}
                        disabled={!editMode}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="State"
                        name="address.state"
                        value={formData.address.state}
                        onChange={handleInputChange}
                        disabled={!editMode}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="ZIP Code"
                        name="address.zipCode"
                        value={formData.address.zipCode}
                        onChange={handleInputChange}
                        disabled={!editMode}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Country"
                        name="address.country"
                        value={formData.address.country}
                        onChange={handleInputChange}
                        disabled={!editMode}
                    />
                </Grid>
            </Grid>
        </FormLayout>
    );

    const renderMedicalInfo = () => {
        const renderTabContent = () => {
            switch (medicalTabValue) {
                case 1: // Allergies
                    return (
                        <Box>
                            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
                                <Button
                                    variant="contained"
                                    startIcon={<FilePlus2 />}
                                    onClick={() => setAllergyDialogOpen(true)}
                                >
                                    Add Allergy
                                </Button>
                            </Box>
                            <List>
                                {profileData?.allergies?.map((allergy, index) => (
                                    <ListItem key={index}>
                                        <ListItemText
                                            primary={allergy.name}
                                            secondary={`Severity: ${allergy.severity}${allergy.notes ? ` - ${allergy.notes}` : ''}`}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </Box>
                    );
                case 2: // Chronic Conditions
                    return (
                        <Box>
                            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
                                <Button
                                    variant="contained"
                                    startIcon={<FilePlus2 />}
                                    onClick={() => setChronicConditionDialogOpen(true)}
                                >
                                    Add Condition
                                </Button>
                            </Box>
                            <List>
                                {profileData?.chronicConditions?.map((condition, index) => (
                                    <ListItem key={index}>
                                        <ListItemText
                                            primary={condition.name}
                                            secondary={`Diagnosed: ${new Date(condition.diagnosisDate).toLocaleDateString()} - Status: ${condition.status}${condition.notes ? ` - ${condition.notes}` : ''}`}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </Box>
                    );
                case 6: // Medications
                    return (
                        <Box>
                            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
                                <Button
                                    variant="contained"
                                    startIcon={<FilePlus2 />}
                                    onClick={() => setMedicationDialogOpen(true)}
                                >
                                    Add Medication
                                </Button>
                            </Box>
                            <List>
                                {profileData?.medications?.map((medication, index) => (
                                    <ListItem key={index}>
                                        <ListItemText
                                            primary={medication.name}
                                            secondary={`${medication.dosage} - ${medication.frequency} - Prescribed by: ${medication.prescribedBy}${medication.notes ? ` - ${medication.notes}` : ''}`}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </Box>
                    );
                default:
                    return (
                        <Box sx={{ p: 2 }}>
                            <Typography variant="body1" color="text.secondary">
                                Select a category to view details
                            </Typography>
                        </Box>
                    );
            }
        };

        return (
            <Box>
                <Tabs
                    value={medicalTabValue}
                    onChange={handleMedicalTabChange}
                    variant="scrollable"
                    scrollButtons="auto"
                >
                    {medicalRecordCategories.map((category) => (
                        <Tab
                            key={category.id}
                            icon={<category.icon size={20} />}
                            label={category.label}
                            iconPosition="start"
                        />
                    ))}
                </Tabs>
                <Box sx={{ mt: 2 }}>
                    {renderTabContent()}
                </Box>
            </Box>
        );
    };

    const renderInsuranceInfo = () => (
        <FormLayout>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Insurance Provider"
                        name="provider"
                        value={insuranceData.provider}
                        onChange={handleInsuranceChange}
                        disabled={!editMode}
                        required
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Policy Number"
                        name="policyNumber"
                        value={insuranceData.policyNumber}
                        onChange={handleInsuranceChange}
                        disabled={!editMode}
                        required
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Group Number"
                        name="groupNumber"
                        value={insuranceData.groupNumber}
                        onChange={handleInsuranceChange}
                        disabled={!editMode}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Expiry Date"
                        name="expiryDate"
                        type="date"
                        value={insuranceData.expiryDate}
                        onChange={handleInsuranceChange}
                        disabled={!editMode}
                        required
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </Grid>
            </Grid>
        </FormLayout>
    );

    const renderEmergencyContact = () => (
        <FormLayout>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Contact Name"
                        name="name"
                        value={emergencyContactData.name}
                        onChange={handleEmergencyContactChange}
                        disabled={!editMode}
                        required
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Relationship"
                        name="relationship"
                        value={emergencyContactData.relationship}
                        onChange={handleEmergencyContactChange}
                        disabled={!editMode}
                        required
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Phone Number"
                        name="phone"
                        value={emergencyContactData.phone}
                        onChange={handleEmergencyContactChange}
                        disabled={!editMode}
                        required
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        type="email"
                        value={emergencyContactData.email}
                        onChange={handleEmergencyContactChange}
                        disabled={!editMode}
                    />
                </Grid>
            </Grid>
        </FormLayout>
    );

    const renderContent = () => {
        if (isLoading) {
            return <LoadingState />;
        }

        if (apiError) {
            return <ErrorState message={apiError.data?.message || 'Failed to load profile'} onRetry={handleRefresh} />;
        }

        return (
            <Box>
                {renderProfileHeader()}
                {renderNavigation()}
                <Box sx={{ mt: 4 }}>
                    {activeSection === 'personal' && renderPersonalInfo()}
                    {activeSection === 'medical' && renderMedicalInfo()}
                    {activeSection === 'insurance' && renderInsuranceInfo()}
                    {activeSection === 'emergency' && renderEmergencyContact()}
                </Box>
            </Box>
        );
    };

    return (
        <PatientPageContainer>
            {renderContent()}
            
            {/* Dialogs */}
            <AddAllergyDialog
                open={allergyDialogOpen}
                onClose={() => setAllergyDialogOpen(false)}
            />
            <AddChronicConditionDialog
                open={chronicConditionDialogOpen}
                onClose={() => setChronicConditionDialogOpen(false)}
            />
            <AddMedicationDialog
                open={medicationDialogOpen}
                onClose={() => setMedicationDialogOpen(false)}
            />
            
            {/* PDF Viewer Dialog */}
            <Dialog
                open={pdfDialogOpen}
                onClose={handlePdfClose}
                maxWidth="lg"
                fullWidth
            >
                <DialogTitle>
                    {selectedPdf?.name}
                    <IconButton
                        onClick={handlePdfClose}
                        sx={{ position: 'absolute', right: 8, top: 8 }}
                    >
                        <X />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                        <Button onClick={previousPage} disabled={pageNumber <= 1}>
                            Previous
                        </Button>
                        <Typography sx={{ mx: 2 }}>
                            Page {pageNumber} of {numPages}
                        </Typography>
                        <Button onClick={nextPage} disabled={pageNumber >= numPages}>
                            Next
                        </Button>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Document
                            file={selectedPdf?.url}
                            onLoadSuccess={onDocumentLoadSuccess}
                        >
                            <Page
                                pageNumber={pageNumber}
                                scale={scale}
                            />
                        </Document>
                    </Box>
                </DialogContent>
            </Dialog>
        </PatientPageContainer>
    );
}

export default PatientProfilePage;
