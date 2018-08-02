const AvailabilityAddon = require('vialer-js/src/js/bg/modules/availability/addon')

class AvailabilityAddonVg extends AvailabilityAddon {
    constructor(app) {
        super(app)

        this.app.on('bg:availability:account_reset', () => {
            const selected = app.utils.copyObject(this.app.state.user.platform.account)
            this.app.logger.info(`${this}reset account to ConnectAB platform default ${selected.username}`)
            this.app.setState({settings: {webrtc: {account: {selected}, enabled: false, toggle: false}}}, {persist: true})
        })
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

            let voipaccounts = res.data.objects
            let platformAccounts = userdestination.phoneaccounts.map((i) => {
                // The options for successful softphone usage.
                let settings = {
                    avpf: false,
                    encryption: false,
                    ua: null,
                }

                let registeredAccount = voipaccounts.find((j) => (j.account_id === i.account_id && j.sipreginfo))
                if (registeredAccount) settings.ua = registeredAccount.sipreginfo.useragent
                // The expert options need to be parsed first.
                Object.assign(settings, this.app.utils.parseConfigLine(i.expert_options))
                return {
                    id: i.id,
                    name: `${i.internal_number} - ${i.description}`,
                    password: i.password,
                    settings,
                    uri: `sip:${i.account_id}@voipgrid.nl`,
                    username: i.account_id,
                }
            })

            this.app.setState({
                availability: {available: Boolean(selected.id), destinations, selected, sud: sud.id},
                settings: {webrtc: {account: {status: null, options: platformAccounts}}},
            }, {persist: true})

            this.app.logger.info(`${this}<platform> ${platformAccounts.length} accounts loaded`)
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

        this.app.modules.ui.menubarState()
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
