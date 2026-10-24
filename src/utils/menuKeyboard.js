/**
 * Return the menu item index targeted by a keyboard event, or null when the
 * key is not a menu-navigation key. A negative index means focus is outside
 * the menu and starts at the first/last item for ArrowDown/ArrowUp.
 */
export function getMenuFocusIndex(key, currentIndex, itemCount) {
  if (!Number.isInteger(itemCount) || itemCount <= 0) return null;

  if (key === 'Home') return 0;
  if (key === 'End') return itemCount - 1;
  if (key === 'ArrowDown') {
    return currentIndex < 0 ? 0 : (currentIndex + 1) % itemCount;
  }
  if (key === 'ArrowUp') {
    return currentIndex < 0 ? itemCount - 1 : (currentIndex - 1 + itemCount) % itemCount;
  }
  return null;
}
