# HIRMEOS Metrics Widget

This documentation aims to provide as much information as possible for getting started with, implementing, and updating the widget.

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

## Introduction

The HIRMEOS metrics widget is a small, embeddable HTML widget which can provide visual information from services such as Google Analytics, OPERAS, and Ubiquity Press in the form of graphs, tables, and numerical figures.

When embedded, users will be able to see a navigation menu with numerical figures for different measures supported by the widget, such as the number of downloads a specific book has. Upon clicking one of the navigation items, the user will then be able to see additional information in the form of graphs, tables, and more.

The widget is designed to be extremely flexible with its implementation, allowing almost complete configuration to be made without needing to touch the source code. More customisation options will become available over time, and updates to the widget will be made under new version numbers - giving implementers the ability to test and configure any updates before deploying the changes live.

Implementing the widget requires some knowledge of HTML and JavaScript, and having knowledge on how the metrics URIs and endpoints work will also be beneficial.

This documentation is written assuming the implementer has no prior knowledge of the metrics API endpoints or response body.

## Getting Started

To implement the base widget, only two steps are required. A third, configuration, step will later be required to bring the widget to life.

The first step is to determine where the widget should be placed within the webpage. Once you have a suitable location in your HTML structure for the widget, add the following code:

```html
<div id="metrics-block"></div>
```

When the widget is initialised, its HTML will be inserted into this container. It is important that the exact _id_ attribute value is used as above, as this is what the widget will look for in the DOM.

After adding the `#metrics-block` container to the HTML, the next step is to bring in the compiled JavaScript code which contains everything the widget needs to run.

The current production version of the widget is `0.0.19`, and it is 193KB in size. The JavaScript file is hosted on a CDN, and can be found here:<br />
https://storage.googleapis.com/operas/metrics-widget-0.0.19

To embed the widget onto the page, simply add a script tag before the closing `</body>` tag in the HTML:

```html
<script src="./path/to/widget.js"></script>
```

After adding this line, visit the webpage in which the widget is embedded. You should see the following message in the location you placed the `#metrics-block` div.

> No configuration found - please check the documentation.

This message means that the widget's code was successfully called and executed, and the widget has been embedded into the correct location on the webpage. The next step is to configure the widget so that we can replace this warning with some numbers and graphs!

## Configuration

All configuration for the widget is handled within a JavaScript object that should be present on the same page as the container added in the [Getting Started](#getting-started) section. The name of this object should be `metrics_config`, and it can be declared anywhere on the webpage:

```html
<script>
  const metrics_config = {};
</script>
```

Within the _metrics_config_ object, certain fields are expected by the widget. Each field is explained in depth below, though it is also possible to view a complete example of a fully implemented HTML file [here](https://gitlab.com/ubiquitypress/metrics-widget/-/blob/master/dist/index.html).

If using the file above as reference, please do note that it is primarily used during development as a test environment - and may not always be updated to provide a fully accurate depiction. Similarly, any CSS styling on the page should not be copied into a production build as this is purely used for testing.

### Settings

The most important field within the _metrics_config_ object is the `settings` object. This will contain all of the key/value pairs to help the metrics widget understand which API to fetch data from, as well as to allow for more precise configuration.

```javascript
const metrics_config = {
  settings: {
    base_url: 'https://metrics-api.operas-eu.org/events',
    work_uri: 'info:doi:10.5334/bbc',
    language: 'en',
    localise_country_codes: true,
    one_per_column_width: 450
  }
};
```

Above is an example setup of the _settings_ object within the _metrics_config_ object. Not all fields here are required, so please do refer to the table below for additional information.

| field                  | type    | required | description                                                                                                                                                                             |
| ---------------------- | ------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| base_url               | string  | yes      | the base URL of where the metrics are hosted<br> example: https://metrics-api.operas-eu.org/events                                                                                      |
| work_uri               | string  | yes      | the URI scheme and URI to use<br> example: `info:doi:10.5334/bay`                                                                                                                       |
| language               | string  | no       | the ISO 639-1 language code to display text in<br> if your [language is not supported](#supported-languages), please consider contributing<br> the default value for this field is `en` |
| localise_country_codes | boolean | no       | if `true`, graphs that display country codes will display their name instead<br> language names will be localised to the provided `language`<br> example: `fr` => `French`              |
| one_per_row_width      | number  | no       | if provided, all graphs will occupy their own row if the window width is less than or equal to this value                                                                               |

In order to have the correct settings, only two of the above fields are required. The `base_url` field in most cases will be the same as the example provided, unless you are hosting your own metrics service.

The `work_uri` field will depend on the page being viewed - and likely will need to be dynamically implemented. The data here will be used to fetch metrics for that specific work only.

### Locales

The `locales` object is an optional field within the _metrics_config_ object, and is used to override any strings that are localised within the application.

For instance, you may want to replace the word 'Sessions' with 'Visits,' or localise spellings from British English to American English without editing the source code.

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

The example above will override the English localisation for `tabs.sessions` to read as 'Abstract Views' instead of the hard-coded 'Sessions' string. This can be done for any amount of strings, and any amount of languages.

To override a language, you will need to first indicate the language code that you are overriding. A list of supported languages can be found [here](#supported-languages), or can be found in the list of filenames in the [GitLab repository](https://gitlab.com/ubiquitypress/metrics-widget/-/tree/master/src/localisation). In the example above, the language code _en_ is being overriden. Next, you will need to provide the exact same path structure used by the widget for that language. For example, to replace the phrase 'Sessions' with 'Abstract views', the path in the [en.json](https://gitlab.com/ubiquitypress/metrics-widget/-/blob/master/src/localisation/en.json) file is `tabs.sessions`, which is why the above code works.

It is also possible to use this functionality to add your own language interpretation, such as adding a new `en-us` language code and setting the _language_ [setting](#settings) to be the same value.

The priority order for localisation on the widget is:

1. Check to see if an overriden string exists in the in the _metrics_config.locales_ object for the widget's language (specified in _metrics_config.settings.language_)
2. Check to see if the official language JSON file of the widget contains the string for the widget's language (specified in _metrics_config.settings.language_)
3. Check to see if the string exists in the English JSON file, regardless of the widget's language
4. Return the path as the string, as no localisation could be found

When the first case above is met, that language will be returned. For example, if you add a new language override called `it`, but do not localise `tabs.sessions`, the string will be returned in English as it is the only case that matches.

### Tabs

The `tabs` object is the third and final field expected by the _metrics_config_ object, and it is required in order for the widget to work as expected.

This object will contain additional key/value pairs that tell the widget which measures to display (such as downloads, citations, references), what metric URIs should count towards the figures, and what graphs to display for each.

In order to know which measures are available, take a look at [this table](#supported-measures) to see which measures are officially supported. Depending on the API you are using for your metrics, additional measures may be available - though anything not listed on the table should not be considered as officially supported.

```javascript
const metrics_config = {
  tabs: {
    sessions: {
      nav_counts: ['https://metrics.operas-eu.org/up-ga/sessions/v1'],
      graphs: {
        time_graph: {
          width: 100,
          uris: ['https://metrics.operas-eu.org/up-ga/sessions/v1']
        },
        country_table: {
          width: 30,
          uris: ['https://metrics.operas-eu.org/up-ga/sessions/v1']
        },
        world_map: {
          width: 70,
          hideLabel: true,
          uris: ['https://metrics.operas-eu.org/up-ga/sessions/v1']
        }
      }
    }
  }
};
```

The above code seems quite complicated at first, though it can be quite intutive once broken down.

The first thing to note is the `sessions` object, which is a direct child field of the _tabs_ object. Sessions is one of the [supported measures](#supported-measures) by the widget, along with many other data sources. The widget expects any child fields of the _tabs_ object to match one of the supported measures - so _sessions_ here could easily be something else, such as _downloads_, _tweets_, _annotations_, and so forth.

As we've defined a _sessions_ object, we have now told the widget that we want to be able to see the metrics available to us for the _sessions_ measure, making it appear on the navigation menu. Within the _sessions_ object are two more child fields - `nav_counts` and `graphs`.

#### nav_counts

The _nav_counts_ array is used to tell the widget which measures should be used to contribute to the number shown in the navigation menu. In many cases, multiple sources (Google Analytics, OPERAS, Ubiquity Press) will be used to collect analytics - though you may not want to use all of them to present your figures, as some may overlap and display inflated results when combined.

As a result, any Measure URIs provided in this array will contribute towards the total count shown in the navigation menu. For example, if Google Analytics has logged 500 Sessions and OPERAS has logged 200, we can choose whether to show only the Google Analytics measure (which would display 500), show only the OPERAS measure (which would display 200), or show both measures (which would display 700 - the sum of both values).

If you are unsure about how to find the Measure URI(s) to put in this array, the easiest way is to read the JSON response from the metrics API. If you take the _base_url_ and _work_uri_ variables from your _metrics_config.settings_ object, you should be able to visit this URL:<br>

> **{{base_url}}**?filter=**{{work_uri}}**/bbc&aggregation=measure_uri

Assuming you have a browser extension which will format the JSON response, you should be able to see a list of available measures. From there, you can then filter by ones that match the `type` you're looking for. In this case, we would look for ones that have a _type_ of 'sessions' - as that's the metric we're currently adding. From there, you will just need to copy the value of the `measure_uri` field (which should be a URL!) and paste it into the array. Every Measure URI pasted into the array will be used to count towards the total count in the navigation menu, as explained above.

If you do wish to display the sum of all possible measures, it is possible to replace this field with a wildcard array instead:

```javascript
{
  nav_counts: ['*'];
}
```

This will tell the widget to include every recorded metric value when displaying the total number of (in this case) Sessions on the navigation menu. In order to prevent data from being inflated, it is recommended to only use this method if you are sure that your metrics sources do not provide the same data (such as if Google Analytics only provided EU metrics, and OPERAS only provided non-EU metrics).

#### graphs

The _graphs_ object is slightly more complex than the _nav_counts_ array, though the Measure URIs and principles are exactly the same.

In the example above, the first thing to note is that there are three direct children of the _graphs_ object: `time_graph`, `country_table`, and `world_map`. These are not arbritrary values, but instead tell the widget exactly what graphs should appear when the user clicks on (in this case) the Sessions button on the navigation menu; we want to see a time graph, a country table, and a world map. There are many more graph options available, and they can all be found in [this table](#supported-graphs).

Within each object you will see the required fields of `width` and `uris`, as well as a `hideLabel` field present on the _world_map_ object - which is optional and does not need to be present.

The _width_ field does exactly what it suggests - it tells the widget the **percentage width** of space that this graph should take up on the page. You may notice that the first graph is already set to occupy 100% of the space, but this is absolutely fine; the widget allows graphs to overflow onto as many rows as you'd like. Based on the values provided in the example above, there will be two rows - one row which contains only the time graph, and another row beneath where the space is unevenly shared between the country table and world map. The value of the _width_ field supports a number `100`, a string `"100"`, or a complete string `"100%"`. In order to prevent any whitespace, ensure that the total widths of your graphs is divisible by 100.

The _uris_ array is exactly the same as witnessed when setting up the [nav_counts](#nav_counts) array in the previous section - it is an array of Measure URIs that will contribute towards the graph. The reason that this must be re-defined is to allow full control over which URIs should contribute towards each graph. Some users may want to display the total number of (in this case) Sessions in the navigation menu, but may only want to display a world map graph when that menu item is clicked -- and this graph may not provide the full summary of Sessions.

With the _uris_ array, specifying additional URIs will NOT cause additional graphs to be rendered, but instead will simply merge the results from all URIs into the same graph. For example, if you are rendering the country table graph with data from Google Analytics (USA: 50) and OPERAS (USA: 20), you would only see one table - but the count for USA Would be 70. This is the same across all graphs.

Lastly, the _hideLabel_ field is a simple boolean that will tell the widget whether or not the label above the graph should be displayed. In the example above, we are displaying country data side by side, both in table form and in vector form. Because we already have labelled the former, it may not be necessary to label the vector graph as well. This is completely up to preference and will only hide the label from the view - but it will still be visible to screen readers and assistive technologies.

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

| name               | label               | required URI fields    | description                                                                                                                                           | version |
| ------------------ | ------------------- | ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| country_table      | {metric} By Country | `country_uri`, `value` | a table containing a list of countries and their metric values, descending the `world_map` graph represents the same data, but as a map of the world  | 0.0.1+  |
| time_graph         | {metric} Over Time  | `timestamp`, `value`   | a line graph which shows the total metric values over time                                                                                            | 0.0.1+  |
| wikipedia_articles | Wikipedia Articles  | `event_uri`            | a list of Wikipedia articles where this item is referenced                                                                                            | 0.0.1+  |
| world_map          | {metric} By Country | `country_uri`, `value` | a heatmap of the world, with countries having the most metric values being warmest the `country_table` graph represents the same data, but as a table | 0.0.1+  |
| tweets             | Tweets              | `event_uri`            | a list of embedded Twitter tweets as iframes                                                                                                          | 0.0.6+  |
| wordpress          | Wordpress           | `event_uri`            | a list of Wordpress posts where this item is referenced                                                                                               | 0.0.14+ |
| hypothesis         | Hypothesis          | `event_uri`            | a list of Hypothesis titles where this item is referenced                                                                                             | 0.0.17+ |
