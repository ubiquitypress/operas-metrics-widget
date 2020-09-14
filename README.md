# HIRMEOS Metrics Widget

This documentation covers both the general usage and installation of the widget, as well as more in-depth explanations on how to expand the widget's functionality.

## Table of Contents

- [Getting Started](#getting-started)
- [Configuration](#configuration)
  - [Settings](#settings)
  - [Tabs](#tabs)
- [Supported Languages](#supported-languages)
- [Supported Events](#supported-events)
- [Supported Graphs](#supported-graphs)
- [Developer Guide](#developer-guide)

## Getting Started

To embed the widget onto a page, you will need to add three core components.

### Files

The widget is compiled into a single `widget.js` file, and is stored on a CDN. This file will need to be imported in order for the widget to display.

The current version of the widget is hosted at https://storage.googleapis.com/operas/metrics-widget-0.0.14/widget.js and is 184 KB in size.

Note that certain graphs, such as the world map or line charts, take up a large amount of space due to the complexity of the SVGs used. In order to compromise for this, these graphs are excluded from the main `widget.js` build file, but additional scripts will be loaded into the DOM automatically if the widget detects a missing script.

### Embedding

The HTML block below shows the minimum implementation detail.

```html
<html>
  <body>
    <!-- this is where the widget will render -->
    <div id="metrics-block"></div>

    <!-- object containing configuration for the widget -->
    <script>
      const metrics_config = {};
    </script>

    <!-- import the widget itself -->
    <script src="path/to/widget.js"></script>
  </body>
</html>
```

The `div#metrics-block` is the element in which the widget will be embedded into. You can place this anywhere on the page.

The first `script` tag defines a `metrics_config` object. This variable must be present, and cannot be renamed. This is where the widget will pull its configuration settings from. All configuration settings can be found [here](#configuration).

The final script tag is to import the JavaScript code for the widget. It is recommended to place this before the closing `</body>` tag on the HTML page.

If you have implemented just the above steps, you should see an error message stating there is no configuration found. If you see this - congratulations! This means that the JavaScript is working and that the widget is embedded. To start displaying some metrics, the next step is to configure the `metrics_config` object.

## Configuration

All configuration for the widget is handled within the `merics_config` object, set up in the [Getting Started](#getting-started) section.

Within the object, the following keys should be present:

| field    | type   | required | description                                         |
| -------- | ------ | -------- | --------------------------------------------------- |
| settings | object | yes      | an object of key/value settings for the widget      |
| tabs     | object | yes      | all of the tabs (downloads, citations, etc) to show |

### Settings

The following fields are accepted within the `settings` object of the `metrics_config` object.

| field                  | type    | required | description                                                                                                                                                                             |
| ---------------------- | ------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| base_url               | string  | yes      | the base URL of where the metrics are hosted<br> example: https://metrics-api.operas-eu.org/events                                                                                      |
| work_uri               | string  | yes      | the URI scheme and URI to use<br> example: `info:doi:10.5334/bay`                                                                                                                       |
| language               | string  | no       | the ISO 639-1 language code to display text in<br> if your [language is not supported](#supported-languages), please consider contributing<br> the default value for this field is `en` |
| localise_country_codes | boolean | false    | if `true`, graphs that display country codes will display their name instead<br> language names will be localised to the provided `language`<br> example: `fr` => `French`              |

### Tabs

Within the `tabs` object of the `metrics_config` object, each field will represent the name of the metric you wish to display. Each field will represent a new navigation tab. A full list of supported fields can be found [here](#supported-events).

For example, to display metrics for downloads, tweets, and sessions, the `tabs` object would look like this:

```javascript
tabs: {
  downloads: {},
  tweets: {},
  sessions: {}
}
```

Within each metrics object, a `nav_counts` object and `graphs` array should be provided:

```javascript
downloads: {
  nav_counts: [],
  graphs: {}
}
```

The `nav_counts` array accepts a list of URIs that will contribute towards the metrics count displayed in the navigation menu. If you wish to include all URIs in the count, you can simply write a `['*']` wildcard.

The `graphs` object accepts fields for all pre-defined graphs to be shown. A full list of supported graphs can be found [here](#supported-graphs).

Not all graphs will work for all events, as it depends on the data provided by the URI. For example, Google Analytics may provide geographical data (allowing for country tables and map graphs to be embedded), whereas other metrics providers such as OAPEN may not - even if the data is for the same event. If a graph will not display any data, it may be worth checking that the graph can work with the URI. The [Supported Graphs](#supported-graphs) section lists which fields are required for the graph to work.

Each object within the `graphs` object expects an array of URIs to be provided. Only one graph will be rendered regardless of the number of URIs provided, as the values will be merged together. Unlike for the `nav_counts` object, you cannot specify a wildcard here.

For example, to display a 'by Country' and 'over Time' graph under downloads, the object may look like this:

```javascript
downloads: {
  nav_counts: ['*'],
  graphs: {
    world_map: ['https://metrics.operas-eu.org/up-ga/downloads/v1'],
    time_graph: ['https://metrics.operas-eu.org/up-ga/downloads/v1', 'https://metrics.operas-eu.org/oapen/downloads/v1']
  }
}
```

You can display as little or many graphs as you want for each tab, though keep in mind that they will all share the same horizontal space. The order of the graphs correlates to the order in which they are defined in their parent object.

NOTE: The best way to know which metrics can be used within which graph array is by visiting the base URL endpoint with the `measure_uri` aggregation attached. For example, to find out which URIs I would want to use to count `downloads` for a work with a `base_url` of _https://metrics-api.operas-eu.org/events_ and a `work_uri` of _'info:doi:10.5334/bay'_ (both provided in the `metrics_config.settings` object), visiting the following URL https://metrics-api.operas-eu.org/events/?filter=work_uri:info:doi:10.5334/bbc&aggregation=measure_uri will provide a list of all possible `measure_uri` fields. In the case above, three objects are labelled as `type: 'downloads'` and so any of their measure URIs can be used within the array above.

## Supported Languages

The following languages are currently supported:

| name    | code | version |
| ------- | ---- | ------- |
| English | `en` | 0.0.1+  |

## Supported Events

The following metric events are _officially_ supported. Whilst it may be possible to use events other than the ones below, they are not localised and results may vary.

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

The following graphs are supported:

| name               | label               | required URI fields    | description                                                                                                                                           | version |
| ------------------ | ------------------- | ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| country_table      | {metric} By Country | `country_uri`, `value` | a table containing a list of countries and their metric values, descending the `world_map` graph represents the same data, but as a map of the world  | 0.0.1+  |
| time_graph         | {metric} Over Time  | `timestamp`, `value`   | a line graph which shows the total metric values over time                                                                                            | 0.0.1+  |
| wikipedia_articles | Wikipedia Articles  | `event_uri`            | a list of Wikipedia articles where this item is referenced                                                                                            | 0.0.1+  |
| world_map          | {metric} By Country | `country_uri`, `value` | a heatmap of the world, with countries having the most metric values being warmest the `country_table` graph represents the same data, but as a table | 0.0.1+  |
| tweets             | Tweets              | `event_uri`            | a list of embedded Twitter tweets as iframes                                                                                                          | 0.0.6+  |
| wordpress          | Wordpress           | `event_uri`            | a list of Wordpress posts where this item is reference                                                                                                | 0.0.14+ |

## Developer Guide

Work in progress! Developer notes may be below in the meantime:

https://github.com/umpirsky/country-list/blob/master/data/en/country.json -- replace `/en/` with your country code to get localised country codes, if adding new languages.
