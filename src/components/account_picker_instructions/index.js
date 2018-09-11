module.exports = (app, actions) => {
    /**
    * @memberof fg.components
    */
    const AccountPickerInstructions = {
        computed: app.helpers.sharedComputed(),
        methods: app.helpers.sharedMethods(),
        render: templates.vjs_addon_availability_vg_account_picker_instructions.r,
        staticRenderFns: templates.vjs_addon_availability_vg_account_picker_instructions.s,
        store: {
            app: 'app',
            selected: 'settings.webrtc.account.selected',
            settings: 'settings',
            status: 'settings.webrtc.account.status',
            user: 'user',
            vendor: 'app.vendor',
            voip: 'availability.voip',
        },
    }

    return AccountPickerInstructions
}
