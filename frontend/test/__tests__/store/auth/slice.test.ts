import {
  FlashNotificationProps,
  pushFlash,
  signIn,
} from '@/store/slices/authSlice';
import { initializeStore, store } from '@test/store';

describe('authSlice reducers', () => {
  beforeEach(() => {
    initializeStore();
  });

  describe('pushFlash', () => {
    const emptyNewFlash: FlashNotificationProps = {
      severity: 'info',
      message: '',
    };
    const hugeNewFlash: FlashNotificationProps = {
      severity: 'error',
      message: '!@#$%^&*()_+[]\\{}|'.repeat(100),
    };

    const getFlashState = () => store.getState().auth.flashes;

    it('should added a new flashes to a`flashes`state, once', () => {
      expect(getFlashState()).toEqual([]);
      store.dispatch(pushFlash(emptyNewFlash));
      expect(getFlashState()).toEqual([emptyNewFlash]);
    });

    it('should added new flashes to a`flashes`state, more than once', () => {
      expect(getFlashState()).toEqual([]);
      store.dispatch(pushFlash(hugeNewFlash));
      expect(getFlashState()).toEqual([hugeNewFlash]);
      store.dispatch(pushFlash(emptyNewFlash));
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
