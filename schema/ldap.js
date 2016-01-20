module.exports = {
    "inetOrgPerson": {
        "objectClass": "inetOrgPerson",
        "type": "structural",
        "rdn": "uid",
        "inherit": ["organizationalPerson"],
        "attributes": {
            "audio": {
                "type": "binary"
            },
            "businessCategory": {
                "type": "string",
                "maxLength": 128
            },
            "carLicense": {
                "type": "string"
            },
            "departmentNumber": {
                "type": "string"
            },
            "displayName": {
                "type": "string"
            },
            "employeeNumber": {
                "type": "string"
            },
            "employeeType": {
                "type": "string"
            },
            "givenName": {
                "type": "string",
                "maxLength": 32768
            },
            "homePhone": {
                "type": "string"
            },
            "homePostalAddress": {
                "type": "string"
            },
            "initials": {
                "type": "string",
                "maxLength": 32768
            },
            "jpegPhoto": {
                "type": "binary"
            },
            "labeledURI": {
                "type": "string"
            },
            "mail": {
                "type": "string",
                "maxLength": 256
            },
            "manager": {
                "type": "string"
            },
            "mobile": {
                "type": "string"
            },
            "o": {
                "type": "string",
                "maxLength": 32768
            },
            "pager": {
                "type": "string"
            },
            "photo": {
                "type": "binary"
            },
            "preferredLanguage": {
                "type": "string"
            },
            "roomNumber": {
                "type": "string",
                "maxLength": 256
            },
            "secretary": {
                "type": "string"
            },
            "userCertificate": {
                "type": "string"
            },
            "userPKCS12": {
                "type": "binary"
            },
            "userSMIMECertificate": {
                "type": "binary"
            },
            "x500UniqueIdentifier": {
                "type": "string"
            }
        }
    }
};