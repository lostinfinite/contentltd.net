// Map of offensive item IDs to their descriptions
const OFFENSIVE_ITEMS = {
  a: "Ima hack this fucker",
  b: "Discord DM sent on 6/17/2025 at 1:07 AM (ET)",
  c: "Discord DM sent on 6/17/2025 at 1:09 AM (ET)",
  d: "Discord Message sent on 7/8/2025 at 11:03 PM (ET) in: The ContentLTD Brand (SM)",
  e: "Best of 3 on 200cc, no blue shells, loser quits.",
  f: "Not Applicable",
  g: "Inappropriate username",
  h: "Exploiting or cheating",
  i: "Scamming",
  j: "Other violation",
  k: "Deleting or modifying cookies created by us to evade a ban."
};

function getOffensiveItemById(id) {
  return OFFENSIVE_ITEMS[id] || "Unknown item";
}
