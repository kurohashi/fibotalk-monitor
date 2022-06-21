let schema={
    "name": "Login event",
    "dimensions": {
        "appname": {
            "name": "appname",
            "isNull": "Null Not Allowed",
            "required": "Required",
            "datatype": "Number",
            "keyName": "appname",
            "children": {}
        },
        "address": {
            "name": "address",
            "isNull": "Null Not Allowed",
            "required": "Optional",
            "datatype": "Object",
            "keyName": "address",
            "children": {
                "address.m": {
                    "name": "m",
                    "isNull": "Null Allowed",
                    "required": "Required",
                    "datatype": "Object",
                    "keyName": "address.m",
                    "children": {
                      "address.m.mm": {
                        "name": "mm",
                        "isNull": "Null Allowed",
                        "required": "Optional",
                        "datatype": "String",
                        "keyName": "address.m.mm",
                        "children": {}
                      }
                    }
                  },
                "address.city": {
                    "name": "city",
                    "isNull": "Null Allowed",
                    "required": "Optional",
                    "datatype": "Array",
                    "keyName": "address.city",
                    "children": {}
                },
                "address.street": {
                    "name": "street",
                    "isNull": "Null Not Allowed",
                    "required": "Required",
                    "datatype": "String",
                    "keyName": "address.street",
                    "children": {}
                }
            }
        }
    }
}

let test1={
    "appname": 14124,
    "address": {
        "street":"412",
        "city":[234],
        "m":{}
    }
}

function monitor(schema, eventObj){
    function recurse(schema, eventObj, errorLog, path){
        let isNullAllowed=(s)=>s=="Null Allowed"?true:false
        let isRequired=(s)=>s=="Required"?true:false
        let returnTypeData=(value)=>(Array.isArray(value))?'Array':(typeof value).charAt(0).toUpperCase() + (typeof value).slice(1);
        let keyExists=(obj,key)=>obj.hasOwnProperty(key)
        
        for(let key in schema){
            let k=schema[key].name

            if(isRequired(schema[key].required)&&!keyExists(eventObj, k)){
                errorLog.push(`${key}-- Required key '${key}' does not exist in the event data`)
            } 
            
            if(keyExists(eventObj, k)){
                if(eventObj[k]==null && !isNullAllowed(schema[key].isNull)){
                    errorLog.push(`${key}-- ${schema[key]["required"]} not null key '${key}' has a null value`)
                }
                else if(eventObj[k]!=null&&schema[key]["datatype"]!=returnTypeData(eventObj[k])){
                    errorLog.push(`${key}-- ${schema[key]["required"]} key '${key}' has a different datatype than the one congifured`)
                }
                else if(schema[key]["datatype"]=='Object'){
                    recurse(schema[key].children, eventObj[k], errorLog, key)
                }
            } 
            
        }

        for(let k in eventObj){
            let key=(path=='')?k:path+'.'+k
            // console.log(schema)
            if(!keyExists(schema, key)){
                // console.log(schema)
                // console.log(key)
                // console.log(k)
                errorLog.push(`${key}-- '${key}' not given in schema but appeared in event data`)
            } 
        }
    }
    let err=[]
    recurse(schema.dimensions, eventObj, err, '')
    return err
}

// console.log(monitor(schema, test1))

module.exports = { monitor };