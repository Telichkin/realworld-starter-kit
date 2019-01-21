const

page_home_template = tabs => ({ articles, tags, articlesCount }, ...url_args) => `
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
            ${tabs(url_args[0])}
          </ul>
        </div>

        ${render_many(articles, article_preview) || empty_articles()}

        <nav>
          <ul class="pagination">
            ${number_of_pages(articlesCount) > 1 
              ? render_many_times(
                  number_of_pages(articlesCount), 
                  pagination_link(url_param_str_2_offset(url_args[1] || url_args[0])))
              : ''}
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

home_tabs_global_feed = () => `
  <li class="nav-item">
    <a class="nav-link" href="/#/personal-feed">Your Feed</a>
  </li>
  <li class="nav-item">
    <a class="nav-link active" href="/#/global-feed">Global Feed</a>
  </li>
`,

home_tabs_personal_feed = () => `
  <li class="nav-item">
    <a class="nav-link active" href="/#/personal-feed">Your Feed</a>
  </li>
  <li class="nav-item">
    <a class="nav-link" href="/#/global-feed">Global Feed</a>
  </li>
`,

home_tabs_tag_feed = tag_name => `
  <li class="nav-item">
    <a class="nav-link" href="/#/personal-feed">Your Feed</a>
  </li>
  <li class="nav-item">
    <a class="nav-link" href="/#/global-feed">Global Feed</a>
  </li>
  <li class="nav-item">
    <a class="nav-link active" href="/#/tags/${tag_name}"># ${tag_name}</a>
  </li>
`,

page_global_feed = page_home_template(home_tabs_global_feed),

page_personal_feed = page_home_template(home_tabs_personal_feed),

page_tag_feed = page_home_template(home_tabs_tag_feed),

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

popular_tag = name => `<a href="#/tags/${name}" class="tag-pill tag-default">${name}</a>`,

pagination_link = active_offset => number => `
  <li class="page-item ${active_offset === page_offset(number) ? 'active' : ''}">
    <a class="page-link" data-offset="${page_offset(number)}" href="#">
      ${number}
    </a>
  </li>
`,

render_many_times = (number, fn) => render_many(Array(number).fill(0).map((_, i) => i + 1), fn),

number_of_pages = total_articles_number => Math.ceil(total_articles_number / 20),

page_offset = number => (number - 1) * 20,

url_param_str_2_offset = (str = '') => Number((str.match('offset=([0-9]+)') || [null, 0])[1]),

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