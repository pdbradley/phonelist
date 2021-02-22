# Phonebook

This app is a phone book that connects to Airtable for data. Follow the steps below to get set up:

## Airtable setup

Create a base with the following fields:

- First Name
- Last Name
- Mobile Phone
- Home Phone
- Email
- Verified (checkbox)
- Over 18 (Yes/No)

The phonelist will only include entries that are marked as verified and are over 18 years of age. You can create a form for adding users to the phonelist, but you are encouraged to keep `Verified` off the form for admins to control.

## Environment variables

Set up the following environment variables in Netlify:

- `REACT_APP_AIRTABLE_ADD_USER_URL` -- link to the form for adding a contact to your phonelist (optional)
  ```sh
  REACT_APP_AIRTABLE_ADD_USER_URL=https://airtable.com/add_contact_form_url
  ```
- `AIRTABLE_API_KEY` -- API key for accessing your Airtable, looks like `keyAb4CdefGhijklm`. You can find that here: https://airtable.com/api
  ```sh
  AIRTABLE_API_KEY=keyMMMMMMMMM
  ```
- `AIRTABLE_BASE_ID` -- ID for your base, e.g., `app9abcO3deFghiJK`.
  ```sh
  AIRTABLE_BASE_ID=appNNNNNNNNN
  ```
- `AIRTABLE_TABLE_NAME` -- Name of your table within your base, e.g., `"Table 1"`
  ```sh
  AIRTABLE_TABLE_NAME="Table 1"
  ```
- `PINS` -- secret PINs used to access your phonelist. Must be 4 digits long. You can specify as many PINs as you want.
  ```sh
  PINS=1234,4321
  ```
- `REACT_APP_BUILD_HOOK` -- URL to kick off the build process, so admins can re-deploy without writing code.
  ```sh
  REACT_APP_BUILD_HOOK=https://api.netlify.com/build_hooks/343j34jk34j3k4j3k4343
  ```
