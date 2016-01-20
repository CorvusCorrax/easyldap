module.exports = {
    "simpleSecurityObject": {
        "objectClass": "simpleSecurityObject",
        "type": "auxiliary",
        "inherit": [],
        "attributes": {
            "userPassword": {
                "type": "string",
                "maxLength": 128,
                "required": true
            }
        }
    },
    
    "dcObject": {
        "objectClass": "dcObject",
        "type": "auxiliary",
        "inherit": [],
        "rdn": "dc",
        "attributes": {
            "dc": {
                "type": "string",
                "required": true
            }
        }
    },
    
    "organizationalUnit": {
        "objectClass": "organizationalUnit",
        "type": "structural",
        "inherit": [],
        "rdn": "ou",
        "attributes": {
            "ou": {
                "type": "string",
                "maxLength": 32768,
                "required": true
            },
            "businessCategory": {
                "type": "string",
                "maxLength": 128
            },
            "description": {
                "type": "string",
                "maxLength": 1024
            },
            "destinationIndicator": {
                "type": "string",
                "maxLength": 128
            },
            "facsimileTelephoneNumber": {
                "type": "string"
            },
            "internationaliSDNNumber": {
                "type": "string",
                "maxLength": 16
            },
            "l": {
                "type": "string",
                "maxLength": 32768
            },
            "physicalDeliveryOfficeName": {
                "type": "string",
                "maxLength": 128
            },
            "postOfficeBox": {
                "type": "string",
                "maxLength": 40
            },
            "postalAddress": {
                "type": "string"
            },
            "postalCode": {
                "type": "string",
                "maxLength": 40
            },
            "preferredDeliveryMethod": {
                "type": "string"
            },
            "registeredAddress": {
                "type": "string"
            },
            "searchGuide": {
                "type": "string"
            },
            "seeAlso": {
                "type": "string"
            },
            "st": {
                "type": "string",
                "maxLength": 32768
            },
            "street": {
                "type": "string",
                "maxLength": 128
            },
            "telephoneNumber": {
                "type": "string",
                "maxLength": 32
            },
            "teletexTerminalIdentifier": {
                "type": "string"
            },
            "telexNumber": {
                "type": "string"
            },
            "userPassword": {
                "type": "string",
                "maxLength": 128
            },
            "x121Address": {
                "type": "string",
                "maxLength": 15
            }
        }
    },
    
    "person": {
        "objectClass": "person",
        "type": "structural",
        "inherit": [],
        "rdn": "cn",
        "attributes": {
            "cn": {
                "type": "string",
                "maxLength": 32768,
                "required": true
            },
            "sn": {
                "type": "string",
                "maxLength": 32768,
                "required": true
            },
            "description": {
                "type": "string",
                "maxLength": 1024
            },
            "seeAlso": {
                "type": "string"
            },
            "telephoneNumber": {
                "type": "string",
                "maxLength": 32
            },
            "userPassword": {
                "type": "string",
                "maxLength": 128
            }
        }
    },
    
    "organizationalPerson": {
        "objectClass": "organizationalPerson",
        "type": "structural",
        "inherit": ["person"],
        "attributes": {
            "destinationIndicator": {
                "type": "string",
                "maxLength": 128
            },
            "facsimileTelephoneNumber": {
                "type": "string"
            },
            "internationaliSDNNumber": {
                "type": "string",
                "maxLength": 16
            },
            "l": {
                "type": "string",
                "maxLength": 32768
            },
            "ou": {
                "type": "string",
                "maxLength": 32768
            },
            "physicalDeliveryOfficeName": {
                "type": "string",
                "maxLength": 128
            },
            "postOfficeBox": {
                "type": "string",
                "maxLength": 40
            },
            "postalAddress": {
                "type": "string"
            },
            "postalCode": {
                "type": "string",
                "maxLength": 40
            },
            "preferredDeliveryMethod": {
                "type": "string"
            },
            "registeredAddress": {
                "type": "string"
            },
            "st": {
                "type": "string",
                "maxLength": 32768
            },
            "street": {
                "type": "string",
                "maxLength": 128
            },
            "telephoneNumber": {
                "type": "string",
                "maxLength": 32
            },
            "teletexTerminalIdentifier": {
                "type": "string"
            },
            "telexNumber": {
                "type": "string"
            },
            "title": {
                "type": "string",
                "maxLength": 32768
            },
            "x121Address": {
                "type": "string",
                "maxLength": 15
            }
        }
    }
    
};