/**
 * Unified wrapper for Jquery drag & drop
 *
 */

// function R() {
//
//     this.c = function () {
//
//         return 'a';
//     };
// }
//
// R.c = function () {
//
//     return 'c';
// };

const Htme = {};

Htme.update = {

    handlers: {},

    trigger : function () {

        for(let k in Htme.update.handlers) {

            Htme.update.handlers[k]();
        }
    }
};

Htme.boot = {

    handlers : {},

    selector : function (selector) {

        selector = $(selector);

        for(let k in Htme.boot.handlers) {

            Htme.boot.handlers[k](selector);
        }

        Htme.update.trigger();
    }
};

Htme.hide = {
    handlers : {}
};







function HtmlComponentSelects () {

    return $(this.identifier(true));
};


function HtmlComponentSelectFromInner (jquery, bypass = false) {

    if(!jquery.hasClass(this.identifier()) || bypass) {

        jquery = jquery.parents(this.identifier(true)).first();
    }

    return jquery;
};


function HtmeComponentBinding(
    permanent = new HtmeComponentAttribute,
    temporary = new HtmeComponentAttribute
) {

    this.setPermanent = function (permanent) {

        console.assert(permanent instanceof HtmeComponentAttribute);
    };

    this.setTemporary = function (temporary) {

        console.assert(temporary instanceof HtmeComponentAttribute);
    };


    this.permanent = function () {

        return permanent;
    };

    this.temporary = function () {

        return temporary;
    };

    this.bindTo = function(jquery) {

        // if(!jquery.length) {
        //
        //     throw new Error('Selector not exitst');
        // }

        let classes = jquery.attr('Htme-Binding');

        if(classes) {

            jquery.removeClass(classes);
        }

        let str = temporary.toString();

        if(str.length) {

            jquery.attr('Htme-Binding', temporary.toString());
        }

        jquery.addClass(this.selector());
    };

    this.setTo = function (attribute) {

        console.assert(attribute instanceof HtmeComponentAttributes);

        let attr = attribute.get('class');

        Object.assign(attr.all(), temporary.all(), permanent.all());
    };

    this.selects = function () {

        return $(this.selector(true));
    };

    this.selectFromChildren = function (jquery, bypass = false) {

        if(!jquery.hasClass(this.selector()) || bypass) {

            jquery = jquery.parents(this.selector(true)).first();
            //console.log(jquery);
            //console.log(jquery.parents('.Htme.HtmeContent'));
            //console.log(this.selector(true));
        }



        return jquery;
    };

    this.selectFromParent = function (jquery) {

        return jquery.children(this.selector(true)).first();
    };


    this.unsetFrom = function (attribute) {

        console.assert(attribute instanceof HtmeComponentAttributes);

        for(let k in temporary) {

            let val = temporary[k];

            delete attribute.named('class')[val];
        }
    };

    this.selector = function (selector = false) {

        let delimiter = selector ? '.' : ' ';

        let  classes = [];
        classes.push(...Object.values(permanent.all()));
        classes.push(...Object.values(temporary.all()));

        return (delimiter + classes.join(delimiter)).trim();
    }
}

// function HtmeComponentAttributeBinding(attribute, extra = '') {
//
//     console.assert(typeof extra === "string");
//
//     console.assert(attribute instanceof HtmeComponentAttributes);
//
//     var binds = [];
//
//     binds.push(this.identifier());
//
//     if (extra.length > 0) {
//
//         binds.push(extra);
//     }
//
//     for(let k in binds) {
//
//         let val = binds[k];
//
//         attribute.named('class')[val] = val;
//     }
//
//     return binds;
// }

HtmeComponentBinding.container = function(binding = new HtmeComponentBinding) {

    console.assert(binding instanceof HtmeComponentBinding);

    return function () {

        return binding;
    }
};


//
//
//
//
//
// function HtmeComponentSelector(name, selector = false, label = '.') {
//
//     return selector ? label + name : name ;
// }

function HtmeComponentAttribute(values = {}) {

    this.set = function (name, value) {

        values[name] = value;
    };

    this.copy = function () {

      return new HtmeComponentAttribute(Object.assign({}, values));

    };

    this.add = function (...value) {

        for(let k in value) {

            while(values.hasOwnProperty(this.constructor.iteration)) {

                console.log(this.constructor.iteration);
                this.constructor.iteration++
            }

            values[this.constructor.iteration] = value[k];

        }
    };

    this.all = function () {

        return values;
    };

    this.toString = function() {

        return Object.values(values).join(' ');
    }
};

HtmeComponentAttribute.iteration = 1;

function HtmeComponentAttributes (attributes = {}) {

    for(let k in attributes) {

        console.assert(attribute instanceof HtmeComponentAttribute);
    }

    this.get = function (name) {

        if(!attributes.hasOwnProperty(name)) {

            attributes[name] = new HtmeComponentAttribute;
        }

        return attributes[name];
    };

    this.all = function () {

        return attributes;
    };


    this.toString = function() {

        let buffer = [];

        for (let key in attributes) {

            let value = attributes[key].toString().trim();

            if(value.length > 0) {

                buffer.push(`${key}="${value}"`);
            }
        }

        return buffer.join(' ');
    };


};

HtmeComponentAttributes.container = function(attribute = new HtmeComponentAttributes) {

    console.assert(attribute instanceof HtmeComponentAttributes);

    return function () {

        return attribute;
    }
};


// function HtmeComponentTag(tag = 'div') {
//
//     this.set  = function ($tag) {
//
//         console.assert(typeof $tag === "string");
//         console.assert($tag.length > 0);
//
//         tag = $tag;
//     };
//
//     this.toString = function () {
//
//         return tag;
//     }
// }
HtmeComponentAttributes.container = function(attribute = new HtmeComponentAttributes) {

    console.assert(attribute instanceof HtmeComponentAttributes);

    return function () {

        return attribute;
    }
};


function HtmeComponentElement(content = '', tag = 'div', attribute = new HtmeComponentAttributes()) {

    this.attribute = HtmeComponentAttributes.container(attribute);

    this.tag  = tag;
    this.content = content;

    this.toString = function() {

        let open = `${this.tag} ${this.attribute().toString()}`.trim();

        return `<${open}>${this.content}</${this.tag}>`;
    };
}
HtmeComponentElement.container = function (element = new HtmeComponentElement()) {

    console.assert(element instanceof HtmeComponentElement);

    return function () {

        return element;
    }
};



function HtmeComponentBlock(bind = new HtmeComponentAttribute(), element = new HtmeComponentElement(), panel = new HtmeComponentPanel()) {

    console.assert(bind instanceof HtmeComponentAttribute, bind);

    this.element = HtmeComponentElement.container(element);
    this.panel = HtmeComponentPanel.container(panel);

    this.toString = function () {

        this.binding().setTo(this.element().attribute());

        let element = this.element();
        element.content = this.panel().toString();
        return element.toString();
    };

    this.binding = HtmeComponentBinding.container(
        new HtmeComponentBinding(this.constructor.binding().permanent().copy(), bind)
    );

   // this.binding().setTo(element.attribute());

    this.setPanel = function () {

      this.panel().set(this.binding().selects());

    };

    this.removePanel = function () {

        this.panel().remove(this.binding().selects());
    };


    this.update = function () {

        this.set(this.binding().selects());
    };

    this.set = function(jquery) {

        this.binding().bindTo(jquery);
        this.panel().set(jquery);

    };

    // let self = this;
    // Htme.update.handlers[this.binding().selector()] = function () {
    //
    //     self.update();
    // };
}

HtmeComponentBlock.binding = HtmeComponentBinding.container(
    new HtmeComponentBinding(new HtmeComponentAttribute({'Htme':'Htme'}))
);





function HtmeComponentPanel(name = new HtmeComponentElement(), menus = {}, element = new HtmeComponentElement()) {

    console.assert(name instanceof HtmeComponentElement);

    this.element = HtmeComponentElement.container(element);

    this.name = function() {

        return name;
    };


    element.attribute().get('class').add('navbar navbar-default');

    this.binding = this.constructor.binding;

    this.constructor.binding().setTo(element.attribute());

    this.setMenu = function (menu) {

        console.assert(menu instanceof HtmeComponentMenu);

        menus[menu.name()] = menu;
    };

    this.menu = function (name) {

        if(!menus.hasOwnProperty(name)) {

            menus[name] = new HtmeComponentMenu({}, name);
        }

        return menus[name];
    };

    /**
     * Container selectors
     * @param jquery
     */
    this.set = function (jquery) {

        let self = this;

        jquery.each(function (k, v) {

            let panel = $(v).children(self.binding().selector(true));

            if(!panel.length) {

                jquery.prepend(self.toString());
            }
        });

    };

    this.remove = function (jquery) {

            return jquery.children(this.binding().selector(true)).remove();

    };

    this.menus = function() {

        return menus;
    };

    this.toString = function () {

        element.content = name  + Object.values(menus).join(' ');
        return element.toString();
    };
}

HtmeComponentPanel.binding = HtmeComponentBinding.container(
    new HtmeComponentBinding(new HtmeComponentAttribute({'HtmePanel':'HtmePanel'}))
);





/**
 * @param panel
 * @returns {function(): HtmeComponentPanel}
 */
HtmeComponentPanel.container = function (panel = new HtmeComponentPanel()) {

    console.assert(panel instanceof HtmeComponentPanel);

    return function () {

        return panel;
    }
};


function HtmeComponentItems(items = {}) {

    this.items = items;

    this.toString = function () {

        return Object.values(items).join('');
    }
}




function HtmeComponentClick(click, handler = function () {}, element = new HtmeComponentElement()) {


    console.assert(typeof click === "string");

    this.element = HtmeComponentElement.container(element);

    element.attribute().get('class').set(click, click);

    this.handler = function () {

        return handler;

    };

    this.toString = function () {

        return element.toString();
    };

    this.setHandler = function ($function) {

        console.assert(typeof $function === "function");

        handler = $function;

    };

    function update() {

        $('.' + click).off('click').click(function (e) {

            handler(e);

        });
    }

    Htme.update.handlers['click' + click] = update;
    this.setHandler(handler);
}




function HtmeComponentModal (bind, header = '', content = '', footer = '') {

    console.assert(typeof bind === "string");

    this.bind = bind;
    this.header = header;
    this.content = content;
    this.footer = footer;

    this.show = function() {

        let dom = $(`.${this.bind}`);


        if(!dom.length) {

            $('body').append(this.toString());
            dom = $(`.${this.bind}`);
        }

        dom.modal('show');

        Htme.update.trigger();
    };

    this.remove = function () {

        $(`.${this.bind}`).modal('hide').remove();

        // bootstrap create backdrop element outside modal
        $(`.modal-backdrop`).remove();
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

function HtmeComponentMenu(submenus = {}, name ='UNDEFINED', container = new HtmeComponentElement()) {


    container.attribute().get('class').add('dropdown');

    // style
    container.attribute().get('class').add('htmeMenu');


    this.submenus = submenus;
    this.element = HtmeComponentElement.container(container);
    this.constructor.bind(container.attribute(), '');

    container.attribute().get('class').set('float', 'pull-left');

    let click = new HtmeComponentElement();

    click.attribute().get('class').add('dropdown-toggle');
    click.attribute().get('data-toggle').add('dropdown');
    click.content = name;

    this.name = function() {

        return name;

    };

    let menu = new HtmeComponentElement();

    menu.attribute().get('class').add('dropdown-menu');
   // menu.attribute().named('class')['DDMenuContent'] = 'DDMenuContent';
    menu.content = new HtmeComponentItems(this.submenus);

    container.content = new HtmeComponentItems({button:click, menu:menu});

    this.toString = function () {

        for(let k in this.submenus) {

            return container.toString();
        }

        return '';
    }
}

HtmeComponentMenu.binding = HtmeComponentBinding.container(
    new HtmeComponentBinding(new HtmeComponentAttribute({'HtmeMenu':'HtmeMenu'}))
);

new HtmeComponentClick('HtmeMenuButton', function(e) {

    $(e.target).siblings('.HtmeMenuContent').first().toggle();

});







(function () {

    new HtmeComponentPanel(Htme.menu).menu('window').submenus['show/hide'] = function () {

        let element = new HtmeComponentElement();
        let click = new HtmeComponentClick('HtmeShowHide', function(e) {

            var click = $(e.target);
            var container = HtmeComponentBlock.fromInner(click);

           // console.log(container);
            var children = container.children().not(HtmeComponentPanel.identifier(true));

            if(click.html() === 'Hide') {

                click.html('Show');
                children.hide();

            } else {

                click.html('Hide');
                children.show();
            }

        },element);

        element.content = 'Hide';
        // style
        element.attribute().get('class').add('htmeMenu');

        return click.element();

    }();

})();





Htme.update.handlers['sortable'] = function () {

    HtmeComponentBlock.binding().selects().sortable({
        containment: "parent",
        tolerance:'pointer',
        items : HtmeComponentBlock.binding().selector(true)

    }).disableSelection();

};


$(document).click(function(e) {

    for(let k in Htme.hide.handlers) {

        Htme.hide.handlers[k](e);
    }
});



Htme.update.handlers['bootstrapDropDown'] = function () {

    new HtmeComponentClick('dropdown-menu', function(e) {
        e.stopPropagation();
    })

};




const HtmeContainer = new HtmeComponentBlock(
   // new HtmeComponentAttribute({'HtmeContainer':'HtmeContainer'}),
   // new HtmeComponentElement(),
);
HtmeContainer.binding().permanent().add('HtmeContainer');



HtmeContainer.panel().name().attribute().get('class').add('pull-left htmeName');



const HtmeContent = new HtmeComponentBlock(
   // new HtmeComponentAttribute({'HtmeContent':'HtmeContent'}),
    //new HtmeComponentElement(),
);
HtmeContent.binding().permanent().add('HtmeContent');

HtmeContent.panel().name().attribute().get('class').add('pull-left htmeName');



jQuery.each({a:HtmeContainer, b:HtmeContent}, function (k, v) {

    let $new = new HtmeComponentMenu({}, 'new');
    $new.element().attribute().get('class').set('float', 'pull-left');

    v.panel().setMenu($new);


    let edit = new HtmeComponentMenu({}, 'edit');
    edit.element().attribute().get('class').set('float', 'pull-left');

    v.panel().setMenu(edit);


    let window = new HtmeComponentMenu({}, 'window');
    window.element().attribute().get('class').set('float', 'pull-right');

    v.panel().setMenu(window);

});








(function () {



    Htme.boot.handlers['container'] = function(selector) {

        HtmeContainer.panel().name().content = 'container';
        HtmeContainer.set($(selector));

    };

    HtmeContainer.panel().menu('new').submenus['container'] = function () {

        let element = new HtmeComponentElement();
        element.attribute().get('class').add('htmeMenu');
        element.content = 'container';

        return new HtmeComponentClick('HtmeNewContainer',function(e) {

            var click = $(e.target);
            var container = HtmeComponentBlock.binding().selectFromChildren(click);

            HtmeContainer.panel().name().content = 'container';
            container.append(HtmeContainer.toString());

            Htme.update.trigger();
        }, element);
    }();


    HtmeContainer.panel().menu('new').submenus['content'] = function () {

        let click = new HtmeComponentClick('HtmeNewContent',function(e) {

            var click = $(e.target);
            var container = HtmeComponentBlock.binding().selectFromChildren(click);

            HtmeContent.panel().name().content = 'content';
            container.append(HtmeContent.toString());

            Htme.update.trigger();
        });

        click.element().attribute().get('class').add('htmeMenu');
        click.element().content = 'content';

        return click.element();
    }();

})();


