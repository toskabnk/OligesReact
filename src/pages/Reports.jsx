import React, {useEffect, useState} from 'react';
import { Grid, Paper, Typography, Button, LinearProgress, Card, TextField, Autocomplete, CircularProgress } from '@mui/material';
import { DataGridPremium, GridToolbarColumnsButton, GridToolbarContainer, GridToolbarDensitySelector, GridToolbarExport, GridToolbarFilterButton, useGridApiRef } from '@mui/x-data-grid-premium';
import CustomNoRowsOverlay from '../components/DataGridComponents/CustomNoRowsComponent';
import { chaoticOrbit, quantum } from 'ldrs';

import oligesManagementApi from "../services/apiServices";
import { useSelector } from 'react-redux';
import { Center, StyledFlexCenter } from '../styles/StyledContainers';

const Reports = () => {
    const apiRef = useGridApiRef();
    const access_token = useSelector((state) => state.data.access_token)

    const [campaigns, setCampaigns] = useState(['']);
    const [selectedCampaign, setSelectedCampaign] = useState(campaigns[0]);
    const typeOfReport = ['Total kilos per farmer', 'Kilos grouped by sampling', 'Total kilos by farmer'];
    const [selectedTypeOfReport, setSelectedTypeOfReport] = useState(typeOfReport[0]);
    const [farmer, setFarmer] = useState(null);
    const [farmerValue, setFarmerValue] = useState('');
    const [farmerSelected, setFarmerSelected] = useState(null);
    const [rowsReport, setRowsReport] = useState(null);
    const [showTable, setShowTable] = useState(false);
    const [error, setError] = useState(null);
    const [farmerLoading, setFarmerLoading] = useState(true);
    const [campaignLoading, setCampaignLoading] = useState(true);
    const [kpiReceipt, setkpiReceipt] = useState(null);
    const [kpiFarmer, setkpiFarmer] = useState(null);
    const [kpiReceiptLoading, setKpiReceiptLoading] = useState(true);
    const [kpiFarmerLoading, setKpiFarmerLoading] = useState(true);
    const [loadingReport, setLoadingReport] = useState(false);


    const handleGenerate = () => {
        if(selectedTypeOfReport === 'Total kilos by farmer'){
            if(!farmerSelected){
                setError('You must select a farmer');
                return;
            } else {
                setError(null);
                loadGenerateReport(selectedTypeOfReport, selectedCampaign, farmerSelected.id);
            }
        } else {
            loadGenerateReport(selectedTypeOfReport, selectedCampaign);
        }
    }

    function parseKilosPerFarmer(response){
        let rows = [];

        response.data.data.forEach(element => {
            let row = {
                id: element.farmer.id,
                farmer: element.farmer.name + ' ' + element.farmer.surname	,
                manzanillas: '',
                manzanillas_sampling: '',
                gordal: '',
                gordal_sampling: '',
                purple: '',
                molino: ''
            }

            element.kilos.forEach(kilo => {
                if(kilo.type === 'Manzanilla'){
                    row.manzanillas = kilo.total_kilos;
                    row.manzanillas_sampling = kilo.avg_sampling;
                } else if (kilo.type === 'Gordal'){
                    row.gordal = kilo.total_kilos;
                    row.gordal_sampling = kilo.avg_sampling;
                }
                else if (kilo.type === 'Morado'){
                    row.purple = kilo.total_kilos;
                }
                else if (kilo.type === 'Molino'){
                    row.molino = kilo.total_kilos;
                }
            });
            rows.push(row);
        });

        return rows;
    }

    function parseKilosPerSampling(response){
        let rows = [];
        let index = 0;
        response.data.data.forEach(element => {
            let manazanillas = [];
            let gordal = [];
            let purple = [];
            let molino = [];
            console.log(element);

            element.kilos.forEach(kilo => {
                if(kilo.type === 'Manzanilla'){
                    manazanillas.push(kilo);
                } else if (kilo.type === 'Gordal'){
                    gordal.push(kilo);
                }
                else if (kilo.type === 'Morado'){
                    purple.push(kilo);
                }
                else if (kilo.type === 'Molino'){
                    molino.push(kilo);
                }
            });

            let allTypes = [manazanillas, gordal, purple, molino];

            //Find max length of array
            const maxLength = allTypes.reduce((max, arr) => (arr.length > max ? arr.length : max), 0);

            //Sort arrays by sampling
            manazanillas.sort((a, b) => parseInt(b.sampling) - parseInt(a.sampling));
            gordal.sort((a, b) => parseInt(b.sampling) - parseInt(a.sampling));
            purple.sort((a, b) => parseInt(b.sampling) - parseInt(a.sampling));
            molino.sort((a, b) => parseInt(b.sampling) - parseInt(a.sampling));

            //Iterate over max length
            for(let i = 0; i < maxLength; i++){
                let row = {
                    id: element.farmer.id,
                    farmer: element.farmer.name + ' ' + element.farmer.surname	,
                    manzanillas: '',
                    manzanillas_sampling: '',
                    gordal: '',
                    gordal_sampling: '',
                    purple: '',
                    molino: ''
                }
                //ID need to be unique
                row.id = index++;

                //Farmer name
                row.farmer = element.farmer.name + ' ' + element.farmer.surname	;

                //Kilos
                if(manazanillas[i]){
                    row.manzanillas = manazanillas[i].total_kilos;
                    row.manzanillas_sampling = manazanillas[i].sampling;
                }
                if(gordal[i]){
                    row.gordal = gordal[i].total_kilos;
                    row.gordal_sampling = gordal[i].sampling;
                }
                if(purple[i]){
                    row.purple = purple[i].total_kilos;
                }
                if(molino[i]){
                    row.molino = molino[i].total_kilos;
                }

                rows.push(row);
            }
        });

        return rows;
    }

    function parseKilosByFarmer(response){
        let rows = [];

        let index = 0;
        for (const kilo in response.data.data.kilos) {
            let row = {
                id: index,
                farmer: farmerSelected.name + ' ' + farmerSelected.surname	,
                manzanillas: '',
                manzanillas_sampling: '',
                gordal: '',
                gordal_sampling: '',
                purple: '',
                purple_sampling: '',
                molino: ''
            }
            index++;
            console.log(kilo);
            for (const index in response.data.data.kilos[kilo]) {
                const weight = response.data.data.kilos[kilo][index];
                if(weight.type === 'Manzanilla'){
                    row.manzanillas = weight.kilos;
                    row.manzanillas_sampling = weight.sampling;
                } else if (weight.type === 'Gordal'){
                    row.gordal = weight.kilos;
                    row.gordal_sampling = weight.sampling;
                }
                else if (weight.type === 'Morado'){
                    row.purple = weight.kilos;
                    row.purple_sampling = weight.sampling;
                }
                else if (weight.type === 'Molino'){
                    row.molino = weight.kilos;
                }
            }
            rows.push(row);
        }

        let row = {
            id: index,
            farmer: farmerSelected.name + ' ' + farmerSelected.surname	,
            manzanillas: '',
            manzanillas_sampling: '',
            gordal: '',
            gordal_sampling: '',
            purple: '',
            purple_sampling: '',
            molino: ''
        }

        response.data.data.total_kilos.forEach(kilo => {
            if(kilo.type === 'Manzanilla'){
                row.manzanillas = kilo.total_kilos;
                row.manzanillas_sampling = kilo.avg_sampling;
            } else if (kilo.type === 'Gordal'){
                row.gordal = kilo.total_kilos;
                row.gordal_sampling = kilo.avg_sampling;
            }
            else if (kilo.type === 'Morado'){
                row.purple = kilo.total_kilos;
            }
            else if (kilo.type === 'Molino'){
                row.molino = kilo.total_kilos;
            }
        })

        row.farmer = 'Total:';
        rows.push(row);

        return rows;
    }

    async function loadGenerateReport(reportType, selectedCampaign, farmerId) {
        setShowTable(false);
        setLoadingReport(true);
        let endpoint = '';
        if(reportType === 'Total kilos per farmer'){
            endpoint = '/stadistics/totalByCampaign';
        } else if (reportType === 'Kilos grouped by sampling'){
            endpoint = '/stadistics/totalByCampaignSampling';
        } else if(reportType === 'Total kilos by farmer'){
            endpoint = `/stadistics/totalByFarmer/${farmerId}`;
        } else {
            return;
        }

        let body = {
            campaign: selectedCampaign
        }

        await oligesManagementApi.get(endpoint, { bearerToken: access_token, params: body})
        .then( (response) => {
            let rows = [];
            console.log(response);
            //Map data to row depending on report type
            if(reportType === 'Total kilos per farmer'){
                rows = parseKilosPerFarmer(response);
            } else if (reportType === 'Kilos grouped by sampling') {
                rows = parseKilosPerSampling(response);
            } else if (reportType === 'Total kilos by farmer') {
                rows = parseKilosByFarmer(response);
            }
            
            setRowsReport(rows);
            setShowTable(true);
        })
        .catch((error) => {
            console.log(error);
        })
        .finally(() => {
            setLoadingReport(false);
        })
    }

    async function loadKPIReceipt() {
        await oligesManagementApi.get('/stadistics/kpiReceipt', { bearerToken: access_token })
        .then(function (response) {
            console.log(response.data);
            setkpiReceipt(response.data.data);
            setKpiReceiptLoading(false);
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    async function loadKPIFarmer() {
        await oligesManagementApi.get('/stadistics/kpiFarmer', { bearerToken: access_token })
        .then(function (response) {
            console.log(response.data);
            setkpiFarmer(response.data.data);
            setKpiFarmerLoading(false);
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    async function loadCampaigns() {
        await oligesManagementApi.get('/stadistics/campaigns', { bearerToken: access_token })
        .then(function (response) {
            let campaigns = [];
            response.data.data.forEach(element => campaigns.push(element.campaign));
            setCampaigns(campaigns);
            setSelectedCampaign(campaigns[0]);
            setCampaignLoading(false);
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    async function loadFarmers() {
        await oligesManagementApi.get('/cooperative/farmers', { bearerToken: access_token })
        .then(function (response) {
            setFarmer(response.data.data.farmer);
            setFarmerLoading(false);
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    useEffect(() => {
        chaoticOrbit.register()
        quantum.register()
        loadKPIReceipt()
        loadCampaigns()
        loadKPIFarmer()
    }, [])

    useEffect(() => {
        if(selectedTypeOfReport === 'Total kilos by farmer'){
            loadFarmers();
        }
    }, [selectedTypeOfReport])

    const columns = [
        {
            field: 'farmer',
            headerName: 'Farmer name',
            width: 250,
        },
        {
            field: 'manzanillas',
            headerName: 'Manzanillas',
            width: 150,
        },
        {
            field: 'manzanillas_sampling',
            headerName: 'Sampling',
            width: 150,
        },
        {
            field: 'gordal',
            headerName: 'Gordal',
            width: 150,
        },
        {
            field: 'gordal_sampling',
            headerName: 'Sampling',
            width: 150,
        },
        {
            field: 'purple',
            headerName: 'Purple',
            width: 150,
        },
        {
            field: 'purple_sampling',
            headerName: 'Sampling',
            width: 150,
        },
        {
            field: 'molino',
            headerName: 'Molino',
            width: 150,
        },
    ];

    function CustomToolbar() {
        return (
          <GridToolbarContainer>
            <GridToolbarColumnsButton />
            <GridToolbarFilterButton />
            <GridToolbarDensitySelector />
            <GridToolbarExport />
          </GridToolbarContainer>
        );
    }

    return (
        <Card sx={{ 
            marginLeft: "auto",
            marginRight: "auto",
            marginTop: "20px",
            marginBottom: "20px",
            minWidth: 300, 
            width: '95%',
            border: "1px solid rgba(211,211,211,0.6)",
            minHeight: "89vh",
            height: "100%",
        }}>
            <Grid 
                container 
                spacing={2}
                sx={{ margin: '20px', marginBottom:'80px', width: 'calc(100% - 56px)' }}>
                <Grid 
                    item 
                    xs={12} 
                    md={6}
                    sx={{height: '220px'}}>
                    <Paper elevation={3} sx={{height: '100%'}}>
                        {kpiReceiptLoading ? 
                        <CircularProgress sx={{marginLeft: '50%', marginTop: '80px'}} /> : 
                        <>
                            <Typography variant="h6" gutterBottom sx={{marginLeft: '10px'}}>
                                Total kilos this campaign:
                            </Typography>
                            <Typography align='center' variant="h3" gutterBottom>
                                {`${kpiReceipt.actual_campaign.total_kilos} kilos`}
                            </Typography>
                            <Typography variant="h6" gutterBottom sx={{marginLeft: '10px'}}>
                                Last campaign kilos:
                            </Typography>
                            <Typography variant="h5" sx={{marginLeft: '50px'}}>
                            {`${kpiReceipt.previous_campaign.total_kilos ? kpiReceipt.previousCampaign : 0} kilos`}
                            </Typography>
                        </>}
                    </Paper>
                </Grid>
                <Grid 
                    item xs={12} 
                    md={6}
                    sx={{height: '220px'}}>
                    <Paper elevation={3} sx={{height: '100%'}}>
                    {kpiFarmerLoading ? 
                        <CircularProgress sx={{marginLeft: '50%', marginTop: '80px'}} /> : 
                        <>
                            <Typography variant="h6" gutterBottom sx={{marginLeft: '10px'}}>
                            Nº of farmers that have delivered this campaign:
                            </Typography>
                            <Typography variant="h3" align='center' gutterBottom sx={{marginLeft: '10px'}}>
                                {`${kpiFarmer.farmers} out of ${kpiFarmer.total_farmers}`}
                            </Typography>
                            <Typography variant="h6" gutterBottom sx={{marginLeft: '10px'}}>
                                New farmers in this campaign:
                            </Typography>
                            <Typography variant="h5" gutterBottom sx={{marginLeft: '50px'}}>
                                {`${kpiFarmer.new_farmers} new farmers`}
                            </Typography>
                        </>}
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '15px'}}>
                        <div style={{display: 'flex', justifyContent: 'normal', alignItems: 'center'}}>
                            <Autocomplete
                                disablePortal
                                disableClearable
                                disabled={campaignLoading}
                                options={campaigns}
                                inputValue={selectedCampaign}
                                value={selectedCampaign}
                                onChange={(event, newValue) => {
                                    setSelectedCampaign(newValue);
                                }}
                                onInputChange={(event, newInputValue) => {
                                    setSelectedCampaign(newInputValue);
                                }}
                                id="campaign"
                                getOptionLabel={(option) => {
                                    if(!option){
                                        return ''
                                    } else {
                                    return option
                                    }
                                }}
                                sx={{ 
                                    width: 160,
                                    mr: 2
                                }}
                                renderInput={(params) => (
                                    <TextField
                                    {...params}
                                        label="Campaign"
                                        InputProps={{
                                            ...params.InputProps,
                                            endAdornment: (
                                                <>
                                                {campaignLoading ? <l-chaotic-orbit size='35' speed='1.5' color='black'></l-chaotic-orbit> : null}
                                                {params.InputProps.endAdornment}
                                                </>
                                            ),
                                        }}
                                    />
                                )}
                            />
                            <Autocomplete
                                disablePortal
                                disableClearable
                                options={typeOfReport}
                                inputValue={selectedTypeOfReport}
                                value={selectedTypeOfReport}
                                onChange={(event, newValue) => {
                                    setSelectedTypeOfReport(newValue);
                                }}
                                onInputChange={(event, newInputValue) => {
                                    setSelectedTypeOfReport(newInputValue);
                                }}
                                id="report"
                                getOptionLabel={(option) => {
                                    if(!option){
                                        return ''
                                    } else {
                                    return option
                                    }
                                }}
                                sx={{ 
                                    width: 250
                                }}
                                renderInput={(params) => (<TextField {...params} label="Report Type" />)}
                            />
                            {selectedTypeOfReport === 'Total kilos by farmer' ? 
                            <>
                                <Autocomplete
                                    disablePortal
                                    sx={{ml: 2, width: 400}}
                                    id='farmer_id'
                                    options={farmer}
                                    inputValue={farmerValue}
                                    value={farmerSelected}
                                    loading={farmerLoading}
                                    disabled={farmerLoading}
                                    onChange={(event, newValue) => {
                                        setFarmerSelected(newValue);
                                    }}
                                    onInputChange={(event, newInputValue) => {
                                        setFarmerValue(newInputValue);
                                    }}
                                    getOptionLabel={(option) => {
                                        if(!option){
                                            return ''
                                        } else {
                                        return '[' + option.id + '] ' + option.name + ' ' + option.surname
                                        }
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                        {...params}
                                            label="Farmer"
                                            error={error ? true : false}
                                            helperText={error}
                                            InputProps={{
                                                ...params.InputProps,
                                                endAdornment: (
                                                    <>
                                                    {farmerLoading ? <l-chaotic-orbit size='35' speed='1.5' color='black'></l-chaotic-orbit> : null}
                                                    {params.InputProps.endAdornment}
                                                    </>
                                                ),
                                            }}
                                        />
                                    )}/>
                            </> : null}
                        </div>
                        <Button disabled={campaignLoading || loadingReport} variant="contained" color="primary" style={{float: 'right'}} onClick={handleGenerate}>
                            Generate
                        </Button>
                    </div>
                    
                    {showTable ?  
                        <DataGridPremium
                            apiRef={apiRef}
                            rows={rowsReport}
                            columns={columns}
                            disableRowSelectionOnClick
                            autoPageSize
                            slots={{
                                loadingOverlay: LinearProgress,
                                noRowsOverlay: CustomNoRowsOverlay,
                                toolbar: CustomToolbar,
                            }}
                        /> :
                        <>
                            {loadingReport ?
                            <StyledFlexCenter>
                                <Center>
                                    <l-quantum size='100' speed='1.5' color='black'></l-quantum>
                                </Center>
                            </StyledFlexCenter> : null
                            }
                        </>
                    }
                </Grid>
            </Grid>
        </Card>
    );
};

export default Reports;