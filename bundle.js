const
// ~~~ Primitives ~~~
merge = objects => Object.assign({}, ...objects),
add = (object, key, value) => merge([object, { [key]: value }]),
map_keys_and_values = (object, fn) => Object.entries(object).map(([k, v]) => fn(k, v)),
concat_with_each = (prefix, postfixes_list) => postfixes_list.map(p => `${prefix} ${p}`),
flat_arr = nested => nested.reduce((res, arr) => res.concat(arr), []),
case_of = (...pairs) => (...args) => { for (let [cond, fn] of pairs) { if (cond(...args)) return fn(...args) } },
pair = bool_fn => fn => ([bool_fn, fn]),
and = (...pair_creators) =>
  pair((...args) => pair_creators.every(c => c()[0](...args))),
// ~~~ Render ~~~
render_many = (arr, fn) => arr.map(fn).join('\n'),
render_page = page => json => document.body.innerHTML = page_body(saved_user(), page(json), page.name),
render_page_with_context = (page, context) => json => render_page(page)(merge([json, context])),
date_to_str = date => new Date(date).toLocaleDateString('en-US', {
  weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
}),
empty_articles = () => `
  <div class="article-preview">No articles are here... yet.</div>
`,
error_message = msg => `<li>${msg}</li>`,
flat_errors = errors => flat_arr(map_keys_and_values(errors, concat_with_each)),
error_messages = errors => `
  <ul class="error-messages">
    ${render_many(flat_errors(errors), error_message)}
  </ul>
`,
// ~~~ DOM ~~~
$ = selector => document.querySelector(selector),
$all = selector => document.querySelectorAll(selector),
$form_to_json = selector => Array.from($all(`${selector} [name]`)).reduce((json, i) => add(json, i.name, i.value || null), {}),
elem_is_match = selector => pair(e => e.target.matches(selector)),
elem_is_include = selector => pair(e => e.target.matches(`${selector} *`)),
prevent = fn => e => { e.preventDefault(); fn(e) },
use_this_elem = fn => prevent(e => fn(e.target)),
use_parent_elem = (selector, fn) => prevent(e => fn(e.target.closest(selector))),
on = (event, selector, fn) => document.addEventListener(event,
  case_of(
    elem_is_match(selector)(use_this_elem(fn)),
    elem_is_include(selector)(use_parent_elem(selector, fn))), true),
on_click = (selector, fn) => on('click', selector, fn),
// ~~~ User ~~~
saved_user = () => JSON.parse(localStorage.getItem('user')),
saved_username = () => saved_user() ? saved_user().user.username : ''
token = () => saved_user() ? saved_user().user.token : null,
save_user = user => localStorage.setItem('user', JSON.stringify(user)),
remove_user = () => localStorage.removeItem('user'),
authenticate_user = user => { save_user(user); redirect_to_home() },
update_user = user => { save_user(user); redirect_to_user() },
logout = () => { remove_user(); redirect_to_home() },
user_is_anon = pair(() => !saved_user()),
user_is_auth = pair(() => saved_user()),
user_is_author = pair(({ article: { author: { username } } = {} } = {}) =>
  saved_username() === username)
const
BASE_URL = 'https://conduit.productionready.io/api',
headers = () => merge([
  { 'Content-Type': 'application/json; charset=utf-8', },
  token() ? { 'Authorization': `Token ${token()}` } : {},
]),
fetch_config = (method, json) => merge([
  { method, headers: headers() },
  json ? { body: JSON.stringify(json) } : {},
]),
resp_to_json = resp => resp.text().then(t => JSON.parse(t)).catch(t => ({ errors: { text: t } })),
request = (uri, config) => fetch(BASE_URL + uri, config).then(resp_to_json, resp_to_json),
get = uri => request(uri, fetch_config('GET')),
post = (uri, json) => request(uri, fetch_config('POST', json)),
del = uri => request(uri, fetch_config('DELETE')),
put = (uri, json) => request(uri, fetch_config('PUT', json)),
pair_to_str = ([key, value]) => (key && value) ? `?${key}=${value}` : '',
in_parallel = requests => Promise.all(requests),
merge_reponses = requests => in_parallel(requests).then(merge),
get_articles_list = (filter_pair = []) => get('/articles' + pair_to_str(filter_pair)),
get_tags_list = () => get('/tags'),
get_article = slug => get('/articles/' + slug),
get_comments_for_article = slug => get(`/articles/${slug}/comments`),
get_profile = username => get('/profiles/' + username),
get_user = () => get('/user'),
register_user = user_json => post('/users', { user: user_json }),
login_user = user_json => post('/users/login', { user: user_json }),
edit_user = user_json => put('/user', { user: user_json }),
create_article = article_json => post('/articles', { article: article_json }),
edit_article = (slug, article_json) => put('/articles/' + slug, { article: article_json }),
favorite_article = slug => post(`/articles/${slug}/favorite`),
unfavorite_article = slug => del(`/articles/${slug}/favorite`),
delete_article = slug => del(`/articles/${slug}`),
add_comment = (slug, comment_json) => post(`/articles/${slug}/comments`, { comment: comment_json }),
follow_user = username => post(`/profiles/${username}/follow`),
unfollow_user = username => del(`/profiles/${username}/follow`),
get_home_page = filter_pair => merge_reponses([
  get_articles_list(filter_pair),
  get_tags_list()]),
get_article_page = slug => merge_reponses([
  get_article(slug),
  get_comments_for_article(slug)]),
get_profile_page = username => merge_reponses([
  get_profile(username),
  get_articles_list(['author', username])]),
get_profile_favorites = username => merge_reponses([
  get_profile(username),
  get_articles_list(['favorited', username])])
const
page_article_template = is_author => ({ article, comments }) => `
  <div class="article-page">
    <div class="banner">
      <div class="container">
        <h1>${article.title}</h1>
        ${is_author ? article_meta_author(article) : article_meta(article)}
      </div>
    </div>
    <div class="container page">
      <div class="row article-content">
        <div class="col-md-12">
          ${article.body}
        </div>
      </div>
      <hr />
      <div class="article-actions">
        ${is_author ? article_meta_author(article) : article_meta(article)}
      </div>
      <div class="row">
        <div class="col-xs-12 col-md-8 offset-md-2">
          <form class="card comment-form">
            <div class="card-block">
              <textarea name="body" class="form-control" placeholder="Write a comment..." rows="3"></textarea>
            </div>
            <div class="card-footer">
              <img src="http://i.imgur.com/Qr71crq.jpg" class="comment-author-img" />
              <button id="add-comment" data-slug="${article.slug}" class="btn btn-sm btn-primary">Post Comment</button>
            </div>
          </form>
          ${render_many(comments, article_comment)}
        </div>
      </div>
    </div>
  </div>
`,
article_comment = ({ body, updatedAt, author: { username, image } }) => `
  <div class="card">
    <div class="card-block">
      <p class="card-text">${body}</p>
    </div>
    <div class="card-footer">
      <a href="/#/${username}" class="comment-author">
        <img src="${image}" class="comment-author-img" />
      </a>
      &nbsp;
      <a href="/#/${username}" class="comment-author">${username}</a>
      <span class="date-posted">${date_to_str(updatedAt)}</span>
    </div>
  </div>
`,
article_meta = ({ slug, updatedAt, favorited, favoritesCount, author: { username, image, following } }) => `
  <div class="article-meta">
    <a href="/#/${username}"><img src="${image}" /></a>
    <div class="info">
      <a href="/#/${username}" class="author">${username}</a>
      <span class="date">${date_to_str(updatedAt)}</span>
    </div>
    ${following ? unfollow_button({ username }) : follow_button({ username })}
    &nbsp;&nbsp;
    ${favorited ? unfavorite_button({ slug, favoritesCount }) : favorite_button({ slug, favoritesCount })}
  </div>
`,
article_meta_author = ({ slug, updatedAt, author: { username, image } }) => `
  <div class="article-meta">
    <a href="/#/${username}"><img src="${image}" /></a>
    <div class="info">
      <a href="/#/${username}" class="author">${username}</a>
      <span class="date">${date_to_str(updatedAt)}</span>
    </div>
    <button id="edit-button" data-slug="${slug}" class="btn btn-sm btn-outline-secondary">
      <i class="ion-edit"></i>
      &nbsp;
      Edit Article
    </button>
    <button id="delete-button" data-slug="${slug}" class="btn btn-sm btn-outline-danger">
      <i class="ion-trash-a"></i>
      &nbsp;
      Delete Article
    </button>
    &nbsp;&nbsp;
  </div>
`,
favorite_button = ({ slug, favoritesCount }) => `
  <button data-slug="${slug}" class="favorite-button btn btn-sm btn-outline-primary">
    <i class="ion-heart"></i>
    &nbsp;
    Favorite Article <span class="counter">(${favoritesCount})</span>
  </button>
`,
unfavorite_button = ({ slug, favoritesCount }) => `
  <button data-slug="${slug}" class="unfavorite-button btn btn-sm btn-primary">
    <i class="ion-heart"></i>
    &nbsp;
    Unfavorite Article<span class="counter">(${favoritesCount})</span>
  </button>
`,
follow_button = ({ username }) => `
  <button id="follow-user" class="btn btn-sm btn-outline-secondary" data-username="${username}">
    <i class="ion-plus-round"></i>&nbsp; Follow ${username}
  </button>
`,
unfollow_button = ({ username }) => `
  <button id="unfollow-user" class="btn btn-sm btn-secondary" data-username="${username}">
    <i class="ion-plus-round"></i>&nbsp; Unfollow ${username}
  </button>
`,
page_article = page_article_template(false),
page_article_author = page_article_template(true)
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
          <a class="nav-link ${active_on_page('editor', page_name)}" href="/#/editor"><i class="ion-compose"></i>&nbsp;New Post</a>
        </li>
        <li class="nav-item">
          <a class="nav-link ${active_on_page('settings', page_name)}" href="/#/settings"><i class="ion-gear-a"></i>&nbsp;Settings</a>
        </li>
        <li class="nav-item">
          <a class="nav-link ${active_on_page('profile', page_name)}" href="/#/${username}">${username}</a>
        </li>
      </ul>
    </div>
  </nav>
`
const
page_editor = ({ article: { slug = '', title = '', description = '', body = '', tagList = [] } = {}, errors = [] } = {}) => `
  <div class="editor-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-10 offset-md-1 col-xs-12">
          ${error_messages(errors)}
          <form>
            <fieldset>
              <fieldset class="form-group">
                  <input name="title" value="${title}" type="text" class="form-control form-control-lg" placeholder="Article Title">
              </fieldset>
              <fieldset class="form-group">
                  <input name="description" value="${description}" type="text" class="form-control" placeholder="What's this article about?">
              </fieldset>
              <fieldset class="form-group">
                  <textarea name="body" class="form-control" rows="8" placeholder="Write your article (in markdown)">${body}</textarea>
              </fieldset>
              <fieldset class="form-group">
                  <input name="tagList" value="${tag_list_to_str(tagList)}" type="text" class="form-control" placeholder="Enter tags"><div class="tag-list"></div>
              </fieldset>
              <button type="button" data-slug="${slug}" id="${slug ? 'edit-article' : 'publish-article'}" class="btn btn-lg pull-xs-right btn-primary">
                  Publish Article
              </button>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  </div>
`,
tag_list_to_str = tag_list => tag_list.join ? tag_list.join(' ') : tag_list
const
page_home = ({ articles, tags, articlesCount }) => `
  <div class="home-page">
    <div class="banner">
      <div class="container">
        <h1 class="logo-font">conduit</h1>
        <p>A place to share your knowledge.</p>
      </div>
    </div>
    <div class="container page">
      <div class="row">
        <div class="col-md-9">
          <div class="feed-toggle">
            <ul class="nav nav-pills outline-active">
              <li class="nav-item">
                <a class="nav-link disabled" href="">Your Feed</a>
              </li>
              <li class="nav-item">
                <a class="nav-link active" href="">Global Feed</a>
              </li>
            </ul>
          </div>
          ${render_many(articles, article_preview) || empty_articles()}
          <nav>
            <ul class="pagination">
              ${render_many_times(number_of_pages(articlesCount), pagination_link)}
            </ul>
          </nav>
        </div>
        <div class="col-md-3">
          <div class="sidebar">
            <p>Popular Tags</p>
            <div class="tag-list">
              ${render_many(tags, popular_tag)}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  `,
article_preview = ({ title, slug, description, favoritesCount, favorited, updatedAt, author: { image, username }}) => `
  <div class="article-preview">
    <div class="article-meta">
      <a href="/#/${username}"><img src="${image}" /></a>
      <div class="info">
        <a href="/#/${username}" class="author">${username}</a>
        <span class="date">${date_to_str(updatedAt)}</span>
      </div>
      ${favorited
          ? unfavorite_small_button({ slug, favoritesCount })
          : favorite_small_button({ slug, favoritesCount })}
    </div>
    <a href="/#/article/${slug}" class="preview-link">
      <h1>${title}</h1>
      <p>${description}</p>
      <span>Read more...</span>
    </a>
  </div>
`,
popular_tag = name => `<a href="#" class="tag-pill tag-default">${name}</a>`,
pagination_link = number => `
  <li class="page-item">
    <a class="page-link" data-offset="${page_offset(number)}" href="#">
      ${number}
    </a>
  </li>
`,
render_many_times = (number, fn) => render_many(Array(number).fill(0).map((_, i) => i + 1), fn),
number_of_pages = total_articles_number => Math.ceil(total_articles_number / 20),
page_offset = number => (number - 1) * 20,
favorite_small_button = ({ slug, favoritesCount }) => `
  <button data-slug="${slug}" class="btn btn-outline-primary btn-sm pull-xs-right favorite-button">
    <i class="ion-heart"></i> ${favoritesCount}
  </button>
`,
unfavorite_small_button = ({ slug, favoritesCount }) => `
<button data-slug="${slug}" class="btn btn-primary btn-sm pull-xs-right unfavorite-button">
    <i class="ion-heart"></i> ${favoritesCount}
  </button>
`
const
page_not_found = () => `
  <h2>404</h2>
  <p>Page not found</p>
`
const 
profile_template = ({ profile: { username, bio, image }, articles }, favorites_selected) => `
  <div class="profile-page">
    <div class="user-info">
      <div class="container">
        <div class="row">
          <div class="col-xs-12 col-md-10 offset-md-1">
            <img src="${image}" class="user-img" />
            <h4>${username}</h4>
            <p>
              ${bio || ''}
            </p>
            <button class="btn btn-sm btn-outline-secondary action-btn">
              <i class="ion-plus-round"></i>
              &nbsp;
              Follow ${username} 
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="container">
      <div class="row">
        <div class="col-xs-12 col-md-10 offset-md-1">
          <div class="articles-toggle">
            <ul class="nav nav-pills outline-active">
              <li class="nav-item">
                <a class="nav-link ${favorites_selected ? '' : 'active'}" href="/#/${username}">My Articles</a>
              </li>
              <li class="nav-item">
                <a class="nav-link ${favorites_selected ? 'active' : ''}" href="/#/${username}/favorites">Favorited Articles</a>
              </li>
            </ul>
          </div>
          ${render_many(articles, article_preview) || empty_articles()}
        </div>
      </div>
    </div>
  </div>
`
page_profile = json => profile_template(json, false),
page_profile_favorites = json => profile_template(json, true)
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
const
page_settings = ({ user: { username, email, bio, image } }) => `
  <div class="settings-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">Your Settings</h1>
          <form>
            <fieldset>
                <fieldset class="form-group">
                  <input name="image" value="${image || ''}" class="form-control" type="text" placeholder="URL of profile picture">
                </fieldset>
                <fieldset class="form-group">
                  <input name="username" value="${username}" class="form-control form-control-lg" type="text" placeholder="Your Name">
                </fieldset>
                <fieldset class="form-group">
                  <textarea name="bio" value="${bio}" class="form-control form-control-lg" rows="8" placeholder="Short bio about you"></textarea>
                </fieldset>
                <fieldset class="form-group">
                  <input name="email" value="${email}" class="form-control form-control-lg" type="text" placeholder="Email">
                </fieldset>
                <fieldset class="form-group">
                  <input class="form-control form-control-lg" type="password" placeholder="Password">
                </fieldset>
                <button type="button" id="edit-user-button" class="btn btn-lg btn-primary pull-xs-right">
                  Update Settings
                </button>
            </fieldset>
          </form>
          <hr>
          <button id="logout-button" class="btn btn-outline-danger">Or click here to logout.</button>
        </div>
      </div>
    </div>
  </div>
`
const
hash = () => window.location.hash,
on_hash_changed = fn => { window.addEventListener('hashchange', fn, false); fn() },
first_route_matched_hash = routes => routes.filter(([regex]) => regex.test(hash()))[0],
use_route = ([regex, fn]) => fn(regex.exec(hash())[1]),
create_dispatch_hash = routes => () => use_route(first_route_matched_hash(routes)),
r = str => new RegExp(`^${str}/?$`),
fetch_and_do = (fetch_res, fn) => fetch_res.then(fn),
fetch_and_render = (fetch_fn, page_fn) => (...args) => fetch_and_do(fetch_fn(...args), render_page(page_fn)),
render_home = fetch_and_render(get_home_page, page_home),
redirect_to_hash = hash_str => location.hash = hash_str,
redirect_to_home = () => redirect_to_hash('/'),
redirect_to_article = ({ article: { slug } }) => redirect_to_hash('/article/' + slug),
redirect_to_login = () => redirect_to_hash('/login'),
redirect_to_user = () => redirect_to_hash('/' + saved_username()),
redirect_to_editor = slug => redirect_to_hash('/editor/' + slug),
refresh_page = () => dispatch_hash(hash()),
resp_is_success = pair(json => !json.errors && !json.error),
resp_is_error = pair(json => !!json.errors || !!json.error)
const dispatch_hash = create_dispatch_hash([
  [
    r('#/login'),
    case_of(
      user_is_anon(render_page(page_login)),
      user_is_auth(redirect_to_user))
  ], [
    r('#/register'),
    case_of(
      user_is_anon(render_page(page_register)),
      user_is_auth(redirect_to_user))
  ], [
    r('#/settings'),
    case_of(
      user_is_anon(render_page(page_not_found)),
      user_is_auth(fetch_and_render(get_user, page_settings)))
  ], [
    r('#/editor'),
    case_of(
      user_is_anon(render_page(page_not_found)),
      user_is_auth(render_page(page_editor)))
  ], [
    r('#/editor/([^/]+)'),
    case_of(
      user_is_anon(render_page(page_not_found)),
      user_is_auth(fetch_and_render(get_article, page_editor)))
  ], [
    r('#/article/([^/]+)'),
    fetch_and_render(get_article_page, case_of(
      and(resp_is_success, user_is_author)(page_article_author),
      resp_is_success(page_article),
      resp_is_error(page_not_found)))
  ], [
    r('#/([^/]+)/favorites'),
    fetch_and_render(get_profile_favorites, case_of(
      resp_is_success(page_profile_favorites),
      resp_is_error(page_not_found)))
  ], [
    r('#/([^/]+)'),
    fetch_and_render(get_profile_page, case_of(
      resp_is_success(page_profile),
      resp_is_error(page_not_found)))
  ], [
    r('$|^#'),
    render_home
  ], [
    r('.+'),
    render_page(page_not_found)
  ],
])
on_click('.tag-pill', tag => render_home(['tag', tag.innerText]))
on_click('.page-link', link => render_home(['offset', link.dataset.offset]))
on_click('#register-button', () => fetch_and_do(
  register_user($form_to_json('form')),
  case_of(
    resp_is_success(authenticate_user),
    resp_is_error(render_page_with_context(page_register, { user: $form_to_json('form') })))))
on_click('#login-button', () => fetch_and_do(
  login_user($form_to_json('form')),
  case_of(
    resp_is_success(authenticate_user),
    resp_is_error(render_page_with_context(page_login, { user: $form_to_json('form') })))))
on_click('#edit-user-button', () => fetch_and_do(
    edit_user($form_to_json('form')),
    case_of(
      resp_is_success(update_user),
      resp_is_error(render_page_with_context(page_settings, { user: $form_to_json('form') })))))
on_click('#publish-article', () => fetch_and_do(
  create_article($form_to_json('form')),
  case_of(
    resp_is_success(redirect_to_article),
    resp_is_error(render_page_with_context(page_editor, { article: $form_to_json('form') })))))
on_click('#edit-article', button => fetch_and_do(
    edit_article(button.dataset.slug, $form_to_json('form')),
    case_of(
      resp_is_success(redirect_to_article),
      resp_is_error(render_page_with_context(page_editor, { article: $form_to_json('form') })))))
on_click('#logout-button', logout)
on_click('.favorite-button', button => fetch_and_do(
  favorite_article(button.dataset.slug),
  case_of(
    resp_is_success(refresh_page),
    resp_is_error(redirect_to_login))))
on_click('.unfavorite-button', button => fetch_and_do(
  unfavorite_article(button.dataset.slug),
  case_of(
    resp_is_success(refresh_page),
    resp_is_error(redirect_to_login))))
on_click('#edit-button', button => redirect_to_editor(button.dataset.slug))
on_click('#delete-button', button => fetch_and_do(
  delete_article(button.dataset.slug),
  redirect_to_home))
on_click('#add-comment', button => fetch_and_do(
  add_comment(button.dataset.slug, $form_to_json('form')),
  refresh_page))
on_click('#follow-user', button => fetch_and_do(
  follow_user(button.dataset.username),
  refresh_page))
on_click('#unfollow-user', button => fetch_and_do(
  unfollow_user(button.dataset.username),
  refresh_page))
on_hash_changed(dispatch_hash)
