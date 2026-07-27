const ClubHouseApi = require('clubhouse-api');
const store = require('store');
import AppProfile from "../profile.mjs";

const profiles = {
    ...AppProfile,
    ...ClubHouseApi.profiles.locales.English
};

const Verify = {
    beforeRouteEnter: function(to,from,next){
        const userData = store.get('userData');
        if(userData){
            if(!userData.is_verified || userData.is_onboarding || userData.is_waitlisted){
                next(vm => {
                    vm.$router.replace({name:'waitlist'});
                });
            }else{
                next(vm => {
                    vm.$router.replace({name:'home'});
                });
            }
        }else{
            next();
        }
    },
    props:['phone'],
    mounted:function(){
        if(!this.phone){
            this.$router.replace({name:'login'});
        }
    },
    data:function(){
        return {
            code: '',
            called: false,
            loading:false,
            error:''
        }
    },
    methods:{
        callAuth: async function(){
            const $this = this;
            if(this.phone.length <= 16 && this.phone.length >= 4){
                const result = await ClubHouseApi.api.requestCallAuth(profiles,this.phone);
                console.log(result);
                this.called = true;

                setTimeout(function(){
                    $this.called = false;
                },15000);
                
                if(result.success){
                }else{
                    console.error(result);
                    const notif = new Notification('Failed', {
                        body: result.error_message
                    });
                }
            }
        },
        verify: async function(){
            // This used to require exactly 4 digits. Clubhouse sends 6, so the
            // whole body was skipped and the button did nothing at all - no
            // request, no error, no log. Accept any plausible length instead.
            const code = String(this.code || '').replace(/\D/g, '');

            if(code.length < 4 || code.length > 8){
                this.error = 'Enter the code from the text message.';
                return;
            }

            this.error = '';
            this.loading = true;

            let result;
            try{
                result = await ClubHouseApi.api.completeMobileAuth(profiles,this.phone,code);
            }catch(err){
                this.loading = false;
                this.error = `Could not reach Clubhouse: ${err.message}`;
                console.error(err);
                return;
            }
            console.log('complete_phone_number_auth', result);

            if(result.success){
                store.set('userData',result);

                if(result.is_waitlisted){
                    return this.$router.replace({name:'waitlist'});
                }

                const profile = result.user_profile || {};
                if(!profile.username || !profile.username.length){
                    return this.$router.replace({name:'editProfile'});
                }

                return this.$router.replace({name:'home'});
            }

            // Anything else: say so, rather than leaving the button inert.
            this.loading = false;
            this.error = result.error_message ||
                (result.number_of_attempts_remaining != null
                    ? `That code was not accepted. ${result.number_of_attempts_remaining} attempt(s) left.`
                    : 'Verification failed.');
        }
    },
    template: `
        <div>
            <div class="loading mt-5" v-if="loading"><div></div><div></div><div></div><div></div></div>
            <div class="center" v-if="!loading">
                <div class="card p-5 max-width-500 mx-auto">
                    <img :src="'assets/images/handwave.png'" class="logo mx-auto mb-4" />
                    <h1 class="h6 font-weight-bold d-block text-center">Clubhouse</h1>
                    <small class="text-muted mb-5 d-block text-center">Unofficial Desktop Client</small>
                    <div class="input-group">
                        <label>Enter the code you received:</label>
                        <input type="tel" class="form-control text-center" v-model="code" placeholder="123456" autofocus @keyup.enter="verify" />
                    </div>
                    <div v-if="error" class="login-error mt-3">{{ error }}</div>
                    <div class="d-flex align-items-center justify-content-center mt-4">
                        <button class="btn-primary mr-4" @click="verify">Verify Code</button>
                        <button v-if="!called" class="btn-primary" @click="callAuth">Call Me</button>
                        <span v-if="called">Called!</span>
                    </div>
                    <router-link to="/" class="mt-3 d-block text-center text-muted font-size-small">Wrong Number?</router-link>
                </div>
            </div>
        </div>
    `
}

export default Verify;