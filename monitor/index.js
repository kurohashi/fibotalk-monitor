const { json } = require('body-parser');
const express = require('express');
const redis = require('redis');
const { monitor } = require("./monitor.js");
const { mapper } = require("./mapper.js");

const client = redis.createClient();
const app = express();

const PORT = 3000;


// let s={
//     "name": "Login event",
//     "dimensions": {
//         "appname": {
//             "name": "appname",
//             "isNull": "Null Not Allowed",
//             "required": "Required",
//             "datatype": "Number",
//             "keyName": "appname",
//             "children": {}
//         },
//         "address": {
//             "name": "address",
//             "isNull": "Null Not Allowed",
//             "required": "Optional",
//             "datatype": "Object",
//             "keyName": "address",
//             "children": {
//                 "address.m": {
//                     "name": "m",
//                     "isNull": "Null Allowed",
//                     "required": "Required",
//                     "datatype": "Object",
//                     "keyName": "address.m",
//                     "children": {
//                       "address.m.mm": {
//                         "name": "mm",
//                         "isNull": "Null Allowed",
//                         "required": "Optional",
//                         "datatype": "String",
//                         "keyName": "address.m.mm",
//                         "children": {}
//                       }
//                     }
//                   },
//                 "address.city": {
//                     "name": "city",
//                     "isNull": "Null Allowed",
//                     "required": "Optional",
//                     "datatype": "Array",
//                     "keyName": "address.city",
//                     "children": {}
//                 },
//                 "address.street": {
//                     "name": "street",
//                     "isNull": "Null Not Allowed",
//                     "required": "Required",
//                     "datatype": "String",
//                     "keyName": "address.street",
//                     "children": {}
//                 }
//             }
//         }
//     }
// }



// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Homme page
app.get('/', (req, res) => {
  return res.send("<h1 style='text-align: center;'>Hello,<br />from the Express.js server!</h1>");
})


app.post('/monitor', async (req, res) => {
  let event = req.body.event;
  let eventName = req.body.name
  let gid = (req.body.gid)
  let planId = (req.body.planid)
  let key = `${gid}:${planId}:${eventName}`

  await client.connect()
  
  console.log(key, await client.exists(key));
  if (await client.exists(key) != 1) {
    console.log("does not exist");
    return res.json({ status: 400 });
  } else {
    let schemaData = await client.get(key)
    if (!schemaData) {
      console.log("schema not found")
      return res.json({ status: 400 });
    }
    let schema = JSON.parse(schemaData)
    let errorLog = (monitor(schema, event))
    if (typeof errorLog !== 'undefined' && errorLog.length === 0) {
      console.log('no errors')
    } else { console.log(errorLog) }
  }

  // for(let i in err){
  //     let errMessg=err[i]
  //     await client.lPush(key+':error', errMessg)
  // }
  await client.quit()
  res.json(req.body);
});


app.post('/setschema', async (req, res) => {
  let originalSchema = req.body.schema;
  let gid = (req.body.gid)
  let planId = (req.body.planid)

  let newSchema = mapper(originalSchema)
  await client.connect()
  for (let i in newSchema.events) {
    let eventSchema = newSchema.events[i]
    await client.set(`${gid}:${planId}:${eventSchema.name}`, JSON.stringify(eventSchema))
  }
  await client.quit()
  console.log(JSON.stringify(newSchema, 2, 2))
  res.json(req.body);
});


// About page
app.get('/about', (req, res) => {
  return res.send('<h2 style="text-align:center">About us</h2>');
})

// 404 page
app.use((req, res, next) => {
  res.status(404);

  // respond with html page
  if (req.accepts('html')) {
    res.sendFile(__dirname + '/error404.html');
    return;
  }
  // respond with json
  else if (req.accepts('json')) {
    res.send({
      status: 404,
      error: 'Not found'
    });
    return;
  }
  // respond with text
  else {
    res.type('txt').send('Error 404 - Not found');
  }
});

// Listening to the port
app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}`);
});