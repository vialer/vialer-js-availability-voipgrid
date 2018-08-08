const Module = require('vialer-js/fg/lib/module')

/**
* Main entrypoint for Queues.
* @memberof AppForeground.modules
*/
class ModuleAvailabilityVg extends Module {
    constructor(app) {
        super(app)
        this.app.components.AvailabilityVg = require('../../components/availability')
        this.app.components.AccountPickerInstructions = require('../../components/account_picker_instructions')

    }
}

module.exports = ModuleAvailabilityVg
