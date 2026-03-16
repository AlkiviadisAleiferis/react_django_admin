# React Django Admin

This is the react implementation for the
[django admin adapter package](https://github.com/AlkiviadisAleiferis/django_admin_adapter)
and its corresponding [Swagger](https://alkiviadisaleiferis.github.io/django_admin_adapter_swagger/).

It utilizes React (18.\*) and Bootstrap 5.3 for theming.

The project aims at minimal external dependency by default.

The `.env` file is configured for testing the package locally.
Should be overridden.

## Disclaimer

Although the current functionalities cover a great part of the admin,
this is a work in progress.

Many of the code conventions (e.g. naming) are not javascript but
python/django oriented.

## How versioning will work

In every version a tag will be pushed to signify the milestone.

The project must be pulled locally from that specific tag.

If the project is already pulled, and an update is needed,
just merge the new version on our local code.

In order to avoid conflicts, certain files have been provided to
change existing functionality:

- Every `override.js` file in the project has this specific purpose. \
   It will be left unchaned as much as possible, to provide the users \
   the ability to define their own code inside.

- The `/override.js` is used for overriding the main settings of the project (`/settings.js`)

- Everything inside `/src/custom_views` will be left as unchanged as possible \
   for the user to define his own custom views. Remember to provide those \
   form the base info endpoint of the adapter by properly defining the `sidebar_registry`.

- Everything inside `/src/components/extra_sections` will be left as unchanged as possible \
   to define any extra section wanted for the list and object add,view,edit,delete views.

- Everything inside `/src/components/object/fields/override.js` will be left as unchanged as possible \
   for the user do define any of his own fields and use them in editable or readonly fields.

## Change base bootstrap colors (primary, ...)

In `/src/index.scss` change the colors as you like.

## Roadmap

- Upgrade to last react + react-router-dom versions
- Card list
- Make it more mobile ready
- Create TabularInline for object edit/add
- Create StackedInline for object view
- Create TimeField filter
- Add index dashboard (Although it can be implemented with a custom view)
- implement scrolling at autocomplete search
- Create list search help text
- Utilize fieldsets "classes" key
