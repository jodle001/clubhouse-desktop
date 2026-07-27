import { z as notify, r as ref, _ as _export_sfc, m as openBlock, c as createElementBlock } from "./index-BhP8XgzU.js";
async function call(method, ...args) {
  const fn = window.clubhouse.api[method];
  if (!fn) {
    throw new Error(`Unknown API method: ${method}`);
  }
  const result = await fn(...args);
  if (result.ok) {
    return result.data;
  }
  const error = new Error(result.error?.message || "Request failed");
  error.status = result.error?.status ?? null;
  throw error;
}
function useApi() {
  const loading = ref(false);
  const error = ref("");
  async function run(method, ...args) {
    loading.value = true;
    error.value = "";
    try {
      return await call(method, ...args);
    } catch (err) {
      error.value = err.message;
      notify({ type: "error", message: err.message });
      return null;
    } finally {
      loading.value = false;
    }
  }
  return { loading, error, run, call };
}
const _sfc_main = {};
const _hoisted_1 = {
  class: "spinner",
  role: "status",
  "aria-label": "Loading"
};
function _sfc_render(_ctx, _cache) {
  return openBlock(), createElementBlock("div", _hoisted_1);
}
const AppSpinner = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
export {
  AppSpinner as A,
  call as c,
  useApi as u
};
