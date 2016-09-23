merged.json: data/cyclocross.csv data/world.json
	topojson -e data/cyclocross.csv \
	--id-property name,Nation \
    -p Total=+Total,Men=+Male,Women=+Female,Lat=+Lat,Lon=+Lon \
    -o data/merged.json \
    -- \
    data/world.json
