
tryParseJSON = function(jsonString){
    try {
        var o = JSON.parse(jsonString);

        // Handle non-exception-throwing cases:
        // Neither JSON.parse(false) or JSON.parse(1234) throw errors, hence the type-checking,
        // but... JSON.parse(null) returns null, and typeof null === "object", 
        // so we must check for that, too. Thankfully, null is falsey, so this suffices:
        if (o && typeof o === "object") {
            return o;
        }
    }
    catch (e) { console.log(e); }

    return false;
};

getRandomArbitrary = function(min, max) {
  return Math.random() * (max - min) + min;
};

getSuperGlobal = function(superGlobalName, defaultValue){
    var findObj = {};
    findObj[superGlobalName] = { $exists: true};
    var objSuperGlobal = superGlobals.findOne(findObj);
    var theSuperGlobal = (objSuperGlobal) ? objSuperGlobal[superGlobalName] : defaultValue;
    return theSuperGlobal;
};

//console shenanigans
consoleHolder = console;

ERROR = 0x1;
WARN = 0x1 << 1;
DEBUG = 0x1 << 2;
FULL = ERROR | WARN | DEBUG;

debug = function debug(level){
    if ( (level & FULL) == FULL ) {
        console.debug("FULL");
        consoleHolder = console;
    }
    else {
        if ( ! (level & ERROR) ) {
            console.debug("Disabling ERROR log");
            console.error = function(){};
        }

        if ( ! (level & WARN) ) {
            console.debug("Disabling WARN log");
            console.warn = function(){};
        }

        if ( ! (level & DEBUG) ) {
            console.debug("Disabling DEBUG log");
            console.log = function(){};
            console.debug = function(){};
        }
    }
};
