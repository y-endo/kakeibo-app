import { auth } from '@/js/plugins/firebase/index.js';

class Login {
  constructor() {
    this.html = `
      <div id="login">
        <section class="block-content">
          <form class="block-box u-pt-0">
            <table class="table-style-01">
              <colgroup class="u-w-30p"></colgroup>
              <colgroup class="u-w-70p"></colgroup>
              <tbody>
                <tr class="table-style-01_row">
                  <th class="table-style-01_head-lv1">Eメールアドレス</th>
                  <td class="table-style-01_data"><input required type="email" class="input" /></td>
                </tr>
                <tr class="table-style-01_row">
                  <th class="table-style-01_head-lv1">パスワード</th>
                  <td class="table-style-01_data"><input required type="password" class="input" /></td>
                </tr>
              </tbody>
            </table>
            <input type="submit" value="ログイン" class="input-submit" />
          </form>
        </section>
      </div>
    `;

    this.isCreated = false;

    this.handleSubmitBind = this.handleSubmit.bind(this);
  }

  bind() {
    this.root.querySelector('form').addEventListener('submit', this.handleSubmitBind);
  }

  unbind() {
    this.root.querySelector('form').removeEventListener('submit', this.handleSubmitBind);
  }

  handleSubmit(e) {
    e.preventDefault();
    const email = e.currentTarget.querySelector('input[type="email"]').value;
    const password = e.currentTarget.querySelector('input[type="password"]').value;

    auth.signInWithEmailAndPassword(email, password).catch(() => {
      alert('違います。');
    });
  }

  create() {
    document.body.insertAdjacentHTML('beforeend', this.html);
    this.root = document.querySelector('#login');
    this.bind();
    this.isCreated = true;
  }

  destroy() {
    if (!this.isCreated) return;
    this.root.remove();
    this.unbind();
    this.isCreated = false;
  }
}

export default new Login();
