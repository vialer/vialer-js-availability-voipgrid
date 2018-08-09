const Module = require('vialer-js/lib/module')

/**
* Main entrypoint for Queues.
* @memberof AppForeground.plugins
*/
class ModuleAvailabilityVg extends Module {
    constructor(app) {
        super(app)
        this.app.components.AvailabilityVg = require('../../components/availability')
        this.app.components.AccountPickerInstructions = require('../../components/account_picker_instructions')

    }
}

module.exports = ModuleAvailabilityVg
