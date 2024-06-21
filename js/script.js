const ACTIVE_ACTION_CLASS = "card__action--active";
const ACTION_HIDE_CLASS_SELECTOR = ".card__action-hide";
const ACTION_FAVORITE_CLASS_SELECTOR = ".card__action-favorite";
const ACTION_COMPARE_CLASS_SELECTOR = ".card__action-compare";
const CARD_CLASS_SELECTOR = ".card";
const TRANSLUCENT_CARD_CLASS = "card--translucent";
const HIDDEN_CARD_CLASS = "card--hidden";
const HIDE_CARDS_CHECKBOX_CLASS_SELECTOR = ".catalog__checkbox label input";
const CATALOG_FILTER_BUTTONS_CLASS_SELECTOR = 'input[name="catalog-filter"]';
const showHiddenCardsCheckbox = document.querySelector(
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
const catalogFilterButtons = document.querySelectorAll(
  CATALOG_FILTER_BUTTONS_CLASS_SELECTOR,
);
const cards = Array.from(document.querySelectorAll(CARD_CLASS_SELECTOR));

const hiddenCards = [];
const favoriteCards = [];
const comparableCards = [];
const catalogFilters = {
  all: {
    key: "all",
    cards: cards.map((card) => card.id),
  },
  favourites: {
    key: "favourites",
    cards: favoriteCards,
    actionSelector: ACTION_FAVORITE_CLASS_SELECTOR,
  },
  comparison: {
    key: "comparison",
    cards: comparableCards,
    actionSelector: ACTION_COMPARE_CLASS_SELECTOR,
  },
};

let currentFilter = {};

showHiddenCheckboxes.forEach((button) => {
  button.addEventListener("click", () => toggleCardState(button, hiddenCards));
});
showFavoriteButtons.forEach((button) => {
  button.addEventListener("click", () =>
    toggleCardState(button, favoriteCards),
  );
});
showCompareButtons.forEach((button) => {
  button.addEventListener("click", () =>
    toggleCardState(button, comparableCards),
  );
});
showHiddenCardsCheckbox.addEventListener("change", () => toggleHiddenCards());
catalogFilterButtons.forEach((button) => {
  button.addEventListener("change", (event) => filterCards(event));
});

const toggleHiddenCards = function () {
  const currentHiddenCards = currentFilter.cards.filter((cardId) =>
    hiddenCards.includes(cardId),
  );
  currentHiddenCards.forEach((cardId) => {
    const cardClasses = document.getElementById(cardId).classList;
    cardClasses.toggle(
      TRANSLUCENT_CARD_CLASS,
      cardClasses.contains(HIDDEN_CARD_CLASS),
    );
    cardClasses.toggle(HIDDEN_CARD_CLASS);
  });
};

const toggleCardState = function (button, actionCards) {
  const card = button.closest(CARD_CLASS_SELECTOR);
  const cardId = card.id;
  if (!actionCards.includes(cardId)) {
    actionCards.push(cardId);
  } else {
    actionCards.splice(actionCards.indexOf(cardId), 1);
    if (button.matches(currentFilter?.actionSelector)) {
      card.classList.toggle(HIDDEN_CARD_CLASS);
    }
  }
  button.classList.toggle(ACTIVE_ACTION_CLASS);

  if (button.matches(ACTION_HIDE_CLASS_SELECTOR)) {
    const cardHideClass = showHiddenCardsCheckbox.checked
      ? TRANSLUCENT_CARD_CLASS
      : HIDDEN_CARD_CLASS;
    card.classList.toggle(cardHideClass);
  }
};

const filterCards = function (event) {
  const filterValue = event.target.value;
  currentFilter = catalogFilters[filterValue];
  showCardsByFilter(currentFilter.cards);
};

const showCardsByFilter = function (cardsToShow) {
  cards.forEach((card) => {
    const cardId = card.id;
    card.classList.toggle(
      HIDDEN_CARD_CLASS,
      !cardsToShow.includes(cardId) ||
        (!showHiddenCardsCheckbox.checked && hiddenCards.includes(cardId)),
    );
  });
};
