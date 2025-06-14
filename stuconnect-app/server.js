import mysql from "mysql";
import config from "./config.js";
import fetch from "node-fetch";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";

import admin from 'firebase-admin';
import serviceAccount from './serviceAccountKey.json' assert {type: 'json'};
import { STATUS_ID, convertToSqlArrStr } from "./constants.js";

// Import the service account credentials from Firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://msci-342---stuconnect-app-default-rtdb.firebaseio.com"
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 5000;
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(express.static(path.join(__dirname, "client/build")));

// Middleware to verify Firebase ID Token
const checkAuth = (req, res, next) => {
  const idToken = req.headers.authorization;
  if (!idToken) {
    return res.status(403).send('Unauthorized');
  }
  admin.auth().verifyIdToken(idToken).then(decodedToken => {
    req.user = decodedToken;
    next();
  }).catch(error => {
    res.status(403).send('Unauthorized');
  });
};

// back4app API credentials
const BFAAppId_test = "rQHFSooHzoFzPXrYcW42Tr6MwvbM7U2Alx1Lfu78"; // Test app application id
const BFAMasterKey_test = "Irv8n3StNYfdQp2RbIiYs5sN76b6hA7GQ79cRwdG"; // Test app readonly master key

// API to get initial user options for matching on the Discovery
app.post("/api/loadInitialDiscoveryMatchIDs", checkAuth, (req, res) => {
  console.log("/api/loadInitialDiscoveryMatchIDs called");
  const { id } = req.body;

  let connection = mysql.createConnection(config);
  var sql = `
		SELECT UID FROM Profile
		WHERE UID NOT IN 
			(SELECT ? AS UID
			UNION
			SELECT UID_receive AS UID FROM Connections
			WHERE UID_send = ?
			AND Status_id != ${STATUS_ID.expired}
      AND Status_id IS NOT NULL)
	`;

  const data = [id, id];

  connection.query(sql, data, (error, results, fields) => {
    if (error) {
      res.status(500).json({ error: error.message });
    }
    let string = JSON.stringify(results);
    res.send({ express: string });
  });
  connection.end();
});

// API to read matched users for discovery from the database
app.post("/api/getDiscoveryMatches", checkAuth, (req, res) => {
  console.log("/api/getDiscoveryMatches called");
  const { IDs } = req.body;
  
  let connection = mysql.createConnection(config);
  var sql = `
		SELECT UID, Name, School, CC.city, CC.province_id, Bio, CC.lat, CC.lng
		FROM Profile P
		INNER JOIN CanadaCities CC ON P.Location_id = CC.id
		WHERE UID IN (${convertToSqlArrStr(IDs)})`;

  connection.query(sql, (error, results, fields) => {
    if (error) {
      res.status(500).json({ error: error.message });
    }
    let string = JSON.stringify(results);
    res.send({ express: string });
  });
  connection.end();
});

// API to load all canadian locations/cities from the database
app.post("/api/loadLocations", (req, res) => {
  console.log("/api/loadLocations called");
  let connection = mysql.createConnection(config);
  const sql = `SELECT id, city, province_id FROM CanadaCities`;

  connection.query(sql, (error, results, fields) => {
    if (error) {
      res.status(500).json({ error: error.message });
    }
    let string = JSON.stringify(results);
    res.send({ express: string });
  });
  connection.end();
});

// API to load all data from the Profile_Aspirations table in the database
app.post("/api/loadUserAspirations", checkAuth, (req, res) => {
  console.log("/api/loadUserAspirations called");
  let connection = mysql.createConnection(config);
  const sql = `SELECT * FROM Profile_Aspirations`;

  connection.query(sql, (error, results, fields) => {
    if (error) {
      res.status(500).json({ error: error.message });
    }
    let string = JSON.stringify(results);
    res.send({ express: string });
  });
  connection.end();
});

// API to load all data from the Profile_Aspirations table in the database
app.post("/api/addUserAspiration", checkAuth, (req, res) => {
  const { uid, aspirationsList } = req.body;

  let config2 = { ...config, multipleStatements: true };
  let pool = mysql.createPool(config2);

  pool.getConnection(async (err, connection) => {
    if (err) throw err;
    console.log("Database connected successfully");

    const sql1 = `DELETE FROM Profile_Aspirations WHERE UID = ?;`;
    await new Promise((resolve, reject) => {
      connection.query(sql1, [uid], (error, results, fields) => {
        if (error) {
          res.status(500).json({ error: error.message });
          connection.release();
        } else {
          console.log('prev aspirations deleted');
          resolve();
        };
      });
    });
    if (aspirationsList.length > 0){
      let aspListString = ''
      for (var i = 0; i < aspirationsList.length; i++){
        if (i == 0){
          aspListString += `VALUES ('${uid}','${aspirationsList[i].Job_id}','${aspirationsList[i].Job}','${aspirationsList[i].Group_id}')`
        } else {
          aspListString += `, ('${uid}','${aspirationsList[i].Job_id}','${aspirationsList[i].Job}','${aspirationsList[i].Group_id}')`
        }
      };

      const sql2 = `INSERT INTO Profile_Aspirations (UID, Job_id, Job, Group_id) ${aspListString}
      AS val ON DUPLICATE KEY UPDATE 
        Job_id = val.Job_id,
        Job = val.Job,
        Group_id = val.Group_id;`;
      
      await new Promise((resolve, reject) => {
        connection.query(sql2, (error, results, fields) => {
          if (error) {
            res.status(500).json({ error: error.message });
            console.log("Error!", error.message);
            connection.release();
          } else {
            res.status(200).json({ express: "Success!" });
            resolve();
          };
        });
      });
      connection.release();
    } else {
      res.status(200).json({ express: "Done" });
      connection.release();
    };
  });

    // const sql = `INSERT INTO Profile_Aspirations (UID, Job_id, Job, Group_id) ${aspListString};`;

  // connection.query(sql, (error, results, fields) => {
  //   if (error) {
  //     res.status(500).json({ error: error.message });
  //   }
  //   let string = JSON.stringify(results);
  //   res.send({ express: string });
  // });
  // connection.end();
});

// API to load all Canadian cities from the database
app.post("/api/loadCanadaCities", (req, res) => {
  let connection = mysql.createConnection(config);
  const sql = `SELECT * FROM CanadaCities`;

  connection.query(sql, (error, results, fields) => {
    if (error) {
      return console.error(error.message);
    }
    let string = JSON.stringify(results);
    res.send({ express: string });
  });
  connection.end();
});
//adding canadian cities
app.post("/api/addCanadaCity", (req, res) => {
  let connection = mysql.createConnection(config);
  const sql = `INSERT INTO CanadaCities (city, city_ascii, province_id, province_name, lat, lng, population, density, timezone, ranking, postal, id) 
  VALUES ('High Level', 'High Level', 'AB', 'Alberta', 58.5169, -117.1361, 3461, 108.2, 'America/Edmonton', 3, 'T0H', 1124099423)`;

  connection.query(sql, (error, results, fields) => {
    if (error) {
      return console.error(error.message);
    }
    let string = JSON.stringify(results);
    res.send({ express: string });
  });
  connection.end();
});

// API to load all data from the OntarioUniversities table in the database
app.post("/api/loadOntarioUniversities", (req, res) => {
  let connection = mysql.createConnection(config);
  const sql = `SELECT * FROM OntarioUniversities ORDER BY university_name`;

  connection.query(sql, (error, results, fields) => {
    if (error) {
      return console.error(error.message);
    }
    let string = JSON.stringify(results);
    res.send({ express: string });
  });
  connection.end();
});

// //adding ontario universities cities
// app.post("/api/addOntarioUni", (req, res) => {
//   let connection = mysql.createConnection(config);
//   const sql = `INSERT INTO OntarioUniversities (id, university_name) 
//   VALUES ('12', 'Brock University')`;

//   connection.query(sql, (error, results, fields) => {
//     if (error) {
//       return console.error(error.message);
//     }
//     let string = JSON.stringify(results);
//     res.send({ express: string });
//   });
//   connection.end();
// });

//  save user profile
app.post("/api/saveUserProfileInfo", checkAuth, (req, res) => {
  let connection = mysql.createConnection(config);
  const { uid, name, university, cityID, bio, pictureURL } = req.body;
  var pictureURL2 = pictureURL;

  if (typeof pictureURL !== "string") {
    pictureURL2 = null;
  }
  const data = [uid, name, university, cityID, bio, pictureURL2];

  const sql = `
    INSERT INTO Profile (UID, Name, School, Location_id, bio, pictureURL)
    VALUES (?, ?, ?, ?, ?, ?) AS val
    ON DUPLICATE KEY UPDATE
      Name = val.Name,
      School = val.School,
      Location_id = val.Location_id,
      bio = val.bio,
      pictureURL = val.pictureURL;
  `;

  connection.query(sql, data, (error, results) => {
    if (error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(200).json({ express: "Profile Saved Successfully!" });
    }
  });
  connection.end();
});

// API to update the connection status in the database
app.post("/api/updateConnStatus", checkAuth, async (req, res) => {
  console.log("/api/updateConnStatus called");
  const { UID_send, UID_receive, statusID } = req.body;

  let config2 = { ...config, multipleStatements: true };
  let pool = mysql.createPool(config2);

  let list = [];
  pool.getConnection(async (err, connection) => {
    if (err) throw err;
    console.log("Database connected successfully 1");

    // Get list of active connections with specified sender/receiver
    var sql = `
      SELECT Connection_id, UID_send, UID_receive, Status_id FROM Connections
      WHERE (UID_send = ? AND UID_receive = ?) OR (UID_send = ? AND UID_receive = ?)
    `;
    const data = [UID_send, UID_receive, UID_receive, UID_send];

    list = await new Promise((resolve, reject) => {
      connection.query(sql, data, (error, results, fields) => {
        if (error) {
          res.status(500).json({ error: error.message });
          connection.release();
        }
        resolve(results);
      });
    });

    var sql1 = "";
    var data1 = [];
    var reqCase = -1;

    /**
     * if connections list empty, INSERT new connections for sender and receiver (one row each)
     * else...
     * 	if results in two-way pending connection, UPDATE both users with connected statuses
     * 	else, UPDATE sender's connection status
     */
    if (!list) {
      reqCase = 0;
      console.log("Case " + reqCase);

      console.log("Error: undefined response from query");
    } else if (list.length == 0) {
      reqCase = 1;
      console.log("Case " + reqCase);

      console.log("No connection found. Inserting new connections...");
      sql1 = `
        INSERT INTO Connections (UID_send, UID_receive, Status_id, Datetime) VALUES
        (?, ?, ?, now()),
        (?, ?, null, now())
      `;
      data1 = [UID_send, UID_receive, statusID, UID_receive, UID_send];
    } else if (list.length != 2) {
      reqCase = 2;
      console.log("Case " + reqCase);

      console.log("Error: Didn't find exactly 2 connections");
      res.status(500).json({
        error: "Match request/reject Error: Didn't find exactly 2 connections",
      });
    } else {
      var conn_send = list[0];
      var conn_receive = list[1];
      if (conn_send.UID_send != UID_send) {
        conn_send = list[1];
        conn_receive = list[0];
      }
      // if sender sent a request to receiver who has already sent a request to sender
      if (
        (conn_receive.Status_id == STATUS_ID.pending) &
        (statusID == STATUS_ID.pending)
      ) {
        reqCase = 3;
        console.log("Case " + reqCase);

        console.log("Two-way pending connection => Connected!");
        // sql1 = `SELECT 1 AS result`;
        sql1 = `
          UPDATE Connections
          SET Status_id = ${STATUS_ID.connected}, Datetime = now()
          WHERE Connection_id = ${conn_send.Connection_id};
          UPDATE Connections
          SET Status_id = ${STATUS_ID.connected}, Datetime = now()
          WHERE Connection_id = ${conn_receive.Connection_id};
        `;
      } else if (
        (conn_receive.Status_id == STATUS_ID.pending) &
        (statusID == STATUS_ID.declined)
      ) {
        reqCase = 4;
        console.log("Case " + reqCase);

        console.log("Updating connection status...");
        sql1 = `
          UPDATE Connections
          SET Status_id = ${STATUS_ID.declined}, Datetime = now()
          WHERE Connection_id = ${conn_send.Connection_id};
          UPDATE Connections
          SET Status_id = null, Datetime = now()
          WHERE Connection_id = ${conn_receive.Connection_id};
        `;
      } else {
        reqCase = 5;
        console.log("Case " + reqCase);

        sql1 = `
          UPDATE Connections
          SET Status_id = ?, Datetime = now()
          WHERE Connection_id = ${conn_send.Connection_id}
        `;
        data1 = [statusID];
      }
    }

    connection.query(sql1, data1, (error, results, fields) => {
      if (error) {
        res.status(500).json({ error: error.message });
        connection.release();
      };
      res.status(200).json({ express: "Success!" });
    });
    connection.release();

    pool.end((err) => {
      if (err) {
        console.error("Error ending pool:", err);
      } else {
        console.log("Pool connections have been closed.");
      }
    });
  });
});

// API to get connection IDs based on UID
app.post("/api/getConnections", (req, res) => {
  console.log("/api/getConnections called");
  const { userId } = req.body;
  let connection = mysql.createConnection(config);
  const sql = `
    SELECT UID, Name, School, CC.city, CC.province_id, Bio
    FROM Profile P
    INNER JOIN CanadaCities CC ON P.Location_id = CC.id
    WHERE UID IN (
      SELECT UID_receive
      FROM Connections
      WHERE UID_send = ? AND Status_id = ${STATUS_ID.connected}
    )`;
  const data = [userId];
  connection.query(sql, data, (error, results, fields) => {
    if (error) {
      console.error("Error fetching connections:", error);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    let string = JSON.stringify(results);
    res.send({ express: string });
  });
  connection.end();
});

app.post("/api/getConnectionDatetime", (req, res) => {
  const { userId } = req.body;
  let connection = mysql.createConnection(config);
  const sql = `
    SELECT Datetime
    FROM Connections
    WHERE UID_send = ? AND Status_id = ${STATUS_ID.connected};
  `;
  connection.query(sql, [userId], (error, results, fields) => {
    if (error) {
      console.error("Error fetching connection Datetime:", error);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    if (results.length === 0) {
      // If no results found, return empty string or null
      res.send({ express: null });
    } else {
      // Extract the Datetime value from the first row and send it
      const datetime = results[0].Datetime;
      res.send({ express: datetime });
    }
  });
  connection.end();
});


// API to get received invitation IDs based on UID
app.post("/api/getReceivedInvitations", checkAuth, (req, res) => {
  console.log("/api/getReceivedInvitations called");
  const { userId } = req.body;
  let connection = mysql.createConnection(config);

  const sql = `
    SELECT
      P.UID, P.Name, P.School, P.Bio,
        CC.city, CC.province_id, C.DateInvited
    FROM
    (SELECT UID_send, Datetime AS DateInvited
      FROM Connections
      WHERE UID_receive = ? AND Status_id = ${STATUS_ID.pending}) AS C
    INNER JOIN Profile P ON (C.UID_send = P.UID)
    LEFT JOIN CanadaCities CC ON P.Location_id = CC.id
  `;
 
  // With aspirations
//  const sql = `
  //  SELECT
  //    P.UID, P.Name, P.School, P.Bio,
  //      CC.city, CC.province_id, C.DateInvited, PA.Job AS Aspirations
  //  FROM
  //  (SELECT UID_send, Datetime AS DateInvited
  //    FROM Connections
  //    WHERE UID_receive = ? AND Status_id = ${STATUS_ID.pending}) AS C
  //  INNER JOIN Profile P ON (C.UID_send = P.UID)
  //  LEFT JOIN CanadaCities CC ON P.Location_id = CC.id
  //  LEFT JOIN Profile_Aspirations PA ON P.UID = PA.UID;
// `

  connection.query(sql, [userId], (error, results, fields) => {
    if (error) {
      console.error("Error fetching received invitations:", error);
      res.status(500).json({ error: "Internal server error" });
      return;
    };
    
    // Send the results back to the client
    res.send({ express: JSON.stringify(results) });
  });

  connection.end();
});

// API to get sent invitations IDs based on UID
app.post("/api/getSentInvitations", checkAuth, (req, res) => {
  console.log("/api/getSentInvitations called");
  const { userId } = req.body;
  let connection = mysql.createConnection(config);

  const sql = `
    SELECT
      P.UID, P.Name, P.School, P.Bio,
        CC.city, CC.province_id, C.DateSent
    FROM
    (SELECT UID_receive, Datetime AS DateSent
      FROM Connections
      WHERE UID_send = ? AND Status_id = ${STATUS_ID.pending}) AS C
    INNER JOIN Profile P ON (C.UID_receive = P.UID)
    LEFT JOIN CanadaCities CC ON P.Location_id = CC.id
  `;

  connection.query(sql, [userId], (error, results, fields) => {
      if (error) {
          console.error("Error fetching sent invitations:", error);
          res.status(500).json({ error: "Internal server error" });
          return;
      };
      // Send the results back to the client
      res.send({ express: JSON.stringify(results) });
  });

  connection.end();
});


// API to retrive user profile from the database
app.post("/api/loadUserProfileInfo", checkAuth, (req, res) => {
  const { uid } = req.body;
  let connection = mysql.createConnection(config);
  var sql = `
    SELECT UID, Name, School AS university, Bio, pictureURL, CC.city, CC.province_name
    FROM Profile P
    INNER JOIN CanadaCities CC ON P.Location_id = CC.id
    WHERE UID = ?
  `;

  connection.query(sql, [uid], (error, results, fields) => {
    if (error) {
      return console.error(error.message);
    }
    let string = JSON.stringify(results);
    res.send({ express: string });
  });
  connection.end();
});

// API to add new user to the database
app.post("/api/addNewUser", (req, res) => {
  const { userID } = req.body;

  let connection = mysql.createConnection(config);
  var sql = `INSERT INTO Users (userID) VALUES (User_id)`;
  // ^ NOTE: write a more complex query for error handling

  connection.query(sql, (error, results, fields) => {
    if (error) {
      return console.error(error.message);
    }
    let string = JSON.stringify(results);
    res.send({ express: string });
  });
  connection.end();
});

app.post("/api/signup", (req, res) => {
  const { email, password, firstName, lastName, username } = req.body;
  const query =
    "INSERT INTO users2 (email, password, firstName, lastName, username) VALUES (?, ?, ?, ?, ?)";
  connection.query(
    query,
    [email, password, firstName, lastName, username],
    (error, results) => {
      if (error) {
        console.error("Error registering the user:", error);
        return res
          .status(500)
          .send(`Error registering the user: ${error.message}`);
      };
      return res.status(200).json({ message: "User registered successfully" });
    }
  );
});

// connection.connect();

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  const query =
    "SELECT * FROM user_accounts WHERE username = ? AND password = ?";

  connection.query(query, [username, password], (error, results) => {
    if (error) {
      return res.status(500).json("Server error");
    }
    if (results.length > 0) {
      return res.json({ message: "Login successful" });
    } else {
      return res.status(401).json("Username or password is incorrect");
    }
  });
});

//profile data
// app.get("/api/profile", (req, res) => {
//   const userId = req.query.userId;
//   db.query(
//     "SELECT * FROM Profile WHERE id = ?",
//     [userId],
//     (err, results) => {
//       if (err) {
//         return res.status(500).send("Error fetching profile data");
//       }
//       res.json(results[0]);
//     }
//   );
// });

/**
 * API source: https://www.back4app.com/database/back4app/occupations-and-job-titles/get-started/node-js/rest-api/node-fetch?objectClassSlug=job
 * Return sample:
 * 	{
		"results": [
			{
				"objectId": "F0GI0p8IhK",
				"title": "Application Development Director",
				"SOCDetailedGroup": {
					"objectId": "aNDofN5GQx",
					"code": "11-3021",
					"title": "Computer and Information Systems Managers"
				}
			},
			{
      "objectId": "B2AXz11KqA",
      "title": "Application Integration Engineer",
      "SOCDetailedGroup": {
        "objectId": "vMnoOwDUPr",
        "code": "15-1252",
        "title": "Software Developers",
			}
		}]
	}
 */
app.get("/api/loadCareers", async (req, res) => {
  const limit = 1000; // max count ~6540 as of March 12, 2024
  const where = encodeURIComponent(
    JSON.stringify({
      title: {
        $regex: "Software",
      },
      // "SOCDetailedGroup": {
      //   "__type": "Pointer",
      //   "className": "SOCDetailedGroup",
      //   "objectId": "" // e.g. vMnoOwDUPr
      // }
    })
  );

  ///////////////////////////////
  //// Test back4app App API ////
  ///////////////////////////////

  const urlTest = `https://parseapi.back4app.com/classes/Job?limit=${limit}&order=title&include=SOCDetailedGroup&keys=title,SOCDetailedGroup,SOCDetailedGroup.title&where=${where}`;
  const optionsTest = {
    method: "GET",
    headers: {
      "X-Parse-Application-Id": BFAAppId_test,
      "X-Parse-Master-Key": BFAMasterKey_test,
    },
  };
  const response = await fetch(urlTest, optionsTest);
  const data = await response.json();
  res.send(JSON.stringify(data, null, 2));

  ///////////////////////////////////
  //// Existing back4app App API ////
  ///////////////////////////////////

  // const url = `https://parseapi.back4app.com/classes/Occupations_Job?limit=10&order=title&include=SOCDetailedGroup&keys=title,SOCDetailedGroup,SOCDetailedGroup.title&where=${where}`;
  // const options =
  // {
  // 	method: 'GET',
  // 	headers: {
  // 		'X-Parse-Application-Id': '1Y6N2jk6a4c5tJ6JXRLg20Nb2p3d5SRnDKueO5fP', // My back4app application id
  // 		'X-Parse-REST-API-Key': 'SG7B8ujD7iYoi7Yq8hqVUwuNJrBr4tQ191UyDUmD', // My back4app rest api key
  // 	}
  // };
  // const response = await fetch(url, options);
  // const data = await response.json();
  // res.send({express: JSON.stringify(data, null, 2)});
});

/**
 * Loads all career categories from the back4app API
 */
app.get("/api/loadCareerCategories", async (req, res) => {
  const limit = 1000; // max count ~867 as of March 12, 2024

  const urlTest = `https://parseapi.back4app.com/classes/Job?limit=${limit}&order=SOCDetailedGroup&include=SOCDetailedGroup&keys=SOCDetailedGroup,SOCDetailedGroup.title`;
  const optionsTest = {
    method: "GET",
    headers: {
      "X-Parse-Application-Id": BFAAppId_test,
      "X-Parse-Master-Key": BFAMasterKey_test,
    },
  };
  const response = await fetch(urlTest, optionsTest);
  const data = await response.json();
  res.send(JSON.stringify(data, null, 2));
});

app.listen(port, () => console.log(`Listening on port ${port}`)); //for the dev version
