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

create_article = article_json => post('/articles', { article: article_json }),

favorite_article = slug => post(`/articles/${slug}/favorite`),

unfavorite_article = slug => del(`/articles/${slug}/favorite`),

delete_article = slug => del(`/articles/${slug}`),

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