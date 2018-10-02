/**
 * Unified wrapper for Jquery drag & drop
 *
 */
//
// var a = Object.assign(new DDAttribute({class:[1]}), new DDAttribute({zz:[2]}));
// console.log(a);
//
const DD = {

    new : {

        list : {},
        event : null
    },

    update : {

        handlers: {},

        trigger : function () {

            for(let k in DD.update.handlers) {

                DD.update.handlers[k]();
            }
        }
    },

    boot : {

        handlers : {},

        selector : function (selector) {

            selector = $(selector);

            for(let k in DD.boot.handlers) {

                DD.boot.handlers[k](selector);
            }
        }
    }
};


// const DDUpdate = {
//
//     events: {},
//
//     trigger : function () {
//
//         $.each(DDUpdate.events, function(k, v) {
//
//             v();
//         });
//     }
// };
//
// const DDInit = {
//
//     events: {},
//
//     trigger : function (selector) {
//
//         var selector = $(selector);
//
//         for(let k in DDInit.events) {
//
//             DDInit.events[k](selector);
//         }
//     }
// };

// DD.init = function (selector) {
//
//     DD.setTo($(selector));
//     DDUpdate.trigger();
// };

const DDNew = {
    list : {},
    event : null
};



function identifier(selector = false) {

    return selector ? '.' + this.name : this.name ;
}

function DDAttribute ($list = {}, $named = {}) {

    var named = {};
    var list = {};

    this.named = function (name) {

        if(!named.hasOwnProperty(name)) {

            named[name] = {};
        }

        return named[name];
    };

    this.list = function (name) {

        if(!list.hasOwnProperty(name)) {

            list[name] = [];
        }

        return list[name];
    };

    this.toString = function() {

        let object = {};

        for (let key in named) {

            object[key] = Object.values(named[key]);
        }

        for(let key in list) {

            if(!(key in object)) {

                object[key] = [];
            }

            object[key].push(...list[key]);
        }

        var attributes = [];

        for (let key in object) {

            var value = Object.values(object[key]).join(' ');
            value = value.trim();

            if(value.length > 0) {

                attributes.push(`${key}="${value}"`);
            }
        }

        return attributes.join(' ');
    };

    for (let key in $list) {

        this.list(key).push(...$list[key]);
    }

    for (let key in $named) {

        let obj = this.named(key);
        obj = Object.assign(obj, $named[key]);
    }
};






//
//
//
//
//
//
// function DDAttribute (obj) {
//
//     if(!obj.hasOwnProperty(this.constructor.name)) {
//
//         obj[this.constructor.name] = {
//             named : {},
//             list : {}
//         };
//     }
//
//     var named = obj[this.constructor.name].named;
//     var list = obj[this.constructor.name].list;
//
//     this.named = function (name) {
//
//         if(!named.hasOwnProperty(name)) {
//
//             named[name] = {};
//         }
//
//         return named[name];
//     };
//
//     this.list = function (name) {
//
//         if(!list.hasOwnProperty(name)) {
//
//             list[name] = [];
//         }
//
//         return list[name];
//     };
//
//     this.toString = function() {
//
//         let object = {};
//
//         for (let key in named) {
//
//             object[key] =
//                 Object.values(named[key]);
//         }
//
//         for(let key in list) {
//
//             if(!object.hasOwnProperty(key)) {
//
//                 object[key] = [];
//             }
//
//             console.log(list[key]);
//
//             object[key].push(...list[key]);
//         }
//
//         var attributes = [];
//
//         for (let key in object) {
//
//             var value = Object.values(object[key]).join(' ');
//             value = value.trim();
//
//             if(value.length > 0) {
//
//                 attributes.push(`${key}="${value}"`);
//             }
//         }
//
//         return attributes.join(' ');
//     }
//
// };

//
// var a = {};
// (new DDAttribute(a)).list('class').push('a aa aaa');
// (new DDAttribute(a)).named('id')['A'] = 'A';
//
//
// var b = {};
// (new DDAttribute(b)).list('class').push('b bb bbb');
// (new DDAttribute(b)).named('id')['B'] = 'B';
//
// console.log((new DDAttribute(a)).toString());
// console.log((new DDAttribute(b)).toString());
//
//

function tag(tag = 'div') {

    this.set  = function ($tag) {

        console.assert(typeof $tag === "string");
        console.assert($tag.length > 0);

        tag = $tag;
    };

    this.toString = function () {

        return tag;
    }
}


function DDElement(content = '', tag = 'div', attribute = '') {

    this.attribute = attribute;
    this.tag  = tag;
    this.content = content;

    this.toString = function() {

        let open = `${this.tag} ${this.attribute}`.trim();

        return `<${open}>${this.content}</${this.tag}>`;
    };
}

function DDLateBind(object) {

    object.attribute.named('class')[this.identifier()] = this.identifier();
}

function DDContainer(attribute = new DDAttribute, content = new DDPanel) {

    let self = this.constructor;

    this.attribute = attribute;
    this.content = content;

    this.constructor.lateBind(this);

    this.setTo = function(jquery) {

        this.content.setTo(jquery);
        jquery.addClass(self.identifier());
    };
}

DDContainer.identifier = identifier;
DDContainer.lateBind = DDLateBind;

DDContainer.fromInner = function (jquery) {

    if(!jquery.hasClass(this.identifier())) {

        jquery = jquery.parents(this.identifier(true)).first();
    }

    return jquery;
};


function DDItems(items = {}) {

    this.content = items;

    this.toString = function () {

        return Object.values(items).join('');
    }
}


function DDPanel(attribute = new DDAttribute) {

    let self = this.constructor;

    this.attribute = attribute;

    this.constructor.lateBind(this);

    this.setTo = function(jquery) {

        self.fromContainer(jquery).remove();
        jquery.prepend(this.toString());
    }
}


DDPanel.lateBind = DDLateBind;
DDPanel.identifier = identifier;

DDPanel.fromContainer = function (jquery) {

    return jquery.children(this.identifier(true)).first();
};




function DDClick(click, handler = function () {}, attribute = new DDAttribute()) {

    this.attribute = attribute;

    attribute.named('class')[click] = click;

    this.setHandler = function($handler) {

        handler = $handler;
    };

    function update() {

        $('.' + click).off('click').click(function (e) {

            handler(e);

        });
    }

    DD.update.handlers[click] = update;
}







function DDModal (bind = '', header = '', content = '', footer = '') {

    this.bind = bind;
    this.header = header;
    this.content = content;
    this.footer = footer;

    // constructor(bind, $attributes = new DDAttribute()) {
    //
    //     super($attributes, 'div');
    //
    //     attribute.associative('class')[bind] = bind;
    //
    //     this.attribute.list('class').push(this.constructor.identifier());
    //     this.attribute.list('class').push('modal fade');
    //     this.attribute.list('tabindex').push('-1');
    //     this.attribute.list('role').push('dialog');
    //     this.attribute.list('aria-labelledby').push('myModalLabel');
    //
    //     this.header = new DDItems;
    //     this.header.attribute.list('class').push('modal-header');
    //
    //     this.content = new DDItems;
    //     this.content.attribute.list('class').push('modal-body');
    //
    //     this.footer = new DDItems;
    //     this.footer.attribute.list('class').push('modal-footer');
    // }

    this.show = function() {

        $(`.${this.bind}`).remove();
        $('body').append(this.toString());
        $(`.${this.bind}`).modal('show');

        DD.update.trigger();
    };

    this.toString = function() {

        return `
        <!-- Modal -->
          <div class="modal fade ${this.bind}" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
            <div class="modal-dialog" role="document" style="width: 80%;">
                <div class="modal-content">

                    <div class="modal-header">${this.header}</div>
                    <div class="modal-body row">${this.content}</div>
                    <div class="modal-footer">${this.footer}</div>

                </div>
            </div>
            </div>
        `
    }
}






function exit() {

function DDContent(content = '') {

    this.set  = function ($content) {

        content = $content;
    };

    this.toString = function () {

        return content;
    }
}


var DD = new DDElement();

DD.attribute = new DDAttribute();
DD.attribute.named('z')['z'] = 'z';
console.log(DD);
console.log(DD.toString());

var AA = new DDElement();
AA.attribute = 'a';
console.log(AA);
console.log(AA.toString());




//
// function DDElement(obj) {
//
//     if(!obj.hasOwnProperty(this.constructor.name)) {
//
//         obj[this.constructor.name] = {
//             tag : 'div',
//             content : ''
//         };
//     }
//
//     this.set  = function (tag) {
//
//         console.assert(typeof obj.element instanceof "string");
//         console.assert(obj.element.length > 0);
//
//         obj[this.constructor.name]['tag'] = tag;
//     };
//
//     this.content = function (content) {
//
//         obj[this.constructor.name]['content'] = content;
//     };
//
//     this.toString  = function () {
//
//         let tag     = obj[this.constructor.name]['tag'];
//         let content = obj[this.constructor.name]['content'];
//         let attribute = '';
//
//         if(obj.hasOwnProperty(DDAttribute.name)) {
//
//             attribute = new DDAttribute(obj);
//         }
//
//         return `<${tag} ${attribute}>${content}</${tag}>`;
//     };
// }

// (new DDElement(a));
// (new DDElement(b));
//
// console.log((new DDElement(a)).toString());
// console.log((new DDElement(b)).toString());







function DDContainer(attribute = new DDAttribute, panel = new DDPanel) {

    let self = this.constructor;

    attribute.named('class')[self.identifier()] = self.identifier();


    this.panel = function () {

        return panel;
    };

    this.setTo = function(jquery) {

        this.panel().setTo(jquery);
        jquery.addClass(self.identifier());
    };
}

DDContainer.identifier = identifier;

DDContainer.fromInner = function (jquery) {

    if(!jquery.hasClass(this.identifier())) {

        jquery = jquery.parents(this.identifier(true)).first();
    }

    return jquery;
};










function DDItems(items = {}) {

    this.content = items;

    this.content = function () {

       // console.log(Object.values(items).join(''))
        return Object.values(items).join('');
    }
}

function DDClick(click, $function = function () {}, attribute = null) {

    var handler = $function;

    this.setHandler = function($function) {

        handler = $function;
    };

    this.setAttribute = function(attribute) {

        console.assert(attribute instanceof DDAttribute);

        attribute.named('class')[click] = click;
    };

    function update() {

        $('.' + click).off('click').click(function (e) {

            handler(e);

        });
    }

    if(attribute) {

        this.setAttribute(attribute);
    }

    DDUpdate.events['click' + click] = update;
}

class DDElementClick extends DDElement {

    constructor(bind, content = '', attribute = new DDAttribute(), tag = 'div') {

        super(bind, content, attribute, tag);

        attribute.associative('class')[bind] = bind;

        this.handler = function (Jquery) {

        };

        var self = this;

        DDUpdate.events['click' + this.bind()] = function () {

            self.update();
        };

        this.update();
    }

    //
    // bind(selector = false) {
    //
    //     return selector ? '.' + this.$bind : this.$bind ;
    // }

    inner () {

        return this.content;
    }

    update() {

        var self = this;

        $(this.bind(true)).off('click').click(function (e) {

            self.handler(e);
        });
    }
}


class DDModal extends DDElementBind {

    constructor(bind, $attributes = new DDAttribute()) {

        super($attributes, 'div');

        attribute.associative('class')[bind] = bind;

        this.attribute.list('class').push(this.constructor.identifier());
        this.attribute.list('class').push('modal fade');
        this.attribute.list('tabindex').push('-1');
        this.attribute.list('role').push('dialog');
        this.attribute.list('aria-labelledby').push('myModalLabel');

        this.header = new DDItems;
        this.header.attribute.list('class').push('modal-header');

        this.content = new DDItems;
        this.content.attribute.list('class').push('modal-body');

        this.footer = new DDItems;
        this.footer.attribute.list('class').push('modal-footer');
    }

    show() {

        $('body').append(this.toString());
        $('.DDAddModalContent').html(DDNew.toString());
    }

    inner() {
        `
        <!-- Modal -->
            <div class="modal-dialog" role="document" style="width: 80%;">
                <div class="modal-content">

                    ${this.header}
                    ${this.item}
                    ${this.footer}

                </div>
            </div>
        `
    }
}

//
//
// function DDPanel(obj) {
//
//     let attribute = new DDAttribute(obj);
//
//     attribute.named('class')[this.constructor.name] = this.constructor.name;
//
//     this.fromContainer = function (jquery) {
//
//         return jquery.children('.' + this.constructor.name).first();
//     };
//
//     this.toString = function () {
//
//         return (new DDElement(object)).toString();;
//     };
//
//     /**
//      * container
//      * @param jquery
//      */
//     this.setTo = function(jquery) {
//
//         this.fromContainer(jquery).remove();
//         jquery.prepend(obj);
//     }
// }
//
// function DDContainer(object) {
//
//     let attribute = new DDAttribute(object);
//
//     attribute.named('class')[this.constructor.name] = this.constructor.name;
//
//     if(!object.hasOwnProperty(DDPanel.name)) {
//
//         object[DDPanel.name] = {};
//     }
//
//     let panel = object[DDPanel.name];
//
//     this.panel = function () {
//
//         return panel;
//     };
//
//     this.toString = function () {
//
//         return (new DDElement(object)).toString();
//     };
//
//     this.setTo = function(jquery) {
//
//         this.panel().setTo(jquery);
//         jquery.addClass(this.constructor.name);
//     };
//
//
// }
//
// const DD = {};
//
// let container = new DDContainer(DD);
// let content = new DDContent(container.panel());
// content.set('content');
//


const DD = function () {

    let attribute = new DDAttribute();
    let panel = Object.assign(new DDElement('', 'div', attribute), new DDPanel(attribute), new DDItems());

    attribute = new DDAttribute();
    return Object.assign(new DDElement('', 'div', attribute), new DDContainer(attribute, panel));

}();


console.log(DD);



//
//
// DD.init = function (selector) {
//
//     DD.setTo($(selector));
//     DDUpdate.trigger();
// };

//
// DD.update = {
//
//     events: {},
//
//     trigger : function () {
//
//         $.each(DD.update.events, function(k, v) {
//
//             v();
//         });
//     }
// };





DD.panel().items()['show/hide'] = function () {

    let element = new DDElement();

    element.attribute().list('class').push(
        'glyphicon glyphicon-eye-close btn btn-default btn-xs pull-right'
    );

    let click = new DDClick('DDShowHide');

    click.setAttribute(element.attribute());

    click.setHandler(function(e) {

        var click = $(e.target);
        var container = DDContainer.fromInner(click);
        container.toggleClass('DDHide');
        click.toggleClass('glyphicon-eye-close glyphicon-eye-open');
    });

    return element;
}();


// function DDBindClass(object) {
//
//     console.assert(object instanceof DDElement);
//
//     this.identifier = function(selector = false) {
//
//         return selector ? '.' + object.constructor.name : object.constructor.name ;
//     };
//
//     object.bind = function(selector = false) {
//
//         return selector ? '.' + bind : bind ;
//     };
//
//     object.setTo = function(jquery) {
//
//         jquery.addClass(object.constructor.identifier());
//     };
//
//     attribute.named('class')[object.identifier()] = object.identifier();
//     attribute.named('class')[bind] = bind;
// }




}