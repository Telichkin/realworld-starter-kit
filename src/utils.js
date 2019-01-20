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