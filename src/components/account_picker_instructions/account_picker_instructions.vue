<component class="component-account-picker-instructions">
    <div v-if="selected.id && (selected.settings && selected.settings.ua)" class="registration-notice">
         <a class="cf" @click="openPlatformUrl(`phoneaccount/${selected.id}/change/`)">{{$t('registered')}}</a>:
         <i v-if="selected.settings">{{selected.settings.ua}}</i>
    </div>

    <!-- This message is shown when there are no voipaccount options. -->
    <div v-if="!settings.webrtc.account.options.length && !(status === 'loading')" class="notification-box info">
        <header><icon name="info"/><span class="cf">{{$t('a VoIP account is required.')}}</span></header>
        <ul>
            <li>{{$t('head over to')}} <a class="cf" @click="openPlatformUrl(`phoneaccount`)">{{$t('voIP accounts')}}</a> {{ $t('to create a VoIP account.') }}.</li>
            <li>{{$t('head over to')}} <a @click="openPlatformUrl(`user/${user.id}/change/#tc0=user-tab-2`)">{{$t('user preferences')}}</a> {{ $t('to manage your {target}', {target: `${vendor.name} ${$t('user')}`}) }}.</li>
        </ul>
    </div>
</component>
