import elasticsearch from 'elasticsearch';
import { config } from '../../config/application-config';
const debug = require('debug')('dataportal-api:occurrences');

const client = new elasticsearch.Client({
  hosts: config.get('database.elasticSearch.url'),
  log: 'trace'
});

/*
  Returns count of occurrences according to query parameters

  Param 1: isGeoreferenced (boolean), if true returns the count of georeferenced occurrences
 */
function occurrenceCount(req, res) {
  const isGeoreferenced = {
    bool: {
      must: {
        exists: {
          field: 'location'
        }
      }
    }
  };

  const isNotGeoreferenced = {
    bool: {
      must_not: {
        exists: {
          field: 'location'
        }
      }
    }
  };

  const query = {
    query: {
      bool: {
        should: [isGeoreferenced]
      }
    }
  };

  const onlyGeoreferenced = req.swagger.params.isGeoreferenced.value || false;

  if (!onlyGeoreferenced) {
    query.query.bool.should.push(isNotGeoreferenced);
  }

  client.count({
    index: 'sibdataportal',
    type: 'occurrence',
    body: query
  }, (err, response) => {
    // this sends back a JSON response which is a single string
    res.json({
      count: response.count
    });
  });
}

/*
  Returns occurrences and facets data according to params request

  Param facet: type string, name of element used for aggregation
 */
function search(req, res) {
  let countAndQueries = 1;

  const from = ((req.swagger.params.page.value) ? req.swagger.params.page.value : 0)
    * ((req.swagger.params.size.value) ? req.swagger.params.size.value : 10);
  // Root query for ES
  const query = {
    from,
    size: (req.swagger.params.size.value) ? req.swagger.params.size.value : 10,
    query: {
      bool: {
        must: [
          {
            query_string: {
              query: '*'
            }
          }
        ]
      }
    },
    aggs: {}
  };

  // If query general condition
  if (req.swagger.params.q.value) {
    query.query.bool.must[0].query_string.query = req.swagger.params.q.value;
  }

  // If wildcard queries
  if (req.swagger.params.kingdomName.value) {
    query.query.bool.must[countAndQueries] = {
      bool: {
        should: []
      }
    };
    let counter = 0;
    req.swagger.params.kingdomName.value.forEach(value => {
      query.query.bool.must[countAndQueries].bool.should[counter] = {
        wildcard: {
          'taxonomy.kingdom_name.exactWords': `*${value}*`
        }
      };
      counter++;
    });
    countAndQueries++;
  }
  if (req.swagger.params.phylumName.value) {
    query.query.bool.must[countAndQueries] = {
      bool: {
        should: []
      }
    };
    let counter = 0;
    req.swagger.params.phylumName.value.forEach(value => {
      query.query.bool.must[countAndQueries].bool.should[counter] = {
        wildcard: {
          'taxonomy.phylum_name.exactWords': `*${value}*`
        }
      };
      counter++;
    });
    countAndQueries++;
  }
  if (req.swagger.params.className.value) {
    query.query.bool.must[countAndQueries] = {
      bool: {
        should: []
      }
    };
    let counter = 0;
    req.swagger.params.className.value.forEach(value => {
      query.query.bool.must[countAndQueries].bool.should[counter] = {
        wildcard: {
          'taxonomy.class_name.exactWords': `*${value}*`
        }
      };
      counter++;
    });
    countAndQueries++;
  }
  if (req.swagger.params.orderName.value) {
    query.query.bool.must[countAndQueries] = {
      bool: {
        should: []
      }
    };
    let counter = 0;
    req.swagger.params.orderName.value.forEach(value => {
      query.query.bool.must[countAndQueries].bool.should[counter] = {
        wildcard: {
          'taxonomy.order_name.exactWords': `*${value}*`
        }
      };
      counter++;
    });
    countAndQueries++;
  }
  if (req.swagger.params.familyName.value) {
    query.query.bool.must[countAndQueries] = {
      bool: {
        should: []
      }
    };
    let counter = 0;
    req.swagger.params.familyName.value.forEach(value => {
      query.query.bool.must[countAndQueries].bool.should[counter] = {
        wildcard: {
          'taxonomy.family_name.exactWords': `*${value}*`
        }
      };
      counter++;
    });
    countAndQueries++;
  }
  if (req.swagger.params.genusName.value) {
    query.query.bool.must[countAndQueries] = {
      bool: {
        should: []
      }
    };
    let counter = 0;
    req.swagger.params.genusName.value.forEach(value => {
      query.query.bool.must[countAndQueries].bool.should[counter] = {
        wildcard: {
          'taxonomy.genus_name.exactWords': `*${value}*`
        }
      };
      counter++;
    });
    countAndQueries++;
  }
  if (req.swagger.params.speciesName.value) {
    query.query.bool.must[countAndQueries] = {
      bool: {
        should: []
      }
    };
    let counter = 0;
    req.swagger.params.speciesName.value.forEach(value => {
      query.query.bool.must[countAndQueries].bool.should[counter] = {
        wildcard: {
          'taxonomy.species_name.exactWords': `*${value}*`
        }
      };
      counter++;
    });
    countAndQueries++;
  }
  if (req.swagger.params.specificEpithetName.value) {
    query.query.bool.must[countAndQueries] = {
      bool: {
        should: []
      }
    };
    let counter = 0;
    req.swagger.params.specificEpithetName.value.forEach(value => {
      query.query.bool.must[countAndQueries].bool.should[counter] = {
        wildcard: {
          'taxonomy.specific_epithet.exactWords': `*${value}*`
        }
      };
      counter++;
    });
    countAndQueries++;
  }
  if (req.swagger.params.infraspecificEpithetName.value) {
    query.query.bool.must[countAndQueries] = {
      bool: {
        should: []
      }
    };
    let counter = 0;
    req.swagger.params.infraspecificEpithetName.value.forEach(value => {
      query.query.bool.must[countAndQueries].bool.should[counter] = {
        wildcard: {
          'taxonomy.infraspecific_epithet.exactWords': `*${value}*`
        }
      };
      counter++;
    });
    countAndQueries++;
  }

  // If facets query param construct the query for ES
  if (req.swagger.params.facet.value) {
    req.swagger.params.facet.value.forEach(value => {
      if (value === 'scientificName') {
        query.aggs.scientificName = {
          terms: {
            field: 'canonical.untouched',
            size: (req.swagger.params.facetLimit.value) ? req.swagger.params.facetLimit.value : 10,
            shard_size: 100000
          }
        };
      }
      if (value === 'kingdom') {
        query.aggs.kingdom = {
          terms: {
            field: 'taxonomy.kingdom_name.untouched',
            size: (req.swagger.params.facetLimit.value) ? req.swagger.params.facetLimit.value : 10,
            shard_size: 100000
          }
        };
      }
      if (value === 'phylum') {
        query.aggs.phylum = {
          terms: {
            field: 'taxonomy.phylum_name.untouched',
            size: (req.swagger.params.facetLimit.value) ? req.swagger.params.facetLimit.value : 10,
            shard_size: 100000
          }
        };
      }
      if (value === 'class') {
        query.aggs.class = {
          terms: {
            field: 'taxonomy.class_name.untouched',
            size: (req.swagger.params.facetLimit.value) ? req.swagger.params.facetLimit.value : 10,
            shard_size: 100000
          }
        };
      }
      if (value === 'order') {
        query.aggs.order = {
          terms: {
            field: 'taxonomy.order_name.untouched',
            size: (req.swagger.params.facetLimit.value) ? req.swagger.params.facetLimit.value : 10,
            shard_size: 100000
          }
        };
      }
      if (value === 'family') {
        query.aggs.family = {
          terms: {
            field: 'taxonomy.family_name.untouched',
            size: (req.swagger.params.facetLimit.value) ? req.swagger.params.facetLimit.value : 10,
            shard_size: 100000
          }
        };
      }
      if (value === 'genus') {
        query.aggs.genus = {
          terms: {
            field: 'taxonomy.genus_name.untouched',
            size: (req.swagger.params.facetLimit.value) ? req.swagger.params.facetLimit.value : 10,
            shard_size: 100000
          }
        };
      }
      if (value === 'specie') {
        query.aggs.specie = {
          terms: {
            field: 'taxonomy.species_name.untouched',
            size: (req.swagger.params.facetLimit.value) ? req.swagger.params.facetLimit.value : 10,
            shard_size: 100000
          }
        };
      }
      if (value === 'specific_epithet') {
        query.aggs.specific_epithet = {
          terms: {
            field: 'taxonomy.specific_epithet.untouched',
            size: (req.swagger.params.facetLimit.value) ? req.swagger.params.facetLimit.value : 10,
            shard_size: 100000
          }
        };
      }
      if (value === 'infraspecific_epithet') {
        query.aggs.infraspecific_epithet = {
          terms: {
            field: 'taxonomy.infraspecific_epithet.untouched',
            size: (req.swagger.params.facetLimit.value) ? req.swagger.params.facetLimit.value : 10,
            shard_size: 100000
          }
        };
      }
      if (value === 'country') {
        query.aggs.country = {
          terms: {
            field: 'country_name.untouched',
            size: (req.swagger.params.facetLimit.value) ? req.swagger.params.facetLimit.value : 10,
            shard_size: 100000
          }
        };
      }
      if (value === 'department') {
        query.aggs.department = {
          terms: {
            field: 'department_name.untouched',
            size: (req.swagger.params.facetLimit.value) ? req.swagger.params.facetLimit.value : 10,
            shard_size: 100000
          }
        };
      }
      if (value === 'county') {
        query.aggs.county = {
          terms: {
            field: 'county_name.untouched',
            size: (req.swagger.params.facetLimit.value) ? req.swagger.params.facetLimit.value : 10,
            shard_size: 100000
          },
          aggs: {
            department: {
              terms: {
                field: 'department_name.untouched',
                size: 10,
                shard_size: 100000
              }
            }
          }
        };
      }
      if (value === 'habitat') {
        query.aggs.habitat = {
          terms: {
            field: 'habitat.untouched',
            size: (req.swagger.params.facetLimit.value) ? req.swagger.params.facetLimit.value : 10,
            shard_size: 100000
          }
        };
      }
      if (value === 'basis_of_record') {
        query.aggs.basis_of_record = {
          terms: {
            field: 'basis_of_record.name.untouched',
            size: (req.swagger.params.facetLimit.value) ? req.swagger.params.facetLimit.value : 10,
            shard_size: 100000
          }
        };
      }
      if (value === 'collection_name') {
        query.aggs.collection_name = {
          terms: {
            field: 'collection.name.untouched',
            size: (req.swagger.params.facetLimit.value) ? req.swagger.params.facetLimit.value : 10,
            shard_size: 100000
          }
        };
      }
      if (value === 'provider_name') {
        query.aggs.provider_name = {
          terms: {
            field: 'provider.name.untouched',
            size: (req.swagger.params.facetLimit.value) ? req.swagger.params.facetLimit.value : 10,
            shard_size: 100000
          }
        };
      }
      if (value === 'resource_name') {
        query.aggs.resource_name = {
          terms: {
            field: 'resource.name.untouched',
            size: (req.swagger.params.facetLimit.value) ? req.swagger.params.facetLimit.value : 10,
            shard_size: 100000
          }
        };
      }
    });
    query.size = 0;
  }

  client.search({
    index: 'sibdataportal',
    type: 'occurrence',
    body: query
  }, (err, response) => {
    if (err) {
      res.status(400).json({
        message: 'Error searching occurrence data.',
        description: err.message
      });
    } else {
      // Create facets and results array
      const facets = [];
      const results = [];

      // Fill if aggregations exits
      if (response.aggregations) {
        Object.keys(response.aggregations).forEach(key => {
          facets.push({
            field: key,
            counts: response.aggregations[key].buckets
          });
        });
      }

      // Fill if results exits
      if (response.hits.hits) {
        response.hits.hits.forEach(occurrence => {
          results.push(occurrence._source);
        });
      }

      // this sends back a JSON response
      res.json({
        offset: (req.swagger.params.page.value) ? req.swagger.params.page.value : 0,
        size: (req.swagger.params.size.value) ? req.swagger.params.size.value : 10,
        count: response.hits.total,
        facets,
        results
      });
    }
  });
}

module.exports = {
  occurrenceCount,
  search
};
