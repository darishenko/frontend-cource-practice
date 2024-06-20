const ACTIVE_ACTION_CLASS = "card__action--active";
const ACTION_HIDE_CLASS_SELECTOR = ".card__action-hide";
const ACTION_FAVORITE_CLASS_SELECTOR = ".card__action-favorite";
const ACTION_COMPARE_CLASS_SELECTOR = ".card__action-compare";
const CARD_CLASS_SELECTOR = ".card";
const TRANSLUCENT_CARD_CLASS = "card--translucent";
const HIDDEN_CARD_CLASS = "card-hidden";
const hideCardCheckbox = document.querySelector(
  ".catalog__checkbox label input",
);
const showHiddenCheckboxes = document.querySelectorAll(
  ACTION_HIDE_CLASS_SELECTOR,
);
const showFavoriteButtons = document.querySelectorAll(
  ACTION_FAVORITE_CLASS_SELECTOR,
);
const showCompareButtons = document.querySelectorAll(
  ACTION_COMPARE_CLASS_SELECTOR,
);

let hiddenCards = [];
let favoriteCards = [];
let comparableCards = [];

showHiddenCheckboxes.forEach((button) => {
  button.addEventListener("click", () => toggleCardHideState(button));
});

showFavoriteButtons.forEach((button) => {
  button.addEventListener("click", () => toggleCardFavoriteState(button));
});

showCompareButtons.forEach((button) => {
  button.addEventListener("click", () => toggleCardCompareState(button));
});

const toggleCardHideState = function (button) {
  toggleCardState(button, hiddenCards, ACTION_HIDE_CLASS_SELECTOR);
};

const toggleCardFavoriteState = function (button) {
  toggleCardState(button, favoriteCards, ACTION_FAVORITE_CLASS_SELECTOR);
};

const toggleCardCompareState = function (button) {
  toggleCardState(button, comparableCards, ACTION_COMPARE_CLASS_SELECTOR);
};
const toggleCardState = function (button, actionCards, actionClassSelector) {
  let card = button.closest(CARD_CLASS_SELECTOR);
  let cardId = card.id;
  if (!actionCards.includes(cardId)) {
    actionCards.push(cardId);
  } else {
    actionCards.splice(actionCards.indexOf(cardId), 1);
  }
  button.classList.toggle(ACTIVE_ACTION_CLASS);

  if (ACTION_HIDE_CLASS_SELECTOR === actionClassSelector) {
    if (hideCardCheckbox.checked) {
      card.classList.toggle(TRANSLUCENT_CARD_CLASS);
    } else {
      card.classList.toggle(HIDDEN_CARD_CLASS);
    }
  }
};
