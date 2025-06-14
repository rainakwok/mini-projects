// Compare two arrays for equality (order does not matter)
export const arraysEqual = (a, b) => {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;

  a.sort();
  b.sort();

  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

// Compare two array of objects for equality based on one object property (order does not matter)
export const objectsArrayEqual = (o1, o2, property) => {
  var equal = Object.keys(o1).length === Object.keys(o2).length;  
  if (!equal) return equal;

  for (var i = 0; i < o1.length; ++i) {
    if (o1[i][property] !== o2[i][property]) return false;
  };
  return true;
};

// Remove a value from an array of primitives
export const removeFromArray = (array, value) => {
  const index = array.indexOf(value);
  if (index > -1) { // only splice array when item is found
    array.splice(index, 1); // 2nd parameter means remove one item only
  };
  return array;
};

export const getUniqueObjects = (array, property) => {
  return array.filter((thing, index, self) =>
    index === self.findIndex((t) => (
      t[property] === thing[property]
    ))
  );
};

/**
 * 
 * Get the distance between two lat/long points using the Haversine formula (as the crow flies)
 * Source: https://stackoverflow.com/questions/18883601/function-to-calculate-distance-between-two-coordinates
 */
export const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
  lat1 = parseFloat(lat1);
  lon1 = parseFloat(lon1);
  lat2 = parseFloat(lat2);
  lon2 = parseFloat(lon2);
  
  var R = 6371; // Average radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon/2) * Math.sin(dLon/2); 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d;
};

function deg2rad(deg) {
  return deg * (Math.PI/180)
};