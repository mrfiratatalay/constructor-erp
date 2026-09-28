package com.atalay.santiye.material.dto;

import com.atalay.santiye.material.LocationKind;
import java.util.UUID;

/** Hareketin bir ucu: depo ya da şantiye, adıyla. */
public record LocationRef(UUID id, String name, LocationKind kind) {
}
