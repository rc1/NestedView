# Backbone.NestedView.js

An experiment for creating a NestedView with Backbone.js

## Notes:

1. Not ready for production.
2. An experiment.
3. Adds it self to `Backbone` if not being required using the module pattern.
4. Subclasses need to call `Backbone.NestedView.prototype.initialize.call(this, options);`
5. `activatedTransition` and `deactivatedTransition` are no-ops, see comments for jQuery usage.
6. Not ready for production.
7. An experiment.