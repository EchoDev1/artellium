-- =========================================================================
-- ARTELLIUM AFRICA — PRODUCTION SEED DATA
-- Populates initial Master Artists, Artworks, Provenance Blocks, and Settings
-- =========================================================================

-- 1. INITIAL USERS & MASTER ATELIERS
INSERT INTO public.users (id, name, email, role, phone, country, subscription_tier)
VALUES
('usr-1', 'Chief Bakare Ogundele', 'bakare@artellium.africa', 'artist', '+2348031234567', 'Nigeria', 'premium'),
('usr-2', 'Amina Diallo', 'amina@artellium.africa', 'artist', '+2348029876543', 'Nigeria', 'premium'),
('usr-3', 'Kofi Mensah', 'kofi@artellium.africa', 'artist', '+233241234567', 'Ghana', 'premium'),
('usr-4', 'Fatoumata Diabaté', 'fatoumata@artellium.africa', 'artist', '+22370123456', 'Mali', 'standard'),
('usr-5', 'Admin Artellium', 'admin@artellium.africa', 'admin', '+2348000000000', 'Nigeria', 'institutional')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.sellers (id, user_id, name, bio, country, city, country_flag, avatar_url, tier, verification_badge, studio_notes, payout_bank, payout_account, commission_rate)
VALUES
('artist-1', 'usr-3', 'Kofi Mensah', 'Master Painter & 24k Gold Leaf Specialist in Accra.', 'Ghana', 'Accra', '🇬🇭', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300', 'Premium', 'gold', 'Every morning I grind pigment by hand — a ritual my grandfather taught me.', 'Access Bank Ghana', '0123456789', 0.15),
('artist-2', 'usr-2', 'Amina Diallo', 'Royal Lost-Wax Benin Bronze Sculptress.', 'Nigeria', 'Benin City', '🇳🇬', 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=300', 'Premium', 'heritage', 'I work beside the same foundry fire my great-grandmother lit in Benin City.', 'First Bank of Nigeria', '2034567890', 0.15),
('artist-4', 'usr-1', 'Chief Bakare Ogundele', 'Master Sculptor of Ancient Yoruba Sacred Wood & Brass.', 'Nigeria', 'Oyo', '🇳🇬', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300', 'Premium', 'gold', 'The chisel speaks its own dialect. My studio is a sacred compound in Oyo.', 'Zenith Bank PLC', '1012345678', 0.15)
ON CONFLICT (id) DO NOTHING;

-- 2. INITIAL MASTERPIECE ARTWORKS
INSERT INTO public.artworks (id, seller_id, artist_name, artist_type, artist_avatar, title, category, medium, dimensions, price, price_usd, status, year, provenance, description, image, country, city, country_flag, verification_badge, is_featured, starting_bid, current_bid, total_bids)
VALUES
('art-101', 'artist-1', 'Kofi Mensah', 'Premium', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300', 'The Ancestral Horizon', 'Painters', 'Oil & 24k Gold Leaf on Linen', '150 x 120 cm', 1850000, 1250, 'available', '2026', 'Created in Accra, Ghana. Exhibited at 2025 Contemporary African Art Biennale.', 'A breathtaking exploration of West African royal lineage utilizing 24k gold leaf layerings and deep indigo acrylics.', 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&q=80&w=1000', 'Ghana', 'Accra', '🇬🇭', 'gold', true, NULL, NULL, 0),
('art-102', 'artist-2', 'Amina Diallo', 'Premium', 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=300', 'The Golden Benin Queen', 'Sculpture Makers', 'Lost-Wax Bronze & 24k Gilt', '85 x 40 x 35 cm', 4900000, 3300, 'auction', '2026', 'Hand-cast in Benin City royal guild compound.', 'An intricate lost-wax bronze bust representing royal Benin queens, balancing historical reverence with bold geometry.', 'https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?auto=format&fit=crop&q=80&w=1000', 'Nigeria', 'Benin City', '🇳🇬', 'heritage', true, 3500000, 4900000, 14),
('art-104', 'artist-4', 'Chief Bakare Ogundele', 'Premium', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300', 'The Solitary Mask of Oyo', 'Sculpture Makers', 'Carved Iroko Wood & Brass Inlay', '90 x 35 x 25 cm', 1450000, 980, 'available', '2026', 'Master carver studio in Oyo State, Nigeria.', 'Sacred Yoruba ceremonial carving infused with modern minimalist contours and hand-hammered brass inlay.', 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?auto=format&fit=crop&q=80&w=1000', 'Nigeria', 'Oyo', '🇳🇬', 'gold', true, NULL, NULL, 0)
ON CONFLICT (id) DO NOTHING;

-- 3. MUSEUM PROVENANCE LEDGER INITIAL BLOCKS
INSERT INTO public.ledger_blocks (id, block_height, artwork_title, artist_name, medium, dimensions, category, settlement_price, custodian, custodian_location, settlement_bank, provenance_hash, physical_certificate_id, status, hologram_type, curator_notes, image)
VALUES
('block-101', '#88914', 'The Golden Benin Queen', 'Amina Diallo', 'Lost-Wax Bronze & 24k Gilt', '85 x 40 x 35 cm', 'Royal Heirlooms', 4900000, 'National Commission for Museums & Monuments', 'Lagos National Vault', 'Wema Bank PLC / Dual Fiduciary Settlement', '0x8f2d...91c4b7e2', 'PL-2026-88914', 'Vault Verified & Transferred', '24K Gold Emissary Hologram', 'Passed full thermoluminescence and spectroscopic analysis. Physical brass seal applied.', 'https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?auto=format&fit=crop&q=80&w=600'),
('block-102', '#88913', 'Oba Royal Scepter of 1897', 'Royal Guild Heritage', 'Hand-Hammered Brass & Coral', '110 x 18 x 18 cm', 'Museum Provenance', 12500000, 'Edo Heritage Custodial Trust', 'Benin City Central Archive', 'Wema Bank PLC / Dual Fiduciary Settlement', '0x3a1e...44d9f012', 'PL-2026-88913', 'Vault Verified & Transferred', '24K Gold Emissary Hologram', 'Authenticated against 19th-century royal registry records.', 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=600')
ON CONFLICT (id) DO NOTHING;

-- 4. INITIAL PLATFORM SETTINGS
INSERT INTO public.platform_settings (key, value, description)
VALUES
('payout_percentage', '{"artist_share": 85, "platform_share": 15, "currency": "NGN"}'::jsonb, 'Global Artist Net Remittance vs Platform Retained Fee'),
('fiduciary_bank', '{"bank_name": "Wema Bank PLC", "account_type": "Corporate Dual Settlement", "jurisdiction": "Pan-African / Global"}'::jsonb, 'Corporate Settlement Banking Partner')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
