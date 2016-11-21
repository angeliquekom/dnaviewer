# dnaViewer

The application was implemented using Angular Seed skeleton. The files directory
has been changed to controllers, components, services and constants.
Additional tools for the implementation are the below:
a) Angular 1.5
a) Angular Material
b) Material Design Data Table (https://github.com/daniel-nagy/md-data-table)
c) d3.js (d3js was selected so that our visualization to be extendable)

The user is able to:
1) View the table of the features.
a) Sort and search pattern
b) Click on the pattern and display the sequence pattern in dialog
c) Mapping to SBOL symbols

2) View the plasmid Diagram with:
a) Arrows for displaying the strand
b) Labels of each features
c) Display of the index of the largest features
d) Display of non specified regions
e) Animation on hover and linking to the table of the features

Unit testing:
1) Unit testing has been implemented for two basics functions of the main controller
a) The first sorts the data from json array according the start position
b) The second fills the main data array with new objects regions that are not
specified (gray color on the diagram)

Future extensions:
1) Additional animation (barchart) for displaying the frequency of the search
   pattern of each feature
2) Refactor the creation of the graph to be configurable (partly with TYPES_MAPPING for now. In addition, we could create a new component binding the values, colors configuration, labels position...)
3) Editing each feature on click event and update the diagram
5) SBOL inside diagram (needed transparent background)
6) When the user clicks on the slice of the diagram the filtering should become
   permanent at the table of the features
7) Create from start (with drag n drop functionality) a new diagram
8) Upload/Download json
9) Hovering on a feature on the table the related slice at the diagram should
  be focused.

## Getting Started

### Dependencies

We have two kinds of dependencies in this project: tools and angular framework code.  The tools help us manage and test the application.

* We get the tools we depend upon via `npm`, the [node package manager][npm].
* We get the angular code via `bower`, a [client-side code package manager][bower].

Both npm and bower packages are available in different distros.

### Install and Run

We have preconfigured `npm` to automatically run `bower` so we can simply do:

```
cd dnaviewer
npm install
bower install (if locally node_modules/bower/bin/bower install)
```

Run the application:
```
npm start
```

Now browse to the app at `http://localhost:8000/index.html`.

### Test the Application

```
npm test
```
