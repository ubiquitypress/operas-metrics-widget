# HIRMEOS Metrics Widget

This documentation aims to offer as much information as possible for getting started with, implementing, and updating the widget.

## Table of Contents

- [Introduction](#introduction)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
  - [Settings](#settings)
  - [Locales](#locales)
  - [Tabs](#tabs)
    - [nav_counts](#nav_counts)
    - [graphs](#graphs)
- [Supported Languages](#supported-languages)
- [Supported Measures](#supported-measures)
- [Supported Graphs](#supported-graphs)
- [Developer-Information](#developer-information)
  - [Running the source](#running-the-source)
  - [Graph vs. Card](#graph-vs-card)
  - [Adding Cards](#adding-cards)
  - [Adding Graphs](#adding-graphs)
  - [External Files](#external-files)
  - [Localisation](#localisation)
  - [Building](#building)
  - [Testing](#testing)
  - [Deployment](#deployment)

## Introduction

The HIRMEOS metrics widget is a small, embeddable HTML widget which can offer visual information from services such as Google Analytics, OPERAS, and Ubiquity Press in the form of graphs, tables, and numerical figures.

When embedded, users will be able to see a navigation menu with numerical figures for different measures supported by the widget, such as the number of downloads a specific book has. Upon clicking one of the navigation items, the user will then be able to see additional information in the form of graphs, tables, and more.

The widget is designed to be extremely flexible with its implementation, allowing almost complete configuration to be made without needing to touch the source code. More customisation options will become available over time, and updates to the widget will be made under new version numbers - giving implementors the ability to test and configure any updates before deploying the changes live.

Implementing the widget requires some knowledge of HTML and JavaScript, and having knowledge on how the metrics URIs and endpoints work will also be beneficial.

This documentation is written assuming the implementor has no prior knowledge of the metrics API endpoints or response body.

## Getting Started

To implement the base widget, only two steps are required. A third, configuration, step will later be required to bring the widget to life.

The first step is to determine where the widget should be placed within the webpage. Once you have a suitable location in your HTML structure for the widget, add the following code:

```html
<div id="metrics-block"></div>
```

When the widget is initialised, its HTML will be inserted into this container. It is important that the exact _id_ attribute value is used as above, as this is what the widget will look for in the DOM.

After adding the `#metrics-block` element to the HTML, the next step is to bring in the compiled JavaScript code which contains everything the widget needs to run, as well as its styling.

The current production version of the widget is `0.1.16`, and is 184KB in size. To embed the widget onto the page, simply add a script tag before the closing `</body>` tag in the HTML:

```html
<script src="https://storage.googleapis.com/operas/metrics-widget-0.1.16/widget.js"></script>
```

As of version 0.1, CSS is now provided in a separate minified file, as opposed to being rendered inline automatically. To embed the widget styling onto the page, simply add a link tag before the closing `</head>` tag in the HTML:

```html
<link
  rel="stylesheet"
  href="https://storage.googleapis.com/operas/metrics-widget-0.1.16/widget.css"
/>
```

After adding both lines, visit the webpage in which the widget is embedded. You should see the following message in the location you placed the `#metrics-block` div.

> No configuration found - please check the documentation.

This message means that the widget's code was successfully called and executed, and the widget has been embedded into the correct location on the webpage. The next step is to configure the widget so that we can replace this warning with some numbers and graphs!

## Configuration

All configuration for the widget is handled within a JavaScript object that should exist on the same page as the `#metrics-block` element. The name of this object should be `metrics_config`, and it can be declared anywhere on the webpage:

```html
<script>
  var metrics_config = {};
</script>
```

Within the _metrics_config_ object, certain fields are expected by the widget. Each field is explained in depth below, though it is also possible to view a complete example of a fully implemented HTML file [here](https://gitlab.com/ubiquitypress/metrics-widget/-/blob/master/dist/index.html).

If using the file above as reference, please do note that it is primarily used during development as a test environment - and may not always be updated to provide a fully accurate depiction. Similarly, any CSS on the demo page should not be copied into production.

The following fields are accepted within the `metrics_config` object:

| field                   | required | description                                                                             |
| ----------------------- | -------- | --------------------------------------------------------------------------------------- |
| [settings](#settings)   | yes      | holds all configuration settings for the widget                                         |
| [callbacks](#callbacks) | no       | contains callback functions that the widget will call during different lifecycle events |
| [locales](#locales)     | no       | allows overriding locales for existing languages and adding custom language codes       |
| [tabs](#tabs)           | yes      | contains information about which measures to display and which graphs to use            |

### Settings

The `settings` object is a **required** property of the _metrics_config_ object, and contains all of the widget configuration.

Example:

```javascript
const metrics_config = {
  settings: {
    base_url: 'https://metrics-api.operas-eu.org/events',
    work_uri: 'info:doi:10.5334/bbc',
    language: 'en',
    localise_country_codes: true,
    one_per_row_width: 450,
    first_panel_open_on_ready: true,
    hide_initial_loading_screen: false
  }
};
```

Definitions:

| field                       | type    | required | description                                                                                                                                                                               |
| --------------------------- | ------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| base_url                    | string  | yes      | the base URL of where the metrics are hosted.<br> example: https://metrics-api.operas-eu.org/events                                                                                       |
| work_uri                    | string  | yes      | the URI scheme and URI to use.<br> example: `info:doi:10.5334/bay`                                                                                                                        |
| language                    | string  | no       | the ISO 639-1 language code to display text in.<br> if your [language is not supported](#supported-languages), please consider contributing.<br> the default value for this field is `en` |
| localise_country_codes      | boolean | no       | if `true`, graphs that display country codes will display their localised name instead.<br> example: `fr` (if _false_), `French` (if \_true)                                              |
| one_per_row_width           | number  | no       | if provided, all graphs will stretch to 100% width if the window width is less than or equal to this value.                                                                               |
| start_graphs_from_zero      | boolean | no       | if `true`, line graphs will have a 0 value added at the start of the graph.<br> the default value for this field is `false`                                                               |
| hide_initial_loading_screen | boolean | no       | if `true`, the initial "loading metrics" screen will not show, and the widget will only appear when the tabs are ready.<br />the default value for this field is `false`                  |

The `base_url` field in most cases will be the same as the example provided, unless you are hosting your own metrics service.

The `work_uri` field will depend on the page being viewed - and likely will need to be dynamically implemented. This tells the widget which resource the metrics are being requested for.

### Callbacks

The widget supports sending various JavaScript callbacks depending on its state. The callbacks should be declared in an optional _callbacks_ object within the config. The following fields are supported, and all are optional:

| field           | arguments | description                                                                                                  |
| --------------- | --------- | ------------------------------------------------------------------------------------------------------------ |
| on_load_start   | ()        | called when the widget begins to load                                                                        |
| on_load_success | (tabs)    | called when the widget has successfully loaded<br>the loaded tabs will be provided, and this number may be 0 |
| on_load_fail    | (err)     | called when the widget fails to load<br>the error message will also be logged to the browser console         |

An example of this in action:

```javascript
const metrics_config = {
  callbacks: {
    on_load_start: () => console.log('Widget loading'),
    on_load_success: tabs => {
      if (tabs.length > 0) console.log('Widget ready!');
    },
    on_load_fail: err => console.log(err)
  }
};
```

### Locales

The `locales` object is an **optional** field within the _metrics_config_ object, and is used to override any strings that are localised within the application.

For instance, you may want to replace the word 'Sessions' with 'Abstract Views,' or localise spellings from British English to American English without editing the source code.

Example:

```javascript
const metrics_config = {
  locales: {
    en: {
      tabs: {
        sessions: 'Abstract Views'
      }
    }
  }
};
```

The example above will override the English localisation for `tabs.sessions` to read as 'Abstract Views'. This can be done for any amount of strings, and any amount of languages.

To override a language, you will need to first indicate the language code that you are overriding. A list of supported languages can be found [here](#supported-languages), or can be found in the list of filenames in the [GitLab repository](https://gitlab.com/ubiquitypress/metrics-widget/-/tree/master/src/widget/localisation).

In the example above, the language code _en_ is being overriden. Next, you will need to provide the exact same path structure used by the widget for that language. For example, to replace the phrase 'Sessions' with 'Abstract Views', the path in the [en.json](https://gitlab.com/ubiquitypress/metrics-widget/-/blob/master/src/widget/localisation/en.json) file is `tabs.sessions`, so we replicate that above.

It is also possible to use this functionality to add your own language, such as adding a new `en-us` language override and setting the _language_ [setting](#settings) to be the same value - though please consider contributing if you are looking to add new languages!

### Tabs

The `tabs` object is a **required** property of the _metrics_config_ object, and contains information about which measures to display (such as downloads, citations, references), and which graphs to use.

Example:

```javascript
const metrics_config = {
  tabs: {
    citations: {
      order: 0,
      nav_counts: ['https://metrics.operas-eu.org/crossref/citations/v1'],
      graphs: {
        time_graph: {
          width: 100,
          hide_label: true,
          uris: ['https://metrics.operas-eu.org/crossref/citations/v1']
        }
      },
      operas_definition: 'https://metrics.operas-eu.org/crossref/citations/v1'
    },
    references: {
      order: 1,
      nav_counts: [
        'https://metrics.operas-eu.org/wordpress/references/v1',
        'https://metrics.operas-eu.org/wikipedia/references/v1'
      ],
      graphs: {
        wikipedia_articles: {
          width: 50,
          uris: ['https://metrics.operas-eu.org/wikipedia/references/v1'],
          operas_definition:
            'https://metrics.operas-eu.org/wikipedia/references/v1'
        },
        wordpress: {
          width: 50,
          uris: ['https://metrics.operas-eu.org/wordpress/references/v1'],
          operas_definition:
            'https://metrics.operas-eu.org/wordpress/references/v1'
        }
      }
    }
  }
};
```

Within the `tabs` object, the next child should always be named after a _measure_ (such as `citations` or `references` in the example above). Whilst the widget has been tested with several [Supported Measures](#supported-measures) (any of which can be plugged in above!), the API you are using may provide additional measures that the widget should support.

#### order

The first (and **optional**) field is `order`. This tells the widget what priority to give this measure on the navigation menu, with 0 being the highest priority. In the example above, _citations_ has an order of 0 so will appear before _references_ which has an order of 1.

#### nav_counts

The next (and **required**) field is `nav_counts`: an array which tells the navigation menu which URIs should contribute towards its figures.

In most cases, multiple sources (Google Analytics, OPERAS, Ubiquity Press) will be collecting data, though you may not want to include all of these sources in your figures. As such, you can provide an array of URIs which you _do_ wish to use here.

If your array contains more than one URI, the data will be aggregated into one number. For example, if you use Google Analytics (500 views) and OPERAS (100 views) URIs, the value shown in the navigation would be 600 views, as it is the aggregation of both.

If you are unsure about what measure URIs are available to you, you will be able to find a full list of available measures from the API. Replacing this link with the values from your _metrics_config_ object, you can find all of the URIs from the JSON response:

> **{{base_url}}**?filter=**{{work_uri}}**&aggregation=measure_uri

The `nav_counts` array also supports use of a wildcard item (`['*']`) which will tell the navigation menu to use _all available_ URIs when calculating the totals. It is recommended to only use this if you are completely sure that there will not be any overlap in your data that could cause inflated numbers.

#### graphs

The next (and **required**) field is `graphs`: an object containing all of the graphs you wish to show for this metric.

In the example above, the _citations_ metric is showing one graph (_time_graph_), and the _references_ metric is showing two graphs (_wikipedia_articles_ and _wordpress_). These graphs are all valid because they are named after the [Supported Graphs](#supported-graphs).

Each graph can be configured with additional properties:

| field             | type          | required | description                                                                                                                                                                                                            |
| ----------------- | ------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| width             | number        | yes      | the % width of the graph (max. `100`)<br /> graphs will be rendered inline, so two graphs with a 50 width will display next to each other.                                                                             |
| hide_label        | boolean       | no       | if `true`, the label for this graph will be hidden<br /> the label can still be seen by assistive technologies for accessibility purposes                                                                              |
| uris              | array[string] | yes      | an array of all URIs that contribute towards the data of this graph                                                                                                                                                    |
| operas_definition | string        | no       | the link to the OPERAS definition for this graph, will be rendered directly beneath it<br />it is recommended to only include this here if your tab contains multiple graphs which fetch data from different endpoints |

The `width` field does exactly what it suggests - it tells the widget the **percentage width** of space that this graph should take up on the page. A graph can have _any width_ up to `100`, which means it will take up an entire row to itself. If you wish to have two graphs sharing the same row, you would set both of their widths to `50` (or any other combination of numbers that equal `100`, like `30`+`70`).

The `uris` array is exactly the same as witnessed when setting up the [nav_counts](#nav_counts) array in the previous section - it is an array of measure URIs that will contribute towards the graph. In the majority of cases, the values here should simply be set to the same values as the _nav_counts_ array, though the use of a wildcard (`['*']`) is **not** supported here.

Similarly, specifying additional URIs in the `uris` array will **not** cause additional data to be rendered (such as a second or third line on the line graph). The data is instead aggregated into a single source of truth before the graph is rendered.

#### operas_definition

The final (and **optional**) field is `operas_definition`: a string containing a link to the OPERAS definition for this particular tab.

As seen above, this string can be included in either the configuration for the tab, or within a graph's configuration. For example:

```json
downloads: {
  order: 2,
  nav_counts: [ ... ],
  graphs: { ... },
  operas_definition: 'https://metrics.operas-eu.org/up-ga/downloads/v1'
}
```

Above, the OPERAS definition label will appear below all graphs in the "downloads" panel.

```json
references: {
  order: 7,
  nav_counts: [ ... ],
  graphs: {
    wikipedia_articles: {
      width: 100,
      uris: [ ... ],
      operas_definition: 'https://metrics.operas-eu.org/wikipedia/references/v1'
    },
    wordpress: {
      width: 100,
      uris: [ ... ],
      operas_definition: 'https://metrics.operas-eu.org/wordpress/references/v1'
    }
  }
}
```

Above, both the `wikipedia_articles` and `wordpress` graphs will have their own definition labels, linking to different locations. The labels will appear below each graph as a child of its wrapper.

## Supported Languages

The following languages are currently supported:

| name    | code | version |
| ------- | ---- | ------- |
| English | `en` | 0.0.1+  |

For more information on how to override supported languages, or on how to add localisations for other languages, see [Locales](#locales).

## Supported Measures

The following measures are currently supported:

| name        | version |
| ----------- | ------- |
| annotations | 0.0.1+  |
| citations   | 0.0.1+  |
| downloads   | 0.0.1+  |
| reads       | 0.0.1+  |
| references  | 0.0.1+  |
| sessions    | 0.0.1+  |
| tweets      | 0.0.1+  |

## Supported Graphs

The following graphs are currently supported:

| name               | label                                            | required URI fields    | description                                                                                                                                                                          | version |
| ------------------ | ------------------------------------------------ | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------- |
| country_table      | {metric} By Country                              | `country_uri`, `value` | a table containing a list of countries and their metric values, descending the `world_map` graph represents the same data, but as a map of the world                                 | 0.0.1+  |
| time_graph         | {metric} Over Time                               | `timestamp`, `value`   | a line graph which shows the total metric values over time                                                                                                                           | 0.0.1+  |
| wikipedia_articles | Wikipedia Articles                               | `event_uri`            | a list of Wikipedia articles where this item is referenced                                                                                                                           | 0.0.1+  |
| world_map          | {metric} By Country                              | `country_uri`, `value` | a heatmap of the world, with countries having the most metric values being warmest the `country_table` graph represents the same data, but as a table                                | 0.0.1+  |
| tweets             | Tweets                                           | `event_uri`            | a list of embedded Twitter tweets as iframes                                                                                                                                         | 0.0.6+  |
| wordpress          | Wordpress                                        | `event_uri`            | a list of Wordpress posts where this item is referenced                                                                                                                              | 0.0.14+ |
| hypothesis         | Hypothesis                                       | `event_uri`            | a list of Hypothesis titles where this item is referenced                                                                                                                            | 0.0.17+ |
| operas_definition  | Definition for this metric on the OPERAS website | `event_uri`            | a link to this metric's definition on the OPERAS website.<br />The `event_uri` should be the link to the definition (a single-length array).<br />The `width` is always set to 100%. | 0.0.20+ |

## Developer Information

This section contains information for developers interested in continuing to enhance and expand on the widget source. The widget is created in React, and then compiled using Webpack.

### Running the source

Once cloning the repository, you will firstly need to install all dependencies that the widget uses. In order to reduce the overall size of the widget, the majority of dependencies are either hosted externally and only called when needed, or are installed as _devDependencies_: meaning that they are not required in the production build.

To install all dependencies, run:

```javascript
npm ci
```

After all dependencies are installed, you can run:

```javascript
npm run dev
```

This will launch the application on `localhost:8080`. Any changes made to files will automatically update the application, and the browser page should automatically reload.

To stop the application from running, enter the key combination `CTRL`+`C` on the terminal window, and the process will exit.

### Flow

The best way to understand the widget is understanding the full flow from page load to final render.

Once the page loads, the `metrics_config` object is pulled from the environment and ReactDOM attempts to render the widget inside the _src/index.js_ file.

Following through this, the next file called is _src/widget/index.jsx_, which contains all of our context providers. There are three main context providers used in the application:

- `ConfigProvider`: stores the configuration settings which can be retrieved at any time by using `useConfig()`
- `MetricsProvider`: stores all metrics-based API responses in memory to speed up request times if the same URI is used more than once.
- `I18nProvider`: a simply-written provider which allows us to localise strings on the widget by using `t()`

After all providers are loaded, we render _src/widget/components/widget_. This is the heart of the widget, and is responsible for rendering the navigation and panels. The `useEffect` hook in this component is responsible for loading all of the initial metrics data used by the navigation menu. This data is then formatted and stored in the state, and the Navigation component simply iterates over this data.

Every tab rendered by the Navigation component also has a corresponding Panel component (_src/widget/components/panel_). Not only does this improve accessibility, but it also means we don't need to constantly re-render previously loaded content if the user keeps closing/re-opening tabs. The Panel component is primarily responsible for housing each individual graph, as well as keeping track of how many have loaded. To keep the widget feeling more fluid, the Panel content will only display once all of its children have declared themselves loaded.

Within the Panel component, we then render a Graph component for each graph that is part of this tab (_src/widget/components/graph_). In this component, the `useEffect` hook firstly fetches all URIs that were specified in the _metrics_config_ object for this graph, and reduces them into a single array.

It then calls on the `methods` object, which contains a list of functions. The object itself simply exports other files, but the most important thing to note is that the names of the exports _directly match_ the list of [Supported Graphs](#supported-graphs). If a user has specified that they wish to show the _world_map_ graph, the `useEffect` hook in the Graph component will call `methods[world_map]`, which exists.

The goal of each `method` function is to parse the data received into a format that would best suit its graph. Every method is expected to return an object called `data`, though the contents of that object will depend on what graph is being rendered -- more on that in a moment.

Back inside our Graph component, we then update the state to store the parsed data returned by our `method` function. Now that we have data, let's look at the massive `switch` statement towards the bottom of the component. Each `type` listed represents each of the [Supported Graphs](#supported-graphs).

Notice how `wikipedia_articles` and `wordpress` both are calling the same `<List />` component? The idea behind the graphs is to make them as modular as possible: they should have no context as to what tab they are part of or who they are rendering for, but instead have just enough information to render their data.

Let's take a look at the List component in more detail (_src/widget/components/graphs/list_). Any component inside of the `graphs` folder is an actual graph: something that will be rendered. The components inside of this folder are the ones that we want to keep as modular as possible. All graphs should receive two props: `data` (an object which can contain _anything_ it needs), and `onReady`.

In the case of the List component, it doesn't actually need to make any additional API requests (like the Hypothesis component) or load an external script (like the Tweets component), so our `useEffect` hook immediately runs and tells the parent component that we're ready to go. The rest of the data is simply rendered.

To take a step back, let's look at the Wordpress `method` (_src/widget/components/graph/methods/wordpress.js_). The purpose of this method is to take the massive array of data our Graph component received from the URIs and parse it into a format that our graph will understand. Well, we know that we're rendering a List graph for the Wordpress data, so we'll need to format our response to match what it is expecting. As such, the Wordpress `method` does just that: it formats the data down into an object which returns exactly what our Line graph expects.

### Adding Graphs

As graphs should be as modular as possible, they don't require any additional knowledge and are therefore rather straightforward to implement.

Simply create the graph in _src/widget/components/graphs_ to accept a `data` and `onReady` prop (the `data` can then contain anything it requires) and add the graph to the `switch` statement in the Graph component (_src/widget/components/graph_). In order to format the data for the graph, the value you provide in the `case` will also need to exist as a `method` (_src/widget/components/graph/methods_), and the _index.js_ file for the methods will need to exactly match the name of the `case`.

In some cases, you may need to use a JavaScript library for the graph you are implementing. If this is the case, it is recommended to **not install** the library as a dependency, but instead download the minified source and store it in the _dist/assets_ directory.

### External Files

In order to ensure that the main widget file size remains as low as possible, some files (such as the country graph and line graph) are hosted in the storage bucket and only loaded when required. Not all websites will want to display all graphs, so forcing the user to download files they do not need would be a waste.

To add external JavaScript files to the widget, simply download the (preferably minified) file and place it in the _dist/assets_ directory. The file can be named anything, but should be representative of what it does, and should not contain any `.` characters other than for the filename.

Inside of the graph that wishes to use this script, you'll simply want to call the `loadScript` function, passing in the name of the graph and a callback function which will be called once the script has been loaded. The name provided should match the name of the file _without_ the `.js` extension, such as `loadGraph('twitter', () => ...)` for the _dist/assets/twitter.js_ file.

### Localisation

Adding new languages to the widget is designed to be as straightforward as possible. All localisations are stored in the _src/widget/localisation_ directory as JSON files. When adding a new language, it is recommended to copy the `en.json` file, as this will the the most up-to-date template.

The file name should follow the ISO 639-1 language format, which essentially means a two-character code, though there is no harm in using region based codes either (such as `en-us`).

Within the localisation file, there is a property titled `countries`, which contains localisations for every country code. Thankfully, a GitHub repository provides these localisations for almost every language. Simply visit<br>
https://github.com/umpirsky/country-list/blob/master/data/CODE/country.json<br>
(replacing `CODE` with the country code of your language, such as `en`) and paste the JSON data into your new localisation template.

Once the file is complete, the widget should automatically support the new language. You can test this at any time by changing the widget language in _dist/index.html_ to the new language code, though please do change it back to `'en'` prior to committing any changes.

### Building

To build a new version of the widget, simply run:

```javascript
npm run build
```

This will override the file (if it exists) in _dist/widget.js_ with a compressed JavaScript file representing all the widget code.

It will also compile all CSS modules into a separate file, _dist/widget.css_.

### Testing

Unit tests are set up for every component within the widget, and will be run as part of the CI pipeline. You can also run tests manually:

```javascript
npm run test
```

The code above will run the test program once, and will tell you whether the tests pass or fail.

```javascript
npm run test:watch
```

The code above will run the test program and keep it running until closed (`CTRL`+`C`), and will re-run the program if a file is detected to have changed. There are different options within this program that allow you to test only specific files.

### Deployment

Whilst there is currently a CI pipeline for new versions, the deployments themselves are currently performed manually.

The first step is to increase the widget's version by running _bumpversion_:

```javascript
bumpversion[major | minor | patch];
```

Once this is done, you will then need to push the changes and separately push the new version tag that was created. This will then start the CI pipeline.

Once the pipeline tests have passed, create a new directory in the [Storage Bucket](https://console.cloud.google.com/storage/browser/operas;tab=objects?forceOnBucketsSortingFiltering=false&project=hirmeos-257513&prefix=) called `metrics-widget-{VERSION}` - where `{VERSION}` is the current version of the widget based on the _bumpversion_. For example, if the version was _1.2.3_, the directory would be called _metrics-widget-1.2.3_.

Next, you'll want to [build](#building) the widget.

Once the widget has been built, copy all files in the _dist_ directory you just created in the storage bucket. You will need to create a folder for the _assets_ and copy those in as well.

Lastly, you'll want to update this very README file to replace the three strings containing the previous version of the widget (two of which are URLs) to the new version in the [Getting Started](#getting-started) section, and also update the file size number with the new size of the `widget.js` file that was just built.

Finally, commit the changes made to the readme and have some coffee.
