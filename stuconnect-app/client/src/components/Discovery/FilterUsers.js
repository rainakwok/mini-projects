import React from 'react';
import { Grid, FormControl, InputLabel, Select, Checkbox, MenuItem, OutlinedInput, ListItemText } from '@mui/material';
import { PROVINCES } from '../../constants/values';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const FilterUsers = (props) => {

  // array of selected province codes (e.g. ["AB", "BC", "ON"])
  const [provinceSelection, setProvinceSelection] = React.useState([]);
  // array of cities filtered by province (e.g. ["Toronto, ON", "Etobicoke, ON", "Vancouver, BC", "Calgary, AB"])
  const [filteredCities, setFilteredCities] = React.useState([]);
  // array of selected cities from filteredCities list (e.g. ["Toronto, ON", "Vancouver, BC"])
  const [citySelection, setCitySelection] = React.useState([]);

  // Set the filteredCities state to the initial list of cities
  React.useEffect(() => {
    setFilteredCities(props.locations);
  }, []);

  // Sorts and filters filteredCities based on provinceSelection
  React.useEffect(() => {
    if (provinceSelection.length > 0){
      setFilteredCities(filterCityListByProvince());
    } else if (citySelection.length > 0) {
      setCitySelection([]);
      props.setSelectedLoc([]);
    };
  }, [provinceSelection]);

  // Sets provinceSelection state based on user input
  const handleProvinceSelect = (event) => {
    const provinceList = event.target.value;
    setProvinceSelection(
      typeof provinceList === 'string' ? provinceList.split(';') : provinceList
    );
  };

  // Sets citySelection state based on user input
  const handleCitySelect = (event) => {
    const cities = event.target.value;
    setCitySelection(
      typeof cities === 'string' ? cities.split(';') : cities
    );
  };

  // Sets filteredCities filtered based on provinceSelection and sorted by province and city
  const filterCityListByProvince = () => {
    var filtered = props.locations.filter(loc => provinceSelection.includes(loc.province_id));
    filtered = filtered.sort((a, b) => (b.city > a.city) ? 1 : -1)
      .sort((a, b) => (a.province_id > b.province_id) ? 1 : -1);
    return filtered;
  };

  // Calls parent function to set selectedLoc state based on citySelection
  const filterByLocation = () => {
    if (provinceSelection.length > 0 && filteredCities.length > 0){
      // CASE 1: filtering by province and city
      if (citySelection.length > 0){
        props.setSelectedLoc(citySelection);
      } else {
      // CASE 2: filtering by province only
        let cities = filteredCities.map((obj) => obj.city + ", " + obj.province_id);
        props.setSelectedLoc(cities);
      }
    } else if (props.selectedLoc.length > 0) {
      // CASE 3: no filtering
      props.setSelectedLoc([]);
    };
  };

  const clearFilters = () => { 
    setProvinceSelection([]);
    setCitySelection([]);
    props.setSelectedLoc([]);
  }

  return (
  <Grid container
    direction='row'
    justifyContent='flex-start'
    alignItems='center'
    spacing={2}
    sx={{height: '100%', flex: 1}}                    
  >
    <Grid item> 
      <FormControl sx={{ m: 1, width: 200 }} size="small" data-testid="discov_filterByProv">
        <InputLabel id="province-multiselect-label">Filter by Province</InputLabel>
        <Select
          labelId="province-multiselect-label"
          id="province-multiselect"
          multiple
          value={provinceSelection}
          onChange={handleProvinceSelect}
          input={<OutlinedInput label="Filter by Province"/>}
          renderValue={(selected) => selected.join('; ')}
          MenuProps={MenuProps}
        >
          {PROVINCES.map((obj) => (
            <MenuItem key={obj.code} value={obj.code}>
              <Checkbox checked={provinceSelection.indexOf(obj.code) > -1} />
              <ListItemText primary={obj.name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl sx={{ m: 1, width: 200 }} size="small" data-testid="discov_filterByProv">
        <InputLabel id="city-multiselect-label">Filter by City</InputLabel>
        <Select
          labelId="city-multiselect-label"
          id="city-multiselect"
          multiple
          value={citySelection}
          onChange={handleCitySelect}
          input={<OutlinedInput label="Filter by City"/>}
          disabled={provinceSelection.length > 0 ? false : true}
          renderValue={(selected) => selected.join('; ')}
          MenuProps={MenuProps}
          sx={{ backgroundColor: provinceSelection.length == 0 && "lightgray" }}
        >
          {filteredCities.map((obj) => {
            var loc = obj.city + ", " + obj.province_id;
            return (
              <MenuItem key={loc} value={loc}>
                <Checkbox checked={citySelection.indexOf(loc) > -1} />
                <ListItemText primary={loc} />
              </MenuItem>
            )
          })}
        </Select>
      </FormControl>
    </Grid>    
    <Grid item>
      <Grid container
        direction='column'
        justifyContent='space-evenly'
        alignItems='flex-start'              
      >
        <Grid item> 
          <button onClick={filterByLocation}>Apply Filters</button>
        </Grid>
        <Grid item> 
          <button onClick={clearFilters}>Clear Filters</button>
        </Grid>
      </Grid>
    </Grid>
  </Grid>
  );
}

export default FilterUsers;
