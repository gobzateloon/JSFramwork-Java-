/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function JSframwork(name) {
    this.filename = name;
    var that = this;
    this.methodsreadback = function (data) {
        for (var i = 0; i < data.Methods.length; i++) {
            if (data.Methods[i].startsWith("Sync_")) {
                that[data.Methods[i].replace("Sync_","")] = new Function("\
                    var paras = [];\
                    for (var i = 0; i < arguments.length; i++){\
                       paras.push(arguments[i]);\
                    }\n\
                    var result = $.ajax({type: \"POST\",url: '" + that.filename + "',data:{run:'" + data.Methods[i].replace("Sync_","") + "',para:paras},async: false}).responseText;\
                    return JSON.parse(result).Return;\n\
                ");
            } else {
                that[data.Methods[i]] = new Function("\
                    var paras = [];\
                    var oldcallback = arguments[arguments.length-1];\
                    var fun = (typeof oldcallback === 'function');\
                    var callback = function (data){\
                        var obj = JSON.parse(data);\
                        oldcallback(obj.Return);\
                    };\
                    if(fun){\
                        for (var i = 0; i < arguments.length-1; i++){\
                            paras.push(arguments[i]);\
                        }\
                        $.post('" + that.filename + "',{run:'" + data.Methods[i] + "',para:paras},callback);\n\
                    }else{\
                        for (var i = 0; i < arguments.length; i++){\
                            paras.push(arguments[i]);\
                        }\
                        $.post('" + that.filename + "',{run:'" + data.Methods[i] + "',para:paras});\n\
                    }\
                ");
            }
        }
    };
    this.getMethods = function () {
        $.getJSON(this.filename, this.methodsreadback);
    };
    this.getMethods();
}