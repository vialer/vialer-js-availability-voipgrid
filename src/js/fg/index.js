const Plugin = require('vialer-js/lib/plugin')

/**
* Main entrypoint for Queues.
* @memberof AppForeground.plugins
*/
class PluginAvailabilityVg extends Plugin {
    constructor(app) {
        super(app)

        this.name = 'AvailabilityVg' // Needed to lookup the default component.
        this.app.components.AvailabilityVg = require('../../components/availability')
        this.app.components.AccountPickerInstructions = require('../../components/account_picker_instructions')
    }
}

module.exports = PluginAvailabilityVg
