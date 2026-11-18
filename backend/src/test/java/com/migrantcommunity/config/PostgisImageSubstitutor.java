package com.migrantcommunity.config;

import org.testcontainers.utility.DockerImageName;
import org.testcontainers.utility.ImageNameSubstitutor;

/**
 * The application schema requires the PostGIS extension (see Flyway V1),
 * but the jdbc:tc:postgresql URL scheme only resolves official postgres
 * images which do not ship PostGIS. Substitute the plain postgres image
 * with the official postgis/postgis image at a compatible major version.
 */
public class PostgisImageSubstitutor extends ImageNameSubstitutor {

    private static final DockerImageName POSTGIS_IMAGE = DockerImageName.parse("postgis/postgis:15-3.4");

    @Override
    public DockerImageName apply(DockerImageName original) {
        if (original.getRepository().endsWith("postgres")) {
            return POSTGIS_IMAGE;
        }
        return original;
    }

    @Override
    public String getDescription() {
        return "Substitute plain postgres test images with postgis/postgis for Flyway migrations";
    }
}
