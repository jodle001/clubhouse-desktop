/**
 * Room-topic language filtering, extracted from two views that each carried
 * their own copy of the same regex.
 */

const NON_LATIN = /[぀-ヿ㐀-䶿一-鿿豈-﫿ｦ-ﾟ]/;

/** True when a string contains no CJK/Kana characters. Empty counts as Latin. */
export function isLatin(text) {
	if (!text) {
		return true;
	}

	return !NON_LATIN.test(text);
}
