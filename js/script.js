const ACTIVE_ACTION_CLASS = "card__action--active";
const TRANSLUCENT_CARD_CLASS = "card--translucent";
const HIDDEN_CARD_CLASS = "card--hidden";
const ACTION_HIDE_CLASS_SELECTOR = ".card__action-hide";
const ACTION_FAVORITE_CLASS_SELECTOR = ".card__action-favorite";
const ACTION_COMPARE_CLASS_SELECTOR = ".card__action-compare";
const CARD_CLASS_SELECTOR = ".card";
const HIDE_CARDS_CHECKBOX_CLASS_SELECTOR = ".catalog__checkbox label input";
const CATALOG_FILTER_BUTTONS_CLASS_SELECTOR = 'input[name="catalog-filter"]';

const showHiddenCardsCheckbox = document.querySelector(
  HIDE_CARDS_CHECKBOX_CLASS_SELECTOR,
);
const catalogFilterButtons = document.querySelectorAll(
  CATALOG_FILTER_BUTTONS_CLASS_SELECTOR,
);
const cards = Array.from(document.querySelectorAll(CARD_CLASS_SELECTOR));

const catalogFilter = {
  filters: {
    all: {
      key: "all",
      cards: cards.map((card) => card.id),
    },
    favourites: {
      key: "favourites",
      cards: [],
      actionSelector: ACTION_FAVORITE_CLASS_SELECTOR,
    },
    comparison: {
      key: "comparison",
      cards: [],
      actionSelector: ACTION_COMPARE_CLASS_SELECTOR,
    },
    hidden: {
      key: "hidden",
      cards: [],
      actionSelector: ACTION_HIDE_CLASS_SELECTOR,
    },
  },
  currentFilter: {},
};
const localStorageItems = {
  hiddenCards: "hiddenCards",
  favoriteCards: "favoriteCards",
  comparableCards: "comparableCards",
  shouldShowHiddenCards: "showHiddenCards",
  activeCatalogFilterValue: "catalogFilter",
};

const loadCatalogFilterStateFromLocalStorage = function () {
  catalogFilter.filters.hidden.cards = getFromLocalStorage(
    localStorageItems.hiddenCards,
    [],
  );
  catalogFilter.filters.favourites.cards = getFromLocalStorage(
    localStorageItems.favoriteCards,
    [],
  );
  catalogFilter.filters.comparison.cards = getFromLocalStorage(
    localStorageItems.comparableCards,
    [],
  );

  showHiddenCardsCheckbox.checked = getFromLocalStorage(
    localStorageItems.shouldShowHiddenCards,
    true,
  );

  const activeFilter = getFromLocalStorage(
    localStorageItems.activeCatalogFilterValue,
    catalogFilter.filters.all.key,
  );
  catalogFilter.currentFilter = Array.from(catalogFilterButtons).find(
    (button) => button.value === activeFilter,
  );
  catalogFilter.currentFilter.checked = true;

  updateCardState();
  filterCards({ target: catalogFilter.currentFilter });
};

const updateCardState = function () {
  const cardHideClass = getCardHideClass();
  cards.forEach((card) => {
    const cardId = card.id;
    if (catalogFilter.filters.hidden.cards.includes(cardId)) {
      updateCardHideClass(card, cardHideClass);
    }
    [
      catalogFilter.filters.favourites,
      catalogFilter.filters.comparison,
      catalogFilter.filters.hidden,
    ].forEach((filter) => {
      const filterCards = filter.cards;
      if (filterCards.includes(cardId)) {
        const actionButton = card.querySelector(filter.actionSelector);
        actionButton.classList.add(ACTIVE_ACTION_CLASS);
      }
    });
  });
};

const toggleHiddenCards = function (event) {
  saveToLocalStorage(
    localStorageItems.shouldShowHiddenCards,
    event.target.checked,
  );

  const currentHiddenCards = catalogFilter.currentFilter.cards.filter(
    (cardId) => catalogFilter.filters.hidden.cards.includes(cardId),
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

const toggleCardState = function (button, actionCards, localStorageItem) {
  const card = button.closest(CARD_CLASS_SELECTOR);
  const cardId = card.id;
  const cardIndex = actionCards.indexOf(cardId);

  if (cardIndex === -1) {
    actionCards.push(cardId);
  } else {
    actionCards.splice(cardIndex, 1);
    if (button.matches(catalogFilter.currentFilter?.actionSelector)) {
      card.classList.toggle(HIDDEN_CARD_CLASS);
    }
  }
  saveToLocalStorage(localStorageItem, actionCards);
  button.classList.toggle(ACTIVE_ACTION_CLASS);

  if (button.matches(ACTION_HIDE_CLASS_SELECTOR)) {
    updateCardHideClass(card);
  }
};

const updateCardHideClass = function (card, hideClass = getCardHideClass()) {
  card.classList.toggle(hideClass);
};

const getCardHideClass = function () {
  return showHiddenCardsCheckbox.checked
    ? TRANSLUCENT_CARD_CLASS
    : HIDDEN_CARD_CLASS;
};

const filterCards = function (event) {
  const filterValue = event.target.value;
  saveToLocalStorage(localStorageItems.activeCatalogFilterValue, filterValue);
  catalogFilter.currentFilter = catalogFilter.filters[filterValue];
  showCardsByFilter(catalogFilter.currentFilter.cards);
};

const showCardsByFilter = function (cardsToShow) {
  cards.forEach((card) => {
    const cardId = card.id;
    card.classList.toggle(
      HIDDEN_CARD_CLASS,
      !cardsToShow.includes(cardId) ||
        (!showHiddenCardsCheckbox.checked &&
          catalogFilter.filters.hidden.cards.includes(cardId)),
    );
  });
};

const saveToLocalStorage = function (itemName, item) {
  localStorage.setItem(itemName, JSON.stringify(item));
};

const getFromLocalStorage = function (itemName, defaultValue) {
  const value = JSON.parse(localStorage.getItem(itemName));
  return value ?? defaultValue;
};

document.addEventListener(
  "DOMContentLoaded",
  loadCatalogFilterStateFromLocalStorage,
);
document.querySelectorAll(ACTION_HIDE_CLASS_SELECTOR).forEach((button) => {
  button.addEventListener("click", () =>
    toggleCardState(
      button,
      catalogFilter.filters.hidden.cards,
      localStorageItems.hiddenCards,
    ),
  );
});
document.querySelectorAll(ACTION_FAVORITE_CLASS_SELECTOR).forEach((button) => {
  button.addEventListener("click", () =>
    toggleCardState(
      button,
      catalogFilter.filters.favourites.cards,
      localStorageItems.favoriteCards,
    ),
  );
});
document.querySelectorAll(ACTION_COMPARE_CLASS_SELECTOR).forEach((button) => {
  button.addEventListener("click", () =>
    toggleCardState(
      button,
      catalogFilter.filters.comparison.cards,
      localStorageItems.comparableCards,
    ),
  );
});
showHiddenCardsCheckbox.addEventListener("change", (event) =>
  toggleHiddenCards(event),
);
catalogFilterButtons.forEach((button) => {
  button.addEventListener("change", (event) => filterCards(event));
});
