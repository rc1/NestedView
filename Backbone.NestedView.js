(function () {

	// Initial Setup
	// -------------

	// Save a reference to the global object.
	var root = this;

	// The top-level namespace. All public Backbone classes and modules will
	// be attached to this. Exported for both CommonJS and the browser.
	var Backbone;
	if (typeof exports !== 'undefined') {
		Backbone = exports;
	} else {
		Backbone = root.Backbone || Backbone;
	}

	Backbone.NestedView = Backbone.View.extend({

        initialize  :   function (options) {

            /**
             * Events
             *
             * NAME                         OBJECT
             * changed                      view that changed
             * changed:becameActive         view that became active
             * changed:becameInactive       view that became inactive
             *
             * descendant:changed           decendent that changed, bubbles up the view hierarchy
             *
             * children:willDeactivate      view that will deactivating children
             * children:didDeactivate       view that did deactivated children
             * children:willDeactivate
             * children:didDeactivate
             * alldescendants:willActivate   view that will deactivate all descendants
             * alldescendants:didActivate    view that did deactivate all descendants
             *
            */

            this.bind("descendant:changed", function (child) {
                if(this.parent) { this.parent.trigger("descendant:changed", child); }
            }, this);

            this.children = [];
            this.parent = undefined;
            this._isActive = true;
        },

        render      :   function () {
            return this;
        },

        childByCID : function (cid) {
            return _.detect(this.children, function (child) { return child.cid === cid; });
        },

        childByID : function (childID) {
            return _.detect(this.children, function (child) { return child.id === childID; });
        },

        addChild : function (child) {
            this.children.push(child);
            child.parent = this;
        },

        /** Showing and hiding */

        /// this is the function that should be called from outside as it will hide others
        activateChildByID : function (childID) {
            return this.activateChild(this.childByID(childID));
        },

        activateChild : function (childToActivate) {
            _(this.children).each(function (child, index) {
                child.isActive(child === childToActivate);
            }, this);
            return childToActivate;
        },

        hasActiveChild : function () {
            return _(this.children).detect(function (child) { return child.isActive; });
        },

        activateChildren : function () {
            _(this.children).each(function (child, index) {
                child.isActive(true);
            }, this);
        },

        activateAllDecendants : function () {
            this.trigger("alldescendants:willActivate", this);
            _(this.children).each(function (child, index) {
                child.isActive(true);
                child.activateAllDecendants();
            }, this);
            this.trigger("alldescendants:didActivate", this);
        },

        activateFirstChild : function () {
            return this.activateChild(this.children[0]);
        },

        deactivateChildren : function () {
            this.trigger("children:willDeactivate", this);
            _(this.children).each(function (child, index) {
                child.isActive(false);
            }, this);
            this.trigger("children:didDeactivate", this);
            return this;
        },

        deactivateAllDescendants : function () {
            console.warn("@untested::CGL.View:CGL.View");
            _(this.children).each(function (child, index) {
                child.isActive(false);
                child.deactivateAllDecendants();
            }, this);
            return this;
        },

        deactivateSiblings : function () {
            if (!this.parent) { return; }
            _(this.parent.children).each(function (child) {
                if (child !== this) {
                   child.deactivateChildren();
                }
            }, this);
        },

        toggleIsActive : function () {
            this.isActive(!this._isActive);
        },

        activatedTransition : function () {
            // $(this.el).delay(CGL.CONFIG.ANIMATION.HIDE_TIME).fadeIn(CGL.CONFIG.ANIMATION.SHOW_TIME);
        },

        deactivateTransition : function () {
            // $(this.el).fadeOut(CGL.CONFIG.ANIMATION.HIDE_TIME);
        },

        isActive : function (yN) {

            if (arguments.length > 0) {
                if (yN === this._isActive) return this;
                this._isActive = yN;
                if (!!yN) {
                    this.trigger("changed:becameActive", this);
                    this.activatedTransition();
                    this._isActive = yN;
                } else {
                    this.trigger("changed:becameInactive", this);
                    this.deactivateTransition();
                }
                this.trigger("changed", this);
                if (this.parent) { this.parent.trigger("descendant:changed", this); }
            }
            return this._isActive;
        }

    });

}())