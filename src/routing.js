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