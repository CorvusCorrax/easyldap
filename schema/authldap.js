module.exports = {
    "CourierDomainAlias": {
        "objectClass": "CourierDomainAlias",
        "type": "auxiliary",
        "inherit": [],
        "attributes": {
            "virtualdomain": {
                "type": "string",
                "required": true
            },
            "virtualdomainuser": {
                "type": "string",
                "required": true
            },
            "description": {
                "type": "string",
                "maxLength": 1024
            },
            "mailsource": {
                "type": "string"
            }
        }
    },
    
    "CourierMailAccount": {
        "objectClass": "CourierMailAccount",
        "type": "auxiliary",
        "inherit": [],
        "attributes": {
            "homeDirectory": {
                "type": "string",
                "required": true
            },
            "mail": {
                "type": "string",
                "maxLength": 256,
                "required": true
            },
            "clearPassword": {
                "type": "string",
                "maxLength": 128
            },
            "cn": {
                "type": "string",
                "maxLength": 32768
            },
            "defaultdelivery": {
                "type": "string"
            },
            "description": {
                "type": "string",
                "maxLength": 1024
            },
            "disableimap": {
                "type": "string"
            },
            "disablepop3": {
                "type": "string"
            },
            "disableshared": {
                "type": "string"
            },
            "disablewebmail": {
                "type": "string"
            },
            "gecos": {
                "type": "string"
            },
            "gidNumber": {
                "type": "integer"
            },
            "loginShell": {
                "type": "string"
            },
            "mailbox": {
                "type": "string"
            },
            "mailHost": {
                "type": "string",
                "maxLength": 256
            },
            "quota": {
                "type": "string"
            },
            "sharedgroup": {
                "type": "string"
            },
            "uid": {
                "type": "string",
                "maxLength": 256
            },
            "uidNumber": {
                "type": "integer"
            },
            "userPassword": {
                "type": "string",
                "maxLength": 128
            }
        }
    }
    
};