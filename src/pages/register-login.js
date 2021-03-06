const

page_register = ({ user: { username = '', email = '' } = {}, errors = [] } = {}) => `
  <div class="auth-page">
    <div class="container page">
      <div class="row">

        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">Sign up</h1>
          <p class="text-xs-center">
            <a href="/#/login">Have an account?</a>
          </p>
          ${error_messages(errors)}
          <form>
            <fieldset class="form-group">
              <input value="${username}" name="username" class="form-control form-control-lg" type="text" placeholder="Your Name">
            </fieldset>
            <fieldset class="form-group">
              <input value="${email}" name="email" class="form-control form-control-lg" type="text" placeholder="Email">
            </fieldset>
            <fieldset class="form-group">
              <input name="password" class="form-control form-control-lg" type="password" placeholder="Password">
            </fieldset>
            <button type="button" id="register-button" class="btn btn-lg btn-primary pull-xs-right">
              Sign up
            </button>
          </form>
        </div>

      </div>
    </div>
  </div>
`,

page_login = ({ user: { email = '' } = {}, errors = [] } = {}) => `
  <div class="auth-page">
    <div class="container page">
      <div class="row">

        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">Sign In</h1>
          <p class="text-xs-center">
            <a href="/#/register">Need an account?</a>
          </p>
          ${error_messages(errors)}
          <form>
            <fieldset class="form-group">
              <input value="${email}" name="email" class="form-control form-control-lg" type="text" placeholder="Email">
            </fieldset>
            <fieldset class="form-group">
              <input name="password" class="form-control form-control-lg" type="password" placeholder="Password">
            </fieldset>
            <button type="button" id="login-button" class="btn btn-lg btn-primary pull-xs-right">
              Sign In
            </button>
          </form>
        </div>

      </div>
    </div>
  </div>
`