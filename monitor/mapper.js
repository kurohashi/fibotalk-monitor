let data={
    "events": [
        {
            "name": "Login event",
            "eventGUI": "ap-e8-dr",
            "creator": "dummy local user",
            "editor": "dummy local user",
            "startTime": 1655704880201,
            "editTime": 1655704880201,
            "desc": "",
            "dimensions": [
                {
                    "name": "appname",
                    "desc": "",
                    "isNull": "Null Not Allowed",
                    "required": "Required",
                    "datatype": "String",
                    "parentChildKey": "1:0",
                    "parentChildPrefix": "",
                    "expanded": true,
                    "keyName": "appname",
                    "creator": "dummy local user",
                    "editor": "dummy local user",
                    "startTime": 1655704929697,
                    "editTime": 1655704929697
                },
                {
                    "name": "address",
                    "desc": "",
                    "isNull": "Null Not Allowed",
                    "required": "Optional",
                    "datatype": "Object",
                    "parentChildKey": "2:0",
                    "parentChildPrefix": "",
                    "expanded": false,
                    "keyName": "address",
                    "creator": "dummy local user",
                    "editor": "dummy local user",
                    "startTime": 1655705047057,
                    "editTime": 1655705047057
                },
                {
                    "name": "street",
                    "desc": "",
                    "isNull": "Null Allowed",
                    "required": "Optional",
                    "datatype": "String",
                    "parentChildKey": "2:0:1",
                    "parentChildPrefix": "address.",
                    "expanded": true,
                    "keyName": "address.street",
                    "creator": "dummy local user",
                    "editor": "dummy local user",
                    "startTime": 1655705047057,
                    "editTime": 1655705047057
                },
                {
                    "name": "m",
                    "desc": "",
                    "isNull": "Null Allowed",
                    "required": "Optional",
                    "datatype": "Object",
                    "parentChildKey": "2:0:1",
                    "parentChildPrefix": "address.",
                    "expanded": true,
                    "keyName": "address.m",
                    "creator": "dummy local user",
                    "editor": "dummy local user",
                    "startTime": 1655705047057,
                    "editTime": 1655705047057
                },
                {
                    "name": "mm",
                    "desc": "",
                    "isNull": "Null Allowed",
                    "required": "Optional",
                    "datatype": "String",
                    "parentChildKey": "2:0:1",
                    "parentChildPrefix": "address.",
                    "expanded": true,
                    "keyName": "address.m.mm",
                    "creator": "dummy local user",
                    "editor": "dummy local user",
                    "startTime": 1655705047057,
                    "editTime": 1655705047057
                },
                {
                    "name": "city",
                    "desc": "",
                    "isNull": "Null Allowed",
                    "required": "Optional",
                    "datatype": "String",
                    "parentChildKey": "2:0:2",
                    "parentChildPrefix": "address.",
                    "expanded": true,
                    "keyName": "address.city",
                    "creator": "dummy local user",
                    "editor": "dummy local user",
                    "startTime": 1655705047057,
                    "editTime": 1655705047057
                }
            ]
        }
    ],
    "user": [
        {
            "name": "name",
            "desc": "",
            "isNull": "Null Not Allowed",
            "required": "Required",
            "datatype": "String",
            "parentChildKey": "1:0",
            "parentChildPrefix": "",
            "expanded": true,
            "keyName": "name",
            "creator": "dummy local user",
            "editor": "dummy local user",
            "startTime": 1655705083178,
            "editTime": 1655705083178
        },
        {
            "name": "role",
            "desc": "",
            "isNull": "Null Allowed",
            "required": "Optional",
            "datatype": "String",
            "parentChildKey": "2:0",
            "parentChildPrefix": "",
            "expanded": true,
            "keyName": "role",
            "creator": "dummy local user",
            "editor": "dummy local user",
            "startTime": 1655705110068,
            "editTime": 1655705110068
        }
    ],
    "group": [
        {
            "name": "companyname",
            "desc": "",
            "isNull": "Null Not Allowed",
            "required": "Required",
            "datatype": "String",
            "parentChildKey": "1:0",
            "parentChildPrefix": "",
            "expanded": true,
            "keyName": "companyname",
            "creator": "dummy local user",
            "editor": "dummy local user",
            "startTime": 1655705134803,
            "editTime": 1655705134803
        },
        {
            "name": "companyid",
            "desc": "",
            "isNull": "Null Not Allowed",
            "required": "Optional",
            "datatype": "Number",
            "parentChildKey": "2:0",
            "parentChildPrefix": "",
            "expanded": true,
            "keyName": "companyid",
            "creator": "dummy local user",
            "editor": "dummy local user",
            "startTime": 1655705163578,
            "editTime": 1655705163578
        }
    ],
    "IsLatest": true,
    "planID": "pp9t-61ro-8w72"
}


function mapper(originalSchema){
    function arrayToObject(dimensions, originalDimentions){
        for(let j in originalDimentions){
            let keyName=originalDimentions[j].keyName.split('.')
            let path=''
            let d=dimensions
            // console.log(keyName)
            for(let m in keyName){
                let name=keyName[m]
                // console.log(name)
                path=(path=='')?name:path+'.'+name

                
                if(m!=keyName.length-1){
                    if(!d.hasOwnProperty(path)){
                        // if(path=="address.m"){
                        //     console.log('here')
                        //     console.log(d)
                        // }
                        d[path]={
                            "name": name,
                            "isNull": null,
                            "required": null,
                            "datatype": null,
                            "keyName": path,
                            "children": {}
                        }
                    }
                }
                else{
                    if(!d.hasOwnProperty(path)){
                        
                        d[path]={
                            "name": name,
                            "isNull": originalDimentions[j].isNull,
                            "required": originalDimentions[j].required,
                            "datatype": originalDimentions[j].datatype,
                            "keyName": path,
                            "children": {}
                        }
                        if(path=="address.m"){
                            console.log(d)
                        }
                    }
                    else{
                        d[path].isNull=originalDimentions[j].isNull
                        d[path].required=originalDimentions[j].required
                        d[path].datatype=originalDimentions[j].datatype
                    }
                    
                }
                d=d[path].children
                }
            }
    }

    let schema={}
    
    //events
    schema.events={}
    for(let i in originalSchema.events){
        schema.events[originalSchema.events[i].name]={
            "name": originalSchema.events[i].name,
            "dimensions": {}
        }
        let dimensions=schema.events[originalSchema.events[i].name].dimensions
        let originalDimentions=originalSchema.events[i].dimensions
        arrayToObject(dimensions, originalDimentions)
        }
    //user
    schema.user={
            "dimensions": {}
        }
    let userDimensions=originalSchema.user
    arrayToObject(schema.user.dimensions, userDimensions)

    //group
    schema.group={
        "dimensions": {}
    }
    let groupDimensions=originalSchema.group
    arrayToObject(schema.group.dimensions, groupDimensions)

    return schema
}
// console.log(JSON.stringify(mapper(data),2,2))

module.exports = { mapper };