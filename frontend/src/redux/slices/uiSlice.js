import { createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'ui',
  initialState: {
    cartDrawerOpen: false,
    mobileNavOpen: false,
  },
  reducers: {
    openCartDrawer: (s) => {
      s.cartDrawerOpen = true;
    },
    closeCartDrawer: (s) => {
      s.cartDrawerOpen = false;
    },
    toggleCartDrawer: (s) => {
      s.cartDrawerOpen = !s.cartDrawerOpen;
    },
    openMobileNav: (s) => {
      s.mobileNavOpen = true;
    },
    closeMobileNav: (s) => {
      s.mobileNavOpen = false;
    },
  },
});

export const {
  openCartDrawer,
  closeCartDrawer,
  toggleCartDrawer,
  openMobileNav,
  closeMobileNav,
} = slice.actions;
export default slice.reducer;
