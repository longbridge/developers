import { DefaultTheme } from 'vitepress'

export const search: DefaultTheme.LocalSearchOptions = {
  translations: {
    button: {
      buttonText: 'Search',
      buttonAriaLabel: 'Search',
    },
    modal: {
      displayDetails: 'Display Details',
      resetButtonTitle: 'Reset',
      backButtonTitle: 'Back',
      noResultsText: 'No results found',
      footer: {
        selectText: 'Select',
        navigateText: 'Switch',
        closeText: 'Close',
      },
    },
  },
}
