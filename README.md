# Phonebook

This app is a phone book that connects to Airtable for data and deploys on Netlify. No code needed to make this work. Just configure the site and the manage your phone list via Airtable.

Follow the steps below to get set up:

## Airtable

### 1. Create database

Create a base with the following fields:

- First Name
- Last Name
- Mobile Phone
- Home Phone
- Email
- Verified (checkbox)
- Over 18 (Yes/No)

The phonelist will only include entries that are marked as _Verified_ and are _Over 18_ years of age.

### 2. Create a form

If you want people to be able to submit their own info, you can create a form from your base. But you are encouraged to keep `Verified` off the form for admins to control.

## Netlify

### 1. Deploy

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/schontz/phonelist)

### 2. Environment variables

Set up the following environment variables in Netlify:

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
- `REACT_APP_AIRTABLE_ADD_USER_URL` -- link to the form for adding a contact to your phonelist (optional)
  ```sh
  REACT_APP_AIRTABLE_ADD_USER_URL=https://airtable.com/add_contact_form_url
  ```
- `REACT_APP_BUILD_HOOK` -- URL to kick off the build process, so admins can re-deploy without writing code. (see [Update the site](#update-the-site))
  ```sh
  REACT_APP_BUILD_HOOK=https://api.netlify.com/build_hooks/343j34jk34j3k4j3k4343
  ```

### 3. Re-deploy

Once your environment variables are finished, re-deploy the site and all those marked as _Verified_ and _Over 18_ will show up on your site.

## Update the site

Whenever you make changes to the Airtable and want them to show up on your site, simply visit `/deploy` on your site, e.g., `https://phone.netlify.app/deploy`, and press the **Deploy** button.
