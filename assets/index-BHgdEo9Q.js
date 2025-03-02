var __typeError = (msg) => {
  throw TypeError(msg);
};
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
var _winningNumbers, _bonusNumber, _LottoComparer_instances, getMatchingCount_fn, calculateCompareResult_fn, hasBonusNumber_fn, _LottoGenerator_static, sortNumbers_fn, getRandomNumbers_fn, _prizeResult, _LottoPrize_instances, calculateTotalPrize_fn;
(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
const PURCHASE = {
  UNIT: 1e3,
  MAX_AMOUNT: 2e4
};
const LOTTO = {
  MAX_NUMBER: 45,
  MIN_NUMBER: 1,
  MAX_LENGTH: 6
};
const PRIZE = {
  FIRST: 2e9,
  SECOND: 3e7,
  THIRD: 15e5,
  FOURTH: 5e4,
  FIFTH: 5e3,
  MIN_MATCH_COUNT: 3
};
class LottoComparer {
  constructor(winningNumbers, bonusNumber) {
    __privateAdd(this, _LottoComparer_instances);
    __privateAdd(this, _winningNumbers);
    __privateAdd(this, _bonusNumber);
    __privateSet(this, _winningNumbers, winningNumbers);
    __privateSet(this, _bonusNumber, bonusNumber);
  }
  lottoCompareResult(generatedLottos) {
    let compareResult = [];
    generatedLottos.forEach((lotto) => {
      const matchingCount = __privateMethod(this, _LottoComparer_instances, getMatchingCount_fn).call(this, lotto);
      __privateMethod(this, _LottoComparer_instances, calculateCompareResult_fn).call(this, matchingCount, lotto, compareResult);
    });
    return compareResult;
  }
}
_winningNumbers = new WeakMap();
_bonusNumber = new WeakMap();
_LottoComparer_instances = new WeakSet();
getMatchingCount_fn = function(lotto) {
  return lotto.filter((number) => __privateGet(this, _winningNumbers).includes(number)).length;
};
calculateCompareResult_fn = function(matchingCount, lotto, compareResult) {
  if (matchingCount >= PRIZE.MIN_MATCH_COUNT) {
    compareResult.push({
      matchCount: matchingCount,
      hasBonus: __privateMethod(this, _LottoComparer_instances, hasBonusNumber_fn).call(this, matchingCount, lotto)
    });
  }
};
hasBonusNumber_fn = function(matchingCount, lotto) {
  return matchingCount === 5 && lotto.includes(__privateGet(this, _bonusNumber));
};
class LottoGenerator {
  static getGenerateLottos(price) {
    let generatedLottos = [];
    for (let i = 0; i < price / PURCHASE.UNIT; i++) {
      const randomNumbers = __privateMethod(this, _LottoGenerator_static, getRandomNumbers_fn).call(this);
      const sortedRandomNumbers = __privateMethod(this, _LottoGenerator_static, sortNumbers_fn).call(this, randomNumbers);
      generatedLottos.push(sortedRandomNumbers);
    }
    return generatedLottos;
  }
}
_LottoGenerator_static = new WeakSet();
sortNumbers_fn = function(numbers) {
  return numbers.sort((a, b) => a - b);
};
getRandomNumbers_fn = function() {
  const randomNumbers = /* @__PURE__ */ new Set();
  while (randomNumbers.size < LOTTO.MAX_LENGTH) {
    randomNumbers.add(
      Math.floor(Math.random() * LOTTO.MAX_NUMBER) + LOTTO.MIN_NUMBER
    );
  }
  return [...randomNumbers];
};
__privateAdd(LottoGenerator, _LottoGenerator_static);
class LottoPrize {
  constructor() {
    __privateAdd(this, _LottoPrize_instances);
    __privateAdd(this, _prizeResult);
    __privateSet(this, _prizeResult, {
      firstPrize: 0,
      secondPrize: 0,
      thirdPrize: 0,
      fourthPrize: 0,
      fifthPrize: 0
    });
  }
  get prizeResult() {
    return __privateGet(this, _prizeResult);
  }
  calculateTotalPrizeCount(compareResult) {
    compareResult.forEach(({ matchCount, hasBonus }) => {
      if (matchCount === 6) ++__privateGet(this, _prizeResult).firstPrize;
      else if (matchCount === 5 && hasBonus) ++__privateGet(this, _prizeResult).secondPrize;
      else if (matchCount === 5 && !hasBonus) ++__privateGet(this, _prizeResult).thirdPrize;
      else if (matchCount === 4) ++__privateGet(this, _prizeResult).fourthPrize;
      else if (matchCount === 3) ++__privateGet(this, _prizeResult).fifthPrize;
    });
  }
  calculateROI(price) {
    if (__privateMethod(this, _LottoPrize_instances, calculateTotalPrize_fn).call(this) === 0) return 0;
    return ((__privateMethod(this, _LottoPrize_instances, calculateTotalPrize_fn).call(this) - price) / price * 100).toFixed(2);
  }
}
_prizeResult = new WeakMap();
_LottoPrize_instances = new WeakSet();
calculateTotalPrize_fn = function() {
  return Object.keys(__privateGet(this, _prizeResult)).reduce((acc, curr) => {
    switch (curr) {
      case "firstPrize":
        return acc + PRIZE.FIRST * __privateGet(this, _prizeResult)[curr];
      case "secondPrize":
        return acc + PRIZE.SECOND * __privateGet(this, _prizeResult)[curr];
      case "thirdPrize":
        return acc + PRIZE.THIRD * __privateGet(this, _prizeResult)[curr];
      case "fourthPrize":
        return acc + PRIZE.FOURTH * __privateGet(this, _prizeResult)[curr];
      case "fifthPrize":
        return acc + PRIZE.FIFTH * __privateGet(this, _prizeResult)[curr];
    }
  }, 0);
};
const elements = {
  purchaseInput: document.querySelector("#purchase-input"),
  purchaseButton: document.querySelector("#purchase-button"),
  lottoCountSpan: document.querySelector("#lotto-count-message"),
  generateSection: document.querySelector("#generate-section"),
  generatedLottosLists: document.querySelector("#generated-lottos-lists"),
  resultSection: document.querySelector("#result-section"),
  winningNumberInputs: document.querySelectorAll('[id^="winning-number-"]'),
  bonusNumberInput: document.querySelector("#bonus-number"),
  resultButton: document.querySelector("#result-button"),
  ROISpan: document.querySelector("#ROI"),
  modalCloseButton: document.querySelector("#close-button"),
  restartButton: document.querySelector("#restart-button"),
  modal: document.querySelector("#modal"),
  trs: document.querySelectorAll('[id$="Prize"]')
};
const ERROR_MESSAGE = {
  PURCHASE_UNIT: `구입 금액은 ${PURCHASE.UNIT.toLocaleString()}원 단위로 입력해주세요.`,
  PURCHASE_MIN_VALUE: `구입 금액은 ${PURCHASE.UNIT.toLocaleString()}원 이상이여야 합니다.`,
  PURCHASE_MAX_VALUE: `구입 금액은 ${PURCHASE.MAX_AMOUNT.toLocaleString()}원 이하여야 합니다.`,
  IS_NUMERIC: `숫자를 입력해주세요.`,
  LOTTO_NUMBER_RANGE: `당첨 번호가 ${LOTTO.MIN_NUMBER}부터 ${LOTTO.MAX_NUMBER} 사이의 숫자여야 합니다.`,
  WINNING_NUMBER_DUPLICATE: "당첨 번호는 중복되지 않아야 합니다",
  WINNING_NUMBERS_LENGTH: "당첨 번호는 6개여야 합니다.",
  BONUS_NUMBER_UNIQUE: "보너스 번호는 당첨 번호와 중복되면 안됩니다."
};
const validatePurchaseUnit = (price) => {
  if (price % PURCHASE.UNIT !== 0) {
    throw new Error(ERROR_MESSAGE.PURCHASE_UNIT);
  }
};
const validateMinimumValue = (input) => {
  if (input < PURCHASE.UNIT) {
    throw new Error(ERROR_MESSAGE.PURCHASE_MIN_VALUE);
  }
};
const validateMaximumValue = (input) => {
  if (input > PURCHASE.MAX_AMOUNT) {
    throw new Error(ERROR_MESSAGE.PURCHASE_MAX_VALUE);
  }
};
const validateIsNumeric = (input) => {
  if (Number.isNaN(Number(input))) {
    throw new Error(ERROR_MESSAGE.IS_NUMERIC);
  }
};
const validateLottoNumberRange = (input) => {
  if (input < LOTTO.MIN_NUMBER || input > LOTTO.MAX_NUMBER) {
    throw new Error(ERROR_MESSAGE.LOTTO_NUMBER_RANGE);
  }
};
const validateWinningNumberDuplicate = (input) => {
  if (input.length !== new Set(input).size) {
    throw new Error(ERROR_MESSAGE.WINNING_NUMBER_DUPLICATE);
  }
};
const validateWinningNumbersLength = (winningNumber) => {
  if (winningNumber.length !== LOTTO.MAX_LENGTH) {
    throw new Error(ERROR_MESSAGE.WINNING_NUMBERS_LENGTH);
  }
};
const validateBonusNumberUnique = (winningNumber, bonusNumber) => {
  if (winningNumber.includes(bonusNumber))
    throw new Error(ERROR_MESSAGE.BONUS_NUMBER_UNIQUE);
};
const priceValidateList = [
  validateIsNumeric,
  validateMinimumValue,
  validatePurchaseUnit,
  validateMaximumValue
];
const validatePrice = (price) => {
  priceValidateList.forEach((validate) => {
    validate(price);
  });
};
const validateWinningNumbers = (winningNumbers) => {
  winningNumbers.forEach((number) => {
    validateIsNumeric(number);
    validateLottoNumberRange(number);
  });
  validateWinningNumberDuplicate(winningNumbers);
  validateWinningNumbersLength(winningNumbers);
};
const updateUI = {
  updatePurchaseMessage(price) {
    elements.lottoCountSpan.textContent = `총 ${Number(
      price / PURCHASE.UNIT
    )}개를 구매하였습니다.`;
  },
  updatePrizeResult(lottoPrize) {
    for (const key in lottoPrize.prizeResult) {
      const div = document.querySelector(`#${key}`);
      const span = document.createElement("td");
      span.textContent = lottoPrize.prizeResult[key] + "개";
      div.appendChild(span);
    }
  },
  updateROI(ROI) {
    elements.ROISpan.textContent = `당신의 총 수입률은 총 ${ROI}%입니다.`;
  }
};
const showUI = {
  showGeneratedLottos(generatedLottos) {
    generatedLottos.forEach((lotto) => {
      const li = document.createElement("li");
      li.textContent = `🎟️ ${lotto.join(", ")}`;
      elements.generatedLottosLists.appendChild(li);
    });
  }
};
const removeUI = {
  removeInputValue(input) {
    input.value = "";
  },
  removeGeneratedLottosLists() {
    while (elements.generatedLottosLists.firstChild) {
      elements.generatedLottosLists.removeChild(
        elements.generatedLottosLists.firstChild
      );
    }
  },
  removePrizeResultCountElements() {
    elements.trs.forEach((tr) => {
      tr.lastChild.remove();
    });
  }
};
const validUI = {
  isValidPrice(price) {
    try {
      validatePrice(price);
      return true;
    } catch (error) {
      alert(error.message);
      removeUI.removeInputValue(elements.purchaseInput);
      return false;
    }
  },
  isValidWinningNumbers(winningNumbers) {
    try {
      validateWinningNumbers(winningNumbers);
      return true;
    } catch (error) {
      alert(error.message);
      elements.winningNumberInputs.forEach((input) => {
        removeUI.removeInputValue(input);
      });
      return false;
    }
  },
  isValidBonusNumber(winningNumbers, bonusNumber) {
    try {
      validateBonusNumberUnique(winningNumbers, bonusNumber);
      return true;
    } catch (error) {
      alert(error.message);
      removeUI.removeInputValue(elements.bonusNumberInput);
      return false;
    }
  }
};
const displayUI = {
  displayBlock(element) {
    element.style.display = "block";
  },
  displayNone(element) {
    element.style.display = "none";
  }
};
const state = {
  price: 0,
  generatedLottos: [],
  winningNumbers: []
};
document.addEventListener("DOMContentLoaded", () => {
  const purchaseButton = document.querySelector("#purchase-button");
  purchaseButton.addEventListener("click", purchase);
  elements.resultButton.addEventListener("click", checkResult);
  elements.modalCloseButton.addEventListener("click", closeModal);
  elements.restartButton.addEventListener("click", restartLotto);
});
function purchase() {
  state.price = Number(elements.purchaseInput.value);
  if (!validUI.isValidPrice(state.price)) return;
  state.generatedLottos = LottoGenerator.getGenerateLottos(state.price);
  updateUI.updatePurchaseMessage(state.price);
  showUI.showGeneratedLottos(state.generatedLottos);
  removeUI.removeInputValue(elements.purchaseInput);
  displayUI.displayBlock(elements.generateSection);
  displayUI.displayBlock(elements.resultSection);
}
function checkResult() {
  state.winningNumbers = Array.from(
    elements.winningNumberInputs,
    (input) => Number(input.value)
  );
  const bonusNumber = Number(elements.bonusNumberInput.value);
  if (!validUI.isValidWinningNumbers(state.winningNumbers) || !validUI.isValidBonusNumber(state.winningNumbers, bonusNumber))
    return;
  const lottoComparer = new LottoComparer(state.winningNumbers, bonusNumber);
  const compareResult = lottoComparer.lottoCompareResult(state.generatedLottos);
  const lottoPrize = new LottoPrize();
  lottoPrize.calculateTotalPrizeCount(compareResult);
  const ROI = lottoPrize.calculateROI(state.price);
  updateUI.updatePrizeResult(lottoPrize);
  updateUI.updateROI(ROI);
  displayUI.displayBlock(elements.modal);
}
function closeModal() {
  displayUI.displayNone(elements.modal);
  removeUI.removePrizeResultCountElements();
}
function restartLotto() {
  displayUI.displayNone(elements.modal);
  displayUI.displayNone(elements.generateSection);
  displayUI.displayNone(elements.resultSection);
  elements.winningNumberInputs.forEach((input) => {
    removeUI.removeInputValue(input);
  });
  removeUI.removeInputValue(elements.bonusNumberInput);
  removeUI.removeGeneratedLottosLists();
  removeUI.removePrizeResultCountElements();
}
