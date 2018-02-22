# Biggert Static Site
Jekyll Site Repo for the Biggert Collection of Architectural Vignettes @ the Avery Architectural and Fine Arts Library

![biggert_screen](assets/biggert_screen.png)

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

> Generate the collection markdown pages
```sh
$ bundle exec rake wax:pagemaster biggert
```
Generate json for the map markers
```sh
$ bundle exec rake markers
```
Generate the elasticlunr index
```sh
$ bundle exec rake wax:lunr
```
__OR: Run all of the above at once!__
```sh
$ bundle exec rake aota # generates pages, markers & the index
```


## Constant Data
| **key** 	| **value** 	|
|------------------	|------------------------------------------------------------------------	|
| `collection` 	| Biggert Collection of Architectural Vignettes on Commercial Stationery 	|
| `location` 	| Avery Architectural & Fine Arts Library, Columbia University 	|
| `sublocation` 	| Avery Classics Collection 	|
| `collector` 	| Biggert, Robert 	|
| `digital_origin` 	| reformatted digital 	|
