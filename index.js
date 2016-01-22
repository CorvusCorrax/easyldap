var ldapModule = require('ldapjs');
var Pool = require('generic-pool').Pool;
var _ = require('lodash');
var asynk = require('asynk');
var fs = require('fs');

var coreSchema = require('./schema/core');
var authldapSchema = require('./schema/authldap');
var nisSchema = require('./schema/nis');
var ldapSchema = require('./schema/ldap');
var basicSchemasList = [];
fs.readdir(__dirname + '/schema', function(err, filenames) {
    if(err) {
    }
    filenames.forEach(function(filename) {
        basicSchemasList.push(require('./schema/' + filename));
    });
});

var path = require('path');

var ldap = function(url, dn, callback) {
    var self = this;
    this.dn = dn;
    this.url = url;
    
    var schemas = _.assign.apply(null, basicSchemasList);
    
    this.pool = new Pool({
        name: 'ldap',
        
        create: function(cb) {
            if(!url || !dn || !_.isString(url) || !_.isString(dn)) {
                return cb(new Error('INVALID ARGUMENTS'));
            }
            var resultObject = {};
            resultObject.schema = {};
            
            resultObject.bind = function(ldapLogin, ldapPassword, cb) {
                this.ldapClient.bind(ldapLogin, ldapPassword, function(err) {
                    if(err) {
                        return cb(err);
                    }
                    return cb(null, ldap.prototype.createDn(ldapLogin));
                });
            };
            
            resultObject.unbind = function(cb) {
                this.ldapClient.unbind(function(err) {
                    if(err) {
                        return cb(err);
                    }
                    return cb(null);
                });
            };
            
            resultObject.ldapClient = ldapModule.createClient({url: url});
            _.keys(schemas).forEach(function(className) {
                
                this.getRules = function(objectClass, cb) {
                    var self = this;
                    var attributesRules = {};
                    var schema = schemas[objectClass];

                    if (!schema) {
                        return cb(new Error('NO CORRESPONDING OBJECTCLASS'));
                    }

                    attributesRules = schema.attributes;

                    // Check if object inherits
                    if (schema.inherit.length) {

                        // Get list of parents (recursively)
                        (function getParents(parentList, cb, classList) {
                            var classList = classList || [];
                            asynk.each(parentList, function(parentName, cb) {
                                if (!(parentName in classList)) {
                                    classList.push(parentName);
                                    var parentInherits = schemas[parentName].inherit;
                                    // If parent also inherit, get his parents
                                    if (parentInherits.length) {
                                        getParents(parentInherits, cb, classList);
                                    } else {
                                        cb(null);
                                    }

                                }
                            }).serie().done(function() {
                                cb(null, classList);
                            }).fail(cb);
                        })(schema.inherit, function(err, parentList) {
                            if (err) {
                                return cb(err);
                            }
                            
                            // Get attributes of each parents
                            parentList.forEach(function(parentName) {
                                attributesRules = _.assign(attributesRules, schemas[parentName].attributes);
                            });

                            cb(null, attributesRules);
                        });

                    } else {
                        cb(null, attributesRules);
                    }

                };

                this.getRules(className, function(err, schemaRules) {
                    if (err) {
                        console.log('ERROR WHILE INITIALIZING CLASSOBJECT : ', err);
                    }
                    
                    var mySchema = schemas[className];
                    mySchema.attributes = schemaRules;
                    
                    resultObject.findOperator = function(filter) {
                        if(filter.search('<=') !== -1) {
                            return '<=';
                        } else if(filter.search('>=') !== -1) {
                            return '>=';
                        } else if(filter.search('~=') !== -1) {
                            return '~=';
                        } else  {
                            return false;
                        }
                    };
                    
                    
                    resultObject.parseFilterLine = function(value, key, resultFilter) {
                        if (!key || !value) {
                            return null;
                        } else if (key === 'not') {
                            resultFilter.filter = resultFilter.filter + '(!';
                            _.each(value, function(value, key) {
                                resultObject.parseFilterLine(value, key, resultFilter);
                            });
                            resultFilter.filter = resultFilter.filter + ')';
                            
                        } else if (key === 'or') {
                            resultFilter.filter = resultFilter.filter + '(|';
                            _.each(value, function(value, key) {
                                resultObject.parseFilterLine(value, key, resultFilter);
                            });
                            resultFilter.filter = resultFilter.filter + ')';
                            
                        } else if (key === 'and') {
                            resultFilter.filter = resultFilter.filter + '(&';
                            _.each(value, function(value, key) {
                                resultObject.parseFilterLine(value, key, resultFilter);
                            });
                            resultFilter.filter = resultFilter.filter + ')';
                            
                        } else {
                            if(resultObject.findOperator(value)) {
                                resultFilter.filter = resultFilter.filter + '(' + key + value + ')';
                            } else {
                                resultFilter.filter = resultFilter.filter + '(' + key + '=' + value + ')';
                            }
                            
                        }
                    };
                    
                    resultObject.findOne = function(dn, options, cb) {
                        if(options && _.isFunction(options)) {
                            var cb = options;
                            var options = {};
                        }
                        if(!_.isPlainObject) {
                            return cb(new Error('OPTIONS MUST BE OBJECT'));
                        }
                        options.scope = 'one';
                        
                        resultObject.find(dn, options, function(err, result) {
                            if(err) {
                                return cb(err, result);
                            }
                            return cb(null, result);
                        });
                    };
                    
                    resultObject.findAll = function(dn, options, cb) {
                        if(options && _.isFunction(options)) {
                            var cb = options;
                            var options = {};
                        }
                        if(!_.isPlainObject) {
                            return cb(new Error('OPTIONS MUST BE OBJECT'));
                        }
                        options.scope = 'base';
                        
                        resultObject.find(dn, options, function(err, result) {
                            if(err) {
                                return cb(err, result);
                            }
                            return cb(null, result);
                        });
                    };
                    
                    resultObject.findAllSub = function(dn, options, cb) {
                        if(options && _.isFunction(options)) {
                            var cb = options;
                            var options = {};
                        }
                        if(!_.isPlainObject) {
                            return cb(new Error('OPTIONS MUST BE OBJECT'));
                        }
                        options.scope = 'sub';
                        
                        resultObject.find(dn, options, function(err, result) {
                            if(err) {
                                return cb(err, result);
                            }
                            return cb(null, result);
                        });
                    };
                    
                    resultObject.find = function(dn, options, cb) {
                        var resultFilter = {filter: ''};
                        _.each(options.filter, function(value, key) {
                            resultObject.parseFilterLine(value, key, resultFilter);
                        });
                        
                        if(resultFilter.filter !== '') {
                            options.filter = resultFilter.filter;
                        } else {
                            options.filter = '(objectclass=*)';
                        }
                        
                        // As of today, OpenLdap does not support server-side sorting
                        /*var control = new ldapModule.ServerSideSortingRequestControl({value:
                            {attributeType: 'givenName', orderingRule: 'caseIgnoreOrderingMatch'}
                        });*/

                        resultObject.ldapClient.search(dn.dn, options, function(err, res) {
                            if(err) {
                                return cb(new Error('SEARCH QUERY ERROR : ' + err));
                            }
                            var result = [];
                            res.on('searchEntry', function(entry) {
                                result.push(entry.object);
                            });
                            res.on('searchReference', function(referral) {
                                console.log('referral: ' + referral.uris.join());
                            });
                            res.on('error', function(err) {
                                console.error('error: ' + err.message);
                            });
                            res.on('end', function(message) {
                                if(message.status !== 0) {
                                    return cb(new Error('SEARCH QUERY ERROR STATUS : ' + message.status), result);
                                }
                                return cb(null, result);
                            });
                        });
                    };
                    
                    resultObject[className] = function(dn, name) {
                        var schemaClass = {
                            dn: dn,
                            name: name,
                            class: className,
                            schema: mySchema,
                            rdn: 'uid',
                            attributes: {},
                            
                            attrs: function(attributes) {
                                schemaClass.attributes = {};
                                _.each(attributes, function(value, key) {
                                    if (schemaClass.schema.attributes.hasOwnProperty(key)) {
                                        schemaClass.attributes[key] = value;
                                    }
                                });
                                return schemaClass;
                            },
                            
                            setRdn: function(rdn) {
                                schemaClass.rdn = rdn;
                                return schemaClass;
                            },
                            
                            add: function(cb) {
                                var entry = this.attributes;
                                entry.objectClass = this.class;
                                
                                resultObject.ldapClient.add(this.rdn + '=' + this.name + ',' + this.dn.dn, entry, function(err) {
                                    if(err) {
                                        return cb('ADD ERROR : ' + err);
                                    }
                                    return cb(null, schemaClass);
                                });
                            },
                            
                            update: function(cb) {
                                var change = {
                                    operation: 'replace',
                                    modification: this.attributes
                                };
                                
                                resultObject.ldapClient.modify(this.rdn + '=' + this.name + ',' + this.dn.dn, change, function(err) {
                                    if(err) {
                                        return cb('ADD ERROR : ' + err);
                                    }
                                    return cb(null, schemaClass);
                                });
                            },
                            
                            delete: function(cb) {
                                resultObject.ldapClient.del(this.rdn + '=' + this.name + ',' + this.dn.dn, function(err) {
                                    if(err) {
                                        return cb('ADD ERROR : ' + err);
                                    }
                                    return cb(null, schemaClass);
                                });
                            }
                            
                        };
                        return schemaClass;
                    };
                });
            });
            cb(null, resultObject);
        }
    });
    self.pool.acquire(function(err, client) {
        if (err) {
            return callback('ERROR WHILE INITIATING CLIENT');
        }
        return callback(null, client);
    });
    
};

ldap.prototype.createDn = function(ldapBase) {
    var dn = {
        dn: ldapBase,
        base: ldapBase,
        addSub: function(objectClass, rdn) {
            var resultDn = _.clone(this);
            resultDn.dn = objectClass + '=' + rdn + ',' + resultDn.dn;
            return resultDn;
        },
        cn: function(rdn) {
            return this.addSub('cn', rdn);
        },
        ou: function(rdn) {
            return this.addSub('ou', rdn);
        },
        parent: function() {
            if(this.dn === ldapBase) {
                return this;
            }
            this.dn = this.dn.substring(this.dn.indexOf(',')+1, this.dn.length);
            return this;
        }
    };
    var self = dn;
    return dn;
};

// Add schema to schema list
ldap.prototype.addSchema = function(schema) {
    this.schemas = _.assign(this.schemas, schema);
};

/*
ldap.prototype.checkRules = function(argumentsObject, attributesRules) {
    delete argumentsObject.objectClass;

    _.keys(attributesRules).forEach(function(attribute) {
        if (attributesRules[attribute].required && !(attribute in argumentsObject)) {
            return 'MISSING REQUIRED ATTRIBUTE : ' + attribute;
        }
        if (attribute in argumentsObject) {
            if (!typeof argumentsObject[attribute] === attributesRules[attribute].type) {
                return attribute + ' SHOULD BE ' + attributesRules[attribute].type + ' INSTEAD OF ' + typeof argumentsObject[attribute];
            }
            if (attributesRules[attribute].maxLength && argumentsObject[attribute].length > attributesRules[attribute].maxLength) {
                return 'INVALID ATTRIBUTE LENGTH : ' + attribute;
            }
        }
    });
    cb(null, null);
};
*/

module.exports = ldap;