# Car Wars Combat Garage

This is a Web-based design tool for Car Wars vehicles.
It supports Car Wars Classic, Car Wars Compendium, and Uncle Albert's Catalog From Hell.

If you just want to use it, the old semi-broken version is at
http://carwars.opentools.org/ and I'll add a link here once a
new version is available online.

There's no advantage to building from source at this point as
the backend is still very incomplete, and I'll post it to a
new home once it's working enough to try out.

## About The Code

The 5th generation design tool, called the Car Wars Combat Garage, was originally built
against a Ruby back end.  Due to the instability of the Ruby server environment, this
6th generation is the same UI but with a rebuilt Java back end.  Therefore the UI portion
is a straight import of a somewhat long-in-the-tooth Angular and Ionic app.  The back end
is starting with virtually nothing and will hopefully come together before too long.

It requires a MySQL database and will be deployed on Tomcat, but should function with
mvn jetty:run

## Environment Variables

To run the app, the following environment variables are needed:

    export OPENSHIFT_DATA_DIR=
    export OPENSHIFT_MYSQL_DB_HOST=
    export OPENSHIFT_MYSQL_DB_PORT=
    export CARWARS_DB_NAME=
    export CARWARS_DB_USER=
    export CARWARS_DB_PASS=
    export CARWARS_MAIL_HOST=
    export CARWARS_MAIL_PASS=
    export CARWARS_PASSWORD_PREFIX=
    export CARWARS_CONFIRMATION_PREFIX=
