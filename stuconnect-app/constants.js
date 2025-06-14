export const STATUS_ID = {
  pending: 1,
  connected: 2,
  declined: 3,
  expired: 4,
};

export const convertToSqlArrStr = (arr) => {
  return "'" + arr.join("','") + "'";
};

export const TEMP_UID = 'bm6YJdhxuPcu2yOOygvl1Yn7KYL2'; // test1@gmail.com uid