package com.migrantcommunity.unit;

import com.migrantcommunity.profile.PrivacySettings;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class PrivacySettingsTest {

    @Test
    void defaultsArePrivacyPreserving() {
        PrivacySettings s = PrivacySettings.DEFAULTS;
        assertTrue(s.showHometown());
        assertFalse(s.showExactLocation());
        assertTrue(s.discoverable());
    }

    @Test
    void jsonRoundTrip() {
        PrivacySettings s = new PrivacySettings(false, true, true, false, true, false, true);
        PrivacySettings parsed = PrivacySettings.fromProfile(profileWith(s.toJson()));
        assertEquals(s, parsed);
    }

    @Test
    void invalidJsonFallsBackToDefaults() {
        assertEquals(PrivacySettings.DEFAULTS, PrivacySettings.fromProfile(profileWith("{bad json")));
        assertEquals(PrivacySettings.DEFAULTS, PrivacySettings.fromProfile(null));
    }

    private com.migrantcommunity.profile.entity.Profile profileWith(String json) {
        com.migrantcommunity.profile.entity.Profile p = new com.migrantcommunity.profile.entity.Profile();
        p.setPrivacySettings(json);
        return p;
    }
}
