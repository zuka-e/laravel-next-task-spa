import { GUEST_EMAIL, GUEST_PASSWORD } from '@/config/app';
import { signIn } from '@/store/slices/authSlice';
import { SignInRequest, signInWithEmail } from '@/store/thunks/auth';
import { createTaskList, CreateTaskListRequest } from '@/store/thunks/lists';
import { generateRandomString } from '@/utils/generator';
import { initializeStore, store } from '@test/store';
import { getUserState, isSignedIn } from '@test/utils/store/auth';
import { isLoading } from '@test/utils/store/boards';
import { CSRF_TOKEN } from '@test/utils/validation';
import { boardOfGuestUser, guestUser, unverifiedUser } from '@test/data';
import { fetchTaskBoard } from '@/store/thunks/boards';

describe('Thunk creating a new task list', () => {
  const signInRequest: SignInRequest = {
    email: GUEST_EMAIL,
    password: GUEST_PASSWORD,
  };

  const input: { boardId: string } & CreateTaskListRequest = {
    boardId: boardOfGuestUser.id,
    title: generateRandomString(20),
    description: generateRandomString(255),
  };

  beforeEach(() => {
    initializeStore();
  });

  describe('Rejected', () => {
    it('should receive an error without a session', async () => {
      expect(isSignedIn(store)).toEqual(undefined);
      store.dispatch(signIn());
      expect(isSignedIn(store)).toEqual(true);
      expect(getUserState(store)).toBeFalsy();
      const response = await store.dispatch(createTaskList(input));

      expect(createTaskList.rejected.match(response)).toBeTruthy();
      expect(isLoading(store)).toEqual(false);
      expect(store.getState().app.httpStatus).toBe(401);
    });

    it('should receive an error without a valid token', async () => {
      expect(isSignedIn(store)).toEqual(undefined);
      await store.dispatch(signInWithEmail(signInRequest)); // ログイン
      localStorage.removeItem(CSRF_TOKEN); // token削除
      expect(isSignedIn(store)).toEqual(true);
      expect(getUserState(store)?.id).toEqual(guestUser.id);
      const response = await store.dispatch(createTaskList(input));

      expect(createTaskList.rejected.match(response)).toBeTruthy();
      expect(isLoading(store)).toEqual(false);
      expect(store.getState().app.httpStatus).toBe(419);
    });

    it('should receive an error unless having been verified', async () => {
      const loginAsUnverifiedUser = async () => {
        const signInRequest: SignInRequest = {
          email: unverifiedUser.email,
          password: GUEST_PASSWORD,
        };
        return store.dispatch(signInWithEmail(signInRequest));
      };
      expect(isSignedIn(store)).toEqual(undefined);
      await loginAsUnverifiedUser();
      expect(isSignedIn(store)).toEqual(true);
      expect(getUserState(store)?.id).toEqual(unverifiedUser.id);
      const response = await store.dispatch(createTaskList(input));

      expect(createTaskList.rejected.match(response)).toBeTruthy();
      expect(isLoading(store)).toEqual(false);
      expect(isSignedIn(store)).toEqual(true);
      expect(getUserState(store)?.id).toEqual(unverifiedUser.id);
      expect(store.getState().app.httpStatus).toBe(403);
    });
  });

  describe('Fulfilled', () => {
    it('should create a new list with the parent existing', async () => {
      await store.dispatch(signInWithEmail(signInRequest));
      await store.dispatch(
        fetchTaskBoard({ userId: guestUser.id, boardId: boardOfGuestUser.id })
      );
      const response = await store.dispatch(createTaskList(input));

      expect(createTaskList.fulfilled.match(response)).toBeTruthy();
      if (createTaskList.rejected.match(response)) return;
      expect(response.payload.data.title).toEqual(input.title);
      expect(response.payload.data.description).toEqual(input.description);
      const lists = store.getState().boards.docs[input.boardId].lists;
      const lastList = lists.slice(-1)[0];
      expect(lastList.title).toEqual(input.title);
      expect(lastList.description).toEqual(input.description);
    });
  });
});
