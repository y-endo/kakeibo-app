<template>
  <form :id="id" class="block-box u-pt-0 u-pb-0 u-pos-r" @submit="handleSubmit">
    <module-loading :is-show="isLoading"></module-loading>
    <table class="table-style-01">
      <colgroup class="u-w-30p"></colgroup>
      <colgroup class="u-w-70p"></colgroup>
      <tbody>
        <tr class="table-style-01_row">
          <th class="table-style-01_head-lv1">
            金額
          </th>
          <td class="table-style-01_data">
            <input v-model="internalMoney" min="1" required type="number" placeholder="金額" class="input" />
          </td>
        </tr>
      </tbody>
    </table>
    <table class="table-style-01">
      <colgroup class="u-w-30p"></colgroup>
      <colgroup class="u-w-70p"></colgroup>
      <tbody>
        <tr class="table-style-01_row">
          <th class="table-style-01_head-lv1">
            大カテゴリー
          </th>
          <td class="table-style-01_data">
            <module-select v-model="internalCategory" :options="categoryOptions" @input="setCategory"></module-select>
          </td>
        </tr>
        <tr class="table-style-01_row">
          <th class="table-style-01_head-lv1">
            小カテゴリー
          </th>
          <td class="table-style-01_data">
            <module-select
              v-model="internalSubCategory"
              :options="subCategoryOptions"
              :disable="category.length === 0"
              @input="setSubCategory"
            ></module-select>
          </td>
        </tr>
      </tbody>
    </table>
    <table class="table-style-01">
      <colgroup class="u-w-30p"></colgroup>
      <colgroup class="u-w-70p"></colgroup>
      <tbody>
        <tr class="table-style-01_row">
          <th class="table-style-01_head-lv1">
            支払い方法
          </th>
          <td class="table-style-01_data">
            <module-select v-model="internalPayment" :options="paymentOptions" @input="setPayment"></module-select>
          </td>
        </tr>
      </tbody>
    </table>
    <table class="table-style-01">
      <colgroup class="u-w-30p"></colgroup>
      <colgroup class="u-w-70p"></colgroup>
      <tbody>
        <tr class="table-style-01_row">
          <th class="table-style-01_head-lv1">
            日付
          </th>
          <td class="table-style-01_data">
            <input v-model="internalDate" required type="date" class="input" min="2019-01-01" />
          </td>
        </tr>
      </tbody>
    </table>
    <table class="table-style-01">
      <colgroup class="u-w-30p"></colgroup>
      <colgroup class="u-w-70p"></colgroup>
      <tbody>
        <tr class="table-style-01_row">
          <th class="table-style-01_head-lv1">
            メモ
          </th>
          <td class="table-style-01_data">
            <textarea v-model="internalMemo" placeholder="メモ" class="textarea"></textarea>
          </td>
        </tr>
      </tbody>
    </table>
    <table class="table-style-01">
      <colgroup class="u-w-30p"></colgroup>
      <colgroup class="u-w-70p"></colgroup>
      <tbody>
        <tr class="table-style-01_row">
          <th class="table-style-01_head-lv1">
            利用者
          </th>
          <td class="table-style-01_data">
            <module-select v-model="internalUser" :options="userOptions" @input="setUser"></module-select>
          </td>
        </tr>
      </tbody>
    </table>
    <input type="submit" value="登録" class="input-submit" />
    <div v-if="hasDelete" class="input-submit input-submit-caution" @click="deleteData">
      削除
    </div>
  </form>
</template>

<script>
import moment from 'moment';
import DataManager from '@/js/plugins/DataManager/index.js';
import ModuleSelect from '@/js/components/modules/Select.vue';
import ModuleLoading from '@/js/components/modules/Loading.vue';
import categoryProps from '@/js/config/categoryProps.json';
import Store from '@/js/Store/index.js';

export default {
  name: 'ModuleInputForm',
  components: {
    ModuleSelect,
    ModuleLoading
  },
  props: {
    id: {
      type: String,
      default: () => ''
    },
    money: {
      type: Number,
      default: () => 0
    },
    category: {
      type: Array,
      default: () => []
    },
    subCategory: {
      type: Array,
      default: () => []
    },
    payment: {
      type: Array,
      default: () => []
    },
    date: {
      type: String,
      default: () => moment().format('YYYY-MM-DD')
    },
    memo: {
      type: String,
      default: () => ''
    },
    user: {
      type: Array,
      default: () => []
    },
    isEdit: {
      type: Boolean,
      default: () => false
    },
    isWatchEnable: {
      type: Boolean,
      default: () => true
    },
    hasDelete: {
      type: Boolean,
      default: () => false
    }
  },
  data: function() {
    return {
      categoryOptions: categoryProps.main,
      paymentOptions: ['現金', 'クレジットカード', '振込', 'ポイント', 'ICカード', 'ギフト'],
      userOptions: ['勇気', '友恵', '生真'],
      isLoading: false
    };
  },
  computed: {
    internalMoney: {
      get() {
        return this.money;
      },
      set(newValue) {
        if (this.money !== newValue) this.$emit('input-money', parseInt(newValue, 10));
      }
    },
    internalCategory: {
      get() {
        return this.category;
      },
      set(newValue) {
        if (this.category !== newValue) this.$emit('input-category', newValue);
      }
    },
    internalSubCategory: {
      get() {
        return this.subCategory;
      },
      set(newValue) {
        if (this.subCategory !== newValue) this.$emit('input-sub-category', newValue);
      }
    },
    internalPayment: {
      get() {
        return this.payment;
      },
      set(newValue) {
        if (this.payment !== newValue) this.$emit('input-payment', newValue);
      }
    },
    internalDate: {
      get() {
        return this.date;
      },
      set(newValue) {
        if (this.date !== newValue) this.$emit('input-date', newValue);
      }
    },
    internalMemo: {
      get() {
        return this.memo;
      },
      set(newValue) {
        if (this.memo !== newValue) this.$emit('input-memo', newValue);
      }
    },
    internalUser: {
      get() {
        return this.user;
      },
      set(newValue) {
        if (this.user !== newValue) this.$emit('input-user', newValue);
      }
    },
    subCategoryOptions: function() {
      return this.category.length === 0 ? [] : categoryProps.sub[this.category[0]];
    }
  },
  watch: {
    internalCategory: function() {
      if (!this.isWatchEnable) return;
      this.internalSubCategory = [];
    }
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault();

      this.isLoading = true;

      if (this.isEdit) {
        this.updateData();
      } else {
        this.addData();
      }
    },
    addData() {
      // 新規データ登録
      DataManager.register
        .add({
          money: parseInt(this.money, 10),
          category: this.category[0],
          subCategory: this.subCategory[0],
          payment: this.payment[0],
          date: this.date,
          user: this.user[0],
          memo: this.memo,
          sign: this.category[0] === '支出' ? 'minus' : 'plus',
          pubDate: new Date().getTime(),
          lastEditor: Store.state.loginUser
        })
        .then(() => {
          Store.setMessageText('登録しました');
          Store.setMessageType('');
          Store.setIsMessageShow(true);
          this.isLoading = false;

          // ホーム画面更新
          if (this.category[0] === '支出') {
            DataManager.updater.updateHomeData({
              money: parseInt(this.money, 10),
              payment: this.payment[0],
              date: this.date,
              user: this.user[0]
            });
          }

          this.internalMoney = '';
          this.internalCategory = [];
          this.internalSubCategory = [];
          this.internalPayment = [];
          this.internalMemo = '';
        })
        .catch(error => {
          Store.setMessageText('エラー: 登録に失敗しました');
          Store.setMessageType('error');
          Store.setIsMessageShow(true);
          this.isLoading = false;
          console.error(error);
        });

      this.$el.querySelectorAll('.select_option-list-item').forEach(element => {
        element.classList.remove('select_option-list-item--selected');
      });
    },
    async updateData() {
      // 更新対象のデータを取得
      const data = await DataManager.reader.getDocument(this.id).catch(error => {
        Store.setMessageText('エラー: データの読み込みに失敗しました。');
        Store.setMessageType('error');
        Store.setIsMessageShow(true);
        this.isLoading = false;
        console.error(error);
        return error;
      });

      if (!data) return;

      // データの更新
      await DataManager.updater
        .update(this.id, {
          money: parseInt(this.money, 10),
          category: this.category[0],
          subCategory: this.subCategory[0],
          payment: this.payment[0],
          date: this.date,
          user: this.user[0],
          memo: this.memo,
          sign: this.category[0] === '支出' ? 'minus' : 'plus',
          pubDate: new Date().getTime(),
          lastEditor: Store.state.loginUser
        })
        .then(() => {
          Store.setMessageText('更新内容を登録しました');
          Store.setMessageType('');
          Store.setIsMessageShow(true);
          this.isLoading = false;
        })
        .catch(error => {
          Store.setMessageText('エラー: 更新内容の登録に失敗しました');
          Store.setMessageType('error');
          Store.setIsMessageShow(true);
          this.isLoading = false;
          console.error(error);
        });

      // ホーム画面更新
      if (data.user !== this.user[0]) {
        // 利用者が変わった場合
        if (data.category === '支出') {
          // 元のデータが支出の場合
          if (this.category[0] === '支出') {
            // 変更後の大カテゴリが支出のまま
            await DataManager.updater.updateHomeData({
              money: -parseInt(data.money, 10),
              payment: data.payment,
              date: data.date,
              user: data.user
            });

            DataManager.updater.updateHomeData({
              money: parseInt(this.money, 10),
              payment: this.payment[0],
              date: this.date,
              user: this.user[0]
            });
          } else {
            // 変更後の大カテゴリが支出以外に変わった
            DataManager.updater.updateHomeData({
              money: -parseInt(data.money, 10),
              payment: data.payment,
              date: data.date,
              user: data.user
            });
          }
        } else {
          // 元のデータが支出以外の場合
          if (this.category[0] === '支出') {
            // 変更後の大カテゴリが支出に変わった
            DataManager.updater.updateHomeData({
              money: parseInt(this.money, 10),
              payment: this.payment[0],
              date: this.date,
              user: this.user[0]
            });
          }
        }
      } else {
        // 利用者は変わらずのままの場合
        let calcMoney = 0;
        if (data.category === '支出') {
          // 元のデータが支出の場合
          if (this.category[0] === '支出') {
            // 元も変更後も支出の場合は、差分の金額を計算
            calcMoney = parseInt(this.money, 10) - data.money;
          } else {
            // 変更後が支出以外の場合は、元の金額を減算
            calcMoney = -parseInt(this.money, 10);
          }
        } else {
          // 元のデータが支出以外の場合
          if (this.category[0] === '支出') {
            calcMoney = parseInt(this.money, 10);
          } else {
            // 元のデータが支出以外のデータで、変更後も支出以外であればスルー
            return;
          }
        }

        DataManager.updater.updateHomeData({
          money: calcMoney,
          payment: this.payment[0],
          date: this.date,
          user: this.user[0]
        });
      }
    },
    deleteData() {
      this.isLoading = true;

      DataManager.register
        .delete(this.$el.id)
        .then(() => {
          Store.setMessageText('削除しました');
          Store.setMessageType('');
          Store.setIsMessageShow(true);
          Store.setIsModalOpen(false);
          this.isLoading = false;

          // ホーム画面更新
          if (this.category[0] === '支出') {
            DataManager.updater.updateHomeData({
              money: -parseInt(this.money, 10),
              payment: this.payment[0],
              date: this.date,
              user: this.user[0]
            });
          }
        })
        .catch(() => {
          Store.setMessageText('エラー: 削除に失敗しました');
          Store.setMessageType('error');
          Store.setIsMessageShow(true);
          Store.setIsModalOpen(false);
          this.isLoading = false;
        });
    },
    setCategory(value) {
      this.internalCategory = value;
    },
    setSubCategory(value) {
      this.internalSubCategory = value;
    },
    setPayment(value) {
      this.internalPayment = value;
    },
    setUser(value) {
      this.internalUser = value;
    }
  }
};
</script>
