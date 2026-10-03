# New York's library networks on the map

A reproducible source package for a short map story about New York City's
public-library networks. This package contains data and a scene plan; no rendered
video or publication is claimed yet.

The frozen **FacDB 26v1** library subset has 254 records. Selecting only
`PUBLIC LIBRARY` retains 226 records: Brooklyn 68, Queens 67, Manhattan 42,
Bronx 35 and Staten Island 14. These are counts in this particular dataset,
not a census of currently open branches or a measure of service quality.

Five Brooklyn library/learning-center pairs share a documented building.
Their member records remain separate in the data but share one map marker.
The resulting 221 markers are a display convention, not a certified count of
unique library buildings. The adapter never merges points solely because their
coordinates coincide. It treats missing or placeholder building IDs as unknown.

## Reproduce the source package

Use Node 22. From the repository root:

```sh
node --test pipeline/sources/nyc-libraries.test.mjs
node pipeline/sources/nyc-libraries.mjs
node pipeline/sources/verify-library-geography.mjs
```

The adapter verifies the raw snapshot checksum and writes
`data/nyc-libraries/derived/libraries.json`. All original records, the filter,
site-group member IDs and corroborating URLs are retained. The source retrieval
URL and access time are in `data/nyc-libraries/provenance.json`; it points to the
live API, whose future response may differ. Reproduction uses the retained bytes.

## Sources and interpretation

- [NYC Planning Facilities Database](https://data.cityofnewyork.us/City-Government/Facilities-Database/ji82-xba5).
- [FacDB 26v1 documentation](https://s-media.nyc.gov/agencies/dcp/assets/files/pdf/data-tools/bytes/facilities_readme.pdf): source coverage, duplicates and administrative addresses limit interpretation. A point is not proof of public access or current opening status.
- [Brooklyn adult learning-center directory](https://www.bklynlibrary.org/adult-learning/learning-centers) corroborates learning centers within the five named libraries. It also carries closure notices, so the snapshot must not promise current availability.
- [Bedford Library](https://www.bklynlibrary.org/locations/bedford) locates its learning center on the second floor.
- [New Lots Library](https://www.bklynlibrary.org/locations/new-lots) describes its learning-center services.
- [NYPL system overview](https://www.nypl.org/about) describes its Bronx, Manhattan and Staten Island network. Its published system total is not substituted for the FacDB snapshot count.
- [Queens location directory](https://www.queenslibrary.org/about-us/locations) includes live closure/service notices. Consult the provider before visiting.
- [DCP borough boundaries](https://data.cityofnewyork.us/City-Government/Borough-Boundaries/gthc-hcne): 26b, water excluded; a separate source/version from the facility data.

No accessibility, population-normalized service, opening-hours or historical
facility-count claim is derived from these points. Academic/special libraries
and the separately typed NYCHA community-center library are outside this filter.
