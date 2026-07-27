/**
 * The application identity this client presents to Clubhouse's private API.
 *
 * Previously the app used `AppProfile` directly,
 * which identifies as the March 2021 iOS build (0.1.28 / build 304). Asked
 * about that build, the API answers:
 *
 *   {"success":true,"has_update":true,"is_mandatory":true,
 *    "app_version":"23.09.01 (2446)","app_build":2446}
 *
 * i.e. it flags build 304 as requiring a *mandatory* upgrade. So the build
 * headers below are raised to the newest build the API itself reports as
 * current (23.09.01 / 2446, September 2023).
 *
 * Only the four identity fields are changed. The Agora and PubNub keys are
 * left at their a304 values deliberately: they are separate credentials, and
 * there is no evidence about what the current app uses. Changing them on a
 * guess would break the parts that do still work.
 *
 * To go back to the original identity, restore the four values noted inline.
 */

const AppProfile = {
	apiRoot: "https://www.clubhouseapi.com/api",

	// --- application identity -------------------------------------------
	// was: "clubhouse/304 (iPhone; iOS 14.4; Scale/2.00)"
	userAgent: "clubhouse/2446 (iPhone; iOS 16.6; Scale/2.00)",
	// was: "Clubhouse/304 CFNetwork/1220.1 Darwin/20.3.0"
	// CFNetwork/Darwin pair matches iOS 16.6, to stay internally consistent.
	userAgentStatic: "Clubhouse/2446 CFNetwork/1410.0.3 Darwin/22.6.0",
	// was: "0.1.28"
	appVersion: "23.09.01",
	// was: "304"
	appBuild: "2446",
	// ---------------------------------------------------------------------

	// Unchanged from the a304 profile in the clubhouse-api package.
	agoraKey: "938de3e8055e42b281bb8c6f69c21f78",
	pubnubRoot: "https://clubhouse.pubnub.com",
	pubnubPubKey: "pub-c-6878d382-5ae6-4494-9099-f930f938868b",
	pubnubSubKey: "sub-c-a4abea84-9ca3-11ea-8e71-f2b83ac9263d",
	pubnubSDK: "PubNFub-ObjC-iOS/4.15.11"
};

export default AppProfile;
