# Rules for Contributing

This folder is synchronized between DeckUI and DeckSite repositories. If they diverge, they should be rectified to remain in sync.

# Imports

All import references must be within the client folder, or to design library components.

Imports out of the client folder should use paths.

- @me
- @deckai/client/\*
- @site

These files are mocked in the DeckUI repository and functional in the DeckSite repository.

Do not include any imports outside of the client folder. 

Do not import mock data inside the client folder, data should be handled by the Storybook/stories or by the nextjs/App page

# [Pages](readme.md)

The pages folder is the uppermost client page that contains layout, stores and manages state and contains logic handlers.

# Data

Data is handled in nextjs/App page by the server or it is handled in a Storybook story. All other data is passed in to components.
