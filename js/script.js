const ACTIVE_ACTION_CLASS = "card__action--active";
const ACTION_HIDE_CLASS_SELECTOR = ".card__action-hide";
const ACTION_FAVORITE_CLASS_SELECTOR = ".card__action-favorite";
const ACTION_COMPARE_CLASS_SELECTOR = ".card__action-compare";
const CARD_CLASS_SELECTOR = ".card";
const TRANSLUCENT_CARD_CLASS = "card--translucent";
const HIDDEN_CARD_CLASS = "card-hidden";
const HIDE_CARDS_CHECKBOX_CLASS_SELECTOR = ".catalog__checkbox label input";
const hideCardCheckbox = document.querySelector(
  HIDE_CARDS_CHECKBOX_CLASS_SELECTOR,
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

const hiddenCards = [];
const favoriteCards = [];
const comparableCards = [];

showHiddenCheckboxes.forEach((button) => {
  button.addEventListener("click", () => toggleCardHideState(button));
});

showFavoriteButtons.forEach((button) => {
  button.addEventListener("click", () => toggleCardFavoriteState(button));
});

showCompareButtons.forEach((button) => {
  button.addEventListener("click", () => toggleCardCompareState(button));
});

hideCardCheckbox.addEventListener("change", () => toggleHiddenCards());

const toggleHiddenCards = function () {
  hiddenCards.forEach((cardId) => {
    const cardClasses = document.getElementById(cardId).classList;
    cardClasses.toggle(TRANSLUCENT_CARD_CLASS);
    cardClasses.toggle(HIDDEN_CARD_CLASS);
  });
};

const toggleCardHideState = function (button) {
  toggleCardState(button, hiddenCards);
};

const toggleCardFavoriteState = function (button) {
  toggleCardState(button, favoriteCards);
};

const toggleCardCompareState = function (button) {
  toggleCardState(button, comparableCards);
};

const toggleCardState = function (button, actionCards) {
  const card = button.closest(CARD_CLASS_SELECTOR);
  const cardId = card.id;
  if (!actionCards.includes(cardId)) {
    actionCards.push(cardId);
  } else {
    actionCards.splice(actionCards.indexOf(cardId), 1);
  }
  button.classList.toggle(ACTIVE_ACTION_CLASS);

  if (button.matches(ACTION_HIDE_CLASS_SELECTOR)) {
    const cardHideClass = hideCardCheckbox.checked
      ? TRANSLUCENT_CARD_CLASS
      : HIDDEN_CARD_CLASS;
    card.classList.toggle(cardHideClass);
  }
};
