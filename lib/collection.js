// LocalStorage-backed NFT collection helpers.
const COLLECTION_KEY = 'claw-nfts';

export function getCollection(owner) {
  if (!owner || typeof window === 'undefined') return [];
  const all = JSON.parse(window.localStorage.getItem(COLLECTION_KEY) || '[]');
  return all.filter((nft) => nft.owner === owner);
}

export function saveCollection(collection) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(COLLECTION_KEY, JSON.stringify(collection));
}

export function upsertNFT(nft) {
  if (typeof window === 'undefined') return;
  const all = JSON.parse(window.localStorage.getItem(COLLECTION_KEY) || '[]');
  const next = [nft, ...all];
  window.localStorage.setItem(COLLECTION_KEY, JSON.stringify(next));
}

export function updateNFTOwner(id, newOwner) {
  if (typeof window === 'undefined') return null;
  const all = JSON.parse(window.localStorage.getItem(COLLECTION_KEY) || '[]');
  const idx = all.findIndex((item) => item.id === id);
  if (idx === -1) return null;
  all[idx] = { ...all[idx], owner: newOwner, transferredAt: new Date().toISOString() };
  window.localStorage.setItem(COLLECTION_KEY, JSON.stringify(all));
  return all[idx];
}
