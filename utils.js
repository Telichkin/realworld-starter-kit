const

render_many = (arr, fn) => arr.map(fn).join('\n'),

date_to_str = date => new Date(date).toLocaleDateString('en-US', {
  weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
}),

empty_articles = () => `
  <div class="article-preview">No articles are here... yet.</div>
`,

merge = objects => Object.assign({}, ...objects),

add = (object, key, value) => merge([object, { [key]: value }]),

error_message = msg => `<li>${msg}</li>`,

flat_errors = errors => flat_arr(map_keys_and_values(errors, concat_with_each)),

map_keys_and_values = (object, fn) => Object.entries(object).map(([k, v]) => fn(k, v)),

concat_with_each = (prefix, postfixes_list) => postfixes_list.map(p => `${prefix} ${p}`),

flat_arr = nested => nested.reduce((res, arr) => res.concat(arr), []),

error_messages = errors => `
  <ul class="error-messages">
    ${render_many(flat_errors(errors), error_message)}
  </ul>
`,

saved_user = () => JSON.parse(localStorage.getItem('user')),

saved_username = () => saved_user() ? saved_user().user.username : ''

token = () => saved_user() ? saved_user().user.token : null,

save_user = user => localStorage.setItem('user', JSON.stringify(user)),

remove_user = () => localStorage.removeItem('user'),

case_of = (...pairs) => (...args) => { for (let [cond, fn] of pairs) { if (cond(...args)) return fn(...args) } }
