module.exports = {
    "posixGroup": {
        "objectClass": "posixGroup",
        "type": "structural",
        "inherit": [],
        "attributes": {
            "cn": {
                "type": "string",
                "maxLength": 32768,
                "required": true
            },
            "gidNumber": {
                "type": "integer",
                "required": true
            },
            "userPassword": {
                "type": "string",
                "maxLength": 128
            },
            "description": {
                "type": "string",
                "maxLength": 1024
            },
            "memberUid": {
                "type": "string"
            }
        }
    },
    
    "posixAccount": {
        "objectClass": "posixAccount",
        "type": "auxiliary",
        "inherit": [],
        "rdn": "uid",
        "attributes": {
            "cn": {
                "type": "string",
                "maxLength": 32768,
                "required": true
            },
            "gidNumber": {
                "type": "integer",
                "required": true
            },
            "homeDirectory": {
                "type": "string",
                "required": true
            },
            "uid": {
                "type": "string",
                "maxLength": 256,
                "required": true
            },
            "uidNumber": {
                "type": "integer",
                "required": true
            },
            "description": {
                "type": "string",
                "maxLength": 1024
            },
            "gecos": {
                "type": "string"
            },
            "loginShell": {
                "type": "string"
            },
            "userPassword": {
                "type": "string",
                "maxLength": 128
            }
        }
    }
};