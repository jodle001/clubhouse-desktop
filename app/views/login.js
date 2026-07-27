const ClubHouseApi = require('clubhouse-api');
const store = require('store');
import AppProfile from "../profile.mjs";
import { composePhone, phoneError } from "../phone.mjs";
import COUNTRIES, { DEFAULT_COUNTRY, findCountry } from "../countries.mjs";

const profiles = {
    ...AppProfile,
    ...ClubHouseApi.profiles.locales.English
};

const Login = {
    beforeRouteEnter (to, from, next) {
        const userData = store.get('userData');
        if(userData){
            if(!userData.is_verified){
                next('/waitlist');
                return;
            }
            next('/home');
        }else{
            next();
        }
    },
    data:function(){
        return{
            phone:'',
            // Remembered between runs so the country only has to be picked once.
            country: store.get('country') || DEFAULT_COUNTRY,
            countries: COUNTRIES,
            loading:false
        }
    },
    computed:{
        selectedCountry: function(){
            return findCountry(this.country);
        },
        // Shown under the field so it is always clear what will be sent.
        preview: function(){
            return composePhone(this.selectedCountry, this.phone);
        }
    },
    watch:{
        country: function(iso){
            store.set('country', iso);
        }
    },
    methods:{
        smsAuth: async function(){
            // The API only accepts E.164, so build it from the selected country
            // rather than passing the raw input through a length check.
            const phone = composePhone(this.selectedCountry, this.phone);
            const problem = phoneError(phone, this.selectedCountry);

            if(problem){
                new Notification('Not Valid',{
                    body: problem
                });
                return;
            }

            this.loading = true;
            const result = await ClubHouseApi.api.requestMobileAuth(profiles,phone);
            console.log('start_phone_number_auth', phone, result);

            if(result.success){
                this.$router.push({
                    name:'verify',
                    params:{
                        phone: phone
                   }
                });
            }else{
                console.error(result);
                this.loading = false;
                const notif = new Notification('Failed', {
                    body: `${result.error_message || 'Request failed'} (sent as ${phone})`
                });
            }
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
                    <div class="phone-group">
                        <select class="form-control country-select" v-model="country">
                            <option v-for="c in countries" :key="c.iso" :value="c.iso">{{ c.name }} (+{{ c.dial }})</option>
                        </select>
                        <input type="tel" class="form-control" v-model="phone" placeholder="555 123 4567" autofocus @keyup.enter="smsAuth" />
                    </div>
                    <small class="text-muted mt-2 d-block text-center">
                        <span v-if="preview">Will be sent as {{ preview }}</span>
                        <span v-else>Enter your number the way you normally write it</span>
                    </small>
                    <div class="d-flex align-items-center justify-content-center mt-4">
                        <button class="btn-primary" @click="smsAuth">Next</button>
                    </div>
                </div>
            </div>
        </div>
    `
};

export default Login;