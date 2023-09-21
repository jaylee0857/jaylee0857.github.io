/**
 * bulletin store 封裝
 */
import { defineWorkflow } from "@/_app/_define";
import { createPassport } from "./common/core/passport";
import { queueOf, onceOf, exhaustOf } from "./common/core/observers";
import { withPayload } from "./common/core/operators";

/** stores */
import { useBulletinStore } from "@/store/bulletin-store";

/** workflows */
import { useListenerWorkflow } from "./common/listener-workflow";

export const useBulletinWorkflow = defineWorkflow("bulletin-workflow", () => {
  const bulletinStore = useBulletinStore();
  const listenerWorkflow = useListenerWorkflow();

  const createGetBulletinPassport = () => {
    const passport = createPassport(
      "bulletin.getBulletin",
      bulletinStore.getAllBulletin
      //
    );
    const observer = onceOf(passport);
    return () => observer.excute();
  };

  const createGetNewBulletinPassport = () => {
    const passport = createPassport(
      "bulletin.getNewBulletin",
      bulletinStore.getAllBulletin
      //
    );
    const observer = exhaustOf(passport);
    return () => observer.excute();
  };

  const createUpdateLimitedPassport = () => {
    const passport = createPassport(
      "bulletin.updateLimited",
      bulletinStore.updateLimited
      //
    ).pipe(
      withPayload()
      //
    );
    const observer = exhaustOf(passport);
    return (payload) => {
      passport.call("payload", payload);
      return observer.excute();
    };
  };

  const createGetWithdrawPassport = () => {
    const passport = createPassport(
      "bulletin.getWithdraw",
      bulletinStore.getWithdraw
      //
    );
    const observer = queueOf(3000)(passport);
    return () => observer.excute();
  };

  const getBulletin = createGetBulletinPassport();
  const getNewBulletin = createGetNewBulletinPassport();
  const getWithdraw = createGetWithdrawPassport();
  const updateLimited = createUpdateLimitedPassport();

  const initial = () => {
    /** 建立監聽 */
    listenerWorkflow.registerLoggedIn((isLoggedIn) => {
      if (!isLoggedIn) {
        /** 登出時重置公告 */
        bulletinStore.$reset();
      }
    });
    listenerWorkflow.registerNotify("news", (hasNews) => {
      if (hasNews) {
        getNewBulletin();
      }
    });
  };

  return {
    initial,
    getBulletin,
    getWithdraw,
    updateLimited,
  };
});
