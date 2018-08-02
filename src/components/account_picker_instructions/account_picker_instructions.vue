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

    <!-- Warn when the user is about to choose a voipaccouint with incorrect settings. -->
    <div v-if="selected.id && !validAccountSettings && settings.webrtc.toggle" class="notification-box troubleshoot">
        <header>
            <icon name="warning"/><span class="cf">{{$t('voIP account adjustment required in')}} {{vendor.portal.name}}</span>
        </header>
        <ul>
            <li v-if="!selected.settings.encryption" class="cf">
                {{$t('the option')}} <b><a class="cf" @click="openPlatformUrl(`phoneaccount/${settings.webrtc.account.selected.id}/change/#tc0=tab-2`)">{{$t('enforce encryption')}}</a></b>
                {{$t('is needed in')}} <i class="ca">{{$t('connection handling')}}</i>.
            </li>
            <li v-if="!selected.settings.avpf" class="cf">
                {{$t('the option')}} <b><a @click="openPlatformUrl(`phoneaccount/${settings.webrtc.account.selected.id}/change/#tc0=tab-2`)">avpf=yes</a></b>
                {{$t('is needed in')}} <i class="ca">{{$t('expert options')}}</i>.
            </li>
        </ul>
    </div>

</component>
