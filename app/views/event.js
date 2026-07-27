const ClubHouseApi = require('clubhouse-api');
const store = require('store');
import AppProfile from "../profile.mjs";

const userData = store.get('userData');

const Event = {
    mounted:function(){
        this.getClub();
        console.log(this.eventId);
    },
    props:['eventId'],
    data:function(){
        return{
            result: null,
            events: []
        }
    },
    methods:{
        getClub: async function(){
            const profiles = {
                ...AppProfile,
                ...ClubHouseApi.profiles.locales.English,
                userId: userData.user_profile.user_id,
                token: userData.auth_token
            };
            const result = await ClubHouseApi.api.getEvent(profiles,this.eventId);
            console.log(result);
            if(result.success){
                this.result = result;
                // this.events = result.events;
            }else{
                console.error(result);
            }
        },
    },
    template: `
        <div class="events">
            
        </div>
    `
};

export default Event;