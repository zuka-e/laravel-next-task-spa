import {
  FlashNotificationProps,
  setFlash,
  signIn,
} from '@/store/slices/authSlice';
import { initializeStore, store } from '@test/store';

describe('authSlice reducers', () => {
  beforeEach(() => {
    initializeStore();
  });

  describe('setFlash', () => {
    const emptyNewFlash: FlashNotificationProps = {
      severity: 'info',
      message: '',
    };
    const hugeNewFlash: FlashNotificationProps = {
      severity: 'error',
      message: '!@#$%^&*()_+[]\\{}|'.repeat(100),
    };

    const getFlashState = () => store.getState().auth.flash;

    it('should added a new flash to a`flash`state, once', () => {
      expect(getFlashState()).toEqual([]);
      store.dispatch(setFlash(emptyNewFlash));
      expect(getFlashState()).toEqual([emptyNewFlash]);
    });

    it('should added new flashes to a`flash`state, more than once', () => {
      expect(getFlashState()).toEqual([]);
      store.dispatch(setFlash(hugeNewFlash));
      expect(getFlashState()).toEqual([hugeNewFlash]);
      store.dispatch(setFlash(emptyNewFlash));
      expect(getFlashState()).toEqual([hugeNewFlash, emptyNewFlash]);
    });
  });

  describe('signIn', () => {
    const isSignedIn = () => store.getState().auth.signedIn;

    it('should update a`signedIn`state to true after login', () => {
      expect(isSignedIn()).toBeUndefined();
      store.dispatch(signIn());
      expect(isSignedIn()).toBe(true);
    });
  });
});
