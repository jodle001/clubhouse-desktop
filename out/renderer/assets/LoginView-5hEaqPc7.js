import { _ as _export_sfc, r as ref, o as onMounted, c as createElementBlock, u as unref, a as createBlock, b as createBaseVNode, w as withDirectives, v as vModelSelect, F as Fragment, d as renderList, e as vModelText, f as withKeys, g as createTextVNode, t as toDisplayString, h as createCommentVNode, i as useSession, j as updateSettings, k as computed, l as useRouter, m as openBlock } from "./index-BhP8XgzU.js";
import { u as useApi, A as AppSpinner } from "./AppSpinner-DLdDc0YF.js";
const COUNTRIES = [
  { name: "Albania", iso: "AL", dial: "355", trunk: true },
  { name: "Algeria", iso: "DZ", dial: "213", trunk: true },
  { name: "Argentina", iso: "AR", dial: "54", trunk: true },
  { name: "Armenia", iso: "AM", dial: "374", trunk: true },
  { name: "Australia", iso: "AU", dial: "61", trunk: true },
  { name: "Austria", iso: "AT", dial: "43", trunk: true },
  { name: "Azerbaijan", iso: "AZ", dial: "994", trunk: true },
  { name: "Bahrain", iso: "BH", dial: "973" },
  { name: "Bangladesh", iso: "BD", dial: "880", trunk: true },
  { name: "Belarus", iso: "BY", dial: "375", trunk: true },
  { name: "Belgium", iso: "BE", dial: "32", trunk: true },
  { name: "Bolivia", iso: "BO", dial: "591" },
  { name: "Bosnia and Herzegovina", iso: "BA", dial: "387", trunk: true },
  { name: "Brazil", iso: "BR", dial: "55", trunk: true },
  { name: "Bulgaria", iso: "BG", dial: "359", trunk: true },
  { name: "Cambodia", iso: "KH", dial: "855", trunk: true },
  { name: "Cameroon", iso: "CM", dial: "237" },
  { name: "Canada", iso: "CA", dial: "1", nsn: 10 },
  { name: "Chile", iso: "CL", dial: "56" },
  { name: "China", iso: "CN", dial: "86", trunk: true },
  { name: "Colombia", iso: "CO", dial: "57" },
  { name: "Costa Rica", iso: "CR", dial: "506" },
  { name: "Croatia", iso: "HR", dial: "385", trunk: true },
  { name: "Cuba", iso: "CU", dial: "53" },
  { name: "Cyprus", iso: "CY", dial: "357" },
  { name: "Czechia", iso: "CZ", dial: "420" },
  { name: "Denmark", iso: "DK", dial: "45" },
  { name: "Dominican Republic", iso: "DO", dial: "1", nsn: 10 },
  { name: "Ecuador", iso: "EC", dial: "593", trunk: true },
  { name: "Egypt", iso: "EG", dial: "20", trunk: true },
  { name: "El Salvador", iso: "SV", dial: "503" },
  { name: "Estonia", iso: "EE", dial: "372" },
  { name: "Ethiopia", iso: "ET", dial: "251", trunk: true },
  { name: "Finland", iso: "FI", dial: "358", trunk: true },
  { name: "France", iso: "FR", dial: "33", trunk: true },
  { name: "Georgia", iso: "GE", dial: "995", trunk: true },
  { name: "Germany", iso: "DE", dial: "49", trunk: true },
  { name: "Ghana", iso: "GH", dial: "233", trunk: true },
  { name: "Greece", iso: "GR", dial: "30" },
  { name: "Guatemala", iso: "GT", dial: "502" },
  { name: "Honduras", iso: "HN", dial: "504" },
  { name: "Hong Kong", iso: "HK", dial: "852" },
  { name: "Hungary", iso: "HU", dial: "36", trunk: true },
  { name: "Iceland", iso: "IS", dial: "354" },
  { name: "India", iso: "IN", dial: "91", trunk: true },
  { name: "Indonesia", iso: "ID", dial: "62", trunk: true },
  { name: "Iran", iso: "IR", dial: "98", trunk: true },
  { name: "Iraq", iso: "IQ", dial: "964", trunk: true },
  { name: "Ireland", iso: "IE", dial: "353", trunk: true },
  { name: "Israel", iso: "IL", dial: "972", trunk: true },
  // No trunk flag: Italian landline numbers keep their leading 0.
  { name: "Italy", iso: "IT", dial: "39" },
  { name: "Ivory Coast", iso: "CI", dial: "225" },
  { name: "Jamaica", iso: "JM", dial: "1", nsn: 10 },
  { name: "Japan", iso: "JP", dial: "81", trunk: true },
  { name: "Jordan", iso: "JO", dial: "962", trunk: true },
  { name: "Kazakhstan", iso: "KZ", dial: "7", trunk: true },
  { name: "Kenya", iso: "KE", dial: "254", trunk: true },
  { name: "Kuwait", iso: "KW", dial: "965" },
  { name: "Latvia", iso: "LV", dial: "371" },
  { name: "Lebanon", iso: "LB", dial: "961", trunk: true },
  { name: "Libya", iso: "LY", dial: "218", trunk: true },
  { name: "Lithuania", iso: "LT", dial: "370", trunk: true },
  { name: "Luxembourg", iso: "LU", dial: "352" },
  { name: "Macau", iso: "MO", dial: "853" },
  { name: "Malaysia", iso: "MY", dial: "60", trunk: true },
  { name: "Malta", iso: "MT", dial: "356" },
  { name: "Mexico", iso: "MX", dial: "52", trunk: true },
  { name: "Moldova", iso: "MD", dial: "373", trunk: true },
  { name: "Montenegro", iso: "ME", dial: "382", trunk: true },
  { name: "Morocco", iso: "MA", dial: "212", trunk: true },
  { name: "Myanmar", iso: "MM", dial: "95", trunk: true },
  { name: "Nepal", iso: "NP", dial: "977", trunk: true },
  { name: "Netherlands", iso: "NL", dial: "31", trunk: true },
  { name: "New Zealand", iso: "NZ", dial: "64", trunk: true },
  { name: "Nicaragua", iso: "NI", dial: "505" },
  { name: "Nigeria", iso: "NG", dial: "234", trunk: true },
  { name: "North Macedonia", iso: "MK", dial: "389", trunk: true },
  { name: "Norway", iso: "NO", dial: "47" },
  { name: "Oman", iso: "OM", dial: "968" },
  { name: "Pakistan", iso: "PK", dial: "92", trunk: true },
  { name: "Panama", iso: "PA", dial: "507" },
  { name: "Paraguay", iso: "PY", dial: "595", trunk: true },
  { name: "Peru", iso: "PE", dial: "51", trunk: true },
  { name: "Philippines", iso: "PH", dial: "63", trunk: true },
  { name: "Poland", iso: "PL", dial: "48" },
  { name: "Portugal", iso: "PT", dial: "351" },
  { name: "Puerto Rico", iso: "PR", dial: "1", nsn: 10 },
  { name: "Qatar", iso: "QA", dial: "974" },
  { name: "Romania", iso: "RO", dial: "40", trunk: true },
  { name: "Russia", iso: "RU", dial: "7", trunk: true },
  { name: "Saudi Arabia", iso: "SA", dial: "966", trunk: true },
  { name: "Senegal", iso: "SN", dial: "221" },
  { name: "Serbia", iso: "RS", dial: "381", trunk: true },
  { name: "Singapore", iso: "SG", dial: "65" },
  { name: "Slovakia", iso: "SK", dial: "421", trunk: true },
  { name: "Slovenia", iso: "SI", dial: "386", trunk: true },
  { name: "South Africa", iso: "ZA", dial: "27", trunk: true },
  { name: "South Korea", iso: "KR", dial: "82", trunk: true },
  { name: "Spain", iso: "ES", dial: "34" },
  { name: "Sri Lanka", iso: "LK", dial: "94", trunk: true },
  { name: "Sweden", iso: "SE", dial: "46", trunk: true },
  { name: "Switzerland", iso: "CH", dial: "41", trunk: true },
  { name: "Taiwan", iso: "TW", dial: "886", trunk: true },
  { name: "Tanzania", iso: "TZ", dial: "255", trunk: true },
  { name: "Thailand", iso: "TH", dial: "66", trunk: true },
  { name: "Trinidad and Tobago", iso: "TT", dial: "1", nsn: 10 },
  { name: "Tunisia", iso: "TN", dial: "216" },
  { name: "Turkey", iso: "TR", dial: "90", trunk: true },
  { name: "Uganda", iso: "UG", dial: "256", trunk: true },
  { name: "Ukraine", iso: "UA", dial: "380", trunk: true },
  { name: "United Arab Emirates", iso: "AE", dial: "971", trunk: true },
  { name: "United Kingdom", iso: "GB", dial: "44", trunk: true },
  { name: "United States", iso: "US", dial: "1", nsn: 10 },
  { name: "Uruguay", iso: "UY", dial: "598", trunk: true },
  { name: "Uzbekistan", iso: "UZ", dial: "998", trunk: true },
  { name: "Venezuela", iso: "VE", dial: "58", trunk: true },
  { name: "Vietnam", iso: "VN", dial: "84", trunk: true },
  { name: "Zambia", iso: "ZM", dial: "260", trunk: true },
  { name: "Zimbabwe", iso: "ZW", dial: "263", trunk: true }
];
const DEFAULT_COUNTRY = "US";
function findCountry(iso) {
  return COUNTRIES.find((c) => c.iso === iso) || COUNTRIES.find((c) => c.iso === DEFAULT_COUNTRY);
}
function normalizePhone(raw) {
  if (!raw) {
    return "";
  }
  const trimmed = String(raw).trim();
  const hasPlus = trimmed.startsWith("+");
  const digits = trimmed.replace(/\D/g, "");
  if (!digits) {
    return "";
  }
  return (hasPlus ? "+" : "") + digits;
}
function composePhone(country, local) {
  const raw = String(local || "").trim();
  if (raw.startsWith("+")) {
    return normalizePhone(raw);
  }
  let digits = raw.replace(/\D/g, "");
  if (!digits) {
    return "";
  }
  if (country && country.trunk) {
    digits = digits.replace(/^0+/, "");
  }
  if (!country) {
    return "+" + digits;
  }
  if (digits.startsWith(country.dial) && digits.length - country.dial.length >= 6) {
    return "+" + digits;
  }
  return "+" + country.dial + digits;
}
function phoneError(normalized, country) {
  if (!normalized) {
    return "Enter your phone number.";
  }
  if (!normalized.startsWith("+")) {
    if (normalized.startsWith("0")) {
      return `That looks like a national number. Drop the leading 0 and add your country code, for example +44${normalized.slice(1)} for the UK.`;
    }
    return `Include your country code, starting with +. For example +1${normalized} for the US.`;
  }
  if (!/^\+[1-9]\d{6,14}$/.test(normalized)) {
    return `${normalized} is not a valid international number.`;
  }
  if (country && country.nsn && normalized.startsWith("+" + country.dial)) {
    const national = normalized.slice(1 + country.dial.length);
    if (national.length !== country.nsn) {
      return `A ${country.name} number needs ${country.nsn} digits after +${country.dial}, but ${national.length} ${national.length === 1 ? "was" : "were"} entered.`;
    }
  }
  return null;
}
const _hoisted_1 = { class: "center-screen" };
const _hoisted_2 = {
  key: 1,
  class: "card login"
};
const _hoisted_3 = { class: "stack" };
const _hoisted_4 = ["value"];
const _hoisted_5 = { class: "login__preview muted" };
const _hoisted_6 = {
  key: 0,
  class: "error-box"
};
const _sfc_main = {
  __name: "LoginView",
  setup(__props) {
    const router = useRouter();
    const { state } = useSession();
    const { loading, call } = useApi();
    const local = ref("");
    const country = ref(state.settings.country || DEFAULT_COUNTRY);
    const error = ref("");
    const selected = computed(() => findCountry(country.value));
    const preview = computed(() => composePhone(selected.value, local.value));
    onMounted(() => {
      if (state.settings.country) {
        country.value = state.settings.country;
      }
    });
    function onCountryChange() {
      updateSettings({ country: country.value });
    }
    async function submit() {
      const phone = composePhone(selected.value, local.value);
      const problem = phoneError(phone, selected.value);
      if (problem) {
        error.value = problem;
        return;
      }
      error.value = "";
      loading.value = true;
      try {
        const result = await call("startPhoneAuth", phone);
        if (result.success) {
          router.push({ name: "verify", query: { phone } });
          return;
        }
        error.value = result.error_message || "Clubhouse rejected the request.";
      } catch (err) {
        error.value = err.message;
      } finally {
        loading.value = false;
      }
    }
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1, [
        unref(loading) ? (openBlock(), createBlock(AppSpinner, { key: 0 })) : (openBlock(), createElementBlock("div", _hoisted_2, [
          _cache[2] || (_cache[2] = createBaseVNode("div", {
            class: "login__logo",
            "aria-hidden": "true"
          }, "👋", -1)),
          _cache[3] || (_cache[3] = createBaseVNode("h1", null, "Clubhouse", -1)),
          _cache[4] || (_cache[4] = createBaseVNode("p", { class: "muted login__sub" }, "Unofficial desktop client", -1)),
          createBaseVNode("div", _hoisted_3, [
            withDirectives(createBaseVNode("select", {
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => country.value = $event),
              "aria-label": "Country",
              onChange: onCountryChange
            }, [
              (openBlock(true), createElementBlock(Fragment, null, renderList(unref(COUNTRIES), (c) => {
                return openBlock(), createElementBlock("option", {
                  key: c.iso,
                  value: c.iso
                }, toDisplayString(c.name) + " (+" + toDisplayString(c.dial) + ") ", 9, _hoisted_4);
              }), 128))
            ], 544), [
              [vModelSelect, country.value]
            ]),
            withDirectives(createBaseVNode("input", {
              "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => local.value = $event),
              type: "tel",
              autofocus: "",
              placeholder: "555 123 4567",
              "aria-label": "Phone number",
              onKeyup: withKeys(submit, ["enter"])
            }, null, 544), [
              [vModelText, local.value]
            ])
          ]),
          createBaseVNode("p", _hoisted_5, [
            preview.value ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
              createTextVNode("Will be sent as " + toDisplayString(preview.value), 1)
            ], 64)) : (openBlock(), createElementBlock(Fragment, { key: 1 }, [
              createTextVNode("Enter your number the way you normally write it")
            ], 64))
          ]),
          createBaseVNode("button", {
            class: "btn login__submit",
            onClick: submit
          }, "Next"),
          error.value ? (openBlock(), createElementBlock("p", _hoisted_6, toDisplayString(error.value), 1)) : createCommentVNode("", true)
        ]))
      ]);
    };
  }
};
const LoginView = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-1c2fb311"]]);
export {
  LoginView as default
};
