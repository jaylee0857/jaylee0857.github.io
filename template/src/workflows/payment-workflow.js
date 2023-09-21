/**
 * 存取款相關的放這邊
 */
import { defineWorkflow } from "@/_app/_define";
import { createPassport } from "./common/core/passport";
import {
  exhaustOf,
  queueOf,
  whileOnceOf,
  throttleOf,
} from "./common/core/observers";
import { withPayload } from "./common/core/operators";

/** stores */
import { usePaymentStore } from "@/store/payment-store";

/** serviece */
import { useApiService } from "@/services/api-service";

/** workflows */
import { useListenerWorkflow } from "./common/listener-workflow";

export const usePaymentWorkflow = defineWorkflow("payment-workflow", () => {
  const paymentStore = usePaymentStore();
  const apiService = useApiService();
  const listenerWorkflow = useListenerWorkflow();

  /**
   * 出款請求
   * @property {String} accountId 出款帳號 id
   * @property {Number} amount 出款金額
   * @returns {Promise}
   */
  const createPostPaymentWithdrawPassport = () => {
    const passport = createPassport(
      "payment.postPaymentWithdraw",
      apiService.postPaymentWithdraw
      //
    ).pipe(
      withPayload()
      //
    );
    const observer = exhaustOf(passport);

    return (payload) => {
      passport.call("payload", {
        accountId: payload.accountId,
        amount: payload.amount,
      });
      return observer.excute();
    };
  };

  /**
   * 充提贈點-領獎
   * @returns {Promise}
   */
  const createPaymentReceivePassport = () => {
    const passport = createPassport(
      "payment.postPaymentReceive",
      apiService.postPaymentReceive
      //
    );
    const observer = exhaustOf(passport);

    return () => {
      return observer.excute();
    };
  };

  /**
   * 新增銀行卡
   * @property {?File} coverFile 存簿照片
   * @property {?File} userIdFile 證件封面圖片
   * @property {?File} selfieFile 手持證件照
   * @property {?String} name 存簿銀行名稱
   * @property {?String} numner 存簿銀行代碼
   * @property {String} owner 存簿持有人
   * @property {String} account 存簿帳號
   * @returns {Promise}
   */
  const createAddPaymentBankCardPassport = () => {
    const passport = createPassport(
      "payment.createPaymentBankCard",
      apiService.createPaymentBankCard
      //
    ).pipe(
      withPayload()
      //
    );
    const observer = exhaustOf(passport);

    return (payload) => {
      passport.call("payload", {
        coverFile: payload.coverFile, // 存簿照片
        userIdFile: payload.userIdFile, // 證件封面圖片
        selfieFile: payload.selfieFile, // 手持證件照
        bankName: payload.bankName, // 存簿銀行名稱
        bankNumber: payload.bankNumber, // 存簿銀行代碼
        owner: payload.owner, // 存簿持有人
        account: payload.account, // 存簿帳號
      });
      return observer.excute();
    };
  };

  /**
   * 編輯銀行卡
   * @property {?File} coverFile 存簿照片
   * @property {?File} userIdFile 證件封面圖片
   * @property {?File} selfieFile 手持證件照
   * @property {?String} name 存簿銀行名稱
   * @property {?String} numner 存簿銀行代碼
   * @property {String} owner 存簿持有人
   * @property {String} account 存簿帳號
   * @returns {Promise}
   */
  const createUpdatePaymentBankCardPassport = () => {
    const passport = createPassport(
      "payment.updatePaymentBankCard",
      apiService.updatePaymentBankCard
      //
    ).pipe(
      withPayload()
      //
    );
    const observer = exhaustOf(passport);

    return (payload) => {
      passport.call("payload", {
        id: payload.id,
        coverFile: payload.coverFile, // 存簿照片
        userIdFile: payload.userIdFile, // 證件封面圖片
        selfieFile: payload.selfieFile, // 手持證件照
        bankName: payload.bankName, // 存簿銀行名稱
        bankNumber: payload.bankNumber, // 存簿銀行代碼
        owner: payload.owner, // 存簿持有人
        account: payload.account, // 存簿帳號
      });
      return observer.excute();
    };
  };

  /**
   * 取得洗碼量
   * @desc 計算中會自動重送，五秒送一次
   * @returns {Promise}
   */
  const createGetWashAmountPassport = () => {
    const passport = createPassport(
      "payment.getWashAmount",
      async () => {
        const res = await paymentStore.getWashAmount();
        if (res.code === 1) {
          if (res.data.on_calculate === 1) {
            /**
             * 計算中就自動重送
             * 不加 await / return 不要佔線程
             */
            getWashAmount();
          }
        }
        return res;
      }
      //
    );
    const observer = queueOf(5000)(passport);

    return () => {
      return observer.excute();
    };
  };

  /**
   * 取得銀行列表
   * @returns {Promise}
   */
  const createGetBankListPassport = () => {
    const passport = createPassport(
      "payment.getBankList",
      paymentStore.getBankList
      //
    );
    const observer = whileOnceOf((response) => response.code === 1)(passport);

    return () => observer.excute();
  };

  /**
   * 取得帳戶
   * @returns {Promise}
   */
  const createGetBankbooksPassport = () => {
    const passport = createPassport(
      "payment.getBankbooks",
      paymentStore.getBankbooks
      //
    );
    const observer = throttleOf(3000)(passport);

    return () => observer.excute();
  };

  const initial = () => {
    listenerWorkflow.registerLoggedIn((isLoggedIn) => {
      if (!isLoggedIn) {
        /** 登出時重置 */
        paymentStore.$reset();
      }
    });
  };

  const postWithdraw = createPostPaymentWithdrawPassport();
  const postPaymentReceive = createPaymentReceivePassport();
  const addBankCard = createAddPaymentBankCardPassport();
  const updateBankCard = createUpdatePaymentBankCardPassport();
  const getWashAmount = createGetWashAmountPassport();
  const getBankList = createGetBankListPassport();
  const getBankbooks = createGetBankbooksPassport();

  return {
    initial,
    postWithdraw,
    postPaymentReceive,
    addBankCard,
    updateBankCard,
    getWashAmount,
    getBankList,
    getBankbooks,
  };
});
