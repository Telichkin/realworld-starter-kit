const

page_body = (user, rendered_page, page_name) => `
  ${user ? auth_navigation(user, page_name) : anon_navigation(page_name)}

  ${rendered_page}

  <footer>
    <div class="container">
      <a href="/#/" class="logo-font">conduit</a>
      <span class="attribution">
        An interactive learning project from <a href="https://thinkster.io">Thinkster</a>. Code &amp; design licensed under MIT.
      </span>
    </div>
  </footer>
`,

active_on_page = (name, current_name) => (('page_' + name) === current_name) ? 'active' : '',

anon_navigation = page_name => `
  <nav class="navbar navbar-light">
    <div class="container">
      <a class="navbar-brand" href="/#/">conduit</a>
      <ul class="nav navbar-nav pull-xs-right">
        <li class="nav-item">
          <a class="nav-link ${active_on_page('home', page_name)}" href="/#/">Home</a>
        </li>
        <li class="nav-item">
          <a class="nav-link ${active_on_page('login', page_name)}" href="/#/login">Sign in</a>
        </li>
        <li class="nav-item">
          <a class="nav-link ${active_on_page('register', page_name)}" href="/#/register">Sign up</a>
        </li>
      </ul>
    </div>
  </nav>
`,

auth_navigation = ({ user: { username = '' } }, page_name) => `
  <nav class="navbar navbar-light">
    <div class="container">
      <a class="navbar-brand" href="/#/">conduit</a>
      <ul class="nav navbar-nav pull-xs-right">
        <li class="nav-item">
          <a class="nav-link ${active_on_page('home', page_name)}" href="/#/">Home</a>
        </li>
        <li class="nav-item">
          <a class="nav-link ${active_on_page('editor', page_name)}" href="/#/editor"><i class="ion-compose"></i>New Post</a>
        </li>
        <li class="nav-item">
          <a class="nav-link ${active_on_page('settings', page_name)}" href="/#/settings"><i class="ion-gear-a"></i>Settings</a>
        </li>
        <li class="nav-item">
          <a class="nav-link ${active_on_page('profile', page_name)}" href="/#/${username}">${username}</a>
        </li>
      </ul>
    </div>
  </nav>
`