module.exports = (app, actions) => {
    /**
    * @memberof fg.components
    */
    const AvailabilityVg = {
        computed: app.helpers.sharedComputed(),
        methods: Object.assign({
            openPlatformUrl: function(path = '') {
                app.emit('bg:user:update-token', {
                    callback: ({token}) => {
                        path = `client/${this.user.client_id}/${path}`
                        path = `user/autologin/?token=${token}&username=${this.user.username}&next=/${path}`
                        let url = `${app.state.settings.platform.url}/${path}`
                        if (app.env.isExtension) browser.tabs.create({url: url})
                        window.open(url, '_blank')
                    },
                })
            },
        }, app.helpers.sharedMethods()),
        render: templates.vjs_addon_availability_vg_availability.r,
        staticRenderFns: templates.vjs_addon_availability_vg_availability.s,
        store: {
            available: 'availability.available',
            destinations: 'availability.destinations',
            placeholder: 'availability.placeholder',
            selected: 'availability.selected',
            user: 'user',
            vendor: 'app.vendor',
        },
        watch: {
            available: function(available) {
                // Sending an empty object like this will unset the
                // user's availability.
                let selected
                const unavailable = {id: null, name: null, type: null}

                // User wants to be available.
                if (available) {
                    // Set from remembered account.
                    if (this.placeholder.id) selected = this.placeholder
                    // No remembered value; choose the first available option.
                    else if (this.destinations.length) selected = this.destinations[0]
                    // No choice; just set to unavailable.
                    else selected = unavailable
                } else {
                    // Availability is disabled. Set to unavailable.
                    selected = unavailable
                }

                app.emit('bg:availability:update', {
                    available,
                    destinations: this.destinations,
                    selected: selected,
                })
            },
            selected: function() {
                // Save the user's last choice.
                this.placeholder = app.utils.copyObject(this.selected)
                app.emit('bg:availability:update', {
                    available: this.available,
                    destinations: this.destinations,
                    selected: this.selected,
                })
            },
        },
    }

    return AvailabilityVg
}
