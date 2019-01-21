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

get_articles_list = (pair_str = '') => get('/articles' + pair_str),

get_feed_articles_list = (pair_str = '') => get('/articles/feed' + pair_str),

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

get_global_feed_page = pair_str => merge_reponses([
  get_articles_list(pair_str),
  get_tags_list()]),

get_personal_feed_page = pair_str => merge_reponses([
  get_feed_articles_list(pair_str),
  get_tags_list()]),

get_tag_feed_page = (tag_name, pair_str = '?') => merge_reponses([
  get_articles_list(pair_str + '&tag=' + tag_name),
  get_tags_list()]),

get_article_page = slug => merge_reponses([
  get_article(slug),
  get_comments_for_article(slug)]),

get_profile_page = username => merge_reponses([
  get_profile(username),
  get_articles_list('?author=' + username)]),

get_profile_favorites = username => merge_reponses([
  get_profile(username),
  get_articles_list('?favorited=' + username)])