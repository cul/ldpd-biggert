# Biggert Static Site
Jekyll site repo for the Biggert Collection of Architectural Vignettes<br>@ the Avery Architectural and Fine Arts Library

<a href="https://cul.github.io/biggert_static/"><img src="assets/biggert_screen.png" style="width:100%"/></a>

## Getting Started

### Set up

```sh
$ git clone https://github.com/cul/biggert_static.git && cd biggert_static
$ bundle
```

## Add/update data (if needed)

#### Generate json from hyacinth csv
```sh
$ ruby _lib/export.rb > _data/biggert-items.json
```

#### Run the Rake processing tasks

Generate the collection markdown pages:<br>
`$ bundle exec rake wax:pagemaster biggert`

Generate the elasticlunr index:<br>`$ bundle exec rake wax:lunr`


## Constant Data
| **key** 	| **value** 	|
|:------------------	|:------------------------------------------------------------------------	|
| `collection` 	| Biggert Collection of Architectural Vignettes on Commercial Stationery 	|
| `location` 	| Avery Architectural & Fine Arts Library, Columbia University 	|
| `sublocation` 	| Avery Classics Collection 	|
| `collector` 	| Biggert, Robert 	|
| `digital_origin` 	| reformatted digital 	|
