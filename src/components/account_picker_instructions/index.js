module.exports = (app, actions) => {
    /**
    * @memberof fg.components
    */
    const AccountPickerInstructions = {
        computed: app.helpers.sharedComputed(),
        methods: {
            openPlatformUrl: function(path = '') {
                app.emit('bg:user:update-token', {
                    callback: ({token}) => {
                        path = `client/${this.user.client_id}/${path}`
                        path = `user/autologin/?token=${token}&username=${this.user.username}&next=/${path}`
                        let url = `${app.state.settings.platform.url}/${path}`
                        if (app.env.isExtension) browser.tabs.create({url})
                        window.open(url, '_blank')
                    },
                })
            },
        },
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
