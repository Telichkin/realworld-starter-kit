const

hash = () => window.location.hash,

on_hash_changed = fn => { window.addEventListener('hashchange', fn, false); fn() },

first_route_matched_hash = routes => routes.filter(([regex]) => regex.test(hash()))[0],

use_route = ([regex, fn]) => { const res = regex.exec(hash()); fn(res[1], res[2]) },

create_dispatch_hash = routes => () => use_route(first_route_matched_hash(routes)),

r = str => new RegExp(`^${str}\/?([^/]+)?/?$`),

set_url_param = (name, value) => window.location.hash = hash().split('?')[0] + `?${name}=${value}`,

fetch_and_do = (fetch_res, fn) => fetch_res.then(fn),

fetch_and_render = (fetch_fn, page_fn) => (...args) => fetch_and_do(fetch_fn(...args), render_page(page_fn, ...args)),

redirect_to_hash = hash_str => location.hash = hash_str,

redirect_to_home = () => redirect_to_hash('/'),

redirect_to_global_feed = () => redirect_to_hash('/global-feed'),

redirect_to_personal_feed = () => redirect_to_hash('/personal-feed'),

redirect_to_article = ({ article: { slug } }) => redirect_to_hash('/article/' + slug),

redirect_to_login = () => redirect_to_hash('/login'),

redirect_to_user = () => redirect_to_hash('/' + saved_username()),

redirect_to_editor = slug => redirect_to_hash('/editor/' + slug),

refresh_page = () => dispatch_hash(hash()),

resp_is_success = pair(json => !json.errors && !json.error),

resp_is_error = pair(json => !!json.errors || !!json.error)