/**
 * Centralized Priority Utility for Artellium Africa.
 * 
 * Subscribed artists (Priority / Premium Plan) receive top priority placement
 * across Homepage (Live Auctions, Exhibitions, Recently Sold, Newly Listed, Flash Deals)
 * and all main pages (Explore, Auctions, Exhibitions, Categories, Under ₦1M, Curator Picks).
 * 
 * All artists maintain the right to register and upload their original creations.
 */

/**
 * Determines whether an artwork, auction lot, or artist belongs to a Subscribed Priority Artist.
 * 
 * @param {Object} item - Artwork, Auction Lot, Exhibition piece, or Artist record
 * @param {Array} [sellers=[]] - Optional sellers array for relational lookup
 * @param {Array} [users=[]] - Optional users array for relational lookup
 * @returns {boolean}
 */
export function isPriorityArtist(item, sellers = [], users = []) {
  if (!item) return false;

  // 1. Direct explicit priority flags on item
  if (item.isPriorityArtist === true || item.isSubscribedArtist === true || item.isPriority === true) {
    return true;
  }

  // 2. Artist type / tier checks
  const type = String(item.artistType || item.tier || item.subscription_tier || item.subscriptionTier || '').toLowerCase();
  if (type === 'premium' || type === 'priority' || type === 'gold' || type === 'heritage master' || type === 'gold master') {
    return true;
  }

  // 3. Verification badge gold tier
  if (item.verificationBadge === 'gold' || item.verification_badge === 'gold') {
    return true;
  }

  // 4. Relational lookup by sellers list
  if (Array.isArray(sellers) && sellers.length > 0) {
    const matchedSeller = sellers.find((s) => {
      if (!s) return false;
      if (item.artistId && s.id === item.artistId) return true;
      if (item.artistName && s.name && s.name.toLowerCase() === item.artistName.toLowerCase()) return true;
      if (item.artist && s.name && s.name.toLowerCase() === item.artist.toLowerCase()) return true;
      return false;
    });

    if (matchedSeller) {
      const sTier = String(matchedSeller.tier || matchedSeller.subscription_tier || '').toLowerCase();
      if (sTier === 'premium' || sTier === 'priority' || matchedSeller.isPriority || matchedSeller.verification_badge === 'gold') {
        return true;
      }
    }
  }

  // 5. Relational lookup by users list
  if (Array.isArray(users) && users.length > 0) {
    const matchedUser = users.find((u) => {
      if (!u) return false;
      if (item.artistId && u.id === item.artistId) return true;
      if (item.artistName && u.name && u.name.toLowerCase() === item.artistName.toLowerCase()) return true;
      if (item.artist && u.name && u.name.toLowerCase() === item.artist.toLowerCase()) return true;
      return false;
    });

    if (matchedUser) {
      const uTier = String(matchedUser.subscription_tier || matchedUser.subscriptionTier || '').toLowerCase();
      if (uTier === 'premium' || uTier === 'priority') {
        return true;
      }
    }
  }

  return false;
}

/**
 * Sorts any array of artworks so that Subscribed Priority Artists appear at the top.
 * 
 * Hierarchy:
 * 1. Subscribed Priority Artist Real Creations
 * 2. Standard Real Artist Creations
 * 3. Subscribed Priority Demo/Fallback Masterpieces
 * 4. Standard Demo/Fallback Pieces
 * 
 * @param {Array} artworksList - Array of artwork items
 * @param {Object} [options={}] - Sorting configuration
 * @returns {Array} Sorted artworks array
 */
export function sortArtworksByPriority(artworksList = [], options = {}) {
  const { sellers = [], users = [], secondarySort = 'newest' } = options;
  if (!Array.isArray(artworksList)) return [];

  return [...artworksList].sort((a, b) => {
    const aPriority = isPriorityArtist(a, sellers, users);
    const bPriority = isPriorityArtist(b, sellers, users);

    // 1. Subscribed Priority Artists strictly first
    if (aPriority && !bPriority) return -1;
    if (!aPriority && bPriority) return 1;

    // 2. Real artist creations before demo items (within same priority tier)
    const aReal = a.isDemo === false || (!a.isDemo && !String(a.id || '').startsWith('mock-'));
    const bReal = b.isDemo === false || (!b.isDemo && !String(b.id || '').startsWith('mock-'));
    if (aReal && !bReal) return -1;
    if (!aReal && bReal) return 1;

    // 3. Secondary sort
    if (secondarySort === 'price_low') {
      return (a.price || 0) - (b.price || 0);
    }
    if (secondarySort === 'price_high') {
      return (b.price || 0) - (a.price || 0);
    }
    if (secondarySort === 'rating') {
      return (b.rating || 5) - (a.rating || 5);
    }
    if (secondarySort === 'sold_date') {
      const aDate = new Date(a.soldAt || a.created_at || 0).getTime();
      const bDate = new Date(b.soldAt || b.created_at || 0).getTime();
      return bDate - aDate;
    }

    // Default newest first
    const aTime = new Date(a.created_at || a.year || 0).getTime();
    const bTime = new Date(b.created_at || b.year || 0).getTime();
    return bTime - aTime;
  });
}

/**
 * Sorts live auction lots with subscribed priority artists first.
 * 
 * @param {Array} lots - Array of auction lots
 * @param {Array} [sellers=[]]
 * @param {Array} [users=[]]
 * @returns {Array}
 */
export function sortAuctionsByPriority(lots = [], sellers = [], users = []) {
  if (!Array.isArray(lots)) return [];

  return [...lots].sort((a, b) => {
    const aPriority = isPriorityArtist(a, sellers, users);
    const bPriority = isPriorityArtist(b, sellers, users);

    if (aPriority && !bPriority) return -1;
    if (!aPriority && bPriority) return 1;

    // Active bids count or end timestamp
    return (b.totalBids || 0) - (a.totalBids || 0);
  });
}

/**
 * Sorts virtual and physical exhibitions with priority artists first,
 * and sorts internal exhibited artworks by priority.
 * 
 * @param {Array} exhibitions - Array of exhibition objects
 * @param {Array} [sellers=[]]
 * @param {Array} [users=[]]
 * @returns {Array}
 */
export function sortExhibitionsByPriority(exhibitions = [], sellers = [], users = []) {
  if (!Array.isArray(exhibitions)) return [];

  return [...exhibitions]
    .map((ex) => {
      const sortedArtworks = sortArtworksByPriority(ex.exhibitedArtworks || [], { sellers, users });
      return {
        ...ex,
        exhibitedArtworks: sortedArtworks
      };
    })
    .sort((a, b) => {
      // Check if exhibition contains participating priority artists
      const aHasPriority = (a.participatingArtists || []).some(art => isPriorityArtist(art, sellers, users)) ||
        (a.exhibitedArtworks || []).some(art => isPriorityArtist(art, sellers, users));
      const bHasPriority = (b.participatingArtists || []).some(art => isPriorityArtist(art, sellers, users)) ||
        (b.exhibitedArtworks || []).some(art => isPriorityArtist(art, sellers, users));

      if (aHasPriority && !bHasPriority) return -1;
      if (!aHasPriority && bHasPriority) return 1;

      return 0;
    });
}
