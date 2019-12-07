import { auth } from '@/ts/plugins/firebase/index';

class Login {
  private root?: HTMLElement;
  private html: string;
  private isCreated: boolean;
  private handleSubmitBind: (e: Event) => void;

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
    if (this.root === null || this.root === void 0) return;

    (this.root.querySelector('form') as HTMLElement).addEventListener('submit', this.handleSubmitBind);
  }

  unbind() {
    if (this.root === null || this.root === void 0) return;

    (this.root.querySelector('form') as HTMLElement).removeEventListener('submit', this.handleSubmitBind);
  }

  handleSubmit(e: Event): void {
    e.preventDefault();
    const currentTarget = <HTMLElement>e.currentTarget;
    if (currentTarget === null) return;

    const email = (currentTarget.querySelector('input[type="email"]') as HTMLInputElement).value;
    const password = (currentTarget.querySelector('input[type="password"]') as HTMLInputElement).value;

    auth.signInWithEmailAndPassword(email, password).catch(() => {
      alert('違います。');
    });
  }

  create() {
    document.body.insertAdjacentHTML('beforeend', this.html);
    this.root = <HTMLElement>document.querySelector('#login');
    this.bind();
    this.isCreated = true;
  }

  destroy() {
    if (!this.isCreated) return;
    if (!(this.root === null || this.root === void 0)) {
      this.root.remove();
      this.unbind();
      this.isCreated = false;
    }
  }
}

export default new Login();
