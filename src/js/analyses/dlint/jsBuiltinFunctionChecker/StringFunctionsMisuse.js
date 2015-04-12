/*
 * Copyright (c) 2015, University of California, Berkeley
 *
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 * 1. Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright
 * notice, this list of conditions and the following disclaimer in the
 * documentation and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */


// Author: Liang Gong (gongliang13@cs.berkeley.edu)

// check for the correct use of String (built-in) functions in JavaScript

(function(sandbox) {
    function MyAnalysis() {
        var iidToLocation = sandbox.iidToLocation;
        var DLintWarning = sandbox.DLint.DLintWarning;
        var Utils = sandbox.Utils;

        var iidToCount = {}; // iid: number --> count: number
        var iidToInfo = {}; // iid: number --> info: object
        var additionalInfo = {
            hasInfo: false,
            addMsg: function(msg) {
                this.hasInfo = true;
                this[msg] = this[msg] | 0 + 1;
            }
        };

        function addDebugInfo(iid, msg) {
            if (!iidToInfo[iid]) {
                iidToInfo[iid] = {};
            }
            iidToInfo[iid][msg] = (iidToInfo[iid][msg] | 0) + 1;
        }

        // ---- function DB and check API starts ----
        var functionDB = {};

        function addEntry(name, targetFunction, checkerFunction) {
            functionDB[name] = {
                target: targetFunction,
                checker: checkerFunction
            };
        }

        function checkFunction(f, args) {
            for (var prop in functionDB) {
                if (!functionDB.hasOwnProperty(prop)) continue;
                var item = functionDB[prop];
                if (item.target === f) {
                    item.checker.apply({}, args);
                }
            }
        }

        // ---- function DB and check API ends ----

        function argsToString(args) {
            var ret = '[';
            var i = 0;
            for (i = 0; i < args.length - 1; i++) {
                ret += (typeof args[i]) + ',';
            }
            if (i < args.length) {
                ret += (typeof args[i]);
            }
            ret += ']';
            return ret;
        }

        // String.prototype.indexOf
        addEntry('String.prototype.indexOf', String.prototype.indexOf,
            function(iid, f, base, args, result, isConstructor, isMethod) {
                if (args.length < 1 || args.length > 2) {
                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                    addDebugInfo(iid, 'function String.indexOf should take only one or two arguments. \n Runtime Args: ' + argsToString(args));
                } else {
                    if (args.length === 1) {
                        if (typeof args[0] !== 'string') {
                            iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                            addDebugInfo(iid, 'the first argument of function String.indexOf should be a string value. \n Runtime Args: ' + argsToString(args));
                        }
                    } else if (args.length === 2) {
                        if (typeof args[0] !== 'string' || !Utils.isInteger(args[1])) {
                            iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                            addDebugInfo(iid, 'the arguments\' type of function String.indexOf should be string (-> int) -> int. \n Runtime Args: ' + argsToString(args));
                        }
                    }
                }
            }
        );

        // String.prototype.charAt
        addEntry('String.prototype.charAt', String.prototype.charAt,
            function(iid, f, base, args, result, isConstructor, isMethod) {
                if (args.length !== 1) {
                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                    addDebugInfo(iid, 'function String.prototype.charAt should take only one argument. \n Runtime Args: ' + argsToString(args));
                } else {
                    if (!Utils.isInteger(args[0])) {
                        iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                        addDebugInfo(iid, 'the first argument of function String.prototype.charAt should be an integer. \n Runtime Args: ' + argsToString(args));
                    }
                }
            }
        );

        // String.prototype.charCodeAt
        addEntry('String.prototype.charCodeAt', String.prototype.charCodeAt,
            function(iid, f, base, args, result, isConstructor, isMethod) {
                if (args.length !== 1) {
                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                    addDebugInfo(iid, 'function String.prototype.charCodeAt should take only one argument. \n Runtime Args: ' + argsToString(args));
                } else {
                    if (!Utils.isInteger(args[0])) {
                        iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                        addDebugInfo(iid, 'the first argument of function String.prototype.charCodeAt should be an integer. \n Runtime Args: ' + argsToString(args));
                    }
                }
            }
        );

        // String.prototype.concat
        addEntry('String.prototype.concat', String.prototype.concat,
            function(iid, f, base, args, result, isConstructor, isMethod) {
                if (args.length < 1) {
                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                    addDebugInfo(iid, 'function String.prototype.concat should take at least one argument. \n Runtime Args: ' + argsToString(args));
                } else {
                    check_args:
                    for(var i=0;i<args.length;i++) {
                        if (typeof args[i] !== 'string') {
                            iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                            addDebugInfo(iid, 'the first argument of function String.prototype.concat should be an integer. \n Runtime Args: ' + argsToString(args));
                            break check_args;
                        }
                    }
                }
            }
        );

        // String.prototype.lastIndexOf
        addEntry('String.prototype.lastIndexOf', String.prototype.lastIndexOf,
            function(iid, f, base, args, result, isConstructor, isMethod) {
                if (args.length < 1 || args.length > 2) {
                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                    addDebugInfo(iid, 'function String.prototype.lastIndexOf should take only one or two arguments. \n Runtime Args: ' + argsToString(args));
                } else {
                    if (args.length === 1) {
                        if (typeof args[0] !== 'string') {
                            iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                            addDebugInfo(iid, 'the first argument of function String.prototype.lastIndexOf should be a string value. \n Runtime Args: ' + argsToString(args));
                        }
                    } else if (args.length === 2) {
                        if (typeof args[0] !== 'string' || !Utils.isInteger(args[1])) {
                            iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                            addDebugInfo(iid, 'the arguments\' type of function String.prototype.lastIndexOf should be string (-> int) -> int. \n Runtime Args: ' + argsToString(args));
                        }
                    }
                }
            }
        );
        
        // not all environment supports this function
        if(String.prototype.localeCompare) {
            // String.prototype.localeCompare
            addEntry('String.prototype.localeCompare', String.prototype.localeCompare,
                function(iid, f, base, args, result, isConstructor, isMethod) {
                    if (args.length < 1 || args.length > 3) {
                        iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                        addDebugInfo(iid, 'function String.prototype.localeCompare should take only 1~3 arguments. \n Runtime Args: ' + argsToString(args));
                    } else {
                        if (args.length === 1) {
                            if (typeof args[0] !== 'string') {
                                iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                                addDebugInfo(iid, 'the first argument of function String.prototype.localeCompare should be a string value. \n Runtime Args: ' + argsToString(args));
                            }
                        } else if (args.length === 2) {
                            if (typeof args[0] !== 'string' || typeof args[1] !== 'string') {
                                iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                                addDebugInfo(iid, 'the arguments\' type of function String.prototype.localeCompare should be string ((-> string) -> object) -> int. \n Runtime Args: ' + argsToString(args));
                            } else if(args[1] !== 'co' && args[1] !== 'kn' && args[2] !== 'kf') {
                                iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                                addDebugInfo(iid, 'the second argument of function String.prototype.localeCompare should be a locale string of value "co" or "kn" or "kf" \n Runtime Args: ' + argsToString(args));
                            }
                        } else if (args.length === 3) {
                            if (typeof args[0] !== 'string' || typeof args[1] !== 'string') {
                                iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                                addDebugInfo(iid, 'the arguments\' type of function String.prototype.localeCompare should be string ((-> string) -> object) -> int. \n Runtime Args: ' + argsToString(args));
                            } else if(args[1] !== 'co' || args[1] !== 'kn' || args[2] !== 'kf') {
                                iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                                addDebugInfo(iid, 'the second argument of function String.prototype.localeCompare should be a locale string of value "co" or "kn" or "kf". \n Runtime Args: ' + argsToString(args));
                            } else if (typeof args[2] !== 'object'){
                                iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                                addDebugInfo(iid, 'the third argument of function String.prototype.localeCompare should be a configuration object. \n Runtime Args: ' + argsToString(args));
                            } else {
                                var config_obj = args[2];
                                if(config_obj.localeMatcher && (config_obj.localeMatcher !== 'lookup') && (config_obj.localeMatcher !== 'best fit')) {
                                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                                    addDebugInfo(iid, 'the third argument of function String.prototype.localeCompare should be a configuration object. The localeMatcher property of that object should be of value "lookup" or "best fit". \n Runtime property value: ' + config_obj.localeMatcher);
                                } else if(config_obj.usage && (config_obj.usage !== 'sort') && (config_obj.usage !== 'search')) {
                                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                                    addDebugInfo(iid, 'the third argument of function String.prototype.localeCompare should be a configuration object. The usage property of that object should be of value "sort" or "search". \n Runtime property value: ' + config_obj.usage);
                                } else if(config_obj.sensitivity && (config_obj.sensitivity !== 'base') && (config_obj.sensitivity !== 'accent') && (config_obj.sensitivity !== 'case') && (config_obj.sensitivity !== 'variant')) {
                                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                                    addDebugInfo(iid, 'the third argument of function String.prototype.localeCompare should be a configuration object. The sensitivity property of that object should be of value "base" or "accent" or "case" or "variant". \n Runtime property value: ' + config_obj.sensitivity);
                                } else if(config_obj.ignorePunctuation && (typeof config_obj.ignorePunctuation !== 'boolean')) {
                                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                                    addDebugInfo(iid, 'the third argument of function String.prototype.localeCompare should be a configuration object. The ignorePunctuation property of that object should be of boolean value true or false. \n Runtime property value type: ' + (typeof config_obj.ignorePunctuation));
                                } else if(config_obj.numeric && (typeof config_obj.numeric !== 'boolean')) {
                                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                                    addDebugInfo(iid, 'the third argument of function String.prototype.localeCompare should be a configuration object. The numeric property of that object should be of boolean value true or false. \n Runtime property value type: ' + (typeof config_obj.numeric));
                                } else if(config_obj.caseFirst && (config_obj.caseFirst !== 'upper') && (config_obj.caseFirst !== 'lower') && (config_obj.caseFirst !== 'false')) {
                                    iidToCount[iid] = (iidToCount[iid] | 0) + 1;
                                    addDebugInfo(iid, 'the third argument of function String.prototype.localeCompare should be a configuration object. The caseFirst property of that object should be of value "upper" or "lower" or "false". \n Runtime property value: ' + config_obj.caseFirst);
                                } 
                            }
                        }
                    }
                }
            );
        }
        

        // String.prototype.match
        // String.prototype.replace
        // String.prototype.search
        // String.prototype.split
        // String.prototype.substr
        // String.prototype.substring
        // String.prototype.toLocaleLowerCase
        // String.prototype.toLocaleUpperCase
        // String.prototype.toString
        // String.prototype.toUpperCase
        // String.prototype.trim
        // String.prototype.valueOf
        // String.prototype.anchor
        // String.prototype.link

        this.invokeFun = function(iid, f, base, args, result, isConstructor, isMethod) {
            checkFunction(f, arguments);
        };

        this.endExecution = function() {
            iidToInfo = Utils.reorganizeDebugInfo(iidToInfo);
            var warnings = Object.keys(iidToCount).map(function(iid) {
                var location = iidToLocation(iid);
                var ret = new DLintWarning("StringFunctionsMisuse", iid, location,
                    "Incorrect use of String built-in funcitons at " +
                    location + " " + iidToCount[iid] + " time(s).", iidToCount[iid]);
                ret.debugInfo = iidToInfo[iid];
                ret.addInfo = JSON.stringify(additionalInfo);
                return ret;
            });
            sandbox.DLint.addWarnings(warnings);
        };
    }
    sandbox.analysis = new MyAnalysis();
})(J$);