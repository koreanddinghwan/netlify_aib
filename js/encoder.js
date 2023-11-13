export function convertr(text) {
  const first = text[0] || "";
  const middle = text[1] || "";
  const last = text[2] || "";

  if (!middle) {
    return first;
  }

  const middle_unicode = middle.charCodeAt(0);

  const first_connecter = [
    "ㄱ",
    "ㄲ",
    "ㄴ",
    "ㄷ",
    "ㄸ",
    "ㄹ",
    "ㅁ",
    "ㅂ",
    "ㅃ",
    "ㅅ",
    "ㅆ",
    "ㅇ",
    "ㅈ",
    "ㅉ",
    "ㅊ",
    "ㅋ",
    "ㅌ",
    "ㅍ",
    "ㅎ",
  ].reduce(
    (acc, cur, idx) => ({
      ...acc,
      [cur]: idx,
    }),
    {}
  );

  const last_connecter = [
    "",
    "ㄱ",
    "ㄲ",
    "ㄳ",
    "ㄴ",
    "ㄵ",
    "ㄶ",
    "ㄷ",
    "ㄹ",
    "ㄺ",
    "ㄻ",
    "ㄼ",
    "ㄽ",
    "ㄾ",
    "ㄿ",
    "ㅀ",
    "ㅁ",
    "ㅂ",
    "ㅄ",
    "ㅅ",
    "ㅆ",
    "ㅇ",
    "ㅈ",
    "ㅊ",
    "ㅋ",
    "ㅌ",
    "ㅍ",
    "ㅎ",
  ].reduce(
    (acc, cur, idx) => ({
      ...acc,
      [cur]: idx,
    }),
    {}
  );

  const unicode_start_point = 12623;
  const unicode_korean_start_point = 44032;

  const first_index = first_connecter[first];
  const middle_index = middle_unicode - unicode_start_point;
  const last_index = last_connecter[last];

  return String.fromCharCode(
	unicode_korean_start_point
	+ first_index * 588
	+ middle_index * 28
	+ last_index
  )
}
