'use client';

import React from 'react';

/**
 * ARTELLIUM AFRICA - STRUCTURED DATA & SEMANTIC SEO PLUGIN (JSON-LD)
 * Adds Google Arts & Culture / Schema.org compliance for VisualArtworks,
 * African Heritage Provenance, and Fine Art Gallery verification.
 */
export default function ArtelliumSchemaPlugin() {
  const schemaData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ArtGallery',
        '@id': 'https://artellium.africa/#gallery',
        'name': 'Artellium Africa Fine Art & Curation Ecosystem',
        'url': 'https://artellium.africa',
        'logo': 'https://artellium.africa/favicon.ico',
        'description': 'Pan-African Fine Art Marketplace, Live Vault Auctions, Certified Provenance Ledger, and Master Artist Atelier Studio.',
        'funder': {
          '@type': 'Organization',
          'name': 'Artellium Africa Heritage Trust'
        },
        'paymentAccepted': 'Wema Bank Direct Corporate Settlement, Visa, Mastercard, Wire Transfer',
        'currenciesAccepted': 'NGN, USD, GHS, KES, ZAR, EGP',
        'areaServed': [
          'Nigeria', 'Ghana', 'Kenya', 'South Africa', 'Egypt', 'Morocco', 'Senegal', 'Ethiopia', 'Uganda', 'United States', 'United Kingdom', 'Global'
        ],
        'sameAs': [
          'https://instagram.com/artellium.africa',
          'https://twitter.com/artelliumafrica'
        ]
      },
      {
        '@type': 'WebSite',
        '@id': 'https://artellium.africa/#website',
        'url': 'https://artellium.africa',
        'name': 'Artellium Africa',
        'potentialAction': {
          '@type': 'SearchAction',
          'target': 'https://artellium.africa/catalog?q={search_term_string}',
          'query-input': 'required name=search_term_string'
        }
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
}
