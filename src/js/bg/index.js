const AvailabilityAddon = require('vialer-js/bg/plugins/availability/addon')

class AvailabilityAddonVg extends AvailabilityAddon {
    constructor(app) {
        super(app)
    }


    _initialState() {
        return {
            destinations: [],
            phoneaccounts: [],
            placeholder: {id: null, name: null, type: null},
            selected: {id: null, name: null, type: null},
            sud: null, // This is a fixed id used to build the API endpoint for selected userdestination.
        }
    }


    /**
    * Do an API request to get an update of the available userdestination
    * options when the module is loaded in the background.
    */
    _platformData({callback = null} = {}) {
        let accountOptions = []
        return new Promise(async(resolve, reject) => {
            this.app.setState({settings: {webrtc: {account: {status: 'loading'}}}})
            let res
            try {
                res = await this.app.api.client.get('api/userdestination/')
            } catch (err) {
                return reject(err)
            }

            if (this.app.api.NOTOK_STATUS.includes(res.status)) {
                this.app.logger.warn(`${this}platform data request failed (${res.status})`)
                return
            }

            // Lets format the data in a select-friendly way.
            const userdestination = res.data.objects[0]
            let fixed = userdestination.fixeddestinations
            let voip = userdestination.phoneaccounts
            fixed = fixed.map(fd => ({id: parseInt(fd.id), name: `${fd.phonenumber} - ${fd.description}`, type: 'fixeddestination'}))
            voip = voip.map(fd => ({id: parseInt(fd.id), name: `${fd.internal_number} - ${fd.description}`, type: 'phoneaccount'}))

            // The actual form data.
            let selected = {id: null, name: null, type: null}
            let destinations = []
            destinations = [...fixed, ...voip]

            const sud = userdestination.selecteduserdestination
            if (sud.fixeddestination) selected = destinations.find((d) => d.id === sud.fixeddestination)
            else if (sud.phoneaccount) selected = destinations.find((d) => d.id === sud.phoneaccount)

            // Request all voipaccounts and filter them against the ones the user
            // has. Then augment them with the useragent, so we know whether
            // the VoIP account is already in use or not.
            try {
                res = await this.app.api.client.get('api/phoneaccount/basic/phoneaccount/?active=true&order_by=description')
            } catch (err) {
                return reject(err)
            }


            try {
                const res = await this.app.api.client.get('api/plugin/user/accounts/')
                // Convert API data to internal data format.
                accountOptions = res.data.map((i) => this.app.plugins.user.adapter._formatAccount(i))
            } catch (err) {
                return reject(err)
            }

            this.app.setState({
                availability: {available: Boolean(selected.id), destinations, selected, sud: sud.id},
                settings: {webrtc: {account: {status: null, options: accountOptions}}},
            }, {persist: true})

            this.app.logger.info(`${this}<platform> ${accountOptions.length} account options loaded`)
            if (callback) callback()

            resolve()
        })
    }


    /**
    * Notify the VoIPGRID API about the availability change and set
    * the background state to the new situation.
    */
    async _updateAvailability({available, selected, destinations}) {
        // Set an icon depending on whether the user is available.
        let endpoint = `api/selecteduserdestination/${this.app.state.availability.sud}/`
        let res
        this.app.setState({availability: {available, destinations, selected}}, {persist: true})

        if (available) {
            res = await this.app.api.client.put(endpoint, {
                fixeddestination: selected.type === 'fixeddestination' ? selected.id : null,
                phoneaccount: selected.type === 'phoneaccount' ? selected.id : null,
            })
        } else {
            res = await this.app.api.client.put(endpoint, {fixeddestination: null, phoneaccount: null})
        }

        this.app.plugins.ui.menubarState()
        if (this.app.api.UNAUTHORIZED_STATUS.includes(res.status)) {
            this.app.logger.warn(`${this}unauthorized availability request`)
            return
        }
    }


    /**
    * Generate a representational name for this module. Used for logging.
    * @returns {String} - An identifier for this module.
    */
    toString() {
        return `${this.app}[addon-availability-vg] `
    }

}

module.exports = AvailabilityAddonVg
