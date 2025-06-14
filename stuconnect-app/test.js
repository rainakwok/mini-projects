
// const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
//   lat1 = parseFloat(lat1);
//   lon1 = parseFloat(lon1);
//   lat2 = parseFloat(lat2);
//   lon2 = parseFloat(lon2);
  
//   var R = 6371; // Average radius of the earth in km
//   var dLat = deg2rad(lat2-lat1);  // deg2rad below
//   var dLon = deg2rad(lon2-lon1); 
//   var a = 
//     Math.sin(dLat/2) * Math.sin(dLat/2) +
//     Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon/2) * Math.sin(dLon/2); 
//   var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
//   var d = R * c; // Distance in km
//   return d;
// };

// function deg2rad(deg) {
//   return deg * (Math.PI/180)
// };

// const lon1 = "-79.3832";
// const lat1 = 45.6532;
// const lon2 = "-70.3832";
// const lat2 = 43.6532;

// console.log(getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2)); // 0 km

// const ids = ['bm6YJdhxuPcu2yOOygvl1Yn7KYL2', 'id2'];
// const convertToSqlArrStr = (arr) => {
//   return "'" + arr.join("','") + "'";
// };

// console.log(convertToSqlArrStr(ids)); // 'bm6YJdhxuPcu2yOOygvl1Yn7KYL2','id2'

const asp1 =
[{"UID":"0kCCCX7OI8aryQ9Tlmm9PNwap1K2","Job_id":"eXRQ6c67za","Job":"Computer Systems Security Analyst","Group_id":"nQD1AP7VJo"},
{"UID":"bm6YJdhxuPcu2yOOygvl1Yn7KYL2","Job_id":"7Qx9C6strV","Job":"Data Architect","Group_id":"gmvBGLTnlv"},
{"UID":"bm6YJdhxuPcu2yOOygvl1Yn7KYL2","Job_id":"B2AXz11KqA","Job":"Application Integration Engineer","Group_id":"vMnoOwDUPr"},
{"UID":"itp0eBVObfbQgJ9CqZMqUNicjn03","Job_id":"Sc0nBAQHhj","Job":"Information Security Analyst","Group_id":"nQD1AP7VJo"},
{"UID":"qe43ZOw7iQQjAi8tSxzPGEqy0Oi1","Job_id":"LvUJrTOO0o","Job":"Financial Risk Analyst","Group_id":"dbcQomSP3m"},
{"UID":"RhBf4csYcDfaSKO8J2cIS55OcAf1","Job_id":"BB88GWGZG7","Job":"Systems Software Designer","Group_id":"vMnoOwDUPr"}]

const asp2 =
[{"UID":"0kCCCX7OI8aryQ9Tlmm9PNwap1K2","Job_id":"eXRQ6c67za","Job":"Computer Systems Security Analyst","Group_id":"nQD1AP7VJo"},
{"UID":"bm6YJdhxuPcu2yOOygvl1Yn7KYL2","Job_id":"7Qx9C6strV","Job":"Data Architect","Group_id":"gmvBGLTnlv"},
{"UID":"bm6YJdhxuPcu2yOOygvl1Yn7KYL2","Job_id":"B2AXz11KqA","Job":"Application Integration Engineer","Group_id":"vMnoOwDUPr"},
{"UID":"itp0eBVObfbQgJ9CqZMqUNicjn03","Job_id":"Sc0nBAQHhj","Job":"Information Security Analyst","Group_id":"nQD1AP7VJo"},
{"UID":"qe43ZOw7iQQjAi8tSxzPGEqy0Oi1","Job_id":"LvUJrTOO0o","Job":"Financial Risk Analyst","Group_id":"dbcQomSP3m"},
{"UID":"RhBf4csYcDfaSKO8J2cIS55OcAf1","Job_id":"BB88GWGZG7","Job":"Systems Software Designer","Group_id":"vMnoOwDUPr"}]

const asp3 =
[{"UID":"0kCCCX7OI8aryQ9Tlmm9PNwap1K2","Job_id":"eXRQ6c67za","Job":"Computer Systems Security Analyst","Group_id":"nQD1AP7VJo"},
{"UID":"bm6YJdhxuPcu2yOOygvl1Yn7KYL2","Job_id":"7Qx9C6strV","Job":"Data Architect","Group_id":"gmvBGLTnlv"},
{"UID":"itp0eBVObfbQgJ9CqZMqUNicjn03","Job_id":"Sc0nBAQHhj","Job":"Information Security Analyst","Group_id":"nQD1AP7VJo"},
{"UID":"qe43ZOw7iQQjAi8tSxzPGEqy0Oi1","Job_id":"LvUJrTOO0o","Job":"Financial Risk Analyst","Group_id":"dbcQomSP3m"},
{"UID":"RhBf4csYcDfaSKO8J2cIS55OcAf1","Job_id":"BB88GWGZG7","Job":"Systems Software Designer","Group_id":"vMnoOwDUPr"}]

const asp4 =
[{"UID":"fdaf","Job_id":"fda","Job":"Computer Systems Security Analyst","Group_id":"nQD1AP7VJo"},
{"UID":"itp0eBVObfbQgJ9CqZMqUNicjn03","Job_id":"Sc0nBAQHhj","Job":"Information Security Analyst","Group_id":"nQD1AP7VJo"},
{"UID":"qe43ZOw7iQQjAi8tSxzPGEqy0Oi1","Job_id":"LvUJrTOO0o","Job":"Financial Risk Analyst","Group_id":"dbcQomSP3m"},
{"UID":"qe43ZOw7iQQjAi8tSxzPGEqy0Oi1","Job_id":"LvUJrTOO0o","Job":"Financial Risk Analyst","Group_id":"dbcQomSP3m"},
{"UID":"RhBf4csYcDfaSKO8J2cIS55OcAf1","Job_id":"BB88GWGZG7","Job":"Systems Software Designer","Group_id":"vMnoOwDUPr"}]

// const profile = {UID: 'bm6YJdhxuPcu2yOOygvl1Yn7KYL2', Name: 'Test1 Email',
//   university: 'University of Western Ontario', Bio: 'I am test1@gmail.com',
//   pictureURL: null, province_id : "ON", university : "University of Western Ontario"};

// const profile2 = {
//   ...profile,
//   careerInterests: asp.filter(a => a.UID == profile.UID).Job
// };
// console.log('asp:', asp);
// console.log('Profile:', profile);
// console.log('Profile2:', profile2);

// var filter = asp.filter(a => a.UID == profile.UID);
// var filter2 = asp.filter(a => a.UID == profile.UID).map(o => o.Job);

// console.log('Filter:', filter);
// console.log('Filter2:', filter2);


const objectsArrayEqual = (o1, o2, property) => {
  var equal = Object.keys(o1).length === Object.keys(o2).length;  
  if (!equal) return equal;

  for (var i = 0; i < o1.length; ++i) {
    if (o1[i][property] !== o2[i][property]) return false;
  };
  return true;
};
        
// console.log(objectsArrayEqual(asp1, asp2, 'Job_id')); // true
// console.log(objectsArrayEqual(asp1, asp3, 'Job_id')); // false
// console.log(objectsArrayEqual(asp1, asp4, 'Job_id')); // false
        
// console.log(objectsArrayEqual(asp1, asp2, 'Job')); // true
// console.log(objectsArrayEqual(asp1, asp3, 'Job')); // false
// console.log(objectsArrayEqual(asp1, asp4, 'Job')); // true

const getUniqueObjects = (array, property) => {
  return array.filter((thing, index, self) =>
    index === self.findIndex((t) => (
      t[property] === thing[property]
    ))
  );
};

const obj1 = [
  {'name': 'John', 'age': 25, 'job': 'Software Engineer'},
  {'name': 'Bob', 'age': 25, 'job': 'Software Engineer'},
  {'name': 'Bob', 'age': 25, 'job': 'Engineer'}
];

const uniqueObjects = getUniqueObjects(obj1, 'job');
console.log(uniqueObjects); // [ { name: 'John', age: 25, job: 'Software Engineer' }, { name: 'Bob', age: 25, job: 'Engineer' } ]